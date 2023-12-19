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
import { Grid, Typography } from "@mui/material";

export default function GoogleMapEpod(props) {
  var heading = 0;
  const gogapi = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const libs = ["places", "drawing"];
  const center = useMemo(() => ({ lat: 23.08, lng: 88.5293 }), []);
  const destination = useMemo(() => ({ lat: 28.7041, lng: 77.1025 }), []);
  const mirzapur = useMemo(
    () => ({ location: { lat: 25.133699, lng: 82.56443 } }),
    []
  );
  const [directions, setDirections] = useState(null);
  const [viaDirections, setViaDirections] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [viaRouteCoordinates, setViaRouteCoordinates] = useState([]);
  const [passedRoutes, setPassesdRoutes] = useState([]);
  const [alertContent, setAlertContent] = useState("");
  const [markerClicked, setMarkerClicked] = useState(false);
  const [customMarker, setCustomMarker] = useState({
    path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
    fillColor: "red",
    fillOpacity: 2,
    strokeWeight: 1,
    rotation: 0,
    scale: 1,
  });
  const defaultOptions = {
    strokeOpacity: 0.5,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
  };
  const closeOptions = {
    ...defaultOptions,
    zIndex: 3,
    fillOpacity: 0.05,
    strokeColor: "#8BC34A",
    fillColor: "#8BC34A",
  };
  const middleOptions = {
    ...defaultOptions,
    zIndex: 2,
    fillOpacity: 0.05,
    strokeColor: "#FBC02D",
    fillColor: "#FBC02D",
  };
  const farOptions = {
    ...defaultOptions,
    zIndex: 1,
    fillOpacity: 0.05,
    strokeColor: "#FF5252",
    fillColor: "#FF5252",
  };

  const { isLoaded, loadError, loadSuccess } = useLoadScript({
    googleMapsApiKey: gogapi,
    libraries: libs,
  });
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
    });
  }
  useEffect(() => {
    if (isLoaded) {
      console.log("here 1", props.mapData);
      const directionsService = new window.google.maps.DirectionsService();
      const newDirectionsService = new window.google.maps.DirectionsService();
      newDirectionsService.route(
        {
          origin: center,
          destination: destination,
          waypoints: [mirzapur],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log("here via route", result);
            setViaDirections(result);
            const coordinates = [];
            result.routes[0].legs[0].steps.forEach((step) => {
              step.path.forEach((point) => {
                coordinates.push({ lat: point.lat(), lng: point.lng() });
              });
            });

            // heading = window.google.maps.geometry.spherical.computeHeading(
            //   coordinates[18998],
            //   coordinates[18999]
            // );
            // console.log("heading", heading);
            // customMarker.rotation = heading;

            console.log("Route Coordinates:", coordinates);

            setViaRouteCoordinates(coordinates);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );

      directionsService.route(
        {
          origin: props.mapData?.src ? props.mapData.src : center,
          destination: props.mapData?.dest ? props.mapData.dest : destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log("here");
            setDirections(result);
            const coordinates = [];
            result.routes[0].legs[0].steps.forEach((step) => {
              step.path.forEach((point) => {
                coordinates.push({ lat: point.lat(), lng: point.lng() });
              });
            });

            heading = window.google.maps.geometry.spherical.computeHeading(
              coordinates[20998],
              coordinates[20999]
            );
            const passedPath = coordinates.slice(0, 20998);

            console.log("heading", heading);
            customMarker.rotation = heading;
            customMarker.anchor = new window.google.maps.Point(20, 30);

            console.log("Route Coordinates:", coordinates);
            console.log("passed ", passedPath);
            setPassesdRoutes(passedPath);
            setRouteCoordinates(coordinates);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  }, [center, destination, isLoaded]);

  return (
    <>
      {console.log("marker", customMarker)}
      {isLoaded ? (
        <>
          <Grid container sx={{ height: "250px" }}>
            <Grid item md={12}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "30vh" }}
                center={center}
                zoom={9}
              >
                {console.log("directions", directions)}
                {/* {viaDirections !== null && (
                  <>
                    <DirectionsRenderer
                      directions={viaDirections}
                      options={{
                        polylineOptions: { strokeColor: "#FF0000" },
                        markerOptions: { visible: false },
                      }}
                    />
                  </>
                )} */}
                {directions !== null && (
                  <>
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        polylineOptions: { strokeColor: "#000000" },
                        markerOptions: {
                          animation: window.google.maps.Animation.DROP,
                        },
                      }}
                    />
                  </>
                )}
              </GoogleMap>
            </Grid>
          </Grid>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
