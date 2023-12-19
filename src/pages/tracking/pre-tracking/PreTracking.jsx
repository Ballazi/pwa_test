import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Typography,
  Box,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PreTrackingFormComponent from "./pretracking-form/preTrackingFormData";
import {
  viewPretrackingDraft,
  viewDetails,
  addNewInvoice,
  viewItemDetails,
} from "../../../api/pre-tracking/DraftTable";

export default function PreTracking() {
  const columns = [
    { field: "id", headerName: "Tracking ID", width: 150 },
    { field: "transporter", headerName: "Transporter Name", width: 150 },
    { field: "source", headerName: "Source", width: 150 },
    { field: "destination", headerName: "Destination", width: 150 },
    { field: "reportingDate", headerName: "Reporting Date", width: 150 },
    { field: "noOfVehicle", headerName: "No. of Vehicles", width: 150 },
    { field: "dirverName", headerName: "Driver Name", width: 150 },
    { field: "driverContact", headerName: "Driver Contact", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div>
          <Tooltip title="View/Edit Invoices">
            <IconButton
              onClick={() => handleViewEditClick(params.row)}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={() => handleAddMaterial(params.row)}
            aria-label="add"
          >
            <AddIcon />
          </IconButton>
        </div>
      ),
    },
  ];
  const handleAddMaterial = (row) => {
    setSelectedRow(row);
    const payload = {
      tracking_fleet_id: row.id,
    };

    return viewItemDetails(payload)
      .then((res) => {
        if (res.data.success === true) {
          // setEditedInvoices(res.data.data);
        } else {
          // Handle the error
        }
      })
      .catch((error) => {
        // Handle the error
      });
    setOpenMaterialModal(true);
  };

  const handleAddNewMaterial = () => {
    setEditedMaterials([...editedMaterials, newMaterial]);
    setNewMaterial({
      itemName: "",
      uom: "",
      quantity: 0,
    });
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedInvoices, setEditedInvoices] = useState([]);
  const [draftData, setDraftData] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    invoice_no: "",
    invoice_amount: 0,
    invoice_date: "",
  });
  const [openMaterialModal, setOpenMaterialModal] = useState(false);
  const [editedMaterials, setEditedMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    itemName: "",
    uom: "",
    quantity: 0,
  });
  const fetchdata = () => {
    return viewPretrackingDraft()
      .then((res) => {
        if (res.data.success === true) {
          const data = res.data.data.map((item) => ({
            id: item.tf_id,
            transporter: item.tf_transporter_id,
            source: item.src_addrs,
            destination: item.dest_addrs,
            reportingDate: item.gate_in,
            noOfVehicle: item.fleet_no,
            dirverName: item.driver_name,
            driverContact: item.driver_number,
          }));
          setDraftData(data);
        } else {
          // Handle the error
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handleViewEditClick = (row) => {
    setSelectedRow(row);
    setOpenEditModal(true);

    const payload = {
      tracking_fleet_id: row.id,
    };

    return viewDetails(payload)
      .then((res) => {
        if (res.data.success === true) {
          setEditedInvoices(res.data.data);
        } else {
          // Handle the error
        }
      })
      .catch((error) => {
        // Handle the error
      });
  };

  const handleEditInvoiceField = (invoiceId, field, value) => {
    const updatedInvoices = editedInvoices.map((invoice) => {
      if (invoice.mtfi_id === invoiceId) {
        return {
          ...invoice,
          [field]: value,
          is_updated: true,
        };
      }
      return invoice;
    });
    setEditedInvoices(updatedInvoices);
  };

  const handleAddInvoice = () => {
    setNewInvoice({
      invoice_no: "",
      invoice_amount: 0,
      invoice_date: "",
    });
    setOpenEditModal(true);
  };

  const handleSaveInvoices = () => {
    if (selectedRow) {
      const allInvoiceData = [];
      const rowIndex = draftData.findIndex((row) => row.id === selectedRow.id);
      const updatedDraftData = [...draftData];

      if (rowIndex !== -1) {
        updatedDraftData[rowIndex].invoices = editedInvoices;
      }

      editedInvoices.forEach((invoice) => {
        allInvoiceData.push({
          mtfi_id: invoice.mtfi_id ? invoice.mtfi_id : null,
          mtfi_tracking_fleet_id: selectedRow.id,
          invoice_no: invoice.invoice_no,
          invoice_amount: invoice.invoice_amount,
          invoice_date: "2023-09-20T09:49:49.032Z",
          is_updated: invoice.is_updated || false,
        });
      });

      addNewInvoice(allInvoiceData)
        .then((res) => {
          if (res.data.success === false) {
            // Handle the error
          } else {
            // Handle success
          }
        })
        .catch((err) => console.log(err));

      setOpenEditModal(false);
      setSelectedRow(null);
    }
  };

  const handleAddNewInvoice = () => {
    setEditedInvoices([...editedInvoices, newInvoice]);
    setNewInvoice({
      invoice_no: "",
      invoice_amount: 0,
      invoice_date: "",
    });
  };

  const handleDeleteInvoice = (invoiceId) => {
    const updatedInvoices = editedInvoices.filter(
      (invoice) => invoice.id !== invoiceId
    );
    setEditedInvoices(updatedInvoices);
  };
  // Function to handle editing a material field
  const handleEditMaterialField = (index, field, value) => {
    const updatedMaterials = editedMaterials.map((material, i) => {
      if (i === index) {
        return {
          ...material,
          [field]: value,
          is_updated: true,
        };
      }
      return material;
    });
    setEditedMaterials(updatedMaterials);
  };

  // Function to handle deleting a material by index
  const handleDeleteMaterial = (index) => {
    const updatedMaterials = editedMaterials.filter((_, i) => i !== index);
    setEditedMaterials(updatedMaterials);
  };

  const handleSaveMaterials = () => {
    if (selectedRow) {
      const allMaterialData = [];
      const rowIndex = draftData.findIndex((row) => row.id === selectedRow.id);
      const updatedDraftData = [...draftData];

      if (rowIndex !== -1) {
        updatedDraftData[rowIndex].materials = editedMaterials;
      }

      editedMaterials.forEach((material, index) => {
        allMaterialData.push({
          material_id: material.material_id ? material.material_id : null,
          material_tracking_fleet_id: selectedRow.id,
          itemName: material.itemName,
          uom: material.uom,
          quantity: material.quantity,
          is_updated: material.is_updated || false,
        });
      });

      // Assuming you have an API function similar to addNewInvoice for adding materials
      // addNewMaterials(allMaterialData)
      //   .then((res) => {
      //     if (res.data.success === false) {
      //       // Handle the error
      //     } else {
      //       // Handle success
      //     }
      //   })
      //   .catch((err) => console.log(err));

      setOpenMaterialModal(false);
      setSelectedRow(null);
      console.log(allMaterialData);
    }
  };

  return (
    <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
      <PreTrackingFormComponent />
      {/* <Card sx={{ padding: "10px", marginTop: "20px" }}>
        <div className="customCardheader">
          <Typography variant="h4">Create/Add Load Table</Typography>
        </div>

        <Box sx={{ mt: 2 }}>
          <DataGrid
            rows={draftData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Box>
      </Card> */}

    </Container>
  );
}
