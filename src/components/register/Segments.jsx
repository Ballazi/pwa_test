import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Radio,
  TextField,
  Autocomplete,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TitleContainer from '../card/TitleContainer';
import RegisterCard from '../card/RegisterCard';
import ContentWrapper from '../form-warpper/ContentWrapper';
import FooterWrapper from '../form-warpper/FooterWrapper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  nameValidator,
  requiredValidatorOfArray,
} from '../../validation/common-validator';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SegmentsUpdate from './popup/SegmentsUpdate';
import {
  createSegment,
  viewSegment,
  deleteSegment,
  getSegmentTransporter,
} from '../../api/register/segment-details';
import BackdropComponent from '../backdrop/Backdrop';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';

const schema = yup.object().shape({
  name: nameValidator,
  transporter_list: requiredValidatorOfArray('Transporters'),
});

export default function Settings({
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
}) {
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [segments, setSegments] = useState('');
  const [addSegments, setAddSegments] = useState(false);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [kamRows, setKamRows] = useState([]);
  const KamColumns = ['Sl no.', 'Segment', 'Transporters', 'options'];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const [rowObject, setRowObject] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [segmentOptions, setSegmentOptions] = useState([]);
  const [deleteRowData, setDeleteRowData] = useState({});
  const dispatch = useDispatch();
  const myDivRef = useRef(null);
  const shipperId = localStorage.getItem('shipper_id');
  const shipperName = localStorage.getItem('shipper_name');

  // const segmentOptions = [
  //   { label: 'Transporter 1', value: '09798904-b145-4649-8ea5-b0399abc1218' },
  // ];

  const fetchSegmentTransporterData = () => {
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
    };
    return getSegmentTransporter(payload)
      .then((res) => {
        if (res.data.success === true) {
          const updateSegment = res.data.data.map((item) => {
            return {
              label: item.name,
              value: item.trnsp_id,
            };
          });
          setSegmentOptions(updateSegment);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          // setSegmentOptions([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchSegmentData = () => {
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
    };
    return viewSegment(payload)
      .then((res) => {
        if (res.data.success === true) {
          // dispatch(
          //   openSnackbar({ type: 'success', message: res.data.clientMessage })
          // );
          setKamRows(res.data.data);
          res.data.data.length !== 0 ? setShowTable(true) : setShowTable(false);
          res.data.data.length !== 0
            ? setSegments('have Segments')
            : setSegments('No Segments');
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setKamRows([]);
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
    const fetchData = async () => {
      await fetchSegmentTransporterData();
      fetchSegmentData();
    };

    fetchData();
  }, []);

  useEffect(() => {
    //for smooth scroll
    if (addSegments === true && myDivRef.current) {
      myDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [addSegments]);

  const handleSaveButtonClick = (form_data) => {
    setIsLoading(true);
    const transporterList = form_data.transporter_list.map((ele) => ele.value);
    const payload = {
      name: form_data.name.toUpperCase(),
      seg_shipper_id: shipperId,
      transporter_list: transporterList,
    };
    createSegment(payload)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          fetchSegmentData();
          handleCloseSegment();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setSelectedSegments([]);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateRow = (data) => {
    const trans_list = data.transporters.map((ele) => ele.mts_transporter_id);
    const payload = {
      seg_id: data.seg_id,
      name: data.name,
      trans_list,
    };
    setRowObject(payload);
    setOpenUpdateModel(true);
  };

  const handleClose = () => {
    setOpenUpdateModel(false);
  };

  const saveUpdateHandler = () => {
    fetchSegmentData();
    handleClose();
  };

  const deleteRow = (data) => {
    setDeleteRowData(data);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    setIsLoading(true);
    deleteSegment(deleteRowData.seg_id)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          fetchSegmentData();
          closeDeleteDialog();
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSegments = (segments) => {
    setSegments(segments);
  };

  const handleSelectedSegmentsChange = (newValue) => {
    setSelectedSegments(newValue);
  };

  const handleCloseSegment = () => {
    setAddSegments(false);
    reset();
  };

  const nextHandler = () => {
    if (segments === '') {
      dispatch(
        openSnackbar({ type: 'error', message: 'Please select an option' })
      );
    } else if (segments === 'have Segments') {
      if (kamRows.length === 0) {
        dispatch(
          openSnackbar({ type: 'error', message: 'Please create segment' })
        );
      } else {
        handleNext();
      }
    } else {
      handleNext();
    }
  };

  const handleTransportChipDelete = (data) => {
    const filteredData = selectedSegments.filter(
      (ele) => ele.label !== data.label
    );
    setSelectedSegments(filteredData);
    setValue('transporter_list', [...filteredData]);
  };

  const transportersName = (id) => {
    const stateLabel = segmentOptions?.filter((ele) => ele.value === id);
    return stateLabel[0]?.label;
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      {openUpdateModel ? (
        <SegmentsUpdate
          rowObject={rowObject}
          saveUpdateHandler={saveUpdateHandler}
          handleClose={handleClose}
          shipper_id={shipperId}
        />
      ) : null}

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <div className="customCardheader">
          <Typography variant="h4"> Delete Material</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} variant="contained" color="error">
            No
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <ContentWrapper>
        <TitleContainer>
          <Typography variant="h3">Segments</Typography>
          <Typography
            sx={{
              fontWeight: 400,
              marginTop: '8px',
              color: '#8A919D',
            }}
            variant="body1"
            mb={1}
          >
            Fill out / Update Settings Details
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <div
                className={`radio-option ${
                  segments === 'have Segments' ? 'selected' : ''
                }`}
                onClick={() => handleSegments('have Segments')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={segments === 'have Segments'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">Have Segments</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div
                className={`radio-option ${
                  segments === 'No Segments' ? 'selected' : ''
                }`}
                onClick={() => handleSegments('No Segments')}
                style={
                  kamRows.length != 0
                    ? { pointerEvents: 'none', cursor: 'not-allowed' }
                    : {}
                }
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={segments === 'No Segments'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">{`Don't Have Segments`}</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
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
                    <Grid item xs={12} sm={5} md={4}>
                      <Typography variant="h4">Segment List</Typography>
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
                              {kamRows.length}
                            </Box>
                            <Typography>Segment Added</Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          {/* <Button
                            color="primary"
                            style={{ marginLeft: '10px' }}
                          >
                            Collapse list
                          </Button> */}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: '#065AD81A' }}>
                        <TableRow>
                          {KamColumns.map((column) => (
                            <TableCell key={column}>{column}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {kamRows.length === 0
                          ? 'No data to show'
                          : kamRows.map((row, rowIndex) => (
                              <TableRow key={row}>
                                <TableCell>
                                  <Typography>{rowIndex + 1}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{row.name}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {row.transporters
                                      .map((seg) =>
                                        transportersName(seg.mts_transporter_id)
                                      )
                                      .join(', ')}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <IconButton onClick={() => updateRow(row)}>
                                    <BorderColorIcon
                                      fontSize="small"
                                      color="primary"
                                    />
                                  </IconButton>
                                  <IconButton
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => deleteRow(row)}
                                  >
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
        {segments === 'have Segments' ? (
          <RegisterCard>
            <Box sx={{ display: 'flex' }}>
              <Typography style={{ marginBottom: '20px' }} variant="h4">
                Create Segments
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginLeft: 'auto' }}
                onClick={() => setAddSegments(!addSegments)}
              >
                Add Segments
              </Button>
            </Box>
          </RegisterCard>
        ) : null}

        {addSegments ? (
          <Box id="myDiv" ref={myDivRef}>
            <form onSubmit={handleSubmit(handleSaveButtonClick)}>
              <RegisterCard title="Segment details">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={4}>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          {...field}
                          label="Segment Name*"
                          size="small"
                          variant="filled"
                          error={Boolean(errors.name)}
                          helperText={errors.name?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={5}>
                    <Controller
                      name="transporter_list"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          limitTags={2}
                          id="regions-select"
                          options={segmentOptions}
                          popupIcon={<KeyboardArrowDownIcon />}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                          size="small"
                          getOptionLabel={(option) => option.label}
                          onChange={(_, newValue) => {
                            field.onChange(newValue);
                            handleSelectedSegmentsChange(newValue);
                          }}
                          value={selectedSegments}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Transporters to include in this segment*"
                              variant="filled"
                              fullWidth
                              size="small"
                              error={Boolean(errors.transporter_list)}
                              helperText={errors.transporter_list?.message}
                            />
                          )}
                          renderTags={(value) => (
                            <Box>{value.length} Transporters Slected</Box>
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="h4">
                        Transporters Selected
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Box sx={{ width: '100%' }}>
                      {selectedSegments.map((segment) => (
                        <Chip
                          key={segment.value}
                          label={segment.label}
                          onDelete={() => handleTransportChipDelete(segment)}
                          variant="outlined"
                          color="primary"
                          sx={{ mr: '8px', mb: 1 }}
                        />
                      ))}
                    </Box>
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
                        color="secondary"
                        onClick={handleCloseSegment}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ marginLeft: 2 }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </RegisterCard>
            </form>
          </Box>
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
            onClick={() => nextHandler()}
            disabled={currentStep === stepsContent.length - 1 || addSegments}
          >
            Continue
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
