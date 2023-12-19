import { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  Radio,
  Button,
  Checkbox,
  Autocomplete,
  Chip,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RegisterCard from '../../components/card/RegisterCard';
import ContentWrapper from '../../components/form-warpper/ContentWrapper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ErrorTypography from '../../components/typography/ErrorTypography';
import AlertPage from '../../components/masterData/alert-component/AlertPage';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  requiredValidatorOfArrayNew,
  requiredValidator,
  requiredNonZeroPositiveValidator,
} from '../../validation/common-validator';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import BackdropComponent from '../../components/backdrop/Backdrop';
import { openSnackbar } from '../../redux/slices/snackbar-slice.js';
import { useDispatch } from 'react-redux';
import { viewCurrency } from "../../api/master-data/currency";
import { getSettings, createSettings, updateSettings, getShipperModule, viewBranch } from "../../api/register/setting.js";
import { viewShiper } from '../../api/trip-management/create-trip.js';

const TextareaAutosize = styled(BaseTextareaAutosize)(
  () => `
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  padding: 5px;
  border-radius: 8px;
  border: 2px solid #ccc;

  &:focus {
      border-color: #007bff;
  }

  // firefox
  &:focus-visible {
      outline: 0;
  }
`,
);


const initialExpandedState = { Delay: true };
let currenciesData = [];




const SettingComponent = () => {
  const [isBranchVisible, setIsBranchVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);
  const [infoProvider, setInfoProvider] = useState([]);
  const [epodOption, setEpodOption] = useState("");
  const [selectedCur, setSelectedCur] = useState([]);
  const [customTracking, setCustomTracking] = useState(false);
  const [expanded, setExpanded] = useState(initialExpandedState);
  const [rateCustom, setRateCustom] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAlertBox, setSelectedAlertBox] = useState(["Delay"]);
  const alertCheckboxOptions = ["Hold", "Departure", "Delay", "SOS", "Deviation", "Arrival", "E-way bill"];
  const [currencyOptions, setCurrnecyOptions] = useState([]);
  const shipperId = localStorage.getItem('user_id');
  const [basicSttngId, setBasicSttngId] = useState("");
  const [bidSttngId, setBidSttngId] = useState("");
  const [alertSttngId, setAlertSttngId] = useState("");
  const [geofenceSttngId, setgeofenceSttngId] = useState("");
  const [bidCommentId, setBidCommentId] = useState("");
  const [trackCommentId, setTrackCommentId] = useState("");
  const [shipperModule, setShipperModule] = useState("");
  const [selectedShipper, setSelectedShipper] = useState("");
  const [shipperList, setShipperList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchOptions, setBranchOptions] = useState([]);
  const [disable, setDisable] = useState(false);
  const [priceDecrementType, setPriceDecrementType] = useState(false);



  const schemaBuilder = (infoProvider, epodOption, customTracking, rateCustom, selectedAlertBox, shipperModule) => {
    const baseSchema = yup.object().shape({
      // serviceOpted: requiredValidatorOfArray('Service option'),
      bidType: requiredValidatorOfArrayNew('Bid type'),
      countriesCurrency: requiredValidatorOfArrayNew('Operating countries and currencies'),
      informationMedium: requiredValidatorOfArrayNew('Information medium for transporter'),
    });


    let conditionalSchema = baseSchema; // Initialize with the base schema

    if (shipperModule.includes("Tracking")) {
      conditionalSchema = conditionalSchema.shape({
        standardEta: requiredValidator('Standard ETA for your organization'),
        fastagService: requiredValidator('Fastag for your organization'),
        enableEpod: requiredValidator('EPOD for your organization'),
        pinTracking: requiredValidator('Tracking ping duration'),
        settingAlert: requiredValidatorOfArrayNew('Setting alert'),
        sourceRadius: requiredNonZeroPositiveValidator('Source radius'),
        arrivalRadius: requiredNonZeroPositiveValidator('Arrival radius'),
        tripClosureRadius: requiredNonZeroPositiveValidator('Trip closure radius'),
        rateQuationTypeRadio: requiredValidator('Rate quation type'),
      });
    }

    if (shipperModule.includes("Bidding")) {
      conditionalSchema = conditionalSchema.shape({
        //         bidDuration: requiredValidator('Bid duration'),
        //         bidDecrement: requiredValidator('Bid decrement time'),
        //         bidIncrement: requiredValidator('Bid increment time to be applied at'),
        //         bidPriceDecrement: requiredValidator('Bid price decrement'),
        //         bidLimit: requiredValidator('No. of Tries'),
        //         bidMatching: requiredValidator('Price matching'),
        //         bidMatchingDuration: requiredValidator('Price matching duration'),
        bidDuration: requiredNonZeroPositiveValidator('Bid duration'),
        bidDecrement: requiredNonZeroPositiveValidator('Bid increment time'),
        bidIncrement: requiredNonZeroPositiveValidator('Bid increment time to be applied at'),
        bidPriceDecrement: requiredNonZeroPositiveValidator('Bid price decrement'),
        bidLimit: requiredNonZeroPositiveValidator('No. of Bids'),
        bidMatching: requiredValidator('Bid matching'),
        // bidMatchingDuration: requiredNonZeroPositiveValidator('Bid matching duration'),
        currentLowestRate: requiredValidator('Cureent lowest rate to transporter'),
        showContactDetailsToTransporter: requiredValidator('Show ontact details to transporter'),
        bidMode: requiredValidator('Bid mode'),
        rateQuationType: requiredValidator('Rate quation type'),
      });
    }

    if (epodOption === 'Yes') {
      conditionalSchema = conditionalSchema.shape({
        epodType: requiredValidator('Load type'),
      });
    }

    if (customTracking) {
      conditionalSchema = conditionalSchema.shape({
        customPin: requiredValidator('Custom ping duration'),
      });
    }

    if (rateCustom) {
      conditionalSchema = conditionalSchema.shape({
        customQuationType: requiredValidator('Custom quation type'),
      });
    }

    if (selectedAlertBox && selectedAlertBox.length > 0) {
      const alertBoxSchema = {};
      selectedAlertBox.forEach(alertOption => {
        const schema = {};
        if (alertOption !== 'E-way bill') {
          schema.highAlertTime = requiredNonZeroPositiveValidator('High alert time');
          schema.lowAlertTime = requiredNonZeroPositiveValidator('Low alert time');
          alertBoxSchema[`${alertOption}Alert`] = yup.object().shape(schema);
        }
      });
      alertBoxSchema.notificationChannels = requiredValidatorOfArrayNew('Notification channel is required');
      alertBoxSchema.alertRecipents = requiredValidatorOfArrayNew('Alert recipient is required');
      conditionalSchema = conditionalSchema.shape(alertBoxSchema);
    }

    return conditionalSchema;
  };
  const schema = schemaBuilder(infoProvider, epodOption, customTracking, rateCustom, selectedAlertBox, shipperModule);

  // console.log("fields>>>>", schema.fields);

  const {
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // console.log("error>>>>", errors);

  const fetchShiper = () => {
    viewShiper()
      .then((data) => {
        if (data.success === true) {
          const tempData = data.data.map((item) => {
            return {
              label: item.name,
              value: item.shpr_id,
            };
          });
          setShipperList(tempData);
          setIsBranchVisible(true);
          const id = (shipperId === "undefined" || shipperId === null) ? tempData[0].value : shipperId;
          setSelectedShipper(id);
          fetchBranchData(id);
          fetchShipperModule(id);
          fetchUserSetting(id);
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

  const fetchBranchData = (id) => {
    setIsLoading(true);
    const payload = {
      shipper_id: id,
    };
    viewBranch(payload)
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

  const closePopup = () => {
    setAlertType("");
    setMessage("");
  };

  const handleChipDeleteOperating = (data) => {
    const filteredData = selectedCur.filter(ele => ele.label !== data.label);
    setSelectedCur(filteredData);
    setValue("countriesCurrency", [...filteredData]);
  }

  const handleCheckboxClick = (alertSetting) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [alertSetting]: !prevExpanded[alertSetting],
    }));
  };

  const fetchCuntryCurrency = () => {
    setIsLoading(true);
    return viewCurrency()
      .then((data) => {
        if (data.success === true) {
          const updatedCountry = data.data.map((item) => {
            return {
              label: `${item.country.name}-${item.name}`,
              value: item.id,
            };
          });
          currenciesData = updatedCountry;
          setCurrnecyOptions(updatedCountry);
        }
        else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
          setCurrnecyOptions([])
        }
      })
      .catch((error) => {
        console.error("Error", error)
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const setSettingData = (ref) => {
    const arr = [];
    if (ref.arrival_alert_enabled) {
      arr.push("Arrival");
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        ["Arrival"]: true,
      }));
    }
    if (ref.delay_alert_enabled) {
      arr.push("Delay");
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        ["Delay"]: true,
      }));
    }
    if (ref.departure_alert_enabled) {
      arr.push("Departure");
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        ["Departure"]: true,
      }));
    }
    if (ref.e_way_bill_alert_enabled) {
      arr.push("E-way bill");
    }
    if (ref.hold_alert_enabled) {
      arr.push("Hold");
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        ["Hold"]: true,
      }));
    }
    if (ref.route_deviate_alert_enabled) {
      arr.push("Deviation");
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        ["Deviation"]: true,
      }));
    }
    if (ref.sos_alert_enabled) {
      arr.push("SOS");
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        ["SOS"]: true,
      }));
    }
    if (arr.length < 1) {
      arr.push("Delay");
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        ["Delay"]: true,
      }));
    }
    if (arr.length >= 1 && !arr.includes("Delay")) {
      arr.push("Delay");
      setExpanded((prevExpanded) => ({
        ...prevExpanded,
        ["Delay"]: true,
      }));
    }
    setSelectedAlertBox(arr);
    handleCheckboxClick(arr);
    return arr;
  };

  const fetchShipperModule = async (id) => {
    setIsLoading(true);
    return getShipperModule(id)
      .then(res => {
        if (res.data.success === true) {
          const module = res.data.data[0].module.name;
          setShipperModule(module);
        } else {
          dispatch(openSnackbar({ type: 'error', message: res.data.clientMessage }));
        }
      }).catch(error => {
        console.error("Error", error);
      }).finally(() => {
        setIsLoading(false);
      })
  };

  const fetchUserSetting = async (id) => {
    setIsLoading(true);
    const payload = {
      shipper_id: id,
    };

    return getSettings(payload)
      .then(res => {
        if (res.data.success === true) {
          const data = res.data.data;
          updateBasicSettings(data.basic);
          updateBidSettings(data.bid);
          updateGeofenceSettings(data.geofence);
          setSelectedCurrencies(data.currencies);
          updateFormValues(data.alert);
          updateCommentValues(data.comments);
        } else {
          dispatch(openSnackbar({ type: 'error', message: res.data.clientMessage }));
        }
      }).catch(error => {
        console.error("Error", error);
      }).finally(() => {
        setIsLoading(false);
      })
  };

  const updateBasicSettings = (basicData) => {
    setBasicSttngId(basicData.sttng_id);
    setValue("informationMedium", basicData.communicate_by?.split(", "));
    setValue("standardEta", basicData.eta ? "Yes" : "No");
    setValue("fastagService", basicData.is_fastag_opted ? "Yes" : "No");
    setEpodOption(basicData.epod_type === "none" ? "none" : "Yes");
    setValue("enableEpod", basicData.epod_type === "none" ? "none" : "Yes");
    setValue("epodType", basicData.epod_type);
    setValue("pinTracking", (basicData.tracking_ping === 15 || basicData.tracking_ping === 30) ? basicData.tracking_ping : 'custom');
    setCustomTracking(!(basicData.tracking_ping === 15 || basicData.tracking_ping === 30));
    setValue("customPin", !(basicData.tracking_ping === 15 || basicData.tracking_ping === 30) ? basicData.tracking_ping : "");
  };

  const updateBidSettings = (bidData) => {
    setBidSttngId(bidData.bdsttng_id);
    setValue("bidMode", bidData.bid_mode);
    setValue("bidDuration", bidData.bid_duration);
    setValue("bidDecrement", bidData.bid_increment_time);
    setPriceDecrementType(bidData.is_decrement_in_percentage);
    setValue("bidIncrement", bidData.bid_increment_duration);
    setValue("bidPriceDecrement", bidData.bid_price_decrement);
    setValue("bidLimit", bidData.no_of_tries);
    setValue("bidMatching", bidData.enable_price_match ? "Yes" : "No");
    setDisable(bidData.enable_price_match ? false : true);
    setValue("bidMatchingDuration", bidData.price_match_duration);
    setValue("currentLowestRate", bidData.show_current_lowest_rate_transporter ? "Yes" : "No");
    setValue("showContactDetailsToTransporter", bidData.show_contact_details_to_transporter ? "Yes" : "No");
    setValue("rateQuationType", (bidData.bdsttng_rate_quote_type === "PMT" || bidData.bdsttng_rate_quote_type === "FTL") ? bidData.bdsttng_rate_quote_type : 'custom');
    setRateCustom(!(bidData.bdsttng_rate_quote_type === "PMT" || bidData.bdsttng_rate_quote_type === "FTL"));
    setValue("customQuationType", bidData.bdsttng_rate_quote_type);
  };

  const updateGeofenceSettings = (geofenceData) => {
    setgeofenceSttngId(geofenceData.gfnc_sttng_id);
    setValue("sourceRadius", geofenceData.source_radius);
    setValue("arrivalRadius", geofenceData.arrival_radius);
    setValue("tripClosureRadius", geofenceData.trip_close_radius);
    setValue("rateQuationTypeRadio", geofenceData.trip_close_method);
  };

  const updateFormValues = (alertData) => {
    setAlertSttngId(alertData.alrt_sttng_id);
    const arrData = setSettingData(alertData);
    setValue("settingAlert", arrData);
    const notificationSource = () => {
      const value = alertData.notification_channels !== null ? alertData.notification_channels.split(", ") : ["app"];
      if (!value.includes("app")) {
        value.push("app");
      }
      return value;
    }
    setValue("notificationChannels", notificationSource());
    setValue("alertRecipents", alertData.alert_recipents ? (alertData.alert_recipents).split(", ") : []);
    setValue("HoldAlert.lowAlertTime", alertData.hold_alert_enabled ? alertData.vehicle_hold_short : "");
    setValue("HoldAlert.highAlertTime", alertData.hold_alert_enabled ? alertData.vehicle_hold_long : "");
    setValue("DelayAlert.lowAlertTime", alertData.delay_alert_enabled ? alertData.delay_short : "");
    setValue("DelayAlert.highAlertTime", alertData.delay_alert_enabled ? alertData.delay_long : "");
    setValue("ArrivalAlert.lowAlertTime", alertData.arrival_alert_enabled ? alertData.arrival_short : "");
    setValue("ArrivalAlert.highAlertTime", alertData.arrival_alert_enabled ? alertData.arrival_long : "");
    setValue("DepartureAlert.lowAlertTime", alertData.departure_alert_enabled ? alertData.departure_short : "");
    setValue("DepartureAlert.highAlertTime", alertData.departure_alert_enabled ? alertData.departure_long : "");
    setValue("DeviationAlert.lowAlertTime", alertData.route_deviate_alert_enabled ? alertData.route_deviate_short : "");
    setValue("DeviationAlert.highAlertTime", alertData.route_deviate_alert_enabled ? alertData.route_deviate_long : "");
    setValue("SOSAlert.lowAlertTime", alertData.sos_alert_enabled ? alertData.sos_short : "");
    setValue("SOSAlert.highAlertTime", alertData.sos_alert_enabled ? alertData.sos_long : "");
  };

  const setSelectedCurrencies = (currencies) => {
    const newArray = currenciesData.filter(obj => currencies.includes(obj.value));
    setSelectedCur(newArray);
    setValue("countriesCurrency", newArray);
  };

  const updateCommentValues = (comment) => {
    comment?.map((e) => {
      if (e.cmmnt_for === "bidding") {
        setBidCommentId(e.cmmnt_id);
        setValue("bidComment", e.cmmnt_text);
      } else if (e.cmmnt_for === "tracking") {
        setTrackCommentId(e.cmmnt_id);
        setValue("trackComment", e.cmmnt_text);
      }
      return null;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCuntryCurrency();
      fetchShiper();
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   fetchShipperModule();
  //   fetchUserSetting();
  // }, [selectedShipper])


  const saveUserSetting = (data) => {
    setIsLoading(true);
    return createSettings(data)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          reset();
          setSelectedCur([]);
          setInfoProvider([]);
          setCustomTracking("");
          setEpodOption("");
          setRateCustom("");
          setSelectedAlertBox(["Delay"]);
          setCurrnecyOptions([]);
          // navigate('/acculead-secured/dashboard');
        }
        else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error)
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const updateUserSetting = (data) => {
    setIsLoading(true);
    return updateSettings(data)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          reset();
          setSelectedCur([]);
          setInfoProvider([]);
          setCustomTracking("");
          setEpodOption("");
          setRateCustom("");
          setSelectedAlertBox(["Delay"]);
          setCurrnecyOptions([]);
          // navigate('/acculead-secured/dashboard');
        }
        else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error)
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const arrayJoinFunction = (arrayData) => {
    return arrayData.join(", ");
  }

  const onSubmit = (data) => {
    let flag = true;
    if (flag) {
      selectedAlertBox.forEach((alertSetting) => {
        if (alertSetting !== 'E-way bill') {
          if (data[`${alertSetting}Alert`].lowAlertTime >= data[`${alertSetting}Alert`].highAlertTime) {
            setError(`${alertSetting}Alert.highAlertTime`, { message: "High alert time must be large than low alert time" });
            flag = false;
          }
        }
      })
    }
    if (flag) {
      if (data.bidIncrement >= data.bidDuration) {
        setError("bidIncrement", { message: "Bid increment time to be applied at must be less than bid duration" });
        flag = false;
      }
    }
    if (flag) {
      if (data.arrivalRadius < data.tripClosureRadius) {
        setError("tripClosureRadius", { message: "Trip closure radius must be less than arrival radius" });
        flag = false;
      }
    }
    if (data.bidMatching === "Yes" && flag) {
      if (data.bidMatchingDuration === "") {
        setError("bidMatchingDuration", { message: "Bid matching duration is required and must be a number" });
        flag = false;
      }
      else if (data.bidMatchingDuration < 0) {
        setError("bidMatchingDuration", { message: "Bid matching duration must be a positive number" });
        flag = false;
      }
    }
    if (flag) {
      const payload = {
        "shipperId": selectedShipper,
        "currencies": (data.countriesCurrency)?.map(option => option.value),
        "basic": {
          "sttng_id": basicSttngId === "" ? null : basicSttngId,
          "communicate_by": arrayJoinFunction(data.informationMedium),
          "returning_fleet_radius": 0,
          "tracking_ping": data.pinTracking === "custom" ? parseInt(data.customPin) : parseInt(data.pinTracking),
          "is_fastag_opted": data.fastagService === "Yes",
          "epod_type": data.enableEpod === "Yes" ? data.epodType : "none",
          "eta": data.standardEta === "Yes",
        },
        "bid": {
          "bdsttng_id": bidSttngId === "" ? null : bidSttngId,
          "bid_mode": data.bidMode ? data.bidMode : "private_pool",
          "bid_duration": (data.bidDuration && data.bidDuration !== "") ? parseInt(data.bidDuration) : 0,
          "bid_increment_time": (data.bidDecrement && data.bidDecrement !== "") ? parseInt(data.bidDecrement) : 0,
          "bid_increment_duration": (data.bidIncrement && data.bidIncrement !== "") ? parseInt(data.bidIncrement) : 0,
          "bid_price_decrement": (data.bidPriceDecrement && data.bidPriceDecrement !== "") ? parseInt(data.bidPriceDecrement) : 0,
          "is_decrement_in_percentage": priceDecrementType,
          "no_of_tries": data.bidLimit !== "" ? parseInt(data.bidLimit) : 0,
          "enable_price_match": data.bidMatching === "Yes",
          "price_match_duration": (data.bidMatchingDuration && data.bidMatchingDuration !== "" && data.bidMatching === 'Yes') ? parseInt(data.bidMatchingDuration) : 0,
          "show_current_lowest_rate_transporter": data.currentLowestRate === "Yes",
          "show_contact_details_to_transporter": data.showContactDetailsToTransporter === "Yes",
          "bdsttng_rate_quote_type": data.rateQuationType ? (data.rateQuationType === "custom" ? data.customQuationType : data.rateQuationType) : "",
        },
        "alert": {
          "alrt_sttng_id": alertSttngId === "" ? null : alertSttngId,
          "hold_alert_enabled": selectedAlertBox.includes("Hold"),
          "delay_alert_enabled": (shipperModule === "Bidding & Tracking" || shipperModule === "Tracking") && selectedAlertBox.includes("Delay"),
          "arrival_alert_enabled": selectedAlertBox.includes("Arrival"),
          "departure_alert_enabled": selectedAlertBox.includes("Departure"),
          "route_deviate_alert_enabled": selectedAlertBox.includes("Deviation"),
          "sos_alert_enabled": selectedAlertBox.includes("SOS"),
          "e_way_bill_alert_enabled": selectedAlertBox.includes("E-way bill"),
          "alert_recipents": selectedAlertBox.length > 0 ? arrayJoinFunction(data.alertRecipents) : null,
          "notification_channels": (shipperModule === "Bidding & Tracking" || shipperModule === "Tracking") && selectedAlertBox.length > 0 ? arrayJoinFunction(data.notificationChannels) : null,
          "vehicle_hold_long": selectedAlertBox.includes("Hold") ? data[`HoldAlert`].highAlertTime && parseInt(data[`HoldAlert`]?.highAlertTime) : 0,
          "vehicle_hold_short": selectedAlertBox.includes("Hold") ? data[`HoldAlert`].lowAlertTime && parseInt(data[`HoldAlert`]?.lowAlertTime) : 0,
          "delay_long": (shipperModule === "Bidding & Tracking" || shipperModule === "Tracking") && selectedAlertBox.includes("Delay") ? data[`DelayAlert`].highAlertTime && parseInt(data[`DelayAlert`]?.highAlertTime) : 0,
          "delay_short": (shipperModule === "Bidding & Tracking" || shipperModule === "Tracking") && selectedAlertBox.includes("Delay") ? data[`DelayAlert`].lowAlertTime && parseInt(data[`DelayAlert`]?.lowAlertTime) : 0,
          "arrival_long": selectedAlertBox.includes("Arrival") ? data[`ArrivalAlert`].highAlertTime && parseInt(data[`ArrivalAlert`]?.highAlertTime) : 0,
          "arrival_short": selectedAlertBox.includes("Arrival") ? data[`ArrivalAlert`].lowAlertTime && parseInt(data[`ArrivalAlert`]?.lowAlertTime) : 0,
          "departure_long": selectedAlertBox.includes("Departure") ? data[`DepartureAlert`].highAlertTime && parseInt(data[`DepartureAlert`]?.highAlertTime) : 0,
          "departure_short": selectedAlertBox.includes("Departure") ? data[`DepartureAlert`].lowAlertTime && parseInt(data[`DepartureAlert`]?.lowAlertTime) : 0,
          "route_deviate_long": selectedAlertBox.includes("Deviation") ? data[`DeviationAlert`].highAlertTime && parseInt(data[`DeviationAlert`]?.highAlertTime) : 0,
          "route_deviate_short": selectedAlertBox.includes("Deviation") ? data[`DeviationAlert`].lowAlertTime && parseInt(data[`DeviationAlert`]?.lowAlertTime) : 0,
          "sos_long": selectedAlertBox.includes("SOS") ? data[`SOSAlert`].highAlertTime && parseInt(data[`SOSAlert`]?.highAlertTime) : 0,
          "sos_short": selectedAlertBox.includes("SOS") ? data[`SOSAlert`].lowAlertTime && parseInt(data[`SOSAlert`]?.lowAlertTime) : 0,
        },
        "geofence": {
          "gfnc_sttng_id": geofenceSttngId === "" ? null : geofenceSttngId,
          "source_radius": (data.sourceRadius && data.sourceRadius !== "") ? parseInt(data.sourceRadius) : 0,
          "arrival_radius": (data.arrivalRadius && data.arrivalRadius !== "") ? parseInt(data.arrivalRadius) : 0,
          "trip_close_radius": (data.tripClosureRadius && data.tripClosureRadius !== "") ? parseInt(data.tripClosureRadius) : 0,
          "trip_close_method": data.rateQuationTypeRadio ? data.rateQuationTypeRadio : "none",
        },
        "comments": []
      }
      if (data.bidComment && data.bidComment !== "") {
        payload.comments.push({
          "cmmnt_id": bidCommentId === "" ? null : bidCommentId,
          "cmmnt_text": data.bidComment,
          "cmmnt_for": "bidding"
        })
      }
      if (data.trackComment && data.trackComment !== "") {
        payload.comments.push({
          "cmmnt_id": trackCommentId === "" ? null : trackCommentId,
          "cmmnt_text": data.trackComment,
          "cmmnt_for": "tracking"
        })
      }
      if (basicSttngId === "" || bidSttngId === "" || alertSttngId === "" || geofenceSttngId === "") {
        saveUserSetting(payload);
      }
      else {
        updateUserSetting(payload);
      }
    }
  }

  return (
    <>
      {alertType !== "" ? (
        <AlertPage
          alertType={alertType}
          message={message}
          closePopup={closePopup}
        />
      ) : (
        null
      )}
      <BackdropComponent loading={loading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ContentWrapper>
          <RegisterCard>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">
                  Branch Settings
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={shipperList}
                  getOptionLabel={(option) => option.label || ""}
                  value={
                    shipperList.find(
                      (option) => option.value === selectedShipper
                    ) || null
                  }
                  onChange={(_, newValue) => {
                    setSelectedShipper(newValue.value);
                    setIsBranchVisible(true);
                    setSelectedBranch([]);
                    fetchBranchData(newValue.value);
                    fetchShipperModule(newValue.value);
                    fetchUserSetting(newValue.value);
                  }}
                  disableClearable={true}
                  popupIcon={<KeyboardArrowDownIcon />}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Shipper"
                      fullWidth
                      size="medium"
                      sx={{ bgcolor: '#fff' }}
                    />
                  )}
                />

              </Grid>

              <Grid item xs={12} sm={6}>
                {isBranchVisible && (
                  <Autocomplete
                    options={branchOptions}
                    getOptionLabel={(option) => option.label || ""}
                    value={
                      branchOptions.find(
                        (option) => option.value === selectedBranch
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      setSelectedBranch(newValue.value);
                    }}
                    disableClearable={true}
                    popupIcon={<KeyboardArrowDownIcon />}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Branch"
                          fullWidth
                          size="medium"
                          sx={{ bgcolor: '#fff' }}
                        />
                      </>
                    )}
                  />
                )}
              </Grid>
            </Grid>
          </RegisterCard>
          {isBranchVisible ?
            <>
              {shipperModule === 'Tracking' ? null :
                <RegisterCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h4">Bid type *</Typography>
                          <Typography variant="p">Select bidtype you want</Typography>
                        </Grid>
                        <Grid item xs={12}>

                          <Controller
                            name="bidType"
                            control={control}
                            defaultValue={["spot"]}
                            render={({ field }) => (
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <div
                                    className={`radio-option ${field.value.includes('contractual') ? 'selected' : ''}`}
                                    onClick={() => {
                                      const updatedValue = field.value.includes('contractual')
                                        ? field.value.filter(item => item !== 'contractual')
                                        : [...field.value, 'contractual'];
                                      field.onChange(updatedValue);
                                    }}
                                    style={{
                                      backgroundColor: "#ccc",
                                      pointerEvents: "none",
                                      userSelect: "none",
                                    }}
                                  >
                                    <div className="checkBoxIcon">
                                      <Checkbox checked={field.value.includes('contractual')} />
                                    </div>
                                    <div className="radiotext">
                                      <Typography variant="h5">Contractual</Typography>
                                    </div>
                                    <div className="radioIcon2">
                                      <InfoOutlinedIcon />
                                    </div>
                                  </div>
                                  {errors.bidType && (
                                    <ErrorTypography>
                                      {errors.bidType.message}
                                    </ErrorTypography>
                                  )}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <div
                                    className={`radio-option ${field.value.includes('spot') ? 'selected' : ''}`}
                                    onClick={() => {
                                      const updatedValue = field.value.includes('spot')
                                        ? field.value.filter(item => item !== 'spot')
                                        : [...field.value, 'spot'];
                                      field.onChange(updatedValue);
                                    }}
                                    style={{
                                      backgroundColor: "#ccc",
                                      pointerEvents: "none",
                                      userSelect: "none",
                                    }}
                                  >
                                    <div className="checkBoxIcon">
                                      <Checkbox checked={field.value.includes('spot')} />
                                    </div>
                                    <div className="radiotext">
                                      <Typography variant="h5">Spot</Typography>
                                    </div>
                                    <div className="radioIcon2">
                                      <InfoOutlinedIcon />
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </RegisterCard>
              }
              <RegisterCard>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                      Operating countries and currencies *
                    </Typography>
                    <Controller
                      name="countriesCurrency"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Autocomplete
                          multiple
                          {...field}
                          size="small"
                          id="setting-select"
                          options={currencyOptions}
                          popupIcon={<KeyboardArrowDownIcon />}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          onChange={(_, newValue) => {
                            field.onChange(newValue);
                            setSelectedCur(newValue)
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Operating countries and currencies*"
                              variant="filled"
                              fullWidth
                              size="small"
                              error={Boolean(errors.countriesCurrency)}
                              helperText={errors.countriesCurrency?.message}
                            />
                          )}
                          renderTags={() => (
                            <Box sx={{ display: 'flex' }}>
                              <Typography variant="h4" sx={{ marginLeft: '4px' }}>
                                {selectedCur.length}
                              </Typography>
                              <Typography variant="h4" sx={{ marginLeft: '5px' }}>
                                Countries and currencies selcted
                              </Typography>
                            </Box>
                          )}
                          renderOption={(props, option) => (
                            <li {...props}>
                              <Box display="flex" alignItems="center">
                                {selectedCur.some(
                                  (setting) => setting.label === option.label
                                ) ? (
                                  <CheckBoxIcon
                                    sx={{ color: '#065AD8', marginRight: '3px' }}
                                  />
                                ) : (
                                  <CheckBoxOutlinedIcon
                                    sx={{ color: '#74797C', marginRight: '3px' }}
                                  />
                                )}
                                {option.label}
                              </Box>
                            </li>
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                      Countries and currencies selcted
                    </Typography>
                    <Box
                      sx={{
                        border: '1px solid #BDCCD3',
                        borderRadius: '8px',
                        p: 2,
                        minHeight: '48px',
                      }}
                    >
                      {selectedCur.map((region) => (
                        <Chip
                          key={region.value}
                          label={region.label}
                          onDelete={() => handleChipDeleteOperating(region)}
                          variant="outlined"
                          color="primary"
                          sx={{ m: 1 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </RegisterCard>
              <RegisterCard>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4">
                      Information medium for transporter *
                    </Typography>
                    <Typography variant="p">
                      select single or multiple service you want
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="informationMedium"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <div
                              className={`checkbox-option ${field.value.includes('sms') ? 'selected' : ''
                                }`}
                              onClick={() => {
                                const updatedValue = field.value.includes('sms')
                                  ? field.value.filter(item => item !== 'sms')
                                  : [...field.value, 'sms'];
                                field.onChange(updatedValue);
                                setInfoProvider(updatedValue);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '42px',
                              }}
                            >
                              <div className="samllcheckBoxIcon">
                                <Checkbox
                                  checked={field.value.includes('sms')}
                                />
                              </div>
                              <div className="Chekboxtext">
                                <Typography variant="h5">SMS</Typography>
                              </div>
                            </div>
                            {errors.informationMedium && (
                              <ErrorTypography>
                                {errors.informationMedium.message}
                              </ErrorTypography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <div
                              className={`checkbox-option ${field.value.includes('email') ? 'selected' : ''
                                }`}
                              onClick={() => {
                                const updatedValue = field.value.includes('email')
                                  ? field.value.filter(item => item !== 'email')
                                  : [...field.value, 'email'];
                                field.onChange(updatedValue);
                                setInfoProvider(updatedValue);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '42px',
                              }}
                            >
                              <div className="samllcheckBoxIcon">
                                <Checkbox
                                  checked={field.value.includes('email')}
                                />
                              </div>
                              <div className="Chekboxtext">
                                <Typography variant="h5">Email</Typography>
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <div
                              className={`checkbox-option ${field.value.includes('whatsapp') ? 'selected' : ''
                                }`}
                              onClick={() => {
                                const updatedValue = field.value.includes('whatsapp')
                                  ? field.value.filter(item => item !== 'whatsapp')
                                  : [...field.value, 'whatsapp'];
                                field.onChange(updatedValue);
                                setInfoProvider(updatedValue);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '42px',
                              }}
                            >
                              <div className="samllcheckBoxIcon">
                                <Checkbox
                                  checked={field.value.includes('whatsapp')}
                                />
                              </div>
                              <div className="Chekboxtext">
                                <Typography variant="h5">Whatsapp</Typography>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      )}
                    />
                  </Grid>
                  {/* {infoProvider.includes('SMS') ? (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="p"> Add SMS provider</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="smsProvider"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                              <Autocomplete
                                multiple
                                {...field}
                                size="small"
                                id="setting-select"
                                options={SMSProviderOptions}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                onChange={(_, newValue) => {
                                  field.onChange(newValue);
                                  setSMSProvder(newValue)
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Country ad regions*"
                                    variant="filled"
                                    size="small"
                                    error={Boolean(errors.smsProvider)}
                                    helperText={errors.smsProvider?.message}
                                  />
                                )}
                                renderTags={() => (
                                  <Box sx={{ display: 'flex' }}>
                                    <Typography
                                      variant="p"
                                      sx={{ marginLeft: '4px' }}
                                    >
                                      {smsPrivder.length}
                                    </Typography>
                                    <Typography
                                      variant="p"
                                      sx={{ marginLeft: '5px', mb: 1 }}
                                    >
                                      Country and cuurencies selcted
                                    </Typography>
                                  </Box>
                                )}
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    <Box display="flex" alignItems="center">
                                      {smsPrivder.some(
                                        (setting) => setting.label === option.label
                                      ) ? (
                                        <CheckBoxIcon
                                          sx={{
                                            color: '#065AD8',
                                            marginRight: '3px',
                                          }}
                                        />
                                      ) : (
                                        <CheckBoxOutlinedIcon
                                          sx={{
                                            color: '#74797C',
                                            marginRight: '3px',
                                          }}
                                        />
                                      )}
                                      {option.label}
                                    </Box>
                                  </li>
                                )}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="p"> Added SMS provider</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              border: '1px solid #BDCCD3',
                              borderRadius: '8px',
                              p: 2,
                              minHeight: '48px',
                            }}
                          >
                            {smsPrivder.map((region) => (
                              <Chip
                                key={region.value}
                                label={region.label}
                                onDelete={() => handleChipDeleteSmsProvider(region)}
                                variant="outlined"
                                color="primary"
                                sx={{
                                  backgroundColor: '#065AD81A',
                                  color: '#065AD8',
                                  '&:hover': {
                                    backgroundColor: '#065AD81D',
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    // <Grid
                    //  item
                    //  xs={12}
                    //  container
                    //  justifyContent="flex-end"
                    //  alignItems="flex-end"
                    //>
                    //  <Button variant="contained">Add</Button>
                    //</Grid> 
                  </Grid>
                </Grid>
              ) : null} */}
                </Grid>
              </RegisterCard>
              {
                shipperModule === "Tracking" || shipperModule === "Bidding & Tracking" ?
                  <RegisterCard>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h4">Estimated Time Of Arrival *</Typography>
                            <Typography variant="p">
                              Do you need standard ETA for your organization
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name="standardEta"
                              control={control}
                              defaultValue={""}
                              render={({ field }) => (
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <div
                                      className={`checkbox-option ${field.value === 'Yes' ? 'selected' : ''}`}
                                      onClick={() => {
                                        field.onChange("Yes");
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '42px',
                                      }}
                                    >
                                      <div className="Chekboxtext">
                                        <Typography variant="h5">Yes</Typography>
                                      </div>
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'Yes'}
                                        />
                                      </div>
                                    </div>
                                    {errors.standardEta && (
                                      <ErrorTypography>
                                        {errors.standardEta.message}
                                      </ErrorTypography>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <div
                                      className={`checkbox-option ${field.value === 'No' ? 'selected' : ''}`}
                                      onClick={() => {
                                        field.onChange("No");
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '42px',
                                      }}
                                    >
                                      <div className="Chekboxtext">
                                        <Typography variant="h5">No</Typography>
                                      </div>
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'No'}
                                        />
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h4">Fastag Service *</Typography>
                            <Typography variant="p">
                              Do you need fastag for your organization
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name="fastagService"
                              control={control}
                              defaultValue={""}
                              render={({ field }) => (
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <div
                                      className={`checkbox-option ${field.value === 'Yes' ? 'selected' : ''}`}
                                      onClick={() => {
                                        field.onChange("Yes");
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '42px',
                                      }}
                                    >
                                      <div className="Chekboxtext">
                                        <Typography variant="h5">Yes</Typography>
                                      </div>
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'Yes'}
                                        />
                                      </div>
                                    </div>
                                    {errors.fastagService && (
                                      <ErrorTypography>
                                        {errors.fastagService.message}
                                      </ErrorTypography>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <div
                                      className={`checkbox-option ${field.value === 'No' ? 'selected' : ''}`}
                                      onClick={() => {
                                        field.onChange("No");
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '42px',
                                      }}
                                    >
                                      <div className="Chekboxtext">
                                        <Typography variant="h5">No</Typography>
                                      </div>
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'No'}
                                        />
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </RegisterCard>
                  : null
              }
              {
                shipperModule === "Tracking" || shipperModule === "Bidding & Tracking" ?
                  <RegisterCard>
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        <Typography variant="h4">EPOD *</Typography>
                        <Typography variant="p">
                          Do you want to enable EPOD for your organization
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name="enableEpod"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={3}>
                                <div
                                  className={`checkbox-option ${field.value === 'Yes' ? 'selected' : ''
                                    }`}
                                  onClick={() => {
                                    field.onChange("Yes");
                                    setEpodOption('Yes');
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">Yes</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'Yes'}
                                    />
                                  </div>
                                </div>
                                {errors.enableEpod && (
                                  <ErrorTypography>
                                    {errors.enableEpod.message}
                                  </ErrorTypography>
                                )}
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <div
                                  className={`checkbox-option ${field.value === 'none' ? 'selected' : ''}`}
                                  onClick={() => {
                                    field.onChange("none");
                                    setEpodOption('none');
                                    setValue("epodType", "");
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">No</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'none'}
                                    />
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          )}
                        />
                      </Grid>
                      {
                        epodOption === "Yes" ?
                          <Grid item xs={12}>
                            <Controller
                              name="epodType"
                              control={control}
                              defaultValue={""}
                              render={({ field }) => (
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <div
                                      className={`radio-option ${field.value === 'load_wise' ? 'selected' : ''
                                        }`}
                                      onClick={() => {
                                        field.onChange("load_wise");
                                      }}
                                    >
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'load_wise'}
                                        />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">Load-Wise e-POD</Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                    {errors.epodType && (
                                      <ErrorTypography>
                                        {errors.epodType.message}
                                      </ErrorTypography>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <div
                                      className={`radio-option ${field.value === 'invoice_wise' ? 'selected' : ''
                                        }`}
                                      onClick={() => {
                                        field.onChange("invoice_wise");
                                      }}
                                    >

                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'invoice_wise'}
                                        />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">Invoice-wise e-POD</Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <div
                                      className={`radio-option ${field.value === 'item_wise' ? 'selected' : ''
                                        }`}
                                      onClick={() => {
                                        field.onChange("item_wise");
                                      }}
                                    >
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'item_wise'}
                                        />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">Item-Wise e-POD</Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              )}
                            />
                          </Grid>
                          :
                          null
                      }
                    </Grid>
                  </RegisterCard>
                  : null
              }
              {
                shipperModule === "Tracking" || shipperModule === "Bidding & Tracking" ?
                  <RegisterCard>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h4">Tracking ping duration *</Typography>
                        <Typography variant="p">
                          select the tracking ping duration you want to go for
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name="pinTracking"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={4}>
                                <div
                                  className={`checkbox-option ${field.value === 15 ? 'selected' : ''
                                    }`}
                                  onClick={() => {
                                    field.onChange(15);
                                    setCustomTracking(false);
                                    setValue("customPin", "");
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">15 min</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 15}
                                    />
                                  </div>
                                </div>
                                {errors.pinTracking && (
                                  <ErrorTypography>
                                    {errors.pinTracking.message}
                                  </ErrorTypography>
                                )}
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <div
                                  className={`checkbox-option ${field.value === 30 ? 'selected' : ''
                                    }`}
                                  onClick={() => {
                                    field.onChange(30);
                                    setCustomTracking(false);
                                    setValue("customPin", "");
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">30 min</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 30}
                                    />
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <div
                                  className={`checkbox-option ${field.value === 'custom' ? 'selected' : ''
                                    }`}
                                  onClick={() => {
                                    field.onChange('custom');
                                    setCustomTracking(true);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">Custom</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'custom'}
                                    />
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          )}
                        />
                      </Grid>
                      {customTracking ? (
                        <Grid item xs={12} sm={12} md={6}>
                          <Controller
                            name="customPin"
                            control={control}
                            defaultValue={""}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                placeholder="Add custom ping duration"
                                size="small"
                                fullWidth
                                error={Boolean(errors.customPin)}
                                helperText={errors.customPin?.message}
                                sx={{ paddingRight: '0px !important' }}
                                InputProps={{
                                  style: { paddingRight: 0 },
                                  endAdornment: (
                                    <Box
                                      sx={{
                                        backgroundColor: '#F1F3F4',
                                        margin: 0,
                                        width: '90px',
                                        height: '40px',
                                        borderRadius: '3px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                    >
                                      mins
                                    </Box>
                                  ),
                                }}
                              />
                            )}
                          />
                        </Grid>
                      ) : null}
                    </Grid>
                  </RegisterCard>
                  : null
              }
              {
                shipperModule === "Bidding" || shipperModule === "Bidding & Tracking" ?
                  <RegisterCard>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h4">Bid Settings *</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Bid duration
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="bidDuration"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <TextField
                              fullWidth
                              {...field}
                              size="small"
                              error={Boolean(errors.bidDuration)}
                              helperText={errors.bidDuration?.message}
                              sx={{ paddingRight: '0px !important' }}
                              InputProps={{
                                style: { paddingRight: 0 },
                                endAdornment: (
                                  <Box
                                    sx={{
                                      backgroundColor: '#F1F3F4',
                                      margin: 0,
                                      width: '90px',
                                      height: '40px',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    mins
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Bid increment time to be applied at
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="bidIncrement"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <TextField
                              fullWidth
                              {...field}
                              size="small"
                              label="Bid increment time to be applied at"
                              error={Boolean(errors.bidIncrement)}
                              helperText={errors.bidIncrement?.message}
                              sx={{ paddingRight: '0px !important' }}
                              InputProps={{
                                style: { paddingRight: 0 },
                                endAdornment: (
                                  <Box
                                    sx={{
                                      backgroundColor: '#F1F3F4',
                                      margin: 0,
                                      width: '90px',
                                      height: '40px',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    mins
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Bid increment time
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="bidDecrement"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              size="small"
                              label="Bid increment time"
                              error={Boolean(errors.bidDecrement)}
                              helperText={errors.bidDecrement?.message}
                              sx={{ paddingRight: '0px !important' }}
                              InputProps={{
                                style: { paddingRight: 0 },
                                endAdornment: (
                                  <Box
                                    sx={{
                                      backgroundColor: '#F1F3F4',
                                      margin: 0,
                                      width: '90px',
                                      height: '40px',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    mins
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Bid price decrement
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="bidPriceDecrement"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              fullWidth
                              error={Boolean(errors.bidPriceDecrement)}
                              helperText={errors.bidPriceDecrement?.message}
                              sx={{ paddingRight: '0px !important' }}
                              InputProps={{
                                style: { paddingRight: 0 },
                                endAdornment: (
                                  <Box
                                    sx={{
                                      backgroundColor: '#F1F3F4',
                                      margin: 0,
                                      width: '90px',
                                      height: '40px',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      variant='standard'
                                      value={priceDecrementType}
                                      label="Age"
                                      onChange={e => setPriceDecrementType(e.target.value)}
                                    >
                                      <MenuItem value={false}>₹</MenuItem>
                                      <MenuItem value={true}>%</MenuItem>
                                    </Select>
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            No. of Bids Allowed
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="bidLimit"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              {...field}
                              label="No. of Bids Allowed"
                              size="small"
                              fullWidth
                              error={Boolean(errors.bidLimit)}
                              helperText={errors.bidLimit?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '4px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Price matching
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="bidMatching"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <div
                                  className={`checkbox-option ${field.value === 'Yes' ? 'selected' : ''
                                    }`}
                                  onClick={() => { field.onChange('Yes'); setDisable(false) }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">Yes</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'Yes'}
                                    />
                                  </div>
                                </div>
                                {errors.bidMatching && (
                                  <ErrorTypography>
                                    {errors.bidMatching.message}
                                  </ErrorTypography>
                                )}
                              </Grid>
                              <Grid item xs={6}>
                                <div
                                  className={`checkbox-option ${field.value === 'No' ? 'selected' : ''
                                    }`}
                                  onClick={() => { field.onChange('No'); setDisable(true) }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">No</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'No'}
                                    />
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Price matching duration
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="bidMatchingDuration"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type='number'
                              disabled={disable}
                              size="small"
                              error={Boolean(errors.bidMatchingDuration)}
                              helperText={errors.bidMatchingDuration?.message}
                              sx={{ paddingRight: '0px !important' }}
                              InputProps={{
                                style: { paddingRight: 0 },
                                endAdornment: (
                                  <Box
                                    sx={{
                                      backgroundColor: '#F1F3F4',
                                      margin: 0,
                                      width: '90px',
                                      height: '40px',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    mins
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={8}>
                        <div style={{ display: 'flex', marginBottom: '4px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Show current lowest rate to transporter
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="currentLowestRate"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <div
                                  className={`checkbox-option ${field.value === 'Yes' ? 'selected' : ''
                                    }`}
                                  onClick={() => field.onChange('Yes')}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">Yes</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'Yes'}
                                    />
                                  </div>
                                </div>
                                {errors.currentLowestRate && (
                                  <ErrorTypography>
                                    {errors.currentLowestRate.message}
                                  </ErrorTypography>
                                )}
                              </Grid>
                              <Grid item xs={6}>
                                <div
                                  className={`checkbox-option ${field.value === 'No' ? 'selected' : ''
                                    }`}
                                  onClick={() => field.onChange('No')}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">No</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'No'}
                                    />
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <div style={{ display: 'flex', marginBottom: '4px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Show contact details to  transporter
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="showContactDetailsToTransporter"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <div
                                  className={`checkbox-option ${field.value === 'Yes' ? 'selected' : ''
                                    }`}
                                  onClick={() => field.onChange('Yes')}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">Yes</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'Yes'}
                                    />
                                  </div>
                                </div>
                                {errors.showContactDetailsToTransporter && (
                                  <ErrorTypography>
                                    {errors.showContactDetailsToTransporter.message}
                                  </ErrorTypography>
                                )}
                              </Grid>
                              <Grid item xs={6}>
                                <div
                                  className={`checkbox-option ${field.value === 'No' ? 'selected' : ''
                                    }`}
                                  onClick={() => field.onChange('No')}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '42px',
                                  }}
                                >
                                  <div className="Chekboxtext">
                                    <Typography variant="h5">No</Typography>
                                  </div>
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'No'}
                                    />
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="p" sx={{ marginRight: '10px' }}>
                              Bid mode
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name="bidMode"
                              control={control}
                              defaultValue={""}
                              render={({ field }) => (
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <div
                                      className={`radio-option ${field.value === 'private_pool' ? 'selected' : ''
                                        }`}
                                      onClick={() => field.onChange('private_pool')}
                                    >
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'private_pool'}
                                        />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">Private </Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                    {errors.bidMode && (
                                      <ErrorTypography>
                                        {errors.bidMode.message}
                                      </ErrorTypography>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <div
                                      className={`radio-option ${field.value === 'open_market' ? 'selected' : ''
                                        }`}
                                      onClick={() => field.onChange('open_market')}
                                    >
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'open_market'}
                                        />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">Open market </Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="p" sx={{ marginRight: '10px' }}>
                              Rate Quotation Type
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name="rateQuationType"
                              control={control}
                              defaultValue={""}
                              render={({ field }) => (
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <div
                                      className={`radio-option ${field.value === 'PMT' ? 'selected' : ''
                                        }`}
                                      onClick={() => {
                                        field.onChange('PMT');
                                        setRateCustom(false);
                                        setValue("customQuationType", "");
                                      }}
                                    >
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'PMT'}
                                        />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">PMT </Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                    {errors.rateQuationType && (
                                      <ErrorTypography>
                                        {errors.rateQuationType.message}
                                      </ErrorTypography>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <div
                                      className={`radio-option ${field.value === 'FTL' ? 'selected' : ''
                                        }`}
                                      onClick={() => {
                                        field.onChange('FTL');
                                        setRateCustom(false);
                                        setValue("customQuationType", "");
                                      }}
                                    >
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'FTL'}
                                        />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">FTL</Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <div
                                      className={`radio-option ${field.value === 'custom' ? 'selected' : ''}`}
                                      onClick={() => {
                                        field.onChange('custom');
                                        setRateCustom(true);
                                      }}
                                    >
                                      <div className="radioIcon">
                                        <Radio
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                          checked={field.value === 'custom'}
                                        />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">Custom</Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      {rateCustom ? (
                        <Grid item xs={12} sm={6}>
                          <div style={{ display: 'flex', marginBottom: '10px' }}>
                            <Typography variant="p" sx={{ marginRight: '10px' }}>
                              Add custom quotation Type
                            </Typography>
                            <InfoOutlinedIcon />
                          </div>
                          <Controller
                            name="customQuationType"
                            control={control}
                            defaultValue={""}
                            render={({ field }) => (
                              <TextField
                                variant="filled"
                                {...field}
                                label="Rate Quotation Type"
                                fullWidth
                                size='small'
                                error={Boolean(errors.customQuationType)}
                                helperText={errors.customQuationType?.message}
                              />
                            )}
                          />
                        </Grid>
                      ) : null}
                    </Grid>
                  </RegisterCard>
                  : null
              }
              {
                shipperModule === "Tracking" || shipperModule === "Bidding & Tracking" ?
                  <RegisterCard>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h4" style={{ marginBottom: '20px' }}>
                          Alert settings *
                        </Typography>
                        <Typography variant="p">
                          Select single or multiple alerts you want for your organization
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name="settingAlert"
                          control={control}
                          defaultValue={["Delay"]}
                          render={({ field }) => (
                            <Grid container spacing={2}>
                              {
                                alertCheckboxOptions.map(alertBox => (
                                  <Grid item xs={12} sm={6} md={4} key={alertBox}>
                                    <div
                                      className={`radio-option ${field.value.includes(alertBox) ? 'selected' : ''
                                        }`}
                                      onClick={() => {
                                        if (alertBox !== "Delay") {
                                          const updatedValue = field.value?.includes(
                                            alertBox
                                          )
                                            ? field.value.filter(
                                              (item) => item !== alertBox
                                            )
                                            : [...field.value, alertBox];
                                          field.onChange(updatedValue);
                                          setSelectedAlertBox(updatedValue);
                                          handleCheckboxClick(alertBox);
                                        }
                                      }}
                                    >
                                      <div
                                        className="checkBoxIcon"
                                      >
                                        <Checkbox checked={field.value.includes(alertBox)} />
                                      </div>
                                      <div className="radiotext">
                                        <Typography variant="h5">{alertBox} alert</Typography>
                                      </div>
                                      <div className="radioIcon2">
                                        <InfoOutlinedIcon />
                                      </div>
                                    </div>
                                    {errors.settingAlert && (
                                      <ErrorTypography>
                                        {errors.settingAlert.message}
                                      </ErrorTypography>
                                    )}
                                  </Grid>
                                ))
                              }
                            </Grid>
                          )}
                        />
                      </Grid>
                      {
                        selectedAlertBox.length !== 0 ?
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Card>
                                  <div className="customCardheader">
                                    <Typography variant="h4">
                                      Common settings options
                                    </Typography>
                                  </div>
                                  <Grid container spacing={2} sx={{ px: 2, pb: 2 }}>
                                    <Grid item xs={12}>
                                      <Typography variant="p">
                                        Notification Channels
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Controller
                                        name="notificationChannels"
                                        control={control}
                                        defaultValue={["app"]}
                                        render={({ field }) => (
                                          <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                              <div
                                                className={`checkbox-option ${field.value.includes('sms') ? 'selected' : ''
                                                  }`}
                                                onClick={() => {
                                                  const updatedValue = field.value.includes('sms')
                                                    ? field.value.filter(item => item !== 'sms')
                                                    : [...field.value, 'sms'];
                                                  field.onChange(updatedValue);
                                                }}
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  height: '42px',
                                                }}
                                              >
                                                <div className="samllcheckBoxIcon">
                                                  <Checkbox
                                                    checked={field.value.includes('sms')}
                                                  />
                                                </div>
                                                <div className="Chekboxtext">
                                                  <Typography variant="p">SMS</Typography>
                                                </div>
                                              </div>
                                              {errors.notificationChannels && (
                                                <ErrorTypography>
                                                  {errors.notificationChannels?.message}
                                                </ErrorTypography>
                                              )}
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                              <div
                                                className={`checkbox-option ${field.value?.includes("app")
                                                  ? "selected"
                                                  : ""
                                                  }`}
                                                // onClick={() => {
                                                //   const updatedValue =
                                                //     field.value?.includes('app')
                                                //       ? field.value.filter(
                                                //         (item) => item !== 'app'
                                                //       )
                                                //       : [...field.value, 'app'];
                                                //   field.onChange(updatedValue);
                                                // }}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  height: "42px",
                                                }}
                                              >
                                                <div className="samllcheckBoxIcon">
                                                  <Checkbox
                                                    checked={field.value?.includes(
                                                      "app"
                                                    )}
                                                  />
                                                </div>
                                                <div className="Chekboxtext">
                                                  <Typography variant="p">
                                                    In-App
                                                  </Typography>
                                                </div>
                                              </div>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                              <div
                                                className={`checkbox-option ${field.value.includes('calls')
                                                  ? 'selected'
                                                  : ''
                                                  }`}
                                                onClick={() => {
                                                  const updatedValue = field.value.includes('calls')
                                                    ? field.value.filter(item => item !== 'calls')
                                                    : [...field.value, 'calls'];
                                                  field.onChange(updatedValue);
                                                }}
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  height: '42px',
                                                }}
                                              >
                                                <div className="samllcheckBoxIcon">
                                                  <Checkbox
                                                    checked={field.value.includes('calls')}
                                                  />
                                                </div>
                                                <div className="Chekboxtext">
                                                  <Typography variant="p">Calls</Typography>
                                                </div>
                                              </div>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                              <div
                                                className={`checkbox-option ${field.value.includes('email')
                                                  ? 'selected'
                                                  : ''
                                                  }`}
                                                onClick={() => {
                                                  const updatedValue = field.value.includes('email')
                                                    ? field.value.filter(item => item !== 'email')
                                                    : [...field.value, 'email'];
                                                  field.onChange(updatedValue);
                                                }}
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  height: '42px',
                                                }}
                                              >
                                                <div className="samllcheckBoxIcon">
                                                  <Checkbox
                                                    checked={field.value.includes('email')}
                                                  />
                                                </div>
                                                <div className="Chekboxtext">
                                                  <Typography variant="p">Email</Typography>
                                                </div>
                                              </div>
                                            </Grid>
                                          </Grid>
                                        )}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography variant="p">Alert Recipents</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Controller
                                        name="alertRecipents"
                                        control={control}
                                        defaultValue={[]}
                                        render={({ field }) => (
                                          <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={4}>
                                              <div
                                                className={`radio-option ${field.value.includes('shipper') ? 'selected' : ''
                                                  }`}
                                                onClick={() => {
                                                  const updatedValue = field.value.includes('shipper')
                                                    ? field.value.filter(item => item !== 'shipper')
                                                    : [...field.value, 'shipper'];
                                                  field.onChange(updatedValue);
                                                }}
                                              >
                                                <div className="checkBoxIcon">
                                                  <Checkbox
                                                    checked={field.value.includes('shipper')}
                                                  />
                                                </div>
                                                <div className="radiotext">
                                                  <Typography variant="h5">Shipper </Typography>
                                                </div>
                                                <div className="radioIcon2">
                                                  <InfoOutlinedIcon />
                                                </div>
                                              </div>
                                              {errors.alertRecipents && (
                                                <ErrorTypography>
                                                  {errors.alertRecipents?.message}
                                                </ErrorTypography>
                                              )}
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                              <div
                                                className={`radio-option ${field.value.includes('transporter')
                                                  ? 'selected'
                                                  : ''
                                                  }`}
                                                onClick={() => {
                                                  const updatedValue = field.value.includes('transporter')
                                                    ? field.value.filter(item => item !== 'transporter')
                                                    : [...field.value, 'transporter'];
                                                  field.onChange(updatedValue);
                                                }}
                                              >
                                                <div className="checkBoxIcon">
                                                  <Checkbox
                                                    checked={field.value.includes('transporter')}
                                                  />
                                                </div>
                                                <div className="radiotext">
                                                  <Typography variant="h5">Transporter</Typography>
                                                </div>
                                                <div className="radioIcon2">
                                                  <InfoOutlinedIcon />
                                                </div>
                                              </div>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                              <div
                                                className={`radio-option ${field.value.includes('customer')
                                                  ? 'selected'
                                                  : ''
                                                  }`}
                                                onClick={() => {
                                                  const updatedValue = field.value.includes('customer')
                                                    ? field.value.filter(item => item !== 'customer')
                                                    : [...field.value, 'customer'];
                                                  field.onChange(updatedValue);
                                                }}
                                              >
                                                <div className="checkBoxIcon">
                                                  <Checkbox
                                                    checked={field.value.includes('customer')}
                                                  />
                                                </div>
                                                <div className="radiotext">
                                                  <Typography variant="h5">Customer</Typography>
                                                </div>
                                                <div className="radioIcon2">
                                                  <InfoOutlinedIcon />
                                                </div>
                                              </div>
                                            </Grid>
                                          </Grid>
                                        )}
                                      />
                                    </Grid>
                                  </Grid>
                                </Card>
                              </Grid>
                              {
                                (!selectedAlertBox.includes("E-way bill") || (selectedAlertBox.length > 1)) &&
                                <Grid item xs={12}>
                                  <Typography variant="h4">
                                    Selected alerts and their settings
                                  </Typography>
                                </Grid>
                              }
                              {
                                selectedAlertBox.map((alertSetting) => (
                                  alertSetting !== "E-way bill" &&
                                  <Grid item key={alertSetting} xs={12}>
                                    <Accordion
                                      expanded={expanded[alertSetting] || false}
                                      onChange={() => handleCheckboxClick(alertSetting)}
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{ backgroundColor: '#F1F3F4' }}
                                      >
                                        <Typography variant="h4">{alertSetting} Alert</Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <Grid container spacing={2}>
                                          <Grid item xs={12}>
                                            <Typography variant="p">Alert Criteria</Typography>
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                            <Controller
                                              name={`${alertSetting}Alert.lowAlertTime`}
                                              control={control}
                                              defaultValue=""
                                              render={({ field }) => (
                                                <TextField
                                                  {...field}
                                                  fullWidth
                                                  size="small"
                                                  label="Low alert time"
                                                  error={Boolean(errors[`${alertSetting}Alert`]?.lowAlertTime)}
                                                  helperText={errors[`${alertSetting}Alert`]?.lowAlertTime?.message}
                                                  sx={{ paddingRight: '0px !important' }}
                                                  InputProps={{
                                                    style: { paddingRight: 0 },
                                                    endAdornment: (
                                                      <Box
                                                        sx={{
                                                          backgroundColor: '#F1F3F4',
                                                          margin: 0,
                                                          width: '90px',
                                                          height: '40px',
                                                          borderRadius: '3px',
                                                          display: 'flex',
                                                          justifyContent: 'center',
                                                          alignItems: 'center',
                                                        }}
                                                      >
                                                        mins
                                                      </Box>
                                                    ),
                                                  }}
                                                />
                                              )}
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                            <Controller
                                              name={`${alertSetting}Alert.highAlertTime`}
                                              control={control}
                                              defaultValue=""
                                              render={({ field }) => (
                                                <TextField
                                                  {...field}
                                                  fullWidth
                                                  size="small"
                                                  label="High alert time"
                                                  error={Boolean(errors[`${alertSetting}Alert`]?.highAlertTime)}
                                                  helperText={errors[`${alertSetting}Alert`]?.highAlertTime?.message}
                                                  sx={{ paddingRight: '0px !important' }}
                                                  InputProps={{
                                                    style: { paddingRight: 0 },
                                                    endAdornment: (
                                                      <Box
                                                        sx={{
                                                          backgroundColor: '#F1F3F4',
                                                          margin: 0,
                                                          width: '90px',
                                                          height: '40px',
                                                          borderRadius: '3px',
                                                          display: 'flex',
                                                          justifyContent: 'center',
                                                          alignItems: 'center',
                                                        }}
                                                      >
                                                        mins
                                                      </Box>
                                                    ),
                                                  }}
                                                />
                                              )}
                                            />
                                          </Grid>
                                        </Grid>
                                      </AccordionDetails>
                                    </Accordion>
                                  </Grid>
                                ))
                              }
                            </Grid>
                          </Grid>
                          : null
                      }
                    </Grid>
                  </RegisterCard>
                  : null
              }
              {
                shipperModule === "Tracking" || shipperModule === "Bidding & Tracking" ?
                  <RegisterCard>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h4">Geofencing settings *</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Source Radius
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="sourceRadius"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              size="small"
                              sx={{ paddingRight: '0px !important' }}
                              error={Boolean(errors.sourceRadius)}
                              helperText={errors.sourceRadius?.message}
                              InputProps={{
                                style: { paddingRight: 0 },
                                endAdornment: (
                                  <Box
                                    sx={{
                                      backgroundColor: '#F1F3F4',
                                      margin: 0,
                                      width: '90px',
                                      height: '50px',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    Km
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Arrival Radius
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="arrivalRadius"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              fullWidth
                              {...field}
                              size="small"
                              error={Boolean(errors.arrivalRadius)}
                              helperText={errors.arrivalRadius?.message}
                              sx={{ paddingRight: '0px !important' }}
                              InputProps={{
                                style: { paddingRight: 0 },
                                endAdornment: (
                                  <Box
                                    sx={{
                                      backgroundColor: '#F1F3F4',
                                      margin: 0,
                                      width: '90px',
                                      height: '50px',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    Km
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Trip Closure Radius
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="tripClosureRadius"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              size="small"
                              error={Boolean(errors.tripClosureRadius)}
                              helperText={errors.tripClosureRadius?.message}
                              sx={{ paddingRight: '0px !important' }}
                              InputProps={{
                                style: { paddingRight: 0 },
                                endAdornment: (
                                  <Box
                                    sx={{
                                      backgroundColor: '#F1F3F4',
                                      margin: 0,
                                      width: '90px',
                                      height: '50px',
                                      borderRadius: '3px',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    Km
                                  </Box>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="p" sx={{ marginRight: '10px' }}>
                          Auto trip completion method
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name="rateQuationTypeRadio"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <div
                                  className={`radio-option ${field.value === 'radius' ? 'selected' : ''
                                    }`}
                                  onClick={() => field.onChange('radius')}
                                >
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'radius'}
                                    />
                                  </div>
                                  <div className="radiotext">
                                    <Typography variant="h5">Radius wise</Typography>
                                  </div>
                                  <div className="radioIcon2">
                                    <InfoOutlinedIcon />
                                  </div>
                                </div>

                                {errors.rateQuationTypeRadio && (
                                  <ErrorTypography>
                                    {errors.rateQuationTypeRadio.message}
                                  </ErrorTypography>
                                )}
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <div
                                  className={`radio-option ${field.value === 'epod' ? 'selected' : ''
                                    }`}
                                  onClick={() => field.onChange('epod')}
                                >
                                  <div className="radioIcon">
                                    <Radio
                                      icon={<RadioButtonUncheckedIcon />}
                                      checkedIcon={<RadioButtonCheckedIcon />}
                                      checked={field.value === 'epod'}
                                    />
                                  </div>
                                  <div className="radiotext">
                                    <Typography variant="h5">EPOD wise</Typography>
                                  </div>
                                  <div className="radioIcon2">
                                    <InfoOutlinedIcon />
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </RegisterCard>
                  : null
              }
              <RegisterCard>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Default Comment</Typography>
                  </Grid>
                  {
                    shipperModule === "Bidding" || shipperModule === "Bidding & Tracking" ?
                      <Grid item xs={12} sm={6}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <Typography variant="p" sx={{ marginRight: '10px' }}>
                            Bidding comment
                          </Typography>
                          <InfoOutlinedIcon />
                        </div>
                        <Controller
                          name="bidComment"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextareaAutosize
                              aria-label="empty textarea"
                              minRows={4}
                              {...field}
                            />
                          )}
                        />
                      </Grid>
                      : null
                  }
                  {shipperModule === "Tracking" || shipperModule === "Bidding & Tracking" ?
                    <Grid item xs={12} sm={6}>
                      <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <Typography variant="p" sx={{ marginRight: '10px' }}>
                          Tracking comment
                        </Typography>
                        <InfoOutlinedIcon />
                      </div>
                      <Controller
                        name="trackComment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextareaAutosize
                            aria-label="empty textarea"
                            minRows={4}
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    : null
                  }
                </Grid>
              </RegisterCard>

              <Grid item md={12}>
                <div style={{ textAlign: "end" }}>
                  <Button variant="contained" type='submit'>
                    Submit
                  </Button>
                </div>
              </Grid>
            </>

            : ""}
        </ContentWrapper>
      </form >
    </>
  )
}

export default SettingComponent