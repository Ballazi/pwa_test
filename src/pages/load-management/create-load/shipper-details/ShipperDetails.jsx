import { useState, useRef } from 'react';
import FormWrapper from "../../../../components/form-warpper/FormWrapper";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";

export default function ShipperDetails() {
  const [shipperName, setShipperName] = useState("ITC");
  const [branch, setBranch] = useState("936 Abc");
  const [contactNo, setContactNo] = useState("9012345678");
  const [shipper, setShipper] = useState("");
  const shipperDropDown = useRef([
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
  const [regionCluster, setRegionCluster] = useState("");
  const regionClusterDropDown = useRef([
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
  const [loadingShipperName, setLoadingShipperName] = useState("Abc");
  const [loadingShipperContactNo, setLoadingShipperContactNo] = useState("9023567230");
  const [unloadingShipperName, setUnloadingShipperName] = useState("Psdu");
  const [unloadingShipperContactNo, setUnloadingShipperContactNo] = useState("8652360926");





  const handleShipperChange = (event) => {
    setShipper(event.target.value);
  };

  const handleRegionClusterChange = (event) => {
    setRegionCluster(event.target.value);
  };


  return (
    <FormWrapper title="Shipper Details">
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={6} >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Typography >Shipper name: {shipperName} </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Typography >Branch: {branch} </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Typography >Contact no: {contactNo} </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} >
              <InputLabel id="demo-simple-select-disabled-label">Select shipper<span style={{ color: "red" }}>*</span></InputLabel>
              <Select
                labelId="demo-simple-select-disabled-label"
                id="demo-simple-select-disabled"
                sx={{ width: "100%" }}
                size='small'
                value={shipper}
                // label="Select shipper"
                onChange={handleShipperChange}
              >
                {
                  (shipperDropDown.current).map((ele, ind) => <MenuItem key={ind} value={ele.value}>{ele.label}</MenuItem>
                  )
                }
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} >
              <InputLabel id="demo-simple-select-disabled-label">Region Cluster</InputLabel>
              <Select
                labelId="demo-simple-select-disabled-label"
                id="demo-simple-select-disabled"
                sx={{ width: "100%" }}
                size='small'
                value={regionCluster}
                onChange={handleRegionClusterChange}
              >
                {
                  (regionClusterDropDown.current).map((ele, ind) => <MenuItem key={ind} value={ele.value}>{ele.label}</MenuItem>
                  )
                }
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} >
              <InputLabel id="demo-simple-select-disabled-label">Shipper loading contact<span style={{ color: "red" }}>*</span></InputLabel>
              <TextField
                size='small'
                fullWidth
                value={loadingShipperName}
                onChange={e => setLoadingShipperName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} >
              <InputLabel id="demo-simple-select-disabled-label">Contact no<span style={{ color: "red" }}>*</span></InputLabel>
              <TextField
                size='small'
                fullWidth
                value={loadingShipperContactNo}
                onChange={e => setLoadingShipperContactNo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} >
              <InputLabel id="demo-simple-select-disabled-label">Shipper unloading contact<span style={{ color: "red" }}>*</span></InputLabel>
              <TextField
                size='small'
                fullWidth
                value={unloadingShipperName}
                onChange={e => setUnloadingShipperName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} >
              <InputLabel id="demo-simple-select-disabled-label">Contact no<span style={{ color: "red" }}>*</span></InputLabel>
              <TextField
                size='small'
                fullWidth
                value={unloadingShipperContactNo}
                onChange={e => setUnloadingShipperContactNo(e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ textAlign: "center" }} >Google Map</Grid>
      </Grid>
    </FormWrapper>
  );
}
