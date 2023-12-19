import { useState, useEffect, useRef } from "react";
import {
  Grid,
  Dialog,
  DialogContent,
  Checkbox,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  FormControlLabel,
  DialogActions,
  Container,
  Card,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  requiredValidator,
  contactNumberValidator,
  vehicleNumberValid,
} from "../../../validation/common-validator";
import ErrorTypography from "../../../components/typography/ErrorTypography";
import {
  getPendingBidDetails,
  viewNetworkProvider,
  getFleet,
  createFleet,
  updateFleet,
  deleteFleet,
  fetchSimNetworkPro,
} from "../../../api/trip-management/manage-trip";
import BackdropComponent from "../../../components/backdrop/Backdrop";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const VehicleInformation = ({
  id,
  handleCloseModal,
  asighnedVehicle,
  assignedTransporterDetails,
}) => {
  const [transporterOption, setTransporterOption] = useState([]);
  const [transporterDetails, setTransporterDetails] = useState(
    typeof assignedTransporterDetails !== "undefined"
      ? assignedTransporterDetails
      : []
  );
  const [isAlternateContactSelected, setIsAlternateContactSelected] =
    useState(false);
  const [networkOption, setNetworkOption] = useState([]);
  const [dummyData, setDummyData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [savedTransporterObj, setSavedTransporterObj] = useState(null);
  const dispatch = useDispatch();
  const [editFlag, setEditFlag] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const myDivRef = useRef(null);
  const schemaBuilder = (isAlternateContactSelected) => {
    const baseSchema = yup.object().shape({
      tf_transporter_id: requiredValidator("Transporter"),
      // fleet_no: requiredValidator("Vehicle number"),
      fleet_no: vehicleNumberValid,
      
      driver_number: contactNumberValidator,
      tf_netw_srvc_prvd_id: requiredValidator("Network service provider"),
    });

    if (isAlternateContactSelected) {
      return baseSchema.shape({
        alternate_driver_number: contactNumberValidator,
        tf_altr_netw_srvc_prvd_id: requiredValidator(
          "Alternate network service provider"
        ),
      });
    }

    return baseSchema;
  };
  const schema = schemaBuilder(isAlternateContactSelected);
  // console.log('=============>>>>', assignedTransporterDetails);
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchFleetData = () => {
    setIsLoading(true);
    getFleet(id)
      .then((res) => {
        if (res.data.success === true) {
          const rows = res.data.data.map((ele) => {
            return {
              id: ele.tf_id,
              transporterName: ele.tf_transporter_id,
              vehicleNumber: ele.fleet_no,
              contactNumber: ele.driver_number,
              networkProvider: ele.tf_netw_srvc_prvd_id,
              alternateNumber:
                ele.alternate_driver_number !== null
                  ? ele.alternate_driver_number
                  : "N/A",
              alternateNetworkProvider: ele.tf_altr_netw_srvc_prvd_id,
            };
          });
          setDummyData(rows);
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

  const fetchNetworkProviderData = (data, flag) => {
    setIsLoading(true);
    if (data.length === 10) {
      fetchSimNetworkPro(data)
        .then((res) => {
          if (res.data.success === true) {
            if (flag === "main") {
              setValue(
                "tf_netw_srvc_prvd_id",
                networkOption.find((x) =>
                  res.data.data[`prefix-network`]
                    .toUpperCase()
                    .includes(x.label)
                )?.value
              );
            } else {
              setValue(
                "tf_altr_netw_srvc_prvd_id",
                networkOption.find((x) =>
                  res.data.data[`prefix-network`]
                    .toUpperCase()
                    .includes(x.label)
                )?.value
              );
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

  const fetchPendingBidData = () => {
    setIsLoading(true);
    getPendingBidDetails(id)
      .then((res) => {
        if (res.data.success === true) {
          const options = res.data.data
            .filter((ele) => ele.assigned === true) // Filter items where assigned is true
            .map((ele) => ({
              label: ele.name,
              value: ele.id,
            }));

          setTransporterOption(options);
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

  const fetchNetworkProvider = () => {
    setIsLoading(true);
    viewNetworkProvider()
      .then((res) => {
        if (res.data.success === true) {
          const options = res.data.data.map((ele) => {
            return {
              label: ele.name,
              value: ele.id,
            };
          });
          setNetworkOption(options);
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
    if (transporterDetails && transporterDetails.length > 0) {
      const data = transporterDetails
        .filter((ele) => ele.assignment_status === true)
        .map((item) => {
          return {
            ...item,
            isAllVehicleAdded:
              item.fleets?.length >= item.no_of_fleets_assigned,
          };
        });

      console.log("data", data);

      const options = data
        .filter((item) => item.isAllVehicleAdded === false)
        .map((ele) => ({
          label: ele.contact_name,
          value: ele.la_transporter_id,
        }));
      console.log("options", options);
      setTransporterOption(options);
    }
  }, [transporterDetails]);

  useEffect(() => {
    // fetchPendingBidData();
    fetchNetworkProvider();
    fetchFleetData();
  }, []);

  const handelChackBox = (checkedStatus) => {
    setIsAlternateContactSelected(checkedStatus);
    setValue("alternate_driver_number", "");
    setValue("tf_altr_netw_srvc_prvd_id", "");
  };

  const onSubmitHandler = (data) => {
    setIsLoading(true);
    const payload = {
      tf_bidding_load_id: id,
      tf_transporter_id: data.tf_transporter_id,
      fleet_no: data.fleet_no,
      driver_number: data.driver_number,
      tf_netw_srvc_prvd_id: data.tf_netw_srvc_prvd_id,
      alternate_driver_number:
        data.alternate_driver_number === ""
          ? null
          : data.alternate_driver_number,
      tf_altr_netw_srvc_prvd_id:
        data.tf_altr_netw_srvc_prvd_id === ""
          ? null
          : data.tf_altr_netw_srvc_prvd_id,
      materials: [],
      src_dest: [],
    };
    if (editFlag) {
      updateFleet(payload, selectedId)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: "success", message: res.data.clientMessage })
            );

            handelChackBox(false);
            reset();
            fetchFleetData();
            setEditFlag(false);
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
      createFleet(payload)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: "success", message: res.data.clientMessage })
            );
            handelChackBox(false);

            setTransporterDetails((prevState) => {
              const newData = prevState.map((item) => {
                console.log("res", res.data.data);
                if (item.la_transporter_id === data.tf_transporter_id) {
                  item.fleets = [...item.fleets, res.data.data];
                  console.log("append", item.fleets);
                }
                return item;
              });
              console.log("prev", newData);

              return newData;
            });

            reset();
            fetchFleetData();
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

  const returnTransporterName = (trans_id) => {
    if (trans_id !== null && transporterDetails.length !== 0) {
      const rowObj = transporterDetails.find(
        (ele) => ele.la_transporter_id === trans_id
      );
      if (rowObj === undefined) {
        return "N/A";
      } else {
        return rowObj.contact_name;
      }
    } else return "N/A";
  };

  const returnNetworkProviderName = (netw_id) => {
    if (netw_id !== null && networkOption.length !== 0) {
      const rowObj = networkOption.find((ele) => ele.value === netw_id);
      if (rowObj === undefined) {
        return "N/A";
      } else {
        return rowObj.label;
      }
    } else return "N/A";
  };
  const [edittransporter, setEditTransporter] = useState();
  const editHandler = (obj) => {
    console.log(">>>>", obj);
    console.log(returnTransporterName(obj.transporterName));
    setEditTransporter(returnTransporterName(obj.transporterName));
    reset();
    setEditFlag(true);
    setSelectedId(obj.id);
    setValue("tf_transporter_id", obj.transporterName);
    setValue("fleet_no", obj.vehicleNumber);
    setValue("driver_number", obj.contactNumber);
    setValue("tf_netw_srvc_prvd_id", obj.networkProvider);
    if (
      obj.alternateNumber !== null &&
      obj.alternateNumber !== "N/A" &&
      obj.alternateNetworkProvider !== null &&
      obj.alternateNetworkProvider !== "N/A"
    ) {
      setIsAlternateContactSelected(true);
      setValue("alternate_driver_number", obj.alternateNumber);
      setValue("tf_altr_netw_srvc_prvd_id", obj.alternateNetworkProvider);
    }
    myDivRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeEdit = () => {
    setEditFlag(false);
    setSelectedId("");
    setIsAlternateContactSelected(false);
    reset();
  };

  const openDeleteModal = (id, data) => {
    console.log("data", data);
    setDeleteConfirm(true);
    setSelectedId(id);
    setSavedTransporterObj(data);
  };

  const closeDelete = () => {
    setDeleteConfirm(false);
    setSelectedId("");
  };

  const handleDelete = () => {
    deleteFleet(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: "success", message: res.data.clientMessage })
          );
          handelChackBox(false);
          reset();

          setTransporterDetails((prevState) => {
            console.log("hello", prevState, savedTransporterObj);
            const newData = prevState.map((item) => {
              if (
                savedTransporterObj.transporterName === item.la_transporter_id
              ) {
                const newArr = JSON.parse(JSON.stringify(item.fleets));
                newArr.pop();
                // const copy = item.fleet.splice(-1)
                item.fleets = newArr;
              }
              return item;
            });
            return newData;
          });

          fetchFleetData();
          closeDelete();
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
      <Dialog open={deleteConfirm} onClose={closeDelete}>
        <div className="customCardheader">
          <Typography variant="h4">Delete Fleet</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to Delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete} variant="contained" color="error">
            No
          </Button>
          <Button onClick={handleDelete} variant="contained" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={true} onClose={handleCloseModal} fullWidth maxWidth="lg">
        <div style={{ marginBottom: "0px" }} className="customCardheader">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Enter Vehicle Details: ({asighnedVehicle} vehicle assigned)
          </Typography>
        </div>
        <DialogContent>
          <Container>
            {dummyData.length >= parseInt(asighnedVehicle) && !editFlag ? (
              ""
            ) : (
              <Card ref={myDivRef} style={{ padding: "10px" }}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className="customCardheader">
                    <Typography variant="h4"> Vehicle Information</Typography>
                  </div>
                  <Grid container spacing={1.5}>
                    <Grid item md={3} sm={6} xs={12}>
                      {editFlag ? (
                        // <p> : {edittransporter}</p>
                        <>
                          <InputLabel>
                            Transporter Name*
                            {/* <span className="mandatory-star">*</span> */}
                          </InputLabel>
                          <TextField
                            size="small"
                            fullWidth
                            variant="outlined"
                            value={edittransporter}
                            disabled
                          />
                        </>
                      ) : (
                        <Controller
                          name="tf_transporter_id"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <>
                              <InputLabel id="demo-simple-select-disabled-label">
                                Transporter*
                                {/* <span style={{ color: 'red' }}>*</span> */}
                              </InputLabel>
                              <Select
                                fullWidth
                                size="small"
                                value={field.value}
                                onChange={(e) => field.onChange(e)}
                              >
                                {transporterOption.map((ele) => (
                                  <MenuItem key={ele.value} value={ele.value}>
                                    {ele.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.tf_transporter_id && (
                                <ErrorTypography>
                                  {errors.tf_transporter_id.message}
                                </ErrorTypography>
                              )}
                            </>
                          )}
                        />
                      )}
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                      <Controller
                        name="fleet_no"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel>
                              Vehicle Number*
                              {/* <span className="mandatory-star">*</span> */}
                            </InputLabel>
                            <TextField
                              size="small"
                              {...field}
                              variant="outlined"
                              onChange={(e) => {
                                field.onChange((e.target.value).toUpperCase());
                              }}
                              fullWidth
                              error={Boolean(errors.fleet_no)}
                              helperText={errors.fleet_no?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                      <Controller
                        name="driver_number"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel>
                              {"Driver's Contact Number*"}
                              {/* <span className="mandatory-star">*</span> */}
                            </InputLabel>
                            <TextField
                              size="small"
                              {...field}
                              type="text"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                fetchNetworkProviderData(
                                  e.target.value,
                                  "main"
                                );
                              }}
                              variant="outlined"
                              fullWidth
                              error={Boolean(errors.driver_number)}
                              helperText={errors.driver_number?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                      <Controller
                        name="tf_netw_srvc_prvd_id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select-disabled-label">
                              Network Service Provider*
                              {/* <span style={{ color: 'red' }}>*</span> */}
                            </InputLabel>
                            <Select
                              fullWidth
                              size="small"
                              value={field.value}
                              onChange={(e) => field.onChange(e)}
                            >
                              {networkOption.map((ele) => (
                                <MenuItem key={ele.value} value={ele.value}>
                                  {ele.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.tf_netw_srvc_prvd_id && (
                              <ErrorTypography>
                                {errors.tf_netw_srvc_prvd_id.message}
                              </ErrorTypography>
                            )}
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <FormControlLabel
                        sx={{ mt: 2 }}
                        control={
                          <Checkbox
                            color="primary"
                            checked={isAlternateContactSelected}
                            onChange={(e) => handelChackBox(e.target.checked)}
                          />
                        }
                        label="Alternate Contact Number"
                      />
                    </Grid>
                    {isAlternateContactSelected && (
                      <>
                        <Grid item md={3} sm={6} xs={12}>
                          <Controller
                            name="alternate_driver_number"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <>
                                <InputLabel>
                                  Alternative Contact Number:
                                  <span style={{ color: "red" }}>*</span>
                                </InputLabel>
                                <TextField
                                  size="small"
                                  {...field}
                                  type="text"
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    fetchNetworkProviderData(
                                      e.target.value,
                                      "alt"
                                    );
                                  }}
                                  variant="outlined"
                                  fullWidth
                                  error={Boolean(
                                    errors.alternate_driver_number
                                  )}
                                  helperText={
                                    errors.alternate_driver_number?.message
                                  }
                                />
                              </>
                            )}
                          />
                        </Grid>
                        <Grid item md={3} sm={6} xs={12}>
                          <Controller
                            name="tf_altr_netw_srvc_prvd_id"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <>
                                <InputLabel id="demo-simple-select-disabled-label">
                                  Network Service Provider:
                                  <span style={{ color: "red" }}>*</span>
                                </InputLabel>
                                <Select
                                  fullWidth
                                  size="small"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e)}
                                >
                                  {networkOption.map((ele) => (
                                    <MenuItem key={ele.label} value={ele.value}>
                                      {ele.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors.tf_altr_netw_srvc_prvd_id && (
                                  <ErrorTypography>
                                    {errors.tf_altr_netw_srvc_prvd_id.message}
                                  </ErrorTypography>
                                )}
                              </>
                            )}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Grid>
                    <div style={{ textAlign: "end" }}>
                      {editFlag && (
                        <Button
                          style={{ marginTop: "10px", marginRight: "20px" }}
                          variant="contained"
                          color="error"
                          onClick={closeEdit}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        style={{ marginTop: "10px" }}
                        variant="contained"
                        type="submit"
                      >
                        {editFlag ? "Save" : "Submit"}
                      </Button>
                    </div>
                  </Grid>
                </form>
              </Card>
            )}

            <Grid item md={12}>
              <Card style={{ marginTop: "10px", padding: "10px" }}>
                <div className="customCardheader">
                  <Typography variant="h4">Vehicle Table</Typography>
                </div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transporter Name</TableCell>
                      <TableCell>Vehicle Number</TableCell>
                      <TableCell>Contact number</TableCell>
                      <TableCell>Network provider</TableCell>
                      <TableCell>Alternate number</TableCell>
                      <TableCell>Alternate network provider</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dummyData.map((data) => (
                      <TableRow key={data}>
                        <TableCell>
                          {returnTransporterName(data.transporterName)}
                        </TableCell>
                        <TableCell>{data.vehicleNumber}</TableCell>
                        <TableCell>{data.contactNumber}</TableCell>
                        <TableCell>
                          {returnNetworkProviderName(data.networkProvider)}
                        </TableCell>
                        <TableCell>{data.alternateNumber}</TableCell>
                        <TableCell>
                          {returnNetworkProviderName(
                            data.alternateNetworkProvider
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => editHandler(data)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => openDeleteModal(data.id, data)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCloseModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VehicleInformation;
