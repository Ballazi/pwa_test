import { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Typography,
  Button,
  Box,
  Grid,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox,
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TitleContainer from '../card/TitleContainer';
import RegisterCard from '../card/RegisterCard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentWrapper from '../form-warpper/ContentWrapper';
import FooterWrapper from '../form-warpper/FooterWrapper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  nameValidator,
  emailValidator,
  contactNumberValidator,
  requiredValidator,
} from '../../validation/common-validator';
import BackdropComponent from '../backdrop/Backdrop';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import { getRegion } from '../../api/register/branch-details';
import {
  createUser,
  deleteUser,
  viewUser,
  viewUserExisting,
  viewBranch,
  viewroleShipper,
} from '../../api/register/user-details';
import UserUpdate from './popup/UserUpdate';
import { getRoleByShipperId } from '../../api/shipper-role/shipper-role';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import DownloadIcon from '@mui/icons-material/Download';


const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
  filename: 'Users_List', // Set the desired file name
  columnHeaders: ['SI. no', 'User Name', 'Mobile No.', 'Email ID.', 'Region/Cluster', 'Role'],
});

export default function Users({
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
}) {
  const [adduser, setAddUser] = useState(false);
  const [userRows, setUserRows] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [updateIndex, setUpdateIndex] = useState('');
  const [rowObject, setRowObject] = useState({});
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const shipperId = localStorage.getItem('shipper_id');
  const shipperName = localStorage.getItem('shipper_name');

  const schema = yup.object().shape({
    name: nameValidator,
    email: emailValidator,
    contact_no: contactNumberValidator,
    mpus_role_id: requiredValidator('Role'),
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [RolesOptions, setRolesOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const myDivRef = useRef(null);

  const fetchRoleData = () => {
    // setIsLoading(true);
    // const payload = {
    //   shipper_id: shipperId,
    // }
    // return viewroleShipper(payload)
    getRoleByShipperId(shipperId)
      .then((res) => {
        if (res.data.success === true) {
          const updatedRole = res.data.data.map((item) => {
            return {
              label: item.role_name,
              value: item.id,
            };
          });
          console.log('data', updatedRole);
          setRolesOptions(updatedRole);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setRolesOptions([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchRegionData = () => {
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
    };
    return getRegion(payload)
      .then((res) => {
        if (res.data.success === true) {
          const updatedRegion = res.data.data.map((item) => {
            return {
              label: item.is_region ? item.region_name : item.cluster_name,
              value: item.msrc_region_cluster_id,
              is_region: item.is_region,
            };
          });
          setRegionOptions(updatedRegion);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setRegionOptions([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchBranchData = (data = null) => {
    setIsLoading(true);
    const payload = { shipper_id: shipperId, region_cluster_id: data };
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
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setBranchOptions([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchUserData = () => {
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
      isRegion: true,
    };
    return viewUser(payload)
      .then((res) => {
        if (res.data.success === true) {
          console.log(RolesOptions);
          console.log(res.data.data.map((x) => x.role_list[0]?.mpus_role_id));
          setUserRows(
            res.data.data.filter((x) =>
              RolesOptions.some(
                (role) => role.value === x.role_list[0]?.mpus_role_id
              )
            )
          );
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setUserRows([]);
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
      await fetchRegionData();
      await fetchBranchData();
      await fetchRoleData();
      // await fetchUserData();
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [RolesOptions]);

  useEffect(() => {
    //for smooth scroll
    if (adduser === true && myDivRef.current) {
      console.log('clicked');
      myDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [adduser]);

  const updateRow = (data, index) => {
    console.log(data);
    setUpdateIndex(index);
    setRowObject(data);
    setOpenUpdateModel(true);
  };

  const handleClose = (flag) => {
    if (flag) {
      setOpenUpdateModel(false);
      fetchUserData();
    } else {
      setOpenUpdateModel(false);
    }
  };

  const deleteRow = (data, index) => {
    setUpdateIndex(index);
    if (data.user_id !== null) {
      setDeleteId(data.user_id);
    }
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId === '') {
      userRows.splice(updateIndex, 1);
      setUpdateIndex('');
      closeDeleteDialog();
    } else {
      setIsLoading(true);
      return deleteUser(deleteId)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: 'success', message: res.data.clientMessage })
            );
            closeDeleteDialog();
            setDeleteId('');
            setUpdateIndex('');
            fetchUserData();
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

  const handleUserSave = (form_data) => {
    setIsLoading(true);
    const data = [
      {
        user_id: null,
        name: form_data.name,
        email: form_data.email,
        contact_no: form_data.contact_no,
        user_shipper_id: shipperId,
        is_sos_user: form_data.is_sos_user,
        is_notification_allowed: form_data.send_notification,
        role_list: [
          {
            mpus_region_cluster_id: form_data.mpus_region_cluster_id
              ? form_data.mpus_region_cluster_id
              : null,
            mpus_branch_id: form_data.mpus_branch_id
              ? form_data.mpus_branch_id
              : null,
            mpus_role_id: form_data.mpus_role_id
              ? form_data.mpus_role_id
              : null,
          },
        ],
      },
    ];
    createUser(data)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          fetchUserData();
          reset();
          setAddUser(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const nextHandler = () => {
    if (userRows.length === 0) {
      dispatch(openSnackbar({ type: 'error', message: 'Please create user' }));
    } else {
      handleNext();
    }
  };

  const selectedRoleName = (id) => {
    const stateLabel = RolesOptions.filter((ele) => ele.value === id);
    return stateLabel.length ? stateLabel[0].label : '-';
  };

  const selectedRegionName = (id) => {
    const stateLabel = regionOptions.filter((ele) => ele.value === id);
    return stateLabel.length ? stateLabel[0].label : '-';
  };

  const handleExportRows = () => {
    const rowData = userRows.map((row, rowIndex) => (
      {
        "SI. no": rowIndex + 1,
        "User Name": row.name,
        "Mobile No.": row.contact_no,
        "Email ID.": row.email,
        "Region/Cluster": selectedRegionName(row.role_list[0].mpus_region_cluster_id),
        "Role": selectedRoleName(row.role_list[0].mpus_role_id),
      }
    ))
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  return (
    <>
      {openUpdateModel ? (
        <UserUpdate
          rowObject={rowObject}
          handleClose={handleClose}
          shipper_id={shipperId}
          editRolesOptions={RolesOptions}
          editRegionOptions={regionOptions}
        />
      ) : null}
      <BackdropComponent loading={loading} />
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
          <Typography variant="h3">Users </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              marginTop: '8px',
              color: '#8A919D',
            }}
            variant="body1"
            mb={1}
          >
            Fill out / Update user details
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

        {userRows.length === 0
          ? null :
          <RegisterCard>
            <Grid container sx={{ alignItems: 'center', mb: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4">User List</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid
                  container
                  sx={{ justifyContent: 'right', alignItems: 'center' }}
                >
                  <Avatar
                    sx={{
                      background: '#065AD8',
                      width: 24,
                      height: 24,
                      fontSize: 12,
                    }}
                  >
                    {userRows.length}
                  </Avatar>
                  <Typography sx={{ ml: 0.5 }}>users added</Typography>
                  &nbsp;
                  &nbsp;
                  <Button variant="contained" onClick={handleExportRows} startIcon={<DownloadIcon />}>
                    EXPORT CSV
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#065AD81A' }}>
                  <TableRow>
                    <TableCell>Sl. no</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>Mobile No.</TableCell>
                    <TableCell>Email ID.</TableCell>
                    <TableCell>Region/Cluster</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="center">Options</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userRows.length === 0
                    ? 'No data to show'
                    : userRows.map((row, rowIndex) => (
                      <TableRow key={row}>
                        <TableCell>
                          <Typography>{rowIndex + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.contact_no}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {row.role_list
                              .map((role) =>
                                selectedRegionName(role.mpus_region_cluster_id)
                              )
                              .join(', ')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {row.role_list
                              .map((role) =>
                                selectedRoleName(role.mpus_role_id)
                              )
                              .join(', ')}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <IconButton onClick={() => updateRow(row, rowIndex)}>
                            <BorderColorIcon fontSize="small" color="primary" />
                          </IconButton>

                          <IconButton
                            style={{ marginLeft: '10px' }}
                            onClick={() => deleteRow(row, rowIndex)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </RegisterCard>
        }
        <RegisterCard>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">Create Users</Typography>

            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => setAddUser(!adduser)}
            >
              {' '}
              Add User
            </Button>
          </Box>
        </RegisterCard>
        {adduser ? (
          <Box id="myDiv" ref={myDivRef}>
            <form onSubmit={handleSubmit(handleUserSave)}>
              <RegisterCard title="User Details">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          variant="filled"
                          {...field}
                          label="Name*"
                          fullWidth
                          size="small"
                          error={Boolean(errors.name)}
                          helperText={errors.name?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          variant="filled"
                          {...field}
                          label="Email*"
                          fullWidth
                          size="small"
                          error={Boolean(errors.email)}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="contact_no"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          variant="filled"
                          {...field}
                          label="Contact number*"
                          fullWidth
                          size="small"
                          error={Boolean(errors.contact_no)}
                          helperText={errors.contact_no?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="mpus_region_cluster_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={regionOptions}
                          getOptionLabel={(option) => option.label || ''}
                          value={
                            regionOptions.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                            fetchBranchData(newValue.value);
                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Region / Cluster"
                              variant="filled"
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="mpus_branch_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={branchOptions}
                          getOptionLabel={(option) => option.label || ''}
                          value={
                            branchOptions.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Branch Name"
                              variant="filled"
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="mpus_role_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={RolesOptions}
                          getOptionLabel={(option) => option.label || ''}
                          value={
                            RolesOptions.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : '');
                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Role *"
                              variant="filled"
                              fullWidth
                              size="small"
                              error={!!errors.mpus_role_id}
                              helperText={errors.mpus_role_id?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="is_sos_user"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={() => {
                                field.onChange(!field.value);
                              }}
                            />
                          }
                          label="SOS User"
                        />
                      )}
                    />
                    <Controller
                      name="send_notification"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={() => {
                                field.onChange(!field.value);
                              }}
                            />
                          }
                          label="Send Notification"
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    md={12}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      sx={{ color: '#555C69', marginRight: '15px' }}
                      onClick={() => { setAddUser(!adduser); reset() }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      // sx={{ marginRight: "15px" }}
                      type="submit"
                    >
                      Save
                    </Button>
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
            // type="submit"
            onClick={() => nextHandler()}
            disabled={currentStep === stepsContent.length - 1 || adduser}
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
