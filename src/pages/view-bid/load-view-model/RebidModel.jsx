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
  Checkbox,
  Dialog,
  Tooltip,
  Button,
} from "@mui/material";
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
  commentValidatorRebid,
  capacityMtValidator,
  totalLoadValidator,
  noOfVehicleValidator,
  basePriceValidator,
} from "../../../validation/common-validator";
import {
  viewShiper,
  getRegion,
  viewBranch,
  viewMaterials,
  viewVehicle,
  viewBid,
  viewSegment,
  viewComment,
  PatchBid,
  UpdateBid,
  reBidCreate,
} from "../../../api/trip-management/create-trip";
import BackdropComponent from "../../../components/backdrop/Backdrop";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import { viewBidDetails } from "../../../api/trip-management/manage-trip";

const schema = yup.object().shape({
  shipper: requiredValidator("Shipper"),
  // region: requiredValidator("Region"),
  // branch: requiredValidator("Branch"),
  // contactNumber: contactNumberValidator,
  rebidcomment: commentValidatorRebid("Rebid reason is required"),
  loadingContactName: requiredValidator("Loading contact person name"),
  loadingContactNumber: roleContactNumberValidator("Loading contact number"),
  unloadingContactPerson: requiredValidator("Unloading contact person name"),
  // unloadingContactNumber: roleContactNumberValidator(
  //   "Unloading contact number"
  // ),
  bidType: requiredValidator("Bid type"),
  // segment: requiredValidator("Segment"),
  // materialType: materialTypeValidator,
  vehicleType: requiredValidator("Vehicle Type"),
  capacityMt: capacityMtValidator,
  // totalLoad: totalLoadValidator,
  noOfVehicle: noOfVehicleValidator,
  // basePrice: basePriceValidator,
});

const RebidModel = ({ selectedId, status, handleCloseModal }) => {
  const {
    handleSubmit,
    // reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [commentModal, setCommentModal] = useState();
  const [disbledValue, setDisbledValue] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [bidTypeDropDown, setBidTypeDropDown] = useState([
    "Private Pool",
    "Open Market",
  ]);
  const [segmentTypeDropDown, setSegmentTypeDropDown] = useState([]);

  const [requirement, setRequirement] = useState([]);
  const [viewBidType, setViewBidType] = useState([]);
  const [commentData, setCommentData] = useState("");
  const [shipperList, setShipperList] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [isSegmentDisabled, setIsSegmentDisabled] = useState(true);
  const [isSegmentRequired, setIsSegmentRequired] = useState(false);
  const [updatedSourceDest, setUpdatedSourceDest] = useState({});
  const [showCurrentLowestRate, setShowCurrentLowestRate] = useState({
    current_lowest_rate: true,
    bid_price_decrement: 0,
    no_of_tries: 0,
    net_qty: 0,
    fleet_type: "",
    no_of_fleets: 0,
    bid_duration: 0,
  });

  const [reportingTimeFrom, setReportingTimeFrom] = useState();
  const [reportingTimeTo, setReportingTimeTo] = useState(
    dayjs("2023-10-17T15:30")
  );
  const [bidDateTime, setBidDateTime] = useState();
  const [addressValues, setAddressValues] = useState([]);

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

  const fetchShiper = () => {
    return viewShiper()
      .then((data) => {
        if (data.success === true) {
          const tempData = data.data.map((item) => {
            return {
              label: item.name,
              value: item.shpr_id,
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

  function getSourceDestination(value) {
    console.log("source destination", value);

    if (Array.isArray(value)) {
      let srcList = [];
      let destList = [];
      value.map((value, index) => {
        let src_addrs =
          value.src_city + "," + value.src_state + "," + value.src_country;
        let dest_addrs =
          value.dest_city + "," + value.dest_state + "," + value.dest_country;
        console.log("src", src_addrs, dest_addrs);
        if (!srcList.includes(src_addrs)) {
          srcList.push(src_addrs);
        }
        if (!destList.includes(dest_addrs)) {
          destList.push(dest_addrs);
        }
      });

      setUpdatedSourceDest({ src: srcList, dest: destList });
    } else {
      getPairedSourceDestination("", value.load_source, value.load_dest);
    }
  }

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
  }

  const fetchDetails = () => {
    setIsLoading(true);
    return viewBidDetails(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          const values = res.data.data[0];
          console.log("updated response", values);
          setShowCurrentLowestRate({
            current_lowest_rate: values.show_current_lowest_rate_transporter,
            bid_duration:
              (new Date(values.bid_end_time) - new Date(values.bid_time)) / 60,
            bid_price_decrement: values.bid_price_decrement,
            fleet_type: values.fleet_type,
            net_qty: values.net_qty,
            no_of_tries: values.no_of_tries,
            no_of_fleets: values.no_of_fleets,
          });
          getSourceDestination(values["srcdest_list"]);
          fetchRegionData(values.bl_shipper_id);
          fetchBidMode(values.bl_shipper_id);
          fetchSegment(values.bl_shipper_id);
          fetchComment(values.bl_shipper_id);
          fetchBranchData(values.bl_region_cluster_id);
          setValue("shipper", values.bl_shipper_id);
          setValue("region", values.bl_region_cluster_id);
          setValue("branch", values.bl_branch_id);
          setValue("loadingContactName", values.loading_contact_name);
          setValue("loadingContactNumber", values.loading_contact_no);
          setValue("unloadingContactPerson", values.unloading_contact_name);
          setValue("unloadingContactNumber", values.unloading_contact_no);
          setValue("bidType", values.bid_mode);
          setIsSegmentDisabled(values.bid_mode == "open_market");
          setIsSegmentRequired(values.bid_mode === "private_pool");
          setValue("segment", values.bl_segment_id);
          setValue("vehicleType", values.fleet_type);
          setValue("totalLoad", values.net_qty);
          setValue("noOfVehicle", values.no_of_fleets);
          setValue("basePrice", values.system_base_price);
          setValue(
            "materialType",
            values.material_list.map((val) => val.mlm_material_id)
          );

          setReportingTimeFrom(dayjs(values.reporting_from_time));
          setReportingTimeTo(dayjs(values.reporting_to_time));
          setBidDateTime(dayjs(values.bid_time));
          setValue("comment", values.comments);

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
  }, [isFullScreen]);

  const handleBidTypeChange = (value) => {
    setIsSegmentDisabled(value == "Open Market");
    setIsSegmentRequired(value === "Private Pull");
  };

  const onSubmit = (value) => {
    console.log(
      "value in rebid",
      selectedId,
      value,
      addressValues,
      showCurrentLowestRate,
      reportingTimeFrom,
      reportingTimeTo,
      bidDateTime
    );
    return reBidCreate(
      selectedId,
      value,
      addressValues,
      reportingTimeFrom,
      reportingTimeTo,
      showCurrentLowestRate,
      bidDateTime
    ).then((res) => {
      if (res.data.success) {
        console.log("res coming in rebid", res);
        handleCloseModal();

        dispatch(
          openSnackbar({ type: "success", message: res.data.clientMessage })
        );
      } else {
        dispatch(
          openSnackbar({ type: "error", message: res.data.clientMessage })
        );
      }
    });

    setDisbledValue(true);
  };

  const onCloseModel = () => {
    setDisbledValue(true);
    handleCloseModal();
  };

  const handleSetValues = (val) => {
    const capacity = getValues("capacityMt");
    const total = parseFloat(val) / capacity;
    const tolerance = 0.1;
    const roundedTotal = total - Math.floor(total) <= tolerance ? Math.floor(total): Math.ceil(total);
    setValue("noOfVehicle", roundedTotal);
    setValue("totalLoad", val);
  };

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

  return (
    <>
      <BackdropComponent loading={loading} />
      <Dialog
        maxWidth="lg"
        scroll="paper"
        open
        onClose={onCloseModel}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="h4">{status} Load Info</Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {console.log("error", errors)}

          <DialogContent>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card style={{ padding: "5px" }}>
                  <div className="customCardheader">
                    <Typography variant="h4"> Create Load</Typography>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <Controller
                        name="shipper"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select-disabled-label">
                              Select shipper
                            </InputLabel>
                            <Autocomplete
                              {...field}
                              disabled={disbledValue}
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
                                fetchBidMode(newValue.value);
                                fetchSegment(newValue.value);
                                fetchComment(newValue.value);
                              }}
                              popupIcon={<KeyboardArrowDownIcon />}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  disabled={disbledValue}
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Select region/cluster
                            </InputLabel>
                            <Autocomplete
                              {...field}
                              disabled={disbledValue}
                              options={regionOptions}
                              getOptionLabel={(option) => option.label || ""}
                              value={
                                regionOptions.find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                              onChange={(_, newValue) => {
                                field.onChange(newValue ? newValue.value : "");
                                fetchBranchData(newValue.value);
                              }}
                              popupIcon={<KeyboardArrowDownIcon />}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  disabled={disbledValue}
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
                            disabled={disbledValue}
                            options={branchOptions}
                            getOptionLabel={(option) => option.label || ""}
                            value={
                              branchOptions.find(
                                (option) => option.value === field.value
                              ) || null
                            }
                            onChange={(_, newValue) => {
                              field.onChange(newValue ? newValue.value : "");
                            }}
                            popupIcon={<KeyboardArrowDownIcon />}
                            renderInput={(params) => (
                              <>
                                <InputLabel id="demo-simple-select-disabled-label">
                                  Select branch
                                </InputLabel>
                                <TextField
                                  {...params}
                                  disabled={disbledValue}
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Loading contact person*
                            </InputLabel>
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Loading Contact Number*
                            </InputLabel>
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Unloading contact person *
                            </InputLabel>
                            <TextField
                              {...field}
                              disabled={disbledValue}
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
                    <Grid item xs={12} sm={3} md={3} lg={3}>
                      <Controller
                        name="unloadingContactNumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select-disabled-label">
                              Unloading Contact Number*
                            </InputLabel>
                            <TextField
                              {...field}
                              disabled={disbledValue}
                              variant="outlined"
                              fullWidth
                              size="small"
                              // error={Boolean(errors.unloadingContactNumber)}
                              // helperText={
                              //   errors.unloadingContactNumber?.message
                              // }
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Bid Mode*
                            </InputLabel>
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
                                    ? (field.value = "Private Pool")
                                    : (field.value = "Open Market")
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
                                    <MenuItem value={item} key={item}>
                                      {item}
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
                    <Grid item xs={12} sm={3} md={3} lg={3}>
                      <Controller
                        name="segment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel htmlFor="segment">Segment</InputLabel>

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
                                disabled={!isSegmentDisabled && disbledValue}
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Vehicle Type*
                            </InputLabel>
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
                                  setValue("capacityMt", data.capacity);
                                  setValue("vehicleType", data.id);
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Capacity (MT) *
                            </InputLabel>
                            <TextField
                              {...field}
                              disabled={disbledValue}
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Total Load
                              {/* <span style={{ color: "red" }}>*</span> */}
                            </InputLabel>
                            <TextField
                              {...field}
                              disabled={disbledValue}
                              variant="outlined"
                              fullWidth
                              onChange={(e) => handleSetValues(e.target.value)}
                              size="small"
                              // error={Boolean(errors.totalLoad)}
                              // helperText={errors.totalLoad?.message}
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              No. of vehicle
                              <span style={{ color: "red" }}>*</span>
                            </InputLabel>
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
                    <Grid item xs={12} sm={3} md={3} lg={3}>
                      <Controller
                        name="basePrice"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select-disabled-label">
                              Base price
                              {/* <span style={{ color: "red" }}>*</span> */}
                            </InputLabel>
                            <TextField
                              {...field}
                              disabled={disbledValue}
                              variant="outlined"
                              fullWidth
                              size="small"
                              // error={Boolean(errors.basePrice)}
                              // helperText={errors.basePrice?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
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
                                      field.onChange(newValue ? newValue : "");
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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Comment
                            </InputLabel>
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

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Controller
                        name="rebidcomment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel>Rebid-Reason*</InputLabel>
                            <TextField
                              {...field}
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={Boolean(errors.rebidcomment)}
                              helperText={errors.rebidcomment?.message}
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
                    height: isFullScreen ? "100vh" : "665px",
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
                      accordianDisabled={true}
                    />
                  ) : null}
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {status === "not_started" || status === "draft" ? (
              <>
                {disbledValue === true ? (
                  <Button
                    variant="contained"
                    size="small"
                    autoFocus
                    onClick={() => setDisbledValue(false)}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    autoFocus
                    type="submit"
                  >
                    Submit
                  </Button>
                )}
              </>
            ) : null}
            <Button
              variant="contained"
              size="small"
              color="success"
              type="submit"
              autoFocus
              //   onClick={onCloseModel}
            >
              Start re-bid
            </Button>
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
        </form>
      </Dialog>
    </>
  );
};

export default RebidModel;
