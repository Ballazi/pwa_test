import instance from "../api";

export const viewEPOD = () => {
  let url = "/track/fleet/epod/enabled";
  return instance
    .get(url)
    .then((response) => {
      console.log("response", response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const viewItemwiseEpod = (tracking_fleet_id) => {
  let url = `/track/load/epod/itemwise?tracking_fleet_id=${tracking_fleet_id}`;
  return instance
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {});
};

export const viewInovoicewise = (tracking_fleet_id) => {
  let url = `/track/epod/invoice?${tracking_fleet_id}`;
  return instance
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {});
};

export const submitEpod = (payload) => {
  let url = "track/load/epod/itemwise/assign";
  return instance
    .post(url, payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {});
};
