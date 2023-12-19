import { useState } from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import BarChartDashboard from "./BarChart/BarChart";
import { Autocomplete, TextField } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";

const DUMMY_DATA = [
  { name: "Total", value: 144492, color: "#ff9b6a" },
  { name: "Participant", value: 144489, color: "#00a3e9" },
  { name: "Selected", value: 37050, color: "#c1f4fe" },
  { name: "Failed", value: 1622, color: "#c6c6c6" },
];

const options = ["Option 1", "Option 2", "Option 3"];

export default function TransporterAnalysisChart() {
  const [inputValue, setInputValue] = useState("");
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
        <Typography sx={{ fontWeight: 600 }}>Transporter Analysis</Typography>
      </Box>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} md={12} sx={{ mt: 1 }}>
          <Autocomplete
            freeSolo
            options={options}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <SearchIcon
                      onClick={() => {
                        // Handle the search action
                        console.log("Search action triggered");
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  ),
                }}
              />
            )}
          />
        </Grid>
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

      <BarChartDashboard data={DUMMY_DATA} />
    </Paper>
  );
}
