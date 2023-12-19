import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Container,
  TextField,
  Select,
  Typography,
  MenuItem,
  InputLabel,
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Tooltip,
  TableHead,
  FormControlLabel,
  DialogActions,
  Autocomplete,
  FormControl,
  Box,
  LinearProgress,
  IconButton,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import "../preTracking.css";
import {
  viewShipperTracking,
  getRegion,
  viewSpecificBranch,
} from "../../../../api/trip-management/create-trip";
import GogMapLoad from "../../../load-management/create-load/GogMapLoad";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorTypography from "../../../../components/typography/ErrorTypography"; //../typography/ErrorTypography
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../../redux/slices/snackbar-slice";
import RegisterCard from "../../../../components/card/RegisterCard";
import pdficon from "../../../../../public/PDF_svg.svg";
import jpgicon from "../../../../../public/JPG_svg.svg";
import pngicon from "../../../../../public/PNG_svg.svg";
import docIcon from "../../../../assets/doc.svg";
import docxIcon from "../../../../assets/docx.svg";
import jpegIcon from "../../../../assets/jpeg.svg";
import xlsIcon from "../../../../assets/xls.svg";
import xlsxIcon from "../../../../assets/xlsx.svg";
import { StringSlice } from "../../../../utility/utility-function";
import { Clear, InfoOutlined } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DownloadIcon from "@mui/icons-material/Download";

import dayjs from "dayjs";

import * as yup from "yup";

import {
  viewShiper,
  viewNetWork,
  viewMaterials,
  viewVehicle,
  viewTransporter,

  // viewSegment,
  save,
} from "../../../../api/trip-management/create-preTraking";
import {
  viewCommentForTracking,
  viewBranch,
  viewBid,
} from "../../../../api/trip-management/create-trip";
import {
  fecthSingleShipper,
  fecthSingleBranch,
} from "../../../../api/master-data/user";

import {
  requiredValidator,
  nameValidator,
  contactNumberValidator,
  noOfVehicleValidator,
  // ewayBillValidator,
  // vehicleNumberValidator,
} from "../../../../validation/common-validator";
import {
  getBase64Multiple,
  getBase64MultipleArray,
  getBase64SingleFile,
} from "../../../../utility/utility-function";
import { fetchSimNetworkPro } from "../../../../api/trip-management/manage-trip";

// const schema = yup.object().shape({

// });

const PreTrackingFormComponent = () => {
  const [isAlternateContactSelected, setIsAlternateContactSelected] =
    useState(false);
  const schemaBuilder = (isAlternateContactSelected) => {
    const baseSchema = yup.object().shape({
      ...(localStorage.getItem("user_type") === "acu"
        ? { shipper: requiredValidator("Shipper") }
        : {}),
      transporter: requiredValidator("transporter"),
      vehicleType: requiredValidator("vehicle"),
      customerContactName: nameValidator,
      contactNumber: contactNumberValidator,
      // biddingTimeValidator: requiredValidator("Bidding date "),

      checkInTimeValidator: requiredValidator("Check-In Time"),
      // checkOutTimeValidator: requiredValidator("Check-Out Time"),
      // loadingInitiationValidator: requiredValidator("Loading Initiation Time"),
      // vehicleNumber: vehicleNumberValidator,
      // driverContactName: contactNumberValidator,
      networkProvider: requiredValidator("Network Service Provider"),
      // materialType: requiredValidator("Materials details  "),
      // gpsType: requiredValidator("Gps "),
      // checkoutTime: requiredValidator("checkout Time"),
      noOfVehicle: requiredValidator("vehicle number"),
      driverContactNumber: contactNumberValidator,
      documents: yup.mixed(),
      vehicle_doc: yup.mixed(),
      // ewayBill: ewayBillValidator,
    });

    if (isAlternateContactSelected) {
      return baseSchema.shape({
        alternate_driver_number: contactNumberValidator,
        tf_altr_netw_srvc_prvd_id: requiredValidator(
          "Alternate network service provider"
        ),
      });
    }

    return baseSchema;
  };
  const schema = schemaBuilder(isAlternateContactSelected);
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    trigger,
    // reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shipper: "",
      documents: [],
      vehicle_doc: [],
    },
  });
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [hasLoadedBranch, setHasLoadedBranch] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem("user_type"));
  const [isAddEwayBillOpen, setIsAddEwayBillOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [updateUseEffect, setUpdateUseEffect] = useState(true);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [isInvoiceAdded, setIsInvoiceAdded] = useState(false);
  const [ewayBillNumber, setEwayBillNumber] = useState("");
  const [ewayBillValidity, setEwayBillValidity] = useState("");
  const [selectedVehicleFiles, setSelectedVehicleFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [shipperList, setShipperList] = useState([]);
  // const [networkService, setNetworkService] = useState([]);
  const [contacPersonNumber, setContactPersonNumber] = useState("");
  const [contacPersonName, setContactPersonName] = useState("");
  const [selectedShipper, setSelectedShipper] = useState([]);
  const [bidDateTime, setBidDateTime] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [networkProvider, setNetworkProvider] = useState([]);
  const [alterNetworkProvider, setAlterNetworkProvider] = useState([]);
  const [transporter, setTransporter] = useState([]);
  const [checkInTimeFrom, setCheckInTimeFrom] = useState(null);
  const [checkOutTimeTo, setCheckOutTimeTo] = useState(null);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [loadingEndTime, setLoadingEndTime] = useState(null);
  const [eWayBillDate, setEWayBillDate] = useState(null);
  const [addressValues, setAddressValues] = useState([]);
  const [branchInfo, setBranchInfo] = useState({ src: [null], dest: [null] });
  const [originSelected, setOriginSelected] = useState(true);
  const [docPath, setDocPath] = useState(null);
  let fileUploadProgress = {};
  const [veichleDocuments, setVeichleDocuments] = useState([]);
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [companyDocument, setCompanyDocument] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const iconList = {
    jpg: jpgicon,
    pdf: pdficon,
    png: pngicon,
    doc: docIcon,
    docx: docxIcon,
    jpeg: jpegIcon,
    xls: xlsIcon,
    xlsx: xlsxIcon,
  };
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [eta, setEta] = useState("");
  const [mapReset, setMapReset] = useState(false);

  // const [bidDateTime, setBidDateTime] = useState(null);

  const dispatch = useDispatch();

  const [selectedTransporter, setSelectedTransporter] = useState([]);

  const [selectedDevice, setSelectedDevice] = React.useState("");

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [itemUom, setItemUom] = useState("");
  const [alternateContactNumber, setAlternateContactNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const [documentsVehicleDoc, setDocumentsVehicleDoc] = useState([]);
  const [selectedFilesVehicleDoc, setSelectedFilesVehicleDoc] = useState([]);

  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().slice(0, 16); // Get current date in YYYY-MM-DDTHH:mm format

  const [invoiceDate, setInvoiceDate] = useState(currentDateString);
  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  function handleFullScreen(val) {
    if (val === 1) {
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }
  function exitHandler() {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      ///fire your event
      setIsFullScreen(false);
    }
  }
  useEffect(() => {
    if (document.fullscreenElement) {
      // console.log("in the useEffect");
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
  }, []);
  useEffect(() => {
    if (userRole === "shp" && localStorage.getItem("branch_id") !== "null") {
      viewSpecificBranch(localStorage.getItem("branch_id")).then((res) => {
        console.log("in branch for shipper", res.data.data);
        if (res.data.success) {
          let branchAddrs = res.data.data.google_address;

          setBranchInfo({
            src: [branchAddrs],
            dest: [null],
          });
        }
      });
    }
  }, [hasLoadedBranch]);

  function handleGoogleMapFullScreen() {
    let elem = document.getElementById("GogMAp");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
    // console.log("here in the onload", elem);
  }
  const fetchSingleShipper = (id) => {
    setIsLoading(true);
    const payload = {
      shipper_id: id,
    };
    return fecthSingleShipper(payload)
      .then((data) => {
        console.log("data is coming segment", data);
        if (data.success === true) {
          setContactPersonNumber(data.data.contact_no);
          setValue("customerContactName", data.data.contact_person);
          setValue("contactNumber", data.data.contact_no);
          setContactPersonName(data.data.contact_person);

          trigger("customerContactName");

          trigger("contactNumber");
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const fetchSingleBranchData = (id) => {
    setIsLoading(true);
    const payload = {
      branch_id: id,
    };
    return fecthSingleBranch(payload)
      .then((data) => {
        console.log("data is coming segment", data);
        if (data.success === true) {
          setContactPersonNumber(data.data.contact_no);
          setValue("customerContactName", data.data.contact_person);
          setValue("contactNumber", data.data.contact_no);
          setContactPersonName(data.data.contact_person);
          ///////////////////
          trigger("customerContactName");
          trigger("contactNumber");
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (isFullScreen) {
      handleGoogleMapFullScreen();
    }
  }, [isFullScreen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
  };

  const handleAddInvoiceClick = () => {
    setIsAddInvoiceOpen(true);
  };

  const handleCloseAddInvoice = () => {
    setIsAddInvoiceOpen(false);
    setInvoiceNumber("");
    setInvoiceAmount("");
  };

  const handleInvoiceNumberChange = (e) => {
    setInvoiceNumber(e.target.value);
  };

  const handleInvoiceAmountChange = (e) => {
    setInvoiceAmount(e.target.value);
  };

  const handleInvoiceAdd = () => {
    setIsInvoiceAdded(true);
    handleCloseAddInvoice();
  };
  const handleEwayBillAdd = () => {
    // Implement the logic to add the eBay bill
    // You can access the values of ebayBillNumber, ebayBillValidity, and process them as needed
    // For example, you might want to store them in a separate state or send them to an API.
    setIsAddEwayBillOpen(false);
    setEwayBillNumber("");
    setEwayBillValidity("");
  };

  const handleAddEwayBillClick = () => {
    setIsAddEwayBillOpen(true);
  };

  const handleCloseAddEwayBill = () => {
    setIsAddEwayBillOpen(false);
    setEwayBillNumber("");
    setEwayBillValidity("");
  };
  const [isAddItemDetailsOpen, setIsAddItemDetailsOpen] = useState(false);
  const [addItemDialogTitle, setAddItemDialogTitle] = useState("");
  const [itemDetails, setItemDetails] = useState([]);
  const handleAddItemDetailsClick = () => {
    setAddItemDialogTitle("Add Item Details");
    setIsAddItemDetailsOpen(true);
  };

  const handleCloseAddItemDetails = () => {
    setIsAddItemDetailsOpen(false);
  };

  // const handleFileDrop = (event) => {
  //   console.log("previous file drop");
  //   setError("documents", undefined);
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const files = event.dataTransfer.files;
  //   const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

  //   const validFiles = Array.from(files).filter((file) => file.size <= maxSize);
  //   const invalidFiles = Array.from(files).filter(
  //     (file) => file.size > maxSize
  //   );

  //   if (invalidFiles.length > 0) {
  //     // Handle the case where one or more dropped files exceed the 2 MB limit.
  //     setError("documents", {
  //       message: "One or more dropped files exceed the 2 MB limit.",
  //     });
  //   }

  //   if (validFiles.length > 0) {
  //     setSelectedVehicleFiles(() => [
  //       // ...(prev || []),
  //       ...validFiles.map((file) => file.name),
  //     ]);
  //     setSelectedFiles(() => [...validFiles.map((file) => file.name)]);
  //     setValue("vehicle_doc", validFiles);
  //   }
  // };

  const handleSelectFileDrop = (event) => {
    console.log("infileDrop");
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
      setSelectedFiles(() => [...validFiles.map((file) => file.name)]);
      console.log("sletectedFiles", selectedFiles);
      setValue("company_doc");
    }
  };
  // const handleFileInputChange = (event) => {
  //   setError("documents", undefined);
  //   const files = Array.from(event.target.files);
  //   const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
  //   console.log("first file");
  //   const invalidFile = files.find((file) => file.size > maxSize);

  //   if (invalidFile) {
  //     // Throw an error if any file exceeds the size limit
  //     setError("documents", {
  //       message: "Please try to upload files less than 2MB",
  //     });
  //   }

  //   const validFiles = files.filter((file) => file.size <= maxSize);
  //   console.log("valid Files", validFiles);

  //   if (validFiles.length > 0) {
  //     setVeichleDocuments(validFiles);
  //     setValue("vehicle_doc", validFiles);
  //     setSelectedVehicleFiles(() => [
  //       // ...(prev || []),
  //       ...validFiles.map((file) => file.name),
  //     ]);
  //   } else {
  //     // Handle the case where no valid files were selected or show an error message.
  //     setError("documents", {
  //       message: "No valid files selected or files exceed the 2 MB limit.",
  //     });
  //   }
  // };

  const handleInputChange = (event) => {
    console.log("second file");
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
      setCompanyDocument(validFiles);
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

  const handleItemDetailsSubmit = () => {
    const newItem = {
      itemName: itemName,
      itemQty: itemQty,
      uom: itemUom,
    };

    setItemDetails((prevDetails) => [...prevDetails, newItem]);
    setItemName("");
    setItemQty("");
    setItemUom("");
  };

  const handleSaveAsDraft = () => {
    // Gather all the data from the input fields and store it as needed
    const formData = {
      vehicleNumber: "", // Replace with the actual value from the input field
      driverContactNumber: "", // Replace with the actual value from the input field
      serviceProvider: selectedDevice, // Use the selected value from the Select field
      alternateContactNumber: alternateContactNumber, // Replace with the actual value from the input field

      // Invoices
      invoices: isInvoiceAdded
        ? [
            {
              invoiceNumber,
              invoiceAmount,
              invoiceDate,
            },
          ]
        : [],

      // eWay Bill
      ewayBill: {
        ewayBillNumber,
        ewayBillValidity,
      },

      // Item Details
      itemDetails,
    };

    // Now you have formData containing all the input data; you can do whatever you need with it.
    console.log("Form Data:", formData);
  };

  // const handleRemoveFile = (index) => {
  //   clearErrors("documents");
  //   const updatedFiles = [...selectedVehicleFiles];
  //   updatedFiles.splice(index, 1);
  //   const updatedDocuments = updatedFiles.filter((_, i) => i !== index);
  //   // Update the state with the new array
  //   setVeichleDocuments(updatedDocuments);
  //   setValue("vehicle_doc", updatedDocuments);
  //   setSelectedVehicleFiles(updatedFiles);
  // };

  const handleRemove = (index) => {
    clearErrors("documents");
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    const updatedDocuments = updatedFiles.filter((_, i) => i !== index);
    // Update the state with the new array
    setCompanyDocuments(updatedDocuments);
    setValue("company_doc", updatedDocuments);
    setSelectedFiles(updatedFiles);
  };

  //this function will get the sources and destinations from google map
  function getSourceDestination(val_all, src, dest, eta) {
    console.log("val======", src, dest);
    // console.log("BEFORE MODIFICATION", val);
    let val = { load_dest: dest, load_source: src };
    console.log("updated val", val);
    let val_new = [];

    if (src.length !== dest.length) {
      // If different, merge each load_source object with the single load_dest object
      src.forEach((source) => {
        source = { ...source, ...dest };
      });
    } else {
      val_new = src.map((source, index) => ({
        ...source,
        ...dest[index],
      }));
    }
    console.log("here src", src);
    console.log("here val new", val_new);
    console.log("ETA", eta);

    const load_source = src;
    const load_dest = dest; // Change 'destination' to 'load_dest'
    console.log("load source and dest", src, dest);

    let load_source_point = {};
    let load_dest_point = {}; // Change 'destination_point' to 'load_dest_point'
    let updatedAddress = [];
    for (let i = 0; i < Math.max(load_source.length, load_dest.length); i++) {
      load_source_point =
        i < load_source.length
          ? load_source[i]
          : load_source[load_source.length - 1];
      load_dest_point =
        i < load_dest.length ? load_dest[i] : load_dest[load_dest.length - 1]; // Change 'destination_point' to 'load_dest_point'

      let pairedAddress = {
        pair: i + 1,
        load_source: load_source_point,
        load_dest: load_dest_point, // Change 'destination' to 'load_dest'
      };
      updatedAddress.push(pairedAddress);

      console.log(`Pair ${i + 1}:`);
      console.log();
    }
    console.log("updated Address", updatedAddress);
    setEta(eta);
    setAddressValues(updatedAddress);
  }

  const onSubmitHandler = async (value) => {
    setIsLoading(true);
    console.log("value");
    console.log("materialType", value.materialType);
    var src_dest_present = true;
    console.log("addressValues", addressValues);

    addressValues.forEach((item) => {
      if (
        Object.keys(item.load_source).length === 0 ||
        Object.keys(item.load_dest).length === 0
      ) {
        console.log(
          "Either load_source or load_dest is empty in object:",
          item
        );
        src_dest_present = false;
      }
    });

    const docArray = value.documents;
    console.log("loop check", value.documents);
    console.log("check ..", value);
    let company_docs = [];
    let vehicle_docs = [];

    if (value.vehicle_doc.length > 0) {
      company_docs = await getBase64MultipleArray(value.vehicle_doc);
    }
    if (value.documents.length > 0) {
      vehicle_docs = await getBase64MultipleArray(value.documents);
    }

    console.log("googlemap", value);

    if (!src_dest_present) {
      console.log("in the zero");
      setIsLoading(false);
      dispatch(
        openSnackbar({
          type: "error",
          message: "sources and destination is required",
        })
      );
    } else {
      console.log(value.bidType);

      var res = await save(
        value,
        addressValues,

        // commentData,
        checkInTimeFrom,
        checkOutTimeTo,
        loadingStartTime,
        loadingEndTime,
        company_docs,
        vehicle_docs,
        eWayBillDate,
        eta
        // bidDateTime
      );
      console.log(res);
      if (res.data.success === true) {
        setUpdateUseEffect(!updateUseEffect);
        // reset();
        // setCheckInTimeFrom(null);
        // setCheckOutTimeTo(null);
        // setLoadingStartTime(null);
        // setLoadingEndTime(null);
        // setEWayBillDate(null);
        // setSelectedFiles([]);
        // setSelectedVehicleFiles([]);
        setMapReset(true);

        setIsLoading(false);
        dispatch(
          openSnackbar({ type: "success", message: res.data?.clientMessage })
        );
        // handleNext();
      } else {
        setIsLoading(false);
        dispatch(
          openSnackbar({
            type: "error",
            message: res.data?.clientMessage ?? "Something went wrong!",
          })
        );
      }
    }
  };

  const fetchShiper = () => {
    setIsLoading(true);
    return viewShipperTracking()
      .then((data) => {
        console.log("===>", data);

        if (data.success === true) {
          console.log("dadad", data.data);
          // let tempData = [];
          const tempData = data.data.map((item, index) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          setShipperList(tempData);
          console.log("dadadaaa", tempData);
        } else {
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchVehicleData = () => {
    setIsLoading(true);
    return viewVehicle()
      .then((data) => {
        if (data.success === true) {
          const updatedVehicles = data.data.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.wheels,
            type: item.type,
            capacity: item.capacity,
            distanceTravel: item.std_travel_dist_per_day,
          }));
          setVehicles(updatedVehicles);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setVehicles([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchNetWorkProvider = () => {
    setIsLoading(true);
    return viewNetWork()
      .then((data) => {
        if (data.success === true) {
          const updatedNetWork = data.data.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.wheels,
            type: item.type,
            capacity: item.capacity,
            distanceTravel: item.std_travel_dist_per_day,
          }));
          setNetworkProvider(updatedNetWork);
          setAlterNetworkProvider(updatedNetWork);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          networkProvider([]);
          alterNetworkProvider([]);
        }
      })

      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchMaterialsData = () => {
    setIsLoading(true);
    return viewMaterials()
      .then((data) => {
        if (data.success === true) {
          const updatedMaterials = data.data.map((item) => ({
            id: item.id,
            type: item.type,
            name: item.name,
          }));
          setMaterials(updatedMaterials);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setMaterials([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchTransporter = (id) => {
    // console.log("shipper id", id);
    setIsLoading(true);
    const payload = {
      shipper_id: id,
      // isRegion: true,
    };
    return viewTransporter(payload)
      .then((res) => {
        if (res.data.success === true) {
          const updatedTransporter = res.data.data.map((item) => {
            return {
              label: item.name,
              value: item.trnsp_id,
              // is_region: item.is_region,
            };
          });
          setTransporter(updatedTransporter);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
          // setTransporter([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicleData();
    fetchMaterialsData();
    fetchNetWorkProvider();
    fetchShiper();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user_type") != "acu") {
      setValue("shipper", localStorage.getItem("user_id"));
      fetchTransporter(localStorage.getItem("user_id"));
      fetchSingleShipper(localStorage.getItem("user_id"));
      fetchRegionData(localStorage.getItem("user_id"));
      fetchBidMode(localStorage.getItem("user_id"));
      fetchBranchData(localStorage.getItem("user_id"));
      fetchComment(localStorage.getItem("user_id"));
      // fetchSegment(localStorage.getItem("user_id"))
      // fetchSingleShipper(localStorage.getItem("user_id"))
      // fetchVehicleData(localStorage.getItem("user_id"))
      // fetchMaterialsData(localStorage.getItem("user_id"))
    }
  }, [updateUseEffect]);

  const handleFileDrop = (event) => {
    console.log(event);
    setError("documents", undefined);
    clearErrors("documents");
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files); // Convert FileList to an array
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    const allowedFormats = [
      "doc",
      "png",
      "jpg",
      "jpeg",
      "pdf",
      "xls",
      "xlsx",
      "docx",
    ];

    const invalidSizeFiles = files.filter((file) => file.size > maxSize);
    const invalidFormatFiles = files.filter(
      (file) =>
        !allowedFormats.includes(file.name.split(".").pop().toLowerCase())
    );

    if (invalidSizeFiles.length > 0 || invalidFormatFiles.length > 0) {
      // setDocuments(() => []);
      // setSelectedFiles(() => []);
      // setValue('documents', []);

      let errorMessage = "";

      if (invalidSizeFiles.length > 0) {
        const exceedingFilesNames = invalidSizeFiles.map((file) => file.name);
        errorMessage = `Some files exceed the 10 MB limit: ${exceedingFilesNames.join(
          ", "
        )}.`;
      }

      if (invalidFormatFiles.length > 0) {
        const invalidFileNames = invalidFormatFiles.map((file) => file.name);
        errorMessage +=
          (errorMessage ? " " : "") +
          `Invalid file format for: ${invalidFileNames.join(
            ", "
          )}. Please upload files in the specified formats.`;
      }

      // Set separate error messages for 10 MB limit and file format errors
      setError("documents", {
        message: errorMessage,
        type: "validate",
      });
    }
    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return file.size <= maxSize && allowedFormats.includes(fileExtension);
    });

    // if (validFiles.length > 0) {
    const newfiles = [...documents, ...validFiles];
    setDocuments(newfiles);
    setValue("documents", newfiles);
    setSelectedFiles(() => [
      // ...(prev || []),
      ...newfiles.map((file) => file.name),
    ]);
    setIsDocumentChange(true);
    // }
    // else {
    //   const validFiles = Array.from(files);

    //   setSelectedFiles((prev) => [
    //     // ...(prev || []),
    //     ...validFiles.map((file) => file.name),
    //   ]);
    //   setIsDocumentChange(true);
    //   setValue('documents', validFiles);
    // }
  };

  const handleRemoveFile = (index) => {
    clearErrors("documents");
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    const updatedDocuments = documents.filter((_, i) => i !== index);

    // Reset the value of the file input
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }

    // Update the state with the new array
    setDocuments(updatedDocuments);
    setValue("documents", updatedDocuments);
    setSelectedFiles(updatedFiles);
  };

  const handleFileInputChange = (event) => {
    console.log("triggered");
    // Check if the input value is empty
    if (!event.target.files.length) {
      // console.log('errorrrrr');
      // Reset the value and clear any previous errors
      event.target.value = "";
      clearErrors("documents");
      return;
    }

    clearErrors("documents");
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    const allowedFormats = [
      "doc",
      "png",
      "jpg",
      "jpeg",
      "pdf",
      "xls",
      "xlsx",
      "docx",
    ];

    const invalidFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return file.size > maxSize || !allowedFormats.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((file) => file.name);
      // setDocuments(() => []);
      // setSelectedFiles(() => []);
      // setValue('documents', []);

      let errorMessage = "";

      if (invalidFiles.some((file) => file.size > maxSize)) {
        const exceedingFilesNames = invalidFiles
          .filter((file) => file.size > maxSize)
          .map((file) => file.name);
        errorMessage = `Some files exceed the 10 MB limit: ${exceedingFilesNames.join(
          ", "
        )}.`;
      } else {
        errorMessage = `Invalid file format for: ${invalidFileNames.join(
          ", "
        )}. Please upload files in the specified formats.`;
      }

      // Throw an error if any file exceeds the size limit or has an invalid format
      setError("documents", {
        message: errorMessage,
      });
      // return; // Don't proceed if any file is invalid
    }

    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return file.size <= maxSize && allowedFormats.includes(fileExtension);
    });

    // if (validFiles.length > 0) {
    const newfiles = [...documents, ...validFiles];
    console.log("newfiles", documents, validFiles);
    setDocuments(newfiles);
    setValue("documents", newfiles);
    setSelectedFiles(() => [
      // ...(prev || []),
      ...newfiles.map((file) => file.name),
    ]);
    // setIsDocumentChange(true);
    // } else {
    //   // Handle the case where no valid files were selected or show an error message.
    //   setError('documents', {
    //     message: 'No valid files selected or files exceed the 10 MB limit.',
    //   });
    // }
  };

  const handleFileDropVehicleDoc = (event) => {
    console.log(event);
    setError("vehicle_doc", undefined);
    clearErrors("vehicle_doc");
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files); // Convert FileList to an array
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    const allowedFormats = [
      "doc",
      "png",
      "jpg",
      "jpeg",
      "pdf",
      "xls",
      "xlsx",
      "docx",
    ];

    const invalidSizeFiles = files.filter((file) => file.size > maxSize);
    const invalidFormatFiles = files.filter(
      (file) =>
        !allowedFormats.includes(file.name.split(".").pop().toLowerCase())
    );

    if (invalidSizeFiles.length > 0 || invalidFormatFiles.length > 0) {
      // setDocuments(() => []);
      // setSelectedFiles(() => []);
      // setValue('documents', []);

      let errorMessage = "";

      if (invalidSizeFiles.length > 0) {
        const exceedingFilesNames = invalidSizeFiles.map((file) => file.name);
        errorMessage = `Some files exceed the 10 MB limit: ${exceedingFilesNames.join(
          ", "
        )}.`;
      }

      if (invalidFormatFiles.length > 0) {
        const invalidFileNames = invalidFormatFiles.map((file) => file.name);
        errorMessage +=
          (errorMessage ? " " : "") +
          `Invalid file format for: ${invalidFileNames.join(
            ", "
          )}. Please upload files in the specified formats.`;
      }

      // Set separate error messages for 10 MB limit and file format errors
      setError("vehicle_doc", {
        message: errorMessage,
        type: "validate",
      });
    }
    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return file.size <= maxSize && allowedFormats.includes(fileExtension);
    });

    // if (validFiles.length > 0) {
    const newfiles = [...documentsVehicleDoc, ...validFiles];
    setDocumentsVehicleDoc(newfiles);
    setValue("vehicle_doc", newfiles);
    setSelectedFilesVehicleDoc(() => [
      // ...(prev || []),
      ...newfiles.map((file) => file.name),
    ]);
    // setIsDocumentChange(true);
    // }
    // else {
    //   const validFiles = Array.from(files);

    //   setSelectedFiles((prev) => [
    //     // ...(prev || []),
    //     ...validFiles.map((file) => file.name),
    //   ]);
    //   setIsDocumentChange(true);
    //   setValue('documents', validFiles);
    // }
  };

  const handleRemoveFileVehicleDoc = (index) => {
    clearErrors("vehicle_doc");
    const updatedFiles = [...selectedFilesVehicleDoc];
    updatedFiles.splice(index, 1);
    const updatedDocuments = documentsVehicleDoc.filter((_, i) => i !== index);

    // Reset the value of the file input
    const fileInput = document.getElementById("fileInputVD");
    if (fileInput) {
      fileInput.value = "";
    }

    // Update the state with the new array
    setDocumentsVehicleDoc(updatedDocuments);
    setValue("vehicle_doc", updatedDocuments);
    setSelectedFilesVehicleDoc(updatedFiles);
  };

  const handleFileInputChangeVehicleDoc = (event) => {
    console.log("triggered");
    // Check if the input value is empty
    if (!event.target.files.length) {
      // console.log('errorrrrr');
      // Reset the value and clear any previous errors
      event.target.value = "";
      clearErrors("vehicle_doc");
      return;
    }

    clearErrors("vehicle_doc");
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    const allowedFormats = [
      "doc",
      "png",
      "jpg",
      "jpeg",
      "pdf",
      "xls",
      "xlsx",
      "docx",
    ];

    const invalidFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return file.size > maxSize || !allowedFormats.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((file) => file.name);
      // setDocuments(() => []);
      // setSelectedFiles(() => []);
      // setValue('documents', []);

      let errorMessage = "";

      if (invalidFiles.some((file) => file.size > maxSize)) {
        const exceedingFilesNames = invalidFiles
          .filter((file) => file.size > maxSize)
          .map((file) => file.name);
        errorMessage = `Some files exceed the 10 MB limit: ${exceedingFilesNames.join(
          ", "
        )}.`;
      } else {
        errorMessage = `Invalid file format for: ${invalidFileNames.join(
          ", "
        )}. Please upload files in the specified formats.`;
      }

      // Throw an error if any file exceeds the size limit or has an invalid format
      setError("vehicle_doc", {
        message: errorMessage,
      });
      // return; // Don't proceed if any file is invalid
    }

    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return file.size <= maxSize && allowedFormats.includes(fileExtension);
    });

    // if (validFiles.length > 0) {
    const newfiles = [...documentsVehicleDoc, ...validFiles];
    console.log("newfiles", documentsVehicleDoc, validFiles);
    setDocumentsVehicleDoc(newfiles);
    setValue("vehicle_doc", newfiles);
    setSelectedFilesVehicleDoc(() => [
      // ...(prev || []),
      ...newfiles.map((file) => file.name),
    ]);
    // setIsDocumentChange(true);
    // } else {
    //   // Handle the case where no valid files were selected or show an error message.
    //   setError('documents', {
    //     message: 'No valid files selected or files exceed the 10 MB limit.',
    //   });
    // }
  };

  const fetchNetworkProviderData = (data, flag) => {
    setIsLoading(true);
    if (data.length === 10) {
      fetchSimNetworkPro(data)
        .then((res) => {
          if (res.data.success === true) {
            if (flag === "main") {
              trigger("networkProvider");
              setValue(
                "networkProvider",
                networkProvider.find((x) =>
                  res.data.data[`prefix-network`].toUpperCase().includes(x.name)
                )?.id
              );
            } else {
              trigger("networkProvider");
              setValue(
                "tf_altr_netw_srvc_prvd_id",
                networkProvider.find((x) =>
                  res.data.data[`prefix-network`].toUpperCase().includes(x.name)
                )?.id
              );
            }
          } else {
            dispatch(
              openSnackbar({ type: "error", message: res.data.clientMessage })
            );
          }
        })
        .catch((error) => {
          console.error("Error", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const [commentData, setCommentData] = useState("");
  const fetchComment = (id) => {
    const payload = {
      shipper_id: id,
      // isRegion: true,
    };
    return viewCommentForTracking(payload)
      .then((data) => {
        if (data.data.success === true) {
          console.log("comment", data.data.data.cmmnt_text);
          setValue("comment", data.data.data.cmmnt_text);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setCommentData([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const fetchBranchData = (id) => {
    setIsLoading(true);
    const shipperId = getValues("shipper");
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
    };
    return viewBranch(payload)
      .then((res) => {
        if (res.data.success === true) {
          const payload = res.data.data.map((ele) => ({
            value: ele.branch_id,
            label: ele.name,
          }));
          setBranchOptions(payload);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
          setBranchOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const fetchRegionData = (id) => {
    // console.log("shipper id", id);
    setIsLoading(true);
    const payload = {
      shipper_id: id,
      // isRegion: true,
    };
    return getRegion(payload)
      .then((res) => {
        if (res.data.success === true) {
          const updatedRegion = res.data.data.map((item) => {
            if (item.is_region === true) {
              return {
                label: item.region_name,
                value: item.msrc_region_cluster_id,
              };
            } else {
              return {
                label: item.cluster_name,
                value: item.msrc_region_cluster_id,
              };
            }
          });
          setRegionOptions(updatedRegion);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
          setRegionOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchBranchDataWithRegion = (id) => {
    setIsLoading(true);
    const shipperId = getValues("shipper");
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
      msrc_region_cluster_id: id,
    };
    return viewBranch(payload)
      .then((res) => {
        if (res.data.success === true) {
          const payload = res.data.data.map((ele) => ({
            value: ele.branch_id,
            label: ele.name,
          }));

          setBranchOptions(payload);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
          setBranchOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const fetchBidMode = (id) => {
    setIsLoading(true);
    // console.log("shipper id", id);
    const payload = {
      shipper_id: id,
    };
    return viewBid(payload)
      .then((res) => {
        // console.log("data is coming", data.data);
        if (res.data.success === true) {
          setBidSettingsInfo(res.data.data);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setBidSettingsInfo([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      {console.log("errors", errors, isSubmitting)}
      <Grid container spacing={1}>
        <Grid item md={6}>
          <Card style={{ padding: "10px" }}>
            <div className="customCardheader">
              <Typography variant="h4"> Create/Add Tracking</Typography>
              {contacPersonName ? (
                <Typography variant="h6">
                  {" "}
                  Contact Person: {contacPersonName} ({contacPersonNumber})
                </Typography>
              ) : (
                ""
              )}
            </div>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="shipper"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="shipper"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        {userRole === "acu" ? " Select Shipper*" : "Shipper*"}
                      </InputLabel>
                      <Autocomplete
                        {...field}
                        disabled={userRole === "acu" ? false : true}
                        options={shipperList}
                        getOptionLabel={(option) => option.label || ""}
                        value={
                          shipperList.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.value : "");
                          fetchTransporter(newValue.value);
                          fetchSingleShipper(newValue.value);
                          fetchBidMode(newValue.value);
                          // fetchSegment(newValue.value);
                          fetchRegionData(newValue.value);

                          fetchBranchData(newValue.value);
                          fetchComment(newValue.value);
                        }}
                        popupIcon={<KeyboardArrowDownIcon />}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label=""
                            variant="outlined"
                            fullWidth
                            size="small"
                            error={!!errors.shipper}
                            helperText={errors.shipper?.message}
                          />
                        )}
                      />
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="region"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <Tooltip title="Select region / Cluster">
                        <InputLabel
                          htmlFor="region"
                          shrink
                          sx={{
                            fontSize: "17px",
                          }}
                        >
                          Select region / cluster
                        </InputLabel>
                      </Tooltip>

                      <Autocomplete
                        {...field}
                        disabled={
                          userRole === "acu"
                            ? false
                            : userRole === "shp" &&
                              localStorage.getItem("region_cluster_id") ===
                                "null"
                            ? false
                            : true
                        }
                        options={regionOptions}
                        getOptionLabel={(option) => option.label || ""}
                        value={
                          regionOptions.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.value : "");

                          // Check if newValue is not null before accessing its value property
                          if (newValue !== null) {
                            fetchBranchDataWithRegion(newValue.value);
                          }
                        }}
                        onBlur={() => {
                          // Check if the value is empty (cleared)
                          if (!field.value) {
                            // Handle clear event here
                            const id = getValues("shipper");

                            setValue("branch", "");
                            fetchBranchData(id);
                            // alert("Data Cleared!");
                          }
                        }}
                        popupIcon={<KeyboardArrowDownIcon />}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label=""
                            variant="outlined"
                            fullWidth
                            size="small"
                            // error={!!errors.region}
                            // helperText={errors.region?.message}
                          />
                        )}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="branch"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={branchOptions}
                      // disabled={userRole != "acu" || localStorage.getItem("branch_id") != null ? true : false}
                      disabled={
                        userRole === "acu"
                          ? false
                          : userRole === "shp" &&
                            localStorage.getItem("branch_id") === "null"
                          ? false
                          : true
                      }
                      onLoad={() => {
                        setHasLoadedBranch(true);
                      }}
                      getOptionLabel={(option) => option.label || ""}
                      value={
                        branchOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.value : "");
                        if (newValue !== null) {
                          fetchSingleBranchData(newValue.value);
                          viewSpecificBranch(newValue.value).then((res) => {
                            console.log("in branch", res.data.data);
                            if (res.data.success) {
                              let branchAddrs = res.data.data.google_address;

                              setBranchInfo({
                                src: [branchAddrs],
                                dest: [null],
                              });
                            }
                          });
                        }
                      }}
                      onBlur={() => {
                        // Check if the value is empty (cleared)
                        if (!field.value) {
                          // Handle clear event here

                          setValue("loadingContactName", "");
                          setValue("loadingContactNumber", "");
                          setValue("unloadingContactNumber", "");
                          setValue("unloadingContactPerson", "");

                          const id = getValues("shipper");
                          const payload = {
                            shipper_id: id,
                          };

                          fetchSingleShipper(id);
                        }
                      }}
                      popupIcon={<KeyboardArrowDownIcon />}
                      renderInput={(params) => (
                        <>
                          <Tooltip title="Select branch">
                            <InputLabel
                              htmlFor="branch"
                              shrink
                              sx={{
                                fontSize: "17px",
                              }}
                            >
                              Select branch
                            </InputLabel>
                          </Tooltip>

                          <TextField
                            {...params}
                            label=""
                            variant="outlined"
                            fullWidth
                            size="small"
                            // error={!!errors.branch}
                            // helperText={errors.branch?.message}
                          />
                        </>
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="transporter"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="transporter"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        Select Transporter*
                      </InputLabel>
                      <Autocomplete
                        {...field}
                        options={transporter}
                        getOptionLabel={(option) => option.label || ""}
                        value={
                          transporter.find(
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
                            label=""
                            variant="outlined"
                            fullWidth
                            size="small"
                            error={!!errors.transporter}
                            helperText={errors.transporter?.message}
                          />
                        )}
                      />
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="vehicleType"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="vehicleType"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        Vehicle Type*
                      </InputLabel>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={Boolean(errors.vehicleType)}
                      >
                        <Select
                          {...field}
                          labelId="bid-label"
                          id="vehicleType"
                          label=""
                          IconComponent={KeyboardArrowDownIcon}
                          onChange={(e) => {
                            const data = vehicles.find(
                              (item) => item.id === e.target.value
                            );
                            trigger("vehicleType");
                            setValue("capacityMt", data.capacity);
                            setValue("vehicleType", data.id);
                          }}
                        >
                          {/* {vehicles.map((item) => {
                            return (
                              <MenuItem value={item.id} key={item.id}>
                                {item.name}
                              </MenuItem>
                            );
                          })} */}

                          {vehicles.map((item) => {
                            return (
                              <MenuItem value={item.id} key={item.id}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {errors.vehicleType && (
                          <ErrorTypography>
                            {errors.vehicleType.message}
                          </ErrorTypography>
                        )}
                      </FormControl>
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="customerContactName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="customerContactName"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        Customer name*
                      </InputLabel>
                      <TextField
                        {...field}
                        label=""
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={Boolean(errors.customerContactName)}
                        helperText={errors.customerContactName?.message}
                      />
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="contactNumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="contactNumber"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        Customer Number*
                      </InputLabel>
                      <TextField
                        {...field}
                        label=""
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={Boolean(errors.contactNumber)}
                        helperText={errors.contactNumber?.message}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="noOfVehicle"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="noOfVehicle"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        Vehicle Number*
                      </InputLabel>
                      <TextField
                        {...field}
                        label=""
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={Boolean(errors.noOfVehicle)}
                        helperText={errors.noOfVehicle?.message}
                        //value={result}
                      />
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={6}>
                <Controller
                  name="driverContactNumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="driverContactNumber"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        Driver's Contact Number*
                      </InputLabel>
                      <TextField
                        {...field}
                        label=""
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          fetchNetworkProviderData(e.target.value, "main");
                        }}
                        size="small"
                        error={Boolean(errors.driverContactNumber)}
                        helperText={errors.driverContactNumber?.message}
                      />
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={6}>
                <Controller
                  name="networkProvider"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="networkProvider"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        Network Service Provider*
                      </InputLabel>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={Boolean(errors.networkProvider)}
                      >
                        <Select
                          {...field}
                          labelId="bid-label"
                          id="networkProvider"
                          label=""
                          IconComponent={KeyboardArrowDownIcon}
                        >
                          {networkProvider.map((item) => {
                            return (
                              <MenuItem value={item.id} key={item.id}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {errors.networkProvider && (
                          <ErrorTypography>
                            {errors.networkProvider.message}
                          </ErrorTypography>
                        )}
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControlLabel
                  sx={{ mt: 1 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={isAlternateContactSelected}
                      onChange={(e) => {
                        setIsAlternateContactSelected(e.target.checked);

                        setValue("alternate_driver_number", "");
                        setValue("tf_altr_netw_srvc_prvd_id", "");
                      }}
                    />
                  }
                  label="Alternate Contact Number"
                />
              </Grid>
              {isAlternateContactSelected && (
                <>
                  <Grid item md={6} sm={6} xs={12}>
                    <Controller
                      name="alternate_driver_number"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabel>Alternative Contact Number *:</InputLabel>
                          <TextField
                            size="small"
                            {...field}
                            type="text"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              fetchNetworkProviderData(e.target.value, "alter");
                            }}
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors.alternate_driver_number)}
                            helperText={errors.alternate_driver_number?.message}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <Controller
                      name="tf_altr_netw_srvc_prvd_id"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabel id="demo-simple-select-disabled-label">
                            Network Service Provider *:
                          </InputLabel>
                          <Select
                            fullWidth
                            size="small"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                          >
                            {networkProvider.map((item) => {
                              return (
                                <MenuItem value={item.id} key={item.id}>
                                  {item.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          {errors.tf_altr_netw_srvc_prvd_id && (
                            <ErrorTypography>
                              {errors.tf_altr_netw_srvc_prvd_id.message}
                            </ErrorTypography>
                          )}
                        </>
                      )}
                    />
                  </Grid>
                </>
              )}

              <RegisterCard title="Vehicle Doc">
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12}>
                    <div
                      style={{
                        textAlign: "end",
                        position: "relative",
                        bottom: "50px",
                      }}
                    >
                      {docPath && (
                        <a
                          href={`${baseUrl}/service/file/download/all/${shipper_id}/${docPath}`}
                        >
                          <DownloadIcon />
                          {/* {docPath} */}
                        </a>
                      )}
                    </div>
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
                        doc, docx, png, jpg, jpeg, pdf, xls, xlsx are allowed
                        format and file size not more than 10MB for single file
                      </Typography>
                      <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        multiple
                        accept=".doc, .png, .jpg, .jpeg, .pdf, .xls, .xlsx, .docx"
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
                          src={iconList[file.split(".").pop()]}
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
              </RegisterCard>

              <Grid item md={6} xs={12}>
                <Controller
                  name="checkInTimeValidator"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <>
                      <InputLabel>Gate-In Time *:</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            size="small"
                            sx={{
                              width: "100%",
                            }}
                            label="DD/MM/YYYY hh:mm"
                            format="DD/MM/YYYY hh:mm A"
                            disablePast
                            {...field}
                            onChange={(newValue) => {
                              const selectedDateTime = dayjs(newValue);
                              const currentDateTime = dayjs();

                              // Ensure that the selected time is at least 1 hour after the current time
                              const minAllowedDateTime = currentDateTime.add(
                                0,
                                "hour"
                              );

                              if (
                                selectedDateTime.isBefore(minAllowedDateTime)
                              ) {
                                // If the selected date and time is before the minimum allowed time,
                                // set the selected time to the minimum allowed time
                                const updatedDateTime = minAllowedDateTime;
                                // setValue("initialTime", updatedDateTime);
                                setCheckInTimeFrom(updatedDateTime);
                                field.onChange(
                                  updatedDateTime ? updatedDateTime : ""
                                );
                              } else {
                                // setBidDateTime(newValue);
                                // setValue("initialTime", newValue);
                                setCheckInTimeFrom(newValue);
                                field.onChange(newValue ? newValue : "");
                              }
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {errors.inTime && (
                        <ErrorTypography>
                          {errors.inTime.message}
                        </ErrorTypography>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  name="initialTime"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <>
                      <InputLabel>
                        Loading Initiation Time:
                        {/* <span className="mandatory-star">*</span> */}
                      </InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            size="small"
                            sx={{
                              width: "100%",
                            }}
                            label="DD/MM/YYYY hh:mm"
                            format="DD/MM/YYYY hh:mm A"
                            disablePast
                            {...field}
                            onChange={(newValue) => {
                              const selectedDateTime = dayjs(newValue);
                              const currentDateTime = dayjs();

                              // .format("YYYY-MM-DD hh:mm:ss.sss")

                              // Ensure that the selected time is at least 1 hour after the current time
                              const minAllowedDateTime = currentDateTime.add(
                                0,
                                "hour"
                              );

                              if (
                                selectedDateTime.isBefore(minAllowedDateTime)
                              ) {
                                // If the selected date and time is before the minimum allowed time,
                                // set the selected time to the minimum allowed time
                                const updatedDateTime = minAllowedDateTime;
                                // setValue("initialTime", updatedDateTime);
                                setLoadingStartTime(updatedDateTime);
                                field.onChange(
                                  updatedDateTime ? updatedDateTime : ""
                                );
                              } else {
                                // setBidDateTime(newValue);
                                // setValue("initialTime", newValue);
                                setLoadingStartTime(newValue);
                                field.onChange(newValue ? newValue : "");
                              }
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {/* {errors.initialTime && (
                              <ErrorTypography>
                                {errors.initialTime.message}
                              </ErrorTypography>
                            )} */}
                    </>
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  name="completionTime"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <>
                      <InputLabel>Loading Completion Time:</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            size="small"
                            sx={{
                              width: "100%",
                            }}
                            label="DD/MM/YYYY hh:mm"
                            format="DD/MM/YYYY hh:mm A"
                            disablePast
                            {...field}
                            onChange={(newValue) => {
                              const selectedDateTime = dayjs(newValue);
                              const currentDateTime = dayjs();

                              // .format("YYYY-MM-DD hh:mm:ss.sss")

                              // Ensure that the selected time is at least 1 hour after the current time
                              const minAllowedDateTime = loadingStartTime;

                              if (
                                selectedDateTime.isBefore(minAllowedDateTime)
                              ) {
                                // If the selected date and time is before the minimum allowed time,
                                // set the selected time to the minimum allowed time
                                const updatedDateTime = minAllowedDateTime;
                                // setValue("initialTime", updatedDateTime);
                                setLoadingEndTime(updatedDateTime);
                                field.onChange(
                                  updatedDateTime ? updatedDateTime : ""
                                );
                              } else {
                                // setBidDateTime(newValue);
                                // setValue("initialTime", newValue);
                                setLoadingEndTime(newValue);
                                field.onChange(newValue ? newValue : "");
                              }
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {errors.completionTime && (
                        <ErrorTypography>
                          {errors.completionTime.message}
                        </ErrorTypography>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  name="outTime"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <>
                      <InputLabel>Gate-Out Time:</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            size="small"
                            sx={{
                              width: "100%",
                            }}
                            label="DD/MM/YYYY hh:mm"
                            format="DD/MM/YYYY hh:mm A"
                            disablePast
                            {...field}
                            onChange={(newValue) => {
                              const selectedDateTime = dayjs(newValue);
                              const currentDateTime = dayjs();

                              // .format("YYYY-MM-DD hh:mm:ss.sss")

                              // Ensure that the selected time is at least 1 hour after the current time
                              const minAllowedDateTime = loadingEndTime;

                              if (
                                selectedDateTime.isBefore(minAllowedDateTime)
                              ) {
                                // If the selected date and time is before the minimum allowed time,
                                // set the selected time to the minimum allowed time
                                const updatedDateTime = minAllowedDateTime;
                                // setValue("initialTime", updatedDateTime);
                                setCheckOutTimeTo(updatedDateTime);
                                field.onChange(
                                  updatedDateTime ? updatedDateTime : ""
                                );
                              } else {
                                // setBidDateTime(newValue);
                                // setValue("initialTime", newValue);
                                setCheckOutTimeTo(newValue);
                                field.onChange(newValue ? newValue : "");
                              }
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {errors.outTime && (
                        <ErrorTypography>
                          {errors.outTime.message}
                        </ErrorTypography>
                      )}
                    </>
                  )}
                />
              </Grid>

              <RegisterCard title="Company Doc">
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12}>
                    <div
                      style={{
                        textAlign: "end",
                        position: "relative",
                        bottom: "50px",
                      }}
                    >
                      {docPath && (
                        <a
                          href={`${baseUrl}/service/file/download/all/${shipper_id}/${docPath}`}
                        >
                          <DownloadIcon />
                          {/* {docPath} */}
                        </a>
                      )}
                    </div>
                    <div
                      id="file-drop"
                      style={{
                        border: "2px dashed rgba(171, 191, 201, 0.80)",
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      onDrop={handleFileDropVehicleDoc}
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
                        doc, docx, png, jpg, jpeg, pdf, xls, xlsx are allowed
                        format and file size not more than 10MB for single file
                      </Typography>
                      <input
                        type="file"
                        id="fileInputVD"
                        style={{ display: "none" }}
                        multiple
                        accept=".doc, .png, .jpg, .jpeg, .pdf, .xls, .xlsx, .docx"
                        onChange={handleFileInputChangeVehicleDoc}
                      />

                      <Button
                        variant="outlined"
                        sx={{ marginTop: "24px" }}
                        onClick={() =>
                          document.getElementById("fileInputVD").click()
                        }
                      >
                        {" "}
                        Choose a File
                      </Button>
                    </div>
                    {errors.vehicle_doc && (
                      <ErrorTypography>
                        {errors.vehicle_doc.message}
                      </ErrorTypography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={12}>
                    {selectedFilesVehicleDoc.map((file, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        marginBottom="16px"
                      >
                        <img
                          src={iconList[file.split(".").pop()]}
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
                        <IconButton
                          onClick={() => handleRemoveFileVehicleDoc(index)}
                        >
                          <Clear />
                        </IconButton>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </RegisterCard>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Controller
                  name="materialType"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <>
                      <Tooltip
                        title={`Selected: ${field.value
                          .map(
                            (id) =>
                              materials.find((item) => item.id === id)?.name
                          )
                          .join(", ")}`}
                      >
                        <InputLabel
                          htmlFor="materialType"
                          shrink
                          sx={{
                            fontSize: "17px",
                          }}
                        >
                          Material type*
                        </InputLabel>
                      </Tooltip>

                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={Boolean(errors.materialType)}
                      >
                        <Select
                          {...field}
                          labelId="bid-label"
                          id="materialType"
                          label=""
                          IconComponent={KeyboardArrowDownIcon}
                          multiple
                          renderValue={(selected) =>
                            selected
                              .map(
                                (id) =>
                                  materials.find((item) => item.id === id)?.name
                              )
                              .join(", ")
                          }
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300, // Set the maximum height for the menu
                              },
                            },
                          }}
                        >
                          {materials.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              <Checkbox
                                checked={field.value.includes(item.id)}
                              />
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.materialType && (
                          <ErrorTypography>
                            {errors.materialType.message}
                          </ErrorTypography>
                        )}
                      </FormControl>
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={6}>
                <Controller
                  name="ewayBill"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="ewayBill"
                        shrink
                        sx={{
                          fontSize: "20px",
                        }}
                      >
                        eWay Bill Number
                      </InputLabel>
                      <TextField
                        {...field}
                        label=""
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={Boolean(errors.ewayBill)}
                        helperText={errors.ewayBill?.message}
                      />
                    </>
                  )}
                />
              </Grid>
              {/* 
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel id="demo-simple-select-disabled-label">
                  eWay Bill expire date
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DateTimePicker", "DateTimePicker"]}
                  >
                    <DatePicker
                      disablePast
                      format="DD/MM/YYYY "
                      value={eWayBillDate}
                      onChange={(newValue) => setEWayBillDate(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid> */}
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Controller
                  name="eWayBillTime"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <>
                      <InputLabel id="demo-simple-select-disabled-label">
                        eWay Bill Time
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            size="small"
                            sx={{
                              width: "100%",
                            }}
                            label="DD/MM/YYYY hh:mm"
                            format="DD/MM/YYYY hh:mm A"
                            disablePast
                            {...field}
                            value={eWayBillDate}
                            onChange={(date) => {
                              // const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                              field.onChange(date);
                              setEWayBillDate(data);
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {/* {errors.eWayBillTime && (
                              <ErrorTypography>
                                {errors.eWayBillTime.message}
                              </ErrorTypography>
                            )} */}
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Controller
                  name="comment"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="comment"
                        shrink
                        sx={{
                          fontSize: "17px",
                        }}
                      >
                        Comment
                      </InputLabel>

                      <TextField
                        {...field}
                        // label={!commentData ? "No Comments" : null} //state ? state : ''
                        variant="outlined"
                        fullWidth
                        size="small"
                        // value={commentData ?? null}
                        // disabled={true}
                        // error={Boolean(errors.comment)}
                        // helperText={errors.comment?.message}
                      />
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid
          item
          md={6}
          id="GogMAp"
          sx={{
            zIndex: isFullScreen ? 14 : 0,
            height: isFullScreen ? "100vh" : "auto", // Set height to 100% of the viewport when isFullScreen is true
            width: isFullScreen ? "100vw" : "100%", // Set width to 100% of the viewport when isFullScreen is true
            position: isFullScreen ? "fixed" : "static", // Fix the position when isFullScreen is true
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Card
            style={{
              padding: "10px",
              width: isFullScreen ? "100vw" : "",
              height: isFullScreen ? "100vh" : "85vh",
            }}
          >
            <div className="customCardheader">
              <Typography variant="h4"> Google Map</Typography>
            </div>
            <GogMapLoad
              // setMapSource={getSourceDestination}
              // handleFullScreen={handleFullScreen}
              // mapfullScreen={isFullScreen}
              // mapReset={mapReset}
              // setMapreset={setMapReset}
              setMapSource={getSourceDestination}
              handleFullScreen={handleFullScreen}
              mapfullScreen={isFullScreen}
              mapReset={mapReset}
              setMapreset={setMapReset}
              viewSrcDest={branchInfo}
              originSelected={setOriginSelected}
              accordianOpen={true}
              optimization={true}
            />
          </Card>
        </Grid>
      </Grid>

      <div className="buttonsCard">
        {/* <Button variant="contained" onClick={handleAddInvoiceClick}>
          <ReceiptIcon sx={{ mr: 2 }} /> Add Invoice
        </Button>
        <Button variant="contained" onClick={handleAddEwayBillClick}>
          <DescriptionIcon sx={{ mr: 2 }} /> Add eWay Bill
        </Button> */}

        <Button variant="contained" type="submit">
          Save As Draft
        </Button>

        {/* <Button variant="contained" onClick={handleAddItemDetailsClick}>
          <PostAddIcon sx={{ mr: 2 }} /> Add Item Details
        </Button> */}
      </div>

      {/* Add Invoice Modal */}
      <Dialog open={isAddInvoiceOpen} onClose={handleCloseAddInvoice}>
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
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseAddInvoice}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add eBay Bill Modal */}
      <Dialog open={isAddEwayBillOpen} onClose={handleCloseAddEwayBill}>
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
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseAddEwayBill}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddItemDetailsOpen} onClose={handleCloseAddItemDetails}>
        <div style={{ marginBottom: "0px" }} className="customCardheader">
          <Typography variant="h4">{addItemDialogTitle}</Typography>
        </div>
        <DialogContent>
          {/* Three text fields */}
          <Typography sx={{ mb: 2 }}>Enter Item Details:</Typography>
          <Grid
            alignContent={"center"}
            justifyContent={"center"}
            container
            spacing={2}
          >
            <Grid item md={4}>
              <TextField
                label="Item Name"
                variant="outlined"
                size="small"
                fullWidth
                value={itemName} // Set the value of the input field
                onChange={(e) => setItemName(e.target.value)}
              />
            </Grid>

            <Grid item md={3}>
              <TextField
                label="UOM"
                size="small"
                variant="outlined"
                value={itemUom} // Set the value of the input field
                onChange={(e) => setItemUom(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item md={3}>
              <TextField
                label="Item Qty/Weight"
                variant="outlined"
                type="number"
                fullWidth
                size="small"
                value={itemQty} // Set the value of the input field
                onChange={(e) => setItemQty(e.target.value)}
              />
            </Grid>
            <Grid item md={2}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 0.5 }}
                onClick={handleItemDetailsSubmit}
              >
                Add
              </Button>
            </Grid>

            <Grid item md={12}>
              {itemDetails.length > 0 && (
                <div>
                  <Typography sx={{ mb: 2 }}>
                    Submitted Item Details:
                  </Typography>

                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item Name</TableCell>
                          <TableCell>UOM</TableCell>
                          <TableCell>Item Qnty/Weight</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itemDetails.map((item, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.uom}</TableCell>
                            <TableCell>{item.itemQty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseAddItemDetails}>
            Submit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseAddItemDetails}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default PreTrackingFormComponent;
