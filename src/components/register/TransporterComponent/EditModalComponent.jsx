import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Radio,
  Card,
  Grid,
  Typography,
  Button,
  CardContent,
  CardHeader,
  LinearProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TableFooter,
  FormControl,
  InputLabel,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Chip,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import jpgicon from "../../../../public/JPG_svg.svg";
import pdficon from "../../../../public/PDF_svg.svg";
import pngicon from "../../../../public/PNG_svg.svg";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ErrorTypography from "../../typography/ErrorTypography";
import AddKam from "./addKam";
import { FileUploader } from "./fileUplodeComponent";

import * as yup from "yup";
import {
  nameValidator,
  emailValidator,
  contactPersonValidator,
  contactNumberValidator,
  panNumberValidator,
  tanValidator,
  gstValidator,
  incorporateCertificateValidator,
  cinNumberValidator,
  tradeLicenseValidator,
  addressLine1Validator,
  addressLine2Validator,
  cityValidator,
  pinCodeValidator,
  countryValidator,
  stateValidator,
  kamNameValidator,
  roleNameValidator,
  kamMobileNoValidator,
  kamEmailValidator,
  roleContactNumberValidator,
  emailValidatorNonRequired,
  requiredValidator,
  requiredValidatorOfArray,
} from "../../../validation/common-validator";

const schema = yup.object().shape({
  name: nameValidator,
  email: emailValidator,
  contactPerson: contactPersonValidator,
  contactNumber: contactNumberValidator,
  panNumber: panNumberValidator,
  tanNumber: tanValidator,
  gstNumber: gstValidator,
  corporateAddressLine1: addressLine1Validator,
  corporateAddressLine2: addressLine2Validator,
  corporateCity: cityValidator,
  corporatePinCode: pinCodeValidator,
  corporateCountry: countryValidator,
  corporateState: stateValidator,
  billingAddressLine1: addressLine1Validator,
  billingAddressLine2: addressLine2Validator,
  billingCity: cityValidator,
  billingPinCode: pinCodeValidator,
  billingCountry: countryValidator,
  billingState: stateValidator,
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  p: 5,
  height: "90vh",
  overflowY: "scroll",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

export default function EditModalComponent(props) {
  const [newTransporterIBA, setNewTransporterIBA] = useState("");
  const [newTransporterCarrCert, setNewTransporterCarrCert] = useState("");
  const [newTransporterBankGur, setNewTransporterBankGur] = useState("");
  const [selectedTransporters, setSelectedTransporters] = useState("");
  const [selectedTransport, setSelectedTransport] = useState([]);
  const [checked, setChecked] = useState(false);
  const [logoImage, setLogoImage] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoFile, setLogoFile] = useState("");
  const [isAddingKam, setIsAddingKam] = useState(false);
  const [selectedKAM, setSelectedKAM] = useState(null);
  const [newKamDetails, setNewKamDetails] = useState([]);
  const [kamDetails, setKamDetails] = useState([]);
  const [open, setOpen] = useState(false);

  const iconList = { jpg: jpgicon, pdf: pdficon, png: pngicon };
  const [kamRows, setKamRows] = useState([]);
  const [rows, setRows] = useState([{ id: 1, values: ["", "", ""] }]);

  function handleCheck(e) {
    console.log("Hello", e.target.checked);
    if (e.target.checked) {
      const billingAddLine1 = getValues1("corporateAddressLine1");
      clearerrors1("billingAddressLine1");
      clearerrors1("billingAddressLine2");
      clearerrors1("billingCity");
      clearerrors1("billingPinCode");
      clearerrors1("billingCountry");
      clearerrors1("billingState");
      setValue1("billingAddressLine1", billingAddLine1);
      const billingAddLine2 = getValues1("corporateAddressLine2");
      setValue1("billingAddressLine2", billingAddLine2);
      const city = getValues1("corporateCity");
      setValue1("billingCity", city);
      const pinCode = getValues1("corporatePinCode");
      setValue1("billingPinCode", pinCode);
      const country = getValues1("corporateCountry");
      setValue1("billingCountry", country);
      const state = getValues1("corporateState");
      setValue1("billingState", state);
      setChecked(e.target.checked);
    } else {
      setValue1("billingAddressLine1", "");
      setValue1("billingAddressLine2", "");
      setValue1("billingCity", "");
      setValue1("billingPinCode", "");
      setValue1("billingCountry", "");
      setValue1("billingState", "");
      setChecked(e.target.checked);
    }
  }

  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };
  const [fileName, setFileName] = useState("");
  const handleSingleFile = (file) => {
    setFileName(file.name);
  };

  const handleFileLogoChange = (event) => {
    const files = Array.from(event.target.files);
    console.log("files", files);
    // const compLogo = getBase64Image(event.target.files[0]);

    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);

    reader.addEventListener("load", () => {
      localStorage.setItem("Transporter_Logo_Image", reader.result);
    });

    localStorage.setItem(`Transporter_Logo_Image`, files[0].name);
    setLogoFile(files[0].name);

    // setSelectedFiles((prev) => [...prev, files]);
    setCompanyLogo(URL.createObjectURL(event.target.files[0]));
  };

  const handleAddKamClick = () => {
    setIsAddingKam(true);
  };
  const handleKAMSelect = (KAM) => {
    setSelectedKAM(KAM);
  };

  const {
    handleSubmit: handleSubmit1,
    control: control1,
    setValue: setValue1,
    getValues: getValues1,
    clearErrors: clearerrors1,
    reset: reset1,
    formState: { errors: errors1 },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    setOpen(false);
  };
  function handleSaveKam() {
    console.log("newKamMob", newKamMobNo);
    const kamData = {
      kamName: kamName,
      kamEmail: kamEmail,
      kamMobNo: kamMobNo,
      KamBranch: selectedBranch.map((i, j) => i.label).join(","),
    };
    setKamDetails([{ ...kamData }]);
    // setIsTableVisible(!isTableVisible);
  }

  const vehicleColumns = [
    "Sl no",
    "Vehicle type ",
    "No of owned Vehicle",
    "No of leased Vehicle",
  ];

  const kamOptions = [
    { label: "KAM 1", value: "KAM 1" },
    { label: "KAM 2", value: "KAM 2" },
    // Add more region options
  ];

  const KamColumns = [
    "Name",
    "Branches",
    "Contact no.",
    "Email id",
    "Kam",
    "options",
  ];
  const kamColumns = [
    "Sl no",
    "Kam name ",
    "Mobile no ",
    "Linked branches",
    "Option",
  ];

  const states = [
    { label: "State 1", value: "state1" },
    { label: "State 2", value: "state2" },
    // Add more states
  ];

  const onSubmit = (data) => {
    console.log(data);
    //write file handling logic here manually then call api
  };
  return (
    <form onSubmit={handleSubmit1(onSubmit)}>
      <Box sx={style}>
        {console.log(errors1)}
        <Typography style={{ marginBottom: "20px" }} variant="h4">
          Transporter details
        </Typography>

        <CardContent style={{ marginBottom: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="name"
                control={control1}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Transporter Name*"
                    variant="filled"
                    fullWidth
                    error={Boolean(errors1.name)}
                    size="small"
                    helperText={errors1.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="email"
                control={control1}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email*"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors1.email)}
                    helperText={errors1.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="contactPerson"
                control={control1}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Person*"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors1.contactPerson)}
                    helperText={errors1.contactPerson?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="contactNumber"
                control={control1}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Number*"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors1.contactNumber)}
                    helperText={errors1.contactNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="panNumber"
                control={control1}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="PAN*"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors1.panNumber)}
                    helperText={errors1.panNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="tanNumber"
                control={control1}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="TAN*"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors1.tanNumber)}
                    helperText={errors1.tanNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="gstNumber"
                control={control1}
                defaultValue=""
                rules={{
                  required: false,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="GSTIN"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors1.gstNumber)}
                    helperText={errors1.gstNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  color: "black",
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    padding: "10px",
                    color: "grey",
                  }}
                >
                  <Box>
                    <label>GSTIN Upload</label>
                  </Box>
                  <Box>{fileName ? <small>{fileName}</small> : null}</Box>
                </Box>

                <FileUploader handleFile={handleSingleFile} variant="filled" />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="IBA approved"
                id="outlined-basic-name"
                variant="filled"
                size="small"
                fullWidth
                name="newTransporterIBA"
                value={newTransporterIBA}
                onChange={(e) =>
                  handleNewInputChange("newTransporterIBA", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Carriage actcertificate"
                id="outlined-basic-name"
                variant="filled"
                size="small"
                name="newTransporterCarrCert"
                value={newTransporterCarrCert}
                fullWidth
                onChange={(e) =>
                  handleNewInputChange("newTransporterCarrCert", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Bank guarantee validity date"
                type="date"
                id="outlined-basic-name"
                variant="filled"
                size="small"
                name="newTransporterBankGur"
                value={newTransporterBankGur}
                fullWidth
                onChange={(e) =>
                  handleNewInputChange("newTransporterBankGur", e.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>{" "}
          </Grid>
        </CardContent>
        <Typography style={{ marginBottom: "20px" }} variant="h4">
          Document uploaded
        </Typography>
        <CardContent style={{ marginBottom: "20px" }}>
          <Grid container spacing={4}>
            <Grid item md={4}>
              {" "}
              <Box display="flex" alignItems="center" marginBottom="16px">
                <img
                  src={iconList.png}
                  alt="extension"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <Typography>Trade license</Typography>
                  <Typography variant="h6">3 Mb</Typography>
                </div>
              </Box>
            </Grid>
            <Grid item md={4}>
              {" "}
              <Box display="flex" alignItems="center" marginBottom="16px">
                <img
                  src={iconList.jpg}
                  alt="extension"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <Typography>Trade license</Typography>
                  <Typography variant="h6">3 Mb</Typography>
                </div>
              </Box>
            </Grid>

            <Grid item md={4}>
              {" "}
              <Box display="flex" alignItems="center" marginBottom="16px">
                <img
                  src={iconList.pdf}
                  alt="extension"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <Typography>Trade license</Typography>
                  <Typography variant="h6">3 Mb</Typography>
                </div>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Typography style={{ marginBottom: "20px" }} variant="h4">
          Vehicle details
        </Typography>

        <Card className="registerCard">
          <Grid item md={12} style={{ marginBottom: "20px" }}>
            <Grid item md={12}>
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <Box display="flex" alignItems="center" marginRight="20px">
                  <Typography variant="h4">Vehicles List</Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginRight="20px"
                  marginLeft="auto"
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      bgcolor: "#065AD81A",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: "5px",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    {rows.length}
                  </Box>
                  <Typography>Vehicles Added</Typography>
                  <Button color="primary" style={{ marginLeft: "10px" }}>
                    Collapse list
                  </Button>
                </Box>
              </div>
            </Grid>
            <TableContainer
            // component={Paper}
            >
              <Table>
                <TableHead sx={{ bgcolor: "#065AD81A" }}>
                  <TableRow>
                    {vehicleColumns.map((column, columnIndex) => (
                      <TableCell key={columnIndex}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedTransport.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {/* <TableCell>
                      <Typography>{rowIndex + 1}</Typography>
                    </TableCell> */}
                      <TableCell>
                        <Typography>{rowIndex + 1}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>Truck</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>5</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>10</Typography>
                      </TableCell>

                      {/* <TableCell>
                          <IconButton>
                            <BorderColorIcon
                              fontSize="small"
                              color="primary"
                              onClick={handleOpen}
                            />
                          </IconButton>

                          <IconButton style={{ marginLeft: "10px" }}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Card>

        <Typography
          style={{ marginBottom: "20px", marginTop: "30px" }}
          variant="h4"
        >
          Transporter address details
        </Typography>

        <Typography variant="p">corporate address</Typography>
        <Grid
          container
          spacing={2}
          sx={{ marginTop: "10px ", marginBottom: "20px" }}
        >
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="corporateAddressLine1"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Line 1*"
                  variant="filled"
                  fullWidth
                  size="small"
                  error={Boolean(errors1.corporateAddressLine1)}
                  helperText={errors1.corporateAddressLine1?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="corporateAddressLine2"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Line 2*"
                  variant="filled"
                  fullWidth
                  size="small"
                  error={Boolean(errors1.corporateAddressLine2)}
                  helperText={errors1.corporateAddressLine2?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="corporateCity"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City*"
                  variant="filled"
                  fullWidth
                  size="small"
                  error={Boolean(errors1.corporateCity)}
                  helperText={errors1.corporateCity?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="corporatePinCode"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pin Code*"
                  variant="filled"
                  fullWidth
                  size="small"
                  error={Boolean(errors1.corporatePinCode)}
                  helperText={errors1.corporatePinCode?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box component="div">
              <Controller
                name="corporateCountry"
                control={control1}
                defaultValue=""
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    variant="filled"
                    size="small"
                    error={Boolean(errors1.corporateCountry)}
                  >
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                      {...field}
                      labelId="country-label"
                      id="corporateCountry"
                      label="Country"
                      IconComponent={KeyboardArrowDownIcon}
                    >
                      <MenuItem value="country1">Country 1</MenuItem>
                      <MenuItem value="country2">Country 2</MenuItem>
                    </Select>
                    {errors1.corporateCountry && (
                      <ErrorTypography>
                        {errors1.corporateCountry.message}
                      </ErrorTypography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="corporateState"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={states}
                  getOptionLabel={(option) => option.label || ""}
                  value={
                    states.find((option) => option.value === field.value) ||
                    null
                  }
                  onChange={(_, newValue) => {
                    field.onChange(newValue ? newValue.value : "");
                  }}
                  popupIcon={<KeyboardArrowDownIcon />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      variant="filled"
                      fullWidth
                      size="small"
                      error={!!errors1.corporateState}
                      helperText={errors1.corporateState?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ marginTop: "30px" }}>
          <Typography style={{ marginBottom: "20px" }} variant="p">
            Billing address
          </Typography>
        </Box>

        <FormControlLabel
          label="Same as corporate address"
          control={<Checkbox checked={checked} onChange={handleCheck} />}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="billingAddressLine1"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Line 1*"
                  variant="filled"
                  fullWidth
                  size="small"
                  error={Boolean(errors1.billingAddressLine1)}
                  helperText={errors1.billingAddressLine1?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="billingAddressLine2"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Line 2*"
                  variant="filled"
                  fullWidth
                  size="small"
                  error={Boolean(errors1.billingAddressLine2)}
                  helperText={errors1.billingAddressLine2?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="billingCity"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City*"
                  variant="filled"
                  fullWidth
                  size="small"
                  error={Boolean(errors1.billingCity)}
                  helperText={errors1.billingCity?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="billingPinCode"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pin Code*"
                  variant="filled"
                  fullWidth
                  size="small"
                  error={Boolean(errors1.billingPinCode)}
                  helperText={errors1.billingPinCode?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box component="div">
              <Controller
                name="billingCountry"
                control={control1}
                defaultValue=""
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    variant="filled"
                    size="small"
                    error={Boolean(errors1.billingCountry)}
                  >
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                      {...field}
                      labelId="country-label"
                      id="billingCountry"
                      label="Country"
                      IconComponent={KeyboardArrowDownIcon}
                    >
                      <MenuItem value="country1">Country 1</MenuItem>
                      <MenuItem value="country2">Country 2</MenuItem>
                    </Select>
                    {errors1.billingCountry && (
                      <ErrorTypography>
                        {errors1.billingCountry.message}
                      </ErrorTypography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="billingState"
              control={control1}
              defaultValue=""
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={states}
                  getOptionLabel={(option) => option.label || ""}
                  value={
                    states.find((option) => option.value === field.value) ||
                    null
                  }
                  onChange={(_, newValue) => {
                    field.onChange(newValue ? newValue.value : "");
                  }}
                  popupIcon={<KeyboardArrowDownIcon />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      variant="filled"
                      fullWidth
                      size="small"
                      error={!!errors1.billingState}
                      helperText={errors1.billingState?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ marginTop: "30px" }}>
          <Typography style={{ marginBottom: "20px" }} variant="h4">
            Transporter logo
          </Typography>
        </Box>
        <Box style={{ marginBottom: "20px" }}>
          <Typography variant="p">Logo preview</Typography>
        </Box>

        <Grid item md={6}>
          <div
            id="file-drop"
            style={{
              border: "0.5px solid #BDCCD3",
              borderRadius: "4px",
              padding: "54px 0px 53px 0px",
              textAlign: "center",
              cursor: "pointer",
              height: "250px",
            }}
            // onDrop={handleFileDrop}
            // onDragOver={(event) => event.preventDefault()}
          >
            {console.log("comapnyLogo", logoImage)}
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Selected Preview"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            ) : (
              <ImageIcon />
            )}
          </div>
        </Grid>
        <Box sx={{ marginTop: "30px" }}>
          <Typography style={{ marginBottom: "20px" }} variant="h4">
            Key account manager
          </Typography>
        </Box>

        <Grid container spacing={2} className="alighnItemCenter">
          <Grid item md={7}>
            <Autocomplete
              multiple
              id="regions-select"
              options={kamOptions}
              // value={selectedKam}
              // onChange={handleSelectedKamChange}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select key account managers"
                  variant="filled"
                />
              )}
              renderTags={(value, getTagProps) => (
                <Box>{value.length}Key account managers Selected</Box>
              )}
            />
          </Grid>
        </Grid>

        {!isAddingKam ? (
          <Grid item md={12} sx={{ marginTop: "30px" }}>
            <Box className="add-region-button">
              <Typography variant="h5">
                <span> KAM does not exist ? </span>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginLeft: 2 }}
                  onClick={handleAddKamClick}
                >
                  Add KAM
                </Button>
              </Typography>
            </Box>
          </Grid>
        ) : (
          <AddKam setIsAddingKam={setIsAddingKam} />
        )}

        <Card className="registerCard" sx={{ marginTop: "30px" }}>
          <Grid item md={12} style={{ marginBottom: "20px" }}>
            <Grid item md={12}>
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <Box display="flex" alignItems="center" marginRight="20px">
                  <Typography variant="h4">Vehicles List</Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginRight="20px"
                  marginLeft="auto"
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      bgcolor: "#065AD81A",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: "5px",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    {rows.length}
                  </Box>
                  <Typography>Vehicles Added</Typography>
                  <Button color="primary" style={{ marginLeft: "10px" }}>
                    Collapse list
                  </Button>
                </Box>
              </div>
            </Grid>
            <TableContainer
            // component={Paper}
            >
              <Table>
                <TableHead sx={{ bgcolor: "#065AD81A" }}>
                  <TableRow>
                    {kamColumns.map((column, columnIndex) => (
                      <TableCell key={columnIndex}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kamDetails.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {/* <TableCell>
                      <Typography>{rowIndex + 1}</Typography>
                    </TableCell> */}
                      <TableCell>
                        <Typography>{rowIndex + 1}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>{row.kamName}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>{row.kamMobNo}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>{row.KamBranch}</Typography>
                      </TableCell>

                      <TableCell>
                        <IconButton>
                          <BorderColorIcon
                            fontSize="small"
                            color="primary"
                            // onClick={handleOpen}
                          />
                        </IconButton>

                        <IconButton style={{ marginLeft: "10px" }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Card>

        <hr />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => props.setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            //   onClick={handleSaveKam}
            sx={{ marginLeft: 2 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
}
