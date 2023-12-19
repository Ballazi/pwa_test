import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import TransporterDetails from '../transporter-details/TransporterDetails';
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import FilterComponent from "../../../../components/masterData/filter-component/FilterComponent";
import { decodeToken } from "react-jwt";
import { viewUOM } from "../../../../api/master-data/uom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import {
  Typography,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  Autocomplete,
} from "@mui/material";
import {
  viewCommentForTracking,
  viewBranch,
} from "../../../../api/trip-management/create-trip";
import { ResendConsent } from "../../../../api/tracking/tracking";
import {
  getRegion,
  viewSpecificBranch,
} from "../../../../api/trip-management/create-trip";
import ManagetrackingForm from "../managetracking-form/ManagetrackingForm";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import GogMapLoad from "../../../load-management/create-load/GogMapLoad";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import { useForm, Controller } from "react-hook-form";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MessageIcon from "@mui/icons-material/Message";
import SyncIcon from "@mui/icons-material/Sync";
import ErrorTypography from "../../../../components/typography/ErrorTypography";
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

import BackdropComponent from "../../../../components/backdrop/Backdrop";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Dialog,
  Card,
  Select,
  FormControlLabel,
  Checkbox,
  DialogContent,
  DialogActions,
  InputLabel,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";

import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import NoteAddIcon from "@mui/icons-material/NoteAdd";
// import {  viewDetails, addNewInvoice,viewItemDetails } from "../../../api/pre-tracking/DraftTable";
import {
  viewDetails,
  addNewInvoice,
  viewItemDetails,
  giveConsent,
} from "../../../../api/pre-tracking/DraftTable";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  requiredValidator,
  nameValidator,
  contactNumberValidator,
  noOfVehicleValidator,

  // vehicleNumberValidator,
} from "../../../../validation/common-validator";
import { openSnackbar } from "../../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import { getFleetInfo } from "../../../../api/editFlit/editfleet";
import { viewNetworkProvider } from "../../../../api/trip-management/manage-trip";
import {
  viewShiper,
  viewNetWork,
  viewMaterials,
  viewVehicle,
  viewTransporter,
  update,
  // UpdateBid,

  // viewBid,
  // viewSegment,
  // viewComment,
  save,
} from "../../../../api/trip-management/create-preTraking";
import { viewShipperTracking } from "../../../../api/trip-management/create-trip";
import {
  getBase64Multiple,
  getBase64MultipleArray,
  getBase64SingleFile,
} from "../../../../utility/utility-function";
import { EndTripTracking } from "../../../../api/pre-tracking/DraftTable";
import { saveMaterials } from "../../../../api/tracking/tracking";
import RegisterCard from "../../../../components/card/RegisterCard";
const baseUrl = import.meta.env.VITE_TMS_APP_API_URL;
import { fetchSimNetworkPro } from "../../../../api/trip-management/manage-trip";
// const schema = yup.object().shape({
//   shipper: requiredValidator("Shipper"),
//   transporter: requiredValidator("transporter"),
//   vehicleType: requiredValidator("vehicle"),
//   customerContactName: nameValidator,
//   contactNumber: contactNumberValidator,
//   // vehicleNumber: vehicleNumberValidator,
//   // driverContactName: contactNumberValidator,
//   networkProvider: requiredValidator("Network Service Provider"),
//   // materialType: requiredValidator("Materials details  "),
//   // gpsType: requiredValidator("Gps "),
//   // checkoutTime: requiredValidator("checkout Time"),
//   noOfVehicle: requiredValidator("vehicle number"),
//   driverContactNumber: contactNumberValidator,
// });

export default function TrackingTable({
  status,
  data,
  fetchData,
  applyFilter,
  tabValue,
  selectedId,
}) {
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
    // reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shipper: "",
    },
  });

  const dispatch = useDispatch();
  const [tabData, setTabData] = useState([]);
  const [tableData, setTableData] = useState([...data]);
  const [veichleDocuments, setVeichleDocuments] = useState("");
  const [apiveichleDoc, setApiveichleDoc] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openMaterialModal, setOpenMaterialModal] = useState(false);
  const [editedInvoices, setEditedInvoices] = useState([]);
  const userType = localStorage.getItem("user_type");
  const [editedMaterials, setEditedMaterials] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [docPath, setDocPath] = useState(null);
  const [docPathCD, setDocPathCD] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedVehicleFiles, setSelectedVehicleFiles] = useState([]);
  const [checkInTimeFrom, setCheckInTimeFrom] = useState(null);
  const [checkOutTimeTo, setCheckOutTimeTo] = useState(null);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [loadingEndTime, setLoadingEndTime] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [eWayBillDate, setEWayBillDate] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [networkProvider, setNetworkProvider] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [transporter, setTransporter] = useState([]);
  const [shipperList, setShipperList] = useState([]);
  const [uOM, setUOM] = useState([]);
  const [materialNames, setMaterialNames] = useState("");
  const [materialUOM, setMaterialUOM] = useState("");
  const [progressendTrip, setProgressEndTrip] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [addressValues, setAddressValues] = useState([]);
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
  let fileUploadProgress = {};
  const [companyDocuments, setCompanyDocument] = useState([]);
  const [reportingTimeFrom, setReportingTimeFrom] = useState(
    dayjs("2023-09-17T15:30")
  );
  const [reportingTimeTo, setReportingTimeTo] = useState(
    dayjs("2023-10-17T15:30")
  );
  const [bidDateTime, setBidDateTime] = useState(dayjs("2023-09-17T15:30"));

  const [updatedSourceDest, setUpdatedSourceDest] = useState({});

  const [shipperId, setShipperId] = useState("");
  const [apiCompanyDoc, setApiCompanydoc] = useState("");
  const [documents, setDocuments] = useState([]);
  const [documentsVehicleDoc, setDocumentsVehicleDoc] = useState([]);
  const [selectedFilesVehicleDoc, setSelectedFilesVehicleDoc] = useState([]);

  const [newInvoice, setNewInvoice] = useState({
    invoice_no: "",
    invoice_amount: 0,
    invoice_date: "",
  });
  const [newMaterial, setNewMaterial] = useState({
    item_id: "",
    item_uom: "",
    dispatch_item_qty: 0,
  });
  const token = JSON.parse(localStorage.getItem("authToken"));
  let operational_accesses = null;
  let superAdmin = false;

  if (token) {
    superAdmin = decodeToken(token)?.access?.SA;
    operational_accesses = decodeToken(token)?.access?.operational_access;
  }

  const handleAddItemDetailsClick = () => {
    setAddItemDialogTitle("Add Item Details");
    setIsAddItemDetailsOpen(true);
  };
  const filterStateHandler = (flag, filter_data) => {
    applyFilter(filter_data);
  };
  function handleFullScreen(val) {
    if (val === 1) {
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }
  function resendConsentResponse(rows) {
    // let consent_resp = ResendConsent(rows.contact);
    ResendConsent(rows.contact).then((res) => {
      if (res.data.success === true) {
        dispatch(
          openSnackbar({
            type: "success",
            message: res.data.clientMessage,
          })
        );
      } else {
        dispatch(
          openSnackbar({
            type: "error",
            message: res.data.clientMessage,
          })
        );
      }
    });
  }

  function getSourceDestination(val_all, src, dest) {
    let val = { load_dest: dest, load_source: src };
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
    const load_source = src;
    const load_dest = dest; // Change 'destination' to 'load_dest'

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
    }
    setAddressValues(updatedAddress);
  }

  const handleSelectFileDrop = (event) => {
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
      setValue("company_doc");
    }
  };

  const handleAddInvoiceClick = () => {
    setIsAddInvoiceOpen(true);
  };
  const handleAddEwayBillClick = () => {
    setIsAddEwayBillOpen(true);
  };

  const handleAddNewInvoice = () => {
    setEditedInvoices([...editedInvoices, newInvoice]);
    setNewInvoice({
      invoice_no: "",
      invoice_amount: 0,
      invoice_date: "",
    });
  };
  //
  const handleAddNewMaterial = () => {
    setEditedMaterials([...editedMaterials, newMaterial]);
    setNewMaterial({
      item_id: "",
      item_uom: "",
      dispatch_item_qty: 0,
    });
  };
  function handleEditMaterialField(index, field, value) {
    editedMaterials[index][field] = value;
    setEditedMaterials([...editedMaterials]);
  }

  const handleSaveMaterials = () => {
    if (selectedRow) {
      const allMaterialData = [];
      const rowIndex = data.findIndex((row) => row.id === selectedRow.id);
      const updatedDraftData = [...data];

      if (rowIndex !== -1) {
        updatedDraftData[rowIndex].materials = editedMaterials;
      }

      editedMaterials.forEach((material, index) => {
        allMaterialData.push({
          material_id: material.material_id ? material.material_id : null,
          material_tracking_fleet_id: selectedRow.id,
          itemName: material.itemName,
          uom: material.item_uom,
          quantity: material.dispatch_item_qty,
          is_updated: material.is_updated || false,
        });
      });

      // Assuming you have an API function similar to addNewInvoice for adding materials
      saveMaterials(allMaterialData)
        .then((res) => {
          if (res.data.success === false) {
            dispatch(
              openSnackbar({
                type: "error",
                message: res.data.clientMessage,
              })
            );
          } else {
            // Handle success
            setOpenMaterialModal(false);
            setSelectedRow(null);
            dispatch(
              openSnackbar({
                type: "success",
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const handleSaveInvoices = () => {
    if (selectedRow) {
      const allInvoiceData = [];
      const rowIndex = data.findIndex((row) => row.id === selectedRow.id);
      const updatedDraftData = [...data];

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
            dispatch(
              openSnackbar({
                type: "error",
                message: res.data.clientMessage,
              })
            );
          } else {
            dispatch(
              openSnackbar({
                type: "success",
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => console.log(err));

      setOpenEditModal(false);
      setSelectedRow(null);
    }
  };

  const onSubmit = async (value) => {
    setIsLoading(true);

    const docArray = value.documents ? value.documents : "";
    const docArrayDC = value.vehicle_doc ? value.vehicle_doc : "";
    let company_docs = null;
    let vehicle_docs = null;
    if (docArray !== "") {
      company_docs = await getBase64MultipleArray(value.documents);
    }
    if (docArrayDC !== "") {
      vehicle_docs = await getBase64MultipleArray(value.vehicle_doc);
    }

    if (addressValues.length == 0) {
      setIsLoading(false);
      dispatch(
        openSnackbar({
          type: "error",
          message: "sources and destination is required",
        })
      );
    } else {
      var res = await update(
        value,

        selectedRow,
        addressValues,

        // commentData,
        checkInTimeFrom,
        checkOutTimeTo,
        loadingStartTime,
        loadingEndTime,
        company_docs,
        vehicle_docs,
        eWayBillDate,

        // eta,
        // bidDateTime
        updatedSourceDest
      );
      if (res.data.success === true) {
        // setUpdateUseEffect(!updateUseEffect);
        // reset();
        // setCheckInTimeFrom(null);
        // setCheckOutTimeTo(null);
        // setLoadingStartTime(null);
        // setLoadingEndTime(null);
        // setEWayBillDate(null);
        // setSelectedFiles([]);
        // setSelectedVehicleFiles([]);

        setIsLoading(false);
        setVehicleInfo(false);
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

  var initialRows = [];
  useEffect(() => {
    // if (status === "Draft") {
    //   fetchNetworkProvider();
    //   fetchShiper();
    //   fetchVehicleData();
    // }
    fetchNetworkProvider();
    fetchShiper();
    fetchVehicleData();
    setIsLoading(true);
    initialRows =
      status === "Draft"
        ? data.map((item, index) => ({
            id: item.tf_id,
            loadId: item.tf_bidding_load_id
              ? `L-${item.tf_bidding_load_id.slice(-5)}`.toUpperCase()
              : "-",
            trackId: `T-${item.tf_id.slice(-5)}`.toUpperCase(),
            transporter: "Blue Dart",
            contact: item.driver_number,
            source: item.src_addrs,
            destination: item.dest_addrs,
            reportingDate: item.loading_start,
            noOfVehicle: item.fleet_no,
            epod_type: item.epod_type,
          }))
        : status === "Consent Pending"
        ? data.map((item, index) => ({
            id: item.tf_id,
            loadId: item.tf_bidding_load_id
              ? `L-${item.tf_bidding_load_id.slice(-5)}`
              : "-",
            trackId: `T-${item.tf_id.slice(-5)}`,
            transporter: "Blue Dart",
            contact: item.driver_number,
            source: item.src_addrs,
            destination: item.dest_addrs,
            reportingDate: item.loading_start,
            noOfVehicle: item.fleet_no,
          }))
        : // [
        //   {
        //     id: "L-112",
        //     trackId: "T-15",
        //     transporter: "Blue Dart",
        //     contact: "8910000000",
        //     source: "Bangalore",
        //     destination: "Delhi",
        //     reportingDate: "2023-08-25",
        //     noOfVehicle: "WB-82k67",
        //   },
        //   // Add more rows as needed
        // ]
        status === "In Progress"
        ? data.map((item, index) => ({
            id: item.tf_id,
            loadId: item.tf_bidding_load_id
              ? `L-${item.tf_bidding_load_id.slice(-5)}`
              : "-",
            trackId: `T-${item.tf_id.slice(-5)}`,
            // trackId: `T-${index + 1}`,
            transporter: "Blue Dart",
            contact: item.driver_number,
            source: item.src_addrs,
            destination: item.dest_addrs,
            reportingDate: item.loading_start,
            noOfVehicle: item.fleet_no,
          }))
        : status === "Completed" || status === "Pending Delivery"
        ? data.map((item, index) => ({
            id: item.tf_id,
            loadId: item.tf_bidding_load_id
              ? `L-${item.tf_bidding_load_id.slice(-5)}`
              : "-",
            trackId: item.tf_id ? `T-${item.tf_id.slice(-5)}` : "-",
            transporter: "Blue Dart1",
            contact: item.driver_number,
            source: item.src_addrs,
            destination: item.dest_addrs,
            reportingDate: item.loading_start,
            noOfVehicle: item.fleet_no,
          }))
        : [
            {
              id: 1,
              loadId: "L-12",
              trackingid: "TR-001",
              ShipperName: "Shipper Kolkata",
              region: "Kolkata",
              source: "Kolkata",
              branchName: "Sector V",
              transporter: "Ekart",
              destination: "Bihar",
              contact: "8910000000",
              VehicleNo: "Wb-2321",
              status: "Not Stared",
            },
            {
              id: 2,
              loadId: "L-12",
              trackingid: "TR-002",

              transporter: "Blue Dart",
              source: "Noida",
              destination: "Pune",
              contact: "8910000000",
              VehicleNo: "Wb-123",
              status: "Live",
            },
            {
              id: 3,
              loadId: "L-12",
              trackingid: "TR-003",

              transporter: "Delhivery",
              source: "Chandigarh",
              destination: "Vishakhapattnam",
              contact: "8910000000",
              VehicleNo: "Wb-1223",
              status: "Completed",
            },
            // Add more rows as needed
          ];
    setRows(initialRows);
    setFilterData(initialRows);

    setIsLoading(false);
  }, [status, data, openConfirmation]);

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

  const fetchuomData = () => {
    return viewUOM()
      .then((data) => {
        if (data.success === true) {
          const updatedUOM = data.data.map((item) => ({
            id: item.id,
            type: item.type,
          }));
          setUOM(updatedUOM);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          // setUOM([])
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  useEffect(() => {
    fetchMaterialsData();
    fetchuomData();
  }, []);

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
  const fetchShiper = () => {
    return viewShipperTracking()
      .then((data) => {
        if (data.success === true) {
          // let tempData = [];
          const tempData = data.data.map((item, index) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          setShipperList(tempData);
        } else {
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {});
  };

  const fetchTransporter = (id) => {
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

  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
    },
  }));

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  const handleInputChange = (event) => {
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
  const handleInvoices = (row) => {
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
  const handleAddMaterial = (row) => {
    setSelectedRow(row);
    const payload = {
      tracking_fleet_id: row.id,
    };
    setOpenMaterialModal(true);
    return viewItemDetails(payload)
      .then((res) => {
        if (res.data.success === true) {
          // setEditedInvoices(res.data.data);
          setEditedMaterials(res.data.data);
        } else {
          // Handle the error
        }
      })
      .catch((error) => {
        // Handle the error
      });
  };

  const giveConcern = (row) => {
    setSelectedRow(row);

    setOpenConfirmation(true);
  };
  const endTrip = (row) => {
    setSelectedRow(row);
    setProgressEndTrip(true);
  };

  const finalEndTrip = () => {
    const payload = {
      fleet_id: selectedRow.id,
      status: "completed",
    };
    return EndTripTracking(payload).then((res) => {
      if (res.data.success === true) {
        setProgressEndTrip(false);
        fetchData(2);
        setSelectedRow(null);
        dispatch(
          openSnackbar({
            type: "success",
            message: res.data.clientMessage,
          })
        );
      } else {
        dispatch(
          openSnackbar({
            type: "error",
            message: res.data.clientMessage,
          })
        );
      }
    });
  };
  const finalconfirmation = () => {
    const payload = {
      fleet_id: selectedRow.id,
    };

    return giveConsent(payload)
      .then((res) => {
        if (res.data.success === true) {
          setOpenConfirmation(false);
          fetchData(0);
          setSelectedRow(null);
          dispatch(
            openSnackbar({
              type: "success",
              message: res.data.clientMessage,
            })
          );
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: res.data.clientMessage,
            })
          );
        }
      })
      .catch((error) => {
        setOpenConfirmation(false);
      });
  };

  const columns =
    status === "Draft"
      ? [
          { field: "loadId", headerName: "Load ID", width: 100 },
          { field: "trackId", headerName: "Track ID", width: 80 },
          { field: "transporter", headerName: "Transporter Name", width: 150 },
          { field: "contact", headerName: "Contact Number", width: 150 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          { field: "noOfVehicle", headerName: "Vehicles Number", width: 115 },
          {
            field: "action",
            headerName: "Action",
            width: 250,
            renderCell: (params) => (
              <>
                {params.row.epod_type === "none" ? (
                  ""
                ) : (
                  <>
                    {params.row.epod_type === "invoice_wise" ? (
                      <Tooltip title="View/Edit Invoices">
                        <IconButton
                          onClick={() => handleInvoices(params.row)}
                          aria-label="edit"
                        >
                          <NoteAddIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="View/Edit Material">
                        <IconButton
                          onClick={() => handleAddMaterial(params.row)}
                          aria-label="add"
                        >
                          <LibraryAddIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_tracking_view) && (
                  <Tooltip title="View/Edit">
                    <IconButton
                      onClick={() => handleVehicle(params.row)}
                      aria-label="track"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Send Consent">
                  <IconButton
                    onClick={() => giveConcern(params.row)}
                    aria-label="track"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ]
      : status === "Consent Pending"
      ? [
          { field: "loadId", headerName: "Load ID", width: 80 },
          { field: "trackId", headerName: "Track ID", width: 80 },
          { field: "transporter", headerName: "Transporter Name", width: 150 },
          { field: "contact", headerName: "Contact Number", width: 150 },
          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },

          { field: "noOfVehicle", headerName: "Vehicles Number", width: 115 },
          //     { field: 'VehicleStatus', headerName: 'Vehicles Status', width: 150,

          //     renderCell: (params) => (
          // "2 pending"
          //     )

          //   },
          {
            field: "action",
            headerName: "Action",
            width: 130,
            renderCell: (params) => (
              <div>
                <Tooltip title="Resend Consent ">
                  <IconButton
                    aria-label="track"
                    onClick={() => resendConsentResponse(params.row)}
                  >
                    <MessageIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sync ">
                  <IconButton aria-label="track">
                    <SyncIcon />
                  </IconButton>
                </Tooltip>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_tracking_view) && (
                  <Tooltip title="View/Edit">
                    <IconButton
                      onClick={() => handleVehicle(params.row)}
                      aria-label="track"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            ),
          },
        ]
      : status === "In Progress"
      ? [
          { field: "loadId", headerName: "Load ID", width: 80 },
          { field: "trackId", headerName: "Track ID", width: 80 },
          { field: "transporter", headerName: "Transporter Name", width: 150 },
          { field: "contact", headerName: "Contact Number", width: 130 },

          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },

          { field: "noOfVehicle", headerName: "Vehicles Number", width: 140 },
          //     { field: 'VehicleStatus', headerName: 'Vehicles Status', width: 150,

          //     renderCell: (params) => (
          // "2 pending"
          //     )

          //   },
          {
            field: "action",
            headerName: "Action",
            width: 130,
            renderCell: (params) => (
              <>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_tracking_view) && (
                  <Tooltip title="View Trip">
                    <IconButton
                      size="small"
                      onClick={() => handleActionClick(params.row)}
                    >
                      <LocalShippingIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_tracking_view) && (
                  <Tooltip title="View Load">
                    <IconButton
                      onClick={() => handleDisable(params.row)}
                      aria-label="track"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="End Tracking">
                  <IconButton
                    size="small"
                    onClick={() => endTrip(params.row)}
                    aria-label="delete"
                  >
                    <DoDisturbIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ]
      : status === "Completed"
      ? [
          { field: "loadId", headerName: "Load ID", width: 80 },
          { field: "trackId", headerName: "Track ID", width: 80 },
          { field: "transporter", headerName: "Transporter Name", width: 150 },
          { field: "contact", headerName: "Contact Number", width: 130 },

          { field: "source", headerName: "Source", width: 150 },
          { field: "destination", headerName: "Destination", width: 150 },
          { field: "reportingDate", headerName: "Reporting Date", width: 150 },
          { field: "noOfVehicle", headerName: "Vehicles Number", width: 140 },
          //     { field: 'VehicleStatus', headerName: 'Vehicles Status', width: 150,

          //     renderCell: (params) => (
          // "2 pending"
          //     )

          //   },
          {
            field: "action",
            headerName: "Action",
            width: 130,
            renderCell: (params) => (
              <>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_tracking_view) && (
                  <Tooltip title="View Trip">
                    <IconButton
                      size="small"
                      onClick={() => handleActionClick(params.row)}
                    >
                      <LocalShippingIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_tracking_view) && (
                  <Tooltip title="View Load">
                    <IconButton
                      onClick={() => handleDisable(params.row)}
                      aria-label="track"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {/* <Tooltip title="End Trip">
                  <IconButton
                    size="small"
                    onClick={() => handleActionClick(params.row)}
                    aria-label="delete"
                  >
                    <DoDisturbIcon />
                  </IconButton>
                </Tooltip> */}
              </>
            ),
          },
        ]
      : [
          { field: "loadId", headerName: "Load Id", width: 100 },
          { field: "trackId", headerName: "Track ID", width: 80 },

          { field: "transporter", headerName: "Transporter", width: 120 },
          { field: "contact", headerName: "Contact Number", width: 130 },
          { field: "source", headerName: "Source", width: 120 },
          { field: "destination", headerName: "Destination", width: 120 },
          { field: "noOfVehicle", headerName: "Vehicle Number", width: 160 },

          {
            field: "action",
            headerName: "Action",
            width: 120,
            renderCell: (params) => (
              <>
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_tracking_view) && (
                  <Tooltip title="View Trip">
                    <IconButton
                      size="small"
                      onClick={() => handleActionClick(params.row)}
                    >
                      <LocalShippingIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {(userType === "acu" ||
                  superAdmin ||
                  operational_accesses?.allow_tracking_view) && (
                  <Tooltip title="View Load">
                    <IconButton
                      onClick={() => handleDisable(params.row)}
                      aria-label="track"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="End Tracking">
                  <IconButton
                    size="small"
                    onClick={() => handleActionClick(params.row)}
                    aria-label="delete"
                  >
                    <DoDisturbIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ];
  function fileHandler(playload) {}

  const [openModal, setOpenModal] = React.useState(false);
  const [openVehicleInfo, setVehicleInfo] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [rows, setRows] = useState(initialRows);
  const [filteredDate, setFilteredDate] = useState(initialRows);
  const [selectedRow, setSelectedRow] = useState(null);
  function viewSourceDestination(value) {
    console.log("source destination", value);
    let srcList = [];
    let destList = [];
    value.map((value, index) => {
      let src_addrs =
        value.src_city + "," + value.src_state + "," + value.src_country;
      let dest_addrs =
        value.dest_city + "," + value.dest_state + "," + value.dest_country;
      if (!srcList.includes(src_addrs)) {
        srcList.push(src_addrs);
      }
      if (!destList.includes(dest_addrs)) {
        destList.push(dest_addrs);
      }
    });

    setUpdatedSourceDest({ src: srcList, dest: destList });
  }

  const handleActionClick = (row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };
  function handleDeleteMaterial(index) {
    editedMaterials.splice(index, 1);
    setEditedMaterials([...editedMaterials]);
  }

  const fetchNetworkProvider = () => {
    setIsLoading(true);
    viewNetworkProvider()
      .then((res) => {
        if (res.data.success === true) {
          const options = res.data.data.map((ele) => {
            return {
              label: ele.name,
              value: ele.id,
            };
          });
          setNetworkProvider(options);
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
  };
  const [disbaleModel, setDisableModel] = useState();
  const fetchRegionData = (id) => {
    setIsLoading(true);
    const payload = {
      shipper_id: id,
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

  const fetchBranchData = (id) => {
    // alert("ok")
    const shipperId = getValues("shipper");
    //  alert (shipperId)
    setIsLoading(true);

    const payload = {
      shipper_id: id,
    };
    console.log("payload", payload);

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
  const handleDisable = (row) => {
    setDisableModel(true);

    setSelectedRow(row);

    return getFleetInfo(row.id)
      .then((res) => {
        if (res.data.success === true) {
          if (res.data.data.alternate_driver_number) {
            setIsAlternateContactSelected(true);
          }
          setValue("customerContactName", res.data.data.customer_name);
          setValue("contactNumber", res.data.data.customer_no);
          setValue("noOfVehicle", res.data.data.fleet_no);
          setValue("driverContactNumber", res.data.data.driver_number);
          setValue("ewayBill", res.data.data.eway);
          setValue("networkProvider", res.data.data.tf_netw_srvc_prvd_id);
          fetchRegionData(res.data.data.tf_shipper_id);
          fetchBranchData(res.data.data.tf_shipper_id);

          setValue("region", res.data.data.tf_region_cluster_id);
          setValue("branch", res.data.data.tf_branch_id);
          setValue("shipper", res.data.data.tf_shipper_id);
          setValue("transporter", res.data.data.tf_transporter_id);
          setValue("vehicleType", res.data.data.tf_fleet_type_id);
          setValue(
            "alternate_driver_number",
            res.data.data.alternate_driver_number
          );
          setValue(
            "tf_altr_netw_srvc_prvd_id",
            res.data.data.tf_altr_netw_srvc_prvd_id
          );
          viewSourceDestination(res.data.data.srcdest_list);

          setValue("checkInTimeValidator", dayjs(res.data.data.gate_in));
          setValue("initialTime", dayjs(res.data.data.loading_start));
          setValue("completionTime", dayjs(res.data.data.loading_end));
          setValue("outTime", dayjs(res.data.data.gate_out));

          setCheckInTimeFrom(dayjs(res.data.data.gate_in));
          setCheckOutTimeTo(dayjs(res.data.data.gate_out));
          setLoadingEndTime(dayjs(res.data.data.loading_end));
          setLoadingStartTime(dayjs(res.data.data.loading_start));
          setEWayBillDate(dayjs(res.data.data.eway_expire));
          fetchTransporter(res.data.data.tf_shipper_id);
          setShipperId(res.data.data.tf_shipper_id);
          setDocPath(res.data.data.vehicle_doc_link);
          setDocPathCD(res.data.data.company_doc_link);

          // setDocPath({ fleet: true, company: true });
          setApiveichleDoc(res.data.data.vehicle_doc_link);
          setApiCompanydoc(res.data.data.company_doc_link);
          setValue(
            "materialType",
            res.data.data.material_list.map((val) => val.mlm_material_id)
          );
          getSourceDestination(values["srcdest_list"]);

          //  shipper: requiredValidator("Shipper"),
          //  transporter: requiredValidator("transporter"),
          //  vehicleType: requiredValidator("vehicle"),
          //  customerContactName: nameValidator,
          //  contactNumber: contactNumberValidator,
          //  // vehicleNumber: vehicleNumberValidator,
          //  // driverContactName: contactNumberValidator,
          //  networkProvider: requiredValidator("Network Service Provider"),
          //  materialType: requiredValidator("Materials details  "),
          //  // gpsType: requiredValidator("Gps "),
          //  // checkoutTime: requiredValidator("checkout Time"),
          //  noOfVehicle: requiredValidator("vehicle number"),
          //  driverContactNumber: contactNumberValidator,
        } else {
        }
      })
      .catch((error) => {
        setOpenConfirmation(false);
      });
  };
  const handleVehicle = (row) => {
    setSelectedRow(row);
    setVehicleInfo(true);

    return getFleetInfo(row.id)
      .then((res) => {
        if (res.data.success === true) {
          if (res.data.data.alternate_driver_number) {
            setIsAlternateContactSelected(true);
          }

          fetchRegionData(res.data.data.tf_shipper_id);
          fetchBranchData(res.data.data.tf_shipper_id);
          setValue("region", res.data.data.tf_region_cluster_id);
          setValue("branch", res.data.data.tf_branch_id);

          setValue("customerContactName", res.data.data.customer_name);
          setValue("contactNumber", res.data.data.customer_no);
          setValue("noOfVehicle", res.data.data.fleet_no);
          setValue("driverContactNumber", res.data.data.driver_number);
          setValue("ewayBill", res.data.data.eway);
          setValue("networkProvider", res.data.data.tf_netw_srvc_prvd_id);
          setValue("shipper", res.data.data.tf_shipper_id);
          setValue("transporter", res.data.data.tf_transporter_id);
          setValue("vehicleType", res.data.data.tf_fleet_type_id);
          setValue(
            "alternate_driver_number",
            res.data.data.alternate_driver_number
          );
          setValue(
            "tf_altr_netw_srvc_prvd_id",
            res.data.data.tf_altr_netw_srvc_prvd_id
          );
          viewSourceDestination(res.data.data.srcdest_list);

          setValue("checkInTimeValidator", dayjs(res.data.data.gate_in));
          setValue("initialTime", dayjs(res.data.data.loading_start));
          setValue("completionTime", dayjs(res.data.data.loading_end));
          setValue("outTime", dayjs(res.data.data.gate_out));
          setCheckInTimeFrom(dayjs(res.data.data.gate_in));
          setCheckOutTimeTo(dayjs(res.data.data.gate_out));
          setLoadingEndTime(dayjs(res.data.data.loading_end));
          setLoadingStartTime(dayjs(res.data.data.loading_start));
          setEWayBillDate(dayjs(res.data.data.eway_expire));
          fetchTransporter(res.data.data.tf_shipper_id);
          setShipperId(res.data.data.tf_shipper_id);
          setDocPath(res.data.data.vehicle_doc_link);
          setDocPathCD(res.data.data.company_doc_link);

          // setDocPath({ fleet: true, company: true });
          setApiveichleDoc(res.data.data.vehicle_doc_link);
          setApiCompanydoc(res.data.data.company_doc_link);
          setValue(
            "materialType",
            res.data.data.material_list.map((val) => val.mlm_material_id)
          );
          getSourceDestination(values["srcdest_list"]);

          //  shipper: requiredValidator("Shipper"),
          //  transporter: requiredValidator("transporter"),
          //  vehicleType: requiredValidator("vehicle"),
          //  customerContactName: nameValidator,
          //  contactNumber: contactNumberValidator,
          //  // vehicleNumber: vehicleNumberValidator,
          //  // driverContactName: contactNumberValidator,
          //  networkProvider: requiredValidator("Network Service Provider"),
          //  materialType: requiredValidator("Materials details  "),
          //  // gpsType: requiredValidator("Gps "),
          //  // checkoutTime: requiredValidator("checkout Time"),
          //  noOfVehicle: requiredValidator("vehicle number"),
          //  driverContactNumber: contactNumberValidator,
        } else {
        }
      })
      .catch((error) => {
        setOpenConfirmation(false);
      });
  };
  function handleDeleteInvoice(id) {
    editedInvoices.splice(id, 1);
    setEditedInvoices([...editedInvoices]);
  }

  const handleCloseModal = () => {
    setSelectedRow(null);
    setOpenModal(false);
  };

  const closeVehicleModal = () => {
    setSelectedRow(null);
    setVehicleInfo(false);
  };
  const closeDisableModal = () => {
    setSelectedRow(null);
    setDisableModel(false);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    const filteredRows = rows.filter((row) =>
      Object.values(row).some((fieldValue) =>
        String(fieldValue).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilterData(filteredRows);
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
              setValue(
                "networkProvider",
                networkProvider.find((x) =>
                  res.data.data[`prefix-network`]
                    .toUpperCase()
                    .includes(x.label)
                )?.value
              );
            } else {
              setValue(
                "tf_altr_netw_srvc_prvd_id",
                networkProvider.find((x) =>
                  res.data.data[`prefix-network`]
                    .toUpperCase()
                    .includes(x.label)
                )?.value
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
          console.log("outside if", data.data.data.contact_no);
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
  return (
    <>
      <BackdropComponent loading={isloading} />
      <Box style={{ width: "100%", marginTop: "10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <FilterComponent
              filterStateHandler={filterStateHandler}
              filterHandler={fileHandler}
            />
          </Grid>
        </Grid>

        <Card style={{ marginTop: "20px", padding: "10px" }}>
          <div className="customCardheader">
            <Typography variant="h4"> Tracking Table</Typography>
          </div>
          <Grid
            container
            justifyContent="flex-end"
            style={{ width: "100%", marginBottom: "10px", marginTop: "20px" }}
          >
            <Grid item md={6} lg={6}>
              {/* <Typography variant="h5">
                Filter By : All Shipper, All Branch , All Cluster/Region
              </Typography> */}
            </Grid>
            <Grid item md={6} lg={6}>
              <TextField
                label="Search"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <div style={{ height: "300px", width: "100%", overflow: "scroll" }}>
            <DataGrid
              autoHeight
              rows={filterData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              // slots={{ noRowsOverlay: CustomNoRowsOverlay }}
              // sx={{ "--DataGrid-overlayHeight": "500px" }}
            />
          </div>
        </Card>
      </Box>

      <ManagetrackingForm
        status={status}
        selectedRow={selectedRow}
        open={openModal}
        onClose={handleCloseModal}
      />

      {/* <VehicleInfo
        status={status}
        selectedRow={selectedRow}
        open={openVehicleInfo}
        onClose={closeVehicleModal}
      /> */}
      <Dialog
        open={openVehicleInfo}
        onClose={closeVehicleModal}
        maxWidth={true}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <div className="customCardheader">
              <Typography variant="h4"> Tracking Info</Typography>
            </div>
            <Card style={{ padding: "10px" }}>
              <Grid container spacing={1}>
                <Grid item md={7}>
                  <Card style={{ padding: "10px" }}>
                    <div className="customCardheader">
                      <Typography variant="h4">Tracking Details</Typography>
                    </div>

                    <Grid container spacing={1.5}>
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
                                disabled={true}
                              >
                                Select Shipper*
                              </InputLabel>
                              <Autocomplete
                                disabled={true}
                                {...field}
                                options={shipperList}
                                getOptionLabel={(option) => option.label || ""}
                                value={
                                  shipperList.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
                                onChange={(_, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.value : ""
                                  );
                                  fetchTransporter(newValue.value);
                                  fetchSingleShipper(newValue.value);
                                  // fetchBidMode(newValue.value);
                                  // fetchSegment(newValue.value);
                                  // fetchComment(n ewValue.value);
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
                              <Tooltip title="Select region/cluster">
                                <InputLabel id="demo-simple-select-disabled-label">
                                  Select region/cluster
                                </InputLabel>
                              </Tooltip>
                              <Autocomplete
                                {...field}
                                disabled={true}
                                options={regionOptions}
                                getOptionLabel={(option) => option.label || ""}
                                value={
                                  regionOptions.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
                                onChange={(_, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.value : ""
                                  );
                                  fetchBranchDataWithRegion(newValue.value);
                                }}
                                popupIcon={<KeyboardArrowDownIcon />}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    disabled={true}
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
                              disabled={true}
                              options={branchOptions}
                              getOptionLabel={(option) => option.label || ""}
                              value={
                                branchOptions.find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                              onChange={(_, newValue) => {
                                fetchSingleBranchData(newValue.value);
                                field.onChange(newValue ? newValue.value : "");
                                viewSpecificBranch(newValue.value).then(
                                  (res) => {
                                    console.log("in branch", res.data.data);
                                    if (res.data.success) {
                                      let branchAddrs =
                                        res.data.data.google_address;

                                      setBranchInfo({
                                        src: [branchAddrs],
                                        dest: [null],
                                      });
                                    }
                                  }
                                );
                              }}
                              popupIcon={<KeyboardArrowDownIcon />}
                              renderInput={(params) => (
                                <>
                                  <Tooltip title="Select branch ">
                                    <InputLabel id="demo-simple-select-disabled-label">
                                      Select branch
                                    </InputLabel>
                                  </Tooltip>

                                  <TextField
                                    {...params}
                                    disabled={true}
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
                                disabled={true}
                                options={transporter}
                                getOptionLabel={(option) => option.label || ""}
                                value={
                                  transporter.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
                                onChange={(_, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.value : ""
                                  );
                                }}
                                popupIcon={<KeyboardArrowDownIcon />}
                                renderInput={(params) => (
                                  <TextField
                                    disabled={
                                      userType === "acu" || superAdmin
                                        ? false
                                        : operational_accesses?.allow_tracking_edit
                                        ? true
                                        : false
                                    }
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
                                disabled={
                                  userType === "acu" || superAdmin
                                    ? false
                                    : operational_accesses?.allow_tracking_edit
                                    ? false
                                    : true
                                }
                                variant="outlined"
                                size="small"
                                error={Boolean(errors.vehicleType)}
                              >
                                <Select
                                  {...field}
                                  labelId="bid-label"
                                  id="vehicleType"
                                  label=""
                                  disabled={
                                    userType === "acu" || superAdmin
                                      ? false
                                      : operational_accesses?.allow_tracking_edit
                                      ? false
                                      : true
                                  }
                                  IconComponent={KeyboardArrowDownIcon}
                                  onChange={(e) => {
                                    const data = vehicles.find(
                                      (item) => item.id === e.target.value
                                    );
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
                                disabled={
                                  userType === "acu" || superAdmin
                                    ? false
                                    : operational_accesses?.allow_tracking_edit
                                    ? false
                                    : true
                                }
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
                                disabled={
                                  userType === "acu" || superAdmin
                                    ? false
                                    : operational_accesses?.allow_tracking_edit
                                    ? false
                                    : true
                                }
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
                                disabled={
                                  userType === "acu" || superAdmin
                                    ? false
                                    : operational_accesses?.allow_tracking_edit
                                    ? false
                                    : true
                                }
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
                                disabled={
                                  userType === "acu" || superAdmin
                                    ? false
                                    : operational_accesses?.allow_tracking_edit
                                    ? false
                                    : true
                                }
                                size="small"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  fetchNetworkProviderData(
                                    e.target.value,
                                    "main"
                                  );
                                }}
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
                                  label=""
                                  disabled={
                                    userType === "acu" || superAdmin
                                      ? false
                                      : operational_accesses?.allow_tracking_edit
                                      ? false
                                      : true
                                  }
                                  IconComponent={KeyboardArrowDownIcon}
                                >
                                  {networkProvider.map((item) => {
                                    return (
                                      <MenuItem
                                        value={item.value}
                                        key={item.value}
                                      >
                                        {item.label}
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
                              disabled={
                                userType === "acu" || superAdmin
                                  ? false
                                  : operational_accesses?.allow_tracking_edit
                                  ? false
                                  : true
                              }
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
                          <Grid item md={6} sm={6} xs={12} lg={6}>
                            <Controller
                              name="alternate_driver_number"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <>
                                  <InputLabel>
                                    Alternative Contact Number *:
                                  </InputLabel>
                                  <TextField
                                    size="small"
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                      fetchNetworkProviderData(
                                        e.target.value,
                                        "alter"
                                      );
                                    }}
                                    // onChange={(e) => {
                                    //   field.onChange(e.target.value);
                                    //   fetchNetworkProviderData(
                                    //     e.target.value,
                                    //     "alter"
                                    //   );
                                    // }}
                                    variant="outlined"
                                    fullWidth
                                    error={Boolean(
                                      errors.alternate_driver_number
                                    )}
                                    helperText={
                                      errors.alternate_driver_number?.message
                                    }
                                  />
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item md={6} sm={6} xs={12} lg={6}>
                            <Controller
                              name="tf_altr_netw_srvc_prvd_id"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <>
                                  <InputLabel id="demo-simple-select-disabled-label">
                                    Network Service Provider: *
                                  </InputLabel>
                                  <Select
                                    fullWidth
                                    size="small"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                  >
                                    {networkProvider.map((item) => {
                                      return (
                                        <MenuItem
                                          value={item.value}
                                          key={item.value}
                                        >
                                          {item.label}
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
                                  href={`${baseUrl}/service/file/download/all/${shipperId}/${apiveichleDoc}`}
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
                                doc, docx, png, jpg, jpeg, pdf, xls, xlsx are
                                allowed format and file size not more than 10MB
                                for single file
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
                                <IconButton
                                  onClick={() => handleRemoveFile(index)}
                                >
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
                                      const minAllowedDateTime =
                                        currentDateTime.add(0, "hour");

                                      if (
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        // setValue("initialTime", updatedDateTime);
                                        setCheckInTimeFrom(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        // setBidDateTime(newValue);
                                        // setValue("initialTime", newValue);
                                        setCheckInTimeFrom(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
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
                                    disabled={checkInTimeFrom ? false : true}
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
                                      const minAllowedDateTime =
                                        currentDateTime.add(0, "hour");

                                      if (
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        // setValue("initialTime", updatedDateTime);
                                        setLoadingStartTime(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        // setBidDateTime(newValue);
                                        // setValue("initialTime", newValue);
                                        setLoadingStartTime(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
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
                                    disabled={loadingStartTime ? false : true}
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
                                      const minAllowedDateTime =
                                        loadingStartTime;

                                      if (
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        // setValue("initialTime", updatedDateTime);
                                        setLoadingEndTime(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        // setBidDateTime(newValue);
                                        // setValue("initialTime", newValue);
                                        setLoadingEndTime(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
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
                                    disabled={loadingEndTime ? false : true}
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
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        // setValue("initialTime", updatedDateTime);
                                        setCheckOutTimeTo(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        // setBidDateTime(newValue);
                                        // setValue("initialTime", newValue);
                                        setCheckOutTimeTo(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
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
                              {docPathCD && (
                                <a
                                  href={`${baseUrl}/service/file/download/all/${shipperId}/${apiCompanyDoc}`}
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
                                doc, docx, png, jpg, jpeg, pdf, xls, xlsx are
                                allowed format and file size not more than 10MB
                                for single file
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
                                  onClick={() =>
                                    handleRemoveFileVehicleDoc(index)
                                  }
                                >
                                  <Clear />
                                </IconButton>
                              </Box>
                            ))}
                          </Grid>
                        </Grid>
                      </RegisterCard>

                      <Grid item xs={12} sm={3} md={3} lg={3}>
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
                                      materials.find((item) => item.id === id)
                                        ?.name
                                  )
                                  .join(", ")}`}
                              >
                                <InputLabel htmlFor="materialType">
                                  Material type*
                                </InputLabel>
                              </Tooltip>

                              <FormControl
                                fullWidth
                                variant="outlined"
                                disabled={
                                  userType === "acu"
                                    ? false
                                    : operational_accesses?.allow_tracking_edit
                                    ? false
                                    : true
                                }
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
                                          materials.find(
                                            (item) => item.id === id
                                          )?.name
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
                                disabled={
                                  userType === "acu"
                                    ? false
                                    : operational_accesses?.allow_tracking_edit
                                    ? false
                                    : true
                                }
                                {...field}
                                label=""
                                variant="outlined"
                                fullWidth
                                size="small"
                                // error={Boolean(errors.contactNumber)}
                                // helperText={errors.contactNumber?.message}
                              />
                            </>
                          )}
                        />
                      </Grid>

                      {/* <Grid item xs={12} sm={6} md={6} lg={6}>
                        <InputLabel id="demo-simple-select-disabled-label">
                          eWay Bill Time
                        </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer
                            components={["DateTimePicker", "DateTimePicker"]}
                          >
                            <DatePicker
                              disabled={
                                userType === "acu"
                                  ? false
                                  : operational_accesses?.allow_tracking_edit
                                  ? false
                                  : true
                              }
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
                                      // setEWayBillDate(data);
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
                  md={5}
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
                    {Object.keys(updatedSourceDest).length > 0 ? (
                      <GogMapLoad
                        setMapSource={getSourceDestination}
                        handleFullScreen={handleFullScreen}
                        mapfullScreen={isFullScreen}
                        viewSrcDest={updatedSourceDest}
                        // accordianDisabled={accordianDisabled}
                      />
                    ) : null}
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </DialogContent>
          <DialogActions>
            <div className="buttonsCard">
              {userType === "acu" ? (
                <Button
                  variant="contained"
                  type="submit"
                  // onClick={() => setVehicleInfo(false)}
                >
                  <SaveAsIcon sx={{ mr: 2 }} /> Save
                </Button>
              ) : operational_accesses?.allow_tracking_edit ? (
                <Button
                  variant="contained"
                  type="submit"
                  // onClick={() => setVehicleInfo(false)}
                >
                  <SaveAsIcon sx={{ mr: 2 }} /> Save
                </Button>
              ) : (
                ""
              )}

              {/* <Button variant="contained" onClick={handleAddInvoiceClick}>
              <ReceiptIcon sx={{ mr: 2 }} /> Add Invoice
            </Button>
            <Button variant="contained" onClick={handleAddEwayBillClick}>
              <DescriptionIcon sx={{ mr: 2 }} /> Add eWay Bill
            </Button> */}
              {/* <Button variant="contained" onClick={handleAddEwayBillClick}>
              <SaveAsIcon sx={{ mr: 2 }} /> Save 
            </Button> */}
              {/* <Button variant="contained" onClick={handleAddItemDetailsClick}>
              <PostAddIcon sx={{ mr: 2 }} /> Add Item Details
            </Button> */}

              <Button
                variant="contained"
                color="error"
                onClick={() => setVehicleInfo(false)}
              >
                Close
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
      {/* Modal for viewing/editing invoices */}
      <Dialog
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedRow(null);
        }}
        fullWidth
        maxWidth={"lg"}
      >
        <div className="customCardheader">
          <Typography variant="h4">
            {" "}
            Invoice details for : {selectedRow?.trackId}{" "}
          </Typography>
        </div>

        <DialogContent>
          <div>
            <Typography sx={{ mt: 2, mb: 2 }} variant="h4">
              Add new invoice
            </Typography>
            <Grid container spacing={1}>
              <Grid item md={3}>
                <InputLabel>Invoice Number</InputLabel>
                <TextField
                  // label="Invoice Number"
                  value={newInvoice.invoice_no}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, invoice_no: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item md={3}>
                <InputLabel>Invoice Amount</InputLabel>

                <TextField
                  value={newInvoice.invoice_amount.toLocaleString()} // Format for display
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                    setNewInvoice({
                      ...newInvoice,
                      invoice_amount: parseInt(inputValue, 10), // Parse the numeric value
                    });
                  }}
                  fullWidth
                  type="text" // Use text type to allow commas for display
                />
              </Grid>
              <Grid
                style={{ position: "relative", bottom: "10px" }}
                item
                md={3}
              >
                <InputLabel>Invoice Date</InputLabel>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DateTimePicker", "DateTimePicker"]}
                  >
                    <DatePicker
                      disablePast
                      format="DD/MM/YYYY "
                      value={newInvoice.invoice_date}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          invoice_date: e,
                        })
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item md={3}>
                <Button
                  size="small"
                  sx={{ mt: 4 }}
                  onClick={handleAddNewInvoice}
                  variant="contained"
                >
                  {" "}
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
          </div>
          <Typography sx={{ mt: 2, mb: 2 }} variant="h4">
            Existing Invoices
          </Typography>
          {editedInvoices.map((invoice, index) => (
            <Grid spacing={2} container key={invoice.mtfi_id}>
              <Grid item md={3}>
                <TextField
                  label={`Invoice Number `}
                  value={invoice.invoice_no}
                  onChange={(e) =>
                    handleEditInvoiceField(
                      invoice.mtfi_id,
                      "invoice_no",
                      e.target.value
                    )
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  label={`Invoice Amount `}
                  value={invoice.invoice_amount.toLocaleString()} // Format for display
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                    handleEditInvoiceField(
                      invoice.mtfi_id,
                      "invoice_amount",
                      parseInt(inputValue, 10) // Parse the numeric value
                    );
                  }}
                  fullWidth
                  margin="normal"
                  type="text" // Use text type to allow commas for display
                />
              </Grid>
              <Grid item md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DateTimePicker", "DateTimePicker"]}
                    size="small"
                  >
                    <DatePicker
                      disablePast
                      format="DD/MM/YYYY"
                      size="small"
                      value={dayjs(invoice.invoice_date)}
                      onChange={(e) =>
                        handleEditInvoiceField(
                          invoice.mtfi_id,
                          "invoice_date",
                          e
                        )
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item md={3}>
                <IconButton
                  onClick={() => handleDeleteInvoice(index)}
                  aria-label="delete"
                  sx={{ mt: 2 }}
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditModal(false);
              setSelectedRow(null);
            }}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveInvoices}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal for viewing/editing materials */}
      <Dialog
        open={openMaterialModal}
        onClose={() => {
          setOpenMaterialModal(false);
        }}
        fullWidth
        maxWidth={"lg"}
      >
        <div className="customCardheader">
          <Typography variant="h4">
            {" "}
            Material details for : {selectedRow?.trackId}{" "}
          </Typography>
        </div>
        <DialogContent>
          <div>
            <Typography sx={{ mt: 2, mb: 2 }} variant="h4">
              Add new material
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4} md={4} lg={3}>
                <Controller
                  name="materialType"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="materialType"
                        shrink
                        sx={{
                          fontSize: "17px",
                        }}
                      >
                        Material Type*
                      </InputLabel>
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
                          value={newMaterial.itemName}
                          onChange={(e) => {
                            setNewMaterial({
                              ...newMaterial,
                              item_id: e.target.value,
                            });
                          }}
                        >
                          {materials.map((item) => {
                            return (
                              <MenuItem value={item.id} key={item.id}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {/* {errors.materialType && (
                          <ErrorTypography>
                            {errors.materialType.message}
                          </ErrorTypography>
                        )} */}
                      </FormControl>
                    </>
                  )}
                />
              </Grid>

              {/* <Grid item md={4}>
                <InputLabel>UOM (Unit of Measure)</InputLabel>
                <TextField
                  value={newMaterial.uom}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, uom: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid> */}
              <Grid item xs={12} sm={4} md={4} lg={3}>
                <Controller
                  name="uom"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="uom"
                        shrink
                        sx={{
                          fontSize: "17px",
                        }}
                      >
                        UOM (Unit of Measure)
                      </InputLabel>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        // error={Boolean(errors.materialType)}
                      >
                        <Select
                          {...field}
                          labelId="bid-label"
                          id="uom"
                          label=""
                          IconComponent={KeyboardArrowDownIcon}
                          value={newMaterial.uom}
                          onChange={(e) => {
                            setNewMaterial({
                              ...newMaterial,
                              item_uom: e.target.value,
                            });
                          }}
                        >
                          {uOM.map((item) => {
                            return (
                              <MenuItem value={item.id} key={item.id}>
                                {item.type}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {/* {errors.materialType && (
                          <ErrorTypography>
                            {errors.materialType.message}
                          </ErrorTypography>
                        )} */}
                      </FormControl>
                    </>
                  )}
                />
              </Grid>

              <Grid item md={3}>
                <InputLabel>Quantity</InputLabel>
                <TextField
                  value={newMaterial.quantity}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      dispatch_item_qty: e.target.value,
                    })
                  }
                  fullWidth
                  size="small"
                  type="number"
                />
              </Grid>
              {/* <div>
                <IconButton onClick={handleAddNewMaterial} aria-label="add">
                  <AddIcon />
                </IconButton>
              </div> */}
              <Grid item md={3}>
                <Button
                  size="small"
                  sx={{ mt: 4 }}
                  onClick={handleAddNewMaterial}
                  aria-label="add"
                  variant="contained"
                >
                  {" "}
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
          </div>
          <Typography sx={{ mt: 2, mb: 2 }} variant="h4">
            Existing Materials
          </Typography>
          {console.log("editedMaterials", editedMaterials)}
          {editedMaterials.map((material, index) => (
            <Grid spacing={2} container key={index}>
              <Grid item md={4}>
                {/* <TextField
                  label={`Item Name for Material ${index + 1}`}
                  value={findMaterialNamesByIds(materials, material.itemName)}
                  // onChange={(e) =>
                  //   handleEditMaterialField(index, "itemName", e.target.value)
                  // }
                  fullWidth
                  margin="normal"
                /> */}

                <>
                  <InputLabel
                    htmlFor="materialType"
                    shrink
                    sx={{
                      fontSize: "17px",
                    }}
                  >
                    Material Type*
                  </InputLabel>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={Boolean(errors.materialType)}
                  >
                    <Select
                      labelId="bid-label"
                      id="materialType"
                      label=""
                      IconComponent={KeyboardArrowDownIcon}
                      value={material.item_id}
                      onChange={(e) => {
                        handleEditMaterialField(
                          index,
                          "item_id",
                          e.target.value
                        );
                      }}
                    >
                      {materials.map((item) => {
                        return (
                          <MenuItem value={item.id} key={item.id}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {/* {errors.materialType && (
                          <ErrorTypography>
                            {errors.materialType.message}
                          </ErrorTypography>
                        )} */}
                  </FormControl>
                </>
              </Grid>
              <Grid item md={4}>
                <Controller
                  name="uom"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabel
                        htmlFor="uom"
                        shrink
                        sx={{
                          fontSize: "17px",
                        }}
                      >
                        UOM (Unit of Measure)
                      </InputLabel>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        // error={Boolean(errors.materialType)}
                      >
                        <Select
                          {...field}
                          labelId="bid-label"
                          id="uom"
                          label=""
                          IconComponent={KeyboardArrowDownIcon}
                          value={material.item_uom}
                          onChange={(e) => {
                            handleEditMaterialField(
                              index,
                              "item_uom",
                              e.target.value
                            );
                          }}
                        >
                          {uOM.map((item) => {
                            return (
                              <MenuItem value={item.id} key={item.id}>
                                {item.type}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {/* {errors.materialType && (
                          <ErrorTypography>
                            {errors.materialType.message}
                          </ErrorTypography>
                        )} */}
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  label={`Quantity for Material ${index + 1}`}
                  value={material.dispatch_item_qty}
                  onChange={(e) =>
                    handleEditMaterialField(
                      index,
                      "dispatch_item_qty",
                      e.target.value
                    )
                  }
                  fullWidth
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item md={1}>
                <IconButton
                  onClick={() => handleDeleteMaterial(index)}
                  aria-label="delete"
                  sx={{ mt: 2 }}
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenMaterialModal(false);
              setSelectedRow(null);
            }}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveMaterials}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* confirmation dialog */}
      <Dialog open={openConfirmation}>
        <div className="customCardheader">
          <Typography variant="h4"> Send Consent </Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to send the consent?</Typography>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={setOpenConfirmation} variant='contained' color="error">No</Button> */}
          <Button
            onClick={finalconfirmation}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpenConfirmation(false)}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={progressendTrip}>
        <div className="customCardheader">
          <Typography variant="h4"> End Tracking </Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to end this tracking?</Typography>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={setOpenConfirmation} variant='contained' color="error">No</Button> */}
          <Button onClick={finalEndTrip} variant="contained" color="primary">
            Yes
          </Button>
          <Button
            onClick={() => setProgressEndTrip(false)}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* disable model */}
      <Dialog open={disbaleModel} onClose={closeDisableModal} maxWidth={true}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <div className="customCardheader">
              <Typography variant="h4"> Tracking Info</Typography>
            </div>
            <Card style={{ padding: "10px" }}>
              <Grid container spacing={1}>
                <Grid item md={7}>
                  <Card style={{ padding: "10px" }}>
                    <div className="customCardheader">
                      <Typography variant="h4">Tracking Details</Typography>
                    </div>

                    <Grid container spacing={1.5}>
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
                                disabled={true}
                              >
                                Select shipper*
                              </InputLabel>
                              <Autocomplete
                                {...field}
                                disabled={true}
                                options={shipperList}
                                getOptionLabel={(option) => option.label || ""}
                                value={
                                  shipperList.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
                                onChange={(_, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.value : ""
                                  );
                                  fetchTransporter(newValue.value);
                                  // fetchBidMode(newValue.value);
                                  // fetchSegment(newValue.value);
                                  // fetchComment(n ewValue.value);
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
                              <Tooltip title="Select region/cluster">
                                <InputLabel id="demo-simple-select-disabled-label">
                                  Select region/cluster
                                </InputLabel>
                              </Tooltip>
                              <Autocomplete
                                {...field}
                                disabled={true}
                                options={regionOptions}
                                getOptionLabel={(option) => option.label || ""}
                                value={
                                  regionOptions.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
                                onChange={(_, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.value : ""
                                  );
                                  fetchBranchDataWithRegion(newValue.value);
                                }}
                                popupIcon={<KeyboardArrowDownIcon />}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    disabled={true}
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
                              disabled={true}
                              options={branchOptions}
                              getOptionLabel={(option) => option.label || ""}
                              value={
                                branchOptions.find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                              onChange={(_, newValue) => {
                                fetchSingleBranchData(newValue.value);
                                field.onChange(newValue ? newValue.value : "");
                                viewSpecificBranch(newValue.value).then(
                                  (res) => {
                                    console.log("in branch", res.data.data);
                                    if (res.data.success) {
                                      let branchAddrs =
                                        res.data.data.google_address;

                                      setBranchInfo({
                                        src: [branchAddrs],
                                        dest: [null],
                                      });
                                    }
                                  }
                                );
                              }}
                              popupIcon={<KeyboardArrowDownIcon />}
                              renderInput={(params) => (
                                <>
                                  <Tooltip title="Select branch ">
                                    <InputLabel id="demo-simple-select-disabled-label">
                                      Select branch
                                    </InputLabel>
                                  </Tooltip>

                                  <TextField
                                    {...params}
                                    disabled={true}
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
                                disabled={true}
                                options={transporter}
                                getOptionLabel={(option) => option.label || ""}
                                value={
                                  transporter.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
                                onChange={(_, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.value : ""
                                  );
                                }}
                                popupIcon={<KeyboardArrowDownIcon />}
                                renderInput={(params) => (
                                  <TextField
                                    disabled={true}
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
                                disabled={true}
                                variant="outlined"
                                size="small"
                                error={Boolean(errors.vehicleType)}
                              >
                                <Select
                                  {...field}
                                  labelId="bid-label"
                                  id="vehicleType"
                                  label=""
                                  disabled={true}
                                  IconComponent={KeyboardArrowDownIcon}
                                  onChange={(e) => {
                                    const data = vehicles.find(
                                      (item) => item.id === e.target.value
                                    );
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
                                disabled={true}
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
                                disabled={true}
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
                                disabled={true}
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
                                disabled={true}
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
                                  label=""
                                  disabled={true}
                                  IconComponent={KeyboardArrowDownIcon}
                                >
                                  {networkProvider.map((item) => {
                                    return (
                                      <MenuItem
                                        value={item.value}
                                        key={item.value}
                                      >
                                        {item.label}
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
                              disabled={true}
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
                          <Grid item md={6} sm={6} xs={12} lg={6}>
                            <Controller
                              name="alternate_driver_number"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <>
                                  <InputLabel>
                                    Alternative Contact Number *:
                                  </InputLabel>
                                  <TextField
                                    size="small"
                                    {...field}
                                    type="text"
                                    disabled={true}
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                      fetchNetworkProviderData(
                                        e.target.value,
                                        "alter"
                                      );
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    error={Boolean(
                                      errors.alternate_driver_number
                                    )}
                                    helperText={
                                      errors.alternate_driver_number?.message
                                    }
                                  />
                                </>
                              )}
                            />
                          </Grid>
                          <Grid item md={6} sm={6} xs={12} lg={6}>
                            <Controller
                              name="tf_altr_netw_srvc_prvd_id"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <>
                                  <InputLabel id="demo-simple-select-disabled-label">
                                    Network Service Provider: *
                                  </InputLabel>
                                  <Select
                                    fullWidth
                                    disabled={true}
                                    size="small"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                  >
                                    {networkProvider.map((item) => {
                                      return (
                                        <MenuItem
                                          value={item.value}
                                          key={item.value}
                                        >
                                          {item.label}
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

                      <Grid item md={12} xs={12}>
                        <InputLabel>
                          Vehicle Doc:
                          {/* <span className="mandatory-star">*</span> */}
                        </InputLabel>
                        <Grid item xs={12} md={12}>
                          {docPath && (
                            <div
                              style={{
                                textAlign: "end",
                                position: "relative",
                                bottom: "50px",
                                marginTop: "25px",
                              }}
                            >
                              <a
                                href={`${baseUrl}/service/file/download/all/${shipperId}/${apiveichleDoc}`}
                              >
                                <DownloadIcon />
                              </a>
                            </div>
                          )}
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

                            <Typography sx={{ marginTop: "2px" }}>
                              Drag and drop files here
                            </Typography>
                            <Typography sx={{ color: "rgba(0, 0, 0, 0.40)" }}>
                              JPG, PNG, PDF or XLSX, file size no more than 10MB
                            </Typography>
                            <input
                              disabled={true}
                              type="file"
                              id="fileInput"
                              style={{ display: "none" }}
                              multiple
                              onChange={handleFileInputChange}
                            />

                            <Button
                              disabled={
                                userType === "acu"
                                  ? false
                                  : operational_accesses?.allow_tracking_edit
                                  ? false
                                  : true
                              }
                              variant="outlined"
                              sx={{ marginTop: "2px" }}
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
                          {selectedVehicleFiles.map((file, index) => (
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
                              <IconButton
                                onClick={() => handleRemoveFile(index)}
                              >
                                <Clear />
                              </IconButton>
                            </Box>
                          ))}
                        </Grid>
                      </Grid>

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
                                    disabled={true}
                                    {...field}
                                    onChange={(newValue) => {
                                      const selectedDateTime = dayjs(newValue);
                                      const currentDateTime = dayjs();

                                      // Ensure that the selected time is at least 1 hour after the current time
                                      const minAllowedDateTime =
                                        currentDateTime.add(0, "hour");

                                      if (
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        // setValue("initialTime", updatedDateTime);
                                        setCheckInTimeFrom(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        // setBidDateTime(newValue);
                                        // setValue("initialTime", newValue);
                                        setCheckInTimeFrom(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
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
                                    disabled={true}
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
                                      const minAllowedDateTime =
                                        currentDateTime.add(0, "hour");

                                      if (
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        // setValue("initialTime", updatedDateTime);
                                        setLoadingStartTime(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        // setBidDateTime(newValue);
                                        // setValue("initialTime", newValue);
                                        setLoadingStartTime(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
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
                                    disabled={true}
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
                                      const minAllowedDateTime =
                                        loadingStartTime;

                                      if (
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        // setValue("initialTime", updatedDateTime);
                                        setLoadingEndTime(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        // setBidDateTime(newValue);
                                        // setValue("initialTime", newValue);
                                        setLoadingEndTime(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
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
                                    disabled={true}
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
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        // setValue("initialTime", updatedDateTime);
                                        setCheckOutTimeTo(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        // setBidDateTime(newValue);
                                        // setValue("initialTime", newValue);
                                        setCheckOutTimeTo(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
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

                      <Grid item md={12} xs={12}>
                        <InputLabel>
                          Company Doc:
                          {/* <span className="mandatory-star">*</span> */}
                        </InputLabel>

                        <Grid item xs={12} md={12}>
                          {docPathCD && (
                            <div
                              style={{
                                textAlign: "end",
                                position: "relative",
                                bottom: "0px",
                                // marginBottom: "30px",
                              }}
                            >
                              {docPath && (
                                <a
                                  href={`${baseUrl}/service/file/download/all/${shipperId}/${apiCompanyDoc}`}
                                >
                                  <DownloadIcon />
                                  {/* {docPath} */}
                                </a>
                              )}
                            </div>
                          )}
                          <div
                            id="file-drop"
                            style={{
                              border: "2px dashed rgba(171, 191, 201, 0.80)",
                              borderRadius: "10px",
                              padding: "20px",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                            onDrop={handleSelectFileDrop}
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
                              disabled={true}
                              type="file"
                              id="fileInput1"
                              style={{ display: "none" }}
                              multiple
                              onChange={(e) => handleInputChange(e)}
                            />

                            <Button
                              variant="outlined"
                              sx={{ marginTop: "24px" }}
                              onClick={() =>
                                document.getElementById("fileInput1").click()
                              }
                              disabled={
                                userType === "acu"
                                  ? false
                                  : operational_accesses?.allow_tracking_edit
                                  ? true
                                  : false
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
                              <IconButton onClick={() => handleRemove(index)}>
                                <Clear />
                              </IconButton>
                            </Box>
                          ))}
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={3} md={3} lg={3}>
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
                                      materials.find((item) => item.id === id)
                                        ?.name
                                  )
                                  .join(", ")}`}
                              >
                                <InputLabel htmlFor="materialType">
                                  Material type*
                                </InputLabel>
                              </Tooltip>

                              <FormControl
                                fullWidth
                                variant="outlined"
                                disabled={true}
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
                                          materials.find(
                                            (item) => item.id === id
                                          )?.name
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
                                disabled={true}
                                {...field}
                                label=""
                                variant="outlined"
                                fullWidth
                                size="small"
                                // error={Boolean(errors.contactNumber)}
                                // helperText={errors.contactNumber?.message}
                              />
                            </>
                          )}
                        />
                      </Grid>

                      {/* <Grid item xs={12} sm={6} md={6} lg={6}>
                        <InputLabel id="demo-simple-select-disabled-label">
                          eWay Bill Time
                        </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer
                            components={["DateTimePicker", "DateTimePicker"]}
                          >
                            <DatePicker
                              disabled={true}
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
                                    onChange={(date) => {
                                      // const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                                      field.onChange(date);
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
                    </Grid>
                  </Card>
                </Grid>

                <Grid
                  item
                  md={5}
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
                    {Object.keys(updatedSourceDest).length > 0 ? (
                      <GogMapLoad
                        setMapSource={getSourceDestination}
                        handleFullScreen={handleFullScreen}
                        mapfullScreen={isFullScreen}
                        viewSrcDest={updatedSourceDest}
                        // accordianDisabled={accordianDisabled}
                      />
                    ) : null}
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </DialogContent>
          <DialogActions>
            <div className="buttonsCard">
              <Button
                variant="contained"
                color="error"
                onClick={() => closeDisableModal()}
              >
                Close
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
