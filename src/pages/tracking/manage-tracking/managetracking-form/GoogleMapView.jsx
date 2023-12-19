import React, {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
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
} from '@react-google-maps/api';
import { Grid, Typography } from '@mui/material';
import truck from '../../../../assets/truck.svg';
import truckpng from '../../../../assets/truck.png';
import truckImage from '../../../../assets/TruckImage.svg';

export default function GoogleMapView(props) {
  var heading = 0;
  const gogapi = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const libs = ['places', 'drawing'];
  const center = useMemo(() => ({ lat: 23.08, lng: 88.5293 }), []);
  const destination = useMemo(() => ({ lat: 28.7041, lng: 77.1025 }), []);
  const mirzapur = useMemo(
    () => ({
      location: {
        lat: props.fleet[0].current_lat,
        lng: props.fleet[0].current_long,
      },
    }),
    []
  );
  const infowindowRef = useRef(null);
  const [inforefs, setInfforefs] = useState(infowindowRef);
  const [directions, setDirections] = useState(null);
  const [viaDirections, setViaDirections] = useState(null);
  const [RemainingRoutes, setRemainingRoutes] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [viaRouteCoordinates, setViaRouteCoordinates] = useState([]);
  const [passedRoutes, setPassedRoutes] = useState([]);
  const [alertContent, setAlertContent] = useState('');
  const [markerClicked, setMarkerClicked] = useState(false);
  const [infowWindowPostion, setInfoWindowPostion] = useState({});
  const [customMarker, setCustomMarker] = useState({
    path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
    fillColor: 'red',
    fillOpacity: 2,
    strokeWeight: 1,
    rotation: 0,
    scale: 1,
  });
  // const [customMarker, setCustomMarker] = useState({
  //   path: "M5 26.9v-3.5l2-1v3.5zM3 28.4l13.1-7.5L44 35l-14 7zM25.5 32.8c-.7-.4-1.4-.4-1.9-.2l-1.4.7c-.5.2-.9.8-.9 1.6 0 1.5 1.3 3.4 2.8 4.2.8.4 1.5.4 2 .2 0 0 1.4-.7 1.5-.8.5-.3.7-.8.7-1.5 0-1.6-1.3-3.5-2.8-4.2zM26 39.2c.2-.1 1.4-.7 1.5-.7.5-.3.7-.8.7-1.5 0-.6-.2-1.3-.5-1.9l-1.4.7c.3.6.5 1.3.5 1.9.1.7-.3 1.3-.8 1.5zM26.1 37.3c0 1.2-.9 1.6-2.1 1-1.2-.6-2.1-2-2.1-3.2s.9-1.6 2.1-1c1.2.6 2.1 2 2.1 3.2zM24.2 38.3c-1.2-.6-2.1-2-2.1-3.2 0-.6.2-1 .6-1.2-.5.1-.8.6-.8 1.2 0 1.2.9 2.6 2.1 3.2.6.3 1.1.3 1.5.1-.3.2-.8.2-1.3-.1zM25.1 36.6c0 .5-.4.7-.9.4s-.9-.8-.9-1.3.4-.7.9-.4.9.8.9 1.3zM25.1 36.6c0 .5-.4.7-.9.4s-.9-.8-.9-1.3.4-.7.9-.4.9.8.9 1.3zM26.9 37.7c0 1.5-1.3 2.2-2.8 1.4-1.5-.8-2.8-2.7-2.8-4.2 0-1.5 1.3-2.2 2.8-1.4 1.5.7 2.8 2.6 2.8 4.2zM8.9 24.5c-.7-.4-1.4-.4-1.9-.2l-1.4.7c-.5.2-.9.8-.9 1.6 0 1.5 1.3 3.4 2.8 4.2.8.4 1.5.4 2 .2 0 0 1.4-.7 1.5-.8.5-.3.7-.8.7-1.5.1-1.5-1.2-3.4-2.8-4.2zM9.5 31c.2-.1 1.4-.7 1.5-.7.5-.3.7-.8.7-1.5 0-.6-.2-1.3-.5-1.9l-1.4.7c.3.6.5 1.3.5 1.9.1.7-.3 1.2-.8 1.5zM9.6 29.1c0 1.2-.9 1.6-2.1 1s-2.1-2-2.1-3.2.9-1.6 2.1-1c1.2.6 2.1 2 2.1 3.2zM7.7 30c-1.2-.6-2.1-2-2.1-3.2 0-.6.2-1 .6-1.2-.5.1-.8.6-.8 1.2 0 1.2.9 2.6 2.1 3.2.6.3 1.1.3 1.5.1-.3.2-.8.2-1.3-.1zM8.6 28.4c0 .5-.4.7-.9.4s-.9-.8-.9-1.3.4-.7.9-.4.9.8.9 1.3zM8.6 28.4c0 .5-.4.7-.9.4s-.9-.8-.9-1.3.4-.7.9-.4.9.8.9 1.3zM10.4 29.4c0 1.5-1.3 2.2-2.8 1.4-1.6-.8-2.8-2.6-2.8-4.2 0-1.5 1.3-2.2 2.8-1.4 1.5.8 2.8 2.7 2.8 4.2zM5 11.9l14-7 6 3v13.8l-13.9 7c-.2-.7-.6-1.4-1.1-2.1-1.5-1.8-3.6-2.5-4.8-1.5-.5.4-.7 1-.8 1.6L3 25.9v-8l2-6zM12 11.9v16l18 9v-16z M44 13.9v16l-14 7v-16zM8.5 19.7v.5l1 .5v-.5zM9.5 20.9l-1-.5v-.2l1 .5z M3.6 17.7L5.2 13c.1-.2.3-.3.4-.2l3.7 1.9c.1.1.2.2.2.3v3.8c0 .2-.2.4-.4.3l-1.6-.8c-.3-.3-.7-.3-1-.3l-1.9.4h-.2l",

  //   fillColor: "red",
  //   fillOpacity: 2,
  //   strokeWeight: 1,
  //   rotation: 0,
  //   scale: 1,
  // });
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
    strokeColor: '#8BC34A',
    fillColor: '#8BC34A',
  };
  const middleOptions = {
    ...defaultOptions,
    zIndex: 2,
    fillOpacity: 0.05,
    strokeColor: '#FBC02D',
    fillColor: '#FBC02D',
  };
  const farOptions = {
    ...defaultOptions,
    zIndex: 1,
    fillOpacity: 0.05,
    strokeColor: '#FF5252',
    fillColor: '#FF5252',
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
      console.log('Reverse geo coded', res.results[0]);
      setAlertContent(res.results[0].formatted_address);
      setMarkerClicked(true);
      setInfoWindowPostion(alertLatlng);
    });
  }
  function infoWinMarker(cord) {
    const infoWin = new window.google.maps.InfoWindow({
      content: 'here',
      ariaLabel: 'Long Delay',
    });
    infoWin.open({
      anchor: cord,
    });
  }
  useEffect(() => {
    if (isLoaded) {
      console.log('here 1');
      const directionsService = new window.google.maps.DirectionsService();
      const newDirectionsService = new window.google.maps.DirectionsService();
      const passedDirectionService = new window.google.maps.DirectionsService();

      console.log('alll alert detais', props.alertDetails);
      newDirectionsService.route(
        {
          origin: props.fleet[0].src_addrs,
          destination: {
            lat: props.fleet[0].current_lat,
            lng: props.fleet[0].current_long,
          },
          // destination: {
          //   lat: 22.58594,
          //   lng: 88.36266,
          // },

          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log('here passed routes in 151', result);
            // setRemainingRoutes(result);
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

            // console.log("Route Coordinates:", coordinates);

            // setRemainingRoutes(coordinates);
            setPassedRoutes(coordinates);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
      console.log(
        'destination and source',
        props.fleet[0].current_lat,
        props.fleet[0].current_long
      );
      directionsService.route(
        {
          origin: props.fleet[0].src_addrs,
          destination: props.fleet[0].dest_addrs,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log('this is the map result', result);
            setDirections(result);
            const coordinates = [];
            result.routes[0].legs[0].steps.forEach((step) => {
              step.path.forEach((point) => {
                coordinates.push({ lat: point.lat(), lng: point.lng() });
                if (
                  props.fleet[0].current_lat === point.lat() &&
                  props.fleet[0].current_long === point.lng()
                ) {
                  console.log('value exists');
                }
              });
            });

            heading = window.google.maps.geometry.spherical.computeHeading(
              {
                lat: props.fleet[0].current_lat,
                lng: props.fleet[0].current_long,
              },
              {
                lat: props.fleet[0].current_lat - 0.00002,
                lng: props.fleet[0].current_long - 0.00007,
              }
            );
            const passedPath = coordinates.slice(0, 22699);

            console.log('heading', heading);
            customMarker.rotation = heading;
            customMarker.anchor = new window.google.maps.Point(10, 30);

            console.log('Route Coordinates:', coordinates);

            setRouteCoordinates(coordinates);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
      passedDirectionService.route(
        {
          origin: {
            lat: props.fleet[0].current_lat,
            lng: props.fleet[0].current_long,
          },
          destination: props.fleet[0].dest_addrs,

          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log('here via route', result);
            // setRemainingRoutes(result);
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

            // console.log("passed ", coordinates);
            setRemainingRoutes(coordinates);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [center, destination, isLoaded]);
  useEffect(() => {
    if (infowindowRef.current) {
      console.log('here', infowindowRef.current);
      console.log(
        'infoWindowRef',
        infowindowRef.current.state.infoWindow.getPosition()
      );
    }
    console.log('infowindow.current', inforefs);
  }, [inforefs]);
  useEffect(() => {
    setMarkerClicked(false);
    console.log(
      'alert in view',
      props.diverstionalert,
      props.ShortDelayAlert,
      props.allAlert,
      props.longDelayAlert,
      props.alertDetails[0]
    );
  }, [
    props.diverstionalert,
    props.ShortDelayAlert,
    props.allAlert,
    props.longDelayAlert,
  ]);

  return (
    <>
      {console.log('marker', customMarker)}
      {isLoaded ? (
        <>
          <Grid container>
            <Grid item md={12}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '80vh' }}
                center={center}
                zoom={9}
              >
                {console.log('directions', directions)}
                {viaDirections !== null && (
                  <>
                    <Polyline
                      path={passedRoutes}
                      options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 5,
                        geodesic: true,
                        strokeWeight: 2,
                      }}
                    />
                  </>
                )}

                {directions !== null && (
                  <>
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        polylineOptions: {
                          strokeColor: '#1AA16B',
                          zIndex: 10,
                          strokeOpacity: 10,
                          strokeWeight: 5,
                        },
                        markerOptions: {
                          animation: window.google.maps.Animation.DROP,
                        },
                      }}
                    />
                    <Marker
                      position={{
                        lat: props.fleet[0].current_lat,
                        lng: props.fleet[0].current_long,
                      }}
                      // icon={truck}
                      icon={truckImage}
                    />
                    <Circle
                      center={routeCoordinates[0]}
                      radius={props.fleet[0].source_radius * 1000}
                      options={farOptions}
                    />
                    {/* <Circle
                      center={routeCoordinates[0]}
                      radius={6000}
                      options={middleOptions}
                    /> */}
                    <Circle
                      center={routeCoordinates[routeCoordinates.length - 1]}
                      radius={props.fleet[0].trip_close_radius * 1000}
                      options={closeOptions}
                    />
                    {/* <Circle
                      center={routeCoordinates[routeCoordinates.length - 1]}
                      radius={10000}
                      options={farOptions}
                    /> */}
                    <Circle
                      center={routeCoordinates[routeCoordinates.length - 1]}
                      radius={props.fleet[0].arrival_radius * 1000}
                      options={middleOptions}
                    />
                    {/* <Circle
                      center={routeCoordinates[0]}
                      radius={3000}
                      options={closeOptions}
                    /> */}
                    {(props.longDelayAlert || props.allAlert) &&
                      props.alertDetails[0]?.delay['delay_long'].map(
                        (cord, index) => (
                          <Marker
                            position={{ lat: cord.lat, lng: cord.long }}
                            title="Long Delay"
                            animation={window.google.maps.Animation.DROP}
                            icon={{
                              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            }}
                            onClick={(e) => reverseGeocoding(e)}
                          />
                        )
                      )}
                    {console.log(
                      'here divertion alert',
                      props.alertDetails[0]?.deviation['deviation_short']
                    )}
                    {(props.ShortDelayAlert || props.allAlert) &&
                      props.alertDetails[0]?.delay['delay_short'].map(
                        (cord, index) => (
                          <Marker
                            position={cord}
                            title="Short Delay"
                            // label={{ text: "SD", color: "white" }}
                            animation={window.google.maps.Animation.DROP}
                            onClick={(e) => reverseGeocoding(e)}
                            icon={{
                              url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                            }}
                          />
                        )
                      )}
                    {(props.diverstionalert || props.allAlert) &&
                      props.alertDetails[0]?.deviation['deviation_short'].map(
                        (cord, index) => (
                          <Marker
                            position={{ lat: cord.lat, lng: cord.long }}
                            title="Short Delay"
                            // label={{ text: "SD", color: "white" }}
                            animation={window.google.maps.Animation.DROP}
                            onClick={(e) => reverseGeocoding(e)}
                            icon={{
                              url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                            }}
                          />
                        )
                      )}
                    {(props.diverstionalert || props.allAlert) &&
                      props.alertDetails[0]?.deviation['deviation_long'].map(
                        (cord, index) => (
                          <Marker
                            position={{ lat: cord.lat, lng: cord.long }}
                            title="Long Delay"
                            // label={{ text: "SD", color: "white" }}
                            animation={window.google.maps.Animation.DROP}
                            onClick={(e) => reverseGeocoding(e)}
                            icon={{
                              url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                            }}
                          />
                        )
                      )}

                    {markerClicked && (
                      <InfoWindow
                        ref={infowindowRef}
                        position={infowWindowPostion}
                        onCloseClick={(e) => {
                          console.log('here', e);
                          setMarkerClicked(false);
                        }}
                        options={{
                          pixelOffset: new window.google.maps.Size(0, -38),
                        }}
                      >
                        <div>
                          {' '}
                          <Typography sx={{ color: '#FF0000' }} variant="h5">
                            Diverstion alert
                          </Typography>
                          <Typography variant="p">{alertContent}</Typography>
                        </div>
                      </InfoWindow>
                    )}
                    <Polyline
                      path={RemainingRoutes}
                      options={{
                        strokeColor: '#1A59A1',
                        strokeOpacity: 10,
                        geodesic: true,
                        strokeWeight: 5,
                        zIndex: 15,
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
