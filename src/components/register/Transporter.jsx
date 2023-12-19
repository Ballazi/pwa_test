import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Radio,
  Card,
  Grid,
  Typography,
  Button,
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
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import pdficon from "../../../public/PDF_svg.svg";
import jpgicon from "../../../public/JPG_svg.svg";
import pngicon from "../../../public/PNG_svg.svg";
import ImageIcon from "@mui/icons-material/Image";

import CheckIcon from "@mui/icons-material/Check";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { HearingDisabled } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "@mui/material/Modal";
import RegisterCard from "../card/RegisterCard";
import TitleContainer from "../card/TitleContainer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { height } from "@mui/system";
import ContentWrapper from "../form-warpper/ContentWrapper";
import FooterWrapper from "../form-warpper/FooterWrapper";
import AlertPage from "../masterData/alert-component/AlertPage";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorTypography from "../typography/ErrorTypography";
import EditModalComponent from "./TransporterComponent/EditModalComponent";
import { StringSlice } from "../../utility/utility-function";
import { Clear, InfoOutlined } from "@mui/icons-material";
import AddKam from "./TransporterComponent/addKam";
import { viewAllCountry } from "../../api/master-data/country";
import { getAllStateByCountry } from "../../api/master-data/state";
import {
  getAlltransporters,
  postAlltransporters,
  getTransporterById,
} from "../../api/register/transporter";

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
} from "../../validation/common-validator";
import { Label } from "recharts";

import { FileUploader } from "./TransporterComponent/fileUplodeComponent";

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

export default function Transporters({
  value,
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
  props,
}) {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      documents: [],
    },
  });

  var len = 0;
  const [val, setVal] = useState("");
  const [val1, setVal1] = useState("");
  const [fileUploadProgress, setFileUploadProgress] = useState({});
  const [selectedKAM, setSelectedKAM] = useState(null);
  const [addTransporters, setAddTransporters] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const iconList = { jpg: jpgicon, pdf: pdficon, png: pngicon };
  const prefix = "Transporters";

  useEffect(() => {
    value([val, val1]);
  }, [val, val1]);
  const handleTransporterSelect = (transporter) => {
    setSelectedTransporters(transporter);
  };

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [billaddressLine1, setBillAddressLine1] = useState("");
  const [billaddressLine2, setBillAddressLine2] = useState("");
  const [billcity, setBillCity] = useState("");
  const [billpinCode, setBillPinCode] = useState("");
  const [billcountry, setBillCountry] = useState("");
  const [billstate, setBillState] = useState("");
  const [checked, setChecked] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoFile, setLogoFile] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [addKAM, setAddKAM] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [displayedBranches, setDisplayedBranches] = useState([]);
  const [saveKAM, setSaveKAM] = useState(false);
  const [transporterName, setTransporterName] = useState("");
  const [transporterEmail, setTransporterEmail] = useState("");
  const [transporterContactper, setTransporterContactper] = useState("");
  const [transporterContacNo, setTransporterContactNo] = useState("");
  const [transporterPAN, setTransporterPAN] = useState("");
  const [transporterTAN, setTransporterTAN] = useState("");
  const [transporterGstIn, setTransporterGstIn] = useState("");
  const [transporterRocNum, setTransporterRocNum] = useState("");
  const [transporterIBA, setTransporterIBA] = useState("");
  const [transporterCarrCert, setTransporterCarrCert] = useState("");
  const [transporterBankGur, setTransporterBankGur] = useState("");
  const [kamName, setKamName] = useState("");
  const [kamEmail, setKamEmail] = useState("");
  const [kamMobNo, setKamMobNo] = useState("");

  const [expanded, setExpanded] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState([]);
  const [isAddingTransport, setIsAddingTransport] = useState(false);
  const [newTransportInput, setNewTransportInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isAddingKam, setIsAddingKam] = useState(false);
  const [selectedKam, setSelectedKam] = useState([]);
  const [newKamInput, setNewKamInput] = useState("");
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [displayedBranch, setDisplayedBranch] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [newTransporterName, setNewTransporterName] = useState("");
  const [newTransporterEmail, setNewTransporterEmail] = useState("");
  const [newTransporterContactper, setNewTransporterContactper] = useState("");
  const [newTransporterContacNo, setNewTransporterContactNo] = useState("");
  const [newTransporterPAN, setNewTransporterPAN] = useState("");
  const [newTransporterTAN, setNewTransporterTAN] = useState("");
  const [newTransporterGstIn, setNewTransporterGstIn] = useState("");
  const [newTransporterRocNum, setNewTransporterRocNum] = useState("");
  const [newTransporterIBA, setNewTransporterIBA] = useState("");
  const [newTransporterCarrCert, setNewTransporterCarrCert] = useState("");
  const [newTransporterBankGur, setNewTransporterBankGur] = useState("");
  const [newAddressLine1, setNewAddressLine1] = useState("");
  const [newAddressLine2, setNewAddressLine2] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPinCode, setNewPinCode] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newState, setNewState] = useState("");
  const [newBilladdressLine1, setNewBillAddressLine1] = useState("");
  const [newBilladdressLine2, setNewBillAddressLine2] = useState("");
  const [newBillcity, setNewBillCity] = useState("");
  const [newBillpinCode, setNewBillPinCode] = useState("");
  const [newBillcountry, setNewBillCountry] = useState("");
  const [newBillstate, setNewBillState] = useState("");
  const [newKamName, setNewKamName] = useState("");
  const [newKamEmail, setNewKamEmail] = useState("");
  const [newKamMobNo, setNewKamMobNo] = useState("");
  const [newKamDetails, setNewKamDetails] = useState([]);
  const [kamDetails, setKamDetails] = useState([]);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allStatesForCorporate, setAllStatesForCorporate] = useState([]);
  const [allStatesForBilling, setAllStatesForBilling] = useState([]);
  const [enableAllStatesForCorporate, setEnableAllStateForCorporate] =
    useState(true);
  const [enableAllStatesForBilling, setEnableAllStateForBilling] =
    useState(true);
  const [transporterOptions, setTransporterOptions] = useState([]);
  const shipper_id = localStorage.getItem("shipper_id");

  const [fileName, setFileName] = useState("");
  const [selectedTransporters, setSelectedTransporters] = useState([]);
  const handleSingleFile = (file) => {
    setFileName(file.name);
  };

  // const transporterOptions = [
  //   { label: "DTDC", value: "DTDC" },
  //   { label: "Blue dart", value: "Blue dart" },
  //   // Add more region options
  // ];
  const handleSelectedTransportChange = (event, newValue) => {
    console.log("in the change", newValue);
    let regionValues = newValue.map((region) => region.value);
    let transporter = [];
    if (regionValues.length == 2) {
      console.log("in the 2 length", regionValues[1]);
      transporter.push(regionValues[1]);
    } else {
      transporter = regionValues;
    }
    console.log("in the after change", transporter);
    const demovalue = { name: transporter, kam: 2 };
    setSelectedTransport([{ ...demovalue }]);

    localStorage.setItem("SelectedTransport", JSON.stringify(regionValues));

    getTransporterById(newValue[0].value)
      .then((res) => console.log("Jay maa tara", res.data))
      .catch((err) => err.response.data.message);
  };

  const handleAddTransportClick = () => {
    setIsAddingTransport(true);
  };
  const handleNewTransportInputChange = (event) => {
    setNewTransportInput(event.target.value);
  };
  const handleCloseTransport = () => {
    setIsAddingTransport(false);
  };

  const handleNewTransportAdd = () => {
    console.log("here in new trasport");
    const newRegion = { name: newTransporterName, kam: 2 };
    setSelectedTransport([...selectedTransport, newRegion]);
    // setNewTransportInput("");
    // setIsAddingTransport(false);
  };

  const [checkedBox, setCheckedBox] = useState(false);

  const handleChange = (event) => {
    setCheckedBox(event.target.checked);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // useEffect(() => {
  //   console.log("value is changing", selectedTransport);
  // }, [selectedTransport]);

  const KamColumns = [
    "Name",
    "Branches",
    "Contact no.",
    "Email id",
    "Kam",
    "options",
  ];

  const [rows, setRows] = useState([{ id: 1, values: ["", "", ""] }]);

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

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
    setNewTabValue("");
  };

  const vehicleColumns = [
    "Sl no",
    "Vehicle type ",
    "No of owned Vehicle",
    "No of leased Vehicle",
  ];

  function handleCheck(e) {
    console.log("Hello", e.target.checked);
    if (e.target.checked) {
      const billingAddLine1 = getValues("corporateAddressLine1");
      clearErrors("billingAddressLine1");
      clearErrors("billingAddressLine2");
      clearErrors("billingCity");
      clearErrors("billingPinCode");
      clearErrors("billingCountry");
      clearErrors("billingState");
      setValue("billingAddressLine1", billingAddLine1);
      const billingAddLine2 = getValues("corporateAddressLine2");
      setValue("billingAddressLine2", billingAddLine2);
      const city = getValues("corporateCity");
      setValue("billingCity", city);
      const pinCode = getValues("corporatePinCode");
      setValue("billingPinCode", pinCode);
      const country = getValues("corporateCountry");
      setValue("billingCountry", country);
      const state = getValues("corporateState");
      setValue("billingState", state);
      setChecked(e.target.checked);
    } else {
      setValue("billingAddressLine1", "");
      setValue("billingAddressLine2", "");
      setValue("billingCity", "");
      setValue("billingPinCode", "");
      setValue("billingCountry", "");
      setValue("billingState", "");
      setChecked(e.target.checked);
    }
  }

  const handleSelectedKamChange = (event, newValue) => {
    console.log("value coming", newValue);
    setSelectedKam([...newValue]);
    const regionValues = newValue.map((region) => region.value);
    localStorage.setItem("SelectedKam", JSON.stringify(regionValues));
  };

  const handleAddKamClick = () => {
    setIsAddingKam(true);
  };

  const handleNewKamAdd = () => {
    const newRegion = { label: newKamInput, value: newKamInput };
    setSelectedKam([...selectedKam, newRegion]);
    setNewKamInput("");
    setIsAddingKam(false);
  };

  const kamColumns = [
    "Sl no",
    "Kam name ",
    "Mobile no ",
    "Linked branches",
    "Option",
  ];

  function handleNewSaveKam() {
    console.log("newKamMob", newKamMobNo);
    const kamData = {
      kamName: newKamName,
      kamEmail: newKamEmail,
      kamMobNo: newKamMobNo,
      KamBranch: selectedBranch.map((i, j) => i.label).join(","),
    };
    setNewKamDetails([{ ...kamData }]);
    setIsTableVisible(!isTableVisible);
  }

  function handleSaveKam() {
    console.log("newKamMob", newKamMobNo);
    const kamData = {
      kamName: kamName,
      kamEmail: kamEmail,
      kamMobNo: kamMobNo,
      KamBranch: selectedBranch.map((i, j) => i.label).join(","),
    };
    setKamDetails([{ ...kamData }]);
  }

  useEffect(() => {
    getAlltransporters()
      .then((res) => {
        if (res.data.success === true) {
          if (res.data.data.length !== 0) {
            //state store
            const transporterOptions = res.data.data.map((item) => {
              return {
                label: item.name,
                value: item.trnsp_id,
              };
            });
            console.log("data", transporterOptions);
            setTransporterOptions(transporterOptions);
            console.log("data1", res.data.data);

            // setSelectedTransport({
            //   name: res.data.data.name,
            //   email: res.data.data.email,
            //   // phoneNumber: res
            // });
          } else {
            setTransporterOptions([]);
          }
        }
      })
      .catch((err) => console.log("err", err));
    setDisplayedBranch(selectedBranch);
  }, [selectedBranch]);

  const handleSelectedBranchChange = (event, newValue) => {
    console.log("hereregion", ...newValue);
    setSelectedBranch([...newValue]);
    const branchValues = newValue.map((segment) => segment.value);
    localStorage.setItem("SelectedBranch", JSON.stringify(branchValues));
  };

  const handleFileLogoChange = (event) => {
    setError("logo", undefined);
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    if (file && file.size <= maxSize) {
      setLogoFile(file.name);
      setCompanyLogo(URL.createObjectURL(event.target.files[0]));
      setValue("logo", event.target.files[0]);
    } else {
      // Handle the case where the file exceeds the 2 MB limit
      // Optionally, you can reset the file input to clear the selected file
      setLogoFile("");
      setError("logo", {
        message: "Please select a file not exceeding 2 MB in size",
      });
      setValue("logo", undefined);
      setCompanyLogo(null);
    }
  };

  const handleFileDrop = (event) => {
    setError("documents", undefined);
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

    const validFiles = Array.from(files).filter((file) => file.size <= maxSize);
    const invalidFiles = Array.from(files).filter(
      (file) => file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      // Handle the case where one or more dropped files exceed the 2 MB limit.
      setError("documents", {
        message: "One or more dropped files exceed the 2 MB limit.",
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(() => [
        // ...(prev || []),
        ...validFiles.map((file) => file.name),
      ]);
      setValue("documents", validFiles);
    }
  };

  const handleRemoveFile = (index) => {
    setError("documents", undefined);
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    const updatedDocuments = documents.filter((_, i) => i !== index);
    // Update the state with the new array
    setDocuments(updatedDocuments);
    setValue("documents", updatedDocuments);
    setSelectedFiles(updatedFiles);
  };

  const handleFileInputChange = (event) => {
    setError("documents", undefined);
    const files = Array.from(event.target.files);
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

    const invalidFile = files.find((file) => file.size > maxSize);

    if (invalidFile) {
      // Throw an error if any file exceeds the size limit
      setError("documents", {
        message: "Please try to upload files less than 2MB",
      });
    }

    const validFiles = files.filter((file) => file.size <= maxSize);

    if (validFiles.length > 0) {
      setDocuments(validFiles);
      setValue("documents", validFiles);
      setSelectedFiles(() => [
        // ...(prev || []),
        ...validFiles.map((file) => file.name),
      ]);
    } else {
      // Handle the case where no valid files were selected or show an error message.
      setError("documents", {
        message: "No valid files selected or files exceed the 2 MB limit.",
      });
    }
  };

  const handleFileDropLogo = (event) => {
    setError("logo", undefined);
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    if (file && file.size <= maxSize) {
      setLogoFile(file.name);
      setCompanyLogo(URL.createObjectURL(event.dataTransfer.files[0]));
      setValue("logo", event.dataTransfer.files[0]);
    } else {
      // Handle the case where the file exceeds the 2 MB limit
      // Optionally, you can reset the file input to clear the selected file
      setLogoFile("");
      setValue("logo", undefined);
      setError("logo", {
        message: "Please select a file not exceeding 2 MB in size",
      });
      setCompanyLogo(null);
    }
  };

  function handleRemoveLogo() {
    setError("logo", undefined);
    setLogoFile("");
    setCompanyLogo(null);
    setValue("logo", undefined);
  }

  // const handleInputChange = (fieldName, fieldValue) => {
  //   console.log("here i am", fieldName);
  //   switch (fieldName) {
  //     case "transporterName":
  //       console.log("in tranporter anme");
  //       setTransporterName(fieldValue);
  //       localStorage.setItem(`${prefix}-name`, fieldValue);
  //       break;
  //     case "email":
  //       setTransporterEmail(fieldValue);
  //       localStorage.setItem(`${prefix}-email`, fieldValue);
  //       break;
  //     case "contactPerson":
  //       setTransporterContactper(fieldValue);
  //       localStorage.setItem(`${prefix}-contactPerson`, fieldValue);
  //       break;
  //     case "contactNumber":
  //       setTransporterContactNo(fieldValue);
  //       localStorage.setItem(`${prefix}-contactNumber`, fieldValue);
  //       break;
  //     case "pan":
  //       setTransporterPAN(fieldValue);
  //       localStorage.setItem(`${prefix}-pan`, fieldValue);
  //       break;
  //     case "tan":
  //       setTransporterTAN(fieldValue);
  //       localStorage.setItem(`${prefix}-tan`, fieldValue);
  //       break;
  //     case "gstin":
  //       setTransporterGstIn(fieldValue);
  //       localStorage.setItem(`${prefix}-gstin`, fieldValue);
  //       break;
  //     case "ROC":
  //       setTransporterRocNum(fieldValue);
  //       localStorage.setItem(`${prefix}-ROC`, fieldValue);
  //       break;
  //     case "IBA":
  //       setTransporterIBA(fieldValue);
  //       localStorage.setItem(`${prefix}-IBA`, fieldValue);
  //       break;
  //     case "carriagecert":
  //       setTransporterCarrCert(fieldValue);
  //       localStorage.setItem(`${prefix}-carriagecert`, fieldValue);
  //       break;
  //     case "addressLine1":
  //       console.log("in line");
  //       setAddressLine1(fieldValue);
  //       localStorage.setItem(`${prefix}-addressLine1`, fieldValue);
  //       break;
  //     case "addressLine2":
  //       setAddressLine2(fieldValue);
  //       localStorage.setItem(`${prefix}-addressLine2`, fieldValue);
  //       break;
  //     case "city":
  //       setCity(fieldValue);
  //       localStorage.setItem(`${prefix}-city`, fieldValue);
  //       break;
  //     case "pinCode":
  //       setPinCode(fieldValue);
  //       localStorage.setItem(`${prefix}-pinCode`, fieldValue);
  //       break;
  //     case "country":
  //       setCountry(fieldValue);
  //       localStorage.setItem(`${prefix}-country`, fieldValue);
  //       break;
  //     case "state":
  //       setState(fieldValue);
  //       localStorage.setItem(`${prefix}-state`, fieldValue);
  //       break;
  //     case "billaddressLine1":
  //       console.log("in billin");
  //       setBillAddressLine1(fieldValue);
  //       localStorage.setItem(`${prefix}-billaddressLine1`, fieldValue);

  //       break;
  //     case "billaddressLine2":
  //       setBillAddressLine2(fieldValue);
  //       localStorage.setItem(`${prefix}-billaddressLine2`, fieldValue);
  //       if (checked) {
  //         setAddressLine2(fieldValue);
  //       }
  //       break;
  //     case "billcity":
  //       setBillCity(fieldValue);
  //       localStorage.setItem(`${prefix}-billcity`, fieldValue);
  //       if (checked) {
  //         setCity(fieldValue);
  //       }
  //       break;
  //     case "billpinCode":
  //       setBillPinCode(fieldValue);
  //       localStorage.setItem(`${prefix}-billpinCode`, fieldValue);
  //       if (checked) {
  //         setPinCode(fieldValue);
  //       }
  //       break;
  //     case "billcountry":
  //       setBillCountry(fieldValue);
  //       localStorage.setItem(`${prefix}-billcountry`, fieldValue);
  //       if (checked) {
  //         setCountry(fieldValue);
  //       }
  //       break;
  //     case "billstate":
  //       console.log("state value", fieldValue);
  //       setBillState(fieldValue);
  //       localStorage.setItem(`${prefix}-billstate`, fieldValue);
  //       if (checked) {
  //         setState(fieldValue);
  //       }
  //       break;
  //     case "adminName":
  //       setAdminName(fieldValue);
  //       localStorage.setItem(`${prefix}-adminName`, fieldValue);
  //       break;
  //     case "adminContactNumber":
  //       setAdminContactNumber(fieldValue);
  //       localStorage.setItem(`${prefix}-adminContactNumber`, fieldValue);
  //       break;
  //     case "adminEmail":
  //       setAdminEmail(fieldValue);
  //       localStorage.setItem(`${prefix}-adminEmail`, fieldValue);
  //       break;
  //     case "kamName":
  //       setKamName(fieldValue);

  //       break;
  //     case "kamEmail":
  //       setKamEmail(fieldValue);

  //       break;
  //     case "kamMobNo":
  //       setKamMobNo(fieldValue);

  //       break;
  //     case "BankGur":
  //       setTransporterBankGur(fieldValue);
  //       localStorage.setItem(`${prefix}-BankGur`, fieldValue);

  //     default:
  //       break;
  //   }
  // };

  const handleNewInputChange = (fieldName, fieldValue) => {
    console.log("here i am", fieldName);
    switch (fieldName) {
      case "newTransporterName":
        setNewTransporterName(fieldValue);

      case "newTransporterEmail":
        setNewTransporterEmail(fieldValue);

        break;
      case "newTransporterContactper":
        setNewTransporterContactper(fieldValue);

        break;
      case "newTransporterContacNo":
        setNewTransporterContactNo(fieldValue);

        break;
      case "newTransporterPAN":
        setNewTransporterPAN(fieldValue);

        break;
      case "newTransporterTAN":
        setNewTransporterTAN(fieldValue);

        break;
      case "newTransporterGstIn":
        setNewTransporterGstIn(fieldValue);

        break;
      case "newTransporterRocNum":
        setNewTransporterRocNum(fieldValue);

        break;
      case "newTransporterIBA":
        setNewTransporterIBA(fieldValue);

        break;
      case "newTransporterCarrCert":
        setNewTransporterCarrCert(fieldValue);

        break;
      case "newAddressLine1":
        console.log("in line");
        setNewAddressLine1(fieldValue);

        break;
      case "newAddressLine2":
        setNewAddressLine2(fieldValue);

        break;
      case "newCity":
        setNewCity(fieldValue);

        break;
      case "newPinCode":
        setNewPinCode(fieldValue);

        break;
      case "newCountry":
        setNewCountry(fieldValue);

        break;
      case "newState":
        setNewState(fieldValue);

        break;
      case "newBilladdressLine1":
        console.log("in billin");
        setNewBillAddressLine1(fieldValue);

        break;
      case "newBilladdressLine2":
        setNewBillAddressLine2(fieldValue);

        if (checked) {
          setNewAddressLine2(fieldValue);
        }
        break;
      case "newBillcity":
        setNewBillCity(fieldValue);

        if (checked) {
          setNewCity(fieldValue);
        }
        break;
      case "newBillpinCode":
        setNewBillPinCode(fieldValue);

        if (checked) {
          setNewPinCode(fieldValue);
        }
        break;
      case "newBillcountry":
        setNewBillCountry(fieldValue);

        if (checked) {
          setNewCountry(fieldValue);
        }
        break;
      case "newBillstate":
        console.log("state value", fieldValue);
        setNewBillState(fieldValue);

        if (checked) {
          setNewState(fieldValue);
        }
        break;

      case "newKamName":
        setNewKamName(fieldValue);

        break;
      case "newKamEmail":
        setNewKamEmail(fieldValue);

        break;
      case "newKamMobNo":
        setNewKamMobNo(fieldValue);

        break;
    }
  };

  useEffect(() => {
    if (checked) {
      setBillAddressLine1(addressLine1);
      localStorage.setItem(`${prefix}-billaddressLine1`, addressLine1);
      setBillAddressLine2(addressLine2);
      localStorage.setItem(`${prefix}-billaddressLine2`, addressLine2);
      setBillCity(city);
      localStorage.setItem(`${prefix}-billcity`, city);
      setBillCountry(country);
      localStorage.setItem(`${prefix}-billpinCode`, pinCode);
      setBillPinCode(pinCode);
      localStorage.setItem(`${prefix}-billcountry`, country);
      setBillState(state);
      localStorage.setItem(`${prefix}-billstate`, state);
    }
  }, [checked]);

  const handleAddRow = () => {
    const newId = rows.length + 1;
    setRows([...rows, { id: newId, values: ["", "", ""] }]);
  };
  useEffect(() => {
    setDisplayedBranches(selectedBranches);
  }, [selectedBranches]);

  const handleCellChange = (id, rowIndex, columnIndex, value) => {
    console.log("here", rowIndex, columnIndex, value, id);
    console.log("previoous", [...rows]);
    const updatedRows = [...rows];
    console.log("we have to", updatedRows[id - 1].values[columnIndex]);
    updatedRows[id - 1].values[columnIndex] = value;
    setRows(updatedRows);
  };

  const columns = [
    "Sl no.",
    "vehicle type",
    "No. of owned vehicle",
    "no. of leased vehicle",
  ];
  const calculateTotal = (ind) => {
    let total = 0;
    for (const row of rows) {
      total += parseInt(row.values[ind]) || 0;
    }
    return total;
  };

  const closePopup = () => {
    setAlertType("");
    setMessage("");
  };

  const handleCloseTransportList = () => {
    setIsAddingTransport(false);
  };

  const nextHandler = () => {
    console.log("", selectedTransporters);
    if (selectedTransporters === "") {
      setAlertType("error");
      setMessage("Please select any option");
    } else if (selectedTransporters === "have transporters") {
      if (selectedTransport.length === 0) {
        console.log("length here", ...selectedTransport);
        setAlertType("error");
        setMessage("Please create transporters");
      } else {
        handleNext();
      }
    } else {
      handleNext();
    }
  };

  const onSubmit = (data) => {
    console.log("hi", data);
    //write file handling logic here manually then call api
    const payload = {
      name: data.name,
      logo: data.logo ? data.logo : "",
      onboarding_shipper_id: shipper_id,
      corporate_address: data.corporateAddressLine1,
      corporate_city: data.corporateCity,
      corporate_state: data.corporateState,
      corporate_postal_code: data.corporatePinCode,
      corporate_country: data.corporateCountry,
      billing_address: data.billingAddressLine1,
      billing_city: data.billingCity,
      billing_state: data.billingState,
      billing_postal_code: data.billingPinCode,
      billing_country: data.billingCountry,
      contact_name: data.contactPerson,
      contact_no: data.contactNumber,
      email: data.email,
      communicate_by: data.name,
      pan: data.panNumber,
      tan: data.tanNumber,
      gstin: data.gstNumber,
      gstin_file: fileName,
      carriage_act_cert: data.Carriage_actcertificate,
      roc_number: data.roc_number,
      iba_approved: checkedBox,
      bank_guarantee_date: data.bank_guarantee_date,
      doc_path: data.doc_path,
    };
    console.log("payload", payload);
    postAlltransporters(payload)
      .then((resData) => {
        console.log("resData", resData);
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    viewAllCountry()
      .then((res) => {
        console.log("Country", res.data.data);
        if (res.data.success === true) {
          const countries = res.data.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          console.log("countries", countries);
          setCountries(countries);
          viewAllLicense()
            .then((res) => {
              if (res.data.success === true) {
                setAllLicense(res.data.data);
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const handleCorporateStatePopulate = (id, type) => {
    console.log("id", id);
    getAllStateByCountry(id)
      .then((res) => {
        if (res.data.success === true) {
          const states = res.data.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          if (type === "corporate") {
            setAllStatesForCorporate(states);
            setEnableAllStateForCorporate(false);
          } else {
            setAllStatesForBilling(states);
            setEnableAllStateForBilling(false);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {alertType !== "" ? (
        <AlertPage
          alertType={alertType}
          message={message}
          closePopup={closePopup}
        />
      ) : null}
      {console.log("error", errors)}
      <ContentWrapper>
        <TitleContainer>
          {" "}
          <Typography variant="h3">Transporters</Typography>
          <Typography style={{ marginBottom: "30px" }} variant="p">
            Fill out transporter Details
          </Typography>
        </TitleContainer>

        <RegisterCard title="select an option ">
          <Grid container spacing={4}>
            <Grid item md={3}>
              <div
                className={`radio-option ${
                  selectedTransporters === "have transporters" ? "selected" : ""
                }`}
                onClick={() => handleTransporterSelect("have transporters")}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedTransporters === "have transporters"}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">Have transporters</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item md={3}>
              <div
                className={`radio-option ${
                  selectedTransporters === "No transporters" ? "selected" : ""
                }`}
                onClick={() => handleTransporterSelect("No transporters")}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedTransporters === "No transporters"}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">Don't Have Trasporters</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
          </Grid>
        </RegisterCard>

        {selectedTransporters === "have transporters" && (
          <RegisterCard title="Create transporters">
            <Grid
              container
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  id="transporter-select"
                  options={transporterOptions}
                  getOptionLabel={(option) => option.label || ""}
                  // value={selectedTransport}
                  //   onChange={(_, newValue) => {
                  //   setKamRegionOptions([...newValue]);
                  // }}
                  onChange={(event, newValue) =>
                    handleSelectedTransportChange(event, newValue)
                  }
                  // getOptionLabel={(option) => option.label}

                  popupIcon={<KeyboardArrowDownIcon />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select transporter*"
                      variant="filled"
                      size="small"
                    />
                  )}
                  onClose={handleCloseTransportList}
                  renderTags={(value, getTagProps) =>
                    selectedTransport[0].name.length === 0 ? (
                      <Box></Box>
                    ) : (
                      <Box>
                        {selectedTransport[0].name.length}Transporter Selected
                      </Box>
                    )
                  }
                />
                {/* 
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={transporterOptions}
                  getOptionLabel={(option) => option.label || ""}
                  onChange={(event, newValue) =>
                    handleSelectedTransportChange(event, newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Multiple values"
                      placeholder="Favorites"
                    />
                  )}
                /> */}
              </Grid>

              {!isAddingTransport ? (
                <Grid item md={12}>
                  <Box className="add-region-button">
                    <Typography variant="h5">
                      <span> Transporter does not exist ? </span>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginLeft: 2 }}
                        onClick={handleAddTransportClick}
                      >
                        Add new transporter
                      </Button>
                    </Typography>
                  </Box>
                </Grid>
              ) : null}
            </Grid>
          </RegisterCard>
        )}

        {console.log("table value", selectedTransport)}
        {selectedTransport.length >= 1 ? (
          <RegisterCard>
            <Grid item md={12} style={{ marginBottom: "20px" }}>
              <Grid item md={12}>
                <div style={{ display: "flex", marginBottom: "20px" }}>
                  <Box display="flex" alignItems="center" marginRight="20px">
                    <Typography variant="h4">Transporter List</Typography>
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
                    <Typography>Transporters Added</Typography>
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
                      {KamColumns.map((column, columnIndex) => (
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
                          <Typography>{row.name}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>demo</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>demo</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>demo</Typography>
                        </TableCell>

                        {/* <TableCell>
                          <Typography>{row.kam}</Typography>
                        </TableCell> */}

                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </RegisterCard>
        ) : null}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <EditModalComponent setOpen={setOpen} />
        </Modal>

        {isAddingTransport && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <RegisterCard title="Transporter Details">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Transporter Name*"
                        variant="filled"
                        fullWidth
                        error={Boolean(errors.name)}
                        size="small"
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="contactPerson"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contact Person*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.contactPerson)}
                        helperText={errors.contactPerson?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="contactNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contact Number*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.contactNumber)}
                        helperText={errors.contactNumber?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="panNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="PAN*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.panNumber)}
                        helperText={errors.panNumber?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="tanNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="TAN*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.tanNumber)}
                        helperText={errors.tanNumber?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="gstNumber"
                    control={control}
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
                        error={Boolean(errors.gstNumber)}
                        helperText={errors.gstNumber?.message}
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

                    <FileUploader handleFile={handleSingleFile} />
                  </Box>
                </Grid>
                {/* <Grid item xs={12} sm={6} md={4}>
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
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Carriage actcertificate"
                    id="outlined-basic-name"
                    variant="filled"
                    size="small"
                    name="newTransporterCarrCert"
                    value={newTransporterCarrCert}
                    fullWidth
                    onChange={(e) =>
                      handleNewInputChange(
                        "newTransporterCarrCert",
                        e.target.value
                      )
                    }
                  />
                </Grid> */}
                <Grid item xs={12} sm={6} md={4}>
                  <Controller
                    name="Carriage_actcertificate"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: false,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Carriage act certificate"
                        variant="filled"
                        fullWidth
                        size="small"
                        // error={Boolean(errors.gstNumber)}
                        // helperText={errors.gstNumber?.message}
                      />
                    )}
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
                      handleNewInputChange(
                        "newTransporterBankGur",
                        e.target.value
                      )
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>{" "}
              </Grid>

              <Grid item xs={12} sm={6} md={4} sx={{ marginTop: "30px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedBox}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="IBA approved"
                />
              </Grid>

              <Grid
                item
                md={12}
                sx={{ marginBottom: "30px", marginTop: "30px" }}
              >
                <Box>
                  <Typography variant="h4">Document Upload</Typography>
                </Box>
              </Grid>

              {/* <RegisterCard title="Document Upload*"> */}
              <Grid container spacing={4}>
                <Grid item xs={12} md={12}>
                  <div
                    id="file-drop"
                    style={{
                      border: "2px dashed rgba(171, 191, 201, 0.80)",
                      borderRadius: "10px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onDrop={handleFileDrop}
                    onDragOver={(event) => event.preventDefault()}
                  >
                    <svg
                      width="41"
                      height="39"
                      viewBox="0 0 41 39"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.4239 4.44867C21.3067 4.32699 21.1642 4.22981 21.0054 4.16332C20.8466 4.09684 20.6749 4.0625 20.5013 4.0625C20.3278 4.0625 20.1561 4.09684 19.9973 4.16332C19.8385 4.22981 19.696 4.32699 19.5788 4.44867L12.9122 11.3758C12.6925 11.609 12.5787 11.9151 12.5954 12.2277C12.612 12.5402 12.7579 12.8338 13.0012 13.0448C13.2445 13.2557 13.5657 13.3668 13.8948 13.3541C14.2239 13.3413 14.5345 13.2056 14.7588 12.9765L19.2522 8.30567V25.8332C19.2522 26.1481 19.3839 26.4502 19.6183 26.6729C19.8527 26.8956 20.1707 27.0207 20.5022 27.0207C20.8337 27.0207 21.1516 26.8956 21.3861 26.6729C21.6205 26.4502 21.7522 26.1481 21.7522 25.8332V8.30884L26.2472 12.9797C26.4711 13.2121 26.783 13.3505 27.1143 13.3645C27.4456 13.3784 27.7692 13.2668 28.0138 13.0541C28.2585 12.8414 28.4042 12.5451 28.4189 12.2303C28.4336 11.9156 28.3161 11.6082 28.0922 11.3758L21.4239 4.44867Z"
                        fill="#ABBFC9"
                      />
                      <path
                        d="M6.75 24.25C6.75 23.9351 6.6183 23.633 6.38388 23.4103C6.14946 23.1876 5.83152 23.0625 5.5 23.0625C5.16848 23.0625 4.85054 23.1876 4.61612 23.4103C4.3817 23.633 4.25 23.9351 4.25 24.25V24.3371C4.25 26.5015 4.25 28.2479 4.445 29.6207C4.645 31.0457 5.07833 32.2458 6.08 33.199C7.08333 34.1522 8.34667 34.5607 9.84667 34.7538C11.2917 34.9375 13.13 34.9375 15.4083 34.9375H25.5917C27.87 34.9375 29.7083 34.9375 31.1533 34.7538C32.6533 34.5607 33.9167 34.1522 34.92 33.199C35.9233 32.2458 36.3533 31.0457 36.5567 29.6207C36.75 28.2479 36.75 26.5015 36.75 24.3371V24.25C36.75 23.9351 36.6183 23.633 36.3839 23.4103C36.1495 23.1876 35.8315 23.0625 35.5 23.0625C35.1685 23.0625 34.8505 23.1876 34.6161 23.4103C34.3817 23.633 34.25 23.9351 34.25 24.25C34.25 26.5221 34.2467 28.107 34.0783 29.304C33.9133 30.4662 33.6117 31.0805 33.1517 31.5191C32.69 31.9577 32.0433 32.2427 30.8183 32.3994C29.56 32.5593 27.8917 32.5625 25.5 32.5625H15.5C13.1083 32.5625 11.4383 32.5593 10.18 32.3994C8.95667 32.2427 8.31 31.9561 7.84833 31.5191C7.38667 31.0805 7.08667 30.4662 6.92167 29.3024C6.75333 28.107 6.75 26.5221 6.75 24.25Z"
                        fill="#ABBFC9"
                      />
                    </svg>

                    <Typography sx={{ marginTop: "24px" }}>
                      Drag and drop files here
                    </Typography>
                    <Typography sx={{ color: "rgba(0, 0, 0, 0.40)" }}>
                      JPG, PNG, PDF or XLSX, file size no more than 10MB
                    </Typography>
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      multiple
                      onChange={handleFileInputChange}
                    />

                    <Button
                      variant="outlined"
                      sx={{ marginTop: "24px" }}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      {" "}
                      Choose a File
                    </Button>
                  </div>
                  {errors.documents && (
                    <ErrorTypography>
                      {errors.documents.message}
                    </ErrorTypography>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  {selectedFiles.map((file, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      marginBottom="16px"
                    >
                      <img
                        src={iconList[file.split(".")[1]]}
                        alt="extension"
                        style={{ marginRight: "10px" }}
                      />
                      <Typography>
                        {StringSlice(file.split(".")[0], 15)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={fileUploadProgress[file.name] || 0}
                        style={{ flex: 1, marginLeft: "16px" }}
                      />
                      <IconButton onClick={() => handleRemoveFile(index)}>
                        <Clear />
                      </IconButton>
                    </Box>
                  ))}
                </Grid>
              </Grid>
              {/* </RegisterCard> */}

              <Grid item md={12}>
                <Box>
                  <Typography
                    style={{ marginBottom: "30px", marginTop: "30px" }}
                    variant="h4"
                  >
                    Vehicle Details
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={12}>
                <div style={{ display: "flex" }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    marginRight="20px"
                    marginBottom="20px"
                  >
                    <Typography variant="h5">Vehicle List</Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleAddRow}
                      style={{ marginLeft: "10px" }}
                    >
                      Add vehicle
                    </Button>
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
                        marginBottom: "20px",
                      }}
                    >
                      {rows.length}
                    </Box>
                    <Typography sx={{ marginBottom: "20px" }}>
                      Vehicle Added
                    </Typography>
                    <Button
                      color="primary"
                      style={{ marginLeft: "10px", marginBottom: "20px" }}
                    >
                      Collapse list
                    </Button>
                  </Box>
                </div>
              </Grid>
              <Grid item md={12}>
                <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
                  <Table>
                    <TableHead sx={{ bgcolor: "#065AD81A" }}>
                      <TableRow>
                        {columns.map((column, columnIndex) => (
                          <TableCell key={columnIndex}>{column}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, rowIndex) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <Typography>{row.id}</Typography>
                          </TableCell>
                          {row.values.map((cellValue, columnIndex) => (
                            <TableCell key={columnIndex}>
                              {/* <Typography>{cellValue}</Typography> */}
                              {columnIndex === 0 ? (
                                <Select
                                  value={cellValue}
                                  fullWidth
                                  onChange={(e) =>
                                    handleCellChange(
                                      row.id,
                                      rowIndex,
                                      columnIndex,
                                      e.target.value
                                    )
                                  }
                                >
                                  <MenuItem value="Option 1">Truck </MenuItem>
                                  <MenuItem value="Option 2">Dry Van</MenuItem>
                                  <MenuItem value="Option 3">
                                    Chota hati
                                  </MenuItem>
                                </Select>
                              ) : (
                                <TextField
                                  value={cellValue}
                                  fullWidth
                                  onChange={(e) =>
                                    handleCellChange(
                                      row.id,
                                      rowIndex,
                                      columnIndex,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          <Typography variant="h5">Total</Typography>
                        </TableCell>
                        <TableCell align="center" variant="h5">
                          {calculateTotal(1)}
                        </TableCell>
                        <TableCell align="center" variant="h5">
                          {calculateTotal(2)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Grid>

              <Typography
                style={{ marginBottom: "20px", marginTop: "40px" }}
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
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address Line 1*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.corporateAddressLine1)}
                        helperText={errors.corporateAddressLine1?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="corporateAddressLine2"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address Line 2*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.corporateAddressLine2)}
                        helperText={errors.corporateAddressLine2?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Box component="div">
                    <Controller
                      name="corporateCountry"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={countries}
                          getOptionLabel={(option) => option.label || ""}
                          value={
                            countries.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : "");
                            handleCorporateStatePopulate(
                              newValue.value,
                              "corporate"
                            );
                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Country*"
                              variant="filled"
                              fullWidth
                              size="small"
                              error={!!errors.corporateCountry}
                              helperText={errors.corporateCountry?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="corporateState"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={allStatesForCorporate}
                        disabled={enableAllStatesForCorporate}
                        getOptionLabel={(option) => option.label || ""}
                        value={
                          allStatesForCorporate.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.value : "");
                        }}
                        popupIcon={<KeyboardArrowDownIcon />}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="State*"
                            variant="filled"
                            fullWidth
                            size="small"
                            error={!!errors.corporateState}
                            helperText={errors.corporateState?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="corporateCity"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.corporateCity)}
                        helperText={errors.corporateCity?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="corporatePinCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pin Code*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.corporatePinCode)}
                        helperText={errors.corporatePinCode?.message}
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

              <Grid container spacing={2} sx={{ marginTop: "10px " }}>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="billingAddressLine1"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address Line 1*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.billingAddressLine1)}
                        helperText={errors.billingAddressLine1?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="billingAddressLine2"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address Line 2*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.billingAddressLine2)}
                        helperText={errors.billingAddressLine2?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Box component="div">
                    <Controller
                      name="billingCountry"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={countries}
                          getOptionLabel={(option) => option.label || ""}
                          value={
                            countries.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.value : "");
                            handleCorporateStatePopulate(
                              newValue.value,
                              "billing"
                            );
                          }}
                          popupIcon={<KeyboardArrowDownIcon />}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Country*"
                              variant="filled"
                              fullWidth
                              size="small"
                              error={!!errors.billingCountry}
                              helperText={errors.billingCountry?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="billingState"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={allStatesForBilling}
                        disabled={enableAllStatesForBilling}
                        getOptionLabel={(option) => option.label || ""}
                        value={
                          allStatesForBilling.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.value : "");
                        }}
                        popupIcon={<KeyboardArrowDownIcon />}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="State*"
                            variant="filled"
                            fullWidth
                            size="small"
                            error={!!errors.billingState}
                            helperText={errors.billingState?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="billingCity"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.billingCity)}
                        helperText={errors.billingCity?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="billingPinCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pin Code*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={Boolean(errors.billingPinCode)}
                        helperText={errors.billingPinCode?.message}
                      />
                    )}
                  />
                </Grid>

                {/* <Grid item md={12}>
                  <Box>
                    <Typography style={{ marginBottom: "20px" }} variant="h">
                      Shipper Details
                    </Typography>
                  </Box>
                </Grid>
                <Grid item md={6}>
                  <Typography color={" #5E6871"} variant="h6">
                    Upload transporter logo
                  </Typography>
                  <div
                    id="file-drop"
                    style={{
                      border: "2px dashed #cccccc",
                      borderRadius: "5px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                    onDrop={handleFileDrop}
                    onDragOver={(event) => event.preventDefault()}
                  >
                    <svg
                      width="41"
                      height="39"
                      viewBox="0 0 41 39"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.4239 4.44867C21.3067 4.32699 21.1642 4.22981 21.0054 4.16332C20.8466 4.09684 20.6749 4.0625 20.5013 4.0625C20.3278 4.0625 20.1561 4.09684 19.9973 4.16332C19.8385 4.22981 19.696 4.32699 19.5788 4.44867L12.9122 11.3758C12.6925 11.609 12.5787 11.9151 12.5954 12.2277C12.612 12.5402 12.7579 12.8338 13.0012 13.0448C13.2445 13.2557 13.5657 13.3668 13.8948 13.3541C14.2239 13.3413 14.5345 13.2056 14.7588 12.9765L19.2522 8.30567V25.8332C19.2522 26.1481 19.3839 26.4502 19.6183 26.6729C19.8527 26.8956 20.1707 27.0207 20.5022 27.0207C20.8337 27.0207 21.1516 26.8956 21.3861 26.6729C21.6205 26.4502 21.7522 26.1481 21.7522 25.8332V8.30884L26.2472 12.9797C26.4711 13.2121 26.783 13.3505 27.1143 13.3645C27.4456 13.3784 27.7692 13.2668 28.0138 13.0541C28.2585 12.8414 28.4042 12.5451 28.4189 12.2303C28.4336 11.9156 28.3161 11.6082 28.0922 11.3758L21.4239 4.44867Z"
                        fill="#ABBFC9"
                      />
                      <path
                        d="M6.75 24.25C6.75 23.9351 6.6183 23.633 6.38388 23.4103C6.14946 23.1876 5.83152 23.0625 5.5 23.0625C5.16848 23.0625 4.85054 23.1876 4.61612 23.4103C4.3817 23.633 4.25 23.9351 4.25 24.25V24.3371C4.25 26.5015 4.25 28.2479 4.445 29.6207C4.645 31.0457 5.07833 32.2458 6.08 33.199C7.08333 34.1522 8.34667 34.5607 9.84667 34.7538C11.2917 34.9375 13.13 34.9375 15.4083 34.9375H25.5917C27.87 34.9375 29.7083 34.9375 31.1533 34.7538C32.6533 34.5607 33.9167 34.1522 34.92 33.199C35.9233 32.2458 36.3533 31.0457 36.5567 29.6207C36.75 28.2479 36.75 26.5015 36.75 24.3371V24.25C36.75 23.9351 36.6183 23.633 36.3839 23.4103C36.1495 23.1876 35.8315 23.0625 35.5 23.0625C35.1685 23.0625 34.8505 23.1876 34.6161 23.4103C34.3817 23.633 34.25 23.9351 34.25 24.25C34.25 26.5221 34.2467 28.107 34.0783 29.304C33.9133 30.4662 33.6117 31.0805 33.1517 31.5191C32.69 31.9577 32.0433 32.2427 30.8183 32.3994C29.56 32.5593 27.8917 32.5625 25.5 32.5625H15.5C13.1083 32.5625 11.4383 32.5593 10.18 32.3994C8.95667 32.2427 8.31 31.9561 7.84833 31.5191C7.38667 31.0805 7.08667 30.4662 6.92167 29.3024C6.75333 28.107 6.75 26.5221 6.75 24.25Z"
                        fill="#ABBFC9"
                      />
                    </svg>

                    <Typography sx={{ marginTop: "24px" }}>
                      Drag and drop icons here
                    </Typography>
                    <Typography sx={{ color: "rgba(0, 0, 0, 0.40)" }}>
                      JPG, PNG file size no more than 10MB
                    </Typography>
                    <input
                      type="file"
                      id="fileInput1"
                      style={{ display: "none" }}
                      accept="image/*"
                      multiple
                      onChange={handleFileLogoChange}
                    />

                    <Button
                      variant="outlined"
                      sx={{ marginTop: "24px" }}
                      onClick={() =>
                        document.getElementById("fileInput1").click()
                      }
                    >
                      {" "}
                      Choose a File
                    </Button>
                  </div>
                </Grid>
                <Grid item md={6}>
                  <Typography color={" #5E6871"}>logo Preview</Typography>
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
                    onDrop={handleFileDrop}
                    onDragOver={(event) => event.preventDefault()}
                  >
                    {console.log("comapnyLogo", logoImage)}
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt="Selected Preview"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                    ) : (
                      <ImageIcon sx={{ marginTop: "50px" }} />
                    )}
                  </div>
                </Grid>

                <Grid item md={12}>
                  {logoFile !== "" ? (
                    <Box
                      key={0}
                      display="flex"
                      alignItems="center"
                      marginBottom="16px"
                    >
                      <img
                        src={iconList[logoFile.split(".")[1]]}
                        alt="extension"
                        style={{ marginRight: "10px" }}
                      />
                      <Typography>{logoFile.split(".")[0]}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={fileUploadProgress[logoFile] || 0}
                        style={{ flex: 1, marginLeft: "16px" }}
                      />
                      <IconButton onClick={() => handleRemoveLogo()}>
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  ) : null}
                </Grid> */}

                {/* <RegisterCard title="Company Logo"> */}

                <Grid item md={12}>
                  <Box>
                    <Typography
                      style={{ marginBottom: "20px", marginTop: "20px" }}
                      variant="h4"
                    >
                      Transporter logo
                    </Typography>
                  </Box>
                </Grid>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography color={" #5E6871"} sx={{ mb: 2 }}>
                      Upload Transporter logo
                    </Typography>
                    <Box
                      component="div"
                      id="file-drop"
                      sx={{
                        border: "2px dashed rgba(171, 191, 201, 0.80)",
                        borderRadius: "10px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        paddingTop: "35px",
                        paddingBottom: "35px",
                        textAlign: "center",
                        cursor: "pointer",
                        // height: "250px",
                      }}
                      onDrop={handleFileDropLogo}
                      onDragOver={(event) => event.preventDefault()}
                    >
                      <svg
                        width="41"
                        height="39"
                        viewBox="0 0 41 39"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.4239 4.44867C21.3067 4.32699 21.1642 4.22981 21.0054 4.16332C20.8466 4.09684 20.6749 4.0625 20.5013 4.0625C20.3278 4.0625 20.1561 4.09684 19.9973 4.16332C19.8385 4.22981 19.696 4.32699 19.5788 4.44867L12.9122 11.3758C12.6925 11.609 12.5787 11.9151 12.5954 12.2277C12.612 12.5402 12.7579 12.8338 13.0012 13.0448C13.2445 13.2557 13.5657 13.3668 13.8948 13.3541C14.2239 13.3413 14.5345 13.2056 14.7588 12.9765L19.2522 8.30567V25.8332C19.2522 26.1481 19.3839 26.4502 19.6183 26.6729C19.8527 26.8956 20.1707 27.0207 20.5022 27.0207C20.8337 27.0207 21.1516 26.8956 21.3861 26.6729C21.6205 26.4502 21.7522 26.1481 21.7522 25.8332V8.30884L26.2472 12.9797C26.4711 13.2121 26.783 13.3505 27.1143 13.3645C27.4456 13.3784 27.7692 13.2668 28.0138 13.0541C28.2585 12.8414 28.4042 12.5451 28.4189 12.2303C28.4336 11.9156 28.3161 11.6082 28.0922 11.3758L21.4239 4.44867Z"
                          fill="#ABBFC9"
                        />
                        <path
                          d="M6.75 24.25C6.75 23.9351 6.6183 23.633 6.38388 23.4103C6.14946 23.1876 5.83152 23.0625 5.5 23.0625C5.16848 23.0625 4.85054 23.1876 4.61612 23.4103C4.3817 23.633 4.25 23.9351 4.25 24.25V24.3371C4.25 26.5015 4.25 28.2479 4.445 29.6207C4.645 31.0457 5.07833 32.2458 6.08 33.199C7.08333 34.1522 8.34667 34.5607 9.84667 34.7538C11.2917 34.9375 13.13 34.9375 15.4083 34.9375H25.5917C27.87 34.9375 29.7083 34.9375 31.1533 34.7538C32.6533 34.5607 33.9167 34.1522 34.92 33.199C35.9233 32.2458 36.3533 31.0457 36.5567 29.6207C36.75 28.2479 36.75 26.5015 36.75 24.3371V24.25C36.75 23.9351 36.6183 23.633 36.3839 23.4103C36.1495 23.1876 35.8315 23.0625 35.5 23.0625C35.1685 23.0625 34.8505 23.1876 34.6161 23.4103C34.3817 23.633 34.25 23.9351 34.25 24.25C34.25 26.5221 34.2467 28.107 34.0783 29.304C33.9133 30.4662 33.6117 31.0805 33.1517 31.5191C32.69 31.9577 32.0433 32.2427 30.8183 32.3994C29.56 32.5593 27.8917 32.5625 25.5 32.5625H15.5C13.1083 32.5625 11.4383 32.5593 10.18 32.3994C8.95667 32.2427 8.31 31.9561 7.84833 31.5191C7.38667 31.0805 7.08667 30.4662 6.92167 29.3024C6.75333 28.107 6.75 26.5221 6.75 24.25Z"
                          fill="#ABBFC9"
                        />
                      </svg>

                      <Typography sx={{ marginTop: "24px" }}>
                        Drag and drop icons here
                      </Typography>
                      <Typography sx={{ color: "rgba(0, 0, 0, 0.40)" }}>
                        JPG, PNG file size no more than 10MB
                      </Typography>
                      <input
                        type="file"
                        id="fileInput1"
                        style={{ display: "none" }}
                        accept="image/*"
                        multiple
                        onChange={handleFileLogoChange}
                      />

                      <Button
                        variant="outlined"
                        sx={{ marginTop: "24px" }}
                        onClick={() =>
                          document.getElementById("fileInput1").click()
                        }
                      >
                        {" "}
                        Choose a File
                      </Button>
                    </Box>
                    {errors.logo && (
                      <ErrorTypography>{errors.logo.message}</ErrorTypography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography color={" #5E6871"} sx={{ mb: 2 }}>
                      logo Preview
                    </Typography>
                    <div
                      id="file-drop"
                      style={{
                        border: "0.5px solid #BDCCD3",
                        borderRadius: "4px",
                        padding: "54px 0px 53px 0px",
                        textAlign: "center",
                        cursor: "pointer",
                        height: "250px",
                        position: "relative", // Make it relative for absolute positioning
                      }}
                      // onDrop={handleFileDrop}
                      onDragOver={(event) => event.preventDefault()}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          maxWidth: "100%", // Fit the image within the container width
                          maxHeight: "100%", // Fit the image within the container height
                        }}
                      >
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
                    </div>
                  </Grid>
                  <Grid item md={12}>
                    {logoFile !== "" ? (
                      <Box
                        key={0}
                        display="flex"
                        alignItems="center"
                        marginBottom="16px"
                      >
                        <img
                          src={iconList[logoFile.split(".")[1]]}
                          alt="extension"
                          style={{ marginRight: "10px" }}
                        />
                        <Typography>
                          {StringSlice(logoFile.split(".")[0], 20)}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={fileUploadProgress[logoFile] || 0}
                          style={{ flex: 1, marginLeft: "16px" }}
                        />
                        <IconButton onClick={() => handleRemoveLogo()}>
                          <Clear />
                        </IconButton>
                      </Box>
                    ) : null}
                  </Grid>
                </Grid>
                {/* </RegisterCard> */}

                {!isAddingKam ? (
                  <Grid
                    item
                    md={12}
                    sx={{ marginTop: "30px", marginBottom: "30px" }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      className="add-region-button"
                      sx={{ marginX: "80px" }}
                    >
                      <Typography variant="h4">
                        <span>Key account manager</span>
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginLeft: 2 }}
                        onClick={handleAddKamClick}
                      >
                        Add KAM
                      </Button>
                    </Box>
                  </Grid>
                ) : (
                  <AddKam
                    setIsAddingKam={setIsAddingKam}
                    setIsTableVisible={setIsTableVisible}
                    setNewKamDetails={setNewKamDetails}
                  />
                )}
              </Grid>

              {isTableVisible && (
                <Card
                  className="registerCard"
                  sx={{ marginTop: "30px", marginBottom: "40px" }}
                >
                  <Grid item md={12} style={{ marginBottom: "20px" }}>
                    <Grid item md={12}>
                      <div style={{ display: "flex", marginBottom: "20px" }}>
                        <Box
                          display="flex"
                          alignItems="center"
                          marginRight="20px"
                        >
                          <Typography variant="h4">
                            Key account manager list
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          marginRight="20px"
                          marginLeft="auto"
                        >
                          {console.log("newKamDaetails", newKamDetails)}
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
                          <Typography>KAMs Added</Typography>
                          <Button
                            color="primary"
                            style={{ marginLeft: "10px" }}
                          >
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
                          {newKamDetails.map((row, rowIndex) => (
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
                                <Typography>{row.BranchSelected}</Typography>
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
              )}
              <hr />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseTransport}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  // onClick={() => {
                  //   handleNewTransportAdd(), handleCloseTransport();
                  // }}
                  sx={{ marginLeft: 2 }}
                >
                  Add transporter
                </Button>
              </Box>
            </RegisterCard>
          </form>
        )}
      </ContentWrapper>
      <FooterWrapper>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        {currentStep !== stepsContent.length - 1 ? (
          <Button
            variant="contained"
            type="submit"
            onClick={() => nextHandler()}
            disabled={currentStep === stepsContent.length - 1}
          >
            Save and Continue
          </Button>
        ) : (
          <Button variant="contained" type="submit">
            Submit
          </Button>
        )}
      </FooterWrapper>
    </>
  );
}
