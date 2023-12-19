import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
} from "@mui/material";

function AddEwayBillModal({
  isOpen,
  onClose,
  ewayBillNumber,
  setEwayBillNumber,
  invoiceDate,
  handleEwayBillAdd,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="customCardheader">
        <Typography variant="h4">Add eWay details</Typography>
      </div>
      <DialogContent>
        <TextField
          label="eWay Bill Number"
          value={ewayBillNumber}
          onChange={(e) => setEwayBillNumber(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="eWay Bill Time"
          type="datetime-local"
          fullWidth
          sx={{ mb: 2 }}
          value={invoiceDate}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleEwayBillAdd}>
          Submit
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEwayBillModal;
