import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

import { apiURL } from '../../utils';
import './detail.css';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Detail = ({ selectedUser }) => {
  const [expanded, setExpanded] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiURL}/api/wa/threads`);
        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // console.log(selectedUser);

  return (
    <div className="detail-container">
      <Card sx={{ maxWidth: 345, backgroundColor: 'transparent' }}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Username"
          subheader={
            <div>
              <Typography variant="body2" color="textSecondary">
                {selectedUser.userId.slice(-10)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                user@example.com
              </Typography>
            </div>
          }
        />
        {/* <CardMedia
          component="img"
          height="194"
          image="/static/images/cards/paella.jpg"
          alt="Paella dish"
        /> */}
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore
            ipsam dolorem nihil ex nobis, quod aliquam minus eveniet inventore
            ab?
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {/* <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton> */}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Box sx={{ width: '100%', maxWidth: 360 }}>
              <Divider />
              <nav aria-label="secondary mailbox folders">
                <List>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            <strong>Property:</strong> Lorem ipsum dolor sit.
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            <strong>Property:</strong> Lorem ipsum dolor sit.
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            <strong>Property:</strong> Lorem ipsum dolor sit.
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
            </Box>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};

export default Detail;
