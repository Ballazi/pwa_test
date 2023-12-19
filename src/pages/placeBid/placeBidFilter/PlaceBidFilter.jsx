import React, { useState } from "react";
import {
  Grid,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Card,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

function PlaceBidFilter(props) {
  const [selection, setSelection] = useState("Status");
  const [statusWise, setStatusWise] = useState("live");
  const [categoryWise, setCategoryWise] = useState("selected");
  const [participation, setParticipation] = useState("participated");
  const [statusType, setStatusType] = useState("all");

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  const handleStatusWiseChange = (event) => {
    setStatusWise(event.target.value);
  };

  const handleCategoryWiseChange = (event) => {
    setCategoryWise(event.target.value);
  };

  const handleParticipationChange = (event) => {
    setParticipation(event.target.value);
  };
  const handleStatusTypeChange = (event) => {
    setStatusType(event.target.value);
  };

  const statusWiseDropDown = [
    {
      value: "not_started",
      label: "upcoming",
    },
    {
      value: "live",
      label: "live",
    },
    {
      value: "completed",
      label: "completed",
    },
  ];

  const categoryWiseDropDown = [
   
    {
      value: "selected",
      label: "selected",
    },
    {
      value: "Lost",
      label: "lost",
    },
  ];
  const handleSearchButton = () => {
    // Get the selected status and category values from the state or form controls
    const selectedStatus = statusWise
    const statusTypeValue = statusType
    const selectedCategory = categoryWise
    const participationWise = participation
    const selectedValue = selection
   
  
    // Call the onFilterSubmit function with the selected values
    props.onFilterSubmit(selectedStatus, selectedCategory,participationWise,statusTypeValue,selectedValue);
  };

  return (
    <>
      <Card style={{ padding: "10px" }}>
        <div className="customCardheader">
          <Typography variant="h4">Filter By</Typography>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <InputLabel id="demo-simple-select-disabled-label">
              Selection
            </InputLabel>
           
            <RadioGroup
            row
              aria-label="selection"
              name="selection"
              value={selection}
              onChange={handleSelectionChange}
            >
              <FormControlLabel
                value="Status"
                control={<Radio />}
                label="Status"
              />
              <FormControlLabel
                value="Category"
                control={<Radio />}
                label="Category"
              />
            </RadioGroup>
       
          </Grid>
          {selection === "Status" && (
            <>
            <Grid item xs={6} sm={3} md={3} lg={3}>
              <InputLabel id="demo-simple-select-disabled-label">
                Status Wise
              </InputLabel>
              <Select
                labelId="demo-simple-select-disabled-label"
                id="demo-simple-select-disabled"
                sx={{ width: "100%" }}
                size="small"
                value={statusWise}
                onChange={handleStatusWiseChange}
              >
                {statusWiseDropDown.map((ele, ind) => (
                  <MenuItem key={ind} value={ele.value}>
                    {ele.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
        
            <Grid item xs={6} sm={4} md={4} lg={4}>
              <InputLabel id="demo-simple-select-disabled-label">Type</InputLabel>
             
  <RadioGroup
    aria-label="participation"
    name="participation"
    row
    value={statusType}
    onChange={handleStatusTypeChange}
  >
    <FormControlLabel
      value="all"
      control={<Radio />}
      label="All"
    />
    <FormControlLabel
      value="private"
      control={<Radio />}
      label="Private"
    />
    <FormControlLabel
      value="public"
      control={<Radio />}
      label="Public"
    />
  </RadioGroup>

            </Grid>
          
              </>
          )}
          {selection === "Category" && (
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <InputLabel id="demo-simple-select-disabled-label">
                Category Wise
              </InputLabel>
              <Select
                labelId="demo-simple-select-disabled-label"
                id="demo-simple-select-disabled"
                sx={{ width: "100%" }}
                size="small"

                value={categoryWise}
                onChange={handleCategoryWiseChange}
              >
                {categoryWiseDropDown.map((ele, ind) => (
                  <MenuItem key={ind} value={ele.value}>
                    {ele.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          )}

          {categoryWise === "Lost" && (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <InputLabel id="demo-simple-select-disabled-label">Type</InputLabel>
              <div style={{ display: "flex", alignItems: "center" }}>
  <RadioGroup
    aria-label="participation"
    name="participation"
    row
    value={participation}
    onChange={handleParticipationChange}
  >
    <FormControlLabel
      value="participated"
      control={<Radio />}
      label="Participated"
    />
    <FormControlLabel
      value="notParticipated"
      control={<Radio />}
      label="Not Participated"
    />
  </RadioGroup>
</div>
            </Grid>
          )}

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container justifyContent="flex-end">
              <Grid item>
              
                  <Button
                    size="large"
                    variant="contained"
                   
                    onClick={() => handleSearchButton()}
                     // Implement the search button's click handler
                  >
                    Apply
                  </Button>
               
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default PlaceBidFilter;
