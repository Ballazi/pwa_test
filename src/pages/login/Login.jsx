import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AcculeadImage from '../../assets/Acculead.svg';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/login/login';
import { useDispatch } from 'react-redux';
import { setRoleList, setUserData } from '../../redux/slices/user-slice';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import { decodeToken } from 'react-jwt';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  loginInfoValidator,
  otpValidator,
} from '../../validation/common-validator';
// import useAuth from '../../hooks/handle-auth';
function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const schema = yup.object().shape({
    mobileNumber: loginInfoValidator,
    otp: otpValidator,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: '000000',
    },
  });
  const authToken = localStorage.getItem('authToken');
  const user_type = localStorage.getItem('user_type');

  useEffect(() => {
    if (authToken && user_type === 'acu') {
      navigate('/acculead-secured/dashboard');
    } else if (authToken && user_type === 'shp') {
      navigate('/shipper-secured/dashboard');
    } else if (authToken && user_type === 'trns') {
      navigate('/transporter-secured/dashboard');
    } else {
      setIsLoading(false);
      return;
    }
  }, []);

  // const { decodedToken } = useJwt();

  const dispatch = useDispatch();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleRegShipper = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('shipper_id');
    localStorage.removeItem('shipper_name');
    navigate('/selfRegister');
  };

  const handleLogin = (mobileNumber) => {
    login({
      contact_no: mobileNumber,
      otp: '0000',
    })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem(
            'authToken',
            JSON.stringify(res.data.data.token)
          );

          // const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
          // localStorage.setItem('expiryTime', expiryTime);
          console.log(localStorage.getItem('authToken'));
          console.log(res.data.data);
          const token = decodeToken(res.data.data.token);
          token.access && dispatch(setRoleList(token.access?.submodules));
          dispatch(setUserData(token));
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          console.log('lets see', token.user_type);
          localStorage.setItem('user_type', token.user_type);
          localStorage.setItem('user_id', token.shipper_id);
          localStorage.setItem('region_cluster_id', token.region_cluster_id);

          localStorage.setItem('branch_id', token.branch_id);
          if (token.user_type === 'shp') {
            window.location = '/shipper-secured/dashboard';
            localStorage.setItem('shipper_logo', token.logo);
            localStorage.setItem('shipper_id', token.shipper_id);
            localStorage.setItem('shipper_name', token.shipper_name);
          } else if (token.user_type === 'acu') {
            window.location = '/acculead-secured/dashboard';
            localStorage.setItem('user_id', token.id);
          } else {
            // console.log('hi');
            window.location = '/transporter-secured/dashboard';
            localStorage.setItem('transporter_logo', token.logo);
            localStorage.setItem('transporter_id', token.transporter_id);
            localStorage.setItem('transporter_name', token.transporter_name);
          }
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch(() =>
        dispatch(
          openSnackbar({ type: 'error', message: 'Something went wrong!' })
        )
      );
  };

  const onSubmit = async (data) => {
    handleLogin(data.mobileNumber);
  };
  return (
    <>
      {isLoading ? (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <CircularProgress color="primary" />
          <h6>Loading...</h6>
        </Box>
      ) : (
        <div className="LoginBackground">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              background: '#e7ebef5c',
            }}
          >
            <Card style={{ width: 300 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <img src={AcculeadImage} alt="logo" />
                <Typography variant="h4" gutterBottom mb={2}>
                  Login
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...field } }) => (
                      <TextField
                        label="Mobile number*"
                        variant="filled"
                        fullWidth
                        inputRef={ref}
                        error={Boolean(errors.mobileNumber)}
                        size="small"
                        helperText={errors.mobileNumber?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="otp"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...field } }) => (
                      <TextField
                        label="OTP*"
                        sx={{ marginTop: '24px' }}
                        variant="filled"
                        fullWidth
                        inputRef={ref}
                        disabled={true}
                        error={Boolean(errors.otp)}
                        type={showPassword ? 'text' : 'password'}
                        size="small"
                        helperText={errors.otp?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={toggleShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        {...field}
                      />
                    )}
                  />
                  <Button
                    sx={{ mt: 3 }}
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                  >
                    Login
                  </Button>
                </form>
                <Typography variant="body2" mt={2}>
                  Don&apos;t have an Account?
                  <span
                    style={{
                      color: '#007bff',
                      fontWeight: 'bold',
                      marginLeft: '10px',
                    }}
                  >
                    <Button
                      variant="clear"
                      color="primary"
                      onClick={handleRegShipper}
                    >
                      Sign Up
                    </Button>
                  </span>
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
