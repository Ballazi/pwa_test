import { useState, useEffect } from 'react';
import {
  Box,
  styled,
  Typography,
  Grid,
  TextField,
  Autocomplete,
} from '@mui/material';
import { DateIcon, DropdownIcon } from '../../utility/create-svg';
import { useDispatch, useSelector } from 'react-redux';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import { getRegion, viewShiper } from '../../api/trip-management/create-trip';
import { viewBranch } from '../../api/trip-management/manage-trip';
import TopContainerChart from '../bidding-dashboard/trip-success-rate/TopContainerChart';
import InfoTracking from './info-tracking/InfoTracking';
import dayjs from 'dayjs';
import HalfPieChart from '../../components/charts/half-pie-chart/HalfPieChart';
import DelayAnalysis from './delay-analysis/DelayAnalysis';
import BackdropComponent from '../../components/backdrop/Backdrop';
import TrackingAnalysis from './tracking-analysis/TrackingAnalysis';
import HorizontalBarChart from '../../components/charts/horizontal-bar-chart/HorizontalBarChart';
import { viewTrackDashboardData } from '../../api/track-dashboard/track-dashboard';

const WrapperBox = styled(Box)(({ theme }) => ({
  padding: '0px 40px',
  [theme.breakpoints.down('sm')]: {
    padding: '0px 0px',
  },
}));

const heyData = [
  { reason: 'Stuck at dept', count: 20 },
  { reason: 'Stuck at arrival', count: 5 },
  { reason: 'Delay 24 hours', count: 10 },
];

export default function TrackingDashboard() {
  const [selectedShipper, setSelectedShipper] = useState({
    label: null,
    value: null,
  });
  const [disableSelectShipper] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs(getDateOfLastWeek()));
  const [toDate, setToDate] = useState(dayjs(new Date()));
  const [shipperList, setShipperList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({
    label: null,
    value: null,
  });
  const [regionOptions, setRegionOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState({
    label: null,
    value: null,
  });
  const [branchOptions, setBranchOptions] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [trackingStats, setTrackingStats] = useState([]);
  const [delayAnalysisData, setDelayAnalysisData] = useState([]);
  const [trackingSuccessRateData, setTrackingSuccessRateData] = useState([]);
  const [trackingAnalysisData, setTrackingAnalysisData] = useState([]);
  const [alertAnalysisData, setAlertAnalysisData] = useState([]);
  const [tripHistoryData, setTripHistoryData] = useState([]);
  const [tripCancellationData, setTripCancellationData] = useState([]);
  const [
    delivaryConfirmationAnalysisData,
    setDelivaryConfirmationAnalysisData,
  ] = useState([]);
  const dispatch = useDispatch();
  const user_data = useSelector((state) => state.user.user_data);

  useEffect(() => {
    fetchShiper();
    fetchAllDataDashboard(null, null, null, fromDate, toDate);
  }, []);

  const fetchShiper = () => {
    viewShiper()
      .then((data) => {
        if (data.success === true) {
          const tempData = data.data.map((item) => {
            return {
              label: item.name,
              value: item.shpr_id,
            };
          });

          setShipperList(tempData);
          // setSelectedShipper(tempData[0]);
          // fetchRegionData(tempData[0].value);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  const fetchRegionData = (id) => {
    setIsLoading(true);
    const payload = {
      shipper_id: id,
    };
    getRegion(payload)
      .then((res) => {
        if (res.data.success === true) {
          const updatedRegion = res.data.data
            .filter((item) => item.is_region === true)
            .map((item) => {
              return {
                label: item.region_name,
                value: item.msrc_region_cluster_id,
                // is_region: item.is_region,
              };
            });
          setRegionOptions(updatedRegion);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setRegionOptions([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchBranchData = (id) => {
    const shipperId = selectedShipper.value;
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
      region_cluster_id: id,
    };
    viewBranch(payload)
      .then((res) => {
        if (res.data.success === true) {
          const payload = res.data.data.map((ele) => ({
            value: ele.branch_id,
            label: ele.name,
          }));
          setBranchOptions(payload);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setBranchOptions([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFromDate = (newValue) => {
    console.log('from date', newValue);
    setFromDate(newValue); //handle state only for input
    // const date = dayjs(newValue)
    //   .format('YYYY-MM-DDT00:00:00.000Z')
    //   .replace(/(\+\d+:\d+)/, 'Z');
    // console.log('from date formatted', date);

    fetchAllDataDashboard(
      selectedShipper.value,
      typeof selectedRegion.value === 'undefined' ? null : selectedRegion.value,
      typeof selectedBranch.value === 'undefined' ? null : selectedBranch.value,
      newValue,
      toDate
    );
  };

  const handleToDate = (newValue) => {
    console.log('to date', newValue);
    setToDate(newValue); //handle state only for input
    // const date = dayjs(newValue)
    //   .format('YYYY-MM-DDT23:59:59.999Z')
    //   .replace(/(\+\d+:\d+)/, 'Z');
    // console.log('to date formatted', date);
    fetchAllDataDashboard(
      selectedShipper.value,
      typeof selectedRegion.value === 'undefined' ? null : selectedRegion.value,
      typeof selectedBranch.value === 'undefined' ? null : selectedBranch.value,
      fromDate,
      newValue
    );
  };

  function getDateOfLastWeek() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15);
  }

  const alertDatakeyProps = ['reason', 'count'];

  const fetchAllDataDashboard = (
    shp_id,
    region_cluster_id,
    branch_id,
    from_date,
    to_date
  ) => {
    console.log('to date', to_date);
    const fetchedToDate = dayjs(to_date)
      .format('YYYY-MM-DDT23:59:59.999Z')
      .replace(/(\+\d+:\d+)/, 'Z');

    const fetchedFromDate = dayjs(from_date)
      .format('YYYY-MM-DDT00:00:00.000Z')
      .replace(/(\+\d+:\d+)/, 'Z');

    const payload = {
      shipper_id: shp_id,
      region_cluster_id: region_cluster_id,
      branch_id: branch_id,
      from_date: fetchedFromDate,
      to_date: fetchedToDate,
    };
    viewTrackDashboardData(payload)
      .then((res) => {
        if (res.data.success) {
          setTrackingStats(res.data.data);
          setDelayAnalysisData(res.data.data.delay_analysis);
          setTrackingAnalysisData(
            res.data.data.tracking_analysis_data.stacked_bar_chart_data
          );
          const filteredData = ['failed_count', 'successful_count']?.map(
            (key) => {
              return {
                name: key === 'successful_count' ? 'Success' : 'Failed',
                value: res.data.data.tracking_success_rate_data[key],
              };
            }
          );

          // const alertAnalysisFilterData = Object.keys(
          //   res.data.data.alert_analysis_data
          // ).map((x) => ({
          //   reason: x,
          //   count: res.data.data.alert_analysis_data[x],
          // }));

          // console.log(
          //   'hello alert>>>>>>>>>>>>',
          //   alertAnalysisFilterData,
          //   res.data.data.alert_analysis_data
          // );

          setAlertAnalysisData(res.data.data.alert_analysis_data);
          setTripHistoryData(res.data.data.trip_history_data);
          setTripCancellationData(res.data.data.trip_cancellation_data);
          const confirmationFilterData = [
            'in_progress_count',
            'pending_count',
            'completed_count',
          ]?.map((key) => {
            return {
              name:
                key === 'in_progress_count'
                  ? 'In-Progress'
                  : key === 'pending_count'
                  ? 'Pending'
                  : 'Completed',
              value: res.data.data.delivery_confirmation_analysis_data[key],
            };
          });

          console.log('ki dekhbo>', confirmationFilterData);
          setDelivaryConfirmationAnalysisData(confirmationFilterData);
          setTrackingSuccessRateData(filteredData);
        }
      })
      .catch((err) => console.log(err.response.data.message));
  };

  return (
    <WrapperBox container>
      <BackdropComponent loading={loading} />
      <Typography
        sx={{
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '28px',
          textAlign: 'center',
          letterSpacing: '-0.72px',
        }}
        my={2}
      >
        CONTROL TOWER
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={12} md={7} lg={6.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              {user_data.user_type === 'shp' ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo-1"
                  options={shipperList}
                  disabled={disableSelectShipper}
                  clearIcon={false}
                  disableClearable={true}
                  sx={{
                    // width: 175,
                    marginTop: 1,
                    bgcolor: '#fff',
                  }}
                  value={
                    shipperList.find(
                      (option) => option.value === user_data.shipper_id
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Shipper*"
                      InputLabelProps={{
                        style: {
                          fontSize: 14,
                        },
                      }}
                    />
                  )}
                  popupIcon={<DropdownIcon />}
                />
              ) : (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo-1"
                  options={shipperList}
                  disabled={disableSelectShipper}
                  clearIcon={false}
                  disableClearable={true}
                  sx={{
                    // width: 175,
                    marginTop: 1,
                    bgcolor: '#fff',
                  }}
                  value={
                    shipperList.find(
                      (option) => option.value === selectedShipper.value
                    ) || null
                  }
                  onChange={(_, newValue) => {
                    setSelectedShipper(newValue);
                    setSelectedRegion([]);
                    fetchRegionData(newValue.value);
                    setSelectedBranch([]);
                    fetchAllDataDashboard(
                      newValue.value,
                      null,
                      null,
                      fromDate,
                      toDate
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Shipper*"
                      InputLabelProps={{
                        style: {
                          fontSize: 14,
                        },
                      }}
                    />
                  )}
                  popupIcon={<DropdownIcon />}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Autocomplete
                disablePortal
                id="combo-box-demo-2"
                options={regionOptions}
                getOptionLabel={(option) => option.label || ''}
                value={
                  regionOptions.find(
                    (option) => option.value === selectedRegion.value
                  ) || null
                }
                disableClearable={true}
                onChange={(_, newValue) => {
                  setSelectedRegion(newValue);
                  setSelectedBranch([]);
                  fetchBranchData(newValue.value);
                  fetchAllDataDashboard(
                    selectedShipper.value,
                    newValue.value,
                    null,
                    fromDate,
                    toDate
                  );
                }}
                clearIcon={false}
                sx={{ marginTop: 1, bgcolor: '#fff' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Region/Cluster*"
                    InputLabelProps={{
                      style: {
                        fontSize: 14,
                      },
                    }}
                  />
                )}
                popupIcon={<DropdownIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Autocomplete
                disablePortal
                id="combo-box-demo-3"
                options={branchOptions}
                disableClearable={true}
                getOptionLabel={(option) => option.label || ''}
                value={
                  branchOptions.find(
                    (option) => option.value === selectedBranch.value
                  ) || null
                }
                clearIcon={false}
                onChange={(_, newValue) => {
                  setSelectedBranch(newValue);
                  fetchAllDataDashboard(
                    selectedShipper.value,
                    selectedRegion.value,
                    newValue.value,
                    fromDate,
                    toDate
                  );
                }}
                sx={{ marginTop: 1, bgcolor: '#fff' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Branch*"
                    InputLabelProps={{
                      style: {
                        fontSize: 14,
                      },
                    }}
                  />
                )}
                popupIcon={<DropdownIcon />}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5.5}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']} sx={{ width: 175 }}>
                <DatePicker
                  label="From date*"
                  sx={{ bgcolor: '#fff' }}
                  value={fromDate}
                  format="DD/MM/YYYY"
                  slots={{
                    openPickerIcon: DateIcon,
                  }}
                  onChange={handleFromDate}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']} sx={{ width: 175 }}>
                <DatePicker
                  label="To Date*"
                  sx={{ bgcolor: '#fff' }}
                  value={toDate}
                  format="DD/MM/YYYY"
                  slots={{
                    openPickerIcon: DateIcon,
                  }}
                  onChange={handleToDate}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={12} md={7} lg={7.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box
                sx={{
                  background: '#ffffff',
                  border: '0.5px solid #BDCCD3',
                  borderRadius: '4px',
                  py: 3,
                  px: 3,
                }}
              >
                <TopContainerChart
                  label="Delay Analysis"
                  subTitle="Total Trips :"
                  count={trackingStats.total_trip}
                />
                <DelayAnalysis data={delayAnalysisData} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box
                sx={{
                  background: '#ffffff',
                  border: '0.5px solid #BDCCD3',
                  borderRadius: '4px',
                  py: 3,
                  px: 3,
                }}
              >
                <TopContainerChart
                  label="Tracking success rate"
                  subTitle="Total Trips :"
                  count={trackingStats.total_trip}
                />
                <HalfPieChart data={trackingSuccessRateData} height={320} />
              </Box>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              background: '#ffffff',
              border: '0.5px solid #BDCCD3',
              borderRadius: '4px',
              py: 3,
              px: 3,
            }}
            mt={2}
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TopContainerChart
                label="Tracking Analysis"
                subTitle="Total Trips :"
                count={trackingStats.total_trip}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TrackingAnalysis trackingAnalysisData={trackingAnalysisData} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={4.5}>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <InfoTracking trackingStats={trackingStats} />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} mt={2}>
              <Grid
                container
                sx={{
                  background: '#ffffff',
                  border: '0.5px solid #BDCCD3',
                  borderRadius: '4px',
                  py: 3,
                  px: 3,
                }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TopContainerChart
                    label="Alert Analysis"
                    subTitle="Total Trips :"
                    count={trackingStats.total_trip}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <HorizontalBarChart
                    data={alertAnalysisData}
                    datakeyProps={alertDatakeyProps}
                    height="275px"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Grid
            container
            sx={{
              background: '#ffffff',
              border: '0.5px solid #BDCCD3',
              borderRadius: '4px',
              py: 3,
              px: 3,
            }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TopContainerChart
                label="Trip History"
                subTitle="Total Trips :"
                count={trackingStats.total_trip}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <HorizontalBarChart
                data={tripHistoryData}
                datakeyProps={alertDatakeyProps}
                height="275px"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Grid
            container
            sx={{
              background: '#ffffff',
              border: '0.5px solid #BDCCD3',
              borderRadius: '4px',
              py: 3,
              px: 3,
            }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TopContainerChart
                label="Delivery Confirmation Analysis"
                subTitle="Total Trips :"
                count={trackingStats.total_trip}
                height="100px"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <HalfPieChart
                data={delivaryConfirmationAnalysisData}
                height={250}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Grid
            container
            sx={{
              background: '#ffffff',
              border: '0.5px solid #BDCCD3',
              borderRadius: '4px',
              py: 3,
              px: 3,
            }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TopContainerChart
                label="Trip Cancellation History"
                subTitle="Total Trips :"
                count={trackingStats.total_trip}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <HorizontalBarChart
                data={tripCancellationData}
                datakeyProps={alertDatakeyProps}
                height="275px"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </WrapperBox>
  );
}
