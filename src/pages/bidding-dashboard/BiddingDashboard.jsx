import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TripSuccessRate from './trip-success-rate/TripSuccessRate';
import TopContainerChart from './trip-success-rate/TopContainerChart';
import TripAnalysisChart from './trip-analysis/TripAnalysisChart';
import InfoContainer from './info-container/InfoContainer';
import ConfirmedVsCancelledChart from './confirmed-vs-cancelled-chart/ConfirmedVsCancelledChart';
import CancelledLoadAnalysisChart from './cancelled-load-analysis/CancelledLoadAnalysis';
import TotalParticipationAnalysisTable from './total-participation-analysis/TotalParticipationAnalysisTable';
import TransporterAnalysisChart from './transporter-analysis-pie/TransporterAnalysisChart';
import { DateIcon, DropdownIcon } from '../../utility/create-svg';
import {
  viewStats,
  transporterReports,
  cancellationReason,
  confirmedVsCancelledChart,
} from '../../api/bid-dashboard/bid-dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import BackdropComponent from '../../components/backdrop/Backdrop';
import { viewShiper, getRegion } from '../../api/trip-management/create-trip';
import { viewBranch } from '../../api/trip-management/manage-trip';
import dayjs from 'dayjs';

const WrapperBox = styled(Box)(({ theme }) => ({
  padding: '0px 40px',
  [theme.breakpoints.down('sm')]: {
    padding: '0px 0px',
  },
}));

export default function BiddingDashboard() {
  const [stats, setStats] = useState([]);
  const [tripSuccessRateVales, setTripSuccessRateVales] = useState([]);
  const [tripAnalysisData, setTripAnalysisData] = useState([]);
  const [transporterParticipationData, setTransporterParticipationData] =
    useState([]);
  const [transporterAnalysisChartData, setTransporterAnalysisChartData] =
    useState([]);
  const [cancellationAnalysis, setCancellationAnalysis] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [disableSelectShipper, setDisableSelectShipper] = useState(false);
  const [disableSelectCluster] = useState(false);
  const [disableSelectBranch] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState({});
  const [fromDate, setFromDate] = useState(dayjs(getLastWeeksDate()));
  const [toDate, setToDate] = useState(dayjs(new Date()));
  const [shipperList, setShipperList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({});
  const [regionOptions, setRegionOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState({});
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedTripTrend, setSelectedTripTrend] = useState('day');
  const [confirmedVsCancelledChartData, setConfirmVsCancelledChartData] =
    useState([]);
  const user_data = useSelector((state) => state.user.user_data);
  const dispatch = useDispatch();
  console.log('user data', user_data);

  useEffect(() => {
    if (user_data.user_type === 'shp') {
      setDisableSelectShipper(true);
      fetchShiper();
      fetchRegionData(user_data.shipper_id);
      fetchData(
        user_data.shipper_id,
        null,
        null,
        getLastWeeksDate(),
        new Date()
      );
      setSelectedShipper({ name: '', value: user_data.shipper_id });
      confirmedVsCancelledChart(
        {
          shipper_id: selectedShipper.value,
          rc_id: selectedRegion.value,
          branch_id: selectedBranch.value,
          from_date: fromDate,
          to_date: toDate,
        },
        'day'
      )
        .then((res) => {
          setConfirmVsCancelledChartData(res.data.data);
        })
        .catch((err) => console.log(err));
    } else {
      fetchShiper();
      fetchData(null, null, null, getLastWeeksDate(), new Date(), 'day');
    }
  }, []);

  function getLastWeeksDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15);
  }

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

  async function fetchData(
    shipper_id,
    rc_id,
    branch_id,
    from_date,
    to_date,
    cancellationTenure
  ) {
    const fetchedToDate = dayjs(to_date)
      .format('YYYY-MM-DDT23:59:59.999Z')
      .replace(/(\+\d+:\d+)/, 'Z');

    const fetchedFromDate = dayjs(from_date)
      .format('YYYY-MM-DDT00:00:00.000Z')
      .replace(/(\+\d+:\d+)/, 'Z');
    const payload = {
      shipper_id: shipper_id,
      rc_id: rc_id,
      branch_id: branch_id,
      from_date: fetchedFromDate,
      to_date: fetchedToDate,
    };
    try {
      const [response1, response2, response3, response4] = await Promise.all([
        viewStats(payload),
        transporterReports(payload),
        cancellationReason(payload),
        confirmedVsCancelledChart(payload, cancellationTenure),
      ]);

      if (response1.data.success) {
        console.log('checkpoint', response1.data.data);
        if (response1.data.data.length === 0) {
          console.log('inside....');
          setStats(response1.data.data);
          setTripAnalysisData([
            { name: 'live', value: 0 },
            { name: 'confirmed', value: 0 },
            { name: 'pending', value: 0 },
            { name: 'cancelled', value: 0 },
          ]);
          setTripSuccessRateVales([
            { name: 'Success', value: 0 },
            { name: 'Failed', value: 0 },
          ]);
        } else {
          setStats(response1.data.data);
          const filteredData = ['completed', 'cancelled']?.map((key) => {
            return {
              name: key === 'completed' ? 'Success' : 'Failed',
              value: response1.data.data[key],
            };
          });
          const tripAnalysisData = [
            'live',
            'confirmed',
            'pending',
            'cancelled',
          ]?.map((key) => {
            return {
              name: key,
              value: response1.data.data[key],
            };
          });
          setTripSuccessRateVales(filteredData);
          setTripAnalysisData(tripAnalysisData);
        }
      }
      if (response2.data.success) {
        if (response2.data.data.length === 0) {
          setTransporterParticipationData([]);
          setTransporterAnalysisChartData([
            { name: 'Participated', value: 0 },
            { name: 'Selected', value: 0 },
            { name: 'Failed', value: 0 },
          ]);
        } else {
          console.log('response transporter', response2.data.data);
          setTransporterParticipationData(response2.data.data);
          const totalParticipated = response2.data.data
            ?.map((item) => item.participated)
            ?.reduce((acc, sum) => acc + sum, 0);
          const totalSelected = response2.data.data
            ?.map((item) => item.selected)
            ?.reduce((acc, sum) => acc + sum, 0);
          const totalFailed = response2.data.data
            ?.map((item) => item.participated - item.selected)
            ?.reduce((acc, sum) => acc + sum, 0);

          const transporterAnalysisObjArray = [
            { name: 'Participated', value: totalParticipated },
            { name: 'Selected', value: totalSelected },
            { name: 'Failed', value: totalFailed },
          ];
          console.log('data', transporterAnalysisObjArray);
          setTransporterAnalysisChartData(transporterAnalysisObjArray);
        }
      } else {
        console.log('inside... hhh');
        setTransporterParticipationData([]);
        setTransporterAnalysisChartData([
          { name: 'Participated', value: 0 },
          { name: 'Selected', value: 0 },
          { name: 'Failed', value: 0 },
        ]);
      }

      if (response3.data.success) {
        console.log('response cancel', response3.data.data);
        setCancellationAnalysis(response3.data.data);
      }

      if (response4.data.success) {
        setConfirmVsCancelledChartData(response4.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleFromDate = (newValue) => {
    console.log('from date', newValue);
    setFromDate(newValue); //handle state only for input
    const date = dayjs(newValue)
      .format('YYYY-MM-DDT00:00:00.000Z')
      .replace(/(\+\d+:\d+)/, 'Z');
    console.log('from date formatted', date);
    fetchData(
      selectedShipper.value,
      selectedRegion.value,
      selectedBranch.value,
      date,
      toDate,
      selectedTripTrend
    );
  };

  const handleToDate = (newValue) => {
    console.log('to date', newValue);
    setToDate(newValue); //handle state only for input
    const date = dayjs(newValue)
      .format('YYYY-MM-DDT23:59:59.999Z')
      .replace(/(\+\d+:\d+)/, 'Z');
    console.log('to date formatted', date);
    fetchData(
      selectedShipper.value,
      selectedRegion.value,
      selectedBranch.value,
      fromDate,
      date,
      selectedTripTrend
    );
  };

  const handleConFirmVsCancelChange = (e) => {
    console.log('value', e.target.value);
    setSelectedTripTrend(e.target.value);
    confirmedVsCancelledChart(
      {
        shipper_id: selectedShipper.value,
        rc_id: selectedRegion.value,
        branch_id: selectedBranch.value,
        from_date: fromDate,
        to_date: toDate,
      },
      e.target.value
    )
      .then((res) => {
        setConfirmVsCancelledChartData(res.data.data);
      })
      .catch((err) => console.log(err));
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
            {console.log('>>>>>>>>>', shipperList, user_data.shipper_id)}
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
                    fetchData(
                      newValue.value,
                      null,
                      null,
                      fromDate,
                      toDate,
                      selectedTripTrend
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
                  fetchData(
                    selectedShipper.value,
                    newValue.value,
                    selectedBranch.value,
                    fromDate,
                    toDate,
                    selectedTripTrend
                  );
                }}
                clearIcon={false}
                sx={{ marginTop: 1, bgcolor: '#fff' }}
                disabled={disableSelectCluster}
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
                  fetchData(
                    selectedShipper.value,
                    selectedRegion.value,
                    newValue.value,
                    fromDate,
                    toDate,
                    selectedTripTrend
                  );
                }}
                disabled={disableSelectBranch}
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
        <Grid item xs={12} sm={12} md={3} lg={4}>
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
            <Grid item xs={12} sm={12} md={12} lg={12} mb={3}>
              <TopContainerChart
                label="Trip success rate"
                subTitle="Total Trips :"
                count={stats?.total}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} my={3}>
              <TripSuccessRate tripSuccessRateVales={tripSuccessRateVales} />
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              background: '#ffffff',
              border: '0.5px solid #BDCCD3',
              borderRadius: '4px',
              py: 3,
              px: 2,
            }}
            mt={2.3}
          >
            <Grid item xs={12} sm={12} md={12} lg={12} mb={3}>
              <Typography
                sx={{
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '28px',
                  letterSpacing: '-0.72px',
                }}
                component="h4"
              >
                Cancelled Load Analysis
              </Typography>
              <Typography
                component="h4"
                sx={{ color: '#969CA6', fontSize: '14px' }}
              >
                Total cancelled load :
                <Typography
                  component="span"
                  sx={{
                    fontSize: '18px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '28px',
                    letterSpacing: '-0.72px',
                    color: '#1D2129',
                  }}
                >
                  &nbsp;{stats?.cancelled}
                </Typography>{' '}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} mb={3}>
              <CancelledLoadAnalysisChart
                cancellationAnalysis={cancellationAnalysis}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={9} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={5} lg={5}>
              {/* trip success rate */}
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
                <Grid item xs={12} sm={12} md={12} lg={12} mb={3}>
                  <TopContainerChart
                    label="Trip Analysis"
                    subTitle="Total Trips :"
                    count={stats?.total}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} my={3}>
                  <TripAnalysisChart tripAnalysisData={tripAnalysisData} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={7} lg={7}>
              <InfoContainer stats={stats} />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {/*confirmed vs cancelled trip */}

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
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      lineHeight: '28px',
                      letterSpacing: '-0.72px',
                    }}
                    component="h4"
                  >
                    Confirmed vs. cancelled trip trend
                  </Typography>
                  <Typography
                    component="h4"
                    sx={{ color: '#969CA6', fontSize: '14px' }}
                  >
                    Total confirmed & cancelled trips :
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '18px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '28px',
                        letterSpacing: '-0.72px',
                        color: '#1D2129',
                      }}
                    >
                      &nbsp;{stats?.cancelled + stats?.confirmed}
                    </Typography>{' '}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Grid container justifyContent="right">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel id="demo-simple-select-helper-label">
                        Select
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue="day"
                        // value={age}
                        label="Select"
                        IconComponent={DropdownIcon}
                        value={selectedTripTrend}
                        onChange={handleConFirmVsCancelChange}
                      >
                        <MenuItem value="day">Day</MenuItem>
                        <MenuItem value="month">Month</MenuItem>
                        <MenuItem value="year">Year</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <ConfirmedVsCancelledChart
                  confirmedVsCancelledChartData={confirmedVsCancelledChartData}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={7}>
          <TotalParticipationAnalysisTable
            transporterParticipationData={transporterParticipationData}
          />
          {/*Transporter participation analysis */}
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={5}>
          {/*Transporter analysis */}
          <TransporterAnalysisChart
            count={transporterParticipationData.length}
            transporterAnalysisChartData={transporterAnalysisChartData}
          />
        </Grid>
      </Grid>
    </WrapperBox>
  );
}
