import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import GoogleMapEpod from "../gogoleMapEpod/GoogleMapEpod";
import {
  viewItemwiseEpod,
  viewInovoicewise,
} from "../../../../api/delivery/epod";
import { openSnackbar } from "../../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import { submitEpod } from "../../../../api/delivery/epod";
import {
  fleetDetails,
  fleetTrackReport,
} from "../../../../api/tracking/tracking";
import { object } from "yup";
function EpodDetails({ openModal, handleCloseModal, selectedRow }) {
  // Sample timeline data
  const [mapData, setMapData] = useState({});
  const [trackReport, setTrackReport] = useState([]);
  const timelineData = [
    {
      id: 1,
      timestamp: "2023-08-22 10:00 AM",
      event: "Stopped at Saltlake Sector IV",
    },
    {
      id: 2,
      timestamp: "2023-08-22 11:30 AM",
      event: "Turned at Chingrighata",
    },
    { id: 3, timestamp: "2023-08-22 1:00 PM", event: "Arrived at Park Circus" },
    { id: 4, timestamp: "2023-08-22 2:30 PM", event: "Departed from Howrah" },
    { id: 5, timestamp: "2023-08-22 3:45 PM", event: "Stopped for Fueling" },
    { id: 6, timestamp: "2023-08-22 5:00 PM", event: "Reached Rest Area" },
    // Add more timeline events
  ];

  const [itemDetails, setItemDetails] = useState([]);
  const dispatch = useDispatch();

  async function mapAttributes() {
    console.log("row in epod", selectedRow);
    var res = await fleetDetails(selectedRow.id);
    if (res.data.success === true) {
      console.log("row in epod", res.data.data.fleet_details.src_addrs);

      setMapData({
        src: res.data.data.fleet_details.src_addrs,
        dest: res.data.data.fleet_details.dest_addrs,
        src_rad: res.data.data.fleet_details.source_radius,
        arrive_rad: res.data.data.fleet_details.arrival_radius,
        trip_close: res.data.data.fleet_details.trip_close_radius,
      });
    }
    fleetTrackReport(selectedRow.id).then((res) => {
      if (res.data.success === true) {
        console.log("trackReport", res.data.data.track_report);
        var myreport = res.data.data.track_report.map((value, index) => {
          const timePart = value.created_at.split("T")[1]; // Splitting the string at 'T' and taking the second part
          const date = value.created_at.split("T")[0];
          let timeString = timePart.split(".")[0]; // Removing milliseconds
          timeString = date + " " + timeString;

          return {
            id: index + 1,
            timestamp: timeString,
            event: value.address,
          };
        });
        console.log("myreport", myreport);
        myreport.reverse();
        setTrackReport(myreport);
      }
    });
  }

  const fetchData = () => {
    console.log("selected", selectedRow);
    var updatedItemDetails;
    const queryParams = selectedRow.id;
    return viewItemwiseEpod(queryParams)
      .then((data) => {
        if (data.success === true) {
          console.log("lalalala", data);

          updatedItemDetails = data.data.map((item) => ({
            id: item.mtfitm_id, // Ensure a unique ID for each row
            billingNumber: item.billingNumber,
            material: item.item_name,
            billingItemNumber: item.billingItemNumber,
            orderedQuantity: item.dispatch_item_qty,
            receivedQuantity: item.received_item_qty, // Initialize received quantity with 0
            receivedDate: item.received_date,
            dispatch_item_qty: item.dispatch_item_qty,
            epod_file_path: item.epod_file_path,
            is_active: item.is_active,
            item_name: item.item_name,
            item_uom: item.item_uom,

            mtfitm_tracking_fleet_id: item.mtfitm_tracking_fleet_id,
            status: item.status,
          }));
          setItemDetails(updatedItemDetails);
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: data.clientMessage,
            })
          );
          setItemDetails([]);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };
  const fetchDataForInvoice = () => {
    console.log("selected", selectedRow);
    var updatedItemDetails;
    const queryParams = selectedRow.id;
    return viewInovoicewise(queryParams)
      .then((data) => {
        if (data.success === true) {
          console.log("lalalala", data);
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: data.clientMessage,
            })
          );
          setItemDetails([]);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  useEffect(() => {
    if (selectedRow !== null) {
      mapAttributes();
      // Only fetch data when selectedRow is not null
      if (selectedRow.epod_type === "invoice_wise") {
        fetchDataForInvoice();
      } else {
        fetchData();
      }
    }
  }, [selectedRow]);

  // Handle received quantity change
  const handleReceivedQuantityChange = (id, newValue) => {
    // Update itemDetails with the new received quantity value
    const updatedItemDetails = itemDetails.map((item) =>
      item.id === id ? { ...item, receivedQuantity: newValue } : item
    );
    setItemDetails(updatedItemDetails);
  };
  const prepareDataForSubmission = () => {
    const formattedData = itemDetails.map((item) => ({
      mtfitm_id: item.id, // Use the unique ID from the row
      received_item_qty: parseInt(item.receivedQuantity),
      dispatch_item_qty: item.dispatch_item_qty,
      epod_file_path: item.epod_file_path,
      is_active: item.is_active,
      item_name: item.item_name,
      item_uom: item.item_uom,

      mtfitm_tracking_fleet_id: item.mtfitm_tracking_fleet_id,
      status: item.status,
      is_updated: item.receivedQuantity !== 0, // Check if receivedQuantity is not 0
    }));
    console.log(formattedData);
    return formattedData;
  };

  // Handle submit button click
  const handleSubmit = () => {
    // Prepare the data for submission
    const formattedData = prepareDataForSubmission();

    // Log the formatted data to the console
    console.log("Formatted Data for Submission:", formattedData);
    return submitEpod(formattedData)
      .then((data) => {
        if (data.success === true) {
          dispatch(
            openSnackbar({
              type: "success",
              message: data.clientMessage,
            })
          );
          handleCloseModal();
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: data.clientMessage,
            })
          );
          setItemDetails([]);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const dataGridColumns = [
    { field: "billingNumber", headerName: "Billing Number", width: 150 },
    { field: "material", headerName: "Material", width: 150 },
    {
      field: "billingItemNumber",
      headerName: "Billing Item Number",
      width: 180,
    },
    { field: "orderedQuantity", headerName: "Ordered Quantity", width: 150 },
    {
      field: "receivedQuantity",
      headerName: "Received Quantity",
      width: 150,
      renderCell: (params) => (
        <TextField
          type="number"
          size="small"
          value={params.row.receivedQuantity} // Display received_quantity from the row data
          onChange={(e) =>
            handleReceivedQuantityChange(params.row.id, e.target.value)
          }
          id="outlined-basic"
          variant="outlined"
        />
      ),
    },
    { field: "receivedDate", headerName: "Received Date", width: 150 },
  ];

  return (
    <Dialog maxWidth={true} open={openModal} onClose={handleCloseModal}>
      {selectedRow !== null && (
        <div className="customCardheader">
          <Typography variant="h4">Informations</Typography>
        </div>
      )}

      <DialogContent>
        <DialogContentText>
          {selectedRow && (
            <div>
              {/* Timeline Component */}
              <Grid container spacing={2}>
                <Grid item md={8}>
                  <Card style={{ padding: "10px" }}>
                    <div className="customCardheader">
                      <Typography variant="h4">Map</Typography>
                    </div>
                    <div>
                      {Object.keys(mapData).length > 0 ? (
                        <GoogleMapEpod mapData={mapData} />
                      ) : null}
                    </div>
                  </Card>
                </Grid>
                <Grid item md={4}>
                  <Card style={{ padding: "10px" }}>
                    <div
                      className="customCardheader"
                      style={{ marginBottom: 0 }}
                    >
                      {console.log("trackreport", trackReport)}
                      <Typography variant="h4">Track Report</Typography>
                    </div>
                    <CardContent className="timelineCard">
                      <Timeline align="alternate">
                        {trackReport?.length === 0 ? (
                          <TimelineItem key={"456"}>
                            <TimelineSeparator>
                              <TimelineDot
                                color={"error"}
                                variant={"outlined"}
                              />
                            </TimelineSeparator>
                            <TimelineContent>
                              <div style={{ fontWeight: "bold" }}></div>
                              <div>Not Started</div>
                            </TimelineContent>
                          </TimelineItem>
                        ) : (
                          trackReport.map((item, index) => (
                            <TimelineItem key={item.id}>
                              <TimelineSeparator>
                                <TimelineDot
                                  color={index === 0 ? "error" : "success"}
                                  variant={
                                    index === trackReport.length - 1
                                      ? "outlined"
                                      : "default"
                                  }
                                />
                                {index < trackReport.length - 1 && (
                                  <TimelineConnector />
                                )}
                              </TimelineSeparator>
                              <TimelineContent>
                                <div style={{ fontWeight: "bold" }}>
                                  {item.timestamp}
                                </div>
                                <div>{item.event}</div>
                              </TimelineContent>
                            </TimelineItem>
                          ))
                        )}
                      </Timeline>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* DataGrid Component */}
              <Card style={{ marginTop: "20px", padding: "10px" }}>
                <div className="customCardheader">
                  <Typography variant="h4">Item Details</Typography>
                </div>
                <CardContent>
                  <div style={{ height: 300, width: "100%" }}>
                    <DataGrid
                      rows={itemDetails}
                      columns={dataGridColumns}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10, 20]}
                      checkboxSelection
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="error" onClick={handleCloseModal}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EpodDetails;
