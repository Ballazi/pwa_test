import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Card,
  TextField,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import AlertPage from "../../../components/masterData/alert-component/AlertPage";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import GogMapLoad from "./GogMapLoad";
import LoadViewTable from "./LoadViewTable";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import BackdropComponent from "../../../components/backdrop/Backdrop";
import ErrorTypography from "../../../components/typography/ErrorTypography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getSegmentTransporter } from "../../../api/register/segment-details";
import {
  viewShiper,
  viewShiperBidding,
  getRegion,
  viewBranch,
  viewMaterials,
  viewVehicle,
  viewBid,
  viewSegment,
  viewComment,
  save,
  publishBid,
  viewSpecificBranch,
} from "../../../api/trip-management/create-trip";
import {
  capacityMtValidator,
  totalLoadValidator,
  noOfVehicleValidator,
  positiveNumberValidation,
  // basePriceValidator,
  contactNumberValidator,
  requiredValidator,
  finalPriceValidator,
  roleContactNumberValidator,
  materialValidator,
  // requiredValidatorOfArray,
} from "../../../validation/common-validator";
import { useDispatch } from "react-redux";
import {
  fecthSingleShipper,
  fecthSingleBranch,
} from "../../../api/master-data/user";

function CreateLoad() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [bidTypeDropDown, setBidTypeDropDown] = useState([
    { label: "Indent", value: "indent" },
    { label: "Private Pool", value: "private_pool" },
    { label: "Open Market", value: "open_market" },
  ]);
  const [checkBid, setCheckBidtype] = useState(false);
  const [segmentTypeDropDown, setSegmentTypeDropDown] = useState([]);

  // const [requirement, setRequirement] = useState([]);
  const [bidSettingsInfo, setBidSettingsInfo] = useState([]);
  const [originSelected, setOriginSelected] = useState(true);
  const [hasLoadedBranch, setHasLoadedBranch] = useState(false);
  const [commentData, setCommentData] = useState("");
  const [updateUseEffect, setUpdateUseEffect] = useState(true);
  const [contacPersonNumber, setContactPersonNumber] = useState("");
  const [contacPersonName, setContactPersonName] = useState("");
  const [shipperList, setShipperList] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [branchInfo, setBranchInfo] = useState({ src: [null], dest: [null] });
  const [branchOptions, setBranchOptions] = useState([]);
  const [isSegmentDisabled, setIsSegmentDisabled] = useState(true);
  const [isSegmentRequired, setIsSegmentRequired] = useState(false);
  const [reportingTimeFrom, setReportingTimeFrom] = useState(
    dayjs().add(2, "hour").add(15, "minute")
  );
  const [reportingTimeTo, setReportingTimeTo] = useState(
    dayjs().add(30, "minute")
  );
  const [bidDateTime, setBidDateTime] = useState(dayjs().add(1, "hour"));
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [addressValues, setAddressValues] = useState([]);
  const [result, setResult] = useState("");
  const [mapSource, setMapSource] = useState([]);
  const [ids, setIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [mapReset, setMapReset] = useState(false);

  const [loginRegionClusterId, setLoginClusterId] = useState(
    localStorage.getItem("region_cluster_id")
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("user_type"));

  const schemaBuilder = (checkBid) => {
    const baseSchema = yup.object().shape({});

    let conditionalSchema = baseSchema; // Initialize with the base schema

    if (checkBid) {
      conditionalSchema = conditionalSchema.shape({
        ...(localStorage.getItem("user_type") === "acu"
          ? { shipper: requiredValidator("Shipper") }
          : {}),

        indent_transporter_id: requiredValidator("Transporter "),
        indent_amount: finalPriceValidator,
        totalLoad: positiveNumberValidation,
        loadingContactName: requiredValidator("Loading contact person name"),
        loadingContactNumber: roleContactNumberValidator(
          "Loading contact number"
        ),
        unloadingContactPerson: requiredValidator(
          "Unloading contact person name"
        ),
        unloadingContactNumber: roleContactNumberValidator(
          "Unloading contact number"
        ),
        bidType: requiredValidator("Bid mode"),
        vehicleType: requiredValidator("Vehicle Type"),
        capacityMt: capacityMtValidator,
        noOfVehicle: noOfVehicleValidator,
        // basePrice: positiveNumberValidation,
        // noOfVehicle: noOfVehicleValidator,
        materialType: materialValidator,
      });
    } else {
      conditionalSchema = conditionalSchema.shape({
        ...(localStorage.getItem("user_type") === "acu"
          ? { shipper: requiredValidator("Shipper") }
          : {}),

        totalLoad: positiveNumberValidation,
        loadingContactName: requiredValidator("Loading contact person name"),
        loadingContactNumber: roleContactNumberValidator(
          "Loading contact number"
        ),
        unloadingContactPerson: requiredValidator(
          "Unloading contact person name"
        ),
        unloadingContactNumber: roleContactNumberValidator(
          "Unloading contact number"
        ),
        bidType: requiredValidator("Bid mode"),
        vehicleType: requiredValidator("Vehicle Type"),
        capacityMt: capacityMtValidator,
        noOfVehicle: noOfVehicleValidator,
        basePrice: positiveNumberValidation,
        // noOfVehicle: noOfVehicleValidator,
        materialType: materialValidator,
      });
    }

    return conditionalSchema;
  };
  const schema = schemaBuilder(checkBid);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    trigger,
    // clearErrors,
    // setError,
    // reset,
    formControl,
    formState: {
      errors,
      // isSubmitting,
      // isValid,
    },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleFullScreen(val) {
    if (val === 1) {
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }
  // used to exit from full screen
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
    if (localStorage.getItem("user_type") != "acu") {
      setValue("shipper", localStorage.getItem("user_id"));
      setValue("region", loginRegionClusterId);
      setValue("branch", localStorage.getItem("branch_id"));

      fetchTransporter(localStorage.getItem("user_id"));
      fetchRegionData(localStorage.getItem("user_id"));
      fetchBidMode(localStorage.getItem("user_id"));
      fetchBranchData(localStorage.getItem("user_id"));
      fetchComment(localStorage.getItem("user_id"));
      fetchSegment(localStorage.getItem("user_id"));
      fetchSingleShipper(localStorage.getItem("user_id"));
      fetchVehicleData(localStorage.getItem("user_id"));
      fetchMaterialsData(localStorage.getItem("user_id"));
      fetchShiper();
    }
    if (document.fullscreenElement) {
      // console.log("in the useEffect");
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }, [updateUseEffect]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
  }, []);

  // useEffect(() => {
  //   console.log("mapSource", mapSource);
  //   if (mapSource.length >= 1) {
  //     getSourceDestination(mapSource);
  //   }
  // }, [mapSource]);

  useEffect(() => {
    const arrayOfIds = selectedRows.map((obj) => obj.id);
    console.log("setid", arrayOfIds);

    setIds(arrayOfIds);
  }, [selectedRows]);

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
  useEffect(() => {
    if (isFullScreen) {
      handleGoogleMapFullScreen();
    }
    console.log("fullScreen", isFullScreen);
  }, [isFullScreen]);

  const loadCreateHandler = () => {
    setAlertType("warning");
    setMessage("All fields are required");
  };

  const closePopup = () => {
    setAlertType("");
    setMessage("");
  };
  //this function will get the sources and destinations from google map
  function getSourceDestination(val_all, src, dest) {
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
        is_prime: i === 0 ? true : false,
      };
      updatedAddress.push(pairedAddress);

      console.log(`Pair ${i + 1}:`);
      console.log();
    }
    console.log("updated Address", updatedAddress);
    setAddressValues(updatedAddress);
  }

  // const updateDestination = (val) => {
  //   // console.log("check", val);
  //   // let load_newVal = { ...newVal };
  //   // console.log("new val", newVal);
  //   getSourceDestination(val);
  // };
  const [saveClicked, setSaveClicked] = useState(false);

  // const handleSaveClick = () => {
  //   alert("ok")
  //   // Toggle the value of saveClicked to trigger the useEffect in LoadViewTable
  //   setSaveClicked((prev) => !prev);
  // };

  const onSubmitForm = async (value) => {
    console.log(saveClicked);
    setIsLoading(true);
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

    if (!src_dest_present) {
      console.log("in the zero");
      setIsLoading(false);
      dispatch(
        openSnackbar({
          type: "error",
          message: "sources and destination is required",
        })
      );
    } else if (!originSelected) {
      setIsLoading(false);
      dispatch(
        openSnackbar({
          type: "error",
          message: "select Source from dropdown",
        })
      );
    } else {
      console.log("in api", value);

      var res = await save(
        value,
        addressValues,
        commentData,
        reportingTimeFrom,
        reportingTimeTo,
        bidSettingsInfo,
        bidDateTime
      );
      console.log(res);
      if (res.data.success === true) {
        // reset();
        setMapReset(true);
        // setReportingTimeFrom(null);
        // setReportingTimeTo(null);
        // setBidDateTime(null);
        setIsLoading(false);
        setSaveClicked((prev) => !prev);
        setAddressValues([]);
        dispatch(
          openSnackbar({ type: "success", message: res.data.clientMessage })
        );
        setUpdateUseEffect(!updateUseEffect);
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

  useEffect(() => {
    if (bidDateTime) {
      const oneHourLater = dayjs(bidDateTime).add(1, "hour").add(15, "minute");

      if (
        reportingTimeFrom &&
        dayjs(reportingTimeFrom).isBefore(oneHourLater)
      ) {
        setReportingTimeFrom(oneHourLater);
      }
    }
  }, [bidDateTime, reportingTimeFrom]);

  useEffect(() => {
    if (reportingTimeTo && reportingTimeFrom) {
      const checkInTime = dayjs(reportingTimeFrom);
      const checkOutTime = dayjs(reportingTimeTo);

      const minCheckOutTime = checkInTime.add(30, "minute");

      if (checkOutTime.isBefore(minCheckOutTime)) {
        setReportingTimeTo(minCheckOutTime);
      }
    }
  }, [reportingTimeTo, reportingTimeFrom]);

  const fetchShiper = () => {
    setIsLoading(true);
    return viewShiperBidding()
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
  const [transporterList, setTransporterList] = useState([]);

  const fetchTransporter = (shipperId) => {
    setIsLoading(true);
    const payload = {
      shipper_id: shipperId,
    };
    return getSegmentTransporter(payload)
      .then((data) => {
        console.log("===>", data.data.success);

        if (data.data.success === true) {
          // let tempData = [];
          console.log("===>", data.data.data);
          const tempData = data.data.data.map((item, index) => {
            return {
              label: item.name,
              value: item.trnsp_id,
            };
          });
          setTransporterList(tempData);
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
          console.log(res.data.data);
          setValue("bidType", res.data.data.bid_mode);
          setIsSegmentDisabled(res.data.data.bid_mode == "open_market");
          setIsSegmentRequired(res.data.data.bid_mode === "private_pool");
          // console.log("===>", updatedMaterials);
          setBidSettingsInfo(res.data.data);
          trigger("bidType");
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
          setValue("loadingContactName", data.data.contact_person);
          setValue("loadingContactNumber", data.data.contact_no);
          setValue("unloadingContactNumber", data.data.contact_no);
          setValue("unloadingContactPerson", data.data.contact_person);
          setContactPersonName(data.data.contact_person);
          ////////////////////////
          trigger("loadingContactName");
          trigger("loadingContactNumber");
          trigger("unloadingContactPerson");
          trigger("unloadingContactNumber");
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
          setValue("loadingContactName", data.data.contact_person);
          setValue("loadingContactNumber", data.data.contact_no);
          setValue("unloadingContactNumber", data.data.contact_no);
          setValue("unloadingContactPerson", data.data.contact_person);
          setContactPersonName(data.data.contact_person);
          ///////////////////
          trigger("loadingContactName");
          trigger("loadingContactNumber");
          trigger("unloadingContactPerson");
          trigger("unloadingContactNumber");
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

  const fetchSegment = (id) => {
    setIsLoading(true);
    const payload = {
      shipper_id: id,
    };
    return viewSegment(payload)
      .then((data) => {
        // console.log("data is coming segment", data.data);
        if (data.data.success === true) {
          console.log("outside if", data.data.data);
          if (data.data.data.length > 0) {
            const segmentData = data.data.data.map((item) => ({
              label: item.name,
              value: item.seg_id,
            }));
            // console.log("segmentData", segmentData);
            setSegmentTypeDropDown(segmentData);
          }
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setSegmentTypeDropDown([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchComment = (id) => {
    setIsLoading(true);
    // console.log("shipper id", id);
    const payload = {
      shipper_id: id,
    };
    return viewComment(payload)
      .then((data) => {
        // console.log("data is coming comment", data.data.success);
        if (data.data.success === true) {
          // console.log("outside if", data.data.data.cmmnt_text);
          if (data.data.data.cmmnt_text) {
            setValue("comment", data.data.data.cmmnt_text);
          }
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setCommentData([]);
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
    fetchShiper();
  }, []);

  const handleBidTypeChange = (value) => {
    console.log("bidMode", value);

    if (value === "indent") {
      setCheckBidtype(true);
    } else {
      setCheckBidtype(false);
    }
    console.log("checkbid", value);
    // Check if the selected value is 'Open Market' to enable or disable the 'Segment' field
    setIsSegmentDisabled(value == "open_market");
    setIsSegmentRequired(value === "private_pool");

    if (value === "open_market") {
      setValue("segment", "");
    } else {
      setValue("segment", "");
    }
  };

  // console.log("item", segmentTypeDropDown);

  const handleSetValues = (val) => {
    if (val || val != 0) {
      const capacity = getValues("capacityMt");
      const total = parseFloat(val) / capacity;

      const tolerance = 0.1;
      const roundedTotal =
        total - Math.floor(total) <= tolerance
          ? Math.floor(total)
          : Math.ceil(total);

      // const roundedTotal = Math.ceil(total);
      if (roundedTotal === 0) {
        setValue("noOfVehicle", 1);
      } else {
        setValue("noOfVehicle", roundedTotal);
      }

      setValue("totalLoad", val);
      trigger("noOfVehicle");
    } else if (val === 0) {
      setValue("noOfVehicle", 1);
      setValue("totalLoad", "");
      trigger("noOfVehicle");
    } else {
      setValue("noOfVehicle", 1);
      setValue("totalLoad", "");
      trigger("noOfVehicle");
    }
  };

  const dispatch = useDispatch();

  const rowUpdateHandler = (row) => {
    console.log("select", row);
    setSelectedRows(row);
  };

  const publishHandler = () => {
    setIsLoading(true);
    const payload = {
      ids,
    };
    publishBid(payload)
      .then((res) => {
        console.log("res", res);
        if (res.data.success === true) {
          setSaveClicked((prev) => !prev);
          setIds([]);
          dispatch(
            openSnackbar({ type: "success", message: res.data.clientMessage })
          );
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

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <BackdropComponent loading={loading} />

      {/* {console.log("hihi", errors)} */}
      <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
        {alertType !== "" ? (
          <AlertPage
            alertType={alertType}
            message={message}
            closePopup={closePopup}
          />
        ) : (
          ""
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card style={{ padding: "10px" }}>
                  <div className="customCardheader">
                    <Typography variant="h4"> Create Trip</Typography>
                    {contacPersonName ? (
                      <Typography variant="h6">
                        {" "}
                        Contact Person: {contacPersonName} ({contacPersonNumber}
                        )
                      </Typography>
                    ) : (
                      ""
                    )}
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="shipper"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Select shipper*">
                              <InputLabel
                                htmlFor="shipper"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                {userRole === "acu"
                                  ? " Select shipper*"
                                  : "Shipper*"}
                              </InputLabel>
                            </Tooltip>

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
                                if (newValue !== null) {
                                  fetchRegionData(newValue.value);
                                  fetchTransporter(newValue.value);
                                  fetchBranchData(newValue.value);

                                  fetchBidMode(newValue.value);
                                  fetchSegment(newValue.value);
                                  fetchComment(newValue.value);
                                  fetchSingleShipper(newValue.value);

                                  setValue("segment", "");
                                  setValue("region", "");
                                  setValue("branch", "");
                                  setValue("bidType", "");
                                }
                              }}
                              onBlur={() => {
                                // Check if the value is empty (cleared)
                                if (!field.value) {
                                  setValue("loadingContactName", "");
                                  setValue("loadingContactNumber", "");
                                  setValue("unloadingContactNumber", "");
                                  setValue("unloadingContactPerson", "");
                                  setValue("segment", "");
                                  setValue("region", "");
                                  setValue("branch", "");
                                  setValue("bidType", "");
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
                                    localStorage.getItem(
                                      "region_cluster_id"
                                    ) === "null"
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
                    {/* <Grid item xs={12} sm={4} md={4} lg={4}>
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
                                fontSize: "17px",
                              }}
                            >
                              Contact Number*
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
                    </Grid> */}
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="loadingContactName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Loading contact person*">
                              <InputLabel
                                htmlFor="loadingContactName"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Loading contact person*
                              </InputLabel>
                            </Tooltip>

                            <TextField
                              {...field}
                              label=""
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={Boolean(errors.loadingContactName)}
                              helperText={errors.loadingContactName?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="loadingContactNumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Loading contact number*">
                              <InputLabel
                                htmlFor="loadingContactNumber"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Loading contact number*
                              </InputLabel>
                            </Tooltip>

                            <TextField
                              {...field}
                              label=""
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={Boolean(errors.loadingContactNumber)}
                              helperText={errors.loadingContactNumber?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="unloadingContactPerson"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Unloading contact person*">
                              <InputLabel
                                htmlFor="unloadingContactPerson"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Unloading contact person*
                              </InputLabel>
                            </Tooltip>

                            <TextField
                              {...field}
                              label=""
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={Boolean(errors.unloadingContactPerson)}
                              helperText={
                                errors.unloadingContactPerson?.message
                              }
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="unloadingContactNumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Unloading contact number*">
                              <InputLabel
                                htmlFor="unloadingContactNumber"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Unloading contact number*
                              </InputLabel>
                            </Tooltip>

                            <TextField
                              {...field}
                              label=""
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={Boolean(errors.unloadingContactNumber)}
                              helperText={
                                errors.unloadingContactNumber?.message
                              }
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="bidType"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Bid mode*">
                              <InputLabel
                                htmlFor="bidType"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Bid mode*
                              </InputLabel>
                            </Tooltip>

                            <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              error={Boolean(errors.bidType)}
                            >
                              <Select
                                {...field}
                                labelId="bid-label"
                                id="bidType"
                                label=""
                                IconComponent={KeyboardArrowDownIcon}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  handleBidTypeChange(e.target.value);
                                }}
                                disabled={
                                  bidSettingsInfo?.bid_mode != "open_market"
                                }
                              >
                                {bidTypeDropDown.map((item) => {
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
                              {errors.bidType && (
                                <ErrorTypography>
                                  {errors.bidType.message}
                                </ErrorTypography>
                              )}
                            </FormControl>
                          </>
                        )}
                      />
                    </Grid>

                    {/* check */}
                    {/* <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="segment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Segment">
                              <InputLabel
                                htmlFor="segment"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Segment
                              </InputLabel>
                            </Tooltip>

                            <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                              error={Boolean(errors.bidType)}
                            >
                              <Select
                                style={{
                                  backgroundColor:
                                    isSegmentDisabled && "#D3D3D3",
                                }}
                                {...field}
                                labelId="bid-label"
                                id="segment"
                                label=""
                                IconComponent={KeyboardArrowDownIcon}
                                disabled={isSegmentDisabled}
                                // required={isSegmentRequired}
                              >
                                {segmentTypeDropDown.map((item) => {
                                  // console.log("item", item);
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
                            </FormControl>
                          </>
                        )}
                      />
                    </Grid> */}

                    {checkBid ? (
                      <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Controller
                          name="indent_transporter_id"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <>
                              <Tooltip title="Select shipper*">
                                <InputLabel htmlFor="shipper">
                                  Transporter*
                                </InputLabel>
                              </Tooltip>

                              <Autocomplete
                                {...field}
                                options={transporterList}
                                getOptionLabel={(option) => option.label || ""}
                                value={
                                  transporterList.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
                                onChange={(_, newValue) => {
                                  field.onChange(
                                    newValue ? newValue.value : ""
                                  );
                                  if (newValue !== null) {
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
                                    error={!!errors.shipper}
                                    helperText={errors.shipper?.message}
                                  />
                                )}
                              />
                              {errors.indent_transporter_id && (
                                <ErrorTypography>
                                  {errors.indent_transporter_id.message}
                                </ErrorTypography>
                              )}
                            </>
                          )}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Controller
                          name="segment"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <>
                              <Tooltip title="Segment">
                                <InputLabel
                                  htmlFor="segment"
                                  shrink
                                  sx={{
                                    fontSize: "17px",
                                  }}
                                >
                                  Segment
                                </InputLabel>
                              </Tooltip>

                              <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={Boolean(errors.bidType)}
                              >
                                <Select
                                  style={{
                                    backgroundColor:
                                      isSegmentDisabled && "#D3D3D3",
                                  }}
                                  {...field}
                                  labelId="bid-label"
                                  id="segment"
                                  label=""
                                  IconComponent={KeyboardArrowDownIcon}
                                  disabled={isSegmentDisabled}
                                  // required={isSegmentRequired}
                                >
                                  {segmentTypeDropDown.map((item) => {
                                    // console.log("item", item);
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
                              </FormControl>
                            </>
                          )}
                        />
                      </Grid>
                    )}

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
                                    materials.find((item) => item.id === id)
                                      ?.name
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
                                        materials.find((item) => item.id === id)
                                          ?.name
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
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="vehicleType"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Vehicle type*">
                              <InputLabel
                                htmlFor="vehicleType"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Vehicle type*
                              </InputLabel>
                            </Tooltip>

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
                                  setValue("capacityMt", data.capacity);
                                  setValue("vehicleType", data.id);
                                  trigger("capacityMt");
                                  trigger("vehicleType");
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 300, // Set the maximum height for the menu
                                    },
                                  },
                                }}
                              >
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
                        name="capacityMt"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Capacity (MT)*">
                              <InputLabel
                                htmlFor="capacityMt"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Capacity (MT)*
                              </InputLabel>
                            </Tooltip>{" "}
                            <TextField
                              {...field}
                              label=""
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={Boolean(errors.capacityMt)}
                              helperText={errors.capacityMt?.message}
                              disabled={true}
                            />
                          </>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="totalLoad"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Total load">
                              <InputLabel
                                htmlFor="totalLoad"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Total load
                              </InputLabel>
                            </Tooltip>

                            <TextField
                              {...field}
                              label=""
                              variant="outlined"
                              type="number"
                              fullWidth
                              InputProps={{ inputProps: { min: 0 } }}
                              size="small"
                              error={Boolean(errors.totalLoad)}
                              helperText={errors.totalLoad?.message}
                              // onChange={handleTotalLoadChange}
                              // onChange={(e) =>
                              //   handleSetValues(Math.max(0, e.target.value))
                              // }
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleSetValues(e.target.value);
                              }}
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
                            <Tooltip title="No. of vehicle*">
                              <InputLabel
                                htmlFor="noOfVehicle"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                No. of vehicle*
                              </InputLabel>
                            </Tooltip>

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
                    {checkBid ? (
                      <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Controller
                          name="indent_amount"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <>
                              <Tooltip title="Final price*">
                                <InputLabel htmlFor="final">
                                  Final price*
                                </InputLabel>
                              </Tooltip>

                              <TextField
                                {...field}
                                label=""
                                variant="outlined"
                                fullWidth
                                size="small"
                                error={Boolean(errors.indent_amount)}
                                helperText={errors.indent_amount?.message}
                              />
                            </>
                          )}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Controller
                          name="basePrice"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <>
                              <Tooltip title="Base price">
                                <InputLabel
                                  htmlFor="basePrice"
                                  shrink
                                  sx={{
                                    fontSize: "17px",
                                  }}
                                >
                                  Base price
                                </InputLabel>
                              </Tooltip>

                              <TextField
                                {...field}
                                label=""
                                variant="outlined"
                                fullWidth
                                size="small"
                                error={Boolean(errors.basePrice)}
                                helperText={errors.basePrice?.message}
                              />
                            </>
                          )}
                        />
                      </Grid>
                    )}

                    {}
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      {checkBid ? (
                        ""
                      ) : (
                        <Controller
                          name="biddingTimeValidator"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <>
                              <Tooltip title="Bidding date and time*">
                                <InputLabel id="demo-simple-select-disabled-label">
                                  Bidding date and time*
                                </InputLabel>
                              </Tooltip>

                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DateTimePicker
                                    size="small"
                                    disablePast
                                    format="DD/MM/YYYY hh:mm A"
                                    disabled={checkBid}
                                    value={bidDateTime}
                                    onChange={(newValue) => {
                                      const selectedDateTime = dayjs(newValue);
                                      const currentDateTime = dayjs();

                                      // Ensure that the selected time is at least 1 hour after the current time
                                      const minAllowedDateTime =
                                        currentDateTime.add(1, "hour");

                                      if (
                                        selectedDateTime.isBefore(
                                          minAllowedDateTime
                                        )
                                      ) {
                                        // If the selected date and time is before the minimum allowed time,
                                        // set the selected time to the minimum allowed time
                                        const updatedDateTime =
                                          minAllowedDateTime;
                                        setBidDateTime(updatedDateTime);
                                        field.onChange(
                                          updatedDateTime ? updatedDateTime : ""
                                        );
                                      } else {
                                        setBidDateTime(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
                                      }
                                    }}
                                    // slotProps={{
                                    //   textField: {
                                    //     name: "biddingTimeValidator",
                                    //     error: Boolean(
                                    //       errors.biddingTimeValidator
                                    //     ),
                                    //     helperText:
                                    //       errors.biddingTimeValidator?.message,
                                    //   },
                                    // }}
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </>
                          )}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Tooltip title=" Reporting time range*">
                        <InputLabel id="demo-simple-select-disabled-label">
                          Reporting time range*
                        </InputLabel>
                      </Tooltip>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <Controller
                            name="checkInTimeValidator"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer
                                    components={["DateTimePicker"]}
                                  >
                                    <DateTimePicker
                                      size="small"
                                      label="From"
                                      disablePast
                                      format="DD/MM/YYYY hh:mm A"
                                      value={reportingTimeFrom}
                                      onChange={(newValue) => {
                                        // Set both "From" and "To" to the selected value
                                        setReportingTimeFrom(newValue);
                                        setReportingTimeTo(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
                                      }}
                                      slotProps={{
                                        textField: {
                                          // name: "checkInTimeValidator",
                                          // error: Boolean(errors.checkInTimeValidator),
                                          // helperText: errors.checkInTimeValidator?.message,
                                        },
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </>
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <Controller
                            name="checkOutTimeValidator"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer
                                    components={["DateTimePicker"]}
                                  >
                                    <DateTimePicker
                                      size="small"
                                      label="To"
                                      disablePast
                                      format="DD/MM/YYYY hh:mm A"
                                      value={reportingTimeTo || null}
                                      onChange={(newValue) => {
                                        setReportingTimeTo(newValue);
                                        field.onChange(
                                          newValue ? newValue : ""
                                        );
                                      }}
                                      slotProps={{
                                        textField: {
                                          name: "checkOutTimeValidator",
                                          error: Boolean(
                                            errors.checkOutTimeValidator
                                          ),
                                          helperText:
                                            errors.checkOutTimeValidator
                                              ?.message,
                                        },
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Controller
                        name="comment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip title="Comment">
                              <InputLabel
                                htmlFor="comment"
                                shrink
                                sx={{
                                  fontSize: "17px",
                                }}
                              >
                                Comment
                              </InputLabel>
                            </Tooltip>

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
                xs={12}
                sm={12}
                md={6}
                lg={6}
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
                    height: isFullScreen ? "100vh" : "755px",
                  }}
                >
                  <div className="customCardheader">
                    <Typography variant="h4"> Google Map</Typography>
                  </div>

                  <GogMapLoad
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
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
            <Grid
              container
              spacing={2}
              justifyContent="flex-end"
              alignItems="center"
            >
              &nbsp;
              <Button variant="contained" size="small" type="submit">
                Save
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <LoadViewTable
              key={saveClicked}
              updateSelectedRow={rowUpdateHandler}
            />
          </Grid>
          {/* {console.log("newselect", ids.length)} */}
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
            <Grid
              container
              spacing={2}
              justifyContent="flex-end"
              alignItems="center"
            >
              &nbsp;
              <Button
                variant="contained"
                size="small"
                onClick={publishHandler}
                disabled={ids.length > 0 ? false : true}
              >
                Publish
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
}

export default CreateLoad;
