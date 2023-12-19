import { Paper, Typography, Box, Grid } from "@mui/material";
import BarChartDashboard from "./BarChart/BarChart";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DUMMY_DATA = [
  { name: "Total", value: 1150, color: "#ff9b6a" },
  { name: "Pending", value: 105, color: "#00a3e9" },
  { name: "Confirm", value: 818, color: "#c1f4fe" },
  { name: "Cancelled", value: 214, color: "#c6c6c6" },
];

export default function LoadAnalysis() {
  return (
    <Paper
      elevation={3}
      sx={{
        px: 2,
        py: 2,
        my: 2,
      }}
    >
      <Box component="div" sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>Load Analysis</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="From date"
                size="small"
                sx={{
                  width: "100%",
                }}
                format="DD/MM/YYYY"
                slotProps={{ textField: { size: "small" } }}
                // value={toDate}
                // onChange={(newValue) => setToDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="To date"
                size="small"
                sx={{
                  width: "100%",
                }}
                format="DD/MM/YYYY"
                slotProps={{ textField: { size: "small" } }}
                // value={toDate}
                // onChange={(newValue) => setToDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid container sx={{ my: 1 }} spacing={2}>
        <Grid item xs={6} md={6}>
          <FormControl
            fullWidth
            // sx={{ minWidth: 120 }}
            size="small"
          >
            <InputLabel id="demo-select-small-label">Shipper Name</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              // value={10}
              label="Shipper Name"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Shubhajeet Shipper</MenuItem>
              <MenuItem value={20}>Balram Shipper</MenuItem>
              <MenuItem value={30}>New Shipper</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={6}>
          {" "}
          <FormControl
            fullWidth
            // sx={{ minWidth: 120 }}
            size="small"
          >
            <InputLabel id="demo-select-small-label">Branch Name</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              // value={10}
              label="Branch Name"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Kolkata</MenuItem>
              <MenuItem value={20}>Durgapur</MenuItem>
              <MenuItem value={30}>Siliguri</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <BarChartDashboard data={DUMMY_DATA} />
    </Paper>
  );
}
