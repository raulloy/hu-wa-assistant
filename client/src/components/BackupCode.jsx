import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';

import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import { apiURL } from '../../utils';
import './chat.css';

let socket;

const Chat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    socket = io(apiURL);

    // Listen for the 'userId' event from the backend
    socket.on('userId', ({ userId }) => {
      setName(userId);
    });

    // Listen for AI responses from the backend
    socket.on('aiResponse', (data) => {
      setMessage(data.response);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setUserId(selectedUser.userId);
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `${apiURL}/api/wa/messages?threadId=${selectedUser._id}`
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedUser]);

  //   console.log(selectedUser);

  const sendMessage = async (event) => {
    event.preventDefault();

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
        setMessage('');
      } else {
        const errorData = await response.json();
        console.log('Failed to send response to user via WhatsApp:', errorData);
      }
    } else {
      console.log('UserId or message is missing');
    }
  };

  //   console.log(messages);

  return (
    <div className="chat-container">
      <Grid
        container
        component={Paper}
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
          <Grid container sx={{ padding: '20px' }}>
            <Input
              message={message}
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
