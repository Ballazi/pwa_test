import React, {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  DrawingManager,
  DirectionsService,
  DirectionsRenderer,
  LoadScript,
  Autocomplete,
  Polyline,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";
import {
  Grid,
  Box,
  TextField,
  Button,
  AccordionSummary,
  IconButton,
  Accordion,
  Typography,
  AccordionDetails,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import haversine from "haversine-distance";

export default function GogMapLoad(props) {
  const gogapi = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const libs = ["places", "drawing"];
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const destiantionRef = useRef();
  const originRef = useRef();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [waypts, setWaypts] = useState([]);
  const [optimizeRoute, setOptimizedRoute] = useState(false);
  const infowindowRef = useRef(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mutipleSourceInput, setmutipleSourceInput] = useState([]);
  const [mutipleDestinationInput, setmutipleDestinationInput] = useState([]);
  const [multipleOrginValues, setMultipleOrginValues] = useState({});
  const [multipleDestinationValues, setMultipleDestinationValues] = useState(
    {}
  );
  const [alertContent, setAlertContent] = useState("");
  const [markerClicked, setMarkerClicked] = useState(false);
  const [infowWindowPostion, setInfoWindowPostion] = useState({});

  const [distanceOptimized, setDistanceOptimized] = useState(false);
  const [destinationValue, setDestinationValue] = useState(
    props.viewSrcDest ? props.viewSrcDest["dest"][0] : null
  );
  const [sourceValue, setSourceValue] = useState(
    props.viewSrcDest ? props.viewSrcDest["src"][0] : null
  );
  const [accordianExpanded, setAccordianExpanded] = useState(
    props?.accordianOpen ? true : false
  );
  const sourceAutomCompleteRefs = useRef([]);
  const destinationAutoCompleteRefs = useRef([]);
  const [mulSource, setMulSource] = useState({});
  const [mulDestination, setMulDestination] = useState({});

  const addmutipleSourceInput = () => {
    setmutipleSourceInput((prevInput) => [...prevInput, ""]);
  };
  const addmutipleDestinationInput = () => {
    setmutipleDestinationInput((prevInput) => [...prevInput, ""]);
  };
  function reverseGeocoding(event) {
    console.log(event.latLng.lat(), event.latLng.lng(), markerClicked);

    const alertLatlng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: alertLatlng }).then((res) => {
      console.log("Reverse geo coded", res.results[0]);
      setAlertContent(res.results[0].formatted_address);
      setMarkerClicked(true);
      setInfoWindowPostion(alertLatlng);
    });
  }
  //here Reverse Gecocoding (address=>lat long)
  const handleOriginValues = (index, val) => {
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: val }).then((res) => {
      setMulSource({
        ...mulSource,
        [index]: {
          lat: res.results[0].geometry.location.lat(),
          lng: res.results[0].geometry.location.lng(),
        },
      });

      console.log("res", res.results[0].geometry.location.lat());
    });

    console.log("updatedorginval", val);
  };
  useEffect(() => {
    console.log("useEffect 4");
    console.log("muloriginval", multipleDestinationValues, multipleOrginValues);
    let tempWaypts = [];
    Object.values(multipleOrginValues).map((val, index) =>
      tempWaypts.push({
        location: val,
        stopover: true,
      })
    );

    Object.values(multipleDestinationValues).map((val, index) =>
      tempWaypts.push({
        location: val,
        stopover: true,
      })
    );

    setWaypts([...tempWaypts]);

    console.log("here new array", tempWaypts);
  }, [multipleOrginValues, multipleDestinationValues]);
  useEffect(() => {
    console.log("useEffect 3");
    calculateRoute();
  }, [waypts]);
  useEffect(() => {
    console.log("useEffect");
    if (props.viewSrcDest) {
      setSourceValue(props.viewSrcDest["src"][0]);
      setDestinationValue(props.viewSrcDest["dest"][0]);
    }
  }, [props.viewSrcDest]);
  useEffect(() => {
    console.log("useEffect 2");
    console.log(
      "mapReset",
      props.mapReset,
      sourceValue,
      destinationValue,
      multipleOrginValues,
      multipleDestinationValues
    );
    if (props.mapReset) {
      clearRoute(3);
      // setSourceValue(null);
      setDestinationValue(null);
      setMultipleOrginValues({});
      setMulDestination({});
      setMulSource({});
      setmutipleSourceInput([]);
      setmutipleDestinationInput([]);

      setMultipleDestinationValues({});
      props.setMapreset(false);
    }
  }, [props.mapReset]);
  function handleMultipleDestinationValue(e, index) {
    const updatedDestinationVal = { ...multipleDestinationValues };
    updatedDestinationVal[index] =
      destinationAutoCompleteRefs.current[index].value;
    setMultipleDestinationValues(updatedDestinationVal);
    setOptimizedRoute(false);
    setDistanceOptimized(false);
  }

  const handleOrigin = (val) => {
    console.log("here value coming", originRef.current.value);
    if (val !== 0) {
      props.originSelected ? props.originSelected(true) : null;
    }

    setSourceValue(originRef.current.value);
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: originRef.current.value }).then((res) => {
      setOrigin({
        lat: res.results[0].geometry.location.lat(),
        lng: res.results[0].geometry.location.lng(),
      });

      console.log("res", res.results[0].geometry.location.lat());
    });
    if (destiantionRef.current.value !== "") {
      calculateRoute();
    }
  };
  const handleDestinationChanged = (index) => {
    const selectedPlace = destinationAutoCompleteRefs.current[index].value;

    // Use the appropriate ref from the array
    const updatedDestinationVal = { ...multipleDestinationValues };
    updatedDestinationVal[index] =
      destinationAutoCompleteRefs.current[index].value;
    setMultipleDestinationValues(updatedDestinationVal);
    console.log("selected", selectedPlace);
    handleDestinationValues(index, selectedPlace);
  };

  const handleDestinationValues = (index, val) => {
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: val }).then((res) => {
      setMulDestination({
        ...mulDestination,
        [index]: {
          lat: res.results[0].geometry.location.lat(),
          lng: res.results[0].geometry.location.lng(),
        },
      });

      console.log("res", res.results[0].geometry.location.lat());
    });

    console.log("updated destination value", val);
  };

  const handleDestination = () => {
    console.log("here value coming", destiantionRef.current.value);
    setDestinationValue(destiantionRef.current.value);
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: destiantionRef.current.value }).then((res) => {
      setDestination({
        lat: res.results[0].geometry.location.lat(),
        lng: res.results[0].geometry.location.lng(),
      });
      calculateRoute();
    });
  };

  // this function will determine distance between two points and give them in sorted order
  function haversine_distance(origin_list, destination_list) {
    var R = 6371.071; // Radius of the Earth in Km
    console.log("distance_list", origin_list);
    var last_origin = origin_list[origin_list.length - 1];
    var origin_lat = last_origin.lat;
    var origin_long = last_origin.lng;
    var result = destination_list.map((dest) => {
      let updated_dis = haversine(
        { lat: last_origin.lat, lng: last_origin.lng },
        { lat: dest.lat, lng: dest.lng }
      );
      console.log(
        "distance from library",
        `${dest.src_city},${dest.src_state},${dest.src_country}`,
        updated_dis
      );
      // var dlat = dest.lat * (Math.PI / 180); // Convert degrees to radians
      // var difflat = dlat - origin_lat; // Radian difference (latitudes)
      // var difflon = (origin_long - dest.lng) * (Math.PI / 180); // Radian difference (longitudes)
      // var d =
      //   2 *
      //   R *
      //   Math.asin(
      //     Math.sqrt(
      //       Math.sin(difflat / 2) * Math.sin(difflat / 2) +
      //         Math.cos(origin_lat) *
      //           Math.cos(dlat) *
      //           Math.sin(difflon / 2) *
      //           Math.sin(difflon / 2)
      //     )
      //   );
      return {
        distance: updated_dis,
        add: `${dest.src_city},${dest.src_state},${dest.src_country}`,
        lat: dest.lat,
        lng: dest.lng,
      };
    });
    console.log("distance_result===>", result);
    console.log("waypts_distance====>", mulDestination);
    result.sort((a, b) => a.distance - b.distance);
    console.log("distance_sorted====>", result);
    var updated_muldest = result.map((val, index) => {
      return { [index]: { lat: val.lat, lng: val.lng } };
    });
    console.log("distance_updted_latlng", updated_muldest);

    const resultObject = updated_muldest.reduce((acc, obj) => {
      const key = Object.keys(obj)[0]; // Get the key of the current object
      acc[key] = obj[key]; // Merge the current object into the accumulator
      return acc;
    }, {});

    console.log("distance_resultObject", resultObject);

    setMulDestination(resultObject);

    // calculateRoute();

    // var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
    // var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
    // var difflat = rlat2-rlat1; // Radian difference (latitudes)
    // var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

    // var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    // return d;
    setDistanceOptimized(true);
  }

  useEffect(() => {
    console.log("in distance optimized");

    calculateRoute();
  }, [optimizeRoute, distanceOptimized]);

  // this function takes array of addresses of sources and destination and returns their long lat
  async function addressToLatLng(val, eta) {
    const geocoder = new window.google.maps.Geocoder();
    console.log("VALUE FROM GOOGLE : ", val);
    console.log("VALUE FROM SRC : ", val[0].sources);
    console.log("VALUE FROM DEST : ", val[0].destination);

    let destLatLongArr = await Promise.all(
      val[0].destination.map(async (add, index) => {
        let result1 = {};
        const addressDetails1 = add.split(",");
        console.log("here addressDetails1", addressDetails1);
        try {
          const res2 = await geocoder.geocode({ address: add });
          result1 = {
            lat: res2.results[0].geometry.location.lat(),
            lng: res2.results[0].geometry.location.lng(),
            src_city:
              addressDetails1.length > 2
                ? addressDetails1.slice(0, -2).join(", ")
                : addressDetails1[0],
            src_state: addressDetails1[addressDetails1.length - 2],
            // addressDetails1.length > 2
            //   ? addressDetails1[1]
            //   : addressDetails1[0],
            src_country: addressDetails1[addressDetails1.length - 1],
            // addressDetails1.length > 2
            //   ? addressDetails1[2]
            //   : addressDetails1[1],
          };
        } catch (err) {
          console.error(err);
        }
        console.log("after processing google", result1);
        return { index, result1 };
      })
    );

    // destLatLongArr.sort((a, b) => a.index - b.index);
    destLatLongArr = destLatLongArr.map((item) => item.result1);

    let srcLatLongArr = await Promise.all(
      val[0].sources.map(async (add, index) => {
        let result = {};
        const addressDetails = add.split(",");
        try {
          const res1 = await geocoder.geocode({ address: add });
          result = {
            lat: res1.results[0].geometry.location.lat(),
            lng: res1.results[0].geometry.location.lng(),
            src_city:
              addressDetails.length > 2
                ? addressDetails.slice(0, -2).join(", ")
                : addressDetails[0],
            src_state: addressDetails[addressDetails.length - 2],

            // addressDetails.length > 2 ? addressDetails[1] : addressDetails[0],
            src_country: addressDetails[addressDetails.length - 1],
            // addressDetails.length > 2 ? addressDetails[2] : addressDetails[1],
          };
        } catch (err) {
          console.error(err);
        }
        console.log("after processing google", result);
        return { index, result };
      })
    );

    // srcLatLongArr.sort((a, b) => a.index - b.index);
    srcLatLongArr = srcLatLongArr.map((item) => item.result);
    if (waypts.length >= 1) {
      if (optimizeRoute) {
        haversine_distance(srcLatLongArr, destLatLongArr);
      } else {
        var unoptimized = [];
        destLatLongArr.map((value, index) => {
          let dest = {
            lat: value.lat,
            lng: value.lng,
          };
          unoptimized.push(dest);
        });
        setMulDestination(unoptimized);
      }
    }

    console.log("SRC ARR", srcLatLongArr);
    let test_val = srcLatLongArr;
    console.log("DEST ARR", destLatLongArr);
    // Compare arrays using a custom function

    const obj = { load_source: srcLatLongArr, load_dest: destLatLongArr };
    console.log(">>>>>>>>>>>>", obj);

    // tempArr.push(deepCopy);
    props.setMapSource(obj, srcLatLongArr, destLatLongArr, eta);

    // tempArr = [];

    console.log("after processing", [
      { sources: srcLatLongArr, destination: destLatLongArr },
    ]);
    srcLatLongArr = [];
    destLatLongArr = [];
  }

  const center = useMemo(() => ({ lat: 23.08, lng: 88.5293 }), []);
  const { isLoaded, loadError, loadSuccess } = useLoadScript({
    googleMapsApiKey: gogapi,
    libraries: libs,
  });
  async function calculateRoute() {
    console.log("origin destination", originRef.current?.value);
    // setAccordianExpanded(false);
    console.log("origin", originRef.current?.value, destiantionRef?.current);
    if (
      originRef.current?.value === "" ||
      destiantionRef.current?.value === ""
    ) {
      let responseArray_updated = [
        {
          sources:
            waypts.length > 0
              ? [
                  originRef.current?.value,
                  ...Object.keys(multipleOrginValues).map(
                    (i) => multipleOrginValues[i]
                  ),
                ]
              : [originRef.current?.value],
          destination:
            waypts.length > 0
              ? [
                  destiantionRef.current.value,
                  ...Object.keys(multipleDestinationValues).map(
                    (i) => multipleDestinationValues[i]
                  ),
                ]
              : [destiantionRef.current?.value],
        },
      ];
      addressToLatLng(responseArray_updated, "2 hour");

      return;
    }
    console.log(
      "multipleOrginValues",
      ...Object.keys(multipleOrginValues).map((i) => multipleOrginValues[i])
    );
    let responseArray = [
      {
        sources:
          waypts.length > 0
            ? [
                originRef.current?.value,
                ...Object.keys(multipleOrginValues).map(
                  (i) => multipleOrginValues[i]
                ),
              ]
            : [originRef.current?.value],
        destination:
          waypts.length > 0
            ? [
                destiantionRef.current.value,
                ...Object.keys(multipleDestinationValues).map(
                  (i) => multipleDestinationValues[i]
                ),
              ]
            : [destiantionRef.current?.value],
      },
    ];

    console.log("ResponseArray", waypts.length);

    const directionsService = new window.google.maps.DirectionsService();
    let results = null;
    if (waypts.length > 0) {
      if (optimizeRoute) {
        console.log(
          "optimized routes",
          mulDestination,
          mulDestination[Object.keys(mulDestination).length - 1]
        );
        if (distanceOptimized) {
          let keys = Object.keys(mulDestination);
          let newWaypts = keys.slice(0, -1).map((key) => {
            let point = mulDestination[key];
            return {
              location: {
                lat: point.lat,
                lng: point.lng,
              },
              stopover: true,
            };
          });
          console.log("newWaypts", newWaypts);
          results = await directionsService.route({
            origin: originRef.current.value,
            destination: mulDestination[Object.keys(mulDestination).length - 1],
            // eslint-disable-next-line no-undef
            waypoints: newWaypts,
            travelMode: window.google.maps.TravelMode.DRIVING,
          });
        }
      } else {
        results = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          waypoints: waypts,
          travelMode: window.google.maps.TravelMode.DRIVING,
          // optimizeWaypoints: true,
        });
      }
    } else {
      console.log("waypts", waypts);
      results = await directionsService.route({
        origin: originRef.current?.value,
        destination: destiantionRef.current?.value,

        travelMode: window.google.maps.TravelMode.DRIVING,
      });
    }

    console.log("directionResult", results);
    console.log("estimated time", results.routes[0].legs[0].duration.value);
    await addressToLatLng(
      responseArray,
      results.routes[0].legs[0].duration.text
    );
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }
  function handledestinationValue(event) {
    setDestinationValue(event.target.value);
    setOptimizedRoute(false);
    setDistanceOptimized(false);
  }
  function handleSourceValue(event) {
    console.log("handleSourceValue");
    console.log("in key onchange");
    props.originSelected ? props.originSelected(false) : null;
    setSourceValue(originRef.current.value);
    setOptimizedRoute(false);
  }
  function handleMultipleSourceValues(event, index) {
    const updatedOriginVal = { ...multipleOrginValues };
    console.log("updated mutipleorigin", updatedOriginVal);
    updatedOriginVal[index] = sourceAutomCompleteRefs.current[index].value;
    setMultipleOrginValues(updatedOriginVal);
    setOptimizedRoute(false);
    setDistanceOptimized(false);
  }
  useEffect(() => {
    // this useeffect only works when source is populated from branch address
    console.log("myUseeffect");
    if (originRef.current) {
      if (originRef.current.value !== "") {
        handleOrigin(0);
      }
    }
  }, [sourceValue]);
  function clearRoute(val) {
    if (val === 1) {
      setDirectionsResponse(null);
      setDistance("");
      setDuration("");
      originRef.current.value = "";
      setSourceValue("");
      setOrigin({});
      calculateRoute();
    } else if (val === 2) {
      setDirectionsResponse(null);
      setDistance("");
      setDuration("");
      destiantionRef.current.value = "";
      setDestinationValue("");

      setDestination({});
      calculateRoute();
    } else {
      setDirectionsResponse(null);
      setDistance("");
      setDuration("");
      // originRef.current.value = "";
      destiantionRef.current.value = "";
      // setSourceValue("");
      setDestinationValue("");
      // setOrigin({});
      setDestination({});
    }
  }

  function removeMulSources(index) {
    console.log("index in source", index);
    if (mutipleSourceInput.length - 1 >= index) {
      mutipleSourceInput.splice(index, 1);
      console.log("here the index", mulSource, index);
      delete mulSource[index];
      console.log("here the index", mulSource, index);

      delete multipleOrginValues[index];
      console.log("before removing waypts", waypts);
      waypts.splice(index, 1);
      console.log("after removing waypts", waypts);
      setWaypts([...waypts]);
      setmutipleSourceInput([...mutipleSourceInput]);

      calculateRoute();
    }
  }
  function RemoveSourceDes(index) {
    console.log("index", index, mutipleDestinationInput);
    if (mutipleDestinationInput.length - 1 >= index) {
      mutipleDestinationInput.splice(index, 1);
      delete multipleDestinationValues[index];
      delete mulDestination[index];
      setMultipleDestinationValues(multipleDestinationValues);
      setmutipleDestinationInput([...mutipleDestinationInput]);
      waypts.splice(index, 1);
      console.log("after removing waypts", waypts);
      setWaypts([...waypts]);
      calculateRoute();
    }
  }
  function RemoveSource(index) {
    console.log("index in source", index, mutipleSourceInput);
    if (mutipleSourceInput.length - 1 >= index) {
      mutipleSourceInput.splice(index, 1);
      console.log("after source", mutipleSourceInput);
      delete multipleOrginValues[index];
      delete mulSource[index];
      setMultipleOrginValues(multipleOrginValues);
      setmutipleSourceInput([...mutipleSourceInput]);
      waypts.splice(index, 1);
      console.log("after removing waypts", waypts);
      setWaypts([...waypts]);
      calculateRoute();
    }
  }
  const handleSourceChanged = (index) => {
    const selectedPlace = sourceAutomCompleteRefs.current[index].value;
    // Use the appropriate ref from the array
    const updatedOriginVal = { ...multipleOrginValues };
    console.log("updated mutipleorigin", updatedOriginVal);
    updatedOriginVal[index] = sourceAutomCompleteRefs.current[index].value;
    setMultipleOrginValues(updatedOriginVal);
    console.log("selected", selectedPlace);
    handleOriginValues(index, selectedPlace);
  };
  useEffect(() => {
    if (isLoaded) {
      console.log("sorces and desination", props.viewSrcDest);
      let multipleOriginWaypts = props.viewSrcDest?.src.slice(1);
      let multipleDestinationWaypts = props.viewSrcDest?.dest.slice(1);
      let originWaypts = {};
      let destinationWaypts = {};
      multipleOriginWaypts?.map((val, index) => {
        originWaypts[index] = val;
        handleOriginValues(index, val);
      });
      multipleDestinationWaypts?.map((val, index) => {
        destinationWaypts[index] = val;
        handleDestinationValues(index, val);
      });
      console.log("originWaypts", originWaypts);

      setMultipleOrginValues(originWaypts);
      const sourceInput = Array(Object.keys(originWaypts).length).fill("");
      setmutipleSourceInput(sourceInput);

      console.log("destinationWaypts", destinationWaypts);
      const destinationInput = Array(
        Object.keys(destinationWaypts).length
      ).fill("");

      setMultipleDestinationValues(destinationWaypts);
      setmutipleDestinationInput(destinationInput);
    }
  }, [isLoaded]);

  useEffect(() => {
    console.log("useEffect 5");
    console.log("src dest coming", props.viewSrcDest);
    console.log("destination ref", destiantionRef);

    if (destiantionRef.current) {
      const destinationValue = destiantionRef.current.value;
      if (destinationValue !== "") {
        calculateRoute();
        handleOrigin(1);
        handleDestination();
      }
    }
  }, [destiantionRef.current]);

  useEffect(() => {
    console.log("useEffect 6", mutipleSourceInput);
    setMulSource({ ...mulSource });
  }, [mutipleSourceInput]);

  return (
    <>
      {isLoaded ? (
        <>
          <style>
            {`
          .pac-container, .pac-item {
            z-index: 2147483647 !important;
          }
        `}
          </style>
          {console.log("props", props.viewSrcDest)}
          <GoogleMap
            mapContainerStyle={{
              width: props.mapfullScreen ? "98vw" : "100%",
              height: props.mapfullScreen ? "90vh" : "77vh",
            }}
            center={center}
            options={{ fullscreenControl: false }}
            zoom={9}
          >
            {props.accordianDisabled ? (
              <Accordion
                style={{
                  position: "relative",
                  top: "58px",
                  margin: "6px",
                  display: "none",
                }}
                expanded={accordianExpanded}
                disabled={props.accordianDisabled}
                onChange={(event, expanded) => {
                  console.log("expanded", setAccordianExpanded(expanded));
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Enter Source & Destination</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item md={5}>
                        <Autocomplete
                          onPlaceChanged={() => handleOrigin(1)}
                          restrictions={{ country: "ind" }}
                        >
                          <div style={{ display: "flex" }}>
                            <IconButton onClick={addmutipleSourceInput}>
                              <AddCircleIcon sx={{ color: "#065AD8" }} />
                            </IconButton>

                            <Typography sx={{ marginTop: "9px" }}>
                              1.
                            </Typography>

                            <input
                              type="text"
                              name="origin"
                              className="mapinput"
                              placeholder="Source 1"
                              ref={originRef}
                              // value={
                              //   props.viewSrcDest
                              //     ? props.viewSrcDest["src"][0]
                              //     : null
                              // }
                              onChange={handleSourceValue}
                              value={sourceValue}
                              style={{ marginLeft: "4px" }}
                            />
                          </div>
                        </Autocomplete>
                      </Grid>

                      <Grid item md={5}>
                        <Autocomplete
                          onPlaceChanged={() => handleDestination()}
                          restrictions={{ country: "ind" }}
                        >
                          <div style={{ display: "flex" }}>
                            <Typography sx={{ marginTop: "9px" }}>
                              1.
                            </Typography>
                            <input
                              type="text"
                              name="destination"
                              className="mapinput"
                              placeholder="Destination 1"
                              style={{ marginLeft: "4px" }}
                              // value={
                              //   props.viewSrcDest
                              //     ? props.viewSrcDest["dest"][0]
                              //     : ""
                              // }
                              onChange={handledestinationValue}
                              value={destinationValue}
                              ref={destiantionRef}
                            />
                            <IconButton onClick={addmutipleDestinationInput}>
                              <AddCircleIcon sx={{ color: "#065AD8" }} />
                            </IconButton>
                          </div>
                        </Autocomplete>
                      </Grid>

                      {/* <Grid item md={2}>
                        <IconButton onClick={clearRoute}>
                          <HighlightOffTwoToneIcon sx={{ color: "#DE3163" }} />{" "}
                        </IconButton>
                      </Grid> */}

                      <Grid item md={5}>
                        {console.log("multiple", mutipleSourceInput)}
                        {mutipleSourceInput.map((fields, index) => (
                          <Grid
                            container
                            key={index}
                            sx={{ marginBottom: "15px" }}
                          >
                            <Grid item md={1} sx={{ marginRight: "17px" }}>
                              <IconButton onClick={addmutipleSourceInput}>
                                <AddCircleIcon sx={{ color: "#065AD8" }} />
                              </IconButton>
                            </Grid>
                            <Typography sx={{ marginTop: "9px" }}>{`${
                              index + 2
                            }. `}</Typography>
                            <Grid item md={9}>
                              <Autocomplete
                                restrictions={{ country: "ind" }}
                                onPlaceChanged={() =>
                                  handleSourceChanged(index)
                                }
                              >
                                <input
                                  type="text"
                                  name="mulorigin"
                                  className="mapinput"
                                  placeholder={`Source ${index + 2}`}
                                  onChange={(e) => {
                                    handleMultipleSourceValues(e, index);
                                  }}
                                  value={multipleOrginValues[index]}
                                  // style={{ marginRight: "4px" }}
                                  ref={(ref) =>
                                    (sourceAutomCompleteRefs.current[index] =
                                      ref)
                                  }
                                />
                              </Autocomplete>
                            </Grid>
                            <Grid item md={1}>
                              {props.viewSrcDest ? (
                                props.viewSrcDest.src.length > 0 ? null : (
                                  <IconButton
                                    onClick={() => removeMulSources(index)}
                                  >
                                    <HighlightOffTwoToneIcon
                                      sx={{ color: "#DE3163" }}
                                    />{" "}
                                  </IconButton>
                                )
                              ) : (
                                <IconButton
                                  onClick={() => removeMulSources(index)}
                                >
                                  <HighlightOffTwoToneIcon
                                    sx={{ color: "#DE3163" }}
                                  />{" "}
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>

                      <Grid item md={5}>
                        {mutipleDestinationInput.map((fields, index) => (
                          <Grid
                            container
                            key={index}
                            sx={{ marginBottom: "15px" }}
                            spacing={2}
                          >
                            <Typography sx={{ marginTop: "29px" }}>{`${
                              index + 2
                            }. `}</Typography>
                            <Grid item md={9}>
                              <Autocomplete
                                restrictions={{ country: "ind" }}
                                onPlaceChanged={() =>
                                  handleDestinationChanged(index)
                                }
                              >
                                <input
                                  type="text"
                                  name="muldestination"
                                  className="mapinput"
                                  placeholder={`Destination ${index + 2}`}
                                  value={multipleDestinationValues[index]}
                                  onChange={(e) => {
                                    handleMultipleDestinationValue(e, index);
                                  }}
                                  // style={{ marginRight: "4px" }}
                                  ref={(ref) =>
                                    (destinationAutoCompleteRefs.current[
                                      index
                                    ] = ref)
                                  }
                                />
                              </Autocomplete>
                            </Grid>
                            <Grid item md={1}>
                              <IconButton onClick={addmutipleDestinationInput}>
                                <AddCircleIcon sx={{ color: "#065AD8" }} />
                              </IconButton>
                            </Grid>
                            {props.viewSrcDest ? (
                              props.viewSrcDest.dest.length > 0 ? (
                                <Grid item md={1} sx={{ marginLeft: "10px" }}>
                                  <IconButton
                                    onClick={() => RemoveSourceDes(index)}
                                  >
                                    <HighlightOffTwoToneIcon
                                      sx={{ color: "#DE3163" }}
                                    />{" "}
                                  </IconButton>
                                </Grid>
                              ) : null
                            ) : (
                              <Grid item md={1} sx={{ marginLeft: "10px" }}>
                                <IconButton
                                  onClick={() => RemoveSourceDes(index)}
                                >
                                  <HighlightOffTwoToneIcon
                                    sx={{ color: "#DE3163" }}
                                  />{" "}
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        ))}
                      </Grid>

                      {/* <Grid item md={2}>
                      {mutipleSourceInput.length >
                      mutipleDestinationInput.length
                        ? mutipleSourceInput.map((val, index) => (
                            <Grid
                              container
                              key={index}
                              sx={{ marginBottom: "18px" }}
                            >
                              <Grid item md={12}>
                                <IconButton
                                  onClick={() => RemoveSourceDes(index)}
                                >
                                  <HighlightOffTwoToneIcon
                                    sx={{ color: "#DE3163" }}
                                  />{" "}
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))
                        : mutipleDestinationInput.map((val, index) => (
                            <Grid
                              container
                              key={index}
                              sx={{ marginBottom: "18px" }}
                            >
                              <Grid item md={12}>
                                <IconButton
                                  onClick={() => RemoveSourceDes(index)}
                                >
                                  <HighlightOffTwoToneIcon
                                    sx={{ color: "#DE3163" }}
                                  />{" "}
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                    </Grid> */}
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ) : (
              <Accordion
                sx={{
                  position: "relative",
                  top: "58px",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  transition: "background-color 0.5s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                  },
                }}
                mx={2}
                expanded={accordianExpanded}
                onChange={(event, expanded) => {
                  console.log("expanded", setAccordianExpanded(expanded));
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{ color: "white" }}>
                    Enter Source & Destination
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Grid container justifyContent="center">
                      <Grid item md={4}>
                        <div>
                          <Autocomplete
                            onPlaceChanged={() => handleOrigin(1)}
                            restrictions={{ country: "ind" }}
                          >
                            {/* <Typography
                            // sx={{ marginTop: "9px", color: "white" }}
                            >
                              1.
                            </Typography> */}

                            <input
                              type="text"
                              name="origin"
                              className="mapinput"
                              placeholder="Source 1"
                              ref={originRef}
                              // value={
                              //   props.viewSrcDest
                              //     ? props.viewSrcDest["src"][0]
                              //     : null
                              // }
                              onChange={handleSourceValue}
                              value={sourceValue}
                              // style={{ marginLeft: "4px" }}
                            />
                          </Autocomplete>
                        </div>
                      </Grid>
                      <Grid item md={1}>
                        <IconButton onClick={addmutipleSourceInput}>
                          <AddCircleIcon color="primary" />
                        </IconButton>
                      </Grid>
                      <Grid item md={1}>
                        <IconButton onClick={() => clearRoute(1)}>
                          <HighlightOffTwoToneIcon color="error" />
                        </IconButton>
                      </Grid>

                      <Grid item md={4}>
                        <Autocomplete
                          onPlaceChanged={() => handleDestination()}
                          restrictions={{ country: "ind" }}
                        >
                          {/* <Typography
                            // sx={{ marginTop: "9px", color: "white" }}
                            >
                              1.
                            </Typography> */}
                          <input
                            type="text"
                            name="destination"
                            className="mapinput"
                            placeholder="Destination 1"
                            // style={{ marginLeft: '4px' }}
                            // value={
                            //   props.viewSrcDest
                            //     ? props.viewSrcDest["dest"][0]
                            //     : ""
                            // }
                            onChange={handledestinationValue}
                            value={destinationValue}
                            ref={destiantionRef}
                          />
                        </Autocomplete>
                      </Grid>
                      <Grid item md={1}>
                        <IconButton onClick={addmutipleDestinationInput}>
                          <AddCircleIcon color="primary" />
                        </IconButton>
                      </Grid>

                      <Grid item md={1}>
                        <IconButton onClick={() => clearRoute(2)}>
                          <HighlightOffTwoToneIcon color="error" />{" "}
                        </IconButton>
                      </Grid>

                      <Grid item md={6}>
                        {console.log(
                          "here",
                          multipleOrginValues,
                          multipleDestinationValues,
                          mutipleSourceInput
                        )}
                        {mutipleSourceInput.map((fields, index) => (
                          <Grid
                            container
                            key={index}
                            my={1}
                            // sx={{ marginBottom: '15px', marginRight: '15px' }}
                          >
                            {/* <Typography
                            // sx={{ marginTop: '9px', color: 'white' }}
                            >{`${index + 2}. `}</Typography> */}
                            <Grid item md={8}>
                              {console.log(
                                "in the loop",
                                typeof multipleOrginValues[index]
                              )}
                              <Autocomplete
                                restrictions={{ country: "ind" }}
                                onPlaceChanged={() =>
                                  handleSourceChanged(index)
                                }
                              >
                                <input
                                  type="text"
                                  name="mulorigin"
                                  className="mapinput"
                                  placeholder={`Source ${index + 2}`}
                                  onChange={(e) => {
                                    handleMultipleSourceValues(e, index);
                                  }}
                                  value={
                                    typeof multipleOrginValues[index] ===
                                    "undefined"
                                      ? ""
                                      : multipleOrginValues[index]
                                  }
                                  // style={{ marginRight: "4px" }}
                                  ref={(ref) =>
                                    (sourceAutomCompleteRefs.current[index] =
                                      ref)
                                  }
                                />
                              </Autocomplete>
                            </Grid>
                            <Grid
                              item
                              md={2}
                              // sx={{ marginRight: '17px' }}
                            >
                              <IconButton onClick={addmutipleSourceInput}>
                                <AddCircleIcon color="primary" />
                              </IconButton>
                            </Grid>
                            <Grid item md={2}>
                              {props.viewSrcDest ? (
                                props.viewSrcDest.src.length > 0 ? (
                                  <Grid
                                    item
                                    md={2}
                                    // sx={{ marginLeft: '10px' }}
                                  >
                                    <IconButton
                                      onClick={() => RemoveSource(index)}
                                    >
                                      <HighlightOffTwoToneIcon color="error" />{" "}
                                    </IconButton>
                                  </Grid>
                                ) : null
                              ) : (
                                <Grid
                                  item
                                  md={2}
                                  // sx={{ marginLeft: '10px' }}
                                >
                                  <IconButton
                                    onClick={() => RemoveSource(index)}
                                  >
                                    <HighlightOffTwoToneIcon color="error" />{" "}
                                  </IconButton>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>

                      <Grid item md={6}>
                        {mutipleDestinationInput.map((fields, index) => (
                          <Grid
                            container
                            key={index}
                            my={1}
                            // sx={{ marginBottom: '15px' }}
                            // spacing={2}
                          >
                            {/* <Typography
                            // sx={{ marginTop: '29px', color: 'white' }}
                            >{`${index + 2}. `}</Typography> */}
                            <Grid item md={8}>
                              <Autocomplete
                                restrictions={{ country: "ind" }}
                                onPlaceChanged={() =>
                                  handleDestinationChanged(index)
                                }
                              >
                                <input
                                  type="text"
                                  name="muldestination"
                                  className="mapinput"
                                  placeholder={`Destination ${index + 2}`}
                                  value={
                                    typeof multipleDestinationValues[index] ===
                                    "undefined"
                                      ? ""
                                      : multipleDestinationValues[index]
                                  }
                                  onChange={(e) => {
                                    handleMultipleDestinationValue(e, index);
                                  }}
                                  // style={{ marginRight: "4px" }}
                                  ref={(ref) =>
                                    (destinationAutoCompleteRefs.current[
                                      index
                                    ] = ref)
                                  }
                                />
                              </Autocomplete>
                            </Grid>
                            <Grid item md={2}>
                              <IconButton onClick={addmutipleDestinationInput}>
                                <AddCircleIcon color="primary" />
                              </IconButton>
                            </Grid>
                            {props.viewSrcDest ? (
                              props.viewSrcDest.dest.length > 0 ? (
                                <Grid
                                  item
                                  md={2}
                                  // sx={{ marginLeft: '10px' }}
                                >
                                  <IconButton
                                    onClick={() => RemoveSourceDes(index)}
                                  >
                                    <HighlightOffTwoToneIcon color="error" />{" "}
                                  </IconButton>
                                </Grid>
                              ) : null
                            ) : (
                              <Grid
                                item
                                md={2}
                                //  sx={{ marginLeft: '10px' }}
                              >
                                <IconButton
                                  onClick={() => RemoveSourceDes(index)}
                                >
                                  <HighlightOffTwoToneIcon color="error" />{" "}
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        ))}
                      </Grid>

                      {/* <Grid item md={2}>
                      {mutipleSourceInput.length >
                      mutipleDestinationInput.length
                        ? mutipleSourceInput.map((val, index) => (
                            <Grid
                              container
                              key={index}
                              sx={{ marginBottom: "18px" }}
                            >
                              <Grid item md={12}>
                                <IconButton
                                  onClick={() => RemoveSourceDes(index)}
                                >
                                  <HighlightOffTwoToneIcon
                                    sx={{ color: "#DE3163" }}
                                  />{" "}
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))
                        : mutipleDestinationInput.map((val, index) => (
                            <Grid
                              container
                              key={index}
                              sx={{ marginBottom: "18px" }}
                            >
                              <Grid item md={12}>
                                <IconButton
                                  onClick={() => RemoveSourceDes(index)}
                                >
                                  <HighlightOffTwoToneIcon
                                    sx={{ color: "#DE3163" }}
                                  />{" "}
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                    </Grid> */}
                    </Grid>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
            {console.log("fullscreen in map", props.mapfullScreen)}
            {props.mapfullScreen ? (
              <>
                <style>
                  {`
                .pac-container, .pac-item {
                  z-index: 2147483647 !important;
                }
              `}
                </style>
                <IconButton
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "2%", // Adjust the position as needed
                  }}
                  onClick={() => {
                    props.handleFullScreen(0);
                  }}
                >
                  <FullscreenExitIcon fontSize="large" />
                </IconButton>
              </>
            ) : (
              <IconButton
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "2%", // Adjust the position as needed
                }}
                onClick={() => {
                  props.handleFullScreen(1);
                }}
              >
                <FullscreenIcon fontSize="large" />
              </IconButton>
            )}
            {props.optimization ? (
              <FormGroup
                sx={{
                  position: "absolute",
                  top: "25px",
                  right: "10%",
                  backgroundColor: "#065AD8",
                  color: "white",
                  borderRadius: "10px",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      onChange={() => setOptimizedRoute(!optimizeRoute)}
                      color="success"
                    />
                  }
                  label="Route optimization"
                  labelPlacement="start"
                />
              </FormGroup>
            ) : null}

            {/* <IconButton
              style={{
                position: "absolute",
                top: "20px",
                right: "20px", // Adjust the position as needed
              }}
              onClick={() => {
                setIsFullScreen(true);
                props.handleFullScreen(1)}}
                
            >
              <FullscreenIcon />
            </IconButton> */}

            {console.log("mulSource", mulSource)}
            {Object.keys(origin).length !== 0 ? (
              <Marker
                position={origin}
                label={{ text: "S1", color: "white" }}
                onClick={(e) => reverseGeocoding(e)}
              />
            ) : null}
            {/* {Object.keys(mulDestination).length !== 0 ? null : Object.keys(
                destination
              ).length !== 0 ? (
              <Marker
                position={destination}
                label={{ text: "D1", color: "white" }}
              />
            ) : null} */}
            {/* {Object.keys(destination).length !== 0 ? (
              <Marker
                position={destination}
                label={{ text: "D1", color: "white" }}
              />
            ) : null} */}
            {/* {Object.keys(mulSource).length !== 0
              ? Object.values(mulSource).map((val, index) => (
                  <Marker
                    position={val}
                    label={{ text: `S${index + 2}`, color: "white" }}
                  />
                ))
              : null}
            {Object.keys(mulDestination).length !== 0
              ? Object.values(mulDestination).map((val, index) => (
                  <Marker
                    position={val}
                    label={{ text: `D${index + 1}`, color: "white" }}
                  />
                ))
              : null} */}
            {console.log("here again it is coming", directionsResponse)}
            {markerClicked && (
              <InfoWindow
                ref={infowindowRef}
                position={infowWindowPostion}
                onCloseClick={(e) => {
                  console.log("here", e);
                  setMarkerClicked(false);
                }}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -38),
                }}
              >
                <div>
                  {" "}
                  <Typography sx={{ color: "#FF0000" }} variant="h5">
                    Address
                  </Typography>
                  <Typography variant="p">{alertContent}</Typography>
                </div>
              </InfoWindow>
            )}
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  suppressMarkers: false,
                  polylineOptions: { strokeColor: "#1AA16B" },
                }}
              />
            )}
          </GoogleMap>
        </>
      ) : null}
    </>
  );
}
