import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Card,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ManagetrackingForm from "./managetracking-form/ManagetrackingForm";
import "./manageTracking.css";
import TrackingTable from "../manage-tracking/trackingTable/TrackingTable";
import { filterFleet, trackingStatus } from "../../../api/tracking/tracking";

export default function ManageTracking() {
  const [tabValue, setTabValue] = useState(0);
  const [consentTabData, setConsentTabData] = useState([]);
  const [inProgressTabData, setInProgressTabData] = useState([]);
  const [completedTabData, setCompletedTabData] = useState([]);
  const [draftTabData, setDraftTabData] = useState([]);
  const [pendingTabData, setPendingTabData] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    console.log("tabValue", tabValue);

    fetchData(tabValue);
  }, [tabValue]);
  async function applyFilter(filter_data) {
    console.log("tabData", filter_data);
    if (tabValue === 0) {
      const filterd_draft = await filterFleet("draft", filter_data);
      if (filterd_draft.data.success) {
        setDraftTabData([...filterd_draft.data.data]);
      }
    } else if (tabValue === 1) {
      const filtered_consent_pending = await filterFleet(
        "consent_pending",
        filter_data
      );
      if (filtered_consent_pending.data.success) {
        setConsentTabData([...filtered_consent_pending.data.data]);
      }
    } else if (tabValue === 2) {
      const filtered_inprogress_data = await filterFleet(
        "inprogress",
        filter_data
      );
      if (filtered_inprogress_data.data.success) {
        setInProgressTabData([...filtered_inprogress_data.data.data]);
      }
    } else if (tabValue === 3) {
      const filtered_pendingTab_data = await filterFleet(
        "epod_pending",
        filter_data
      );
      if (filtered_pendingTab_data.data.success) {
        setPendingTabData([...filtered_pendingTab_data.data.data]);
      }
    } else if (tabValue === 4) {
      const filtered_completed_data = await filterFleet(
        "completed",
        filter_data
      );
      if (filtered_completed_data.data.success) {
        setCompletedTabData([...filtered_completed_data.data.data]);
      }
    }
  }
  const fetchData = async (tabValue) => {
    if (tabValue === 0) {
      const draftResponse = await trackingStatus("draft");
      if (draftResponse.data.success === true) {
        setDraftTabData([...draftResponse.data.data]);
      }
    } else if (tabValue === 1) {
      const consentResponse = await trackingStatus("consent_pending");
      if (consentResponse.data.success === true) {
        setConsentTabData([...consentResponse.data.data]);
      }
    } else if (tabValue === 2) {
      const inProgressResponse = await trackingStatus("inprogress");
      if (inProgressResponse.data.success === true) {
        setInProgressTabData([...inProgressResponse.data.data]);
      }
    } else if (tabValue === 4) {
      const completedResponse = await trackingStatus("completed");
      if (completedResponse.data.success === true) {
        setCompletedTabData([...completedResponse.data.data]);
      }
    } else if (tabValue === 3) {
      const pendingResponse = await trackingStatus("epod_pending");
      if (pendingResponse.data.success === true) {
        setPendingTabData([...pendingResponse.data.data]);
      }
    }
  };

  return (
    <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
      {/* <Card sx={{padding:"10px"}}> */}
      <div className="customCardheader">
        <Typography variant="h4">Manage Tracking</Typography>
      </div>

      <Tabs
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#0080FF",
          },
          marginTop: "10px",
          marginBottom: "40px",
        }}
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Bid Tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            borderRadius: "5px",
            color: tabValue === 0 ? "black" : "black",
            backgroundColor: tabValue === 0 ? "#0080FF" : "transparent",
          }}
          label="Draft"
        />
        <Tab
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            borderRadius: "5px",
            color: tabValue === 1 ? "black" : "black",
            backgroundColor: tabValue === 1 ? "#0080FF" : "transparent",
          }}
          label="Consent Pending"
        />
        <Tab
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            borderRadius: "5px",
            color: tabValue === 2 ? "black" : "black",
            backgroundColor: tabValue === 2 ? "#0080FF" : "transparent",
          }}
          label="In Progress"
        />
        <Tab
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            borderRadius: "5px",
            color: tabValue === 3 ? "black" : "black",
            backgroundColor: tabValue === 3 ? "#0080FF" : "transparent",
          }}
          label="Pending Delivery"
        />
        <Tab
          sx={{
            border: "1px solid #0080FF",
            marginRight: "5px",
            padding: "5px",
            borderRadius: "5px",
            color: tabValue === 4 ? "black" : "black", // Change active text color to red
            backgroundColor: tabValue === 4 ? "#0080FF" : "transparent",
          }}
          label="Completed"
        />
      </Tabs>

      {tabValue === 0 && (
        <TrackingTable
          status="Draft"
          data={draftTabData}
          fetchData={fetchData}
          applyFilter={applyFilter}
          tabValue={tabValue}
        />
      )}
      {tabValue === 1 && consentTabData.length >= 0 && (
        <TrackingTable
          status="Consent Pending"
          data={consentTabData}
          fetchData={fetchData}
          applyFilter={applyFilter}
          tabValue={tabValue}
        />
      )}
      {tabValue === 2 && inProgressTabData.length >= 0 && (
        <TrackingTable
          status="In Progress"
          data={inProgressTabData}
          fetchData={fetchData}
          applyFilter={applyFilter}
          tabValue={tabValue}
        />
      )}
      {tabValue === 3 && (
        <TrackingTable
          status="Pending Delivery"
          data={pendingTabData}
          fetchData={fetchData}
          applyFilter={applyFilter}
          tabValue={tabValue}
        />
      )}
      {tabValue === 4 && completedTabData.length >= 0 && (
        <TrackingTable
          status="Completed"
          data={completedTabData}
          fetchData={fetchData}
          applyFilter={applyFilter}
          tabValue={tabValue}
        />
      )}

      {/* <TransporterDetails /> */}
      {/* </Card> */}
    </Container>
  );
}
