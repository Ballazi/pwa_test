import { useState, useRef } from 'react';
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import FormWrapper from "../../../../components/form-warpper/FormWrapper";

export default function LoadDetails() {
  const [bidType, setBidType] = useState("");
  const bidTypeDropDown = useRef([
    {
      value: "abc",
      label: "abc"
    },
    {
      value: "asd",
      label: "asd"
    },
    {
      value: "fes",
      label: "fes"
    },
    {
      value: "des",
      label: "des"
    },
    {
      value: "sde",
      label: "sde"
    },
  ]);
  const [vehicleType, setVehicleType] = useState("");
  const vehicleTypeDropDown = useRef([
    {
      value: "abc",
      label: "abc"
    },
    {
      value: "asd",
      label: "asd"
    },
    {
      value: "fes",
      label: "fes"
    },
    {
      value: "des",
      label: "des"
    },
    {
      value: "sde",
      label: "sde"
    },
  ]);
  const [basePrice, setBasePrice] = useState("5000");
  const [capacity, setCapacity] = useState("");
  const [totalLoad, setTotalLoad] = useState("");
  const [numbOfVehicle, setNumbOfVehicle] = useState("");




  const handleBidTypeChange = (event) => {
    setBidType(event.target.value);
  };

  const handleVehicleTypeChange = (event) => {
    setVehicleType(event.target.value);
  };




  return (
    <FormWrapper title="Load Details">
      <Grid container spacing={2} >
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">Bid Type<span style={{ color: "red" }}>*</span></InputLabel>
          <Select
            labelId="demo-simple-select-disabled-label"
            id="demo-simple-select-disabled"
            sx={{ width: "100%" }}
            size='small'
            value={bidType}
            // label="Select shipper"
            onChange={handleBidTypeChange}
          >
            {
              (bidTypeDropDown.current).map((ele, ind) => <MenuItem key={ind} value={ele.value}>{ele.label}</MenuItem>
              )
            }
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">Base price<span style={{ color: "red" }}>*</span></InputLabel>
          <TextField
            size='small'
            fullWidth
            value={basePrice}
            onChange={e => setBasePrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">Vehicle Type<span style={{ color: "red" }}>*</span></InputLabel>
          <Select
            labelId="demo-simple-select-disabled-label"
            id="demo-simple-select-disabled"
            sx={{ width: "100%" }}
            size='small'
            value={vehicleType}
            // label="Select shipper"
            onChange={handleVehicleTypeChange}
          >
            {
              (vehicleTypeDropDown.current).map((ele, ind) => <MenuItem key={ind} value={ele.value}>{ele.label}</MenuItem>
              )
            }
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">Capacity (MT)<span style={{ color: "red" }}>*</span></InputLabel>
          <TextField
            size='small'
            fullWidth
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">Total load<span style={{ color: "red" }}>*</span></InputLabel>
          <TextField
            size='small'
            fullWidth
            value={totalLoad}
            onChange={e => setTotalLoad(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">No. of vehicle<span style={{ color: "red" }}>*</span></InputLabel>
          <TextField
            size='small'
            fullWidth
            value={numbOfVehicle}
            onChange={e => setNumbOfVehicle(e.target.value)}
          />
        </Grid>
      </Grid>
    </FormWrapper>
  );
}
