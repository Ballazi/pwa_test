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
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import GogMapLoad from "../load-management/create-load/GogMapLoad";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import ErrorTypography from "../../components/typography/ErrorTypography";
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
} from "../../validation/common-validator";
import {
  viewShiper,
  getRegion,
  viewBranch,
  viewMaterials,
  viewVehicle,
  viewBid,
  viewSegment,
  viewComment,
  UpdateBid,
} from "../../api/trip-management/create-trip";
import BackdropComponent from "../../components/backdrop/Backdrop";
import { openSnackbar } from "../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import { viewBidDetails } from "../../api/trip-management/manage-trip";

const schema = yup.object().shape({
  shipper: requiredValidator("Shipper"),
  region: requiredValidator("Region"),
  branch: requiredValidator("Branch"),
  // contactNumber: contactNumberValidator,
  loadingContactName: requiredValidator("Loading contact person name"),
  loadingContactNumber: roleContactNumberValidator("Loading contact number"),
  unloadingContactPerson: requiredValidator("Unloading contact person name"),
  unloadingContactNumber: roleContactNumberValidator(
    "Unloading contact number"
  ),
  bidType: requiredValidator("Bid type"),
  // segment: nonRequiredValidator("Segment"),
  // materialType: materialTypeValidator,
  vehicleType: requiredValidator("Vehicle Type"),
  capacityMt: capacityMtValidator,
  totalLoad: totalLoadValidator,
  noOfVehicle: noOfVehicleValidator,
  basePrice: basePriceValidator,
});

const ViewBidData = ({ selectedId, status, handleCloseModal, open }) => {
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
  const [reportingTimeFrom, setReportingTimeFrom] = useState(
    dayjs("2023-09-17T15:30")
  );
  const [reportingTimeTo, setReportingTimeTo] = useState(
    dayjs("2023-10-17T15:30")
  );
  const [bidDateTime, setBidDateTime] = useState(dayjs("2023-09-17T15:30"));
  const [addressValues, setAddressValues] = useState([]);

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
          const updatedRegion = res.data.data
            .filter((item) => item.is_region === true)
            .map((item) => {
              return {
                label: item.region_name,
                value: item.msrc_region_cluster_id,
                // is_region: item.is_region,
              };
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
      shipper_id: id,
      
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

  function getSourceDestination(value) {
    console.log("source destination", value);
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
  function removeUnderScore(val) {}

  

  const fetchDetails = () => {
    setIsLoading(true);
    return viewBidDetails(selectedId)
      .then((res) => {
        if (res.data.success === true) {
          const values = res.data.data[0];
          console.log("updated response", values);
          getSourceDestination(values["srcdest_list"]);
          fetchRegionData(values.bl_shipper_id);
          fetchBidMode(values.bl_shipper_id);
          fetchSegment(values.bl_shipper_id);
          fetchComment(values.bl_shipper_id);
          fetchBranchData(values.bl_shipper_id);

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
          setValue("basePrice", values.base_price);
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

  const onSubmit = async (value) => {
    console.log("in the onSubmit");
    console.log(
      " view value",
      value,
      updatedSourceDest,
      reportingTimeFrom,
      reportingTimeTo,
      bidDateTime,
      selectedId,
      status
    );
    var res = await UpdateBid(
      value,
      updatedSourceDest,
      reportingTimeFrom,
      reportingTimeTo,
      bidDateTime,
      selectedId,
      status
    );
    console.log("res", res);
    if (res.data.success === true) {
      dispatch(
        openSnackbar({ type: "success", message: res.data.clientMessage })
      );
    } else {
      dispatch(
        openSnackbar({
          type: "error",
          message: res.data?.clientMessage ?? "Something went wrong!",
        })
      );
    }

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

  return (
    <>
      <BackdropComponent loading={loading} />
      {console.log("val", disbledValue)}
      <Dialog
        maxWidth="lg"
        scroll="paper"
        open
        onClose={onCloseModel}
        aria-labelledby="transporter-details-dialog"
      >
        <div className="customCardheader">
          <Typography variant="h4">Load Details</Typography>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {console.log("err", errors)}
          <DialogContent>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card style={{ padding: "10px" }}>
                  <div className="customCardheader">
                    <Typography variant="h4">Load Info</Typography>
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
                              options={shipperList}
                              getOptionLabel={(option) => option.label || ""}
                              disabled={true}
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
                              Select region
                            </InputLabel>
                            <Autocomplete
                              {...field}
                              options={regionOptions}
                              getOptionLabel={(option) => option.label || ""}
                              disabled={true}
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
                                  disabled={disbledValue}
                                  fullWidth
                                  size="small"
                                  error={!!errors.region}
                                  helperText={errors.region?.message}
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
                            getOptionLabel={(option) => option.label || ""}
                            disabled={true}
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
                                  error={!!errors.branch}
                                  helperText={errors.branch?.message}
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
                              Loading contact person
                              <span style={{ color: "red" }}>*</span>
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
                              Loading Contact Number
                              <span style={{ color: "red" }}>*</span>
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
                              Unloading contact person
                              <span style={{ color: "red" }}>*</span>
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
                              Unloading Contact Number
                              <span style={{ color: "red" }}>*</span>
                            </InputLabel>
                            <TextField
                              {...field}
                              disabled={disbledValue}
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
                    <Grid item xs={12} sm={3} md={3} lg={3}>
                      <Controller
                        name="bidType"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select-disabled-label">
                              Bid Mode<span style={{ color: "red" }}>*</span>
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
                            <InputLabel
                              htmlFor="segment"
                              shrink
                              sx={{
                                fontSize: "17px",
                              }}
                            >
                              Segment
                            </InputLabel>

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
                            <InputLabel id="demo-simple-select-disabled-label">
                              Material Type
                              <span style={{ color: "red" }}>*</span>
                            </InputLabel>
                            <FormControl
                              fullWidth
                              disabled={disbledValue}
                              variant="outlined"
                              size="small"
                              error={Boolean(errors.materialType)}
                            >
                              <Select
                                {...field}
                                labelId="bid-label"
                                id="materialType"
                                IconComponent={KeyboardArrowDownIcon}
                                multiple
                                // onChange={(e) => {
                                //   const data = materials.find(
                                //     (item) => item.id === e.target.value
                                //   );
                                //   console.log("onChange data", data);
                                //   // setValue("capacityMt", data.capacity);
                                //   setValue("materialType", data.id);
                                // }}
                              >
                                {materials.map((item) => {
                                  return (
                                    <MenuItem value={item.id} key={item.id}>
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
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
                              Vehicle Type
                              <span style={{ color: "red" }}>*</span>
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
                                  console.log("onChange data", data);
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
                              Capacity (MT)
                              <span style={{ color: "red" }}>*</span>
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
                              error={Boolean(errors.basePrice)}
                              helperText={errors.basePrice?.message}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={12} lg={12}>
                      <InputLabel id="demo-simple-select-disabled-label">
                        Bidding date and time
                        <span style={{ color: "red" }}>*</span>
                      </InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["DateTimePicker", "DateTimePicker"]}
                        >
                          <DateTimePicker
                            disabled={disbledValue}
                            disablePast
                            format="DD/MM/YYYY hh:mm A"
                            value={bidDateTime}
                            onChange={(newValue) => setBidDateTime(newValue)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <InputLabel id="demo-simple-select-disabled-label">
                        Reporting time range
                        <span style={{ color: "red" }}>*</span>
                      </InputLabel>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                              <DateTimePicker
                                size="small"
                                label="From"
                                disabled={disbledValue}
                                disablePast
                                format="DD/MM/YYYY hh:mm A"
                                value={reportingTimeFrom}
                                onChange={(newValue) =>
                                  setReportingTimeFrom(newValue)
                                }
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                              <DateTimePicker
                                label="To"
                                disabled={disbledValue}
                                disablePast
                                format="DD/MM/YYYY hh:mm A"
                                value={reportingTimeTo}
                                onChange={(newValue) =>
                                  setReportingTimeTo(newValue)
                                }
                              />
                            </DemoContainer>
                          </LocalizationProvider>
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
                              Comment<span style={{ color: "red" }}>*</span>
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
            {/* {status === "not_started" || status === "draft" ? (
              <>
                {disbledValue === true ? (
                  <Button
                    variant="contained"
                    size="small"
                    // autoFocus
                    onClick={() => setDisbledValue(false)}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    // autoFocus
                    type="submit"
                  >
                    Submit
                  </Button>
                )}
              </>
            ) : null} */}
            {/* {disbledValue ? (
              <Button
                variant="contained"
                size="small"
                color="primary"
                autoFocus
                onClick={() => {
                  console.log("val 2", errors);
                  console.log("here disabled");
                  setDisbledValue(false);
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
                type="submit"
              >
                Save
              </Button>
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
        </form>
      </Dialog>
    </>
  );
};

export default ViewBidData;
