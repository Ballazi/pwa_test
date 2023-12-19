import {
  Dialog,
  DialogActions,
  Card,
  Container,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  Typography,
  Grid,
  Tooltip,
  IconButton,
  DialogContent,
  Box,
} from "@mui/material";
import {
  DeleteOutline,
  KeyboardArrowDown,
  LockOpen,
} from "@mui/icons-material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  blockTranseporter,
  fetchAllBlacklisted,
  unblockTransporter,
} from "../../../../api/public-transporter/public-transporter";
import { getAllshiper } from "../../../../api/siperInformation/shipperInfo";
import { openSnackbar } from "../../../../redux/slices/snackbar-slice";
import { getAlltransporters } from "../../../../api/register/transporter";
import dayjs from "dayjs";

function CustomPagination(props) {
  const exportFields = ["name", "reason", "date"];
  return (
    <>
      <GridToolbarContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",

            // padding: '8px',
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "25px",
              padding: "8px",
            }}
          >
            <GridToolbarExport
              csvOptions={{
                fields: exportFields,
              }}
            />
          </div>
          <div>
            <GridPagination {...props} />
          </div>
        </div>
      </GridToolbarContainer>
    </>
  );
}

const BlockedTransporter = ({
  isOpen,
  transporterId,
  handleClose,
  getAllTransportersData,
}) => {
  const [selectedType, setSelectedType] = useState();
  const [selectedShipperType, setSelectedShipperType] = useState([]);
  const [isTypeSelected, setIsTypeSelected] = useState(true);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [blockList, setBlockList] = useState([]);
  const [shipper, setShipper] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState();
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [viewBlock, setBlock] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [isLoading, setIsLoading] = useState([]);
  const [rowId, setRowId] = useState([]);
  const shipper_id = localStorage.getItem("shipper_id");
  const [transporters, setTransporters] = useState([]);

  const [cancellationReason, setCancellationReason] = useState("");

  const column = [
    { field: "name", headerName: "Blocked With", width: 150 },
    { field: "reason", headerName: "Reason for Blocking", width: 170 },
    { field: "date", headerName: "Blocked Date", width: 120 },
    {
      field: "actions",
      headerName: "Actions",

      width: 80,
      renderCell: (params) => (
        <div>
          <Tooltip title="Unblock">
            <IconButton
              onClick={() => {
                handleUnblockClick(params.row.id);
              }}
            >
              <LockOpen />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];
  const handleBlockClick = (transporterId) => {
    setSelectedTransporter(
      transporters.find((transporter) => transporter.id === transporterId)
    );
    setBlockDialogOpen(true);
  };
  const handleBlockCancel = () => {
    setBlockDialogOpen(false);
    setSelectedTransporter(null);
  };
  const handleUnblockClick = (id) => {
    console.log("iddddd", id);
    setSelectedTransporter(
      transporters.find((transporter) => transporter.id === bt_id)
    );
    setUnblockDialogOpen(true);
    setRowId(id);
  };
  const handleUnblockCancel = () => {
    setUnblockDialogOpen(false);
    setSelectedTransporter(null);
  };
  const dispatch = useDispatch();

  const shipperData = () => {
    setIsLoading(true);
    // if (selectedType === "Partial") {
    return getAllshiper()
      .then((data) => {
        if (data.success === true) {
          console.log("shipperrrr::::::", data);

          // dispatch(
          //   openSnackbar({ type: 'success', message: data.clientMessage })
          // );
          setShipper(data.data);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setShipper([]);
        }
      })
      .catch((error) => {
        console.error("error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // }
  };

  const handleUnblock = () => {
    console.log("objectlalala", rowId);

    return unblockTransporter(rowId).then((res) => {
      console.log("unblock::::::", res);
      if (res.data.success === true) {
        dispatch(
          openSnackbar({
            type: "success",
            message: res.data.clientMessage,
          })
        );
        handleClose();
        getAllTransportersData();
      } else {
        openSnackbar({
          type: "error",
          message: res.data.clientMessage,
        });
      }
    });
  };

  const handleBlock = (transporterId) => {
    // setSelectedTransporter(transporter);
    // setBlock(true);

    setCancellationReason();
    setSelectedShipper();
    setSelectedType();
    // console.log("::::", transporter.trnsp_id)

    return fetchAllBlacklisted(transporterId).then((res) => {
      console.log("xoxoooo:::::", res);
      if (res.data.success === true) {
        console.log("xoxoooo:::::", res.data.data);
        const blockTransporter = res.data.data.map((item) => ({
          id: item.bt_id,
          name: item.shipper ? item.shipper.name : "ACULEAD",
          date: dayjs(item.created_at).format('DD/MM/YYYY'),
          reason: item.reason,
        }));
        setBlockList(blockTransporter);
        console.log(blockList);
        // dispatch(
        //   openSnackbar({
        //     type: 'success', message: data.data.clientMessage
        //   })
        // )
      } else {
        alert("ok");
        dispatch(
          openSnackbar({
            type: "error",
            message: data.clientMessage,
          })
        );
      }
    });
  };

  useEffect(() => {
    console.log("vfta", transporterId);
    // if (selectedType === "Partial") {
    shipperData(),
      // }
      handleBlock(transporterId),
      setCancellationReason(""),
      setSelectedShipper(""),
      // console.log("selected type:::::::::::;",)
      setSelectedType("");
  }, [transporterId]);

  const handleBlockSubmit = () => {
    console.log("object", selectedType);
    console.log(cancellationReason);
    if (selectedType && cancellationReason) {
      if (selectedType === "Partial") {
        if (selectedShipper) {
          const payload = {
            bt_transporter_id: transporterId,
            bt_shipper_id: selectedShipper.shpr_id,
            reason: cancellationReason,
          };

          blockTranseporter(payload)
            .then((res) => {
              if (res.data.success) {
                dispatch(
                  openSnackbar({
                    type: "success",
                    message: res.data.clientMessage,
                  })
                );
                handleClose();
                getAllTransportersData();
              } else {
                dispatch(
                  openSnackbar({
                    type: "error",
                    message: res.data.clientMessage,
                  })
                );
              }
            })
            .catch((err) =>
              dispatch(
                openSnackbar({
                  type: "error",
                  message: "Some thing went wrong please try again latter",
                })
              )
            );
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: "Please select a shipper",
            })
          );
        }
      } else if (selectedType === "Complete") {
        const payload = {
          bt_transporter_id: transporterId,
          reason: cancellationReason,
        };

        blockTranseporter(payload).then((res) => {
          if (res.data.success) {
            console.log("hellloooo", res);
            dispatch(
              openSnackbar({
                type: "success",
                message: res.data.clientMessage,
              })
            );
            handleClose();
            getAllTransportersData();
          } else {
            dispatch(
              openSnackbar({
                type: "error",
                message: res.data.clientMessage,
              })
            );
          }
        });
      }
    } else {
      dispatch(
        openSnackbar({
          type: "error",
          message: "All the fields are mandatory",
        })
      );
    }

    setIsLoading(false);
  };

  const handleBlockClose = () => {
    setSelectedTransporter(null);
    setBlock(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <Container sx={{ mt: 4, mb: 2 }} maxWidth={false}>
        <Card style={{ padding: "10px" }}>
          <div className="customCardheader">
            <Typography variant="h4"> Block</Typography>
          </div>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <TextField
                sx={{ mb: 2 }}
                select
                label="Select Block Type"
                size="small"
                value={selectedType}
                fullWidth
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedShipperType([]);
                }}
                variant="outlined"
                // error={!selectedType}
                // helperText={!selectedType ? "This field is required" : ""}
              >
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12}>
              {selectedType === "Partial" && (
                <Autocomplete
                  options={shipper}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedShipper}
                  onChange={(event, newValue) => {
                    setSelectedShipper(newValue);
                    // setSelectedShipperError(false)
                  }}
                  popupIcon={<KeyboardArrowDown />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Shipper Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Reason for Blocking*"
                fullWidth
                size="small"
                value={cancellationReason}
                sx={{ mb: 2 }}
                onChange={(e) => setCancellationReason(e.target.value)}
                // error={!cancellationReason}
                // helperText={!cancellationReason ? "This field is required" : ""}
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ display: "flex", justifyContent: "right" }}>
            <Button onClick={handleBlockClick} variant="contained">
              {" "}
              Submit
            </Button>
            <Button onClick={handleClose} variant="contained" color="error">
              {" "}
              Cancel
            </Button>
          </DialogActions>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              components={{
                Pagination: CustomPagination,
              }}
              rows={blockList}
              columns={column}
              pageSize={5}
            />
          </div>

          {/* block confirm modal */}
          <Dialog open={blockDialogOpen} onClose={handleBlockCancel}>
            <div className="customCardheader">
              <Typography variant="h4"> Block </Typography>
            </div>
            <DialogContent>
              <Typography>
                Are you sure you want to block the transporter?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleBlockSubmit}
                variant="contained"
                color="primary"
              >
                Yes
              </Button>
              <Button
                onClick={handleBlockCancel}
                variant="contained"
                color="error"
              >
                No
              </Button>
            </DialogActions>
          </Dialog>

          {/* //unblock confirm modal */}
          <Dialog open={unblockDialogOpen} onClose={handleUnblockCancel}>
            <div className="customCardheader">
              <Typography variant="h4"> Unblock </Typography>
            </div>
            <DialogContent>
              <Typography>
                Are you sure you want to unblock the transporter?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleUnblock}
                variant="contained"
                color="primary"
              >
                Yes
              </Button>
              <Button
                onClick={handleUnblockCancel}
                variant="contained"
                color="error"
              >
                No
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Container>

      {/* <BlockedTransporter /> */}
    </Dialog>
  );
};
export default BlockedTransporter;
