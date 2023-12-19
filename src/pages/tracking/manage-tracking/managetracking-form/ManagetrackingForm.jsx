import React, { useEffect, useState } from "react";
import GoogleMapView from "./GoogleMapView";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import RemoveRoadIcon from "@mui/icons-material/RemoveRoad";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import ReportOffIcon from "@mui/icons-material/ReportOff";
import {
  fleetDetails,
  alertDetails,
  fleetTrackReport,
  allDetailsFleet,
} from "../../../../api/tracking/tracking";
import moment from "moment";
const ManagetrackingForm = ({ selectedRow, open, onClose, row }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [longDelayAlert, setLongDelayAlert] = useState(false);
  const [ShortDelayAlert, setShortDelayAlert] = useState(false);
  const [diverstionalert, setDiverstionAlert] = useState(false);
  const [googleFleet, setGoogleFleet] = useState([]);
  const [allAlert, setAllAlert] = useState(false);
  const [alertType, setAlertType] = useState(0);
  const [allAlertDetails, setAllAlertDetails] = useState([]);
  const [trackReport, setTrackReport] = useState([]);
  const [dataToPreview, setDataToPreview] = useState([]);
  const [allAllowedAlerts, setAllAllowedAlerts] = useState([]);
  const [longHoldAlert, setLongHoldAlert] = useState(false);
  const [shortHoldAlert, setShortHoldAlert] = useState(false);

  const handleButtonClick = (buttonId) => {
    console.log("alert button clicked");
    setAlertType(buttonId);

    setSelectedButton(buttonId);
  };
  const handleDialogClose = () => {
    onClose();
    setSelectedButton(null);
  };

  useEffect(() => {
    console.log("in the alertype");
    switch (alertType) {
      case 1:
        setLongDelayAlert(true);
        setShortDelayAlert(false);
        setDiverstionAlert(false);
        setAllAlert(false);
        setLongHoldAlert(false);
        break;
      case 2:
        setLongDelayAlert(false);
        setShortDelayAlert(true);
        setDiverstionAlert(false);
        setAllAlert(false);
        setLongHoldAlert(false);
        break;
      case 3:
        setLongDelayAlert(false);
        setShortDelayAlert(false);
        setDiverstionAlert(true);
        setAllAlert(false);
        setLongHoldAlert(false);
        break;
      case 4:
        setLongDelayAlert(false);
        setShortDelayAlert(false);
        setDiverstionAlert(false);
        setAllAlert(true);
        setLongHoldAlert(false);
        break;
      case 5:
        setLongDelayAlert(false);
        setShortDelayAlert(false);
        setDiverstionAlert(false);
        setAllAlert(false);
        setLongHoldAlert(false);
        break;
      case 6:
        setLongDelayAlert(false);
        setShortDelayAlert(false);
        setDiverstionAlert(false);
        setAllAlert(false);
        setLongHoldAlert(true);
        break;
      case 7:
        setLongDelayAlert(false);
        setShortDelayAlert(false);
        setDiverstionAlert(false);
        setAllAlert(false);
        setLongHoldAlert(false);
        setShortHoldAlert(true);

      default:
        break;
    }
  }, [alertType]);
  console.log("Component rendered");
  useEffect(() => {
    console.log("roow", selectedRow);
    setGoogleFleet([]);
    setDataToPreview([]);
    setTrackReport([]);
    setAllAlertDetails([]);
    if (selectedRow !== null) {
      allDetailsFleet(selectedRow.id).then((res) => {
        if (res.data.success === true) {
          console.log("details", res.data.data);
          setDataToPreview(res.data.data);
        }
      });
      fleetDetails(selectedRow.id).then((res) => {
        if (res.data.success === true) {
          console.log("roow", res.data.data);
          setGoogleFleet([res.data.data["fleet_details"]]);
        }
      });
      alertDetails(selectedRow.id).then((res) => {
        if (res.data.success === true) {
          console.log("all alert", res.data.data);
          setAllAlertDetails([res.data.data["all_alert"]]);
          setAllAllowedAlerts([res.data.data["allowed_alerts"]]);
        }
      });
      fleetTrackReport(selectedRow.id).then((res) => {
        if (res.data.success === true) {
          console.log("trackReport", res.data.data.track_report);
          var myreport = res.data.data.track_report.map((value, index) => {
            // const timePart = value.created_at.split("T")[1]; // Splitting the string at 'T' and taking the second part
            // const date = value.created_at.split("T")[0];
            // let timeString = timePart.split(".")[0]; // Removing milliseconds
            let timeString = "";
            if (value.updated_at) {
              timeString = moment(
                moment(value.updated_at).utcOffset("+05:30")._d
              ).format("LLLL");
            } else {
              timeString = moment(
                moment(value.created_at).utcOffset("+05:30")._d
              ).format("LLLL");
            }

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
  }, [selectedRow]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={true} fullWidth>
      <div className="customCardheader" style={{ marginBottom: "0px" }}>
        <Typography variant="h4">
          {" "}
          {dataToPreview.status === "completed" ? (
            <>This tracking has been completed</>
          ) : (
            <>Your truck is on the way</>
          )}
        </Typography>
        <Typography variant="h5">
          Tracking Id: {`TC${dataToPreview.tf_id?.slice(-5)}`}{" "}
        </Typography>
        {/* <Typography variant="span">Shipper Name: Shipper Kolkata , </Typography>
        <Typography variant="span">Branch Name:Kolkata Branch , </Typography> */}
        &nbsp;
        <Typography variant="span">
          Driver's Contact Number: {dataToPreview.driver_number}&nbsp; ,
          &nbsp;&nbsp;&nbsp;
        </Typography>
        <Typography variant="span">
          Vehicle Number: {dataToPreview.fleet_no} , &nbsp;&nbsp;&nbsp;
        </Typography>
        <Typography variant="span">
          ETA:
          {dataToPreview.estimated_time
            ? dataToPreview.estimated_time
            : " "}{" "}
          &nbsp;&nbsp;&nbsp;
        </Typography>
      </div>
      <DialogContent sx={{ width: "100%" }}>
        <Grid container spacing={1}>
          <Grid item md={9} sm={12}>
            <Card style={{ padding: "10px" }}>
              <div className="customCardheader" style={{ marginBottom: 0 }}>
                <Typography variant="h4"> Google Map</Typography>
              </div>
              <CardContent>
                {selectedRow && googleFleet.length > 0 && (
                  <GoogleMapView
                    longDelayAlert={longDelayAlert}
                    ShortDelayAlert={ShortDelayAlert}
                    diverstionalert={diverstionalert}
                    shortHoldAlert={longHoldAlert}
                    allAlert={allAlert}
                    fleet={googleFleet}
                    alertDetails={allAlertDetails}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} sm={12}>
            <Card style={{ padding: "10px" }}>
              <div className="customCardheader">
                <Typography variant="h4">Track Report</Typography>
              </div>

              <CardContent className="timelineCard">
                <Timeline align="alternate">
                  {trackReport?.length === 0 ? (
                    <TimelineItem key={"456"}>
                      <TimelineSeparator>
                        <TimelineDot color={"error"} variant={"outlined"} />
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

            <Card style={{ padding: "10px", marginTop: "10px" }}>
              <div className="customCardheader" style={{ marginBottom: 0 }}>
                <Typography variant="h4">Alerts</Typography>
              </div>
              <CardContent className="colorCodeCard">
                {console.log("allowed alerts", allAllowedAlerts)}
                {allAllowedAlerts[0]?.length > 0 && (
                  <div>
                    {allAllowedAlerts[0].includes("delay_alert") && (
                      <>
                        <Button
                          sx={{
                            backgroundColor:
                              selectedButton === 1 ? "white" : "#f25555",
                            color: selectedButton === 1 ? "white" : "inherit",
                          }}
                          variant="outlined"
                          startIcon={<AccessTimeIcon />}
                          onClick={() => handleButtonClick(1)}
                        >
                          {allAlertDetails.length > 0
                            ? `${allAlertDetails[0]?.delay["delay_long"].length} Long Delay Alert`
                            : "Long Delay Alert"}
                        </Button>
                        <Button
                          sx={{
                            backgroundColor:
                              selectedButton === 2 ? "white" : "#f2f235",
                            color: selectedButton === 2 ? "white" : "inherit",
                          }}
                          variant="outlined"
                          startIcon={<AccessAlarmsIcon />}
                          onClick={() => handleButtonClick(2)}
                        >
                          {allAlertDetails.length > 0
                            ? `${allAlertDetails[0]?.delay["delay_short"].length} Short Delay Alert`
                            : "Short Delay Alert"}
                        </Button>
                      </>
                    )}
                    {allAllowedAlerts[0].includes("deviation_alert") && (
                      <>
                        <Button
                          sx={{
                            backgroundColor:
                              selectedButton === 3 ? "white" : "#fe2fec",
                            color: selectedButton === 3 ? "white" : "inherit",
                          }}
                          variant="outlined"
                          startIcon={<RemoveRoadIcon />}
                          onClick={() => handleButtonClick(3)}
                        >
                          {allAlertDetails.length > 0
                            ? `${allAlertDetails[0]?.deviation["deviation_long"].length} Long Deviation Alert`
                            : "Long Deviation Alert"}
                        </Button>
                        <Button
                          sx={{
                            backgroundColor:
                              selectedButton === 3 ? "white" : "#fe2fec",
                            color: selectedButton === 3 ? "white" : "inherit",
                          }}
                          variant="outlined"
                          startIcon={<RemoveRoadIcon />}
                          onClick={() => handleButtonClick(3)}
                        >
                          {allAlertDetails.length > 0
                            ? `${allAlertDetails[0]?.deviation["deviation_short"].length} Short Deviation Alert`
                            : "Short Deviation Alert"}
                        </Button>
                      </>
                    )}
                    {allAllowedAlerts[0].includes("hold_alert") && (
                      <>
                        <Button
                          sx={{
                            backgroundColor:
                              selectedButton === 6 ? "white" : "#fe2fec",
                            color: selectedButton === 6 ? "white" : "inherit",
                          }}
                          variant="outlined"
                          startIcon={<RemoveRoadIcon />}
                          onClick={() => handleButtonClick(6)}
                        >
                          {allAlertDetails.length > 0 ? (
                            <>
                              {allAlertDetails[0]?.hold["hold_long"].length}{" "}
                              long hold Alert
                            </>
                          ) : (
                            <>long hold Alert</>
                          )}
                        </Button>
                        <Button
                          sx={{
                            backgroundColor:
                              selectedButton === 6 ? "white" : "#fe2fec",
                            color: selectedButton === 6 ? "white" : "inherit",
                          }}
                          variant="outlined"
                          startIcon={<RemoveRoadIcon />}
                          onClick={() => handleButtonClick(6)}
                        >
                          {allAlertDetails.length > 0 ? (
                            <>
                              {allAlertDetails[0]?.hold["hold_short"].length}{" "}
                              short hold Alert
                            </>
                          ) : (
                            <>short hold Alert</>
                          )}
                        </Button>
                      </>
                    )}
                    {/* Add similar checks for other alert types */}
                  </div>
                )}
                {allAllowedAlerts.length > 0 && (
                  <>
                    <Button
                      sx={{
                        backgroundColor:
                          selectedButton === 4 ? "white" : "#2dcfc2",
                        color: selectedButton === 4 ? "white" : "inherit",
                      }}
                      variant="outlined"
                      startIcon={<CrisisAlertIcon />}
                      onClick={() => handleButtonClick(4)}
                    >
                      All Alert
                    </Button>
                    <Button
                      sx={{
                        backgroundColor:
                          selectedButton === 5 ? "white" : "#EAE2B7",
                        color: selectedButton === 5 ? "white" : "inherit",
                      }}
                      variant="outlined"
                      startIcon={<ReportOffIcon />}
                      onClick={() => handleButtonClick(5)}
                    >
                      Clear All Alert
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent={"center"} alignItems={"center"}>
          <Grid item md={4}>
            <div
              style={{
                display: "flex",
                marginBottom: "10px",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  background: "#1AA16B",
                  position: "relative",
                }}
              ></div>
              <Typography sx={{ ml: 1 }}>Google recommended route</Typography>
            </div>
          </Grid>
          <Grid item md={6}>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  background: "#1A59A1",
                  position: "relative",
                }}
              ></div>
              <Typography style={{ marginLeft: "5px" }}>
                {" "}
                Route Remaining (Google recommended)
              </Typography>
            </div>
          </Grid>
          <Grid item md={2}>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  background: "#FF0000",
                  position: "relative",
                }}
              ></div>
              <Typography sx={{ ml: 1 }}>Diverted route</Typography>
            </div>
          </Grid>
        </Grid>
        <Button variant="contained" endIcon={<ShareIcon />}>
          Share
        </Button>

        <Button onClick={handleDialogClose} variant="contained" color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagetrackingForm;
