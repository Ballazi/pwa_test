import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Radio,
  TextField,
  Autocomplete,
  Button,
  Chip,
} from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import InfoIcon from '@mui/icons-material/Info';
import RegisterCard from '../card/RegisterCard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TitleContainer from '../card/TitleContainer';
import ContentWrapper from '../form-warpper/ContentWrapper';
import FooterWrapper from '../form-warpper/FooterWrapper';
import { requiredValidator, alphaNumeric } from '../../validation/common-validator';
import { Controller, useForm } from 'react-hook-form';
import ErrorTypography from '../typography/ErrorTypography';
// import AlertPage from '../masterData/alert-component/AlertPage';
import {
  createRegion,
  fetchAllRegion,
  addShipperRegions,
} from '../../api/register/region';
import BackdropComponent from '../backdrop/Backdrop';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
// import SnackbarComponent from '../snackbar/SnackbarCompoenet';
import { fetchAlreadyAddedRegion } from '../../api/register/region';

const schema = yup.object().shape({
  region: alphaNumeric('Cluster name'),
  regionDescription: requiredValidator('Cluster description'),
});
export default function NewCluster({
  currentStep,
  // stepsContent,
  handleNext,
  handlePrevious,
}) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [displayedRegions, setDisplayedRegions] = useState([]);
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const shipperName = localStorage.getItem('shipper_name');
  // const [alertType, setAlertType] = useState('');
  // const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const shipper_id = localStorage.getItem('shipper_id');

  useEffect(() => {
    setIsLoading(true);
    let selectedRegionsArr = [];
    let uniqueIds = [];
    fetchAlreadyAddedRegion({ isRegion: false, shipper_id: shipper_id })
      .then((res) => {
        console.log('res', res);
        selectedRegionsArr = res.data.data.map((item) => {
          return {
            label: item.cluster_name,
            value: item.msrc_region_cluster_id,
            is_region: item.is_region,
          };
        });
        uniqueIds = res.data.data.map((item) => item.msrc_region_cluster_id);
        setDisplayedRegions(selectedRegionsArr);
        setSelectedRegions(selectedRegionsArr);
        if (selectedRegionsArr.length !== 0) {
          setSelectedRegion('With Regions');
        } else {
          setSelectedRegion('No Regions');
        }
        fetchAllRegion({ isRegion: false })
          .then((res) => {
            if (res.data.success === true) {
              console.log('data', selectedRegionsArr);
              console.log('ho2', res.data.data);
              const allRegions = res.data.data.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                  is_region: item.is_region,
                };
              });
              console.log('unique', uniqueIds, allRegions);
              const filteredRegion = allRegions.filter(
                (region) => !uniqueIds.includes(region.value)
              );
              console.log('unique 2', filteredRegion);
              setRegionOptions(filteredRegion);
            } else {
              dispatch(
                openSnackbar({ type: 'error', message: res.data.clientMessage })
              );
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // const closePopup = () => {
  //   setAlertType('');
  //   setMessage('');
  // };
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    localStorage.setItem('SelectedRegion', region);
    setErrorMessage('');
  };

  const handleSelectedRegionsChange = (event, newValue) => {
    if (event.key === 'Backspace') {
      return;
    }
    const newRegionsInDropdown = regionOptions.filter(
      (option) => !newValue.includes(option)
    );
    setRegionOptions(newRegionsInDropdown);
    setSelectedRegions([...newValue]);
  };

  const handleNextPage = () => {
    if (selectedRegion === '') {
      setErrorMessage('Please select an Region');
    } else if (
      selectedRegion === 'With Regions' &&
      displayedRegions.length === 0
    ) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Please select atleast one region',
        })
      );
      // setAlertType('error');
      // setMessage('Please select atleast one region');
    } else {
      console.log('Region options', displayedRegions);
      const formattedRegions = displayedRegions.map((item) => {
        console.log('item', item);
        return {
          shipper_id: shipper_id,
          region_cluster_id: item.value,
          is_region: item.is_region,
        };
      });
      console.log('formatted', formattedRegions);
      setIsLoading(true);
      addShipperRegions(formattedRegions)
        .then((res) => {
          if (res.data.success === false) {
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
            setIsLoading(true);
          } else {
            setIsLoading(true);
            handleNext();
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setErrorMessage('');
  };

  const handleChipDelete = (deletedRegion) => {
    console.log('hello', deletedRegion, selectedRegions);

    const updatedSelectedRegions = selectedRegions.filter(
      (region) => region.value !== deletedRegion.value
    );
    setRegionOptions((prevState) => [...prevState, deletedRegion]);
    setSelectedRegions(updatedSelectedRegions);
  };

  const handleAddRegionClick = () => {
    setIsAddingRegion(true);
  };

  const handleCloseRegion = () => {
    reset();
    setIsAddingRegion(false);
  };

  const handleNewRegionAdd = (form_data) => {
    if (form_data.region.trim() !== '') {
      const newRegion = {
        name: (form_data.region).toUpperCase(),
        details: (form_data.regionDescription).toUpperCase(),
        is_region: false,
      };
      createRegion(newRegion)
        .then((res) => {
          if (res.data.success === true) {
            console.log('hi', res.data.data);
            const region = {
              value: res.data.data.id,
              is_region: false,
              label: res.data.data.name,
            };
            setSelectedRegions([...selectedRegions, region]);
          } else {
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
          }
        })
        .catch((err) => console.log(err));
      setIsAddingRegion(false);
      reset();
    }
  };

  useEffect(() => {
    setDisplayedRegions(selectedRegions);
  }, [selectedRegions]);

  return (
    <div>
      <BackdropComponent loading={isLoading} />
      <ContentWrapper>
        {/* <AlertPage
          alertType={alertType}
          message={message}
          closePopup={closePopup}
        /> */}
        <TitleContainer>
          <Typography variant="h3">Cluster</Typography>
          <Typography
            sx={{
              fontWeight: 400,
              marginTop: '8px',
              color: '#8A919D',
            }}
            variant="body1"
            mb={1}
          >
            Fill out / Update Cluster details
          </Typography>
          {shipperName && (
            <Typography
              variant="h3"
              sx={{ color: '#122B47', fontSize: '12px', fontWeight: 500 }}
            >
              <Typography
                variant="span"
                sx={{ color: '#122B47', fontSize: '12px', fontWeight: 700 }}
              >
                Shipper Name:
              </Typography>
              {'  '}
              {shipperName}
            </Typography>
          )}
        </TitleContainer>
        <RegisterCard title="Cluster">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <div
                className={`radio-option ${
                  selectedRegion === 'With Regions' ? 'selected' : ''
                }`}
                onClick={() => handleRegionSelect('With Regions')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedRegion === 'With Regions'}
                    // onChange={handleRegionChange}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">Have Cluster</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div
                className={`radio-option ${
                  selectedRegion === 'No Regions' ? 'selected' : ''
                }`}
                onClick={() => handleRegionSelect('No Regions')}
                style={
                  displayedRegions.length != 0
                    ? { pointerEvents: 'none', cursor: 'not-allowed' }
                    : {}
                }
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedRegion === 'No Regions'}
                    // onChange={handleRegionChange}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">Don&apos;t Have Cluster</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoIcon />
                </div>
              </div>
            </Grid>
          </Grid>
          {errorMessage && <ErrorTypography>{errorMessage}</ErrorTypography>}
        </RegisterCard>
        {selectedRegion === 'With Regions' && (
          <form onSubmit={handleSubmit(handleNewRegionAdd)}>
            <RegisterCard title="Select Cluster">
              <Grid
                container
                spacing={2}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    id="regions-select"
                    options={regionOptions}
                    value={selectedRegions}
                    popupIcon={<KeyboardArrowDownIcon />}
                    onChange={handleSelectedRegionsChange}
                    clearIcon={false}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select cluster*"
                        variant="filled"
                        size="small"
                      />
                    )}
                    renderTags={(value) => (
                      <Box>{value.length}&nbsp;Cluster Selected</Box>
                    )}
                  />
                </Grid>

                {!isAddingRegion ? (
                  <Grid item xs={12} md={12}>
                    <Box
                      onClick={handleAddRegionClick}
                      className="add-region-button"
                    >
                      <Typography variant="h5">
                        <span style={{ color: '#8D9CB6' }}>
                          {' '}
                          Not in dropdown ?{' '}
                        </span>
                        <span style={{ color: 'blue', cursor: 'pointer' }}>
                          Add Cluster
                        </span>
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} md={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="region"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                label="Cluster Name*"
                                size="small"
                                fullWidth
                                {...field}
                                error={Boolean(errors.region)}
                                helperText={errors.region?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="regionDescription"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                label="Cluster Details*"
                                size="small"
                                fullWidth
                                {...field}
                                error={Boolean(errors.regionDescription)}
                                helperText={errors.regionDescription?.message}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={handleCloseRegion}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          // onClick={handleNewRegionAdd}
                          type="submit"
                          sx={{ marginLeft: 2 }}
                        >
                          Save
                        </Button>
                      </Box>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ mt: 2, mb: 3 }} variant="h4">
                    Cluster selected
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid #BDCCD3',
                      borderRadius: '8px',
                      p: 2,
                      minHeight: '48px',
                    }}
                  >
                    {displayedRegions.map((region) => (
                      <Chip
                        key={region.value}
                        label={region.label}
                        onDelete={() => handleChipDelete(region)}
                        variant="outlined"
                        color="primary"
                        sx={{ m: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </RegisterCard>
          </form>
        )}
      </ContentWrapper>
      <FooterWrapper>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <Button
          variant="contained"
          type="submit"
          onClick={() => handleNextPage()}
        >
          Save and Continue
        </Button>
      </FooterWrapper>
    </div>
  );
}
