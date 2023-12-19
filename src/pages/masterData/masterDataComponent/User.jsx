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
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridPagination } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  viewUser,
  viewShiper,
  createUser,
  updateUser,
  deleteUser,
  viewShipperRoles,
} from "../../../api/master-data/user";
import {

  getRegion,
  viewBranch,
} from '../../../api/register/branch-details';
import { requiredValidator } from "../../../validation/common-validator";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { viewRoles } from "../../../api/register/user-details";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


const schema = yup.object().shape({
  name: requiredValidator("User Name"),
  email: requiredValidator("Email"),
  phone: requiredValidator("Phone Number"),
  shipper: requiredValidator("Shipper"),
  region: requiredValidator("Region"),
  branch: requiredValidator("Branch"),
  role_id: requiredValidator("Role Name"),
  contact: requiredValidator("Contact "),
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

const User = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
  });
  const columns = [
    // { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "User Name", width: 90 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone No.", width: 110 },
    { field: "shipper", headerName: "Shipper Name", width: 80 },
    { field: "branch", headerName: "Branch Name", width: 80 },
    { field: "region", headerName: "Region Name", width: 80 },
    // { field: "transporter", headerName: "Transporter Name", width: 80 },
    { field: "role_id", headerName: "Role Name", width: 80 },
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
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    shipper: "",
    branch: "",
    region: "",
    transporter: "",
    isShipper: false,
    isTransporter: false,
    isSosUser: false,
  });
  const [User, setUser] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shipperList, setShipperList] = useState([]);
  const [regionOptions, setRegionOptions] = useState([])
  const [branchOptions, setBranchOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([])
  console.log("lala", roleOptions)
  const [isLoading, setIsLoading] = useState([])
  const dispatch = useDispatch()



  const fetchData = () => {
    return viewUser()
      .then((data) => {
        if (data.success === true) {
          const updatedMaterials = data.data.map((item) => ({
            id: item.user_id,
            type: item.user_type,
            name: item.name,
            email: item.email,
            phone: item.contact_no,
            shipper: item.user_shipper_id,
            // region: item. 
            // region: item.role_list.region_name,
            // branch: item.msrc_region_cluster_id.name,
            // role_id: item.user_shipper_id.role_name
          }));
          setUser(updatedMaterials);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          )
          setUser([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  const fetchShipper = () => {
    setIsLoading(true)
    return viewShiper()
      .then((data) => {
        if (data.success === true) {
          console.log("lalalala", data.data)
          const updatedShipper = data.data.map((item) => {
            return {
              label: item.name,
              value: item.shpr_id
            }
          })
          setShipperList(updatedShipper)
          console.log("updated shipperrrrr", updatedShipper)
        }
      })
      .catch((error) => {
        console.error("error", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchRegionData = (id) => {
    console.log("shipper id", id);
    setIsLoading(true);
    const payload = {
      shipper_id: id,
      // isRegion: true,
    };
    return getRegion(payload)
      .then((res) => {
        if (res.data.success === true) {
          const updatedRegion = res.data.data
            .filter((item) => item.is_region === true)
            .map((item) => {
              return {
                label: item.region_name,
                value: item.msrc_region_cluster_id,
                // is_region: item.is_region,
              };
            });
          setRegionOptions(updatedRegion);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
          setRegionOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchBranchData = (id) => {
    const shipperId = getValues("shipper");
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
      msrc_region_cluster_id: id,
    };
    return viewBranch(payload)
      .then((res) => {
        if (res.data.success === true) {
          const payload = res.data.data.map((ele) => ({
            value: ele.branch_id,
            label: ele.name,
          }));
          setBranchOptions(payload);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
          setBranchOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchRoleData = (id) => {
    console.log("shipper Id::::", id)
    setIsLoading(true)
    const payload = {
      shipper_id: id,
    }
    return viewShipperRoles(payload)
      .then((res) => {

        if (res.success === true) {
          console.log("object", res.data)
          const updatedRoles = res.data.data
            .filter((item) => item.is_active === true)
            .map((item) => {
              return {
                id: item.id,
                role_name: item.role_name
              }
            })
          setRoleOptions(updatedRoles)
        }
        else {
          dispatch(
            openSnackbar({
              type: 'error',
              message: res.data.clientMessage
            })
          )
          setRoleOptions([])
        }
      })
      .catch((error) => {
        console.error("error", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchData();
    fetchShipper();
    // fetchRegion(),
    //   fetchBranch();
    // fetchRoleData()
  }, []);

  const handleNewUserChange = (field, value) => {
    setNewUser((prevState) => ({ ...prevState, [field]: value }));
  };
  const handleAddUser = (form_data) => {
    console.log(form_data)
    const data = {
      name: form_data.name,
      email: form_data.email,
      contact_no: form_data.contact,
      user_shipper_id: form_data.shipper,
      is_sos_user: newUser.isSosUser,
      role_list: [
        {
          mpus_shipper_id: form_data.branch,
          mpus_region_cluster_id: form_data.region,
          mpus_branch_id: form_data.branch,
          mpus_role_id: form_data.role_id
        },
      ],
    }

    console.log(data);
    createUser(data)
      .then((data) => {
        if (data.success === true) {
          fetchData();

          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          )
          setValue('name', '')
          setValue('email', '')
          setValue('contact', '')
          setValue('shipper', '')
          setValue('branch', '')
          setValue('region', '')
          setValue('isSosUser', '')
          setValue('role_id', '')
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          )
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleEditClick = (users) => {
    setSelectedUser(users);
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setSelectedUser(null);
    setEditDialogOpen(false);
  };

  const handleEditSave = () => {
    if (!selectedUser.name || !selectedUser.email) {
      setAlertType("error");
      setMessage("Please fill in both the Name and shipper.");
    } else {
      const data = {
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        shipper_id: selectedUser.shipper,
        branch_id: selectedUser.branch,
        RegionCluster_id: selectedUser.region,
        transporter_id: selectedUser.transporter,
        is_shipper: selectedUser.isShipper,
        is_transporter: selectedUser.isTransporter,
        is_sos_user: selectedUser.isSosUser,
      };
      updateUser(selectedUser.id, data)
        .then((data) => {
          if (data.success === true) {
            fetchData();
            dispatch(
              openSnackbar({ type: 'success', message: data.clientMessage })
            )
            setSelectedUser(null);
            setEditDialogOpen(false);
          } else {
            dispatch(
              openSnackbar({ type: 'error', message: data.clientMessage })
            )
          }
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  };

  const handleDeleteClick = (usersId) => {
    setSelectedUser(User.find((users) => users.id === usersId));
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteUser(selectedUser.id)
      .then((data) => {
        if (data.success === true) {
          handleDeleteCancel();
          fetchData();
          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          )
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          )
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };
  const [branchList, setBranchList] = useState([])
  const getBranch = (id) => {
    const payload = { shipper_id: id };

    return viewBranch(payload)
      .then((res) => {
        console.log(res)
        if (res.data.success === true) {
          setBranchList(res.data.data)
          console.log(typeof (branchList))

        }
        else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          )
          setBranchList([])
        }
      })
      .catch((error) => {
        console.error("Error", error)
      })
  }

  //edit dialog box
  const editDialogContent = (
    <div>
      <TextField
        label="Edit User Name"
        size="small"
        fullWidth
        value={selectedUser ? selectedUser.name : ""}
        onChange={(e) =>
          setSelectedUser((prevState) => ({
            ...prevState,
            name: e.target.value,
          }))
        }
        style={{ marginBottom: "20px" }}
      />
      <TextField
        label="Edit User Email"
        size="small"
        fullWidth
        value={selectedUser ? selectedUser.email : ""}
        onChange={(e) =>
          setSelectedUser((prevState) => ({
            ...prevState,
            email: e.target.value,
          }))
        }
        style={{ marginBottom: "20px" }}
      />
      <TextField
        label="Edit Phone No."
        size="small"
        fullWidth
        value={selectedUser ? selectedUser.phone : ""}
        onChange={(e) =>
          setSelectedUser((prevState) => ({
            ...prevState,
            phone: e.target.value,
          }))
        }
        style={{ marginBottom: "20px" }}
      />

      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="demo-simple-select-label">Shipper Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Edit Shipper Name"
          fullWidth
          size="small"
          value={selectedUser ? selectedUser.shipper : ""}
          onChange={(e) =>
            setSelectedUser((prevState) => ({
              ...prevState,
              shipper: e.target.value,
            }))
          }
        >
          <MenuItem value={"1"}>Shipper 1</MenuItem>
          <MenuItem value={"2"}>Shipper 2</MenuItem>
          <MenuItem value={"3"}>Shipper 3</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="demo-simple-select-label">Branch Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Edit Branch Name"
          fullWidth
          size="small"
          value={selectedUser ? selectedUser.branch : ""}
          onChange={(e) =>
            setSelectedUser((prevState) => ({
              ...prevState,
              branch: e.target.value,
            }))
          }
        >
          <MenuItem value={"1"}>Sector V</MenuItem>
          <MenuItem value={"2"}>Park Street</MenuItem>
          <MenuItem value={"3"}>Howrah</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="demo-simple-select-label">Region Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Edit Region Name"
          fullWidth
          size="small"
          value={selectedUser ? selectedUser.region : ""}
          onChange={(e) =>
            setSelectedUser((prevState) => ({
              ...prevState,
              region: e.target.value,
            }))
          }
        >
          <MenuItem value={"1"}>Central Kolkata</MenuItem>
          <MenuItem value={"2"}>North Kolkata</MenuItem>
          <MenuItem value={"3"}>South Kolkata</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="demo-simple-select-label">Transporter Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Edit Transporter Name"
          fullWidth
          size="small"
          value={selectedUser ? selectedUser.transporter : ""}
          onChange={(e) =>
            setSelectedUser((prevState) => ({
              ...prevState,
              transporter: e.target.value,
            }))
          }
        >
          <MenuItem value={"1"}>Ekart</MenuItem>
          <MenuItem value={"2"}>Delhivery</MenuItem>
          <MenuItem value={"3"}>Blue Dart</MenuItem>
        </Select>
      </FormControl>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedUser ? selectedUser.isShipper : false}
              onChange={(e) =>
                setSelectedUser((prevState) => ({
                  ...prevState,
                  isShipper: e.target.checked,
                }))
              }
            />
          }
          label="Shipper"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedUser ? selectedUser.isTransporter : false}
              onChange={(e) =>
                setSelectedUser((prevState) => ({
                  ...prevState,
                  isTransporter: e.target.checked,
                }))
              }
            />
          }
          label="Transporter"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedUser ? selectedUser.isSosUser : false}
              onChange={(e) =>
                setSelectedUser((prevState) => ({
                  ...prevState,
                  isSosUser: e.target.checked,
                }))
              }
            />
          }
          label="SOS User"
        />
      </div>

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
    <Card style={{ padding: "10px" }}>
      <CardContent>
        <div className="customCardheader">
          <Typography variant="h4"> User Data</Typography>
        </div>
        <form onSubmit={(handleSubmit(handleAddUser))}>
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
                        label="User Name"
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
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        size="small"
                        fullWidth
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={4}>
                  <Controller
                    name="contact"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contact Number"
                        size="small"
                        fullWidth
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Controller
                    name="shipper"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        {/* <InputLabel
                          htmlFor="shipper"
                          shrink
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Select shipper
                        </InputLabel> */}
                        <Autocomplete
                          {...field}
                          options={shipperList}
                          getOptionLabel={(option) => option.label || ""}
                          value={
                            shipperList.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : "");
                            fetchRegionData(newValue.value);
                            field.onChange(newValue ? newValue.value : "")
                            fetchRoleData(newValue.value)
                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Shipper Name"
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={!!errors.shipper}
                              helperText={errors.shipper?.message}
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Controller
                    name="region"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        {/* <InputLabel
                          htmlFor="region"
                          shrink
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Select region
                        </InputLabel> */}
                        <Autocomplete
                          {...field}
                          options={regionOptions}
                          getOptionLabel={(option) => option.label || ""}
                          value={
                            regionOptions.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : "");

                            fetchBranchData(newValue.value);
                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Region Name"
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={!!errors.region}
                              helperText={errors.region?.message}
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Controller
                    name="branch"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={branchOptions}
                        getOptionLabel={(option) => option.label || ""}
                        value={
                          branchOptions.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.value : "");
                        }}
                        popupIcon={<KeyboardArrowDownIcon />}
                        renderInput={(params) => (
                          <>
                            <TextField
                              {...params}
                              label="Branch Name"
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={!!errors.branch}
                              helperText={errors.branch?.message}
                            />
                          </>
                        )}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Controller
                    name="role_id"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>

                        <Autocomplete
                          {...field}
                          options={roleOptions}
                          getOptionLabel={(option) => option.label || ""}
                          value={
                            roleOptions.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : "");

                            fetchBranchData(newValue.value);
                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Role Nameee"
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={!!errors.role_id}
                              helperText={errors.role_id?.message}
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid> */}
                <Grid item sm={4}>
                  <Controller
                    name="role_id"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={roleOptions}
                          getOptionLabel={(option) => option.role_name || ''}
                          value={
                            roleOptions.find(
                              (option) => option.id === field.id) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.id : '')

                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Role Name"
                              fullWidth
                              size="small"
                              error={!!errors.role_id}
                              helperText={errors.role_id?.message}
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>


                <Grid item sm={12}>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newUser.isSosUser}
                        onChange={(e) =>
                          handleNewUserChange("isSosUser", e.target.checked)
                        }
                      />
                    }
                    label="SOS User"
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
                  Add User
                </Button>
              </Grid>
            </CardContent>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <div className="customCardheader">
                <Typography variant="h4">User Table</Typography>
              </div>
              <div className='customDataGridTable'>

                {User.length != 0 ? (
                  <DataGrid
                    rows={User}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    components={{
                      pagination: CustomPagination,
                      // toolbar: CustomToolbar,

                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    {" "}
                    <Typography variant="h6">No data to display</Typography>{" "}
                  </div>
                )}
              </div>
            </div>

            {/* // edit dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
              <div className="customCardheader">
                <Typography variant="h4"> Edit User</Typography>
              </div>

              <DialogContent>{editDialogContent}</DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
              <div className="customCardheader">
                <Typography variant="h4"> Delete User</Typography>
              </div>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete the User
                  {selectedUser && <strong>: {selectedUser.name}</strong>}?
                </Typography>
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
          </Card>
        </form >
      </CardContent >
    </Card >
  );
};

export default User;
