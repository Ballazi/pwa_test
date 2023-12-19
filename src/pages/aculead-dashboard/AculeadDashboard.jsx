import {
  useState,
  //  lazy
} from 'react';
import { Box, Tab, styled } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import BiddingDashboard from '../bidding-dashboard/BiddingDashboard';
import TrackingDashboard from '../tracking-dashboard/TrackingDashboard';
// const BiddingDashboard = lazy(() =>
//   import('../bidding-dashboard/BiddingDashboard')
// );
// const TrackingDashboard = lazy(() =>
//   import('../tracking-dashboard/TrackingDashboard')
// );

export default function AculeadDashboard() {
  const [value, setValue] = useState('1');

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
    </Box>
  );
}
