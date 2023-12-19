import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  TextField,
  Box,
  Radio,
  Card,
  Grid,
  Typography,
  Button,
  Autocomplete,
  Chip,
} from "@mui/material";

import * as yup from "yup";
import {
  nameValidator,
  emailValidator,
  contactNumberValidator,
  selectBranchValidator,
} from "../../../validation/common-validator";

const schema = yup.object().shape({
  name: nameValidator,
  email: emailValidator,
  contactNumber: contactNumberValidator,
  // selectBranch: selectBranchValidator,
});

export default function AddKam(props) {
  const [kamName, setKamName] = useState([]);
  const [kamEmail, setKamEmail] = useState("");
  const [kamMobNo, setKamMobNo] = useState("");
  const [kamRows, setKamRows] = useState([]);
  const [transporterRows, settransporterRows] = useState([]);
  const [displayedBranch, setDisplayedBranch] = useState([]);
  const [isAddingKam, setIsAddingKam] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [displayedRegions, setDisplayedRegions] = useState([]);
  const [kamRegionOptions, setKamRegionOptions] = useState([]);
  const [schemaArray, setSchemaArray] = useState([]);
  const [concatBranch, setConcatBranch] = useState("");
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [gatheredData, setGatheredData] = useState([]);
  const [regionOptions, setRegionOptions] = useState([
    { label: "Region 1", value: "region1" },
    { label: "Region 2", value: "region2" },
    { label: "Region 3", value: "region3" },
    { label: "Region 4", value: "region4" },
  ]);

  function collectData() {
    console.log("kam nam comin", kamName, kamEmail);
    setGatheredData((prev) => [
      ...prev,
      {
        kamName: kamName,
        kamMobNo: kamMobNo,
        kamEmail: kamEmail,
        BranchSelected: concatBranch,
      },
    ]);
    console.log("colled data", gatheredData);
  }
  const {
    handleSubmit,
    control,
    formState: { errors: errors1 },
  } = useForm({
    resolver: yupResolver(schema),

    mode: "onSubmit", // Trigger validation on submit
  });

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
    // Perform any additional actions here, like making an API call
  };
  const handleNewSaveKam = () => {
    handleSubmit(onSubmit)(); // Manually trigger form submission
  };

  useEffect(() => {
    setDisplayedRegions(selectedRegions);
  }, [selectedRegions]);

  const handleChipDelete = (deletedRegion) => {
    const updatedSelectedRegions = kamRegionOptions.filter(
      (region) => region.value !== deletedRegion.value
    );
    setKamRegionOptions([...updatedSelectedRegions]);
    // setSelectedRegions(updatedSelectedRegions);
  };
  const handleSelectedRegionsChange = (event, newValue) => {
    const newRegionsInDropdown = regionOptions.filter(
      (option) => !newValue.includes(option)
    );
    console.log("newvalue", newValue);
    setRegionOptions(newRegionsInDropdown);
    setSelectedRegions([...newValue]);
  };

  const handleSelectedBranchChange = (event, newValue) => {
    console.log("hereregion", ...newValue);
    setSelectedBranch([...newValue]);
    const branchValues = newValue.map((segment) => segment.value);
  };
  useEffect(() => {
    console.log("gatheredData", gatheredData);
    props.setNewKamDetails(gatheredData);
  }, [gatheredData]);

  return (
    <Box>
      {console.log("inside addkam")}
      <Card className="registerCard" sx={{ marginTop: "30px" }}>
        {console.log("err", errors1)}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="kamName*"
                  variant="filled"
                  fullWidth
                  value={kamName}
                  onChange={(e) => setKamName(e.target.value)}
                  error={Boolean(errors1.name)}
                  size="small"
                  helperText={errors1.name?.message}
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
                  label="Email*"
                  variant="filled"
                  fullWidth
                  value={kamEmail}
                  onChange={(e) => setKamEmail(e.target.value)}
                  size="small"
                  error={Boolean(errors1.email)}
                  helperText={errors1.email?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="contactNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contact Number*"
                  variant="filled"
                  fullWidth
                  value={kamMobNo}
                  onChange={(e) => setKamMobNo(e.target.value)}
                  size="small"
                  error={Boolean(errors1.contactNumber)}
                  helperText={errors1.contactNumber?.message}
                />
              )}
            />
          </Grid>
          {console.log("eror msg", errors1.selectBranch)}
          <Grid item xs={12} sm={6}>
            <Controller
              name="selectBranch"
              control={control}
              defaultValue={schemaArray}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={regionOptions}
                  getOptionLabel={(option) => option.label || ""}
                  value={kamRegionOptions}
                  onChange={(_, newValue) => {
                    setKamRegionOptions([...newValue]);
                    const upadtedBranch = newValue
                      .map((i) => i.label)
                      .join(" ");
                    console.log("newValue", upadtedBranch);
                    setConcatBranch(upadtedBranch);
                  }}
                  popupIcon={<KeyboardArrowDownIcon />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="select Branch"
                      variant="filled"
                      fullWidth
                      size="small"
                      error={!!errors1.selectBranch}
                      helperText={errors1.selectBranch?.message}
                    />
                  )}
                  renderTags={(value, getTagProps) => (
                    <Box>{value.length} Branchs Slected</Box>
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={{ mt: 2, mb: 3 }} variant="h4">
              Branchs selected
            </Typography>
            <Box
              sx={{
                border: "1px solid #BDCCD3",
                borderRadius: "8px",
                p: 2,
                minHeight: "48px",
              }}
            >
              {kamRegionOptions.map((region) => (
                <Chip
                  key={region.value}
                  label={region.label}
                  onDelete={() => handleChipDelete(region)}
                  variant="outlined"
                  color="primary"
                  sx={{ m: 1 }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item md={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => props.setIsAddingKam(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="button"
                // onClick={handleNewKamAdd}
                onClick={() => {
                  collectData();
                  handleSubmit(onSubmit);
                  props.setIsTableVisible(true);
                }}
                sx={{ marginLeft: 2 }}
                // disabled={isSubmitting}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
