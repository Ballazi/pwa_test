import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Typography,
  Grid,
  RadioGroup,
  Autocomplete,
  TextField,
  Box,
} from '@mui/material';
import ContentWrapper from '../../form-warpper/ContentWrapper';
import FooterWrapper from '../../form-warpper/FooterWrapper';
import TitleContainer from '../../card/TitleContainer';
import RegisterCard from '../../card/RegisterCard';
import CustomRadio from '../../Radio/CustomRadio';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SelectedTransporterListTable from './SelectedTransporterListTable';
import {
  // getAlltransporters,
  getTransporterById,
  getAllTransporterByStatus,
  // deleteTransporter,
} from '../../../api/register/transporter';
import TransporterDetails from './TransporterDetails';
import { fetchTransporterDetailsData } from '../../../api/register/transporter';
// import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
// import BackdropComponenet from '../../backdrop/Backdrop';

export default function TransporterRegister({
  currentStep,
  handlePrevious,
  handleNext,
}) {
  const [transporterSelected, setTransporterSelected] = useState('');
  const [transporterOptions, setTransporterOptions] = useState([]);
  const [selectedTransporters, setSelectedTransporters] = useState([]);
  const [transporterDetails, setTransporterDetails] = useState([]);
  const [addNewTransporterOpen, setHandleNewTransporterOpen] = useState(false);
  const shipper_id = localStorage.getItem('shipper_id');
  const [reloadApplication, setReloadApplication] = useState(false);
  const shipperName = localStorage.getItem('shipper_name');
  const myDivRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTransporterDetailsData(shipper_id)
      .then((res) => {
        if (res.data.success) {
          console.log('res data', res.data.data);

          res.data.data.length > 0
            ? setTransporterSelected('have-trans')
            : setTransporterSelected('not-have-trans');
          if (res.data.data.length > 0) {
            const filterData = res.data.data.map((item) => {
              return {
                label: item.name,
                id: item.trnsp_id,
              };
            });
            console.log('hohoho', filterData);
            setSelectedTransporters(filterData);
            console.log('transporter details', res.data.data);
            setTransporterDetails(res.data.data);
            fetchAllTransporters(filterData);
          } else {
            fetchAllTransporters([]);
          }
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setReloadApplication(false));
  }, [shipper_id, reloadApplication]);

  function handleTransporterSubmit() {
    if (transporterSelected === 'have-trans') {
      if (transporterDetails.some((details) => details?.kam_count === 0)) {
        dispatch(
          openSnackbar({
            type: 'error',
            message: 'KAM is mandatory for every transporter!',
          })
        );
      } else {
        handleNext();
      }
    } else {
      handleNext();
    }
  }

  function reloadApplicationTrigger() {
    setReloadApplication(true);
  }

  const fetchAllTransporters = (filterData) => {
    getAllTransporterByStatus('allowed')
      .then((res) => {
        if (res.data.success === true) {
          const modifiedTransporters = res.data.data.map((item) => {
            return {
              label: item.name,
              id: item.trnsp_id,
            };
          });
          setTransporterOptions(modifiedTransporters);
          if (filterData.length > 0) {
            console.log('is here 1');
            console.log('ki jani 1', filterData);
            console.log('here', modifiedTransporters, filterData);
            const newTransportersInDropdown = modifiedTransporters.filter(
              (option) => !filterData.includes(option)
            );
            console.log('ki jani', newTransportersInDropdown);
            setTransporterOptions(newTransportersInDropdown);
          } else {
            console.log('is here 2');
            setSelectedTransporters([]);
            setTransporterDetails([]);
          }
        } else {
          console.log('is here 3');
          setTransporterOptions([]);
          setSelectedTransporters([]);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRadioChange = (id) => {
    console.log('id', typeof id);
    setTransporterSelected(id);
  };

  const handleSelectedRegionsChange = (event, newValue) => {
    console.log('new value', newValue, event.target.value);
    const clickedValue = newValue.find(
      (option) => !selectedTransporters.includes(option)
    );
    fetchTransporterDetailsById(clickedValue.id);
    // console.log('clicked', clickedValue);
    // const newTransportersInDropdown = transporterOptions.filter(
    //   (option) => !newValue.includes(option)
    // );
    // setTransporterOptions(newTransportersInDropdown);
    // console.log('new value selected Transporters', selectedTransporters);
    // console.log('newVal', newValue);
    setSelectedTransporters(() => newValue);
  };

  const isOptionEqualToValue = (option, value) => {
    return option.id === value.id;
  };

  const fetchTransporterDetailsById = (id) => {
    getTransporterById(id, shipper_id)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.data);
          setTransporterDetails((prevState) => [
            ...prevState,
            { ...res.data.data, users: [], kam_count: 0 },
          ]);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    console.log('hi');
    fetchAllTransporters();
  };

  const handleComplete = (users, id) => {
    getTransporterById(id, shipper_id)
      .then((res) => {
        if (res.data.success) {
          const users = res.data.data.kams;
          const updatedTransporter = {
            ...res.data.data,
            users: users,
            kam_count: res.data.data.kams.length,
          };
          console.log('hi');
          setTransporterDetails((prevState) => {
            // Use map to replace the object with the matching transp_id
            return prevState.map((item) =>
              item.trnsp_id === updatedTransporter.trnsp_id
                ? updatedTransporter
                : item
            );
          });
        }
      })
      .catch((err) => console.log(err));
    // console.log('here transporter');

    // console.log('here transport 1');
    // const transporter = transporterDetails.find((item) => item.trnsp_id === id);
    // console.log('hello', transporter);
    // const newData = {
    //   ...transporter,
    //   users: users,
    //   kam_count: users.length,
    // };

    // console.log('oye', newData);
    // const filterData = transporterDetails.filter(
    //   (item) => item.trnsp_id !== id
    // );
    // console.log('ole ole ole', filterData);
    // setTransporterDetails([...filterData, newData]);
    // setReloadApplication(true);
  };

  const handleCompleteNewTransporter = (users, payload) => {
    console.log('LIMBO', users, payload);
    const newData = {
      ...payload,
      users,
    };
    setTransporterDetails((prevData) => [...prevData, newData]);
    setSelectedTransporters((prevState) => [
      ...prevState,
      { label: newData.name, id: newData.trnsp_id },
    ]);
    setHandleNewTransporterOpen(false);
    // setReloadApplication(true);
  };

  useEffect(() => {
    //for smooth scroll
    if (addNewTransporterOpen === true && myDivRef.current) {
      console.log('clicked');
      myDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [addNewTransporterOpen]);

  const handleAfterDelete = (transId, transName) => {
    // const obj = {
    //   label: transName,
    //   id: transId,
    // };
    setTransporterDetails((prevState) =>
      prevState.filter((item) => item.trnsp_id !== transId)
    );
    setSelectedTransporters((prevState) =>
      prevState.filter((item) => item.id !== transId)
    );
  };

  return (
    <>
      {/* <BackdropComponenet loading={isLoading} /> */}
      <ContentWrapper>
        <TitleContainer>
          <Typography variant="h3">Transporters</Typography>
          <Typography
            sx={{
              fontWeight: 400,
              marginTop: '8px',
              color: '#8A919D',
            }}
            variant="body1"
            mb={1}
          >
            Fill out / Update transporter details
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
        <RegisterCard title="Select an option">
          <RadioGroup value={transporterSelected}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <CustomRadio
                  name="Have transporters"
                  id="have-trans"
                  controlState={transporterSelected}
                  onChange={handleRadioChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <CustomRadio
                  name="Don’t have transporters"
                  id="not-have-trans"
                  controlState={transporterSelected}
                  onChange={handleRadioChange}
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </RegisterCard>
        {transporterSelected === 'have-trans' && (
          <Box id="myDiv" ref={myDivRef}>
            <RegisterCard title="Create transporters">
              <Grid container>
                <Grid item xs={12} sm={12} md={8} lg={6}>
                  <Autocomplete
                    multiple
                    id="transporters-select"
                    options={transporterOptions}
                    value={selectedTransporters}
                    popupIcon={<KeyboardArrowDownIcon />}
                    onChange={handleSelectedRegionsChange}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'clear') {
                        handleClose();
                      }
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select transporters*"
                        variant="filled"
                        size="small"
                      />
                    )}
                    clearIcon={null}
                    renderTags={(value) => (
                      <Box>{value.length}&nbsp;transporters Selected</Box>
                    )}
                  />
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} md={8} lg={6}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '18px',
                          lineHeight: '23.76px',
                        }}
                      >
                        Transporter does not exist?
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ fontSize: '12px', px: 4, py: 1.5 }}
                        onClick={() => setHandleNewTransporterOpen(true)}
                      >
                        Add new transporter
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </RegisterCard>
          </Box>
        )}
        {addNewTransporterOpen && transporterSelected === 'have-trans' && (
          <RegisterCard title="Transporter Details">
            <TransporterDetails
              isEdit={false}
              handleCompleteNewTransporter={handleCompleteNewTransporter}
              onClose={() => {
                console.log('hitting');
                // setReloadApplication(true);
                setHandleNewTransporterOpen(false);
              }}
            />
          </RegisterCard>
        )}
        {console.log('transporter details', transporterDetails)}
        {transporterDetails?.length > 0 &&
          transporterSelected === 'have-trans' && (
            <SelectedTransporterListTable
              transporterDetails={transporterDetails}
              handleComplete={handleComplete}
              reloadApplicationTrigger={reloadApplicationTrigger}
              handleAfterDelete={handleAfterDelete}
            />
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

        <Button variant="contained" onClick={handleTransporterSubmit}>
          Save and Continue
        </Button>
      </FooterWrapper>
    </>
  );
}
