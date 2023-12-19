import { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Grid,
  Box,
  styled,
  Chip,
  Typography,
  Button,
} from '@mui/material';
import TransporterDetails from '../create-transporter-pages/transporter-details/TransporterDetails';
import CreateAdmin from '../create-transporter-pages/create-admin/CreateAdmin';
import AddKam from '../create-transporter-pages/add-kam/AddKam';
import AcculeadImage from '../../../assets/Acculead.svg';
import Logout from '../../../assets/icon_park_logout.svg';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledMedBox = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const StyledMTopContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    paddingTop: '24px',
    paddingBottom: '24px',
  },
}));

const TitleContainerBox = styled(Box)(({ theme }) => ({
  marginBottom: '24px',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    marginBottom: '12px',
  },
}));

const StyledSmBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: '10px',
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

const StyledStepper = styled(Stepper)(() => ({
  cursor: 'pointer',
  '& .MuiStepIcon-root.Mui-completed': {
    color: '#CCEBD5 !important', // Set the color for completed steps
    borderColor: 'red',
    cursor: 'pointer',
  },
  '& .Mui-disabled': {
    cursor: 'pointer',
  },
}));

const StyledStepperDisabled = styled(Stepper)(() => ({
  '& .MuiStepIcon-root.Mui-completed': {
    color: '#CCEBD5 !important', // Set the color for completed steps
    borderColor: 'red',
  },
}));

export default function TransporterLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [myvalue, setMyValue] = useState([]);
  const navigate = useNavigate();

  const handleNext = () => {
    console.log('scuree', currentStep);
    if (currentStep !== stepsContent.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleLogout = () => {
    console.log('here in log out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiryTime');
    Cookies.remove('authToken');
    ///////////////////
    /////////////////
    localStorage.removeItem('authToken');
    localStorage.removeItem('transporter_name');
    localStorage.removeItem('shipper_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('shipper_name');
    localStorage.removeItem('shipper_logo');
    localStorage.removeItem('region_cluster_id');
    localStorage.removeItem('branch_id');
    localStorage.removeItem('transporter_logo');
    navigate('/');
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
  };

  const stepLabel = ['Transporter details', 'Create admin user', 'Add KAM'];
  const subTitle = [
    'Get started by filling out your details',
    'Create the admin user for the transporter',
    'Create KAMs for transporter',
  ];

  console.log(myvalue);
  const stepsContent = [
    () => (
      <TransporterDetails
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    // Step 2 content
    () => (
      <CreateAdmin
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    // Step 3 content
    () => (
      <AddKam
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#F1F3F4',
      }}
    >
      <Grid container p={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <StyledMTopContainer container>
            <Box
              onClick={() => navigate('/acculead-secured/dashboard')}
              sx={{ cursor: 'pointer' }}
            >
              <img src={AcculeadImage} alt="logo" />
            </Box>
            <Box>
              <Button
                sx={{ mx: 2, textTransform: 'capitalize' }}
                onClick={() => navigate('/acculead-secured/transeporterdata')}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                sx={{ textTransform: 'capitalize' }}
                startIcon={<img src={Logout} alt="logout" />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </StyledMTopContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TitleContainerBox>
            <Typography variant="h3" sx={{ textAlign: 'center' }}>
              {stepLabel[currentStep]}
            </Typography>
            <Typography
              sx={{
                marginBottom: '24px',
                textAlign: 'center !important',
                fontWeight: '400',
                fontSize: '16px',
                color: '#8A919D',
              }}
              mt={1}
            >
              {subTitle[currentStep]}
            </Typography>
          </TitleContainerBox>
        </Grid>

        <StyledMedBox item xs={0} sm={3} md={2}>
          {localStorage.getItem('transp_id') ? (
            <StyledStepper activeStep={currentStep} orientation="vertical">
              {stepsContent.map((_, index) => (
                <Step key={index} onClick={() => handleStepClick(index)}>
                  <StepLabel>{stepLabel[index]}</StepLabel>
                </Step>
              ))}
            </StyledStepper>
          ) : (
            <StyledStepperDisabled
              activeStep={currentStep}
              orientation="vertical"
            >
              {stepsContent.map((_, index) => (
                <Step key={index}>
                  <StepLabel>{stepLabel[index]}</StepLabel>
                </Step>
              ))}
            </StyledStepperDisabled>
          )}
        </StyledMedBox>
        <Grid item xs={12} sm={9} md={10}>
          <StyledSmBox sx={{ mt: 0, mb: 2 }}>
            <Chip
              label={`Step ${currentStep + 1}`}
              sx={{ background: '#043E97', color: '#fff' }}
            />
          </StyledSmBox>

          {stepsContent[currentStep]()}
        </Grid>
      </Grid>
    </Box>
  );
}
