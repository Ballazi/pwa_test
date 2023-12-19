import { useEffect, useState } from 'react';
import RegisterCard from '../../../../components/card/RegisterCard';
import { Button, Grid, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import {
  requiredValidatorForNameRequired,
  roleContactNumberValidator,
  emailValidator,
} from '../../../../validation/common-validator';
import { useDispatch } from 'react-redux';
import {
  createTransporterAdmin,
  fetchTransporterAdmin,
  updateAdminUser,
} from '../../../../api/public-transporter/public-transporter';
import { openSnackbar } from '../../../../redux/slices/snackbar-slice';
import BackdropComponent from '../../../../components/backdrop/Backdrop';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: requiredValidatorForNameRequired('Admin name'),
  contact_no: roleContactNumberValidator('Admin contact'),
  email: emailValidator,
});

export default function CreateAdmin({ handleNext, handlePrevious }) {
  const [userId, setUserId] = useState(null);
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(false);
  const transp_id = localStorage.getItem('transp_id');
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    setValue,
    // getValues,
    // clearErrors,
    // setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    console.log('test');
    setLoading(true);
    fetchTransporterAdmin(transp_id)
      .then((res) => {
        if (res.data.success) {
          console.log('hi', res.data.data);
          setValue('name', res.data.data.name);
          setValue('email', res.data.data.email);
          setValue('contact_no', res.data.data.contact_no);
          setUserId(res.data.data.user_id);
          setEditData(res.data.data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [transp_id]);

  function onSubmit(values) {
    console.log(values);
    if (transp_id && userId) {
      const payload = {
        ...values,
        user_transporter_id: transp_id,
        user_id: userId,
        role_list: editData.role_list,
      };
      updateAdminUser(userId, payload)
        .then((res) => {
          console.log('upupup', res);
          if (res.data.success) {
            console.log('update', res);
            handleNext();
          } else {
            dispatch(
              openSnackbar({
                type: 'error',
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            openSnackbar({
              type: 'error',
              message: 'Something went wrong! Please try again later',
            })
          );
        });
    } else {
      const payload = {
        req: {
          ...values,
        },
        transporter_id: transp_id,
      };
      createTransporterAdmin(payload)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data.data);
            handleNext();
            dispatch(
              openSnackbar({
                type: 'success',
                message: 'Admin created successfully',
              })
            );
          } else {
            dispatch(
              openSnackbar({
                type: 'error',
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            openSnackbar({
              type: 'error',
              message: 'Something went wrong! Please try again later',
            })
          );
        });
    }
  }
  return (
    <>
      <BackdropComponent loading={loading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <RegisterCard title="Create Admin User">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name*"
                    variant="filled"
                    fullWidth
                    error={Boolean(errors.name)}
                    size="small"
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="contact_no"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Number*"
                    variant="filled"
                    fullWidth
                    type="number"
                    error={Boolean(errors.contact_no)}
                    size="small"
                    helperText={errors.contact_no?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email *"
                    variant="filled"
                    fullWidth
                    error={Boolean(errors.email)}
                    size="small"
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                id="outlined-basic-pinCode"
                label="Role"
                // variant="outlined"
                variant="filled"
                name="Role"
                fullWidth
                size="small"
                value={'Transporter Admin'}
                disabled={true}
              />
            </Grid>
          </Grid>
        </RegisterCard>

        <Grid container justifyContent="space-between">
          <Button variant="outlined" onClick={handlePrevious}>
            Previous
          </Button>
          <Button type="submit" variant="contained">
            Save and continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
