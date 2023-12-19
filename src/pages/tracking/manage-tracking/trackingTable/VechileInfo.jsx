import {
  Dialog,
  Card,
  Grid,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  DialogContent,
  DialogActions,
  Chip,
  Box,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useState, useEffect } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { viewLoadingFleet } from "../../../../api/manage-loading/manageLoad";
import BackdropComponent from "../../../../components/backdrop/Backdrop";
import { openSnackbar } from "../../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import { viewNetworkProvider } from "../../../../api/trip-management/manage-trip";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  requiredValidator,
  requiredValidatorOfArray,
  contactNumberValidator,
} from "../../../../validation/common-validator";
import moment from "moment/moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ErrorTypography from "../../../../components/typography/ErrorTypography";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import RegisterCard from "../../../../components/card/RegisterCard";

import {
  addVehicle,
  updateVehicle,
} from "../../../../api/manage-loading/manageLoad";
import pdficon from "../../../../../public/PDF_svg.svg";
import jpgicon from "../../../../../public/JPG_svg.svg";
import pngicon from "../../../../../public/PNG_svg.svg";
import docIcon from "../../../../assets/doc.svg";
import docxIcon from "../../../../assets/docx.svg";
import jpegIcon from "../../../../assets/jpeg.svg";
import xlsIcon from "../../../../assets/xls.svg";
import xlsxIcon from "../../../../assets/xlsx.svg";
import { StringSlice } from "../../../../utility/utility-function";
import DownloadIcon from "@mui/icons-material/Download";
import { getBase64MultipleArray } from "../../../../utility/utility-function";
import { fetchSimNetworkPro } from "../../../../api/trip-management/manage-trip";
const baseUrl = import.meta.env.VITE_TMS_APP_API_URL;

function VehicleInfo({ selectedRow, onClose }) {
  const [loading, setIsLoading] = useState(false);
  const [checkInTime, setCheckinTime] = useState();
  const [loadingStartTime, setLoadingStartTime] = useState();
  const [loadingEndTime, setLoadingEndTime] = useState();
  const [checkOut, setCheckOut] = useState();
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleValue, setVehicleValue] = useState(false);
  const [tf_id, setTf_id] = useState("");
  const [networkOption, setNetworkOption] = useState([]);
  const [isAlternateContactSelected, setIsAlternateContactSelected] =
    useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [shipperId, setShipperId] = useState("");
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [veichleDocuments, setVeichleDocuments] = useState("");
  const [selectedVehicleFiles, setSelectedVehicleFiles] = useState([]);
  const [docPath, setDocPath] = useState({ fleet: false, company: false });
  const [adVehicle, SetAddVehicle] = useState(false);
  const dispatch = useDispatch();
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
  const [isDocumentChange, setIsDocumentChange] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [documentsVehicleDoc, setDocumentsVehicleDoc] = useState([]);
  const [selectedFilesVehicleDoc, setSelectedFilesVehicleDoc] = useState([]);

  let fileUploadProgress = {};

  const schemaBuilder = (isAlternateContactSelected) => {
    const baseSchema = yup.object().shape({
      vehicleNo: requiredValidator("Transporter"),
      driverNumber: contactNumberValidator,
      serviceProvider: requiredValidator("Network service provider"),
      // eWayBill: requiredValidator("E-Way bill"),
      // eWayBillTime: requiredValidator("E-Way bill time"),
      inTime: requiredValidator("Check-in time"),
      // initialTime: requiredValidator("Loading initial time"),
      documents: yup.mixed(),
      vehicle_doc: yup.mixed(),
    });

    if (isAlternateContactSelected) {
      return baseSchema.shape({
        // alternateDriverNumber: contactNumberValidator,
        // altrServiceProvider: requiredValidator(
        //   "Alternate network service provider"
        // ),
      });
    }

    return baseSchema;
  };
  const schema = schemaBuilder(isAlternateContactSelected);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      documents: [],
      vehicle_doc: [],
    },
  });

  function closeVechial() {
    setCheckinBlock(false);
    SetAddVehicle(false);
    setVehicleValue(false);
    fetchData();
    setDocPath({ fleet: false, company: false });
  }

  const handelChackBox = (checkedStatus) => {
    setIsAlternateContactSelected(checkedStatus);
    setValue("alternateDriverNumber", "");
    setValue("altrServiceProvider", "");
  };

  const fetchData = () => {
    const payload = {
      load_id: selectedRow.mainLoadId,
      transporter_id: selectedRow.transporter_id,
    };
    viewLoadingFleet(payload)
      .then((data) => {
        if (data.data.success === true) {
          setVehicleData(data.data.data);
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: data.clientMessage,
            })
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

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
          setNetworkOption(options);
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

  useEffect(() => {
    fetchNetworkProvider();
    fetchData();
  }, []);

  // const handleInputChange = (event) => {
  //   clearErrors("documents");
  //   const files = Array.from(event.target.files);
  //   const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
  //   const invalidFile = files.find((file) => file.size > maxSize);
  //   if (invalidFile) {
  //     setError("documents", {
  //       message: "Please try to upload files less than 2MB",
  //     });
  //   }
  //   const validFiles = files.filter((file) => file.size <= maxSize);
  //   if (validFiles.length > 0) {
  //     setValue("documents", validFiles);
  //     setSelectedFiles(() => [...validFiles.map((file) => file.name)]);
  //   } else {
  //     setError("documents", {
  //       message: "No valid files selected or files exceed the 2 MB limit.",
  //     });
  //   }
  // };

  // const handleSelectFileDrop = (event) => {
  //   setError("documents", undefined);
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const files = event.dataTransfer.files;
  //   const maxSize = 2 * 1024 * 1024;
  //   const validFiles = Array.from(files).filter((file) => file.size <= maxSize);
  //   const invalidFiles = Array.from(files).filter(
  //     (file) => file.size > maxSize
  //   );
  //   if (invalidFiles.length > 0) {
  //     setError("documents", {
  //       message: "One or more dropped files exceed the 2 MB limit.",
  //       type: "validate",
  //     });
  //   }
  //   if (validFiles.length > 0) {
  //     setSelectedFiles(() => [...validFiles.map((file) => file.name)]);
  //     setValue("documents", validFiles);
  //   }
  // };

  // const handleRemove = (index) => {
  //   clearErrors("documents");
  //   const updatedFiles = [...selectedFiles];
  //   updatedFiles.splice(index, 1);
  //   const updatedDocuments = updatedFiles.filter((_, i) => i !== index);
  //   setValue("documents", updatedDocuments);
  //   setSelectedFiles(updatedFiles);
  // };

  // const handleFileDrop = (event) => {
  //   setError("documentsVehicle", undefined);
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const files = event.dataTransfer.files;
  //   const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
  //   const validFiles = Array.from(files).filter((file) => file.size <= maxSize);
  //   const invalidFiles = Array.from(files).filter(
  //     (file) => file.size > maxSize
  //   );
  //   if (invalidFiles.length > 0) {
  //     setError("documentsVehicle", {
  //       message: "One or more dropped files exceed the 2 MB limit.",
  //     });
  //   }
  //   if (validFiles.length > 0) {
  //     setSelectedVehicleFiles(() => [...validFiles.map((file) => file.name)]);
  //     setValue("documentsVehicle", validFiles);
  //   }
  // };

  // const handleFileInputChange = (event) => {
  //   clearErrors("documentsVehicle");
  //   const files = Array.from(event.target.files);
  //   const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
  //   const invalidFile = files.find((file) => file.size > maxSize);
  //   if (invalidFile) {
  //     setError("documentsVehicle", {
  //       message: "Please try to upload files less than 2MB",
  //     });
  //   }
  //   const validFiles = files.filter((file) => file.size <= maxSize);
  //   if (validFiles.length > 0) {
  //     setValue("documentsVehicle", validFiles);
  //     setSelectedVehicleFiles(() => [...validFiles.map((file) => file.name)]);
  //   } else {
  //     setError("documentsVehicle", {
  //       message: "No valid files selected or files exceed the 2 MB limit.",
  //     });
  //   }
  // };

  // const handleRemoveFile = (index) => {
  //   clearErrors("documentsVehicle");
  //   const updatedFiles = [...selectedVehicleFiles];
  //   updatedFiles.splice(index, 1);
  //   const updatedDocuments = updatedFiles.filter((_, i) => i !== index);
  //   setValue("documentsVehicle", updatedDocuments);
  //   setSelectedVehicleFiles(updatedFiles);
  // };

  const handleSubmitButton = async (
    value,
    checkInTimeFrom,
    inTime,
    outTime,
    initialTime,
    loadingStartTime,
    completionTime,
    loadingEndTime,
    eWayBillDate,
    eWayBillTime
  ) => {
    const company_docs = await getBase64MultipleArray(value.vehicle_doc);
    console.log("value", value);
    const vehicle_docs = await getBase64MultipleArray(value.documents);
    // const veh_docs = await getBase64MultipleArray(veichleDocuments);
    console.log("company_docs", company_docs, vehicle_docs, value);
    setIsLoading(true);
    const date = value.inTime ? dayjs(value.inTime) : null;

    let dateTo = value.outTime ? dayjs(value.outTime) : null;
    dateTo !== null ? dateTo.format("YYYY-MM-DD HH:mm:ss.SSS") : null;
    let loadStart = value.initialTime ? dayjs(value.initialTime) : null;
    loadStart !== null ? loadStart.format("YYYY-MM-DD HH:mm:ss.SSS") : null;
    let loadEnd = value.completionTime ? dayjs(value.completionTime) : null;
    loadEnd !== null ? loadEnd.format("YYYY-MM-DD HH:mm:ss.SSS") : null;
    let eWayDate = value.eWayBillTime
      ? dayjs(value.eWayBillTime).endOf("day")
      : null;
    eWayDate !== null ? eWayDate.format("YYYY-MM-DD HH:mm:ss.SSS") : null;

    const payload = {
      tf_bidding_load_id: selectedRow.mainLoadId,
      tf_transporter_id: selectedRow.transporter_id,
      fleet_no: value.vehicleNo,
      driver_number: value.driverNumber,
      tf_netw_srvc_prvd_id: value.serviceProvider,
      alternate_driver_number:
        value.alternateDriverNumber === "" ? null : value.alternateDriverNumber,
      tf_altr_netw_srvc_prvd_id:
        value.altrServiceProvider === "" ? null : value.altrServiceProvider,
      gate_in: date.format("YYYY-MM-DD HH:mm:ss.SSS"),
      vehicle_doc_link: vehicle_docs.map((i) => ({
        file_name: i.file_name,
        file_data: i.file_data,
      })),
      // loading_start: loadStart.format("YYYY-MM-DD HH:mm:ss.SSS"),
      loading_start: loadStart
        ? loadStart.format("YYYY-MM-DD HH:mm:ss.SSS") != "Invalid Date"
          ? loadStart.format("YYYY-MM-DD HH:mm:ss.SSS")
          : null
        : null,
      // loading_end: loadEnd.format("YYYY-MM-DD HH:mm:ss.SSS"),
      loading_end: loadEnd
        ? loadEnd.format("YYYY-MM-DD HH:mm:ss.SSS") != "Invalid Date"
          ? loadEnd.format("YYYY-MM-DD HH:mm:ss.SSS")
          : null
        : null,

      company_doc_link: company_docs.map((i) => ({
        file_name: i.file_name,
        file_data: i.file_data,
      })),
      // gate_out: dateTo.format("YYYY-MM-DD HH:mm:ss.SSS"),
      gate_out: dateTo
        ? dateTo.format("YYYY-MM-DD HH:mm:ss.SSS") != "Invalid Date"
          ? dateTo.format("YYYY-MM-DD HH:mm:ss.SSS")
          : null
        : null,

      eway: value.eWayBill,
      // eway_expire: eWayDate.format("YYYY-MM-DD hh:mm:ss.sss"),
      eway_expire: eWayDate
        ? eWayDate.format("YYYY-MM-DD HH:mm:ss.SSS") != "Invalid Date"
          ? eWayDate.format("YYYY-MM-DD HH:mm:ss.SSS")
          : null
        : null,

      make_of_gps: null,
      is_tracking_enable: true,
      materials: [],
      src_dest: [],
    };
    if (!vehicleValue) {
      addVehicle(payload)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: "success", message: res.data.clientMessage })
            );
            handelChackBox(false);
            reset();
            setSelectedFiles([]);
            onClose();
            setSelectedVehicleFiles([]);
            SetAddVehicle(false);
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

      // setVehicleValue(false);
    } else {
      updateVehicle(tf_id, payload)
        .then((res) => {
          if (res.data.success === true) {
            fetchData();
            dispatch(
              openSnackbar({ type: "success", message: res.data.clientMessage })
            );

            handelChackBox(false);
            reset();
            setSelectedFiles([]);
            setSelectedVehicleFiles([]);
            setCompanyDocuments("");
            setVeichleDocuments("");
            // vehicleData();
            SetAddVehicle(false);
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

      // setVehicleValue(false);
    }
  };
  const [checkInBlock, setCheckinBlock] = useState(false);
  const editHandler = (obj) => {
    setVehicleValue(true);
    SetAddVehicle(true);
    console.log(">>>>>>>", obj);
    setTf_id(obj.tf_id);
    setShipperId(obj.tf_shipper_id);
    if (obj.company_doc_link !== null) {
      if (obj.vehicle_doc_link !== null) {
        setDocPath({ fleet: true, company: true });
        setCompanyDocuments(obj.company_doc_link);
        setVeichleDocuments(obj.vehicle_doc_link);
      } else {
        setDocPath({ fleet: false, company: true });
        setCompanyDocuments(obj.company_doc_link);
      }
    }
    if (obj.company_doc_link === null) {
      if (obj.vehicle_doc_link !== null) {
        setDocPath({ fleet: true, company: false });
        setVeichleDocuments(obj.vehicle_doc_link);
      } else {
        setDocPath({ fleet: false, company: false });
      }
    }
    if (
      obj.alternate_driver_number !== null &&
      obj.tf_altr_netw_srvc_prvd_id !== null
    ) {
      setIsAlternateContactSelected(true);
      setValue("alternateDriverNumber", obj.alternate_driver_number);
      setValue("altrServiceProvider", obj.tf_altr_netw_srvc_prvd_id);
    }
    setValue("vehicleNo", obj.fleet_no);
    setValue("driverNumber", obj.driver_number);
    setValue("serviceProvider", obj.tf_netw_srvc_prvd_id);
    setValue("eWayBill", obj.eway);
    setValue("eWayBillTime", dayjs(obj.eway_expire));
    setValue("inTime", dayjs(obj.gate_in));
    if (dayjs(obj.gate_in)) {
      setCheckinBlock(true);
    } else {
      setCheckinBlock(false);
    }
    setCheckinTime(dayjs(obj.gate_in));
    setValue("outTime", dayjs(obj.gate_out));
    setCheckOut(dayjs(obj.gate_out));
    setValue("initialTime", dayjs(obj.loading_start));
    setLoadingStartTime(dayjs(obj.loading_start));
    setValue("completionTime", dayjs(obj.loading_end));
    setLoadingEndTime(dayjs(obj.loading_end));
  };
  const resetForm = () => {
    reset();
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
                "serviceProvider",
                networkOption.find((x) =>
                  res.data.data[`prefix-network`]
                    .toUpperCase()
                    .includes(x.label)
                )?.value
              );
            } else {
              setValue(
                "altrServiceProvider",
                networkOption.find((x) =>
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

  return (
    <>
      <BackdropComponent loading={loading} />
      <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={true}>
        <DialogContent>
          <Card sx={{ height: "90vh" }}>
            <CardContent>
              <div
                style={{ marginBottom: "10px" }}
                className="customCardheader"
              >
                <Typography variant="h4">
                  {"Vehicle Information Add/View"}
                </Typography>
              </div>

              {vehicleData.length >= selectedRow.vehicle_no ? null : (
                <div style={{ textAlign: "end" }}>
                  <Button
                    style={{ marginBottom: "10px", marginTop: "10px" }}
                    // onClick={() => SetAddVehicle(true)}
                    onClick={() => {
                      SetAddVehicle(true);
                      resetForm();
                    }}
                    variant="contained"
                    endIcon={<LocalShippingIcon />}
                  >
                    Add Vehicle
                  </Button>
                </div>
              )}
              <div style={{ marginBottom: "0px" }} className="customCardheader">
                <Typography variant="h4">{"VehicleInfo"}</Typography>
              </div>

              <TableContainer sx={{ maxHeight: "60vh", overflowY: "scroll" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle Number</TableCell>
                      <TableCell>Contact Number</TableCell>
                      <TableCell>Vehicle Doc</TableCell>
                      <TableCell>Company Doc</TableCell>
                      <TableCell>Gate-In Time</TableCell>
                      <TableCell>Loading Initiation Time</TableCell>
                      <TableCell>Loading Completion Time</TableCell>
                      <TableCell>Gate-Out Time</TableCell>
                      {/* <TableCell>Items</TableCell> */}
                      {/* <TableCell>Invoice</TableCell> */}
                      <TableCell>Eway</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicleData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {data.tracking_fleet_details.fleet_no}
                        </TableCell>
                        <TableCell>
                          {data.tracking_fleet_details.driver_number}
                        </TableCell>
                        <TableCell>
                          {data.tracking_fleet_details.vehicle_doc_link ? (
                            <Chip color="primary" label="Uploaded" />
                          ) : (
                            <Chip color="error" label="Not Uploaded" />
                          )}
                        </TableCell>
                        <TableCell>
                          {data.tracking_fleet_details.company_doc_link ? (
                            <Chip color="primary" label="Uploaded" />
                          ) : (
                            <Chip color="error" label="Not Uploaded" />
                          )}
                        </TableCell>
                        <TableCell>
                          {data.tracking_fleet_details.gate_in
                            ? moment(
                                data.tracking_fleet_details.gate_in
                              ).format("YYYY-MM-DD hh:mm A")
                            : ""}
                        </TableCell>

                        <TableCell>
                          {data.tracking_fleet_details.loading_start
                            ? moment(
                                data.tracking_fleet_details.loading_start
                              ).format("YYYY-MM-DD hh:mm A")
                            : ""}
                        </TableCell>
                        <TableCell>
                          {data.tracking_fleet_details.loading_end
                            ? moment(
                                data.tracking_fleet_details.loading_end
                              ).format("YYYY-MM-DD hh:mm A")
                            : ""}
                        </TableCell>
                        <TableCell>
                          {data.tracking_fleet_details.gate_out
                            ? moment(
                                data.tracking_fleet_details.gate_out
                              ).format("YYYY-MM-DD hh:mm A")
                            : ""}
                        </TableCell>

                        {/* <TableCell>
                          {data.items_uploaded ? (
                            <Chip
                              color="primary"
                              label={data.items_uploaded + " Item uploaded "}
                            />
                          ) : (
                            <Chip color="error" label="No item added" />
                          )}
                        </TableCell> */}
                        {/* <TableCell>
                          {data.invoices_uploaded ? (
                            <Chip
                              color="primary"
                              label={
                                data.invoices_uploaded + " Invoice uploaded "
                              }
                            />
                          ) : (
                            <Chip color="error" label="Not Uploaded" />
                          )}
                        </TableCell> */}
                        <TableCell>
                          {data.tracking_fleet_details.eway ? (
                            <Chip color="primary" label="Uploaded" />
                          ) : (
                            <Chip color="error" label="Not Uploaded" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              editHandler(data.tracking_fleet_details)
                            }
                          >
                            <BorderColorIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* add Vehicle */}

      <Dialog open={adVehicle} onClose={closeVechial} maxWidth="lg">
        <form onSubmit={handleSubmit(handleSubmitButton)}>
          <DialogContent>
            <Card style={{ padding: "10px" }}>
              <Grid container spacing={1}>
                <Card style={{ padding: "10px" }}>
                  <div className="customCardheader">
                    <Typography variant="h4"> Vehicle Information </Typography>
                  </div>

                  <Grid container spacing={1}>
                    <Grid item sm={6} xs={12} md={4}>
                      <Controller
                        name="vehicleNo"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel>
                              Vehicle Number
                              <span className="mandatory-star">*</span>
                            </InputLabel>
                            <TextField
                              size="small"
                              {...field}
                              variant="outlined"
                              fullWidth
                              error={Boolean(errors.vehicleNo)}
                              helperText={errors.vehicleNo?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} md={4}>
                      <Controller
                        name="driverNumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel>
                              {"Driver's Contact Number"}
                              <span className="mandatory-star">*</span>
                            </InputLabel>
                            <TextField
                              size="small"
                              {...field}
                              type="text"
                              variant="outlined"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                fetchNetworkProviderData(
                                  e.target.value,
                                  "main"
                                );
                              }}
                              fullWidth
                              error={Boolean(errors.driverNumber)}
                              helperText={errors.driverNumber?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} md={4}>
                      <Controller
                        name="serviceProvider"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select-disabled-label">
                              Network Service Provider
                              <span style={{ color: "red" }}>*</span>
                            </InputLabel>
                            <Select
                              fullWidth
                              size="small"
                              value={field.value}
                              onChange={(e) => field.onChange(e)}
                            >
                              {networkOption.map((ele) => (
                                <MenuItem key={ele.value} value={ele.value}>
                                  {ele.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.serviceProvider && (
                              <ErrorTypography>
                                {errors.serviceProvider.message}
                              </ErrorTypography>
                            )}
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <FormControlLabel
                        sx={{ mt: 1 }}
                        control={
                          <Checkbox
                            color="primary"
                            checked={isAlternateContactSelected}
                            onChange={(e) => handelChackBox(e.target.checked)}
                          />
                        }
                        label="Alternate Contact Number"
                      />
                    </Grid>
                    {isAlternateContactSelected && (
                      <>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name="alternateDriverNumber"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <>
                                <InputLabel>
                                  Alternative Contact Number:
                                  {/* <span style={{ color: "red" }}>*</span> */}
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
                                  variant="outlined"
                                  fullWidth
                                  // error={Boolean(errors.alternateDriverNumber)}
                                  // helperText={
                                  //   errors.alternateDriverNumber?.message
                                  // }
                                />
                              </>
                            )}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controller
                            name="altrServiceProvider"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <>
                                <InputLabel id="demo-simple-select-disabled-label">
                                  Network Service Provider:
                                  {/* <span style={{ color: "red" }}>*</span> */}
                                </InputLabel>
                                <Select
                                  fullWidth
                                  size="small"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e)}
                                >
                                  {networkOption.map((ele) => (
                                    <MenuItem key={ele.label} value={ele.value}>
                                      {ele.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {/* {errors.altrServiceProvider && (
                                  <ErrorTypography>
                                    {errors.altrServiceProvider.message}
                                  </ErrorTypography>
                                )} */}
                              </>
                            )}
                          />
                        </Grid>
                      </>
                    )}

                    {/* <Grid item md={12} xs={12}>
                      <InputLabel>
                        Vehicle Doc:
                        //<span className="mandatory-star">*</span>
                      </InputLabel>
                      <Grid item xs={12} md={12}>
                        <div
                          style={{
                            textAlign: "end",
                            position: "relative",
                            // bottom: "50px",
                          }}
                        >
                          {docPath.fleet && (
                            <a
                              href={`${baseUrl}/service/file/download/all/${shipperId}/${veichleDocuments}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <DownloadIcon />
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

                          <Typography sx={{ marginTop: "2px" }}>
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
                            sx={{ marginTop: "2px" }}
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            {" "}
                            Choose a File
                          </Button>
                        </div>
                        {errors.documentsVehicle && (
                          <ErrorTypography>
                            {errors.documentsVehicle.message}
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
                            <IconButton onClick={() => handleRemoveFile(index)}>
                              <Clear />
                            </IconButton>
                          </Box>
                        ))}
                      </Grid>
                    </Grid> */}

                    <Grid item xs={12}>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={12}>
                          <Typography variant="h4">Vehicle Doc</Typography>
                          <div
                            style={{
                              textAlign: "end",
                              position: "relative",
                              bottom: "15px",
                            }}
                          >
                            {docPath.fleet && (
                              <a
                                href={`${baseUrl}/service/file/download/all/${shipperId}/${veichleDocuments}`}
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
                    </Grid>

                    <Grid item md={3} xs={12}>
                      {console.log("here,", checkInBlock)}
                      <Controller
                        name="inTime"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <>
                            <InputLabel>
                              Gate-In Time:
                              <span className="mandatory-star">*</span>
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DateTimePicker"]}>
                                <DateTimePicker
                                  disabled={checkInBlock}
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
                                      setCheckinTime(updatedDateTime);
                                      field.onChange(
                                        updatedDateTime ? updatedDateTime : ""
                                      );
                                    } else {
                                      // setBidDateTime(newValue);
                                      // setValue("initialTime", newValue);
                                      setCheckinTime(newValue);
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
                    <Grid item md={3} xs={12}>
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
                                  // disabled={checkInTime ? false : true}
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
                                    const minAllowedDateTime = checkInTime;

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
                    <Grid item md={3} xs={12}>
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
                                  // disabled={loadingStartTime ? false : true}
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
                    <Grid item md={3} xs={12}>
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
                                  // disabled={loadingEndTime ? false : true}
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
                                      setCheckOut(updatedDateTime);
                                      field.onChange(
                                        updatedDateTime ? updatedDateTime : ""
                                      );
                                    } else {
                                      // setBidDateTime(newValue);
                                      // setValue("initialTime", newValue);
                                      setCheckOut(newValue);
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

                    {/* <Grid item xs={12}>
                      <InputLabel>
                        Company Doc:
                         <span className="mandatory-star">*</span> 
                      </InputLabel>

                      <Grid item xs={12} md={12}>
                        <div
                          style={{
                            textAlign: "end",
                            position: "relative",
                            // bottom: "50px",
                          }}
                        >
                          {docPath.company && (
                            <a
                              href={`${baseUrl}/service/file/download/all/${shipperId}/${companyDocuments}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <DownloadIcon />
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
                    </Grid> */}

                    <Grid item xs={12}>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={12}>
                          <Typography variant="h4">Company Doc</Typography>
                          <div
                            style={{
                              textAlign: "end",
                              position: "relative",
                              bottom: "15px",
                            }}
                          >
                            {docPath.company && (
                              <a
                                href={`${baseUrl}/service/file/download/all/${shipperId}/${companyDocuments}`}
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
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Controller
                        name="eWayBill"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel
                              id="demo-simple-select-disabled-label-eway-bill"
                              sx={{ marginBottom: 1 }}
                            >
                              eWay Bill Number
                              {/* <span style={{ color: "red" }}>*</span> */}
                            </InputLabel>
                            <TextField
                              {...field}
                              variant="outlined"
                              fullWidth
                              size="medium"
                              // error={Boolean(errors.eWayBill)}
                              // helperText={errors.eWayBill?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>

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
            </Card>
          </DialogContent>
          <DialogActions>
            <div className="buttonsCard">
              <Button variant="contained" type="submit">
                Save
              </Button>
              <Button variant="contained" color="error" onClick={closeVechial}>
                Close
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default VehicleInfo;
