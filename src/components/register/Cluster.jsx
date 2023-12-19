import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Radio,
  Button,
  TextField,
  TableContainer,
  TableBody,
  TableCell,
  IconButton,
  TableHead,
  TableRow,
  Table,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import InfoIcon from '@mui/icons-material/Info';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RegisterCard from '../card/RegisterCard';
import TitleContainer from '../card/TitleContainer';
import ContentWrapper from '../form-warpper/ContentWrapper';
import FooterWrapper from '../form-warpper/FooterWrapper';
import AlertPage from '../masterData/alert-component/AlertPage';

import {
  clusterNameValidator,
  clusterDetailsValidator,
} from '../../validation/common-validator';
const schema = yup.object().shape({
  clusterName: clusterNameValidator,
  clusterDetails: clusterDetailsValidator,
});

export default function Cluster({
  value,
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
}) {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  var len = 0;
  // const [val, setVal] = useState("");
  // const [val1, setVal1] = useState("");
  const [selectedClusterOption, setSelectedClusterOption] = useState('');
  const [isAddingCluster, setIsAddingCluster] = useState(false);
  // const [clusterDetails, setClusterDetails] = useState("");
  // const [editClusterDetails, setEditClusterDetails] = useState("");
  // const [clusterName, setClusterName] = useState("");
  // const [editClusterName, setEditClusterName] = useState("");
  const [isCreatingCluster, setIsCreatingCluster] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [kamRows, setKamRows] = useState([]);
  const [clustError, setClustError] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // Handle cluster option selection
  const handleClusterOptionSelect = (option) => {
    setSelectedClusterOption(option);
    localStorage.setItem('SelectedClusterOption', option);
    value(option);
    if (option === 'I Have Cluster') {
      setIsAddingCluster(true);
    } else {
      setIsAddingCluster(false);
      setIsCreatingCluster(false); // Reset the new Cluster creation state
      setShowTable(false);
    }
  };

  // Handle creating a new Cluster
  const handleCreateCluster = () => {
    setIsCreatingCluster(true);
  };
  const onSubmit = (data) => {
    console.log(data);
    setKamRows([...kamRows, data]);
    setIsCreatingCluster(false);
    setShowTable(true);
    reset();
    //write file handling logic here manually then call api
    // handleNext();
  };

  // const handleSaveButtonClick = () => {
  //   const newCluster = {
  //     ClusterName: clusterName,
  //     clusterDetails: clusterDetails,
  //   };
  //   setKamRows([...kamRows, newCluster]);
  //   setIsCreatingCluster(false);
  //   setShowTable(true);
  // };

  const KamColumns = ['Sl no.', 'Cluster name', 'Cluster details', 'options'];
  const [rows, setRows] = useState([{ id: 1, values: ['', '', ''] }]);
  // function handleCluster() {
  //   console.log("here", selectedClusterOption);
  //   // if (selectedClusterOption.length === 0) {
  //   //   console.log("if");
  //   //   setClustError("Please select a option");
  //   // } else {
  //   //   console.log("else");
  //   //   clustError && setClustError(null);
  //   //   handleNext();
  //   // }

  //   handleNext();
  // }

  console.log('err', clustError);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const [newTabValue, setNewTabValue] = useState('');
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');

  const closePopup = () => {
    setAlertType('');
    setMessage('');
  };

  const nextHandler = () => {
    console.log('selectedClusterOption', selectedClusterOption);
    if (selectedClusterOption === '') {
      setAlertType('error');
      setMessage('Please select any option');
    } else if (selectedClusterOption === 'I Have Cluster') {
      if (kamRows.length === 0) {
        setAlertType('error');
        setMessage('Please create Cluster');
      } else {
        handleNext();
      }
    } else {
      handleNext();
    }
  };

  return (
    <>
      {alertType !== '' ? (
        <AlertPage
          alertType={alertType}
          message={message}
          closePopup={closePopup}
        />
      ) : null}
      <ContentWrapper>
        <TitleContainer>
          <Typography variant="h3">Cluster</Typography>
          <Typography style={{ marginBottom: '30px' }} variant="p">
            Fill out Cluster details
          </Typography>
        </TitleContainer>
        {console.log('kam rows', kamRows)}
        <RegisterCard title="Select an option">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <div
                className={`radio-option ${
                  selectedClusterOption === 'I Have Cluster' ? 'selected' : ''
                }`}
                onClick={() => handleClusterOptionSelect('I Have Cluster')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedClusterOption === 'I Have Cluster'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">Have Cluster</Typography>
                </div>
                <div className="radioIcon2">
                  <Tooltip title="Lorium">
                    <InfoIcon />
                  </Tooltip>
                </div>
              </div>
              {/* {clustError && (
                <div>
                  <span style={{ color: "red" }}>{clustError}</span>
                </div>
              )} */}
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div
                className={`radio-option ${
                  selectedClusterOption === "Don't Have Cluster"
                    ? 'selected'
                    : ''
                }`}
                onClick={() => handleClusterOptionSelect("Don't Have Cluster")}
               
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedClusterOption === "Don't Have Cluster"}

                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">Don't Have Cluster</Typography>
                </div>
                <div className="radioIcon2">
                  <Tooltip title="Lorium">
                    <InfoIcon />
                  </Tooltip>
                </div>
              </div>
            </Grid>
          </Grid>
        </RegisterCard>

        {showTable && (
          <RegisterCard>
            <Grid item xs={12} style={{ marginBottom: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={4} md={4}>
                      <Typography variant="h4">Cluster List</Typography>
                    </Grid>
                    <Grid item>
                      <Grid container>
                        <Grid item>
                          <Grid
                            container
                            justifyContent="flex-start"
                            alignItems="center"
                          >
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                bgcolor: '#065AD81A',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                marginRight: '5px',
                                justifyContent: 'center',
                                fontSize: '14px',
                              }}
                            >
                              {rows.length}
                            </Box>
                            <Typography>Clusters Added</Typography>
                          </Grid>
                        </Grid>
                        {/* <Grid item>
                          <Button
                            color="primary"
                            style={{ marginLeft: "10px" }}
                          >
                            Collapse list
                          </Button>
                        </Grid> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: '#065AD81A' }}>
                        <TableRow>
                          {KamColumns.map((column, columnIndex) => (
                            <TableCell key={columnIndex}>{column}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {kamRows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell>
                              <Typography>{rowIndex + 1}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>{row.clusterName}</Typography>
                            </TableCell>

                            <TableCell>
                              <Typography>{row.clusterDetails}</Typography>
                            </TableCell>

                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleOpen();
                                  setSelectedRowData(row);
                                }}
                              >
                                <BorderColorIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </IconButton>

                              <IconButton style={{ marginLeft: '10px' }}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </RegisterCard>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="customCardheader">
            <Typography variant="h4">Edit Cluster Details</Typography>
          </div>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="editClusterName"
                  control={control}
                  defaultValue={
                    selectedRowData ? selectedRowData.clusterName : ''
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cluster Name"
                      size="small"
                      variant="filled"
                      fullWidth
                      // error={Boolean(errors.editClusterName)}
                      // helperText={errors.editClusterName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="editClusterDetails"
                  control={control}
                  defaultValue={
                    selectedRowData ? selectedRowData.clusterDetails : ''
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cluster Details"
                      size="small"
                      variant="filled"
                      fullWidth
                      // error={Boolean(errors.clusterDetails)}
                      // helperText={errors.clusterDetails?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              // onClick={handleSave}
              sx={{ marginLeft: 2 }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Cluster Card */}
        {selectedClusterOption === 'I Have Cluster' && isAddingCluster ? (
          <RegisterCard>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h4">Create Cluster</Typography>

              {/* Add other text fields for contact person, contact number, GST */}
              <Button
                variant="contained"
                color="primary"
                sx={{ marginLeft: 'auto' }}
                onClick={handleCreateCluster}
              >
                Start adding Cluster
              </Button>
            </Box>
          </RegisterCard>
        ) : null}

        {/* New Cluster Created Card */}
        {isCreatingCluster ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <RegisterCard title="Cluster Details">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="clusterName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cluster Name"
                        size="small"
                        variant="filled"
                        fullWidth
                        error={Boolean(errors.clusterName)}
                        helperText={errors.clusterName?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="clusterDetails"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cluster Details"
                        size="small"
                        variant="filled"
                        fullWidth
                        // onChange={(e) => setClusterDetails(e.target.value)}
                        error={Boolean(errors.clusterDetails)}
                        helperText={errors.clusterDetails?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="medium"
                      color="secondary"
                      onClick={() => setIsCreatingCluster(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={{ marginLeft: 2 }}
                      variant="contained"
                      size="medium"
                      color="primary"
                      type="submit"
                      // onClick={handleSaveButtonClick}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </RegisterCard>
          </form>
        ) : null}
      </ContentWrapper>
      <FooterWrapper>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep !== stepsContent.length - 1 ? (
          <Button
            variant="contained"
            type="submit"
            onClick={nextHandler}
            disabled={currentStep === stepsContent.length - 1}
          >
            Save and Continue
          </Button>
        ) : (
          <Button variant="contained" type="submit">
            Submit
          </Button>
        )}
      </FooterWrapper>
    </>
  );
}
