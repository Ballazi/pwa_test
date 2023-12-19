import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Grid,
  Box,
  styled,
  Chip,
} from "@mui/material";
import ShipperDeatils from "../../components/register/ShipperDeatils";
import Regions from "../../components/register/Regions";
import Branches from "../../components/register/Branches";
import Users from "../../components/register/Users";
import TransporterRegister from "../../components/register/TransporterRegister/TransporterRegister";
import Segments from "../../components/register/Segments";
import Settings from "../../components/register/Settings";
import CreateAdmin from "../../components/register/CreateAdmin";
import NewCluster from "../../components/register/NewCluster";
import AcculeadImage from "../../assets/Acculead.svg";
import AddAccess from "../../components/register/add-access/AddAccess";

const StyledMedBox = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledSmBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "10px",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const StyledStepper = styled(Stepper)(() => ({
  "& .MuiStepIcon-root.Mui-completed": {
    color: "#CCEBD5 !important",
    borderColor: "red",
  },
}));

const UserRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [myvalue, setMyValue] = useState([]);

  const handleNext = () => {
    if (currentStep !== stepsContent.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
  };

  const stepLabel = [
    "Shipper Details",
    "Create Admin",
    "Regions",
    "Cluster",
    "Branches",
    "Roles and Access",
    "Users",
    "Transporters",
    "Segments",
    "Settings",
  ];

  const stepsContent = [
    () => (
      <ShipperDeatils
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    () => (
      <CreateAdmin
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    () => (
      <Regions
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    () => (
      <NewCluster
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    () => (
      <Branches
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    () => <AddAccess handlePrevious={handlePrevious} handleNext={handleNext} />,
    () => (
      <Users
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    () => (
      <TransporterRegister
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    () => (
      <Segments
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
    () => (
      <Settings
        value={setMyValue}
        currentStep={currentStep}
        stepsContent={stepsContent}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    ),
  ];
  const navigatHOme = () => {
    if (localStorage.getItem("user_type") === "shp") {
      window.location = "/shipper-secured/dashboard";
    } else if (localStorage.getItem("user_type") === "acu") {
      window.location = "/acculead-secured/dashboard";
    }
  };
  return (
    <Grid container sx={{ background: "#F1F3F4" }}>
      <StyledMedBox
        item
        xs={0}
        sm={3}
        md={2}
        sx={{ p: 2, height: "100vh", overflowY: "scroll", background: "#fff" }}
        style={{ cursor: "pointer" }}
      >
        <Box sx={{ lineHeight: "2px", mb: 3 }}>
          <img
            onClick={() => {
              navigatHOme();
            }}
            src={AcculeadImage}
            alt="logo"
          />
        </Box>
        <StyledStepper
          style={{ cursor: "pointer" }}
          activeStep={currentStep}
          orientation="vertical"
        >
          {stepsContent.map((_, index) => (
            <Step style={{ cursor: "pointer" }} key={index}>
              {localStorage.getItem("type") === "view" ? (
                <StepLabel onClick={() => handleStepClick(index)}>
                  {stepLabel[index]}
                </StepLabel>
              ) : localStorage.getItem("type") === "create" ? (
                <StepLabel>{stepLabel[index]}</StepLabel>
              ) : null}
            </Step>
          ))}
        </StyledStepper>
      </StyledMedBox>
      <Grid item xs={12} sm={9} md={10}>
        <StyledSmBox sx={{ mt: 2 }}>
          <Chip
            label={`Step ${currentStep + 1}`}
            sx={{ background: "#043E97", color: "#fff" }}
          />
        </StyledSmBox>
        {stepsContent[currentStep]()}
      </Grid>
    </Grid>
  );
};

export default UserRegister;
