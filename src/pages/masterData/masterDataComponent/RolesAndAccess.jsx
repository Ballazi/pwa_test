import React, { useState, useEffect } from 'react';
import {
  Card,
  styled,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Modal,
  Box,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import * as yup from 'yup';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { viewShiper } from '../../../api/master-data/user';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { requiredValidator } from '../../../validation/common-validator';
import {
  viewRoleAccess,
  fetchSubmodule,
  assignRole,
} from '../../../api/master-data/role-access';
import { viewRoles } from '../../../api/register/user-details';
import { viewRoleMaster } from '../../../api/master-data/roleMaster';
import ErrorTypography from '../../../components/typography/ErrorTypography';

const schema = yup.object().shape({
  role_id: requiredValidator('Role Name'),
})
const PermisonBOx = styled(Box)(({ theme }) => ({
  paddingBottom: "10px",
  paddingTop: "15px",
  borderBottom: "#d3c8c85c 2px solid"

}));

const RolesAndAccess = () => {
  const {
    handleSubmit,
    control,
    getValue,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({
    name: '',
    role: '',
    permissions: {
      registerTransporter: false,
      createLoad: false,
      manageLoad: false,
      reports: false,
      manageBid: false,
      showTransporterName: false,
      showTransporterRate: false,
      showLeastPrice: false,
      preTracking: false,
      manageTracking: false,
      alerts: false,
      epod: false,
      epodPdf: false,
    },
  });

  const [editRole, setEditRole] = useState(null);
  const [generatedRow, setGeneratedRow] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payload, setPayload] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [reloadApplication, setReloadApplication] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // Fetch roles from your API or data source here
  //   // Replace this with your actual data fetching logic
  //   const fetchedRoles = [
  //     { id: 1, name: 'Role 1', role: 'Role 1', permissions: { registerTransporter: true, createLoad: true } },
  //     { id: 2, name: 'Role 2', role: 'Role 2', permissions: { manageLoad: true, reports: true } },

  //   ];
  //   setRoles(fetchedRoles);
  // }, []);

  const fetchRole = async () => {
    return viewRoleMaster()
      .then((res) => {
        if (res.success === true) {
          // console.log('copy', res.data);
          const data = res.data.map((item) => {
            return {
              name: item.role_name,
              id: item.id,
            };
          });
          // console.log('hi cho', data);
          setRoleList(data);
        } else {
          dispatch(
            openSnackbar({
              type: 'error',
              message: res.data.clientMessage,
            })
          );
          setRoleList([]);
        }
      })
      .catch((error) => {
        console.error('error', error);
      });
  };

  const fetchAccess = (id) => {
    // console.log('id', id);
    viewRoleAccess(id)
      .then((res) => {
        // console.log('data', data);
        if (res.data.success === true) {
          // console.log("lalalala", data);
          // console.log('hi>>>>>>>', res.data.data);
          const accessList = res.data.data.submodules.map(
            (item) => item.submodule_id
          );
          setPayload(accessList);
          // setRoles(updatedRole);
        } else {
          dispatch(
            openSnackbar({
              type: 'error',
              message: res.data.clientMessage,
            })
          );
        }
      })
      .catch((error) => {
        console.error('error', error);
      });
  };

  const fetchAllSubmodules = () => {
    fetchSubmodule()
      .then((res) => {
        setGeneratedRow(res.data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setReloadApplication(false));
  };

  useEffect(() => {
    // fetchAccess();
    fetchRole();
    fetchAllSubmodules();
  }, [reloadApplication]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewRole({
      ...newRole,
      permissions: {
        ...newRole.permissions,
        [name]: checked,
      },
    });
  };

  const handleAddRole = (data) => {
    // console.log('data', data);
    assignRole({
      role_id: data.role_id,
      submodule_ids: payload.filter(x => x != null),
    })
      .then((res) => {
        if (res.data.success) {
          // console.log(res);
          setReloadApplication(true);
          setRoleList([]);
          dispatch(
            openSnackbar({
              type: 'success',
              message: 'Role added successfully!',
            })
          );
        }
      })
      .catch((err) => console.log(err));
    // Add validation logic here if needed
    // if (newRole.name.trim() === '' || newRole.role.trim() === '') {
    //   return;
    // }
    // Generate a new ID (replace with actual ID generation logic)
    // const newId = Math.max(...roles.map((role) => role.id), 0) + 1;
    // const newRoles = [...roles, { id: newId, ...newRole }];
    // setRoles(newRoles);
    // // Clear the input fields
    // setNewRole({
    //   name: '',
    //   role: '',
    //   permissions: {
    //     registerTransporter: false,
    //     createLoad: false,
    //     manageLoad: false,
    //     reports: false,
    //     manageBid: false,
    //     showTransporterName: false,
    //     showTransporterRate: false,
    //     showLeastPrice: false,
    //     preTracking: false,
    //     manageTracking: false,
    //     alerts: false,
    //     epod: false,
    //     epodPdf: false,
    //   },
    // });
  };

  const handleEditClick = (role) => {
    setEditRole(role);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleEditSave = () => {
    // Add validation logic here if needed
    if (editRole.name.trim() === '' || editRole.role.trim() === '') {
      return;
    }

    const updatedRoles = roles.map((role) =>
      role.id === editRole.id ? editRole : role
    );
    setRoles(updatedRoles);
    setEditRole(null);
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id) => {
    const updatedRoles = roles.filter((role) => role.id !== id);
    setRoles(updatedRoles);
  };

  // Define columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Role Name', width: 150 },
    { field: 'role', headerName: 'Role Name', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
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

  const handleChange = (subitem) => {
    // console.log(subitem);
    setPayload((prev) =>
      prev.includes(subitem.id)
        ? prev.filter((x) => x != subitem.id)
        : [...prev, subitem.id]
    );
  };
  const [roleID, setRoleID] = useState("")
  const handleChangeRole = (val) => {
    setRoleID(val)
    // console.log(val);
    fetchAccess(val);
    setValue('role_id', val);
  };

  // const handleRolePermission = () => {
  //   assignRole([
  //     {
  //       role_id: ,
  //       submodule_ids: payload,
  //     },
  //   ]);
  // };

  // console.log('payload', payload);

  return (
    <Card style={{ padding: '10px' }}>
      <CardContent>
        <div className="customCardheader">
          <Typography variant="h4">Role And Access Data</Typography>
        </div>
        <form onSubmit={handleSubmit(handleAddRole)}>
          <Grid container spacing={2}>
            {/* <Grid item sm={6}>
              <TextField
                label="Role Name"
                name="name"
                size='small'
                value={newRole.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid> */}
            <Grid item sm={12} xs={12}>
              <Controller
                name="role_id"
                control={control}
                // defaultValue=""
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={Boolean(errors.role_id)}
                  >
                    <InputLabel id="role-label">Role Name *</InputLabel>
                    <Select
                      {...field}
                      labelId="role-label"
                      id="role_id"
                      label="Role Name"
                      fullWidth
                      size="small"
                      onChange={(e) => handleChangeRole(e.target.value)}
                    >
                      {roleList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.role_id && (
                      <ErrorTypography>
                        {errors.role_id.message}
                      </ErrorTypography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Box mt={3}>
            <div className="customCardheader">
              <Typography variant="h5"> {roleID === "" ? "Select a role" : "Set Permissions"}</Typography>
            </div>
            {roleID === "" ? "" :
              <>
                {generatedRow.map((item, index) => {
                  // console.log(getValue, "role_id");
                  return (
                    <Grid key={index} container alignItems="center">
                      <Grid item xs={12} md={12} lg={12}>
                        <PermisonBOx>
                          <Typography variant='h5'>{Object.keys(item)} : </Typography>
                          {Object.values(item)[0].map((subitem) => (
                            <FormControlLabel
                              control={<Checkbox />}
                              label={subitem.name}
                              checked={payload.includes(subitem.id)}
                              // value={subitem.id}
                              key={subitem.id}
                              onChange={(e) => handleChange(subitem)}
                            />
                          ))}
                        </PermisonBOx>
                      </Grid>



                    </Grid>
                  );
                })}
              </>
            }

          </Box>
          {/* <div style={{ marginTop: '20px' }}>
            <Typography variant="h5">Permissions:</Typography>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="permissions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Registration</TableCell>
                    <TableCell>Load</TableCell>
                    <TableCell>Bidding</TableCell>
                    <TableCell>Bidding Configuration</TableCell>
                    <TableCell>Tracking</TableCell>
                    <TableCell>Delivery</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="registerTransporter"
                            checked={newRole.permissions.registerTransporter}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Register transporter"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        size="small"
                        control={
                          <Checkbox
                            name="createLoad"
                            checked={newRole.permissions.createLoad}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Create load"
                      />
                      <FormControlLabel
                        size="small"
                        control={
                          <Checkbox
                            name="manageLoad"
                            checked={newRole.permissions.manageLoad}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Manage Load"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="manageBid"
                            checked={newRole.permissions.manageBid}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Manage bid"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="showTransporterName"
                            checked={newRole.permissions.showTransporterName}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Show transporter name"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="showTransporterRate"
                            checked={newRole.permissions.showTransporterRate}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Show transporter rate during bidding"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="showLeastPrice"
                            checked={newRole.permissions.showLeastPrice}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Show least price during bidding"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="preTracking"
                            checked={newRole.permissions.preTracking}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Pre-tracking"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="manageTracking"
                            checked={newRole.permissions.manageTracking}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Manage tracking"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="alerts"
                            checked={newRole.permissions.alerts}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Alerts"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="epod"
                            checked={newRole.permissions.epod}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="EPod"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="epodPdf"
                            checked={newRole.permissions.epodPdf}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="EPod PDF"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div> */}
          {roleID === "" ? "" : <Box
            sx={{ marginTop: '20px', display: 'flex', justifyContent: 'right' }}
          >
            <Button variant="contained" type="submit">
              Save
            </Button>
            {/* {isEditMode ? (
              <Button variant="contained" onClick={handleEditSave}>
                Save
              </Button>
            ) : (
              <Button variant="contained" type="submit">
                Add Role
              </Button>
            )} */}
          </Box>}

        </form>
        {/* <div style={{ marginTop: '20px' }}>
          <Typography variant="h5">Role Table</Typography>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={roles}
              columns={columns}
              pageSize={5}
              checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </div> */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              width: 400,
              m: 2,
            }}
          >
            <Typography variant="h5">Edit Role</Typography>
            <TextField
              label="Role Name"
              name="name"
              value={editRole ? editRole.name : ''}
              onChange={(e) =>
                setEditRole({ ...editRole, name: e.target.value })
              }
              fullWidth
              sx={{
                margin: 1,
              }}
            />
            <TextField
              label="Role Name"
              name="role"
              value={editRole ? editRole.role : ''}
              onChange={(e) =>
                setEditRole({ ...editRole, role: e.target.value })
              }
              fullWidth
            />
            <Typography variant="h6">Permissions:</Typography>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="permissions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Registration</TableCell>
                    <TableCell>Load</TableCell>
                    <TableCell>Bidding</TableCell>
                    <TableCell>Bidding Configuration</TableCell>
                    <TableCell>Tracking</TableCell>
                    <TableCell>Delivery</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="registerTransporter"
                            checked={
                              editRole
                                ? editRole.permissions.registerTransporter
                                : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Register transporter"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        size="small"
                        control={
                          <Checkbox
                            name="createLoad"
                            checked={
                              editRole ? editRole.permissions.createLoad : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Create load"
                      />
                      <FormControlLabel
                        size="small"
                        control={
                          <Checkbox
                            name="manageLoad"
                            checked={
                              editRole ? editRole.permissions.manageLoad : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Manage Load"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="manageBid"
                            checked={
                              editRole ? editRole.permissions.manageBid : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Manage bid"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="showTransporterName"
                            checked={
                              editRole
                                ? editRole.permissions.showTransporterName
                                : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Show transporter name"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="showTransporterRate"
                            checked={
                              editRole
                                ? editRole.permissions.showTransporterRate
                                : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Show transporter rate during bidding"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="showLeastPrice"
                            checked={
                              editRole
                                ? editRole.permissions.showLeastPrice
                                : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Show least price during bidding"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="preTracking"
                            checked={
                              editRole
                                ? editRole.permissions.preTracking
                                : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Pre-tracking"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="manageTracking"
                            checked={
                              editRole
                                ? editRole.permissions.manageTracking
                                : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Manage tracking"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="alerts"
                            checked={
                              editRole ? editRole.permissions.alerts : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Alerts"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="epod"
                            checked={
                              editRole ? editRole.permissions.epod : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="EPod"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="epodPdf"
                            checked={
                              editRole ? editRole.permissions.epodPdf : false
                            }
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="EPod PDF"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" onClick={handleEditSave}>
              Save
            </Button>
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default RolesAndAccess;
