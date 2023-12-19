import { React, useState } from "react";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import PlaceBid from "./PlaceBId";
function PlaceBidDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
      <div className="customCardheader">
        <Typography variant="h4">Manage Trip</Typography>
      </div>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Bid Tabs"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#0080FF",
          },
          marginTop: "10px",
          marginBottom: "40px",
        }}
      >
        <Tab
          label="Upcoming"
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            borderRadius: "5px",
            color: "black",
            backgroundColor: tabValue === 0 ? "#0080FF" : "transparent",
          }}
        />
        <Tab
          label="Active"
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
          label="Selected"
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            borderRadius: "5px",
            color: "black",
            backgroundColor: tabValue === 4 ? "#0080FF" : "transparent",
          }}
        />
        <Tab
          label="Completed"
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            borderRadius: "5px",
            color: "black",
            backgroundColor: tabValue === 5 ? "#0080FF" : "transparent",
          }}
        />
        <Tab
          label="Lost"
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            borderRadius: "5px",
            color: "black",
            backgroundColor: tabValue === 6 ? "#0080FF" : "transparent",
          }}
        />
      </Tabs>
      {tabValue === 0 && <PlaceBid status="not_started" />}
      {tabValue === 1 && <PlaceBid status="active" />}
      {tabValue === 2 && <PlaceBid status="live" />}
      {tabValue === 3 && <PlaceBid status="pending" />}
      {tabValue === 4 && <PlaceBid status="selected" />}
      {tabValue === 5 && <PlaceBid status="completed" />}
      {tabValue === 6 && <PlaceBid status="lost" />}
    </Container>
  );
}

export default PlaceBidDashboard;
