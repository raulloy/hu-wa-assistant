import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { blue } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import Badge from '@mui/material/Badge';
import { apiURL } from '../../utils';
import './userList.css';

const socket = io(apiURL);

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiURL}/api/wa/threads`);
        const data = await response.json();

        const usersWithUnseen = await Promise.all(
          data.map(async (user) => {
            const unseenResponse = await fetch(
              `${apiURL}/api/wa/unseen-ai-responses?userId=${user.userId}`
            );
            const unseenData = await unseenResponse.json();
            return { ...user, hasUnseenAIResponse: unseenData.unseen };
          })
        );

        setUsers(usersWithUnseen);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    // Listen for aiResponse event
    socket.on('aiResponse', (data) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === data.userId
            ? { ...user, hasUnseenAIResponse: true }
            : user
        )
      );
    });

    // Listen for markSeen event
    socket.on('markSeen', (data) => {
      console.log(`Received markSeen for userId: ${data.userId}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === data.userId
            ? { ...user, hasUnseenAIResponse: false }
            : user
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="list-container">
      <Card sx={{ backgroundColor: 'transparent' }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: blue[500] }}>HU</Avatar>}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Hogares Unión"
          subheader="OpenAI"
        />
      </Card>

      <Box sx={{ maxWidth: 345 }}>
        <nav>
          {users && (
            <List>
              {users.map((user) => (
                <div key={user._id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        onSelectUser(user);
                        setSelectedUserId(user.userId); // Update selected user ID on click
                      }}
                      sx={{
                        bgcolor:
                          selectedUserId === user.userId
                            ? '#DCDBDB'
                            : 'transparent', // Conditional background color
                      }}
                    >
                      <ListItemIcon>
                        <Badge
                          color="primary"
                          variant="dot"
                          invisible={!user.hasUnseenAIResponse}
                        >
                          <PersonIcon />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText primary={user.userId} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          )}
        </nav>
      </Box>
    </div>
  );
};

export default UserList;
