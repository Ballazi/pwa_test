import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Dialog,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  TableHead,
  Grid,
  TextareaAutosize,
  Card,
  CardContent,
} from '@mui/material';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import BackdropComponent from '../../../components/backdrop/Backdrop';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {
  getLiveBidDetails,
  getPendingBidDetails,
  getBidHistory,
  assignVehicel,
  assignNewBidValue,
  unAssignVehicel,
  getUnasighnHistory,
} from '../../../api/trip-management/manage-trip';
import HistoryIcon from '@mui/icons-material/History';
import moment from 'moment';
import RebidModel from '../load-view-model/RebidModel';
import { decodeToken } from 'react-jwt';
export default function TransporterDetails({
  selectedId,
  selectedEntity,
  status,
  transportSelectedRow,
  open,
  onClose,
  reason,
  row,
}) {
  const dispatch = useDispatch();
  const [showNegotiateDialog, setShowNegotiateDialog] = useState(false);
  const [approvalPopup, setApprovalPopup] = useState(false);
  const [bidMatcPopup, setBidMatchpopup] = useState(false);
  const [negotiateRate, setNegotiateRate] = useState('');
  const [BidMatchRate, setBidMatchRate] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [initialRows, setInitialRows] = useState([]);
  const [socket, setSocket] = useState(null);
  const [viewHistoryModel, setViewHistoryModel] = useState(false);
  const [viewUnasighnModal, setViewUnasighnedModal] = useState(false);
  const [bidHistoryData, setBidHistoryData] = useState([]);
  const [bidasighndata, setBidasighndata] = useState([]);
  const [bidHistoryNegotiData, setBidHistoryNegotiData] = useState({});
  const [transName, setTransName] = useState('');
  const [selectedRow, setSelectedRow] = useState([]);
  const [titleValue, setTitleValue] = useState({});
  const [titleValueAssign, setTitleValueAssign] = useState({});
  const [bidMatchComment, setBidMatchComment] = useState('');
  const [openUnassignModel, setOpenUnassignModel] = useState(false);
  const [transId, setTransId] = useState('');
  const [transporterData, setTransporterData] = useState([]);
  const [openRebidModal, setOpenRebidModal] = useState(false);
  const [unassignmentReason, setUnassignmentReason] = useState('');
  const token = JSON.parse(localStorage.getItem('authToken'));
  const userType = localStorage.getItem('user_type');
  let operational_accesses = null;
  let superAdmin = false;
  const [firstPositionRate, setFirstPositionRate] = useState("");

  if (token) {
    superAdmin = decodeToken(token)?.access?.SA;
    operational_accesses = decodeToken(token)?.access?.operational_access;
  }
  console.log('selected', selectedEntity.enable_price_match);
  console.log('selected', typeof selectedEntity.enable_price_match);
  const columnsDataFunction = () => {
    switch (true) {
      case status === 'live':
        return [
          {
            field: 'transporterName',
            headerName: 'Transporter Name',
            width: 120,
          },
          {
            field: 'transporterRate',
            headerName: 'Transporter Rate',
            width: 200,
          },
          { field: 'noOfBids', headerName: 'No Of Bids', width: 100 },
          { field: 'bidComment', headerName: 'Bid Comment', width: 150 },

          { field: 'position', headerName: 'Position', width: 100 },
          {
            field: 'action',
            headerName: 'Bid History',
            width: 100,
            renderCell: (params) => (
              <Tooltip title="View Bid History">
                <IconButton
                  size="small"
                  onClick={() =>
                    viewHandler(params.row.id, params.row.transporterName)
                  }
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            ),
          },
        ];
      case status === 'pending':
        return [
          {
            field: 'transporterName',
            headerName: 'Transporter Name',
            width: 150,
          },
          {
            field: 'transporterRate',
            headerName: 'Transporter Rate',
            width: 120,
          },
          { field: 'noOfBids', headerName: 'No Of Bids', width: 80 },
          { field: 'bidComment', headerName: 'Bid Comment', width: 150 },
          {
            field: 'negotiateRate',
            headerName: 'Negotiated Rate',
            width: 180,
            renderCell: (params) => (
              <>
                {params.row.is_pmr_approved === false
                  ? 'Price Match Requested'
                  : params.row.negotiateRate}
              </>
            ),
          },
          { field: 'position', headerName: 'Position', width: 80 },
          // Add the new column definition
          {
            field: 'numberOfVehicles',
            headerName: 'Number of Vehicles',
            width: 180,
            renderCell: (params) => (
              <TextField
                type="number"
                size="small"
                value={params.row.numberOfVehicles}
                onChange={(e) =>
                  // handleNumberOfVehiclesChange(params.row.id, e.target.value)
                  handleVehicleChange(params.row.id, e.target.value)
                }
                id="outlined-basic"
                variant="outlined"
              />
            ),
          },
          { field: 'assignStatus', headerName: 'Status', width: 120 },
          {
            field: 'action',
            headerName: 'Bid History',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View Bid History">
                  <IconButton
                    size="small"
                    onClick={() =>
                      viewHandler(params.row.id, params.row.transporterName)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Assignement History">
                  <IconButton
                    size="small"
                    onClick={() =>
                      viewUnasighn(params.row.id, params.row.transporterName)
                    }
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ];
      case status === 'partially_confirmed' || status === 'confirmed':
        return [
          {
            field: 'transporterName',
            headerName: 'Transporter Name',
            width: 150,
          },
          {
            field: 'transporterRate',
            headerName: 'Transporter Rate',
            width: 120,
          },
          { field: 'noOfBids', headerName: 'No Of Bids', width: 80 },
          { field: 'bidComment', headerName: 'Bid Comment', width: 150 },
          {
            field: 'negotiateRate',
            headerName: 'Negotiated Rate',
            width: 180,
            renderCell: (params) => (
              <>
                {params.row.is_pmr_approved === false
                  ? 'Price Match Requested'
                  : params.row.negotiateRate}
              </>
            ),
          },
          { field: 'position', headerName: 'Position', width: 80 },
          // Add the new column definition
          {
            field: 'numberOfVehicles',
            headerName: 'Number of Vehicles',
            width: 180,
            renderCell: (params) => (
              <TextField
                type="number"
                size="small"
                value={params.row.numberOfVehicles}
                onChange={(e) =>
                  // handleNumberOfVehiclesChange(params.row.id, e.target.value)
                  handleVehicleChange(params.row.id, e.target.value)
                }
                id="outlined-basic"
                variant="outlined"
              />
            ),
          },
          { field: 'assignStatus', headerName: 'Status', width: 120 },
          {
            field: 'action',
            headerName: 'Bid History',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View Bid History">
                  <IconButton
                    size="small"
                    onClick={() =>
                      viewHandler(params.row.id, params.row.transporterName)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Assignement History">
                  <IconButton
                    size="small"
                    onClick={() =>
                      viewUnasighn(params.row.id, params.row.transporterName)
                    }
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
          {
            field: 'unassign',
            headerName: 'Unassign',
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="Click to unassign">
                  <IconButton
                    size="small"
                    onClick={() => openUnAssign(params.row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ];
      default:
        return [];
    }
  };

  const columns = columnsDataFunction();

  const assignStatusFinder = (ele) => {
    if (ele.assigned === null) {
      return 'Not Assigned';
    } else if (ele.assigned === false) {
      return 'Un-Assigned';
    } else {
      return 'Assigned';
    }
  };

  const rowDataFunction = (data) => {
    switch (true) {
      case status === 'live': {
        const arrayOfObjects = data.map((ele, ind) => {
          return {
            id: ele.transporter_id,
            transporterName: ele.transporter_name,
            transporterRate: `₹ ${ele.rate}`,
            noOfBids: ele.attempts,
            bidComment: ele.comment,
            position: `L${ind + 1}`,
            action: 'view',
            is_pmr_approved: ele.is_pmr_approved,
          };
        });
        return arrayOfObjects;
      }
      case status === 'pending': {
        const arrayOfObjects = data.map((ele, ind) => {
          const negotiData = ele.pmr_price;
          return {
            id: ele.id,
            transporterName:
              userType === 'acu' || superAdmin
                ? ele.name
                : operational_accesses.show_assignment_transporter_name ===
                  false
                  ? '************'
                  : ele.name,
            transporterRate:
              userType === 'acu' || superAdmin
                ? ` ₹ ${ele.lowest_price}`
                : operational_accesses.show_assignment_transporter_rate ===
                  false
                  ? '*****'
                  : ` ₹ ${ele.lowest_price}`,
            noOfBids: ele.total_number_attempts,
            bidComment: ele.lowest_price_comment,
            negotiateRate: negotiData === null ? '-' : `₹ ${negotiData}`,
            position: `L${ind + 1}`,
            numberOfVehicles: ele.assigned && ele.fleet_assigned,
            assignStatus: assignStatusFinder(ele),
            action: ele.rates,
            transporterRateShipp: `₹ ${ele.lowest_price}`,
            is_pmr_approved: ele.is_pmr_approved,
          };
        });
        return arrayOfObjects;
      }

      case status === 'partially_confirmed': {
        const arrayOfObjects = data.map((ele, ind) => {
          const negotiData = ele.pmr_price;
          return {
            id: ele.id,
            transporterName:
              userType === 'acu' || superAdmin
                ? ele.name
                : operational_accesses.show_assignment_transporter_name ===
                  false
                  ? '************'
                  : ele.name,
            transporterRate:
              userType === 'acu' || superAdmin
                ? `₹ ${ele.lowest_price}`
                : operational_accesses.show_assignment_transporter_rate ===
                  false
                  ? '*****'
                  : `₹ ${ele.lowest_price}`,
            noOfBids: ele.total_number_attempts,
            bidComment: ele.lowest_price_comment,
            negotiateRate: negotiData === null ? '-' : `₹ ${negotiData}`,
            position: `L${ind + 1}`,
            numberOfVehicles: ele.assigned && ele.fleet_assigned,
            assignStatus: assignStatusFinder(ele),
            action: ele.rates,
            unassign: 'UnAssign',
            transporterRateShipp: `₹ ${ele.lowest_price}`,
            is_pmr_approved: ele.is_pmr_approved,
          };
        });
        return arrayOfObjects;
      }
      case status === 'confirmed': {
        const arrayOfObjects = data.map((ele, ind) => {
          const negotiData = ele.pmr_price;
          return {
            id: ele.id,
            transporterName: ele.name,
            transporterRate: ` ₹ ${ele.lowest_price}`,
            noOfBids: ele.total_number_attempts,
            bidComment: ele.lowest_price_comment,
            negotiateRate: negotiData === null ? '-' : `₹ ${negotiData}`,
            position: `L${ind + 1}`,
            numberOfVehicles: ele.assigned && ele.fleet_assigned,
            assignStatus: assignStatusFinder(ele),
            action: ele.rates,
            unassign: 'UnAssign',
            transporterRateShipp: `₹ ${ele.lowest_price}`,
            is_pmr_approved: ele.is_pmr_approved,
          };
        });
        return arrayOfObjects;
      }
      default:
        return [];
    }
  };

  const handleVehicleChange = (id, value) => {
    const arrOfObj = initialRows.map((ele) => {
      if (ele.id === id) {
        return { ...ele, numberOfVehicles: value };
      } else {
        return ele;
      }
    });
    setInitialRows(arrOfObj);
  };

  const fetchBodHistoryData = (id) => {
    setIsLoading(true);
    const payload = {
      transporter_id: id,
    };
    getBidHistory(selectedId, payload)
      .then((res) => {
        if (res.data.success === true) {
          setBidHistoryData(res.data.data.historical);
          setBidHistoryNegotiData(res.data.data);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const viewUnasighnList = (id) => {
    setBidasighndata([]);
    setIsLoading(true);
    const payload = {
      transporter_id: id,
    };
    getUnasighnHistory(selectedId, payload)
      .then((res) => {
        if (res.data.success === true) {
          setBidasighndata(res.data.data);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const viewHandler = (id, name) => {
    setViewHistoryModel(true);
    setTransName(name);
    fetchBodHistoryData(id);
  };

  const viewUnasighn = (id, name) => {
    setViewUnasighnedModal(true);
    viewUnasighnList(id);
    setTransName(name);
  };

  const closeHistoryModel = () => {
    setViewHistoryModel(false);
    setTransName('');
    setViewUnasighnedModal(false);
  };

  const fetchData = () => {
    setIsLoading(true);
    getLiveBidDetails(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          const rowValue = rowDataFunction(res.data.data);
          setInitialRows(rowValue);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchPendingBidData = () => {
    setIsLoading(true);
    getPendingBidDetails(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          const rowValue = rowDataFunction(res.data.data);
          setInitialRows(rowValue);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
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
    if (status === 'live') {
      fetchData();

      const newSocket = new WebSocket(
        `ws://13.126.173.53/socket2/ws/${selectedId}`
      );

      newSocket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened.', event);
      });

      newSocket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        const rowValue = rowDataFunction(data);
        rowValue.lenght !== 0 && setInitialRows(rowValue);
      });

      newSocket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed.', event);
      });

      newSocket.addEventListener('error', (event) => {
        console.log('WebSocket error: ' + event.message);
      });

      // Set the socket state
      setSocket(newSocket);

      // Close the WebSocket connection when the component unmounts
      return () => {
        if (newSocket) {
          newSocket.close();
        }
      };
    } else if (
      status === 'pending' ||
      status === 'partially_confirmed' ||
      status === 'confirmed'
    ) {
      fetchPendingBidData();
    } else if (status === 'completed') {
      setTransporterData(transportSelectedRow);
    } else {
      const rowValue = rowDataFunction();
      setInitialRows(rowValue);
    }
  }, [selectedId]);

  const onModalClose = () => {
    if (socket) {
      socket.close();
    }
    onClose();
  };

  const handleForwad = () => {
    setApprovalPopup(true);
  };

  const handleBidmatch = () => {
    let amount;
    if(initialRows[0].negotiateRate !== "-")
    {
      amount = parseInt(initialRows[0].negotiateRate.split(' ').pop());
    }else{
      amount = parseInt(initialRows[0].transporterRateShipp.split(' ').pop());
    }
    setFirstPositionRate(amount);
    setBidMatchRate(amount);
    setBidMatchpopup(true);
  };

  const returnHeader = (status) => {
    if (status === 'live') {
      return 'Live Bidding';
    } else if (status === 'pending') {
      return 'Pending Table';
    } else if (status === 'confirmed') {
      return 'Confirmed Table';
    } else if (status === 'partially_confirmed') {
      return 'Partially Confirmed Table';
    } else if (status === 'completed') {
      return 'Transporter Details';
    } else {
      return '';
    }
  };

  const assignHandler = () => {
    const newArray = initialRows.filter((itemA) =>
      selectedRow.some((itemB) => itemB.id === itemA.id)
    );
    const newArray2 = initialRows.filter(
      (itemA) => itemA.assignStatus === 'Assigned'
    );
    const merged_array = newArray2.concat(newArray).reduce((acc, item) => {
      if (!acc.some((existingItem) => existingItem.id === item.id)) {
        acc.push(item);
      }
      return acc;
    }, []);
    const payload = merged_array.map((ele) => {
      let numericValue =
        parseInt(ele.position.replace('L', 'L*').split('*').pop()) - 1;
      const amount =
        ele.negotiateRate === '-'
          ? parseInt(ele.transporterRateShipp.split(' ').pop())
          : parseInt(ele.negotiateRate.split(' ').pop());
      const negotiateAmount = parseInt(ele.negotiateRate.split(' ').pop());
      return {
        la_transporter_id: ele.id,
        trans_pos_in_bid: numericValue.toString(),
        price: amount,
        price_difference_percent:
          ele.negotiateRate === '-'
            ? 0.0
            : parseFloat(
              (
                ((parseInt(ele.transporterRateShipp.split(' ').pop()) -
                  negotiateAmount) /
                  parseInt(ele.transporterRateShipp.split(' ').pop())) *
                100
              ).toFixed(2)
            ),
        no_of_fleets_assigned: ele.numberOfVehicles
          ? parseInt(ele.numberOfVehicles)
          : 0,
      };
    });
    const zeroCheck = payload.some(
      (ele) =>
        ele.no_of_fleets_assigned <= 0 || ele.no_of_fleets_assigned === null
    );
    if (zeroCheck) {
      dispatch(
        openSnackbar({
          type: 'error',
          message:
            'Minimum No. of Vehicles Assigned to the Selected Transporter(s) Should be Greater Than 0.',
        })
      );
    } else {
      setIsLoading(true);
      assignVehicel(selectedId, payload)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: 'success', message: res.data.clientMessage })
            );
            onModalClose();
          } else {
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
          }
        })
        .catch((error) => {
          console.error('Error', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const tooltipNegotiation = () => {
    if (selectedRow.length < 1) {
      setTitleValue({
        message: 'Select one row at a time',
        dis: true,
      });
    } else if (selectedRow.length >= 1 && selectedRow[0].position === 'L1' && userType !== 'acu') {
      setTitleValue({
        message: 'Not allowed to select lowest rate transporter',
        // userType === 'acu'

        dis: true,
      });
    } else if (selectedRow.length >= 1 && selectedRow[0].position === 'L1' && userType === 'acu') {
      setTitleValue({
        message: 'Enter negotiation price and comment after open popup',
        dis: false,
      });
    } else if (selectedRow.length >= 1 && selectedRow[0].position !== 'L1') {
      setTitleValue({
        message: 'Enter negotiation price and comment after open popup',
        dis: false,
      });
    }
  };

  const tooltipAssign = () => {
    if (selectedRow.length < 1) {
      setTitleValueAssign({
        message: 'please select at least one row',
        dis: true,
      });
    } else if (selectedRow.length > 0) {
      setTitleValueAssign({
        message: `${status === 'confirmed' ? 'Re-Assign' : 'Assign'} vehicle`,
        dis: false,
      });
    }
  };

  useEffect(() => {
    tooltipNegotiation();
    tooltipAssign();
  }, [selectedRow]);

  const bidMatchHandler = () => {
    const zeroCheck =
      parseInt(BidMatchRate) <= 0 ||
      BidMatchRate === '' ||
      BidMatchRate === null;
    if (zeroCheck) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Negotiation amount should be greater than 0',
        })
      );
    }
    else if (BidMatchRate > firstPositionRate) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Negotiation amount should be same or lower than L1 rate',
        })
      );
    }
    else {
      setIsLoading(true);
      const payload = selectedRow.map((ele) => {
        let numericValue =
          parseInt(ele.position.replace('L', 'L*').split('*').pop()) - 1;
        return {
          transporter_id: ele.id,
          trans_pos_in_bid: numericValue.toString(),
          rate: parseInt(BidMatchRate),
          comment: bidMatchComment,
        };
      });
      assignNewBidValue(selectedId, payload)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: 'success', message: res.data.clientMessage })
            );
            fetchPendingBidData();
            setBidMatchComment('');
            setBidMatchpopup(false);
          } else {
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
          }
        })
        .catch((error) => {
          console.error('Error', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const openUnAssign = (id) => {
    setOpenUnassignModel(true);
    setTransId(id);
  };

  const closeUnassingModel = () => {
    setOpenUnassignModel(false);
    setTransId('');
    setUnassignmentReason('');
  };

  const handleUnassign = () => {
    const zeroCheck = unassignmentReason === '';
    if (zeroCheck) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Please enter an unassignment reason',
        })
      );
    } else {
      setIsLoading(true);
      const payload = {
        transporter_id: transId,
        unassignment_reason: unassignmentReason,
      };
      unAssignVehicel(selectedId, payload)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: 'success', message: res.data.clientMessage })
            );
            closeUnassingModel();
            fetchPendingBidData();
            setUnassignmentReason('');
          } else {
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
          }
        })
        .catch((error) => {
          console.error('Error', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      <Dialog
        maxWidth={true}
        scroll={'paper'}
        open={open}
        onClose={onModalClose}
      >
        <div className="customCardheader">
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h4">{returnHeader(status)}</Typography>
            </Grid>
            {status === 'pending' ||
              status === 'partially_confirmed' ||
              status === 'confirmed' ? (
              <Grid item>
                <Grid container>
                  <strong>
                    No. of Vehicles Required : &nbsp; {selectedEntity.fleets}{' '}
                  </strong>{' '}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <strong>
                    Vehicle Assignment Pending : &nbsp;{' '}
                    {selectedEntity.pending_vehicle_count}{' '}
                  </strong>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </div>
        <DialogContent>
          {status !== 'completed' ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div style={{ minHeight: '5vh', width: '100%' }}>
                  {initialRows.length === 0 ? (
                    'No data to show'
                  ) : (
                    <DataGrid
                      rows={initialRows}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10, 20]}
                      className="liveTable"
                      checkboxSelection={status !== 'live'}
                      disableRowSelectionOnClick={status !== 'live'}
                      onRowSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids);
                        const selectedRowData = initialRows.filter((row) =>
                          selectedIDs.has(row.id.toString())
                        );
                        setSelectedRow(selectedRowData);
                      }}
                    />
                  )}
                </div>
              </Grid>
              {status === 'confirmed' ? (
                <Grid item xs={12}>
                  <strong>Note** </strong>To reassign a transporter please
                  unassign first.
                  {reason ? (
                    <p>
                      {' '}
                      <span>Confirmed reason : </span>
                      {reason}
                    </p>
                  ) : (
                    ''
                  )}
                </Grid>
              ) : null}
            </Grid>
          ) : (
            <Grid container spacing={2} flexWrap="wrap">
              {transporterData.length != 0
                ? transporterData.map((row) => {
                  return (
                    <Grid item xs={12} sm={12} key={row}>
                      <Card sx={{ height: '20vh' }}>
                        <CardContent>
                          <Typography variant="h5">
                            Contact Name : {row.contact_name}
                          </Typography>
                          <Typography variant="h5">
                            Contact No : {row.contact_no}
                          </Typography>
                          <Typography variant="h5">
                            Number of Fleets Assigned :{' '}
                            {row.no_of_fleets_assigned}
                          </Typography>
                          {/* <Typography variant="h5">
                              Price Difference Percent:  {row.price_difference_percent}%
                            </Typography> */}
                          <Typography variant="h5">
                            Price : ₹{row.price}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })
                : 'No data to show'}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {status === 'pending' ||
            status === 'confirmed' ||
            status === 'partially_confirmed' ? (
            <div>
              {/* <Tooltip
                  placement="top"
                  title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur libero libero, condimentum nec cursus et, accumsan vitae velit. Aliquam maximus pharetra rutrum. "
                >
                  <Button
                    sx={{ marginRight: "10px" }}
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={handleForwad}
                  >
                    Forward For Approval
                  </Button>
                </Tooltip> */}
              {(userType === 'acu' ||
                (selectedEntity.enable_price_match &&
                  (superAdmin || operational_accesses?.allow_bid_match))) && (
                  <Tooltip placement="top" title={titleValue.message}>
                    <Button
                      sx={{ marginRight: '10px' }}
                      color="secondary"
                      variant="contained"
                      size="small"
                      onClick={() => {
                        !titleValue.dis && handleBidmatch();
                      }}
                    >
                      {userType === 'shp' ? 'Bid-Match' : 'Negotiation'}
                    </Button>
                  </Tooltip>
                )}
              {(userType === 'acu' ||
                superAdmin ||
                operational_accesses?.allow_assignment) && (
                  <Tooltip placement="top" title={titleValueAssign.message}>
                    <Button
                      sx={{ marginRight: '10px' }}
                      color="success"
                      variant="contained"
                      size="small"
                      onClick={() => {
                        !titleValueAssign.dis && assignHandler();
                      }}
                    >
                      {status === 'confirmed' ? 'Re-Assign' : 'Assign'}
                    </Button>
                  </Tooltip>
                )}
              {(userType === 'acu' ||
                superAdmin ||
                operational_accesses?.allow_rebid) && (
                  <Tooltip placement="top" title="Re-bid">
                    <Button
                      sx={{ marginRight: '10px' }}
                      variant="contained"
                      size="small"
                      onClick={() => setOpenRebidModal(true)}
                    >
                      Re-Bid
                    </Button>
                  </Tooltip>
                )}
            </div>
          ) : null}
          <Button
            variant="contained"
            size="small"
            color="error"
            autoFocus
            onClick={onModalClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUnassignModel} onClose={closeUnassingModel}>
        <div className="customCardheader">
          <Typography variant="h4">Unassign</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to unassign vehicle?</Typography>
          <TextareaAutosize
            label="Comment"
            placeholder="Enter your reason..."
            minRows={4}
            style={{ width: '100%', marginBottom: '15px', marginTop: '20px' }}
            value={unassignmentReason}
            onChange={(e) => setUnassignmentReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeUnassingModel}
            variant="contained"
            color="error"
          >
            No
          </Button>
          <Button onClick={handleUnassign} variant="contained" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="sm"
        scroll="paper"
        open={viewHistoryModel}
        onClose={() => closeHistoryModel()}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="p">
            <strong>{transName} </strong>Bid History
          </Typography>
        </div>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Event</TableCell>
                      <TableCell align="left">Rate</TableCell>
                      <TableCell align="left">Comment</TableCell>
                      <TableCell align="left">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bidHistoryData.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell align="left">{row.event}</TableCell>
                        <TableCell align="left">{row.rate}</TableCell>
                        <TableCell align="left">{row.comment}</TableCell>
                        <TableCell align="left">
                          {moment(row.created_at).format(
                            'DD/MM/YYYY HH:mm:SS A'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {status !== 'live' ? (
              <Grid item xs={12}>
                <Typography variant="h4">Negotiated Rate</Typography>
                <Typography variant="h6">
                  Price :{' '}
                  {bidHistoryNegotiData.pmr_price !== null
                    ? bidHistoryNegotiData.pmr_price
                    : 'N/A'}
                </Typography>
                {/* <Typography variant="h6">
                  Date :{' '}
                  {bidHistoryNegotiData.pmr_date !== null
                    ? moment(bidHistoryNegotiData.pmr_date).format(
                      'DD/MM/YYYY HH:mm:SS A'
                    )
                    : 'N/A'}
                </Typography> */}
                <Typography variant="h6">
                  Comment :{' '}
                  {bidHistoryNegotiData.pmr_comment !== null
                    ? bidHistoryNegotiData.pmr_comment
                    : 'N/A'}
                </Typography>
              </Grid>
            ) : null}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="error"
            autoFocus
            onClick={() => closeHistoryModel()}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* view unasighn */}
      <Dialog
        maxWidth="sm"
        scroll="paper"
        open={viewUnasighnModal}
        onClose={() => closeHistoryModel()}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="p">
            <strong style={{ textTransform: 'capitalize' }}>
              {transName}{' '}
            </strong>
            Assignment History
          </Typography>
        </div>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Event</TableCell>

                      <TableCell align="left">Resources </TableCell>
                      <TableCell align="left">Reason</TableCell>
                      <TableCell align="left">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bidasighndata.map((row) => (
                      <TableRow key={row.event}>
                        <TableCell align="left">{row.event}</TableCell>

                        <TableCell align="center">
                          {row.resources ? row.resources : '-'}
                        </TableCell>
                        <TableCell align="left">
                          {row.reason ? row.reason : '-'}
                        </TableCell>
                        <TableCell align="left">
                          {moment(row.created_at).format(
                            'DD/MM/YYYY hh:mm:SS A'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="error"
            autoFocus
            onClick={() => closeHistoryModel()}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="md"
        scroll="paper"
        open={showNegotiateDialog}
        onClose={() => setShowNegotiateDialog(false)}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="h4">Negotiate Rate</Typography>
        </div>
        <DialogContent>
          {status === 'confirmed' && showNegotiateDialog && (
            <div>
              <div>
                <Typography variant="p" sx={{ mb: 2 }}>
                  Please enter the negotiate rate here
                </Typography>
              </div>
              <TextField
                size="small"
                fullWidth
                label="Negotiate Rate"
                variant="outlined"
                value={negotiateRate}
                onChange={(e) => setNegotiateRate(e.target.value)}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowNegotiateDialog(false);
            }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            autoFocus
            onClick={() => setShowNegotiateDialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="md"
        scroll="paper"
        open={bidMatcPopup}
        onClose={() => setBidMatchpopup(false)}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="p">Bid Match Rate</Typography>
        </div>
        <DialogContent>
          <div>
            <div>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {userType === 'shp'
                  ? 'Please Provide Comment (If Required)'
                  : 'Please enter the bid match rate here'}
              </Typography>
            </div>
            <TextField
              size="small"
              fullWidth
              label="Bid  Rate"
              disabled={userType === 'shp'}
              type="number"
              variant="outlined"
              sx={{ mb: 2 }}
              value={BidMatchRate}
              onChange={(e) => setBidMatchRate(e.target.value)}
            />
            <TextareaAutosize
              label="Comment"
              placeholder="Enter your comment..."
              minRows={4}
              style={{ width: '100%', marginBottom: '15px' }}
              value={bidMatchComment}
              onChange={(e) => setBidMatchComment(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              bidMatchHandler();
            }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            autoFocus
            onClick={() => setBidMatchpopup(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="md"
        scroll="paper"
        open={approvalPopup}
        onClose={() => setApprovalPopup(false)}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="h4">Send Approval</Typography>
        </div>
        <DialogContent>
          <div>
            <div style={{ marginBottom: '10px' }}>
              <Typography style={{ marginBottom: '10px' }} variant="6">
                Approver : John Doe
              </Typography>
            </div>
            <TextareaAutosize
              sx={{ mt: 3 }}
              label="Comment"
              placeholder="Enter your comment..."
              minRows={4}
              style={{ width: '400px', marginBottom: '15px' }}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setApprovalPopup(false);
            }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            autoFocus
            onClick={() => setApprovalPopup(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {openRebidModal ? (
        <>
          <RebidModel
            selectedId={selectedId}
            status={status}
            selectedRow={selectedRow}
            handleCloseModal={() => {setOpenRebidModal(false); onModalClose()}}
          />
        </>
      ) : null}
    </>
  );
}
