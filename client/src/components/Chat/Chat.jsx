import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import { apiURL } from '../../utils';
import './chat.css';
import { Button } from '@mui/material';

const ENDPOINT = apiURL;

let socket;

const Chat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [threadId, setThreadId] = useState('');
  const [mode, setMode] = useState();

  useEffect(() => {
    socket = io(ENDPOINT);

    // Listen for the 'userId' event from the backend
    socket.on('userId', ({ userId }) => {
      setName(userId);
    });

    // Listen for user messages from the backend
    socket.on('userMessage', (data) => {
      if (data.threadId === threadId && data.message && data.userId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [threadId]);

  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        const response = await fetch(
          `${apiURL}/api/wa/thread?threadId=${selectedUser._id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const thread = await response.json();
        setMode(thread.mode);
      } catch (error) {
        console.error('Error fetching thread:', error);
      }
    };

    fetchThreadData();
  }, [selectedUser]);

  useEffect(() => {
    const fetchMessagesAndMarkSeen = async () => {
      if (selectedUser) {
        setUserId(selectedUser.userId);
        setThreadId(selectedUser._id);
        setMessage('');
        try {
          const response = await fetch(
            `${apiURL}/api/wa/messages?threadId=${selectedUser._id}`
          );
          const { messages, aiResponses } = await response.json();
          const allMessages = [...messages, ...aiResponses].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setMessages(allMessages);
          setMessage(aiResponses[aiResponses.length - 1]?.response);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }

        if (mode === 'automatic') {
          // Mark AI responses as seen
          await fetch(`${apiURL}/api/wa/mark-seen`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ threadId }),
          });
        }
      }
    };

    fetchMessagesAndMarkSeen();
  }, [selectedUser, mode, threadId]);

  const toggleMode = async () => {
    try {
      const response = await fetch(`${apiURL}/api/wa/toggle-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId }),
      });
      const result = await response.text();
      console.log(result);
      const newMode = mode === 'assisted' ? 'automatic' : 'assisted';
      setMode(newMode);

      // If the new mode is 'automatic', send the message automatically
      if (newMode === 'automatic') {
        sendMessage();
        setMessage('');
      }
    } catch (error) {
      console.error('Error toggling mode:', error);
    }
  };

  const sendMessage = async (event) => {
    if (event) event.preventDefault();

    if (message && userId) {
      console.log(`Sending message to: ${userId}, message: ${message}`);

      const response = await fetch(`${apiURL}/api/wa/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, message }),
      });

      if (response.ok) {
        console.log('Response sent to user via WhatsApp');
        const newMessage = {
          message,
          userId: name,
          createdAt: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage(''); // Clear the input box after sending the message

        // Mark AI responses as seen
        await fetch(`${apiURL}/api/wa/mark-seen`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ threadId }),
        });
      } else {
        const errorData = await response.json();
        console.log('Failed to send response to user via WhatsApp:', errorData);
      }
    } else {
      console.log('UserId or message is missing');
    }
  };

  return (
    <div className="chat-container">
      <Button onClick={toggleMode} variant="contained" color="primary">
        {mode === 'assisted'
          ? 'Switch to Auto Response'
          : 'Switch to Assisted Response'}
      </Button>
      <Grid
        container
        // component={Paper}
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Grid item xs={12}>
          <List
            sx={{
              height: '70vh',
              overflowY: 'auto',
              borderRight: '1px solid #e0e0e0',
            }}
          >
            <Messages messages={messages} name={name} />
          </List>
          <Divider />
          <Grid className="inputBox" container sx={{ padding: '20px' }}>
            <Input
              message={mode === 'assisted' ? message : ''}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;
