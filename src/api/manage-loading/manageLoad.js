import instance from "../api";

export const viewLoading = (payload) => {
  let url = `/shipper/load/manage/all`;
  return instance.post(url, payload);
};

export const viewLoadingFleet = (payload) => {
  let url = `/track/fleet/load/${payload.load_id}/transporter/${payload.transporter_id}`;

  return instance.get(url, payload);
};

export const materiaData = () => {
  let url = `/master/material/`;
  return instance.get(url);
};

export const addVehicle = (payload) => {
  let url = `/track/fleet/`;
  return instance.post(url, payload);
};

export const updateVehicle = (id,payload) => {
  let url = `/track/fleet/${id}`;
  return instance.patch(url, payload);
};