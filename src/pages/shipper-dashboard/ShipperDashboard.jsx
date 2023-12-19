import {
  useState,
  // lazy
} from 'react';
import { Box, Tab, styled } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import BiddingDashboard from '../bidding-dashboard/BiddingDashboard';
import TrackingDashboard from '../tracking-dashboard/TrackingDashboard';
import { decodeToken } from 'react-jwt';
// const BiddingDashboard = lazy(() =>
//   import('../bidding-dashboard/BiddingDashboard')
// );
// const TrackingDashboard = lazy(() =>
//   import('../tracking-dashboard/TrackingDashboard')
// );

export default function ShipperDashboard() {
  const token = JSON.parse(localStorage.getItem('authToken'));
  const [value, setValue] = useState('1');
  let optedService;
  if (token) {
    const decodedToken = decodeToken(token);
    console.log('decoded', decodedToken);
    optedService = decodedToken.opted_service;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const CustomTab = styled(Tab)({
    '&.Mui-selected': {
      color: '#065AD8 !important',
      fontWeight: 700,
      textTransform: 'capitalize',
    },
    textTransform: 'capitalize',
  });

  const WrapperBox = styled(Box)(({ theme }) => ({
    padding: '0px 40px',
    // [theme.breakpoints.down('md')]: {
    //   // padding: '0px 40px',
    // },
    [theme.breakpoints.down('sm')]: {
      padding: '0px 0px',
    },
  }));

  return (
    <Box>
      {optedService.name === 'Bidding & Tracking' && (
        <TabContext value={value}>
          <WrapperBox>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              scrollButtons={false}
              // scrollButtons
              variant="scrollable"
            >
              <CustomTab label="Bidding Dashboard" value="1" />
              <CustomTab label="Tracking Dashboard" value="2" />
            </TabList>
          </WrapperBox>
          <TabPanel value="1" sx={{ padding: 0 }}>
            <BiddingDashboard />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: 0 }}>
            <TrackingDashboard />
          </TabPanel>
        </TabContext>
      )}
      {optedService.name === 'Bidding' && <BiddingDashboard />}
      {optedService.name === 'Tracking' && <TrackingDashboard />}
    </Box>
  );
}
