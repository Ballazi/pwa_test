import { useState, useEffect } from "react";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import LoadTable from "./load-table/LoadTable";
import { decodeToken } from "react-jwt";
import { useLocation } from "react-router-dom";

export default function ViewBid() {
  const [tabValue, setTabValue] = useState(1);
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("authToken"));
  let operational_accesses = null;
  let superAdmin = false;

  if (token) {
    superAdmin = decodeToken(token)?.access?.SA;
    operational_accesses = decodeToken(token)?.access?.operational_access;
  }

  useEffect(() => {
    const transferredState = location?.state;
    console.log("transferred", transferredState);
    if (transferredState !== null) {
      window.scrollTo(0, 0);
      setTabValue(transferredState);
    } else {
      setTabValue(
        !superAdmin && operational_accesses?.show_draft === false ? 1 : 0
      );
    }
  }, [location.state]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
      <div className="customCardheader">
        <Typography variant="h4">Manage Trip</Typography>
      </div>
      <div>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="scrollable auto tabs example"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#0080FF",
            },
            marginTop: "10px",
            marginBottom: "40px",
          }}
          variant="scrollable"
          scrollButtons="off" // change auto for appear button
        >
          <Tab
            label="Draft"
            sx={{
              border: "1px solid #0080FF",
              marginRight: "5px",
              borderRadius: "5px",
              color: "black",
              backgroundColor: tabValue === 0 ? "#0080FF" : "transparent",
              display:
                !superAdmin &&
                operational_accesses?.show_draft === false &&
                "none",
            }}
          />

          <Tab
            label="Not Started"
            sx={{
              border: "1px solid #0080FF",
              marginRight: "5px",
              borderRadius: "5px",
              color: "black",
              backgroundColor: tabValue === 1 ? "#0080FF" : "transparent",
            }}
          />
          <Tab
            label="Live"
            sx={{
              border: "1px solid #0080FF",
              marginRight: "5px",
              borderRadius: "5px",
              color: "black",
              backgroundColor: tabValue === 2 ? "#0080FF" : "transparent",
            }}
          />
          <Tab
            label="Pending"
            sx={{
              border: "1px solid #0080FF",
              marginRight: "5px",
              borderRadius: "5px",
              color: "black",
              backgroundColor: tabValue === 3 ? "#0080FF" : "transparent",
            }}
          />
          <Tab
            label="Partially Confirmed"
            sx={{
              border: "1px solid #0080FF",
              marginRight: "5px",
              borderRadius: "5px",
              color: "black",
              backgroundColor: tabValue === 4 ? "#0080FF" : "transparent",
            }}
          />
          <Tab
            label="Confirmed"
            sx={{
              border: "1px solid #0080FF",
              marginRight: "5px",
              borderRadius: "5px",
              color: "black",
              backgroundColor: tabValue === 5 ? "#0080FF" : "transparent",
            }}
          />

          <Tab
            label="Completed"
            sx={{
              border: "1px solid #0080FF",
              marginRight: "5px",
              borderRadius: "5px",
              color: "black",
              backgroundColor: tabValue === 6 ? "#0080FF" : "transparent",
            }}
          />

          <Tab
            label="Cancelled"
            sx={{
              border: "1px solid #0080FF",
              marginRight: "5px",
              padding: "5px",
              borderRadius: "5px",
              color: "black", // Change active text color to red
              backgroundColor: tabValue === 7 ? "#0080FF" : "transparent",
            }}
          />
        </Tabs>
      </div>

      {tabValue === 0 && <LoadTable status="draft" />}
      {tabValue === 1 && <LoadTable status="not_started" />}
      {tabValue === 2 && <LoadTable status="live" />}
      {tabValue === 3 && <LoadTable status="pending" />}
      {tabValue === 4 && <LoadTable status="partially_confirmed" />}
      {tabValue === 5 && <LoadTable status="confirmed" />}
      {tabValue === 6 && <LoadTable status="completed" />}
      {tabValue === 7 && <LoadTable status="cancelled" />}
    </Container>
  );
}
