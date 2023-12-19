import { Grid, Box, Typography, styled } from '@mui/material';
import box from '../../../assets/trips.svg';
import arrival from '../../../assets/arrival.svg';
import delay from '../../../assets/delay.svg';
import consent from '../../../assets/consent.svg';
import inprogress from '../../../assets/inprogress.svg';
import departure from '../../../assets/departure.svg';

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

export default function InfoTracking({ trackingStats }) {
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
        }}
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
          <StyledTypography mt={2}>Total Trips</StyledTypography>
          <ParaTypography>{trackingStats.total_trip}</ParaTypography>
        </Box>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        sx={{ borderBottom: '0.5px solid #BDCCD3', padding: '25px 0px' }}
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
            <img src={consent} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Consent Pending</StyledTypography>
          <ParaTypography>{trackingStats.consent_pending_count}</ParaTypography>
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
        }}
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
            <img src={inprogress} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>In Progress</StyledTypography>
          <ParaTypography>{trackingStats.inprogress_count}</ParaTypography>
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
        }}
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
            <img src={departure} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Departure</StyledTypography>
          <ParaTypography>{trackingStats.departure_count}</ParaTypography>
        </Box>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        sx={{ borderRight: '0.5px solid #BDCCD3', padding: '25px 0px' }}
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
            <img src={arrival} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Arrival</StyledTypography>
          <ParaTypography>{trackingStats.arrival_count}</ParaTypography>
        </Box>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} sx={{ padding: '25px 0px' }}>
        <Grid container justifyContent="center">
          <Box
            component="div"
            sx={{
              background: 'rgba(6, 90, 216, 0.1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <img src={delay} height={25} width={25} />
          </Box>
        </Grid>
        <Box display="block" sx={{ textAlign: 'center' }}>
          <StyledTypography mt={2}>Delay</StyledTypography>
          <ParaTypography>{trackingStats.delay_count}</ParaTypography>
        </Box>
      </Grid>
    </Grid>
  );
}
