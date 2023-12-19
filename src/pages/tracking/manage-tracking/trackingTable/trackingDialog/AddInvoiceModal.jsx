import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
} from "@mui/material";

function AddInvoiceModal({
  isOpen,
  onClose,
  invoiceNumber,
  handleInvoiceNumberChange,
  invoiceAmount,
  handleInvoiceAmountChange,
  invoiceDate,
  handleInvoiceAdd,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="customCardheader">
        <Typography variant="h4">Add Invoice Details</Typography>
      </div>
      <DialogContent>
        <TextField
          label="Invoice Number"
          value={invoiceNumber}
          onChange={handleInvoiceNumberChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Invoice Amount"
          value={invoiceAmount}
          onChange={handleInvoiceAmountChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Invoice Date"
          type="datetime-local"
          fullWidth
          value={invoiceDate}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleInvoiceAdd}>
          Submit
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddInvoiceModal;
