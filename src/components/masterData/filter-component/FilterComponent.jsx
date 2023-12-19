import { useState, useEffect } from 'react';
import {
  Grid,
  Tooltip,
  InputLabel,
  Button,
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  TextField,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import BackdropComponent from '../../../components/backdrop/Backdrop';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import {
  viewShiper,
  getRegion,
} from '../../../api/trip-management/create-trip';
import ErrorTypography from '../../typography/ErrorTypography';
import { viewBranch } from '../../../api/register/user-details';

const schema = yup.object().shape({
  // shipper: yup.mixed(),
});

const FilterComponent = ({
  filterStateHandler,
  filterHandler,
  filterHandlerShip,
}) => {
  const {
    handleSubmit,
    reset,
    setValue,
    setError,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setIsLoading] = useState(false);
  const [shipperList, setShipperList] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const dispatch = useDispatch();
  const [departurealert, setDepartureAlert] = useState(false);
  const userType = localStorage.getItem('user_type');
  const userType_shipperId = localStorage.getItem('user_id');
  const userType_regionClusterId = localStorage.getItem('region_cluster_id');
  const userType_branchId = localStorage.getItem('branch_id');
  const [shipperDisabled, setShipperDisabled] = useState(false);
  const [regionDisabled, setRegionDisabled] = useState(false);
  const [branchDisabled, setBranchDisabled] = useState(false);
  const [formData, setFormData] = useState({});

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
          tempData.unshift({
            label: "All",
            value: null,
          })
          setShipperList(tempData);
          if (userType === 'shp') {
            const data =
              tempData.find((option) => option.value === userType_shipperId) ||
              null;
            if (data !== null) {
              setShipperDisabled(true);
              setValue('shipper', data.value);
              fetchRegionData(data.value);
              fetchBranchData();
            } else {
              setValue('shipper', '');
            }
          }
          else {
            setValue('shipper', null);
          }
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
          const updatedRegion = res.data.data.map((item) => {
            if (item.is_region === true) {
              return {
                label: item.region_name,
                value: item.msrc_region_cluster_id,
              };
            } else {
              return {
                label: item.cluster_name,
                value: item.msrc_region_cluster_id,
              };
            }
          });
          if (updatedRegion.length !== 0) {
            updatedRegion.unshift({
              label: 'All',
              value: null,
            });
          }
          setRegionOptions(updatedRegion);
          if (userType === 'shp') {
            const data =
              updatedRegion.find(
                (option) => option.value === userType_regionClusterId
              ) || null;
            if (data !== null) {
              setRegionDisabled(true);
              setValue('region', data.value);
              fetchBranchData(data.value);
            } else {
              if (updatedRegion.length !== 0) {
                setValue('region', null);
              } else {
                setValue('region', '');
              }
            }
          } else {
            if (updatedRegion.length !== 0) {
              setValue('region', null);
            } else {
              setValue('region', '');
            }
          }
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

  const fetchBranchData = (data = null) => {
    const shipperId = getValues('shipper');
    setIsLoading(true);
    const payload = { shipper_id: shipperId, region_cluster_id: data };
    viewBranch(payload)
      .then((res) => {
        if (res.data.success === true) {
          const updatedBranch = res.data.data.map((ele) => ({
            value: ele.branch_id,
            label: ele.name,
          }));
          if (updatedBranch.length !== 0) {
            updatedBranch.unshift({
              label: 'All',
              value: null,
            });
          }
          setBranchOptions(updatedBranch);
          if (userType === 'shp') {
            const data =
              updatedBranch.find(
                (option) => option.value === userType_branchId
              ) || null;
            if (data !== null) {
              setBranchDisabled(true);
              setValue('branch', data.value);
            } else {
              if (updatedBranch.length !== 0) {
                setValue('branch', null);
              } else {
                setValue('branch', '');
              }
            }
          } else {
            if (updatedBranch.length !== 0) {
              setValue('branch', null);
            } else {
              setValue('branch', '');
            }
          }
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

  useEffect(() => {
    fetchShiper();
    // if (userType === "shp") {
    //     setDepartureAlert(true);
    // }
  }, []);

  const handleSearchButton = (form_data) => {
    setError('toDate', undefined);
    const f_date =
      form_data.fromDate !== null
        ? dayjs(form_data.fromDate)
          .format('YYYY-MM-DDT00:00:00.000Z')
          .replace(/(\+\d+:\d+)/, 'Z')
        : null;
    const t_date =
      form_data.toDate !== null
        ? dayjs(form_data.toDate)
          .format('YYYY-MM-DDT23:59:59.999Z')
          .replace(/(\+\d+:\d+)/, 'Z')
        : null;
    if (f_date > t_date) {
      setError('toDate', {
        message: "To date can't be less than from date.",
      });
    } else {
      setFormData(form_data);
      const payload = {
        shipper_id: form_data.shipper !== '' ? form_data.shipper : null,
        rc_id: form_data.region !== '' ? form_data.region : null,
        branch_id: form_data.branch !== '' ? form_data.branch : null,
        from_date: f_date,
        to_date: t_date,
      };
      filterStateHandler(true, payload);
      if (userType === 'shp') {
        filterHandlerShip(payload);
      } else {
        filterHandler(payload);
      }
    }
  };

  const resetHandler = (userType) => {
    setFormData({});
    filterStateHandler(false, {});
    if (userType !== 'shp') {
      setBranchOptions([]);
      setRegionOptions([]);
      reset();
      setValue('shipper', null);
    } else {
      setValue("region", null);
      setValue("branch", null);
      setValue('fromDate', null);
      setValue('toDate', null);
    }
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      <Card>
        <Accordion
          expanded={departurealert}
          onChange={() => setDepartureAlert(!departurealert)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: '#F1F3F4', m: 1 }}
            className="customCardheader"
          >
            <Typography variant="h4">Filter By</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={handleSubmit(handleSearchButton)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Controller
                    name="shipper"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabel id="demo-simple-select-disabled-label">
                          Shipper*
                        </InputLabel>
                        <Autocomplete
                          {...field}
                          options={shipperList}
                          getOptionLabel={(option) => option.label || ''}
                          value={
                            shipperList.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                            fetchBranchData();
                            fetchRegionData(newValue.value);
                            setValue('branch', '');
                            setValue('region', '');
                          }}
                          disableClearable={true}
                          disabled={shipperDisabled}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={!!errors.shipper}
                              helperText={errors.shipper?.message}
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Controller
                    name="region"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabel id="demo-simple-select-disabled-label">
                          Region/Cluster
                        </InputLabel>
                        <Autocomplete
                          {...field}
                          options={regionOptions}
                          getOptionLabel={(option) => option.label || ''}
                          value={
                            regionOptions.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                            fetchBranchData(newValue.value);
                            setValue('branch', '');
                          }}
                          disableClearable={true}
                          disabled={regionDisabled}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Controller
                    name="branch"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabel id="demo-simple-select-disabled-label">
                          Branch
                        </InputLabel>
                        <Autocomplete
                          {...field}
                          options={branchOptions}
                          getOptionLabel={(option) => option.label || ''}
                          value={
                            branchOptions.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                          }}
                          disableClearable={true}
                          disabled={branchDisabled}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <>
                              <TextField
                                {...params}
                                variant="outlined"
                                fullWidth
                                size="small"
                              />
                            </>
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Controller
                        name="fromDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker
                                size="small"
                                label="From date"
                                sx={{
                                  width: '100%',
                                }}
                                format="DD/MM/YYYY"
                                {...field}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Controller
                        name="toDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                  label="To date"
                                  size="small"
                                  sx={{
                                    width: '100%',
                                  }}
                                  format="DD/MM/YYYY"
                                  {...field}
                                  onChange={(date) => {
                                    field.onChange(date);
                                  }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                            {errors.toDate && (
                              <ErrorTypography>
                                {errors.toDate.message}
                              </ErrorTypography>
                            )}
                          </>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Tooltip title="Apply Filter">
                        <Button
                          size="large"
                          variant="contained"
                          color="warning"
                          onClick={() => resetHandler(userType)}
                        >
                          Reset
                        </Button>
                      </Tooltip>
                    </Grid>
                    &nbsp;
                    <Grid item>
                      <Tooltip title="Apply Filter">
                        <Button
                          size="large"
                          variant="contained"
                          type="submit"
                          autoFocus
                        >
                          Apply
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </AccordionDetails>
        </Accordion>
      </Card>
    </>
  );
};

export default FilterComponent;
