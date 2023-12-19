import { useState } from "react";
import {
  Typography,
  TextField,
  Box,
  Autocomplete,
  Chip,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TitleContainer from "../card/TitleContainer";
import RegisterCard from "../card/RegisterCard";
import ContentWrapper from "../form-warpper/ContentWrapper";
import FooterWrapper from "../form-warpper/FooterWrapper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { requiredValidatorOfArray } from "../../validation/common-validator";
import { openSnackbar } from "../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";

const schema = yup.object().shape({
  roleAccess: requiredValidatorOfArray("Transporters"),
});

export default function Roles({
  // value,
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
}) {
  const {
    handleSubmit,
    setValue,
    // getValues,
    // reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  // const [roleAccessOptions, setRoleAccessOptions] = useState([];)
  const [selectedRoleAccess, setSelectedRoleAccess] = useState([]);
  const roleAccessOptions = [
    {
      label: "Admin1",
      value: "admin1",
    },
    {
      label: "Admin2",
      value: "admin2",
    },
    {
      label: "Admin3",
      value: "admin3",
    },
  ];

  const handleSelectedRoleAccessChange = (newValue) => {
    setSelectedRoleAccess(newValue);
  };

  const handleRoleAccessChipDelete = (data) => {
    const filteredData = selectedRoleAccess.filter(
      (ele) => ele.label !== data.label
    );
    setSelectedRoleAccess(filteredData);
    setValue("roleAccess", [...filteredData]);
  };

  const viewRoleAccessData = (data) => {
    console.log("data...", data);
  };

  const saveAndContinueHandler = () => {
    handleNext();
  };

  return (
    <form onSubmit={handleSubmit(saveAndContinueHandler)}>
      <ContentWrapper>
        <TitleContainer>
          <Typography variant="h3">Roles and Access </Typography>
          <Typography style={{ marginBottom: "30px" }} variant="p">
            Set the role accesses for the organization
          </Typography>
        </TitleContainer>
        <RegisterCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h3">Role and Access</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
              <Controller
                name="roleAccess"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    limitTags={2}
                    id="regions-select"
                    options={roleAccessOptions}
                    popupIcon={<KeyboardArrowDownIcon />}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    size="small"
                    getOptionLabel={(option) => option.label}
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                      handleSelectedRoleAccessChange(newValue);
                    }}
                    value={selectedRoleAccess}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Role*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.roleAccess)}
                        helperText={errors.roleAccess?.message}
                      />
                    )}
                    renderTags={(value) => (
                      <Box>{value.length} Role Slected</Box>
                    )}
                  />
                )}
              />
            </Grid>
            {selectedRoleAccess.length !== 0 ? (
              <>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="h4">Role Selected</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Box sx={{ width: "100%" }}>
                    {selectedRoleAccess.map((segment) => (
                      <Chip
                        key={segment.value}
                        label={segment.label}
                        variant="outlined"
                        color="primary"
                        sx={{ mr: "8px", mb: 1 }}
                        onDelete={(e) => {
                          e.stopPropagation(); // Prevent the Chip from being deleted when clicking the delete icon
                          handleRoleAccessChipDelete(segment);
                        }}
                        deleteIcon={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the Chip from being deleted when clicking the delete icon
                              handleRoleAccessChipDelete(segment);
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the Chip from being deleted when clicking the Chip
                          viewRoleAccessData(segment);
                        }}
                        icon={
                          <IconButton
                            edge="start"
                            aria-label="view"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewRoleAccessData(segment);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        }
                      />
                    ))}
                  </Box>
                </Grid>
              </>
            ) : null}
          </Grid>
        </RegisterCard>
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
              type="submit"
              disabled={currentStep === stepsContent.length - 1}
            >
              Save and Continue
            </Button>
          ) : (
            <Button variant="contained" type="submit">
              Submit
            </Button>
          )}
        </FooterWrapper>
      </ContentWrapper>
    </form>
  );
}
