import RegisterCard from '../../../../components/card/RegisterCard';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PersonIcon from '@mui/icons-material/Person';

export default function ShipperList({ shipperList }) {
  return (
    <RegisterCard title="Shipper List">
      {shipperList.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: '0.5px solid rgb(189, 204, 211)',
            borderRadius: '10px',
          }}
          p={2}
        >
          <PriorityHighIcon sx={{ color: '#dc3545' }} />
          <Typography
            component="h1"
            sx={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.87)' }}
          >
            No data available
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            border: '0.5px solid rgb(189, 204, 211)',
            borderRadius: '10px',
          }}
        >
          <List sx={{ width: '100%' }}>
            {shipperList.map((item) => (
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar sx={{ background: '#F1F3F4' }}>
                    <PersonIcon sx={{ color: '#5396ee' }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  sx={{ color: 'rgba(0, 0, 0, 0.87)' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </RegisterCard>
  );
}
