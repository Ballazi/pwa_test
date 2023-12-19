import { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  nameValidator,
  emailValidator,
  contactNumberValidator,
  requiredValidator,
} from '../../../validation/common-validator';
import Autocomplete from '@mui/material/Autocomplete';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import { updateUser, viewBranch } from '../../../api/register/user-details';
import BackdropComponent from '../../backdrop/Backdrop';

const schema = yup.object().shape({
  name: nameValidator,
  email: emailValidator,
  contact_no: contactNumberValidator,
  mpus_role_id: requiredValidator('Role'),
});

const UserUpdate = ({
  rowObject,
  handleClose,
  editRolesOptions,
  editRegionOptions,
  shipper_id,
}) => {
  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const [RolesOptions, setRolesOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const fetchBranchData = (data) => {
    setIsLoading(true);
    const payload = { shipper_id: shipper_id, region_cluster_id: data };
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

  useEffect(() => {
    const fetchData = async () => {
      if (rowObject.role_list[0]) {
        const mpuRegionClusterId =
          rowObject.role_list[0].mpus_region_cluster_id;
        if (mpuRegionClusterId) {
          await fetchBranchData(mpuRegionClusterId);
        }
      }
      setRegionOptions(editRegionOptions);
      setRolesOptions(editRolesOptions);
      setValue('name', rowObject.name ? rowObject.name : '');
      setValue('email', rowObject.email ? rowObject.email : '');
      setValue('contact_no', rowObject.contact_no ? rowObject.contact_no : '');
      setValue(
        'mpus_role_id',
        rowObject.role_list[0].mpus_role_id
          ? rowObject.role_list[0].mpus_role_id
          : ''
      );
      setValue(
        'mpus_region_cluster_id',
        rowObject.role_list[0].mpus_region_cluster_id
          ? rowObject.role_list[0].mpus_region_cluster_id
          : ''
      );
      setValue(
        'mpus_branch_id',
        rowObject.role_list[0].mpus_branch_id
          ? rowObject.role_list[0].mpus_branch_id
          : ''
      );
    };
    fetchData();
  }, []);

  const close = () => {
    setOpen(false);
    handleClose(false);
    reset();
  };

  const handleSaveButtonClick = (form_data) => {
    const userId = rowObject.user_id;
    const payload = {
      user_id: userId,
      name: form_data.name,
      email: form_data.email,
      contact_no: form_data.contact_no,
      user_shipper_id: shipper_id,
      is_sos_user: form_data.is_sos_user,
      is_notification_allowed: form_data.send_notification,
      role_list: [
        {
          // mpus_shipper_id: shipper_id,
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
    };
    setIsLoading(true);
    updateUser(userId, payload)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          handleClose(true);
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
      })
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      <Dialog open={open} onClose={close} maxWidth={'md'}>
        <div className="customCardheader">
          <Typography variant="h4"> Update User</Typography>
        </div>
        <form onSubmit={handleSubmit(handleSaveButtonClick)}>
          <DialogContent>
            <Box>
              <Typography style={{ marginBottom: '20px' }} variant="h4">
                Branch Details
              </Typography>
            </Box>

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
                        setValue('mpus_branch_id', '');
                      }}
                      popupIcon={<KeyboardArrowDownIcon />}
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
                          label="Select role*"
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
                  defaultValue={rowObject.is_sos_user}
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
                  defaultValue={rowObject.is_notification_allowed}
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={close} variant="contained" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default UserUpdate;
