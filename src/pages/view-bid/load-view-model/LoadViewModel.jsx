import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Grid,
  TextField,
  InputLabel,
  Select,
  Autocomplete,
  MenuItem,
  DialogContent,
  FormControl,
  DialogActions,
  Dialog,
  Button,
  Tooltip,
} from "@mui/material";
import { getSegmentTransporter } from "../../../api/register/segment-details";
import Checkbox from "@mui/material/Checkbox";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import GogMapLoad from "../../load-management/create-load/GogMapLoad";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import ErrorTypography from "../../../components/typography/ErrorTypography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  requiredValidator,
  contactNumberValidator,
  roleContactNumberValidator,
  capacityMtValidator,
  totalLoadValidator,
  noOfVehicleValidator,
  basePriceValidator,
  nonRequiredValidator,
  materialValidator,
  finalPriceValidator,
  positiveNumberValidation,
} from "../../../validation/common-validator";
import {
  viewShiper,
  viewShiperBidding,
  getRegion,
  viewBranch,
  viewMaterials,
  viewVehicle,
  viewBid,
  viewSegment,
  viewBranchOnly,
  viewComment,
  UpdateBid,
  viewSpecificBranch,
} from "../../../api/trip-management/create-trip";
import BackdropComponent from "../../../components/backdrop/Backdrop";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import { viewBidDetails } from "../../../api/trip-management/manage-trip";
import {
  fecthSingleShipper,
  fecthSingleBranch,
} from "../../../api/master-data/user";

function LoadVideModel({
  selectedId,
  status,
  handleCloseModal,
  operational_accesses,
  superAdmin,
}) {
  const [checkBid, setCheckBidtype] = useState(false);
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
    // reset,
    setValue,
    getValues,
    trigger,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [disbledValue, setDisbledValue] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [bidTypeDropDown, setBidTypeDropDown] = useState([
    { label: "Indent", value: "indent" },
    { label: "Private Pool", value: "private_pool" },
    { label: "Open Market", value: "open_market" },
  ]);
  console.log("perational_accesses", operational_accesses);
  const userType = localStorage.getItem("user_type");
  const [segmentTypeDropDown, setSegmentTypeDropDown] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem("user_type"));
  const [contacPersonName, setContactPersonName] = useState("");
  const [requirement, setRequirement] = useState([]);
  const [viewBidType, setViewBidType] = useState([]);
  const [commentData, setCommentData] = useState("");
  const [contacPersonNumber, setContactPersonNumber] = useState("");
  const [shipperList, setShipperList] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [isSegmentDisabled, setIsSegmentDisabled] = useState(true);
  const [segmentDis, setSegmentDis] = useState(false);
  const [branchInfo, setBranchInfo] = useState({ src: [null], dest: [null] });
  const [originSelected, setOriginSelected] = useState(true);

  // const [isSegmentRequired, setIsSegmentRequired] = useState(false);
  const [accordianDisabled, setAccordianDisabled] = useState(true);
  const [updatedSourceDest, setUpdatedSourceDest] = useState({});
  const [reportingTimeFrom, setReportingTimeFrom] = useState();
  const [reportingTimeTo, setReportingTimeTo] = useState();
  const [bidDateTime, setBidDateTime] = useState();
  const [addressValues, setAddressValues] = useState([]);

  const fetchShiper = () => {
    return viewShiperBidding()
      .then((data) => {
        if (data.success === true) {
          const tempData = data.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          setShipperList(tempData);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  function getPairedSourceDestination(val_all, src, dest) {
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
  const fetchMaterialsData = () => {
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
      });
  };

  const fetchVehicleData = () => {
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
          const vehicleId = getValues("vehicleType");
          updatedVehicles.forEach((ele) => {
            if (ele.id === vehicleId) {
              setValue("capacityMt", ele.capacity);
            }
          });
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setVehicles([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const fetchBidMode = (id) => {
    const payload = {
      shipper_id: id,
    };
    return viewBid(payload)
      .then((data) => {
        console.log("bid mode.......", data.data);
        if (data.data.success === true) {
          if (data.data.data.length > 0) {
            const bidModedata = data.data.data.map((item) => item.bid_mode);
            console.log("bid mode.......", bidModedata);
            setBidTypeDropDown(bidModedata);
          }
          // setViewBidType(updatedMaterials);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setViewBidType([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const fetchSegment = (id) => {
    const payload = {
      shipper_id: id,
      // isRegion: true,
    };
    return viewSegment(payload)
      .then((data) => {
        if (data.data.success === true) {
          if (data.data.data.length > 0) {
            if (data.data.data.length > 0) {
              const segmentData = data.data.data.map((item) => ({
                label: item.name,
                value: item.seg_id,
              }));
              // console.log("segmentData", segmentData);
              setSegmentTypeDropDown(segmentData);
            }
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
      });
  };

  const fetchComment = (id) => {
    const payload = {
      shipper_id: id,
      // isRegion: true,
    };
    return viewComment(payload)
      .then((data) => {
        if (data.data.success === true) {
          if (data.data.data.length > 0) {
            const comment = data.data.data.map((item) => item.name);
            setCommentData(comment);
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
      });
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
      setIsFullScreen(false);
    }
  }
  function transformSourceAndDest(data) {
    console.log("in the func", data);
    const transformedData = {
      load_source: data.load_source.map((item) => {
        const parts = item.src_city.split(","); // Split by comma
        const srcCity = parts[0].trim(); // Get the first part as city
        const srcState = parts.length > 2 ? parts[1].trim() : srcCity; // Get the second part as state if present (more than 2 parts), otherwise use the city
        const srcCountry = parts[parts.length - 1].trim(); // Get the last part as country

        return {
          ...item,
          src_city: srcCity,
          src_state: srcState,
          src_country: srcCountry,
          src_street_address: srcCity,
        };
      }),
      load_dest: data.load_dest[0].src_country
        ? data.load_dest
        : data.load_dest.map((item) => {
            const parts = item.src_city.split(","); // Split by comma
            const srcCity = parts[0].trim(); // Get the first part as city
            const srcState = parts.length > 2 ? parts[1].trim() : srcCity; // Get the second part as state if present (more than 2 parts), otherwise use the city
            const srcCountry = parts[parts.length - 1].trim(); // Get the last part as country

            return {
              ...item,
              src_city: srcCity,
              src_state: srcState,
              src_country: srcCountry,
              src_street_address: srcCity,
            };
          }),
    };

    return transformedData;
  }

  function getSourceDestination(value) {
    console.log("source destination", value);
    console.log("type of value", typeof value);
    let srcList = [];
    let destList = [];
    if (Array.isArray(value)) {
      value.map((val, index) => {
        let src_addrs =
          val.src_city + "," + val.src_state + "," + val.src_country;
        let dest_addrs =
          val.dest_city + "," + val.dest_state + "," + val.dest_country;
        console.log("src", src_addrs, dest_addrs);
        if (!srcList.includes(src_addrs)) {
          srcList.push(src_addrs);
        }

        if (!destList.includes(dest_addrs)) {
          destList.push(dest_addrs);
        }
      });

      // getPairedSourceDestination("", srcList, destList);
      console.log("type of value", value);

      setUpdatedSourceDest({ src: srcList, dest: destList });
      setAddressValues([...value]);
    } else {
      // const transformedData = transformSourceAndDest(value);
      // console.log("transformData", transformedData);

      getPairedSourceDestination("", value.load_source, value.load_dest);
    }
    // if (typeof value === "object") {
    //   console.log(
    //     "updated source destination",
    //     value.load_source,
    //     value.load_dest
    //   );
    //   getPairedSourceDestination("", value.load_source, value.load_dest);
    // } else {
    //   value.map((val, index) => {
    //     let src_addrs =
    //       val.src_city + "," + val.src_state + "," + val.src_country;
    //     let dest_addrs =
    //       val.dest_city + "," + val.dest_state + "," + val.dest_country;
    //     console.log("src", src_addrs, dest_addrs);
    //     srcList.push(src_addrs);
    //     destList.push(dest_addrs);
    //   });

    //   // getPairedSourceDestination("", srcList, destList);
    //   console.log("type of value", typeof value);

    //   setUpdatedSourceDest({ src: srcList, dest: destList });
    //   setAddressValues([...value]);
    // }
    // value.map((val, index) => {
    //   let src_addrs =
    //     val.src_city + "," + val.src_state + "," + val.src_country;
    //   let dest_addrs =
    //     val.dest_city + "," + val.dest_state + "," + val.dest_country;
    //   console.log("src", src_addrs, dest_addrs);
    //   srcList.push(src_addrs);
    //   destList.push(dest_addrs);
    // });

    // // getPairedSourceDestination("", srcList, destList);
    // console.log("type of value", typeof value);

    // setUpdatedSourceDest({ src: srcList, dest: destList });
    // setAddressValues([...value]);
  }

  function handleGoogleMapFullScreen() {
    let elem = document.getElementById("GogMApLoad");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  }
  useEffect(() => {
    if (branchInfo.src[0] !== null) {
      console.log("here branch", branchInfo.src[0]);
      updatedSourceDest.src[0] = branchInfo.src[0];
      console.log("after updatation", updatedSourceDest);
      setUpdatedSourceDest({ ...updatedSourceDest });
    }
  }, [branchInfo]);
  function removeUnderScore(val) {}
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

  const fetchDetails = () => {
    setIsLoading(true);
    return viewBidDetails(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          const values = res.data.data[0];
          console.log("updated response", values);
          getSourceDestination(values["srcdest_list"]);

          //  alert("abcd", values)

          fetchRegionData(values.bl_shipper_id);
          fetchTransporter(values.bl_shipper_id);
          fetchBidMode(values.bl_shipper_id);
          fetchSegment(values.bl_shipper_id);
          fetchComment(values.bl_shipper_id);
          fetchBranchData(values.bl_shipper_id);
          // fetchSingleShipper(values.bl_shipper_id);
          setValue("shipper", values.bl_shipper_id);
          setValue("region", values.bl_region_cluster_id);
          setValue("branch", values.bl_branch_id);
          setContactPersonNumber(values.loading_contact_no);
          setContactPersonName(values.loading_contact_name);
          setValue("loadingContactName", values.loading_contact_name);
          setValue("loadingContactNumber", values.loading_contact_no);
          setValue("unloadingContactPerson", values.unloading_contact_name);
          setValue("unloadingContactNumber", values.unloading_contact_no);
          setValue("indent_transporter_id", values.indent_transporter_id);
          setValue("indent_amount", values.indent_amount);

          // alert(values.bid_mode);
          setValue("bidType", values.bid_mode);
          if (values.bid_mode === "indent") {
            setCheckBidtype(true);
          } else {
            setCheckBidtype(false);
          }
          setIsSegmentDisabled(values.bid_mode === "open_market");
          // setIsSegmentRequired(values.bid_mode === "private_pool");
          setValue("segment", values.bl_segment_id);
          setValue("vehicleType", values.fleet_type);

          setValue("noOfVehicle", values.no_of_fleets);

          if (values.net_qty === 0) {
            setValue("totalLoad", "");
          } else {
            setValue("totalLoad", values.net_qty);
          }

          if (values.base_price === 0) {
            setValue("basePrice", "");
          } else {
            setValue("basePrice", values.base_price);
          }

          setReportingTimeFrom(dayjs(values.reporting_from_time));
          setReportingTimeTo(dayjs(values.reporting_to_time));
          setBidDateTime(dayjs(values.bid_time));
          setValue("comment", values.comments);
          setValue(
            "materialType",
            values.material_list.map((val) => val.mlm_material_id)
          );

          console.log(".........", res.data.data);

          // contactNumber: contactNumberValidator,
          // segment: requiredValidator("Segment"),
          // // materialType: materialTypeValidator,
          // vehicleType: requiredValidator("Vehicle Type"),

          // capacityMt: capacityMtValidator,
          // totalLoad: totalLoadValidator,
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
  useEffect(() => {
    fetchMaterialsData();
    fetchShiper();
    fetchDetails();
    fetchVehicleData();
  }, []);
  useEffect(() => {
    const getInitialData = async () => {
      await fetchMaterialsData();
      await fetchShiper();
      await fetchDetails();
      await fetchVehicleData();
      document.addEventListener("fullscreenchange", exitHandler);
    };
    getInitialData();
  }, []);

  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }, []);

  useEffect(() => {
    if (isFullScreen) {
      handleGoogleMapFullScreen();
    }
    console.log("fullScreen", isFullScreen);
  }, [isFullScreen]);

  const handleBidTypeChange = (value) => {
    setIsSegmentDisabled(value === "Open Market");
    if (value === "indent") {
      setCheckBidtype(true);
    } else {
      setCheckBidtype(false);
    }
    // setIsSegmentRequired(value === "Private Pull");
    if (value === "open_market") {
      setValue("segment", "");
      setIsSegmentDisabled(true);

      // alert(isSegmentDisabled)
    } else {
      setValue("segment", "");
    }
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
          setContactPersonName(data.data.contact_person);
          setValue("loadingContactName", data.data.contact_person);
          setValue("loadingContactNumber", data.data.contact_no);
          setValue("unloadingContactNumber", data.data.contact_no);
          setValue("unloadingContactPerson", data.data.contact_person);
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
  const onSubmit = async (value) => {
    console.log("material", value.materialType);
    console.log("material", typeof value.materialType);
    console.log(
      " view value",
      value,

      reportingTimeFrom,
      reportingTimeTo,
      bidDateTime,
      selectedId,
      status,
      updatedSourceDest,
      addressValues,
      originSelected
    );
    if (
      Object.keys(addressValues[0].load_source).length === 0 ||
      Object.keys(addressValues[0].load_dest).length === 0
    ) {
      dispatch(
        openSnackbar({
          type: "error",
          message: "Source and Destination should be there",
        })
      );
    } else if (addressValues.length == 0) {
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
      var res = await UpdateBid(
        value,
        updatedSourceDest,
        reportingTimeFrom,
        reportingTimeTo,
        bidDateTime,
        selectedId,
        status,
        addressValues
      );
      console.log("res", res);
      if (res.data.success === true) {
        dispatch(
          openSnackbar({ type: "success", message: res.data.clientMessage })
        );

        handleCloseModal();
      } else {
        dispatch(
          openSnackbar({
            type: "error",
            message: res.data?.clientMessage ?? "Something went wrong!",
          })
        );
      }

      setDisbledValue(true);
    }
  };

  const onCloseModel = () => {
    setDisbledValue(true);
    handleCloseModal();
  };

  const handleSetValues = (val) => {
    if (val || val != 0) {
      const capacity = getValues("capacityMt");
      const total = parseFloat(val) / capacity;
      // const roundedTotal = Math.round(total);
      const tolerance = 0.1;
      const roundedTotal =
        total - Math.floor(total) <= tolerance
          ? Math.floor(total)
          : Math.ceil(total);
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

  return (
    <>
      <BackdropComponent loading={loading} />
      {console.log("val", disbledValue)}
      <Dialog
        maxWidth="xl"
        // fullWidth
        scroll="paper"
        open
        onClose={onCloseModel}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="h4"> Load Info</Typography>
        </div>
        {/* <form
        // onSubmit={handleSubmit(onSubmit)}
        > */}
        {console.log("err", errors)}
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card style={{ padding: "9px" }}>
                <div className="customCardheader">
                  <Typography variant="h4"> View Trip</Typography>
                  {contacPersonName ? (
                    <Typography variant="h6">
                      {" "}
                      Contact Person: {contacPersonName} ({contacPersonNumber})
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
                          <Tooltip title="Select shipper">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Select shipper*
                            </InputLabel>
                          </Tooltip>

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
                              field.onChange(newValue ? newValue.value : "");
                              fetchRegionData(newValue.value);
                              fetchTransporter(newValue.value);
                              fetchBidMode(newValue.value);
                              fetchSegment(newValue.value);
                              fetchComment(newValue.value);
                              fetchBranchData(newValue.value);
                              fetchSingleShipper(newValue.value);

                              setValue("segment", "");
                              setValue("region", "");
                              setValue("branch", "");
                            }}
                            popupIcon={<KeyboardArrowDownIcon />}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                disabled={true}
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
                              field.onChange(newValue ? newValue.value : "");
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
                  {/* <Grid item xs={12} sm={3} md={3} lg={3}>
                      <Controller
                        name="contactNumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select-disabled-label">
                              Contact Number
                              <span style={{ color: "red" }}>*</span>
                            </InputLabel>
                            <TextField
                              {...field}
                              variant="outlined"
                              disabled={disbledValue}
                              fullWidth
                              size="small"
                              error={Boolean(errors.contactNumber)}
                              helperText={errors.contactNumber?.message}
                            />
                          </>
                        )}
                      />
                    </Grid> */}
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="loadingContactName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title="Loading contact person*">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Loading contact person*
                            </InputLabel>
                          </Tooltip>

                          <TextField
                            {...field}
                            variant="outlined"
                            disabled={disbledValue}
                            fullWidth
                            size="small"
                            error={Boolean(errors.loadingContactName)}
                            helperText={errors.loadingContactName?.message}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="loadingContactNumber"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title="Loading Contact Number*">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Loading Contact Number*
                            </InputLabel>
                          </Tooltip>

                          <TextField
                            {...field}
                            variant="outlined"
                            disabled={disbledValue}
                            fullWidth
                            size="small"
                            error={Boolean(errors.loadingContactNumber)}
                            helperText={errors.loadingContactNumber?.message}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="unloadingContactPerson"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title="Unloading contact person*">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Unloading contact person*
                            </InputLabel>
                          </Tooltip>
                          <TextField
                            {...field}
                            disabled={disbledValue}
                            variant="outlined"
                            fullWidth
                            size="small"
                            error={Boolean(errors.unloadingContactPerson)}
                            helperText={errors.unloadingContactPerson?.message}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="unloadingContactNumber"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title="Unloading Contact Number*">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Unloading Contact Number*
                            </InputLabel>
                          </Tooltip>
                          <TextField
                            {...field}
                            disabled={disbledValue}
                            variant="outlined"
                            fullWidth
                            size="small"
                            error={Boolean(errors.unloadingContactNumber)}
                            helperText={errors.unloadingContactNumber?.message}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="bidType"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title=" Bid Mode*">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Bid Mode*
                            </InputLabel>
                          </Tooltip>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled={disbledValue}
                            error={Boolean(errors.bidType)}
                          >
                            {/* {console.log("field", field.value)} */}

                            <Select
                              value={
                                field.value === "private_pool"
                                  ? "private_pool"
                                  : field.value === "indent"
                                  ? "indent"
                                  : "open_market"
                              }
                              labelId="bid-label"
                              id="bidType"
                              IconComponent={KeyboardArrowDownIcon}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleBidTypeChange(e.target.value);
                              }}
                            >
                              {bidTypeDropDown.map((item) => {
                                return (
                                  <MenuItem value={item.value} key={item.value}>
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
                  {checkBid ? (
                    <Grid item xs={12} sm={3} md={3} lg={3}>
                      <Controller
                        name="indent_transporter_id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <Tooltip
                              title={` ${
                                field.value
                                  ? transporterList.find(
                                      (option) => option.value === field.value
                                    )?.label
                                  : "transporter"
                              }*`}
                            >
                              {/* Use the value of the field in the tooltip */}
                              <InputLabel htmlFor="shipper">
                                Transporter*
                              </InputLabel>
                            </Tooltip>

                            <Autocomplete
                              {...field}
                              disabled={disbledValue}
                              options={transporterList}
                              getOptionLabel={(option) => option.label || ""}
                              value={
                                transporterList.find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                              onChange={(_, newValue) => {
                                field.onChange(newValue ? newValue.value : "");
                                if (newValue !== null) {
                                  // Do something if needed
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
                    <Grid item xs={12} sm={3} md={3} lg={3}>
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
                                disabled={isSegmentDisabled || disbledValue}
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
                                  materials.find((item) => item.id === id)?.name
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
                            disabled={disbledValue}
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

                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="vehicleType"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title="Vehicle Type *">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Vehicle Type *
                            </InputLabel>
                          </Tooltip>
                          <FormControl
                            fullWidth
                            disabled={disbledValue}
                            variant="outlined"
                            size="small"
                            error={Boolean(errors.vehicleType)}
                          >
                            <Select
                              {...field}
                              labelId="bid-label"
                              id="vehicleType"
                              onChange={(e) => {
                                const data = vehicles.find(
                                  (item) => item.id === e.target.value
                                );
                                console.log("onChange data", data);
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
                              IconComponent={KeyboardArrowDownIcon}
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
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="capacityMt"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title="Capacity (MT)*">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Capacity (MT)*
                            </InputLabel>
                          </Tooltip>
                          <TextField
                            {...field}
                            disabled={true}
                            variant="outlined"
                            fullWidth
                            size="small"
                            error={Boolean(errors.capacityMt)}
                            helperText={errors.capacityMt?.message}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="totalLoad"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title="Total Load">
                            <InputLabel id="demo-simple-select-disabled-label">
                              Total Load
                              {/* <span style={{ color: "red" }}>*</span> */}
                            </InputLabel>
                          </Tooltip>
                          <TextField
                            {...field}
                            disabled={disbledValue}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleSetValues(e.target.value);
                            }}
                            size="small"
                            error={Boolean(errors.totalLoad)}
                            helperText={errors.totalLoad?.message}
                          />
                        </>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <Controller
                      name="noOfVehicle"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Tooltip title="No. of vehicle">
                            <InputLabel id="demo-simple-select-disabled-label">
                              No. of vehicle*
                            </InputLabel>
                          </Tooltip>
                          <TextField
                            {...field}
                            disabled={disbledValue}
                            variant="outlined"
                            fullWidth
                            size="small"
                            error={Boolean(errors.noOfVehicle)}
                            helperText={errors.noOfVehicle?.message}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  {checkBid ? (
                    <Grid item xs={12} sm={3} md={3} lg={3}>
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
                              disabled={disbledValue}
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
                    <Grid item xs={12} sm={3} md={3} lg={3}>
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
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    {checkBid ? (
                      ""
                    ) : (
                      <>
                        <InputLabel id="demo-simple-select-disabled-label">
                          Bidding date and time*
                        </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DateTimePicker"]}>
                            <DateTimePicker
                              size="small"
                              disablePast
                              disabled={disbledValue || checkBid}
                              format="DD/MM/YYYY hh:mm A"
                              value={bidDateTime}
                              onChange={(newValue) => {
                                const selectedDateTime = dayjs(newValue);
                                const currentDateTime = dayjs();

                                // Ensure that the selected time is at least 1 hour after the current time
                                const minAllowedDateTime = currentDateTime.add(
                                  1,
                                  "hour"
                                );

                                if (
                                  selectedDateTime.isBefore(minAllowedDateTime)
                                ) {
                                  // If the selected date and time is before the minimum allowed time,
                                  // set the selected time to the minimum allowed time
                                  const updatedDateTime = minAllowedDateTime;
                                  setBidDateTime(updatedDateTime);
                                  field.onChange(
                                    updatedDateTime ? updatedDateTime : ""
                                  );
                                } else {
                                  setBidDateTime(newValue);
                                  field.onChange(newValue ? newValue : "");
                                }
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
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <InputLabel id="demo-simple-select-disabled-label">
                      Reporting time range*
                    </InputLabel>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Controller
                          name="checkInTimeValidator"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DateTimePicker"]}>
                                <DateTimePicker
                                  size="small"
                                  label="From"
                                  disablePast
                                  disabled={disbledValue}
                                  format="DD/MM/YYYY hh:mm A"
                                  value={reportingTimeFrom}
                                  onChange={(newValue) => {
                                    // Set both "From" and "To" to the selected value
                                    setReportingTimeFrom(newValue);
                                    setReportingTimeTo(newValue);
                                    field.onChange(newValue ? newValue : "");
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DateTimePicker
                                    size="small"
                                    label="To"
                                    disablePast
                                    disabled={disbledValue}
                                    format="DD/MM/YYYY hh:mm A"
                                    value={reportingTimeTo || null}
                                    onChange={(newValue) => {
                                      setReportingTimeTo(newValue);
                                      field.onChange(newValue ? newValue : "");
                                    }}
                                    minutesStep={1} // Allow minute selection every minute
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Comment
                            </InputLabel>
                          </Tooltip>
                          <TextField
                            {...field}
                            disabled={disbledValue}
                            variant="outlined"
                            fullWidth
                            size="small"
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
              id="GogMApLoad"
              sx={{
                zIndex: isFullScreen ? 14 : 0,
                height: isFullScreen ? "100vh" : "auto",
                width: isFullScreen ? "100vw" : "100%",
                position: isFullScreen ? "fixed" : "static",
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
                  height: isFullScreen ? "100vh" : "687px",
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
                    accordianDisabled={accordianDisabled}
                    originSelected={setOriginSelected}
                    optimization={false}
                  />
                ) : null}
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {(userType === "acu" ||
            superAdmin ||
            operational_accesses?.allow_draft_edit) &&
          (status === "not_started" || status === "draft") ? (
            <>
              {disbledValue === true ? (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  autoFocus
                  onClick={() => {
                    console.log("val 2", errors);
                    console.log("here disabled");
                    setDisbledValue(false);
                    setAccordianDisabled(false);
                  }}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  color={"success"}
                  autoFocus
                  onClick={handleSubmit(onSubmit)}
                  // type="submit"
                >
                  Save
                </Button>
              )}
            </>
          ) : null}
          {/* {console.log('hey', status)}
          {status === 'completed' ? (
            ''

          ) : (
            <>
              {disbledValue ? (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  autoFocus
                  onClick={() => {
                    console.log("val 2", errors);
                    console.log("here disabled");
                    setDisbledValue(false);
                    setAccordianDisabled(false);
                  }}
                >
                  Edit
                </Button>
              ) : null}
              {!disbledValue ? (
                <Button
                  variant="contained"
                  size="small"
                  color={"success"}
                  autoFocus
                  onClick={handleSubmit(onSubmit)}
                // type="submit"
                >
                  Save
                </Button>
              ) : null}
            </>
          )} */}

          <Button
            variant="contained"
            size="small"
            color="error"
            autoFocus
            onClick={onCloseModel}
          >
            Close
          </Button>
        </DialogActions>
        {/* </form> */}
      </Dialog>
    </>
  );
}

export default LoadVideModel;
