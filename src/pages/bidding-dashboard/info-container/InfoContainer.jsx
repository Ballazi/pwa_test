import { Grid, Box, Typography, styled } from '@mui/material';
import box from '../../../assets/Box.svg';
import pending from '../../../assets/Pending.svg';
import cancel from '../../../assets/CancelBid.svg';
import bidding from '../../../assets/Bidding.svg';
import live from '../../../assets/Live.svg';
import confirmedBid from '../../../assets/ConfirmedBid.svg';
import { useNavigate } from 'react-router-dom';

const StyledTypography = styled(Typography)(() => ({
  color: '#1D2129',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '28px',
}));

const ParaTypography = styled(Typography)(() => ({
  color: '#B2B9C3',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '28px',
}));

export default function InfoContainer({ stats }) {
  const navigate = useNavigate();
  return (
    <Grid
      container
      sx={{
        background: '#ffffff',
        border: '0.5px solid #BDCCD3',
        borderRadius: '4px',
      }}
    >
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        sx={{
          borderRight: '0.5px solid #BDCCD3 ',
          borderBottom: '0.5px solid #BDCCD3',
          padding: '25px 0px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/acculead-secured/manage-trip', { state: 0 })}
      >
        <Grid container justifyContent="center">
          <Box
            component="div"
            sx={{
              background: 'rgba(6, 90, 216, 0.1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <img src={box} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Total Trip</StyledTypography>
          <ParaTypography>{stats?.total}</ParaTypography>
        </Box>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        sx={{
          borderBottom: '0.5px solid #BDCCD3',
          padding: '25px 0px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/acculead-secured/manage-trip', { state: 0 })}
      >
        <Grid container justifyContent="center">
          <Box
            component="div"
            sx={{
              background: 'rgba(6, 90, 216, 0.1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <img src={bidding} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Total Bid</StyledTypography>
          <ParaTypography>{stats?.total - stats?.cancelled}</ParaTypography>
        </Box>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        sx={{
          borderRight: '0.5px solid #BDCCD3 ',
          borderBottom: '0.5px solid #BDCCD3',
          padding: '25px 0px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/acculead-secured/manage-trip', { state: 2 })}
      >
        <Grid container justifyContent="center">
          <Box
            component="div"
            sx={{
              background: 'rgba(6, 90, 216, 0.1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <img src={live} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Live Bid</StyledTypography>
          <ParaTypography>{stats?.live}</ParaTypography>
        </Box>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        sx={{
          borderBottom: '0.5px solid #BDCCD3',
          padding: '25px 0px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/acculead-secured/manage-trip', { state: 5 })}
      >
        <Grid container justifyContent="center">
          <Box
            component="div"
            sx={{
              background: 'rgba(6, 90, 216, 0.1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <img src={confirmedBid} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Confirm Bid</StyledTypography>
          <ParaTypography>{stats?.confirmed}</ParaTypography>
        </Box>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        sx={{
          borderRight: '0.5px solid #BDCCD3',
          padding: '25px 0px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/acculead-secured/manage-trip', { state: 3 })}
      >
        <Grid container justifyContent="center">
          <Box
            component="div"
            sx={{
              background: 'rgba(6, 90, 216, 0.1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <img src={pending} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Pending Bid</StyledTypography>
          <ParaTypography>{stats?.pending}</ParaTypography>
        </Box>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        sx={{ padding: '25px 0px', cursor: 'pointer' }}
        onClick={() => navigate('/acculead-secured/manage-trip', { state: 7 })}
      >
        <Grid container justifyContent="center">
          <Box
            component="div"
            sx={{
              background: 'rgba(6, 90, 216, 0.1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <img src={cancel} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Cancelled Bid</StyledTypography>
          <ParaTypography>{stats?.cancelled}</ParaTypography>
        </Box>
      </Grid>
    </Grid>
  );
}
