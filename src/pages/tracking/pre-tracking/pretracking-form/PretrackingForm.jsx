import React, { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, Container, Grid, TextField, Typography, Button, Select, MenuItem, DialogActions } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import '../preTracking.css'

export default function PretrackingForm({ selectedRow, open, onClose }) {
  const fileInputRef = useRef(null);
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth={true}>
      <DialogTitle>Vehicle Information</DialogTitle>
      <Button
        sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '25px' }}
      >Add more vehicles</Button>
      <DialogContent>
        {selectedRow && (
            <>
             <Grid container >
              <Grid item md={3} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Vehicle Number:
                      <span className="mandatory-star">*</span>

                    </label>
                    <TextField
                      size="small"
                      required
                      type='number'
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
              </Grid>
             
              <Grid item md={3} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Driver's Contact Number:
                      <span className="mandatory-star">*</span>
                    </label>
                    <div style={{ display: "flex" }}>
                      <TextField
                        // style={{ flex: "80%", marginRight: "5%" }}
                        size="small"
                        required
                        type='text'
                        variant="outlined"
                        fullWidth
                      />
                      {/* <div style={{ flex: "20%", textAlign: "end" }}>
                        <Button variant="outlined" >OTP</Button>
                      </div> */}

                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item md={3} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Alternative Contact Number:

                    </label>
                    <div style={{ display: "flex" }}>
                      <TextField
                        // style={{ flex: "80%", marginRight: "5%" }}
                        size="small"
                        required
                        type='text'
                        variant="outlined"
                        fullWidth
                      />
                      {/* <div style={{ flex: "20%", textAlign: "end" }}>
                        <Button variant="outlined" >OTP</Button>
                      </div> */}

                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item md={3} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Network Service Provider:
                      <span className="mandatory-star">*</span>
                    </label>
                    <Select size="small" required>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </div>
                </div>
              </Grid>

              <Grid item md={12} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <Typography
                      variant="body">
                      Vehicle Doc:
                      <span className="mandatory-star">*</span>

                    </Typography>
                    <div className="customDropBox">
                      <div>
                      <Typography
                      variant="body">
                      Upload Vehicle Doc here.
                    

                    </Typography>
                        </div>
                        <div>
                        <Button onClick={handleFileUpload}>
                  
                  
                  <FileUploadIcon />
               
             
                  </Button>
                        </div>
                   
                  
                    </div>
                   
                    <input
                      required
                      ref={fileInputRef}
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </Grid>
            
            </Grid>
            <Grid container>
              <Grid item md={3} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Check-In Time:
                      <span className="mandatory-star">*</span>
                    </label>
                    <TextField
                      size="small"
                      required
                      type='datetime-local'
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
              </Grid>
              <Grid item md={3} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Check-Out Time:
                      <span className="mandatory-star">*</span>
                    </label>
                    <TextField
                      size="small"
                      required
                      type='datetime-local'
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
              </Grid>
              <Grid item md={3} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Loading Initiation Time:
                      <span className="mandatory-star">*</span>

                    </label>
                    <TextField
                      size="small"
                      required
                      type='datetime-local'
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
              </Grid>
              <Grid item md={3} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Loading Completion Time:
                      <span className="mandatory-star">*</span>
                    </label>
                    <TextField
                      size="small"
                      required
                      type='datetime-local'
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
              </Grid>
              <Grid item md={12} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <Typography
                      variant="body">
                      Company Doc:
                      <span className="mandatory-star">*</span>
                    </Typography>
                    <Button onClick={handleFileUpload}>
                      <FileUploadIcon />
                    </Button>
                    <input
                      required
                      ref={fileInputRef}
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </Grid>

              <Grid item md={6} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Material Details:
                      <span className="mandatory-star">*</span>
                    </label>
                    <Select size="small" required>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </div>
                </div>
              </Grid>
              <Grid item md={6} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>UOM:
                      <span className="mandatory-star">*</span>
                    </label>
                    <div style={{ display: "flex" }}>
                      <TextField
                        style={{ flex: "80%", marginRight: "5%" }}
                        size="small"
                        required
                        type='text'
                        variant="outlined"
                      />
                      <div style={{ flex: "20%", textAlign: "end" }}>
                        <Button variant="outlined" >Add</Button>
                      </div>

                    </div>


                  </div>
                </div>
              </Grid>
              {/* <Grid item md={6} xs={12}>
                <div className="labeled-textfield">
                  <div className="label-and-input">
                    <label>Make of the GPS Device:
                      <span className="mandatory-star">*</span>
                    </label>
                    <TextField
                      size="small"
                      required
                      type='text'
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </div>
              </Grid> */}
            </Grid>
            <Grid container>
              <Grid item md={12} >
                {/* map */}
              </Grid>
            </Grid>
            </>
           
       
        )}
      </DialogContent>
      <DialogActions>
        <div className="buttons">
          <Button variant="contained">Submisst</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </div>
      </DialogActions>

    </Dialog>
  );
}
