import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Autocomplete,
} from '@mui/material';
import holdIcon from "../../../public/alert-icons/hold2.svg";
import arrivalIcon from "../../../public/alert-icons/arrival2.svg";
import delayIcon from "../../../public/alert-icons/delay2.svg";
import departureIcon from "../../../public/alert-icons/departure2.svg";
import deviationIcon from "../../../public/alert-icons/deviation2.svg";
import EwayIcon from "../../../public/alert-icons/e-way2.svg";
import gateInIcon from "../../../public/alert-icons/gate-in2.svg";
import gateOutIcon from "../../../public/alert-icons/gate-out2.svg";
import sosIcon from "../../../public/alert-icons/sos2.svg";
import {
  DemoContainer,
} from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch } from 'react-redux';
import BackdropComponent from "../../components/backdrop/Backdrop";
import { openSnackbar } from "../../redux/slices/snackbar-slice";
import { viewShiper, getRegion } from '../../api/trip-management/create-trip';
import { viewBranch } from "../../api/trip-management/manage-trip";
import AlertTab from './alerts/AlertTab';
import { getAlertCount } from '../../api/alert/alertDashbord';


function Alert() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [status, setStatus] = useState("Hold");
  const [selectedShipper, setSelectedShipper] = useState({});
  const [shipperList, setShipperList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState({});
  const [regionOptions, setRegionOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState({});
  const [branchOptions, setBranchOptions] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [alertCount, setAlertCount] = useState(
    {
      "hold_alert": 0,
      "departure_alert": 0,
      "delay_alert": 0,
      "sos_alert": 0,
      "deviation_alert": 0,
      "arrival_alert": 0,
      "e_way_alert": 0,
      "get_in_alert": 0,
      "get_out_alert": 0
    }
  );
  const dispatch = useDispatch();


  const alertData = [
    {
      label: "Hold",
      logo: holdIcon
    },
    {
      label: "Departure",
      logo: departureIcon
    },
    {
      label: "Delay",
      logo: delayIcon
    },
    {
      label: "SOS",
      logo: sosIcon
    },
    {
      label: "Deviation",
      logo: deviationIcon
    },
    {
      label: "Arrival",
      logo: arrivalIcon
    },
    {
      label: "E-way",
      logo: EwayIcon
    },
    {
      label: "Gate-In",
      logo: gateInIcon
    },
    {
      label: "Gate-Out",
      logo: gateOutIcon
    },
  ];

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
          setSelectedShipper(tempData[0]);
          fetchRegionData(tempData[0].value);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
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
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
          setRegionOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
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
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
          setBranchOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchShiper();
  }, [])

  useEffect(() => {
    setIsLoading(true);
    const payload = {
      shipper_id: selectedShipper.value !== undefined ? selectedShipper.value : null,
      region_cluster_id: selectedRegion.value !== undefined ? selectedRegion.value : null,
      branch_id: selectedBranch.value !== undefined ? selectedBranch.value : null,
      from_date: fromDate,
      to_date: toDate,
    };
    getAlertCount(payload)
      .then((res) => {
        if (res.data.success === true) {
          setAlertCount(res.data.data)
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedShipper, selectedRegion, selectedBranch, fromDate, toDate, dispatch])



  const handleAlertDivClick = (data, index) => {
    setStatus(data);
    setSelectedTab(index);
  };

  const returnCountFunction = (currentTab) => {
    switch (true) {
      case currentTab === "Hold":
        return alertCount.hold_alert;
      case currentTab === "Departure":
        return alertCount.departure_alert;
      case currentTab === "Delay":
        return alertCount.delay_alert;
      case currentTab === "SOS":
        return alertCount.sos_alert;
      case currentTab === "Deviation":
        return alertCount.deviation_alert;
      case currentTab === "Arrival":
        return alertCount.arrival_alert;
      case currentTab === "E-way":
        return alertCount.e_way_alert;
      case currentTab === "Gate-In":
        return alertCount.get_in_alert;
      case currentTab === "Gate-Out":
        return alertCount.get_out_alert;
      default:
        break;
    }
  }

  return (
    <>
      <BackdropComponent loading={loading} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={6}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4} md={4}>
                  <Autocomplete
                    options={shipperList}
                    getOptionLabel={(option) => option.label || ""}
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
                    }}
                    disableClearable={true}
                    popupIcon={<KeyboardArrowDownIcon />}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Shipper"
                        fullWidth
                        size="medium"
                        sx={{bgcolor: '#fff'}}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <Autocomplete
                    options={regionOptions}
                    getOptionLabel={(option) => option.label || ""}
                    value={
                      regionOptions.find(
                        (option) => option.value === selectedRegion.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      setSelectedRegion(newValue);
                      setSelectedBranch([]);
                      fetchBranchData(newValue.value);
                    }}
                    disableClearable={true}
                    popupIcon={<KeyboardArrowDownIcon />}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Region/Cluster"
                        fullWidth
                        size="medium"
                        sx={{bgcolor: '#fff'}}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <Autocomplete
                    options={branchOptions}
                    getOptionLabel={(option) => option.label || ""}
                    value={
                      branchOptions.find(
                        (option) => option.value === selectedBranch.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      setSelectedBranch(newValue);
                    }}
                    disableClearable={true}
                    popupIcon={<KeyboardArrowDownIcon />}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Branch"
                          fullWidth
                          size="medium"
                          sx={{bgcolor: '#fff'}}
                        />
                      </>
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="From date"
                        size="small"
                        sx={{
                          width: "100%",
                          bgcolor: "#ffffff",
                        }}
                        format='DD/MM/YYYY'
                        onChange={(date) => {
                          const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                          setFromDate(formattedDate);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="To date"
                        size="small"
                        sx={{
                          width: "100%",
                          bgcolor: "#ffffff",
                        }}
                        format='DD/MM/YYYY'
                        onChange={(date) => {
                          const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                          setToDate(formattedDate);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            {alertData.map((data, index) => (
              <Grid item xs={6} sm={4} md={1.33} key={data.label} className={`alertDiv ${selectedTab === index ? 'selected_alert' : 'not_selected_alert'}`} onClick={() => handleAlertDivClick(data.label, index)} sx={{ cursor: "pointer", userSelect: "none" }} >
                <Grid container direction="column" justifyContent="center" alignItems="center">
                  <img src={data.logo} alt='Logo' />
                  <Typography variant='h6'>{returnCountFunction(data.label)}</Typography>
                  <Typography variant='h6'>{data.label} alert</Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AlertTab status={status} shipperId={selectedShipper.value} />
        </Grid>
      </Grid>
    </>
  );
}

export default Alert;
