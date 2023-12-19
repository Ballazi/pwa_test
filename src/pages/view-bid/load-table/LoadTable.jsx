import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import TransporterDetails from "../transporter-details/TransporterDetails";
import { updateBId } from "../../../api/trip-management/manage-trip";
import HistoryIcon from "@mui/icons-material/History";

import {
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  TableHead,
  Card,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  IconButton,
  Typography,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import RefreshIcon from "@mui/icons-material/Refresh";

import FilterComponent from "../../../components/masterData/filter-component/FilterComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Cancel } from "@mui/icons-material";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import LoadVideModel from "../load-view-model/LoadViewModel";
import CountdownCell from "../../load-management/create-load/CountdownCell";
import {
  getTripData,
  publishDraftBid,
  cancelBid,
  deleteBid,
  markCompleted,
  getFilteredBidData,
  enableTracking,
  getPendingBidDetails,
  viewCancelReason,
} from "../../../api/trip-management/manage-trip";
import { decodeToken } from "react-jwt";
import BackdropComponent from "../../../components/backdrop/Backdrop";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import moment from "moment/moment";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import VehicleInformation from "../vehicle-information/VehicleInformation";

export default function LoadTable({ status }) {
  const [Vehicle, setVehicle] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [assignedTransporterDetails, setAssignedTransporterDetails] = useState(
    []
  );
  const [selectedRow, setSelectedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [viewModel, setviewModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [openDeleteConfModel, setOpenDeleteConfModel] = useState(false);
  const dispatch = useDispatch();
  const [transId, setTransId] = useState("");
  const [openMarkCompleteModel, setOpenMarkCompleteModel] = useState(false);
  const [openPublishModel, setOpenPublishModel] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [filterFlag, setFilterFlag] = useState(false);
  const [filterFlagShip, setFilterFlagShip] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [openTracking, setOpenTracking] = useState(false);
  const [cancelOptions, setCancelOptions] = useState([]);
  const [selectedCancelOption, setSelectedCancelOption] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const [selectError, setSelectError] = useState(false);
  const [textError, setTextError] = useState(false);
  const userType = localStorage.getItem("user_type");
  const userType_shipperId = localStorage.getItem("user_id");
  const userType_regionClusterId = localStorage.getItem("region_cluster_id");
  const userType_branchId = localStorage.getItem("branch_id");
  const [filteredRows, setFilteredRows] = useState([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [reason, setReason] = useState("");
  const [selectedEntity, setSelectedEntity] = useState({});
  const [asighnmentHistory, setShowAsighnmentHistory] = useState();
  const [transeporterHistory, setTranseporterHistory] = useState([]);
  const token = JSON.parse(localStorage.getItem("authToken"));
  let operational_accesses = null;
  let superAdmin = false;

  if (token) {
    superAdmin = decodeToken(token)?.access?.SA;
    operational_accesses = decodeToken(token)?.access?.operational_access;
  }

  const [refresh, setRefresh] = useState(true);
  // Callback function to handle time over

  const handleTimeOver = () => {
    // if (userType !== "shp") {
    //   if (filterFlag) filterHandler(filterData);
    //   else fetchData();
    // }
    // else {
    //   filterHandlerShp();
    // }
  };
  const handleTimeOverAlert = () => {
    // alert("work");
    updateBId()
      .then((res) => {
        if (res.data.success === true) {
          if (userType !== "shp") {
            if (filterFlag) filterHandler(filterData);
            else fetchData();
          } else {
            if (filterFlagShip) filterHandlerShip(filterData);
            else filterHandlerShp();
          }
        } else {
        }
      })
      .catch((error) => {});
  };

  const columnsReturnFunction = () => {
    switch (true) {
      case status === "live": {
        const columns = [
          { field: "loadId", headerName: "Load Id", width: 80 },
          { field: "shipper_name", headerName: "Shipper Name", width: 150 },
          { field: "branch_name", headerName: "Branch Name", width: 110 },
          { field: "loadType", headerName: "BId Mode", width: 110 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          {
            field: "rate_quote_type",
            headerName: "Rate Quotation Type",
            width: 150,
          },
          { field: "fleet_name", headerName: "Vehicle  Type", width: 150 },
          {
            field: "fleets",
            headerName: " No. of Vehicle Required ",
            width: 120,
          },
          {
            field: "transporters_participated",
            headerName: "Transporters Participated",
            width: 150,
          },
          {
            field: "reportDate",
            headerName: "Reporting Date & Time",
            width: 210,
          },
          { field: "bidDate", headerName: "Bid Date & Time", width: 210 },
          {
            field: "bid_extended_time",
            headerName: "Total Bid Extented Time (mins)",
            width: 210,
          },

          {
            field: "countdown",
            headerName: "Countdown",
            width: 150,
            renderCell: (params) => {
              const bidDate = new Date(params.row.bid_end_time);
              const now = new Date();

              // Check if bidDate is greater than the current date and time
              if (bidDate > now) {
                return (
                  <CountdownCell
                    bidDate={bidDate}
                    onTimeOver={handleTimeOverAlert}
                  />
                );
              } else {
                return (
                  <span
                    style={{
                      backgroundColor: "#065AD8",
                      color: "white",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                  >
                    Time Over{" "}
                  </span>
                );
              }
            },
          },
          {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
              <>
                <Tooltip title="View Load">
                  <IconButton
                    onClick={() => {
                      viewHandler(params.row.id);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.show_transporter_live_rates) && (
                  <Tooltip title="View Bid">
                    <IconButton
                      onClick={() => {
                        handleActionClick(params.row);
                      }}
                    >
                      <BackupTableIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ),
          },
          // { field: "approval", headerName: "Variance Approval", width: 150 },
        ];
        if (userType !== "shp") {
          const newColumn = {
            field: "bid_show",
            headerName: "B/U",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return <span>N/A</span>;
              } else {
                if (params.row.bid_show) {
                  return <span>Unblind</span>;
                } else {
                  return <span>Blind</span>;
                }
              }
            },
          };
          columns.splice(4, 0, newColumn);
        }
        return columns;
      }

      case status === "not_started": {
        const columns = [
          { field: "loadId", headerName: "Load Id", width: 80 },
          { field: "shipper_name", headerName: "Shipper Name", width: 150 },
          { field: "branch_name", headerName: "Branch Name", width: 110 },
          { field: "loadType", headerName: "BId Mode", width: 110 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          {
            field: "rate_quote_type",
            headerName: "Rate Quotation Type",
            width: 150,
          },
          { field: "fleet_name", headerName: "Vehicle  Type", width: 150 },
          {
            field: "fleets",
            headerName: " No. of Vehicle Required ",
            width: 120,
          },
          // { field: "no_of_bids_placed", headerName: "Bids Placed", width: 150 },
          {
            field: "transporters_participated",
            headerName: "Transporters Participated",
            width: 150,
          },

          {
            field: "reportDate",
            headerName: "Reporting Date & Time",
            width: 250,
          },
          {
            field: "bidDate",
            headerName: "Bid Date & Time",
            width: 180,

            renderCell: (params) => {
              // Check if loadType is "Indent"
              if (params.row.loadType === "Indent") {
                return "N/A";
              } else {
                return params.row.bidDate;
              }
            },
          },
          {
            field: "countdown",
            headerName: "Countdown",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return "N/A";
              } else {
                const bidDate = new Date(params.row.bidDate);
                const now = new Date();

                // Check if bidDate is greater than the current date and time
                if (bidDate > now) {
                  return <CountdownCell bidDate={bidDate} />;
                } else {
                  return (
                    <span
                      style={{
                        backgroundColor: "#065AD8",
                        color: "white",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                    >
                      Time Over{" "}
                    </span>
                  );
                }
              }
            },
          },
          {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
              <>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_draft_view) && (
                  <Tooltip title="View/Edit">
                    <IconButton onClick={() => viewHandler(params.row.id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_draft_delete) && (
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => deleteConfHandler(params.row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ),
          },
          // { field: "approval", headerName: "Variance Approval", width: 130 },
        ];
        if (userType !== "shp") {
          const newColumn = {
            field: "bid_show",
            headerName: "B/U",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return <span>N/A</span>;
              } else {
                if (params.row.bid_show) {
                  return <span>Unblind</span>;
                } else {
                  return <span>Blind</span>;
                }
              }
            },
          };
          columns.splice(4, 0, newColumn);
        }
        return columns;
      }

      case status === "draft": {
        const columns = [
          { field: "loadId", headerName: "Load Id", width: 80 },
          { field: "shipper_name", headerName: "Shipper Name", width: 150 },
          { field: "branch_name", headerName: "Branch Name", width: 110 },
          { field: "loadType", headerName: "BId Mode", width: 110 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          {
            field: "rate_quote_type",
            headerName: "Rate Quotation Type",
            width: 150,
          },
          { field: "fleet_name", headerName: "Vehicle  Type", width: 150 },
          {
            field: "fleets",
            headerName: " No. of Vehicle Required ",
            width: 120,
          },

          // { field: "no_of_bids_placed", headerName: "Bids Placed", width: 150 },
          {
            field: "reportDate",
            headerName: "Reporting Date & Time",
            width: 250,
          },
          {
            field: "bidDate",
            headerName: "Bid Date & Time",
            width: 180,

            renderCell: (params) => {
              // Check if loadType is "Indent"
              if (params.row.loadType === "Indent") {
                return "N/A";
              } else {
                return params.row.bidDate;
              }
            },
          },
          {
            field: "countdown",
            headerName: "Countdown",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return "N/A";
              } else {
                const bidDate = new Date(params.row.bidDate);
                const now = new Date();

                // Check if bidDate is greater than the current date and time
                if (bidDate > now) {
                  return <CountdownCell bidDate={bidDate} />;
                } else {
                  return (
                    <span
                      style={{
                        backgroundColor: "#065AD8",
                        color: "white",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                    >
                      Time Over{" "}
                    </span>
                  );
                }
              }
            },
          },

          {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
              <>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_draft_view) && (
                  <Tooltip title="View/Edit">
                    <IconButton onClick={() => viewHandler(params.row.id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Publish">
                  <IconButton
                    disabled={new Date(params.row.bidDate) <= new Date()}
                    onClick={() => publishHandler(params.row.id)}
                  >
                    <PublishedWithChangesIcon />
                  </IconButton>
                </Tooltip>

                {/* here */}
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_draft_delete) && (
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => deleteConfHandler(params.row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ),
          },
          // { field: "approval", headerName: "Variance Approval", width: 130 },
        ];
        if (userType !== "shp") {
          const newColumn = {
            field: "bid_show",
            headerName: "B/U",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return <span>N/A</span>;
              } else {
                if (params.row.bid_show) {
                  return <span>Unblind</span>;
                } else {
                  return <span>Blind</span>;
                }
              }
            },
          };
          columns.splice(4, 0, newColumn);
        }
        return columns;
      }
      case status === "pending": {
        const columns = [
          { field: "loadId", headerName: "Load Id", width: 80 },
          { field: "shipper_name", headerName: "Shipper Name", width: 150 },
          { field: "branch_name", headerName: "Branch Name", width: 110 },
          { field: "loadType", headerName: "BId Mode", width: 110 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          {
            field: "rate_quote_type",
            headerName: "Rate Quotation Type",
            width: 150,
          },
          { field: "fleet_name", headerName: "Vehicle  Type", width: 150 },
          {
            field: "fleets",
            headerName: " No. of Vehicle Required ",
            width: 120,
          },

          {
            field: "reportDate",
            headerName: "Reporting Date & Time",
            width: 300,
          },
          { field: "bidDate", headerName: "Bid Date & Time", width: 150 },

          {
            field: "action",
            headerName: "Action",
            width: 170,
            renderCell: (params) => (
              <>
                <Tooltip title="View Load">
                  <IconButton
                    onClick={() => {
                      viewHandler(params.row.id);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_view_assigned_transporters) && (
                  <Tooltip title="Assignment">
                    <IconButton
                      onClick={() => {
                        handleActionClick(params.row);
                      }}
                    >
                      <AssignmentIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Cancel">
                  <IconButton onClick={() => deleteHandler(params.row.id)}>
                    <Cancel />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
          // { field: "approval", headerName: "Variance Approval", width: 150 },
        ];
        if (userType !== "shp") {
          const newColumn = {
            field: "bid_show",
            headerName: "B/U",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return <span>N/A</span>;
              } else {
                if (params.row.bid_show) {
                  return <span>Unblind</span>;
                } else {
                  return <span>Blind</span>;
                }
              }
            },
          };
          columns.splice(4, 0, newColumn);
        }
        return columns;
      }
      case status === "confirmed": {
        const columns = [
          { field: "loadId", headerName: "Load Id", width: 80 },
          { field: "shipper_name", headerName: "Shipper Name", width: 150 },
          { field: "branch_name", headerName: "Branch Name", width: 110 },
          { field: "loadType", headerName: "BId Mode", width: 110 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          {
            field: "rate_quote_type",
            headerName: "Rate Quotation Type",
            width: 150,
          },
          { field: "fleet_name", headerName: "Vehicle  Type", width: 150 },
          {
            field: "fleets",
            headerName: " No. of Vehicle Required ",
            width: 120,
          },
          {
            field: "pending_vehicle_count",
            headerName: "Vehicle Assignment Pending",
            width: 150,
          },
          {
            field: "reportDate",
            headerName: "Reporting Date & Time",
            width: 250,
          },
          {
            field: "bidDate",
            headerName: "Bid Date & Time",
            width: 180,

            renderCell: (params) => {
              // Check if loadType is "Indent"
              if (params.row.loadType === "Indent") {
                return "N/A";
              } else {
                return params.row.bidDate;
              }
            },
          },

          {
            field: "action",
            headerName: "Action",
            width: 250,
            renderCell: (params) => (
              <>
                <Tooltip title="View Load">
                  <IconButton
                    onClick={() => {
                      viewHandler(params.row.id);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Add Vehicle">
                  <IconButton onClick={() => VehicleAdd(params.row)}>
                    <LocalShippingIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Start tracking">
                  <IconButton
                    disabled={
                      params.row.enable_tracking ||
                      !params.row.transporters?.some((x) => x.fleets.length > 0)
                    }
                    onClick={() => openTrackingModel(params.row.id)}
                  >
                    <GpsFixedIcon />
                  </IconButton>
                </Tooltip>
                {params.row.loadType != "Indent" ? (
                  <Tooltip title="Assignment">
                    <IconButton onClick={() => handleActionClick(params.row)}>
                      <AssignmentIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ""
                )}

                <Tooltip title="Mark as completed">
                  <IconButton onClick={() => openMarkComplete(params.row.id)}>
                    <AssignmentTurnedInIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Cancel">
                  <IconButton onClick={() => deleteHandler(params.row.id)}>
                    <Cancel />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
          // {
          //   field: "approval",
          //   headerName: "Approval",
          //   width: 150,
          // },
        ];
        if (userType !== "shp") {
          const newColumn = {
            field: "bid_show",
            headerName: "B/U",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return <span>N/A</span>;
              } else {
                if (params.row.bid_show) {
                  return <span>Unblind</span>;
                } else {
                  return <span>Blind</span>;
                }
              }
            },
          };
          columns.splice(4, 0, newColumn);
        }
        return columns;
      }
      case status === "partially_confirmed": {
        const columns = [
          { field: "loadId", headerName: "Load Id", width: 80 },
          { field: "shipper_name", headerName: "Shipper Name", width: 150 },
          { field: "branch_name", headerName: "Branch Name", width: 110 },
          { field: "loadType", headerName: "BId Mode", width: 110 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          {
            field: "rate_quote_type",
            headerName: "Rate Quotation Type",
            width: 150,
          },
          { field: "fleet_name", headerName: "Vehicle  Type", width: 150 },
          {
            field: "fleets",
            headerName: " No. of Vehicle Required ",
            width: 120,
          },
          {
            field: "pending_vehicle_count",
            headerName: "Vehicle Assignment Pending",
            width: 150,
          },

          {
            field: "reportDate",
            headerName: "Reporting Date & Time",
            width: 260,
          },
          { field: "bidDate", headerName: "Bid Date & Time", width: 150 },

          {
            field: "action",
            headerName: "Action",
            width: 170,
            renderCell: (params) => (
              <>
                <Tooltip title="View Load">
                  <IconButton
                    onClick={() => {
                      viewHandler(params.row.id);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_view_assigned_transporters) && (
                  <Tooltip title="Assignment">
                    <IconButton
                      onClick={() => {
                        handleActionClick(params.row);
                      }}
                    >
                      <AssignmentIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Mark as confirmed">
                  <IconButton onClick={() => openMarkComplete(params.row.id)}>
                    <AssignmentTurnedInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton onClick={() => deleteHandler(params.row.id)}>
                    <Cancel />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
          // {
          //   field: "approval",
          //   headerName: "Approval",
          //   width: 150,
          // },
        ];
        if (userType !== "shp") {
          const newColumn = {
            field: "bid_show",
            headerName: "B/U",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return <span>N/A</span>;
              } else {
                if (params.row.bid_show) {
                  return <span>Unblind</span>;
                } else {
                  return <span>Blind</span>;
                }
              }
            },
          };
          columns.splice(4, 0, newColumn);
        }
        return columns;
      }
      case status === "cancelled": {
        const columns = [
          { field: "loadId", headerName: "Load Id", width: 80 },
          { field: "shipper_name", headerName: "Shipper Name", width: 150 },
          { field: "branch_name", headerName: "Branch Name", width: 110 },
          { field: "loadType", headerName: "BId Mode", width: 110 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          {
            field: "rate_quote_type",
            headerName: "Rate Quotation Type",
            width: 150,
          },
          { field: "fleet_name", headerName: "Vehicle  Type", width: 150 },
          {
            field: "fleets",
            headerName: " No. of Vehicle Required ",
            width: 120,
          },
          {
            field: "pending_vehicle_count",
            headerName: "Vehicle Assignment Pending",
            width: 150,
          },

          {
            field: "reportDate",
            headerName: "Reporting Date & Time",
            width: 200,
          },
          {
            field: "bidDate",
            headerName: "Bid Date & Time",
            width: 180,

            renderCell: (params) => {
              // Check if loadType is "Indent"
              if (params.row.loadType === "Indent") {
                return "N/A";
              } else {
                return params.row.bidDate;
              }
            },
          },

          {
            field: "cancelReason",
            headerName: "Cancelation Reason",
            width: 150,
          },
          {
            field: "action",
            headerName: "Action",
            width: 170,
            renderCell: (params) => (
              <Tooltip title="View">
                <IconButton
                  onClick={() => viewHandler(params.row.id)}
                  aria-label="delete"
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            ),
          },
          // { field: "approval", headerName: "Variance Approval", width: 150 },
        ];
        if (userType !== "shp") {
          const newColumn = {
            field: "bid_show",
            headerName: "B/U",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return <span>N/A</span>;
              } else {
                if (params.row.bid_show) {
                  return <span>Unblind</span>;
                } else {
                  return <span>Blind</span>;
                }
              }
            },
          };
          columns.splice(4, 0, newColumn);
        }
        return columns;
      }
      default: {
        const columns = [
          { field: "loadId", headerName: "Load Id", width: 100 },
          { field: "shipper_name", headerName: "Shipper Name", width: 150 },
          { field: "branch_name", headerName: "Branch Name", width: 110 },
          { field: "loadType", headerName: "BId Mode", width: 110 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          {
            field: "rate_quote_type",
            headerName: "Rate Quotation Type",
            width: 150,
          },
          { field: "fleet_name", headerName: "Vehicle  Type", width: 150 },
          {
            field: "fleets",
            headerName: " No. of Vehicle Required ",
            width: 120,
          },
          {
            field: "pending_vehicle_count",
            headerName: "Vehicle Assignment Pending",
            width: 150,
          },
          {
            field: "reportDate",
            headerName: "Reporting Date & Time",
            width: 200,
          },
          {
            field: "bidDate",
            headerName: "Bid Date & Time",
            width: 180,

            renderCell: (params) => {
              // Check if loadType is "Indent"
              if (params.row.loadType === "Indent") {
                return "N/A";
              } else {
                return params.row.bidDate;
              }
            },
          },

          {
            field: "action",
            headerName: "Action",
            width: 120,
            renderCell: (params) => (
              <>
                <Tooltip title="View Load">
                  <IconButton
                    size="small"
                    onClick={() => viewHandler(params.row.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Bid">
                  <IconButton
                    size="small"
                    onClick={() => viewHandlerHistory(params.row)}
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="View Transporter">
                  <IconButton
                    size="small"
                    onClick={() => handleActionClick(params.row)}
                  >
                    <LocalShippingIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ];
        if (userType !== "shp") {
          const newColumn = {
            field: "bid_show",
            headerName: "B/U",
            width: 150,
            renderCell: (params) => {
              if (params.row.loadType === "Indent") {
                return <span>N/A</span>;
              } else {
                if (params.row.bid_show) {
                  return <span>Unblind</span>;
                } else {
                  return <span>Blind</span>;
                }
              }
            },
          };
          columns.splice(4, 0, newColumn);
        }
        return columns;
      }
    }
  };

  const columns = columnsReturnFunction();
  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };

  const rowReturnFunction = (data) => {
    let arrayOfObjects;

    if (
      status === "live" ||
      status === "not_started" ||
      status === "draft" ||
      status === "pending" ||
      status === "partially_confirmed" ||
      status === "confirmed"
    ) {
      arrayOfObjects = data.map((ele) => {
        return {
          id: ele.bl_id,
          loadId: `L-${ele.bl_id.slice(-5)}`.toUpperCase(),
          loadType: ele.load_type,
          source: ele.src_cities,
          destination: ele.dest_cities,
          rate_quote_type: ele.rate_quote_type,
          fleets: ele.total_no_of_fleets,
          completion_reason: ele.completion_reason,
          total_no_of_fleets_assigned: ele.total_no_of_fleets_assigned,
          fleet_name: ele.fleet_name,
          shipper_name: ele.shipper_name,
          transporters_participated: ele.transporters_participated,
          branch_name: ele.branch_name,
          bid_end_time: ele.bid_end_time,
          no_of_bids_placed: ele.no_of_bids_placed,
          bid_extended_time: ele.bid_extended_time,
          pending_vehicle_count: ele.pending_vehicle_count,
          enable_price_match: ele.enable_price_match,
          reportDate: `${moment(ele.reporting_from_time).format(
            "YYYY-MM-DD hh:mm A"
          )} - ${moment(ele.reporting_to_time).format("YYYY-MM-DD hh:mm A")}`,
          bidDate: moment(ele.bid_time).format("YYYY-MM-DD hh:mm A"),
          bidStatus: "Pending",
          action: "View",
          approval: "NA",
          enableTracking: ele.enable_tracking,
          transporters: ele?.transporters,
          bid_show: ele?.bid_show,
        };
      });
    } else if (status === "cancelled") {
      arrayOfObjects = data.map((ele) => {
        return {
          id: ele.bl_id,
          loadId: `L-${ele.bl_id.slice(-5)}`.toUpperCase(),
          loadType: ele.load_type,
          source: ele.dest_cities,
          destination: ele.dest_cities,
          rate_quote_type: ele.rate_quote_type,
          fleet_name: ele.fleet_name,
          shipper_name: ele.shipper_name,
          branch_name: ele.branch_name,
          fleets: ele.total_no_of_fleets,
          pending_vehicle_count: ele.pending_vehicle_count,
          reportDate: `${moment(ele.reporting_from_time).format(
            "YYYY-MM-DD hh:mm A"
          )}- ${moment(ele.reporting_to_time).format("YYYY-MM-DD hh:mm A")}`,
          bidDate: moment(ele.bid_time).format("YYYY-MM-DD hh:mm A"),
          action: "View",
          cancelReason:
            ele.bl_cancellation_reason === null
              ? "NA"
              : ele.bl_cancellation_reason,
          approval: "NA",
          bid_show: ele?.bid_show,
        };
      });
    } else {
      arrayOfObjects = data.map((ele) => {
        return {
          id: ele.bl_id,
          loadId: `L-${ele.bl_id.slice(-5)}`.toUpperCase(),
          loadType: ele.load_type,
          source: ele.src_cities,
          destination: ele.dest_cities,
          rate_quote_type: ele.rate_quote_type,
          fleets: ele.total_no_of_fleets,
          completion_reason: ele.completion_reason,
          total_no_of_fleets_assigned: ele.total_no_of_fleets_assigned,
          fleet_name: ele.fleet_name,
          shipper_name: ele.shipper_name,
          branch_name: ele.branch_name,
          bid_end_time: ele.bid_end_time,
          no_of_bids_placed: ele.no_of_bids_placed,
          bid_extended_time: ele.bid_extended_time,
          pending_vehicle_count: ele.pending_vehicle_count,
          reportDate: `${moment(ele.reporting_from_time).format(
            "YYYY-MM-DD hh:mm A"
          )} - ${moment(ele.reporting_to_time).format("YYYY-MM-DD hh:mm A")}`,
          bidDate: moment(ele.bid_time).format("YYYY-MM-DD hh:mm A"),
          bidStatus: "Pending",
          action: "View",
          approval: "NA",
          enableTracking: ele.enable_tracking,
          transporters: ele?.transporters,
          bid_show: ele?.bid_show,
        };
      });
    }

    return arrayOfObjects;
  };

  const fetchData = () => {
    setIsLoading(true);
    return getTripData(status)
      .then((res) => {
        if (res.data.success === true) {
          console.log(res.data.data);
          const rowValue = rowReturnFunction(res.data.data);
          setRows(rowValue);
          console.log(rowValue);
          setFilteredRows(rowValue);
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
  };

  useEffect(() => {
    if (userType !== "shp") {
      if (filterFlag) filterHandler(filterData);
      else fetchData();
    } else {
      if (filterFlagShip) filterHandlerShip(filterData);
      else filterHandlerShp();
    }
  }, [userType, filterFlag, refresh]);

  const publishHandler = (id) => {
    setOpenPublishModel(true);
    setSelectedId(id);
  };

  const fetchCancelReason = () => {
    setIsLoading(true);
    viewCancelReason()
      .then((res) => {
        if (res.data.success === true) {
          const options = res.data.data.map((ele) => {
            return {
              label: ele.desc,
              value: ele.id,
            };
          });
          const other = {
            label: "Other",
            value: "other",
          };
          options.push(other);
          setCancelOptions(options);
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
  };

  const deleteHandler = (id) => {
    fetchCancelReason();
    setOpenDeleteModel(true);
    setSelectedId(id);
  };

  const deleteConfHandler = (id) => {
    setOpenDeleteConfModel(true);
    setSelectedId(id);
  };

  const handleActionClick = (row) => {
    setReason(row.completion_reason);
    setSelectedId(row.id);
    setSelectedRow(row.transporters);
    setOpenModal(true);
    setSelectedEntity(row);
  };

  const viewHandler = (id) => {
    setSelectedId(id);
    setviewModel(true);
  };

  const closeHistoryModel = () => {
    setSelectedId();
    setShowAsighnmentHistory(false);
  };
  const viewHandlerHistory = (row) => {
    setReason(row.completion_reason);
    setShowAsighnmentHistory(true);
    getPendingBidDetails(row.id).then((res) => {
      if (res.data.success === true) {
        setTranseporterHistory(res.data.data);
        console.log("dataui", res.data.data);
      } else {
        dispatch(
          openSnackbar({ type: "error", message: res.data.clientMessage })
        );
      }
    });
  };
  const [asighnedVehicle, setAsighnVehicle] = useState();
  const VehicleAdd = (row) => {
    setSelectedId(row.id);
    setAsighnVehicle(row.total_no_of_fleets_assigned);
    setAssignedTransporterDetails(row.transporters);
    setVehicle(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setSelectedId("");
    setOpenModal(false);
    setviewModel(false);
    setVehicle(false);
    if (userType !== "shp") {
      if (filterFlag) filterHandler(filterData);
      else fetchData();
    } else {
      if (filterFlagShip) filterHandlerShip(filterData);
      else filterHandlerShp();
    }
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

  const closePublish = () => {
    setOpenPublishModel(false);
    setSelectedId("");
    setOpenDeleteModel(false);
    setOpenDeleteConfModel(false);
    setOpenTracking(false);
    setSelectedCancelOption("");
    setOtherValue("");
  };

  const handlePublishConfirm = () => {
    setIsLoading(true);
    return publishDraftBid(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: "success", message: res.data.clientMessage })
          );
          closePublish();
          if (userType !== "shp") {
            if (filterFlag) filterHandler(filterData);
            else fetchData();
          } else {
            if (filterFlagShip) filterHandlerShip(filterData);
            else filterHandlerShp();
          }
        } else {
          closePublish();
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
  };

  const handleDeleteConfirm = () => {
    if (selectedCancelOption === "") {
      setSelectError(true);
    } else if (selectedCancelOption === "Other" && otherValue === "") {
      setTextError(true);
    } else {
      setIsLoading(true);
      const payload = {
        reason:
          selectedCancelOption === "Other" ? otherValue : selectedCancelOption,
      };
      cancelBid(selectedId, payload)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: "success", message: res.data.clientMessage })
            );
            closePublish();
            if (userType !== "shp") {
              if (filterFlag) filterHandler(filterData);
              else fetchData();
            } else {
              if (filterFlagShip) filterHandlerShip(filterData);
              else filterHandlerShp();
            }
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
    }
  };

  const handleDeleteConfirmHandler = () => {
    setIsLoading(true);
    return deleteBid(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: "success", message: res.data.clientMessage })
          );
          closePublish();
          if (userType !== "shp") {
            if (filterFlag) filterHandler(filterData);
            else fetchData();
          } else {
            if (filterFlagShip) filterHandlerShip(filterData);
            else filterHandlerShp();
          }
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
  };

  const openMarkComplete = (id) => {
    setOpenMarkCompleteModel(true);
    setTransId(id);
  };

  const closeUnassingModel = () => {
    setOpenMarkCompleteModel(false);
    setTransId("");
    setTextareaValue("");
  };

  const handleMarkComplete = () => {
    if (status === "partially_confirmed" || status === "confirmed") {
      if (textareaValue) {
        setIsLoading(true);

        const updateStatus =
          status === "partially_confirmed" ? "confirmed" : "completed";
        let payload = {
          completion_reason: textareaValue,
        };

        markCompleted(transId, updateStatus, payload)
          .then((res) => {
            if (res.data.success === true) {
              dispatch(
                openSnackbar({
                  type: "success",
                  message: res.data.clientMessage,
                })
              );
              closeUnassingModel();
              setTextareaValue("");
              if (userType !== "shp") {
                if (filterFlag) filterHandler(filterData);
                else fetchData();
              } else {
                if (filterFlagShip) filterHandlerShip(filterData);
                else filterHandlerShp();
              }
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
      } else {
        dispatch(
          openSnackbar({ type: "error", message: "Please give a reason" })
        );
      }
    } else {
      setIsLoading(true);

      const updateStatus =
        status === "partially_confirmed" ? "confirmed" : "completed";
      let payload = {};
      markCompleted(transId, updateStatus, payload)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: "success", message: res.data.clientMessage })
            );
            closeUnassingModel();
            if (userType !== "shp") {
              if (filterFlag) filterHandler(filterData);
              else fetchData();
            } else {
              if (filterFlagShip) filterHandlerShip(filterData);
              else filterHandlerShp();
            }
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
    }
  };

  const filterStateHandler = (flag, filter_data) => {
    setFilterFlag(flag);
    setFilterFlagShip(flag);
    setFilterData(filter_data);
  };

  const filterHandler = (data) => {
    setIsLoading(true);
    getFilteredBidData(status, data)
      .then((res) => {
        if (res.data.success === true) {
          const rowValue = rowReturnFunction(res.data.data);
          setRows(rowValue);
          setFilteredRows(rowValue);
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
  };

  const openTrackingModel = (id) => {
    setSelectedId(id);
    setOpenTracking(true);
  };

  const handleTrackingConfirm = () => {
    setIsLoading(true);
    enableTracking(selectedId, status)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: "success", message: res.data.clientMessage })
          );
          closePublish();
          if (userType !== "shp") {
            if (filterFlag) filterHandler(filterData);
            else fetchData();
          } else {
            if (filterFlagShip) filterHandlerShip(filterData);
            else filterHandlerShp();
          }
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
  };

  const filterHandlerShip = (data) => {
    setIsLoading(true);
    getFilteredBidData(status, data)
      .then((res) => {
        if (res.data.success === true) {
          const rowValue = rowReturnFunction(res.data.data);
          setRows(rowValue);
          setFilteredRows(rowValue);
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
  };

  const filterHandlerShp = () => {
    setIsLoading(true);
    const payload = {
      shipper_id: userType_shipperId,
      rc_id:
        userType_regionClusterId !== "null" ? userType_regionClusterId : null,
      branch_id: userType_branchId !== "null" ? userType_branchId : null,
      from_date: null,
      to_date: null,
    };
    getFilteredBidData(status, payload)
      .then((res) => {
        if (res.data.success === true) {
          const rowValue = rowReturnFunction(res.data.data);
          setRows(rowValue);
          setFilteredRows(rowValue);
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
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FilterComponent
                filterStateHandler={filterStateHandler}
                filterHandler={filterHandler}
                filterHandlerShip={filterHandlerShip}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ marginTop: "20px", padding: "10px" }}>
            <div className="customCardheader">
              <Typography variant="h4"> Load Table</Typography>
            </div>
            <Grid container flexGrow="unset">
              <Grid container sx={{ mb: 1 }} justifyContent="space-between">
                <Grid item md={10}></Grid>
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
              <Grid item md={8}></Grid>
              <Grid item md={4}>
                <div style={{ marginBottom: "20px" }}>
                  <TextField
                    label="Search"
                    size="small"
                    value={searchValue}
                    onChange={handleSearchChange}
                    variant="outlined"
                    fullWidth
                  />
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                style={{ width: "100px", overflow: "auto" }}
              >
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                  />
                </div>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {openModal ? (
        <TransporterDetails
          selectedId={selectedId}
          selectedEntity={selectedEntity}
          status={status}
          reason={reason}
          transportSelectedRow={selectedRow}
          open={openModal}
          onClose={handleCloseModal}
          row={rows}
        />
      ) : null}

      {viewModel ? (
        <LoadVideModel
          selectedId={selectedId}
          status={status}
          selectedRow={selectedRow}
          handleCloseModal={handleCloseModal}
          operational_accesses={operational_accesses}
          superAdmin={superAdmin}
        />
      ) : null}

      <Dialog open={openMarkCompleteModel} onClose={closeUnassingModel}>
        <div className="customCardheader">
          <Typography variant="h4">
            Mark as{" "}
            {status === "partially_confirmed" ? "confirmed" : "completed"}
          </Typography>
        </div>
        <DialogContent>
          <Typography>
            Are you sure you want to make this as{" "}
            {status === "partially_confirmed" ? "confirmed" : "completed"}?
          </Typography>
          {status === "partially_confirmed" || "confirmed" ? (
            <TextareaAutosize
              label="Comment"
              placeholder="Enter your reason..."
              minRows={4}
              style={{ width: "100%", marginBottom: "15px", marginTop: "20px" }}
              value={textareaValue}
              onChange={handleTextareaChange}
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeUnassingModel}
            variant="contained"
            color="error"
          >
            No
          </Button>
          <Button
            onClick={handleMarkComplete}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteConfModel} onClose={closePublish}>
        <div className="customCardheader">
          <Typography variant="h4">Delete bid</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to Delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePublish} variant="contained" color="error">
            No
          </Button>
          <Button
            onClick={handleDeleteConfirmHandler}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth="xs" open={openDeleteModel} onClose={closePublish}>
        <div className="customCardheader">
          <Typography variant="h4">Cancel bid</Typography>
        </div>
        <DialogContent sx={{ mt: -3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Are you sure you want to Cancel?</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" error={selectError}>
                <InputLabel id="demo-simple-select-disabled-label">
                  Cancel reason*
                </InputLabel>
                <Select
                  size="small"
                  fullWidth
                  label="Cancel reason*"
                  required
                  onChange={(e) => {
                    setSelectedCancelOption(e.target.value);
                    setOtherValue("");
                    setSelectError(false);
                  }}
                >
                  {cancelOptions.map((ele) => (
                    <MenuItem key={ele.value} value={ele.label}>
                      {ele.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {selectError && "Select reason"}
                </FormHelperText>
              </FormControl>
            </Grid>
            {selectedCancelOption === "Other" ? (
              <Grid item xs={12}>
                <TextField
                  size="small"
                  label="Enter reason"
                  required
                  fullWidth
                  value={otherValue}
                  onChange={(e) => {
                    setOtherValue(e.target.value);
                    setTextError(false);
                  }}
                  error={textError}
                  helperText={textError && "Enter reason"}
                />
              </Grid>
            ) : null}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePublish} variant="contained" color="error">
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

      <Dialog open={openPublishModel} onClose={closePublish}>
        <div className="customCardheader">
          <Typography variant="h4">Publish bid</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to publish?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePublish} variant="contained" color="error">
            No
          </Button>
          <Button
            onClick={handlePublishConfirm}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTracking} onClose={closePublish}>
        <div className="customCardheader">
          <Typography variant="h4">Tracking</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to start tracking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePublish} variant="contained" color="error">
            No
          </Button>
          <Button
            onClick={handleTrackingConfirm}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* add Vehicle */}
      {Vehicle ? (
        <VehicleInformation
          asighnedVehicle={asighnedVehicle}
          id={selectedId}
          handleCloseModal={handleCloseModal}
          assignedTransporterDetails={assignedTransporterDetails}
        />
      ) : null}

      {/* view unasighn */}
      <Dialog
        maxWidth="md"
        scroll="paper"
        // open={viewUnasighnModal}
        open={asighnmentHistory}
        onClose={() => closeHistoryModel()}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="p">
            <strong style={{ textTransform: "capitalize" }}></strong>
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
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">
                        Total number of attempts
                      </TableCell>
                      <TableCell align="left">Lowest price</TableCell>
                      <TableCell align="left">No of Vehicle </TableCell>
                      <TableCell align="left">Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transeporterHistory.map((row) => (
                      <>
                        <TableRow key={row.name}>
                          <TableCell align="left"> {row.name} </TableCell>

                          <TableCell align="left">
                            {row.total_number_attempts}
                          </TableCell>
                          <TableCell align="left">
                            {" "}
                            ₹ {row.lowest_price}
                          </TableCell>
                          <TableCell align="left">
                            {row.fleet_assigned}
                          </TableCell>
                          <TableCell align="left">{row.last_comment}</TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <p>Completion Reason : {reason}</p>
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
    </>
  );
}
