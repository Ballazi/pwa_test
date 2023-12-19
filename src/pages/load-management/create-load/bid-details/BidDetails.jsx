import { useState, useRef } from 'react';
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import FormWrapper from "../../../../components/form-warpper/FormWrapper";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';






function BidDetails() {
  const [reportingTimeFrom, setReportingTimeFrom] = useState(dayjs('2023-09-17T15:30'));
  const [reportingTimeTo, setReportingTimeTo] = useState(dayjs('2023-10-17T15:30'));
  const [bidDateTime, setBidDateTime] = useState(dayjs('2023-09-17T15:30'));
  const [materialType, setMaterialType] = useState("");
  const materialTypeDropDown = useRef([
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
  const [comment, setComment] = useState("");
  const commentDropDown = useRef([
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
  const [otherComment, setOtherComment] = useState("");




  const handleMaterialTypeChange = (event) => {
    setMaterialType(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };



  return (
    <FormWrapper title="Bid Details">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <InputLabel id="demo-simple-select-disabled-label">Reporting time range<span style={{ color: "red" }}>*</span></InputLabel>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                  <DateTimePicker
                    label="From"
                    disablePast
                    format="DD/MM/YYYY hh:mm A"
                    value={reportingTimeFrom}
                    onChange={(newValue) => setReportingTimeFrom(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                  <DateTimePicker
                    label="To"
                    disablePast
                    format="DD/MM/YYYY hh:mm A"
                    value={reportingTimeTo}
                    onChange={(newValue) => setReportingTimeTo(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">Bidding date and time<span style={{ color: "red" }}>*</span></InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
              <DateTimePicker
                // label="To"
                disablePast
                format="DD/MM/YYYY hh:mm A"
                value={bidDateTime}
                onChange={(newValue) => setBidDateTime(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">Material Type<span style={{ color: "red" }}>*</span></InputLabel>
          <Select
            labelId="demo-simple-select-disabled-label"
            id="demo-simple-select-disabled"
            sx={{ width: "100%" }}
            size='small'
            value={materialType}
            // label="Select shipper"
            onChange={handleMaterialTypeChange}
          >
            {
              (materialTypeDropDown.current).map((ele, ind) => <MenuItem key={ind} value={ele.value}>{ele.label}</MenuItem>
              )
            }
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <InputLabel id="demo-simple-select-disabled-label">Comment<span style={{ color: "red" }}>*</span></InputLabel>
          <Select
            labelId="demo-simple-select-disabled-label"
            id="demo-simple-select-disabled"
            sx={{ width: "100%" }}
            size='small'
            value={comment}
            // label="Select shipper"
            onChange={handleCommentChange}
          >
            {
              (commentDropDown.current).map((ele, ind) => <MenuItem key={ind} value={ele.value}>{ele.label}</MenuItem>
              )
            }
          </Select>
        </Grid>
        <Grid item xs={12} sm={8} md={6} lg={6}>
          <InputLabel id="demo-simple-select-disabled-label">Other</InputLabel>
          <TextField
            size='small'
            fullWidth
            multiline
            placeholder='Type here'
            rows={6}
            value={otherComment}
            onChange={e => setOtherComment(e.target.value)}
          />
        </Grid>
      </Grid>
    </FormWrapper>
  );
}

export default BidDetails;
