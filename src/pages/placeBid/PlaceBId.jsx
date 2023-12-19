import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Typography,
  Dialog,
  TextField,
  TextareaAutosize,
  IconButton,
  Tooltip,
  Button,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  DialogActions,
  FormControl,
  FormLabel,
  Tabs,
  Tab
} from '@mui/material';
import moment from 'moment/moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { DataGrid } from '@mui/x-data-grid';
import CountdownCell from '../load-management/create-load/CountdownCell';
import PlaceBidFilter from './placeBidFilter/PlaceBidFilter';
import BackdropComponent from '../../components/backdrop/Backdrop';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import {
  transporterPostBid,
  incrementBid,
  getTripDataForShipper,
  getTripDataForShipperCompleted,
  getTripDataForCategory,
  getTripDataForCategoryLost,
  getlowestBId,
  getBidDetails,
  transporterBidMatch,
} from '../../api/placebid/placebid';
import ViewBidData from './bidView';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VehicleInformation from './vehicle/VehicleInformation';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  positiveNumberValidation,
  fieldWithNoValidation,
} from '../../validation/common-validator';

const schema = yup.object().shape({
  bidMatchRate: positiveNumberValidation,
  bidMatchComment: fieldWithNoValidation,
});


export default function PlaceBid({ status }) {
  const [openModal, setOpenModal] = useState(false);
  const [placeModal, setPlaceModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [rows, setRows] = useState([]);
  const [bidPrice, setBidPrice] = useState('');
  const [comment, setComment] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('live');
  const [placeBidModal, setPlaceBIdModal] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [filteredRows, setFilteredRows] = useState([]);
  const [apiParticipation, setApiParticipation] = useState(0);
  const [statusTypeApi, setStatusTypeApi] = useState('all');
  const [bidlowestPrice, setBidLowestBidPrice] = useState('');
  const [transporterLowestPrice, setTransporterLowestPrice] = useState('');
  const [pendingTries, setPendingTries] = useState('');
  const [noOfTries, setNoOfTries] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedID] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [position, setPosition] = useState('');
  const [id, setId] = useState('');
  const [vehicle, setVehicle] = useState(false);
  const [asighnVehicle, setAsighnVehicle] = useState('');
  const [quotation, setQuotation] = useState('');
  const [bidMatcPopup, setBidMatcPopup] = useState(false);
  const [bidMatchRate, setBidMatchRate] = useState('');
  const [bidMatchComment, setBidMatchComment] = useState('');
  const [matchPrice, setMatchPrice] = useState('yes');
  const [selectedObject, setSelectedObject] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    setValue,
    setError,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleStatusTypeChange = (event) => {
    setStatusTypeApi(event.target.value);
  };

  const handleParticipationChange = (event, newValue) => {
    setApiParticipation(newValue);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    const filteredRows = rows.filter((row) =>
      Object.values(row).some((fieldValue) =>
        String(fieldValue).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredRows(filteredRows);
  };
  useEffect(() => {
    if (
      status === 'not_started' ||
      status === 'live' ||
      status === 'active' ||
      status === 'pending'
    ) {
      if (
        status === 'not_started' ||
        status === 'live' ||
        status === 'active' ||
        status === 'pending'
      ) {
        fetchData();
      }
    } else if (status === 'selected') {
      fetchDataCategory();
    } else if (status === 'completed') {
      fetchCompletedData();
    } else if (status === 'lost') {
      fetchDataCategoryLost();
    }

    console.log(statusTypeApi);

    // Reset the flag or state after the effect is triggered
    // setFilterSubmitted(false);
  }, [statusTypeApi, apiParticipation, refresh, tabValue]);

  const fetchData = () => {
    setIsLoading(true);
    getTripDataForShipper(status, tabValue)
      .then((res) => {
        if (res.data.success === true) {
          setIsLoading(false);
          console.log(res.data.data.all);
          if (statusTypeApi === 'all') {
            const rowValue = rowReturnFunction(res.data.data.all);
            console.log(rowValue);

            setRows(rowValue);
            setFilteredRows(rowValue);
          } else if (statusTypeApi === 'private') {
            const rowValue = rowReturnFunction(res.data.data.private);
            console.log(rowValue);
            setRows(rowValue);
            setFilteredRows(rowValue);
          } else if (statusTypeApi === 'public') {
            const rowValue = rowReturnFunction(res.data.data.public);
            console.log(rowValue);
            setRows(rowValue);
            setFilteredRows(rowValue);
          }

          // setIsLoading(false)
        } else {
          setIsLoading(false);
          dispatch(
            openSnackbar({ type: 'error', message: res.data.devMessage })
          );
          // setIsLoading(false)
        }
      })
      .catch((error) => {
        setIsLoading(false);
        // dispatch(
        //   openSnackbar({ type: "error", message: error.data.devMessage })
        // );
        // setIsLoading(false)
      });
  };

  const fetchCompletedData = () => {
    setIsLoading(true);
    getTripDataForShipperCompleted(status)
      .then((res) => {
        if (res.data.success === true) {
          setIsLoading(false);
          console.log(res.data.data.all);
          if (statusTypeApi === 'all') {
            const rowValue = rowReturnFunction(res.data.data.all);
            console.log(rowValue);

            setRows(rowValue);
            setFilteredRows(rowValue);
          } else if (statusTypeApi === 'private') {
            const rowValue = rowReturnFunction(res.data.data.private);
            console.log(rowValue);
            setRows(rowValue);
            setFilteredRows(rowValue);
          } else if (statusTypeApi === 'public') {
            const rowValue = rowReturnFunction(res.data.data.public);
            console.log(rowValue);
            setRows(rowValue);
            setFilteredRows(rowValue);
          }

          // setIsLoading(false)
        } else {
          setIsLoading(false);
          dispatch(
            openSnackbar({ type: 'error', message: res.data.devMessage })
          );
          // setIsLoading(false)
        }
      })
      .catch((error) => {
        setIsLoading(false);
        // dispatch(
        //   openSnackbar({ type: "error", message: error.data.devMessage })
        // );
        // setIsLoading(false)
      });
  };

  const fetchDataCategory = () => {
    setIsLoading(true);
    getTripDataForCategory()
      .then((res) => {
        if (res.data.success === true) {
          setIsLoading(false);
          console.log(res.data.data);
          const rowValue = rowReturnFunction(res.data.data);
          console.log(rowValue);
          setRows(rowValue);
          setFilteredRows(rowValue);
        } else {
          setIsLoading(false);
          dispatch(
            openSnackbar({ type: 'error', message: res.data.devMessage })
          );
          // setIsLoading(false)
        }
      })
      .catch((error) => {
        setIsLoading(false);
        // dispatch(
        //   openSnackbar({ type: "error", message: error.data.devMessage })
        // );
        // setIsLoading(false)
      });
  };

  const fetchDataCategoryLost = () => {
    const payload = {
      particpated: apiParticipation === 0,
    };
    setIsLoading(true);
    getTripDataForCategoryLost(payload)
      .then((res) => {
        if (res.data.success === true) {
          setIsLoading(false);
          console.log(res.data.data);
          const rowValue = rowReturnFunction(res.data.data);
          console.log(rowValue);
          setRows(rowValue);
          setFilteredRows(rowValue);
        } else {
          setIsLoading(false);
          dispatch(
            openSnackbar({ type: 'error', message: res.data.devMessage })
          );
          // setIsLoading(false)
        }
      })
      .catch((error) => {
        setIsLoading(false);
        // dispatch(
        //   openSnackbar({ type: "error", message: error.data.devMessage })
        // );
        // setIsLoading(false)
      });
  };
  const fetchLowestBid = (row) => {
    console.log(row.id);
    setIsLoading(true);
    getlowestBId(row.id)
      .then((res) => {
        if (res.data.success === true) {
          setIsLoading(false);
          console.log('check 4', res.data.data);
          setPendingTries(res.data.data.pending_tries);
          const comment =
            res.data.data.last_comment === null
              ? ''
              : res.data.data.last_comment;
          setComment(comment);

          setNoOfTries(res.data.data.no_of_tries);
          setTransporterLowestPrice(res.data.data.transporter_lowest_price);
          setPosition(res.data.data.position);
          setBidLowestBidPrice(res.data.data.bid_lowest_price);
        } else {
          setIsLoading(false);
          dispatch(
            openSnackbar({ type: 'error', message: res.data.devMessage })
          );
          // setIsLoading(false)
        }
      })
      .catch((error) => {
        setIsLoading(false);
        // dispatch(
        //   openSnackbar({ type: "error", message: error.data.devMessage })
        // );
        // setIsLoading(false)
      });
  };

  const rowReturnFunction = (data) => {
    const arrayOfObjects = data.map((ele, i) => ({
      id: ele.bid_id,
      loadId: `L-${ele.bid_id.slice(-5)}`.toUpperCase(),
      // loadType: ele.load_type,
      source: ele.src_city,
      destination: ele.dest_city,
      bid_extended_time: ele.bid_extended_time ? ele.bid_extended_time : '-',
      shipperName: ele.shipper_name,
      rate_qoute_type: ele.rate_qoute_type,
      show_current_lowest_rate_transporter:
        ele.show_current_lowest_rate_transporter,
      bid_lowest_price: ele.bid_lowest_price ? ele.bid_lowest_price : '-',
      position: ele.position ? ele.position : '-',
      reportDate: `${moment(ele.reporting_from_time).format(
        'YYYY-MM-DD hh:mm A'
      )} - ${moment(ele.reporting_to_time).format('YYYY-MM-DD hh:mm A')}`,
      bidDate: moment(ele.bid_time).format('YYYY-MM-DD hh:mm A'),
      bid_end_time: moment(ele.bid_end_time).format('YYYY-MM-DD hh:mm A'),
      bidStatus: 'Pending',
      vehicleAddStatus: ele.load_status,
      no_of_fleets_assigned: ele.no_of_fleets_assigned,
      pmr_price: ele.pmr_price,
      is_pmr_approved: ele.is_pmr_approved,
      transporter_lowest_price: ele.transporter_lowest_price,
      price: ele.price,
      pmr_comment: ele.pmr_comment
    }));
    return arrayOfObjects;
  };

  const handleViewClick = (row) => {
    console.log(row);
    setSelectedID(row.id);
    getBidDetails(row.id)
      .then((res) => {
        if (res.data.success === true) {
        } else {
          setIsLoading(false);
          dispatch(
            openSnackbar({ type: 'error', message: res.data.devMessage })
          );
          // setIsLoading(false)
        }
      })
      .catch((error) => {
        setIsLoading(false);
        // dispatch(
        //   openSnackbar({ type: "error", message: error.data.devMessage })
        // );
        // setIsLoading(false)
      });

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent(null);
    setId('');
    setVehicle(false);
    setAsighnVehicle('');
  };

  const publishBid = (row) => {
    if (bidPrice) {
      setIsLoading(true);

      const payload = {
        rate: parseFloat(bidPrice),
        comment: comment,
      };
      console.log(payload);
      transporterPostBid(row.id, payload)
        .then((res) => {
          if (res.data.success === true) {
            incrementBid(row.id);
            dispatch(
              openSnackbar({ type: 'success', message: res.data.clientMessage })
            );

            setIsLoading(false);
            fetchData();
            setBidPrice('');
            setComment('');

            setSelectedRow(null);
            setPlaceModal(false);
          } else {
            setIsLoading(false);
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
            console.error('Error:', res.data.clientMessage);
          }
        })
        .catch((error) => {
          setSelectedRow(null);
          setPlaceModal(false);
          setIsLoading(false);
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          console.error('Error', error);
        });
    } else {
      dispatch(
        openSnackbar({ type: 'error', message: 'Please enter the bid price' })
      );
    }
  };

  const columnsReturnFunction = () => {
    switch (true) {
      case status === 'live':
        return [
          { field: 'loadId', headerName: 'Load Id', width: 90 },
          { field: 'shipperName', headerName: 'Shipper Name', width: 210 },
          { field: 'source', headerName: 'Source', width: 150 },
          { field: 'destination', headerName: 'Destination', width: 150 },
          {
            field: 'rate_qoute_type',
            headerName: 'Rate Quotation Type',
            width: 150,
          },
          {
            field: 'reportDate',
            headerName: 'Reporting Date & Time',
            width: 250,
          },
          { field: 'bidDate', headerName: 'Bid Date & Time', width: 210 },

          {
            field: 'bid_end_time',
            headerName: 'Bid End Date & Time',
            width: 210,
          },
          {
            field: 'bid_extended_time',
            headerName: 'Total Bid Extended Time (mins)',
            width: 120,
          },

          {
            field: 'countdown',
            headerName: 'Countdown',
            width: 150,
            renderCell: (params) => {
              const bidDate = new Date(params.row.bid_end_time);
              const now = new Date();

              // Check if bidDate is greater than the current date and time
              if (bidDate > now) {
                return <CountdownCell bidDate={bidDate} />;
              } else {
                return (
                  <span
                    style={{
                      backgroundColor: '#065AD8',
                      color: 'white',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    }}
                  >
                    Time Over{' '}
                  </span>
                );
              }
            },
          },
          {
            field: 'bid_lowest_price',
            headerName: 'Bid lowest price',
            width: 120,
          },
          { field: 'position', headerName: 'Position', width: 120 },

          {
            field: 'action',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View">
                  <IconButton onClick={() => handleViewClick(params.row)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {status === 'not_started' || status === 'live' ? (
                  <Tooltip title="Place Bid">
                    <IconButton
                      onClick={() => {
                        setSelectedRow(params.row);
                        fetchLowestBid(params.row);
                        setPlaceModal(true);
                        setQuotation(params.row.rate_qoute_type);
                      }}
                    >
                      <CurrencyRupeeIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ''
                )}
              </>
            ),
          },
        ];
      case status === 'pending':
        return [
          { field: 'loadId', headerName: 'Load Id', width: 90 },
          {
            field: 'shipperName',
            headerName: 'Shipper Name',
            width: 210,
          },
          { field: 'source', headerName: 'Source', width: 150 },
          { field: 'destination', headerName: 'Destination', width: 150 },
          {
            field: 'rate_qoute_type',
            headerName: 'Rate Quotation Type',
            width: 150,
          },
          {
            field: 'reportDate',
            headerName: 'Reporting Date & Time',
            width: 250,
          },
          { field: 'bidDate', headerName: 'Bid Date & Time', width: 210 },

          {
            field: 'bid_end_time',
            headerName: 'Bid End Date & Time',
            width: 210,
          },
          {
            field: 'bid_extended_time',
            headerName: 'Total Bid Extended Time (mins)',
            width: 120,
          },
          {
            field: 'bid_lowest_price',
            headerName: 'Bid lowest price',
            width: 120,
          },
          { field: 'position', headerName: 'Position', width: 120 },
          {
            field: 'transporter_lowest_price',
            headerName: 'Transporter Rate',
            width: 120,
            renderCell: (params) => (
              <Typography sx={{ fontSize: '14px' }}>
                {params.row.transporter_lowest_price === null
                  ? '-'
                  : `₹ ${params.row.transporter_lowest_price}`}
              </Typography>
            ),
          },
          {
            field: 'pmr_price',
            headerName: 'Negotiated Rate',
            width: 120,
            renderCell: (params) => (
              <Typography>
                {params.row.pmr_price === null ||
                  params.row.is_pmr_approved === false
                  ? '-'
                  : params.row.pmr_price}
              </Typography>
            ),
          },
          {
            field: 'action',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View">
                  <IconButton onClick={() => handleViewClick(params.row)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>

                {params.row.pmr_price &&
                  params.row.is_pmr_approved === false ? (
                  <Tooltip title="Price match request">
                    <IconButton
                      onClick={() => handlePriceMatchRequest(params.row)}
                    >
                      <SwapHorizontalCircleIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </>
            ),
          },
        ];
      case status === 'not_started' || status === 'active':
        return [
          { field: 'loadId', headerName: 'Load Id', width: 90 },
          { field: 'shipperName', headerName: 'Shipper Name', width: 210 },
          { field: 'source', headerName: 'Source', width: 150 },
          { field: 'destination', headerName: 'Destination', width: 150 },
          {
            field: 'rate_qoute_type',
            headerName: 'Rate Quotation Type',
            width: 150,
          },
          {
            field: 'reportDate',
            headerName: 'Reporting Date & Time',
            width: 250,
          },
          { field: 'bidDate', headerName: 'Bid Date & Time', width: 210 },

          {
            field: 'bid_end_time',
            headerName: 'Bid End Date & Time',
            width: 120,
          },
          // {
          //   field: 'bid_extended_time',
          //   headerName: 'Bid Extended Time (mins)',
          //   width: 210,
          // },

          {
            field: 'countdown',
            headerName: 'Countdown',
            width: 150,
            renderCell: (params) => {
              const bidDate = new Date(params.row.bidDate);
              const now = new Date();

              // Check if bidDate is greater than the current date and time
              if (bidDate > now) {
                return <CountdownCell bidDate={bidDate} />;
              } else {
                return (
                  <span
                    style={{
                      backgroundColor: '#065AD8',
                      color: 'white',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    }}
                  >
                    Time Over{' '}
                  </span>
                );
              }
            },
          },
          // {
          //   field: 'bid_lowest_price',
          //   headerName: 'Bid lowest price',
          //   width: 210,
          // },
          // { field: 'position', headerName: 'Position', width: 210 },

          {
            field: 'action',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View">
                  <IconButton onClick={() => handleViewClick(params.row)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {status === 'not_started' ||
                  status === 'active' ||
                  status === 'live' ? (
                  status === 'not_started' &&
                    params.row.show_current_lowest_rate_transporter ? (
                    <Tooltip title="you can place a bid once it is live">
                      <IconButton sx={{ color: '#d4d6d5' }}>
                        <CurrencyRupeeIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Place Bid">
                      <IconButton
                        onClick={() => {
                          setSelectedRow(params.row);
                          fetchLowestBid(params.row);
                          setPlaceModal(true);
                          setQuotation(params.row.rate_qoute_type);
                        }}
                      >
                        <CurrencyRupeeIcon />
                      </IconButton>
                    </Tooltip>
                  )
                ) : null}
              </>
            ),
          },
        ];
      case status === 'completed':
        return [
          { field: 'loadId', headerName: 'Load Id', width: 90 },
          { field: 'shipperName', headerName: 'Shipper Name', width: 210 },
          { field: 'source', headerName: 'Source', width: 150 },
          { field: 'destination', headerName: 'Destination', width: 150 },
          {
            field: 'rate_qoute_type',
            headerName: 'Rate Quotation Type',
            width: 150,
          },
          {
            field: 'reportDate',
            headerName: 'Reporting Date & Time',
            width: 250,
          },
          { field: 'bidDate', headerName: 'Bid Date & Time', width: 210 },

          {
            field: 'bid_end_time',
            headerName: 'Bid End Date & Time',
            width: 210,
          },
          {
            field: 'bid_extended_time',
            headerName: 'Total Bid Extended Time (mins)',
            width: 120,
          },
          { field: 'position', headerName: 'Position', width: 120 },
          {
            field: 'price',
            headerName: 'Confirmed Rate',
            width: 120,
            renderCell: (params) => (
              <Typography sx={{ fontSize: '14px' }}>
                {params.row.price === null ? '-' : `₹ ${params.row.price}`}
              </Typography>
            ),
          },
          {
            field: 'action',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View">
                  <IconButton onClick={() => handleViewClick(params.row)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ];
      case status === 'selected':
        return [
          { field: 'loadId', headerName: 'Load Id', width: 90 },
          { field: 'shipperName', headerName: 'Shipper Name', width: 210 },
          { field: 'source', headerName: 'Source', width: 150 },
          { field: 'destination', headerName: 'Destination', width: 150 },
          {
            field: 'rate_qoute_type',
            headerName: 'Rate Quotation Type',
            width: 150,
          },
          {
            field: 'reportDate',
            headerName: 'Reporting Date & Time',
            width: 250,
          },
          { field: 'bidDate', headerName: 'Bid Date & Time', width: 210 },

          {
            field: 'bid_end_time',
            headerName: 'Bid End Date & Time',
            width: 210,
          },
          {
            field: 'bid_extended_time',
            headerName: 'Total Bid Extended Time (mins)',
            width: 120,
          },
          {
            field: 'bid_lowest_price',
            headerName: 'Bid lowest price',
            width: 120,
          },

          { field: 'position', headerName: 'Position', width: 120 },
          {
            field: 'price',
            headerName: 'Confirmed Rate',
            width: 120,
            renderCell: (params) => (
              <Typography sx={{ fontSize: '14px' }}>
                {params.row.price === null ? '-' : params.row.price}
              </Typography>
            ),
          },
          {
            field: 'action',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View">
                  <IconButton onClick={() => handleViewClick(params.row)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {params.row.vehicleAddStatus === 'confirmed' && (
                  <Tooltip title="Add Vehicle">
                    <IconButton onClick={() => VehicleAdd(params.row)}>
                      <LocalShippingIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ),
          },
        ];
      case status === 'lost':
        return [
          { field: 'loadId', headerName: 'Load Id', width: 90 },
          { field: 'shipperName', headerName: 'Shipper Name', width: 210 },
          { field: 'source', headerName: 'Source', width: 150 },
          { field: 'destination', headerName: 'Destination', width: 150 },
          {
            field: 'rate_qoute_type',
            headerName: 'Rate Quotation Type',
            width: 150,
          },
          {
            field: 'reportDate',
            headerName: 'Reporting Date & Time',
            width: 250,
          },
          { field: 'bidDate', headerName: 'Bid Date & Time', width: 210 },

          {
            field: 'bid_end_time',
            headerName: 'Bid End Date & Time',
            width: 210,
          },
          {
            field: 'bid_extended_time',
            headerName: 'Total Bid Extended Time (mins)',
            width: 120,
          },

          {
            field: 'bid_lowest_price',
            headerName: 'Bid lowest price',
            width: 120,
          },
          { field: 'position', headerName: 'Position', width: 120 },

          {
            field: 'action',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View">
                  <IconButton onClick={() => handleViewClick(params.row)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {status === 'not_started' || status === 'live' ? (
                  <Tooltip title="Bid">
                    <IconButton
                      onClick={() => {
                        setSelectedRow(params.row);
                        fetchLowestBid(params.row);
                        setPlaceModal(true);
                        console.log(params.row);
                      }}
                    >
                      <CurrencyRupeeIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ''
                )}
              </>
            ),
          },
        ];
    }
  };

  const columns = columnsReturnFunction();

  const VehicleAdd = (row) => {
    setId(row.id);
    setAsighnVehicle(row.no_of_fleets_assigned);
    setVehicle(true);
  };

  const handlePriceMatchRequest = (obj) => {
    setBidMatcPopup(true);
    setSelectedObject(obj);
  };

  const closeBidMatchModal = () => {
    setBidMatcPopup(false);
    setBidMatchRate('');
    setBidMatchComment('');
    setMatchPrice('yes');
    setSelectedObject({});
  };

  const bidMatchHandler = (data) => {
    if (selectedObject.pmr_price > data.bidMatchRate && matchPrice !== "yes") {
      setError('bidMatchRate', {
        message: 'Final price must not be lesser than requested price.',
        type: 'validate',
      });
    }
    else {
      setIsLoading(true);
      const payload = {
        approval: matchPrice === 'yes',
        rate:
          matchPrice === 'yes'
            ? parseFloat(selectedObject.pmr_price)
            : parseFloat(data.bidMatchRate),
        comment: matchPrice === 'yes' ? '' : data.bidMatchComment,
      };
      transporterBidMatch(selectedObject.id, payload)
        .then((res) => {
          if (res.data.success === true) {
            fetchData();
            closeBidMatchModal();
            setIsLoading(false);
            dispatch(
              openSnackbar({ type: 'success', message: res.data.clientMessage })
            );
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      {vehicle ? (
        <VehicleInformation
          asighnedVehicle={asighnVehicle}
          id={id}
          handleCloseModal={handleCloseModal}
        />
      ) : null}

      <Dialog
        maxWidth="md"
        scroll="paper"
        open={bidMatcPopup}
        onClose={() => closeBidMatchModal()}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="p">Bid Match Rate</Typography>
        </div>
        <form onSubmit={handleSubmit(bidMatchHandler)}>
          <DialogContent>
            <div>
              <FormControl>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Do you want to match the price: ₹{selectedObject.pmr_price} ?
                </Typography>
                {selectedObject.pmr_comment &&
                  (
                    <div style={{ marginBottom: 2, fontSize: "14px" }}>
                      Shipper statement: <b> {selectedObject.pmr_comment} </b>
                    </div>
                  )
                }
                <RadioGroup
                  aria-label="participation"
                  name="participation"
                  row
                  value={matchPrice}
                  onChange={(e) => setMatchPrice(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
              {matchPrice === 'no' && (
                <>
                  <div>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Please enter final price and comment
                    </Typography>
                  </div>
                  <Controller
                    name="bidMatchRate"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        fullWidth
                        label="Final price"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        // value={bidMatchRate}
                        // onChange={(e) => setBidMatchRate(e.target.value)}
                        error={!!errors.bidMatchRate}
                        helperText={errors.bidMatchRate?.message}
                      />
                    )}
                  />
                  <Controller
                    name="bidMatchComment"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextareaAutosize
                        label="Comment"
                        {...field}
                        placeholder="Enter your comment..."
                        minRows={4}
                        style={{ width: '100%', marginBottom: '15px' }}
                      // value={bidMatchComment}
                      // onChange={(e) => setBidMatchComment(e.target.value)}
                      />
                    )}
                  />
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            // onClick={() => {
            //   bidMatchHandler();
            // }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              autoFocus
              onClick={() => closeBidMatchModal()}
            >
              Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Grid container spacing={2}>
        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
          <PlaceBidFilter onFilterSubmit={handleFilterSubmit} />
        </Grid> */}
      </Grid>

      <Card style={{ marginTop: '20px', padding: '10px' }}>
        <div className="customCardheader">
          <Typography variant="h4">Manage Bid</Typography>
        </div>
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              {status === 'live' && (
                <Grid item xs={12}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="scrollable auto tabs example"
                    sx={{
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#0080FF",
                      },
                    }}
                    variant="scrollable"
                    scrollButtons="off" // change auto for appear button
                  >
                    <Tab
                      label="Participated"
                      sx={{
                        border: "1px solid #0080FF",
                        marginRight: "5px",
                        borderRadius: "5px 5px 0 0",
                        color: "black",
                        backgroundColor: tabValue === 0 ? "#0080FF" : "transparent",
                      }}
                    />
                    <Tab
                      label="Not Participated"
                      sx={{
                        border: "1px solid #0080FF",
                        marginRight: "5px",
                        borderRadius: "5px 5px 0 0",
                        color: "black",
                        backgroundColor: tabValue === 1 ? "#0080FF" : "transparent",
                      }}
                    />
                  </Tabs>
                </Grid>
              )}
              <Grid item xs={12}>
                {status === 'not_started' ||
                  status === 'active' ||
                  status === 'live' ||
                  status === 'pending' ||
                  status === 'completed' ? (
                  <RadioGroup
                    aria-label="participation"
                    name="participation"
                    row
                    value={statusTypeApi}
                    onChange={handleStatusTypeChange}
                  >
                    <FormControlLabel value="all" control={<Radio />} label="All" />

                    <FormControlLabel
                      value="private"
                      control={<Radio />}
                      label="Private"
                    />
                    <FormControlLabel
                      value="public"
                      control={<Radio />}
                      label="Public"
                    />
                  </RadioGroup>
                ) : status === 'lost' ? (
                  <Tabs
                    value={apiParticipation}
                    onChange={handleParticipationChange}
                    aria-label="scrollable auto tabs example"
                    sx={{
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#0080FF",
                      },
                    }}
                    variant="scrollable"
                    scrollButtons="off" // change auto for appear button
                  >
                    <Tab
                      label="Participated"
                      sx={{
                        border: "1px solid #0080FF",
                        marginRight: "5px",
                        borderRadius: "5px 5px 0 0",
                        color: "black",
                        backgroundColor: apiParticipation === 0 ? "#0080FF" : "transparent",
                      }}
                    />
                    <Tab
                      label="Not Participated"
                      sx={{
                        border: "1px solid #0080FF",
                        marginRight: "5px",
                        borderRadius: "5px 5px 0 0",
                        color: "black",
                        backgroundColor: apiParticipation === 1 ? "#0080FF" : "transparent",
                      }}
                    />
                  </Tabs>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container sx={{ mb: 1 }} justifyContent="space-between">
                  <Grid item xs={7}></Grid>
                  <Grid item>
                    <Button
                      onClick={() => setRefresh(!refresh)}
                      variant="contained"
                      endIcon={<RefreshIcon />}
                    >
                      Refresh
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Search"
                  size="small"
                  value={searchValue}
                  onChange={handleSearchChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </Card>

      {openModal ? (
        <ViewBidData
          open={openModal}
          handleCloseModal={handleCloseModal}
          // selectedId={selectedId}
          selectedId={selectedId}
          status={status}
          selectedRow={selectedRow}
        />
      ) : null}

      <Dialog open={placeModal} onClose={() => setPlaceModal(false)}>
        <div className="customCardheader">
          <Typography variant="h4"> Enter your bidding amount</Typography>
        </div>
        <DialogContent>
          {status === 'live' && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h5" color="green" sx={{ mb: 2, mt: -2 }}>
                Position: {position !== null ? position : 'Not yet ranked.'}
              </Typography>

              <Typography>
                Tries Left:{' '}
                <Typography component="span" color="primary">
                  {pendingTries === null ? noOfTries : pendingTries}
                </Typography>
              </Typography>
            </Box>
          )}

          {transporterLowestPrice ? (
            <Typography variant="h5">
              Transporter Lowest Price:{' '}
              {transporterLowestPrice ? transporterLowestPrice : ''}
            </Typography>
          ) : (
            ''
          )}

          {bidlowestPrice ? (
            <Typography variant="h5">
              Bid Lowest Price: {bidlowestPrice ? bidlowestPrice : ''}
            </Typography>
          ) : (
            ''
          )}

          <TextField
            label="Bid Price *"
            fullWidth
            size="small"
            margin="normal"
            variant="outlined"
            value={bidPrice}
            onChange={(event) => setBidPrice(event.target.value)}
            InputProps={{
              style: { paddingRight: 0 },
              endAdornment: (
                <Box
                  sx={{
                    backgroundColor: '#F1F3F4',
                    margin: 0,
                    width: '90px',
                    height: '40px',
                    borderRadius: '3px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {quotation}
                </Box>
              ),
            }}
          />
          <TextareaAutosize
            label="Comment"
            placeholder="Enter your comment..."
            minRows={4}
            style={{ width: '100%', marginBottom: '15px' }}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedRow(null);
              setPlaceModal(false);
            }}
            color="error"
          >
            Close
          </Button>
          <Button
            onClick={() => publishBid(selectedRow)}
            color="primary"
            variant="contained"
          >
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
