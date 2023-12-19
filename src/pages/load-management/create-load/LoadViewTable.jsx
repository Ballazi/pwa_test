import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import CountdownCell from "./CountdownCell";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteIcon from "@mui/icons-material/Delete";
import { decodeToken } from "react-jwt";
// import StepIconComponent from "../../../components/stepIcon-component/StepIconComponent";
// import StatusChip from "../../../components/stepIcon-component/StatusChip";
import {
  getTripData,
  publishDraftBid,
  deleteBid,
} from "../../../api/trip-management/manage-trip";
import BackdropComponent from "../../../components/backdrop/Backdrop";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import moment from "moment";
import LoadVideModel from "../../view-bid/load-view-model/LoadViewModel";
import { getFilteredBidData } from "../../../api/trip-management/manage-trip";

const LoadViewTable = ({ key, updateSelectedRow }) => {
  const dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [viewModel, setViewModel] = useState(false);
  const [openPublishModel, setOpenPublishModel] = useState(false);
  const [openDeleteConfModel, setOpenDeleteConfModel] = useState(false);
  const userType = localStorage.getItem("user_type");
  const userType_shipperId = localStorage.getItem("user_id");
  const userType_regionClusterId = localStorage.getItem("region_cluster_id");
  const userType_branchId = localStorage.getItem("branch_id");
  const [searchValue, setSearchValue] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const token = JSON.parse(localStorage.getItem("authToken"));
  let operational_accesses = null;
  let superAdmin = false;

  if (token) {
    superAdmin = decodeToken(token)?.access?.SA;
    operational_accesses = decodeToken(token)?.access?.operational_access;
  }
  const [countdownValues, setCountdownValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const columns = [
    { field: "loadId", headerName: "Load Id", width: 90 },
    { field: "shipper_name", headerName: "Shipper Name", width: 150 },
    { field: "branch_name", headerName: "Branch Name", width: 110 },
    { field: "loadType", headerName: "Bid Mode", width: 110 },
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
          <Tooltip title="View/Edit">
            <IconButton onClick={() => viewHandler(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Publish">
            <IconButton
              onClick={() => publishHandler(params.row.id)}
              disabled={new Date(params.row.bidDate) <= new Date()}
            >
              <PublishedWithChangesIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => deleteConfHandler(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
    // { field: "approval", headerName: "Variance Approval", width: 130 },
    ,
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

  const viewHandler = (id) => {
    setSelectedId(id);
    setViewModel(true);
  };

  const publishHandler = (id) => {
    setOpenPublishModel(true);
    setSelectedId(id);
  };

  const deleteConfHandler = (id) => {
    setOpenDeleteConfModel(true);
    setSelectedId(id);
  };

  const handleCloseModal = () => {
    setSelectedId("");
    setViewModel(false);
    setOpenPublishModel(false);
    setOpenDeleteConfModel(false);
  };

  const handleCloseModalView = () => {
    setSelectedId("");
    setViewModel(false);
    if (userType !== "shp") {
      fetchData();
    } else {
      filterHandlerShp();
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    getTripData("draft")
      .then((res) => {
        if (res.data.success === true) {
          const rowValue = res.data.data?.map((ele) => {
            return {
              id: ele.bl_id,
              loadId: `L-${ele.bl_id.slice(-5)}`.toUpperCase(),
              shipper_name: ele.shipper_name,
              source: ele.src_cities,
              destination: ele.dest_cities,
              fleets: ele.total_no_of_fleets,
              fleet_name: ele.fleet_name,
              branch_name: ele.branch_name,
              loadType: ele.load_type,
              rate_quote_type: ele.rate_quote_type,

              fleets: ele.total_no_of_fleets,
              reportDate: `${moment(ele.reporting_from_time).format(
                "YYYY-MM-DD hh:mm A"
              )} - ${moment(ele.reporting_to_time).format(
                "YYYY-MM-DD hh:mm A"
              )}`,
              bidDate: moment(ele.bid_time).format("YYYY-MM-DD hh:mm A"),
              bidStatus: "Pending",
              action: "View",
              bid_show: ele?.bid_show,
              // approval: "NA",
            };
          });
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
    getFilteredBidData("draft", payload)
      .then((res) => {
        if (res.data.success === true) {
          const rowValue = res.data.data?.map((ele) => {
            return {
              id: ele.bl_id,
              loadId: `L-${ele.bl_id.slice(-5)}`.toUpperCase(),
              shipper_name: ele.shipper_name,
              source: ele.src_cities,
              destination: ele.dest_cities,
              fleets: ele.total_no_of_fleets,
              fleet_name: ele.fleet_name,
              branch_name: ele.branch_name,
              loadType: ele.load_type,
              rate_quote_type: ele.rate_quote_type,

              fleets: ele.total_no_of_fleets,
              reportDate: `${moment(ele.reporting_from_time).format(
                "YYYY-MM-DD hh:mm A"
              )} - ${moment(ele.reporting_to_time).format(
                "YYYY-MM-DD hh:mm A"
              )}`,
              bidDate: moment(ele.bid_time).format("YYYY-MM-DD hh:mm A"),
              bidStatus: "Pending",
              action: "View",
              bid_show: ele?.bid_show,
            };
          });
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

  useEffect(() => {
    if (userType !== "shp") {
      fetchData();
    } else {
      filterHandlerShp();
    }
  }, [userType, key]);

  const handlePublishConfirm = () => {
    setIsLoading(true);
    publishDraftBid(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: "success", message: res.data.clientMessage })
          );
          handleCloseModal();
          if (userType !== "shp") {
            fetchData();
          } else {
            filterHandlerShp();
          }
        } else {
          handleCloseModal();
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

  const handleDeleteConfirmHandler = () => {
    setIsLoading(true);
    return deleteBid(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: "success", message: res.data.clientMessage })
          );
          handleCloseModal();
          if (userType !== "shp") {
            fetchData();
          } else {
            filterHandlerShp();
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

  return (
    <>
      <BackdropComponent loading={loading} />
      {viewModel ? (
        <LoadVideModel
          selectedId={selectedId}
          status={"draft"}
          handleCloseModal={handleCloseModalView}
          // selectedRow={selectedRow}
          operational_accesses={operational_accesses}
          superAdmin={superAdmin}
        />
      ) : null}

      <Dialog open={openPublishModel} onClose={handleCloseModal}>
        <div className="customCardheader">
          <Typography variant="h4">Publish bid</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to publish?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="error">
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

      <Dialog open={openDeleteConfModel} onClose={handleCloseModal}>
        <div className="customCardheader">
          <Typography variant="h4">Delete bid</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to Delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="error">
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

      <Card style={{ marginTop: "20px", padding: "10px" }}>
        <Grid container flexGrow="unset">
          <Grid item xs={12}>
            <div className="customCardheader">
              <Typography variant="h4"> Saved Load Table</Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="end">
              <Grid item xs={12} sm={6} md={4}>
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
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ marginTop: 2, width: "100px", overflow: "scroll" }}
          >
            {/* <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                checkboxSelection
                                rowsPerPageOptions={[5, 10, 20]}
                                getRowHeight={calculateRowHeight}
                                // headerClassName={classes.blueHeader}
                                showCellVerticalBorder
                                showColumnVerticalBorder
                                disableColumnMenu
                                disableRowSelectionOnClick
                            /> */}
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRowData = rows.filter((row) =>
                    selectedIDs.has(row.id.toString())
                  );
                  updateSelectedRow(selectedRowData);
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default LoadViewTable;
