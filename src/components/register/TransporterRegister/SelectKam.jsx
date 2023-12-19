import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Autocomplete,
  TextField,
  Box,
  Button,
  Chip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { fetchKams, fetchBranch } from '../../../api/register/transporter';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  requiredValidatorForNameRequired,
  emailValidator,
  contactNumberValidator,
  requiredValidatorOfArrayNew,
  // requiredValidatorOfArray,
} from '../../../validation/common-validator';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { checkKamIsExistOrNot } from '../../../api/register/transporter';
import { v4 as uuidv4 } from 'uuid';
import { emptyObjectValidator } from '../../../utility/utility-function';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';

const schema = yup.object().shape({
  name: requiredValidatorForNameRequired('Key account manager name'),
  email: emailValidator,
  contact_no: contactNumberValidator,
  role_list: requiredValidatorOfArrayNew('Branch'),
});

export default function SelectKam({
  transId,
  handleKamUsers,
  kamDataForEdit,
  handleKamEdit,
  isEdited,
  users,
  onCancelEdit,
}) {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [selectedKam, setSelectedKam] = useState(null);
  const [kamOptions, setKamOptions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedCur, setSelectedCur] = useState([]);
  const [openKamDetails, setOpenKamDetails] = useState(false);
  const [isNewKam, setIsNewKam] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingButtonState, setLoadingButtonState] = useState(false);
  const shipper_id = localStorage.getItem('shipper_id');
  const dispatch = useDispatch();

  useEffect(() => {
    const isEmpty = emptyObjectValidator(kamDataForEdit);
    if (!isEmpty) {
      setIsEdit(true);
      console.log('hoo', kamDataForEdit);
      if (kamDataForEdit.is_new === true) {
        setIsNewKam(true);
      } else {
        setIsNewKam(false);
      }
      setSelectedKam(kamDataForEdit);
      setValue('name', kamDataForEdit.name);
      setValue('email', kamDataForEdit.email);
      setValue('contact_no', kamDataForEdit.contact_no);
      setValue('role_list', kamDataForEdit.role_list);
      setSelectedCur(kamDataForEdit.role_list);
      setOpenKamDetails(true);
    }

    isEdited &&
      fetchKams(transId)
        .then((res) => {
          console.log('kam data', res.data.data);
          setKamOptions(res.data.data);
        })
        .catch((err) => console.log(err));

    fetchBranch(shipper_id)
      .then((res) => {
        console.log('role_list', res.data.data);
        const data = res.data.data.map((item) => {
          return {
            label: item.name,
            value: item.branch_id,
          };
        });
        setBranches(data);
      })
      .catch((err) => console.log(err));
  }, [transId, shipper_id, kamDataForEdit, setValue]);

  const handleKamChange = (event, newValue) => {
    if (users.some((kam) => kam?.user_id === newValue.user_id)) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'User already added! Please select another user!',
        })
      );
      setSelectedKam(newValue);
    } else {
      setIsNewKam(false);
      console.log('newValue', newValue);
      setSelectedKam(newValue);
      setValue('name', newValue.name);
      setValue('email', newValue.email);
      setValue('contact_no', newValue.contact_no);
      setOpenKamDetails(true);
    }
  };

  const handleChipDeleteOperating = (data) => {
    const filteredData = selectedCur.filter((ele) => ele.label !== data.label);
    setSelectedCur(filteredData);
    setValue('role_list', [...filteredData]);
  };

  const handleKamOpen = () => {
    setOpenKamDetails(true);
    setIsNewKam(true);
  };

  const onSubmit = (data) => {
    if (isEdit) {
      console.log('hoho is Edit', data);
      const editData = {
        ...data,
        user_id: selectedKam.user_id,
        share_login_details: selectedKam.share_login_details,
        is_new: selectedKam.is_new,
      };
      if (editData.is_new === true) {
        console.log('hello hobe', editData);
        setLoadingButtonState(true);
        checkKamIsExistOrNot(editData.contact_no, editData.email)
          .then((res) => {
            if (res.data.success) {
              ///////check kam from existing state///not submitted block
              if (users.some((item) => item.email === data.email)) {
                dispatch(
                  openSnackbar({
                    type: 'error',
                    message: 'Email already added!',
                  })
                );
              } else if (
                users.some((item) => item.contact_no === data.contact_no)
              ) {
                dispatch(
                  openSnackbar({
                    type: 'error',
                    message: 'Phone number already added!',
                  })
                );
              } else {
                console.log('users', users);
                console.log(res.data);
                handleKamEdit(editData);
                console.log('edit data', editData);
                reset();
                dispatch(
                  openSnackbar({
                    type: 'success',
                    message: 'KAM data entered successfully',
                  })
                );
                setSelectedKam(null);
                setOpenKamDetails(false);
                setSelectedCur([]);
                setIsNewKam(false);
                setIsEdit(false);
              }
            } else {
              console.log('here', res.data.clientMessage);
              dispatch(
                openSnackbar({
                  type: 'error',
                  message: res.data.clientMessage,
                })
              );
            }
          })
          .catch((err) => console.log(err))
          .finally(() => setLoadingButtonState(false));
      } else {
        handleKamEdit(editData);
        console.log('edit data', editData);
        reset();
        dispatch(
          openSnackbar({
            type: 'success',
            message: 'KAM data entered successfully',
          })
        );
        setSelectedKam(null);
        setOpenKamDetails(false);
        setSelectedCur([]);
        setIsNewKam(false);
        setIsEdit(false);
      }
    } else if (isNewKam) {
      setLoadingButtonState(true);
      checkKamIsExistOrNot(data.contact_no, data.email)
        .then((res) => {
          if (res.data.success) {
            if (users.some((item) => item.email === data.email)) {
              dispatch(
                openSnackbar({
                  type: 'error',
                  message: 'Email already added!',
                })
              );
            } else if (
              users.some((item) => item.contact_no === data.contact_no)
            ) {
              dispatch(
                openSnackbar({
                  type: 'error',
                  message: 'Phone number already added!',
                })
              );
            } else {
              handleKamUsers({
                ...data,
                share_login_details: true,
                user_id: uuidv4(),
                is_new: true,
              });
              reset();
              setSelectedKam(null);
              setOpenKamDetails(false);
              setSelectedCur([]);
              setIsNewKam(false);
              dispatch(
                openSnackbar({
                  type: 'success',
                  message: 'KAM data entered successfully',
                })
              );
              setIsEdit(false);
            }
          } else {
            console.log('here', res.data.clientMessage);
            dispatch(
              openSnackbar({
                type: 'error',
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoadingButtonState(false));
      console.log('isKamNew', data);
    } else {
      handleKamUsers({
        ...data,
        user_id: selectedKam.user_id,
        share_login_details: true,
        is_new: false,
      });
      reset();
      setSelectedKam(null);
      setOpenKamDetails(false);
      setSelectedCur([]);
      setIsNewKam(false);
    }
  };

  const onCancel = () => {
    if (isEdit) {
      onCancelEdit();
    }
    reset();
    setSelectedKam(null);
    setOpenKamDetails(false);
    setSelectedCur([]);
    setIsNewKam(false);
    setIsEdit(false);
  };

  return (
    <>
      <Typography
        color={'#2D3440'}
        sx={{ mt: 3, fontWeight: 600, fontSize: '18px', mb: 2 }}
      >
        Key account manager*
      </Typography>
      <Grid container>
        {isEdited && (
          <Grid item xs={12} sm={12} md={8} lg={7}>
            <Autocomplete
              id="autocomplete-kam"
              options={kamOptions}
              value={selectedKam}
              onChange={handleKamChange}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Key account managers"
                  variant="filled"
                />
              )}
              // clearIcon={null}
            />
          </Grid>
        )}
      </Grid>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sm={12} md={8} lg={7}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={6} lg={6}>
              {isEdited ? (
                <Typography>KAM does not exist?</Typography>
              ) : (
                <Typography>Please add kam details</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Grid container justifyContent="right">
                <Button
                  variant="outlined"
                  sx={{
                    border: '1px solid #8A919D',
                    fontWeight: 600,
                    color: '#8A919D',
                    size: '12px',
                  }}
                  onClick={handleKamOpen}
                  disabled={isNewKam}
                >
                  Add KAM
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {openKamDetails && (
        <Box sx={{ border: '0.5px solid #BDCCD3', mt: 2 }}>
          <Grid container spacing={3} sx={{ padding: '10px' }}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Key account manager name*"
                    variant="filled"
                    fullWidth
                    disabled={!isNewKam}
                    error={Boolean(errors.name)}
                    size="small"
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email*"
                    variant="filled"
                    fullWidth
                    disabled={!isNewKam}
                    error={Boolean(errors.email)}
                    size="small"
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="contact_no"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile Number*"
                    variant="filled"
                    fullWidth
                    disabled={!isNewKam}
                    error={Boolean(errors.contact_no)}
                    size="small"
                    helperText={errors.contact_no?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="role_list"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    {...field}
                    size="small"
                    id="setting-select"
                    options={branches}
                    popupIcon={<KeyboardArrowDownIcon />}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                      setSelectedCur(newValue);
                      console.log('newValue', newValue);
                    }}
                    clearIcon={null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select shipper branch*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.role_list)}
                        helperText={errors.role_list?.message}
                      />
                    )}
                    renderTags={() => (
                      <Box sx={{ display: 'flex' }}>
                        <Typography
                          variant="h6"
                          sx={{ marginLeft: '4px', color: '#5E6871' }}
                        >
                          {selectedCur.length}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#5E6871' }}>
                          &nbsp;branch selected
                        </Typography>
                      </Box>
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box display="flex" alignItems="center">
                          {selectedCur.some(
                            (setting) => setting.label === option.label
                          ) ? (
                            <CheckBoxIcon
                              sx={{ color: '#065AD8', marginRight: '3px' }}
                            />
                          ) : (
                            <CheckBoxOutlinedIcon
                              sx={{ color: '#74797C', marginRight: '3px' }}
                            />
                          )}

                          {option.label}
                        </Box>
                      </li>
                    )}
                  />
                )}
              />
            </Grid>
            {selectedCur.length > 0 && (
              <Grid item xs={12} sm={12} md={6}>
                <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                  Branches selected
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #BDCCD3',
                    borderRadius: '8px',
                    p: 2,
                    minHeight: '48px',
                  }}
                >
                  {selectedCur.map((region) => (
                    <Chip
                      key={region.value}
                      label={region.label}
                      onDelete={() => handleChipDeleteOperating(region)}
                      variant="outlined"
                      color="primary"
                      sx={{ m: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'right',
              gap: 2,
              padding: '10px',
            }}
          >
            <Button
              variant="outlined"
              sx={{
                border: '1px solid #8A919D',
                fontWeight: 600,
                color: '#8A919D',
                size: '12px',
              }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loadingButtonState}
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              Save KAM
            </LoadingButton>
          </Box>
        </Box>
      )}
    </>
  );
}
