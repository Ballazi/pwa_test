import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogActions,
  Tooltip,
  IconButton,
  DialogContent,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridPagination } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  createLicense,
  deleteLicense,
  updateLicense,
  viewLicense,
} from "../../../api/master-data/license";
import AlertPage from "../../../components/masterData/alert-component/AlertPage";
import { pricingValidator, requiredValidator } from "../../../validation/common-validator";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';

const schema = yup.object().shape({
  name: requiredValidator("License Name"),
  type: requiredValidator("License Type"),
  price: pricingValidator("License price"),
  details: requiredValidator("License Details"),
});
// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarExport />
//     </GridToolbarContainer>
//   );
// }

function CustomPagination(props) {
  return (
    <>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',

        // padding: '8px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: '25px',
          padding: '8px'
        }}>
          <GridToolbarExport />

        </div>
        <div>
          <GridPagination{...props} />
        </div>
      </div>

    </>
  );
}
const License = () => {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const columns = [
    // { field: 'id', headerName: 'ID', width: 50 },
    { field: "name", headerName: "License Name", width: 150 },
    { field: "type", headerName: "License Type ", width: 150 },
    { field: "price", headerName: "Price", width: 110 },
    { field: "details", headerName: "Details", width: 210 },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEditClick(params.row)}>
              <BorderColorIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];
  const [License, setLicense] = useState([
    // { id: 1, name: 'ABC', type: 'Bidding' },
  ]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch()
  const closePopup = () => {
    setAlertType("");
    setMessage("");
  };

  const fetchData = () => {
    return viewLicense()
      .then((data) => {
        if (data.success === true) {
          const updatedLicense = data.data.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            price: item.price,
            details: item.details,
          }));
          setLicense(updatedLicense);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          )
          setLicense([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAddLicense = (form_data) => {
    const data = {
      name: form_data.name,
      type: form_data.type,
      details: form_data.details,
      price: form_data.price,
    };
    createLicense(data)
      .then((data) => {
        if (data.success === true) {

          fetchData();
          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          )
          setValue('name', '')
          setValue('type', '')
          setValue('price', '')
          setValue('details', '')
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          )
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
    setNewLicense({
      name: "",
      type: "",
      price: "",
      details: "",
    });
  };
  const handleEditClick = (licenses) => {
    setSelectedLicense(licenses);
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setSelectedLicense(null);
    setEditDialogOpen(false);
  };
  const handleEditSave = () => {
    if (
      !selectedLicense.name ||
      !selectedLicense.type ||
      !selectedLicense.price ||
      !selectedLicense.details ||
      selectedLicense.name.trim() === "" ||
      selectedLicense.type.trim() === "" ||

      selectedLicense.details.trim() === ""

    ) {
      dispatch(
        openSnackbar({ type: 'error', message: data.clientMessage })
      )
    }
    else if (isNaN(selectedLicense.price) ||
      parseFloat(selectedLicense.price) <= 0) {
      dispatch(
        openSnackbar({ type: 'error', message: data.clientMessage })
      )
    }
    else {
      const data = {
        name: selectedLicense.name,
        type: selectedLicense.type,
        price: selectedLicense.price,
        details: selectedLicense.details,
      };
      updateLicense(selectedLicense.id, data)
        .then((data) => {
          if (data.success === true) {
            fetchData();
            dispatch(
              openSnackbar({ type: 'success', message: data.clientMessage })
            )
            // setNewLicense({
            //   name: "",
            //   type: "",
            //   price: "",
            //   details: "",
            // });
            setSelectedLicense(null)
            setEditDialogOpen(false);
          } else {
            dispatch(
              openSnackbar({ type: 'error', message: data.clientMessage })
            )
          }
        })
        .catch((error) => {
          console.error("error", error);
        });
    }
  };
  const handleDeleteClick = (licensesId) => {
    setSelectedLicense(License.find((licenses) => licenses.id === licensesId));
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = () => {

    deleteLicense(selectedLicense.id)
      .then((data) => {
        console.log(data)
        if (data.success === true) {

          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          )
          setDeleteDialogOpen(false);
          fetchData();

          setMessage(data.clientMessage);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          )
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
    setSelectedLicense(null);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedLicense(null);
  };

  //edit dialog box
  const editDialogContent = (
    <div>
      <TextField
        label="Edit License Name *"
        size="small"
        fullWidth
        value={selectedLicense ? selectedLicense.name : ""}
        onChange={(e) =>
          setSelectedLicense((prevState) => ({
            ...prevState,
            name: e.target.value,
          }))
        }
        style={{ marginBottom: "20px" }}
      />
      {/* <FormControl fullWidth variant="outlined" >
        <InputLabel id="edit-license-type-label">Edit License Type*</InputLabel>
        <Select
          labelId="edit-license-type-label"
          style={{ marginBottom: "20px" }}
          fullWidth
          size="small"
          id="edit-license-type"
          value={selectedLicense ? selectedLicense.type : ""} // Set the value here
          onChange={(e) =>
            setSelectedLicense((prevState) => ({
              ...prevState,
              type: e.target.value,
            }))
          }
        >
          <MenuItem value="user_basis">User Basis</MenuItem>
          <MenuItem value="usage_basis">Usage Basis</MenuItem>
        </Select>
      </FormControl> */}

      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="license-type-label">
          Edit License Type
        </InputLabel>
        <Select
          labelId="license-type-label"
          id="license-type"
          label="Edit License Type"
          fullWidth
          size="small"
          style={{ marginBottom: "20px" }}
          value={selectedLicense ? selectedLicense.type : ""} // Set the value here
          onChange={(e) =>
            setSelectedLicense((prevState) => ({
              ...prevState,
              type: e.target.value,
            }))
          }
        >
          <MenuItem value="user_basis">User Basis</MenuItem>
          <MenuItem value="usage_basis">Usage Basis</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Edit License Price *"
        size="small"
        fullWidth
        type="number"
        value={selectedLicense ? selectedLicense.price : ""}
        onChange={(e) => {
          const inputValue = e.target.value;
          const floatValue = parseFloat(inputValue);

          if (!isNaN(floatValue) && floatValue > 0) {
            setSelectedLicense((prevState) => ({
              ...prevState,
              price: floatValue,
            }));
          }
        }}
        style={{ marginBottom: "20px" }}
      />
      <TextField
        label="Edit License Details *"
        size="small"
        fullWidth
        multiline
        rows={4}
        value={selectedLicense ? selectedLicense.details : ""}
        onChange={(e) =>
          setSelectedLicense((prevState) => ({
            ...prevState,
            details: e.target.value,
          }))
        }
        style={{ marginBottom: "20px" }}
      />

      <DialogActions>
        <Button onClick={handleEditSave} variant="contained">
          Save
        </Button>
        <Button
          onClick={handleEditDialogClose}
          variant="contained"
          color="error"
        >
          Cancel
        </Button>
      </DialogActions>
    </div>
  );

  return (
    <Container>
      {alertType !== "" ? (
        <AlertPage
          alertType={alertType}
          message={message}
          closePopup={closePopup}
        />
      ) : (
        ""
      )}
      <Grid container>
        <Grid item sm={12}>
          <Card style={{ padding: "10px" }}>
            <CardContent>
              <div className="customCardheader">
                <Typography variant="h4"> License Information</Typography>
              </div>
              <form onSubmit={handleSubmit(handleAddLicense)}>
                <Card style={{ marginTop: "20px", padding: "10px" }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item sm={4}>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label=" License Name *"
                              size="small"
                              fullWidth
                              error={Boolean(errors.name)}
                              helperText={errors.name?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item sm={4}>
                        <Controller
                          name="type"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              error={Boolean(errors.type)}
                            >
                              <InputLabel id="type-label">
                                License Type
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="type-label"
                                id="type"
                                label="License Type *"
                                fullWidth
                                size="small"
                              >
                                <MenuItem value="user_basis">
                                  User Basis
                                </MenuItem>
                                <MenuItem value="usage_basis">
                                  Usage Basis
                                </MenuItem>
                              </Select>

                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item sm={4}>
                        <Controller
                          name="price"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label=" License Price *"
                              size="small"
                              fullWidth
                              type="number"
                              error={Boolean(errors.price)}
                              helperText={errors.price?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item sm={12}>
                        <Controller
                          name="details"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label=" License Details *"
                              size="small"
                              fullWidth
                              multiline
                              rows={4}
                              error={Boolean(errors.details)}
                              helperText={errors.details?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justifyContent="flex-end"
                      alignItems="center"
                      sx={{ mt: 2 }}
                    >
                      <Button variant="contained" type="submit">
                        Add License
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>
              </form>
              <div style={{ width: "100%", marginTop: "20px" }}>
                <div className="customCardheader">
                  <Typography variant="h4">License Table</Typography>
                </div>
                <div className='customDataGridTable'>
                  {License.length !== 0 ? (
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid rows={License} columns={columns} pageSize={5}
                        components={{
                          pagination: CustomPagination,
                          // toolbar: CustomToolbar,

                        }}
                      />
                    </div>

                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <Typography variant="h6">No Data to Display</Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* // edit dialog */}
              <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <div className="customCardheader">
                  <Typography variant="h4"> Edit License</Typography>
                </div>

                <DialogContent>{editDialogContent}</DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <div className="customCardheader">
                  <Typography variant="h4"> Delete License</Typography>
                </div>
                <DialogContent>
                  {selectedLicense && (
                    <Typography>
                      Are you sure you want to delete the License :{" "}
                      <strong>{selectedLicense.name}</strong>?
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>

                  <Button
                    onClick={handleDeleteConfirm}
                    variant="contained"
                    color="error"
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={handleDeleteCancel}
                    variant="contained"
                    color="primary"
                  >
                    No
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default License;
