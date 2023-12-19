import RegisterCard from '../../components/card/RegisterCard';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
export default function NotificationList() {
  const items = Array.from({ length: 30 }, (_, index) => (
    <>
      <ListItem disablePadding sx={{ cursor: 'pointer' }} key={index}>
        <ListItemAvatar>
          <Avatar sx={{ backgroundColor: '#E5F3FF' }}>
            <CircleNotificationsIcon sx={{ color: '#122B47' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              variant="h6"
              sx={{ fontSize: '13px', color: '#2F4252' }}
            >
              {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s ply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standa${
                index + 1
              }`}
            </Typography>
          }
          secondary="Jan 9, 2014"
          sx={{ fontSize: '13px' }}
        />
        <IconButton aria-label="redirect">
          <OpenInNewIcon sx={{ color: ' #065AD8' }} fontSize="small" />
        </IconButton>
      </ListItem>

      <Divider />
    </>
  ));

  return (
    <RegisterCard title="Notifications">
      <Box sx={{ height: 'calc(90vh - 200px)', overflowY: 'auto' }}>
        <List>{items}</List>
      </Box>
    </RegisterCard>
  );
}
