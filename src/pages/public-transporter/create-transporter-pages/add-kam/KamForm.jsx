import { useEffect, useState } from 'react';
import { Grid, TextField, Button, Box } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import {
  contactNumberValidator,
  requiredValidatorForNameRequired,
  emailValidator,
} from '../../../../validation/common-validator';
import RegisterCard from '../../../../components/card/RegisterCard';
import { emptyObjectValidator } from '../../../../utility/utility-function';
// import { v4 as uuidv4 } from 'uuid';
import { checkKamIsExistOrNot } from '../../../../api/register/transporter';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../../redux/slices/snackbar-slice';
import {
  createTransporterKam,
  updateKamUser,
} from '../../../../api/public-transporter/public-transporter';

const schema = yup.object().shape({
  name: requiredValidatorForNameRequired('Key account manager name'),
  email: emailValidator,
  contact_no: contactNumberValidator,
});

export default function KamForm({
  handleForm,
  kamDataForEdit,
  handleKamEdit,
  roleId,
  handleFormReset,
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
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const transp_id = localStorage.getItem('transp_id');

  useEffect(() => {
    console.log('triggered data', kamDataForEdit);
    const isEmpty = emptyObjectValidator(kamDataForEdit);
    if (!isEmpty) {
      console.log('triggered');
      setIsEdit(true);
      setValue('name', kamDataForEdit.name);
      setValue('email', kamDataForEdit.email);
      setValue('contact_no', kamDataForEdit.contact_no);
      setSelectedKam(kamDataForEdit);
    }
  }, [kamDataForEdit, setValue]);

  function handleCancel() {
    if (isEdit) {
      reset();
      setIsEdit(false);
      handleFormReset();
    } else {
      reset();
    }
  }

  function onSubmit(values) {
    if (isEdit) {
      /////////////////////EDIT///////////////////

      const editData = {
        ...values,
        user_id: selectedKam.user_id,
        share_login_details: selectedKam.share_login_details,
        role_list: [{ mpus_role_id: roleId }],
        // is_new: selectedKam.is_new,
      };
      updateKamUser(editData.user_id, editData)
        .then((res) => {
          if (res.data.success) {
            console.log(res);
            handleKamEdit(editData);
            setSelectedKam(null);
            setIsEdit(false);
            reset();
            dispatch(
              openSnackbar({
                type: 'success',
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => console.log(err));

      // checkKamIsExistOrNot(values.contact_no, values.email)
      //   .then((res) => {
      //     if (res.data.success) {
      //       dispatch(
      //         openSnackbar({
      //           type: 'success',
      //           message: res.data.clientMessage,
      //         })
      //       );
      //       dispatch(
      //         openSnackbar({
      //           type: 'success',
      //           message: 'KAM data updated successfully',
      //         })
      //       );
      //       updateKamUser(editData.user_id, editData);
      //       handleKamEdit(editData);
      //       setSelectedKam(null);
      //       setIsEdit(false);
      //       reset();
      //     } else {
      //       dispatch(
      //         openSnackbar({
      //           type: 'error',
      //           message: res.data.clientMessage,
      //         })
      //       );
      //     }
      //   })
      //   .catch((err) => console.log(err));
    } else {
      /////////////////////////////NEW///////////////////////////
      checkKamIsExistOrNot(values.contact_no, values.email)
        .then((res) => {
          if (res.data.success) {
            dispatch(
              openSnackbar({
                type: 'success',
                message: res.data.clientMessage,
              })
            );
            const payload = {
              ...values,
              role_list: [{ mpus_role_id: roleId }],
              user_transporter_id: transp_id,
            };
            createTransporterKam(payload)
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
            handleForm();
            reset();
          } else {
            dispatch(
              openSnackbar({
                type: 'error',
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => console.log(err));
    }
    console.log(values);

    // reset();
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RegisterCard title="Add KAM">
        <Grid container spacing={3}>
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
                  error={Boolean(errors.contact_no)}
                  size="small"
                  helperText={errors.contact_no?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Box
              display="flex"
              justifyContent="right"
              gap={3}
              alignItems="center"
            >
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </RegisterCard>
    </form>
  );
}
