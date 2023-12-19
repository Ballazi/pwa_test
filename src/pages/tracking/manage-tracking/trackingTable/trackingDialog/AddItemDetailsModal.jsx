import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

function AddItemDetailsModal({
  isOpen,
  onClose,
  itemName,
  setitmName,
  itemUom,
  setItemUom,
  itemQty,
  setItemQty,
  addItemDialogTitle,
  handleItemDetailsSubmit,
  itemDetails,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div style={{ marginBottom: "0px" }} className="customCardheader">
        <Typography variant="h4">{addItemDialogTitle}</Typography>
      </div>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>Enter Item Details:</Typography>
        <Grid alignContent={"center"} justifyContent={"center"} container spacing={2}>
          {/* Fields and table */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCloseAddItemDetails}>
          Submit
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddItemDetailsModal;
