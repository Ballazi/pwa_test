import { useEffect, useState } from 'react';
import ContentWrapper from '../form-warpper/ContentWrapper';
import FooterWrapper from '../form-warpper/FooterWrapper';
import RegisterCard from '../card/RegisterCard';
import {
  Button,
  Grid,
  TextField,
  Typography,
  RadioGroup,
  Box,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Clear, InfoOutlined } from '@mui/icons-material';
import ErrorTypography from '../typography/ErrorTypography';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  roleNameValidator,
  roleContactNumberValidator,
  requiredValidator,
  emailValidator,
  requiredValidatorForNameRequired,
} from '../../validation/common-validator';
import TitleContainer from '../card/TitleContainer';
import {
  createAdmin,
  fetchAllRole,
  fetchAdmin,
  createModulemap,
  fetchSelectModule,
  updateUser,
} from '../../api/register/create-admin';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import { getModule } from '../../api/master-data/roleMaster';
import BackdropComponent from '../backdrop/Backdrop';
const schema = yup.object().shape({
  adminName: requiredValidatorForNameRequired('Admin name'),
  adminContactNumber: roleContactNumberValidator('Admin contact'),
  adminEmail: emailValidator,
  purchaseLicense: requiredValidator('Purchase License'),
});

export default function CreateAdmin({
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
}) {
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
  const dispatch = useDispatch();
  const shipper_id = localStorage.getItem('shipper_id');
  const [allLicense, setAllLicense] = useState([]);
  const [userData, setUserData] = useState([]);
  const [admindata, setadmindata] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const shipperName = localStorage.getItem('shipper_name');
  const moduleData = () => {
    return getModule()
      .then((data) => {
        if (data.success === true) {
          // console.log("objectttt", shipperData)
          setAllLicense(data.data);
        } else {
          // setAlertType("error")
          // setMessage(data.clientMessage)
          setAllLicense([]);
        }
      })
      .catch((error) => {
        console.error('error', error);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    if (shipper_id) {
      fetchSelectModule(shipper_id).then((res) => {
        setIsLoading(false);
        console.log(res.data.data[0]?.msm_module_id);
        if (res.data.data) {
          setValue('purchaseLicense', res.data.data[0]?.msm_module_id);
        }

        // setValue("adminName",res.data.name)
      });
      fetchAdmin(shipper_id)
        .then((res) => {
          setIsLoading(false);
          if (res.data.data.name) {
            console.log('check', res);
            setadmindata(true);
            setUserData(res.data.data);
            setValue('adminName', res.data.data.name);
            setValue('adminEmail', res.data.data.email);
            setValue('adminContactNumber', res.data.data.contact_no);
          }

          // setValue("adminName",res.data.name)
        })
        .catch((err) => console.log(err));
    }

    fetchAllRole({ id: shipper_id })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
    moduleData();
  }, [shipper_id]);

  // const updateUser = async (payloadModule, payload) => {
  //   try {
  //     const [moduleResponse, updateUserResponse] = await Promise.all([
  //       createModulemap(payloadModule),
  //       updateUser(userData.user_id, payload),
  //     ]);
  //     console.log('is truru love?', moduleResponse, updateUserResponse);
  //     if (moduleResponse.success && updateUserResponse.success) {
  //       handleNext();
  //     } else {
  //       dispatch(
  //         openSnackbar({
  //           type: 'success',
  //           message: 'Something went wrong! Please try again later!',
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = (data) => {
    if (admindata) {
      console.log('admin data', userData);
      const payloadModule = {
        msm_shipper_id: shipper_id,
        msm_module_id: data.purchaseLicense,
      };
      const payload = {
        name: data.adminName,
        email: data.adminEmail,
        contact_no: data.adminContactNumber,
        user_shipper_id: shipper_id,
        role_list: userData.role_list,
      };
      setIsLoading(true);
      createModulemap(payloadModule)
        .then((res) => {
          if (res.data.success) {
            console.log('hok');
            updateUser(userData.user_id, payload)
              .then((res) => {
                if (res.data.success) {
                  dispatch(
                    openSnackbar({
                      type: 'success',
                      message: 'Admin details updated successfully!',
                    })
                  );
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
              .catch((err) => console.log(err));
          } else {
            dispatch(
              openSnackbar({
                type: 'error',
                message: 'Some thing went wrong',
              })
            );
          }
        })
        .catch((err) => console.log('error', err))
        .finally(() => setIsLoading(false));

      // updateUser(payloadModule, payload);
    } else {
      setIsLoading(true);
      const payloadModule = {
        msm_shipper_id: shipper_id,
        msm_module_id: data.purchaseLicense,
      };

      // Create a promise for createModulemap
      const createModulemapPromise = createModulemap(payloadModule);

      createModulemapPromise
        .then((res) => {
          if (res.data.success === true) {
            setIsLoading(false);
            // dispatch(
            //   openSnackbar({
            //     type: 'success',
            //     // message: 'Admin created successfully!',
            //   })
            // );

            // Now, call createAdmin after createModulemap succeeds
            const payload = {
              name: data.adminName,
              email: data.adminEmail,
              contact_no: data.adminContactNumber,
              user_shipper_id: shipper_id,
              role_list: [],
            };

            return createAdmin(payload); // Return the promise for createAdmin
          } else {
            setIsLoading(false);
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
          }
        })
        .then((res) => {
          if (res && res.data.success === true) {
            // Assuming handleNext() is called here to proceed further.
            handleNext();
            dispatch(
              openSnackbar({
                type: 'success',
                message: 'Admin created successfully!',
              })
            );
          } else if (res) {
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
          }
        })
        .catch((err) => {
          // Handle errors for both createModulemap and createAdmin
          dispatch(
            openSnackbar({ type: 'error', message: err.response.data.message })
          );
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackdropComponent loading={loading} />
      <ContentWrapper>
        <TitleContainer>
          <Typography variant="h3">Admin Details </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              marginTop: '8px',
              color: '#8A919D',
            }}
            variant="body1"
            mb={1}
          >
            Fill up / Update admin details
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
        <RegisterCard title="Service Selection">
          <Typography sx={{ mt: -2, fontWeight: 400, color: '#8B8EA1', mb: 4 }}>
            Select a service
          </Typography>

          <Controller
            name="purchaseLicense"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RadioGroup
                {...field}
                display="block"
                onChange={(event) => field.onChange(event.target.value)}
              >
                <Grid container spacing={2}>
                  {allLicense.length === 0 ? (
                    <Box justifyContent="center">
                      <Typography>Module not found</Typography>
                    </Box>
                  ) : (
                    allLicense.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          sx={{
                            border: '1px solid #BDCCD3',
                            borderRadius: '6px',
                            padding: '10px',
                            cursor: 'pointer',
                          }}
                          onClick={() => field.onChange(item.id)}
                        >
                          <Box
                            sx={{ display: 'flex', justifyContent: 'right' }}
                          >
                            <FormControlLabel
                              value={item.id}
                              control={<Radio />}
                              sx={{ mr: -1 }}
                            />
                          </Box>
                          <Typography
                            sx={{
                              textAlign: 'center',
                              fontWeight: 600,
                              color: '#454C50',
                              fontSize: '14px',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'right',
                              my: 1,
                            }}
                          >
                            <InfoOutlined />
                          </Box>
                        </Box>
                      </Grid>
                    ))
                  )}
                </Grid>
              </RadioGroup>
            )}
          />
          {errors.purchaseLicense && (
            <ErrorTypography>{errors.purchaseLicense.message}</ErrorTypography>
          )}
        </RegisterCard>
        <RegisterCard title="Create Admin User">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="adminName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name*"
                    variant="filled"
                    fullWidth
                    error={Boolean(errors.adminName)}
                    size="small"
                    helperText={errors.adminName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="adminContactNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Number*"
                    variant="filled"
                    fullWidth
                    type="number"
                    error={Boolean(errors.adminContactNumber)}
                    size="small"
                    helperText={errors.adminContactNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="adminEmail"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email *"
                    variant="filled"
                    fullWidth
                    error={Boolean(errors.adminEmail)}
                    size="small"
                    helperText={errors.adminEmail?.message}
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
                value={'Shipper Admin'}
                disabled={true}
              />
            </Grid>
          </Grid>
        </RegisterCard>
      </ContentWrapper>
      <FooterWrapper>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={currentStep === stepsContent.length - 1}
        >
          {admindata === false
            ? 'Create Admin User & Submit'
            : 'Save & Continue'}
        </Button>
      </FooterWrapper>
    </form>
  );
}
