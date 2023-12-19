import instance from "../api";

export const viewPretrackingDraft = () => {
  let url = `/track/fleet/?shipper_id=7451eb95-f852-4c48-b9b8-a2d2d5af13b9`;
  return instance.get(url);
};
export const viewDetails = (payload) => {
  let url = `/track/epod/invoice?tracking_fleet_id=${payload.tracking_fleet_id}`;
  return instance.get(url);
};
export const viewItemDetails = (payload) => {
  let url = `track/epod/itemwise?tracking_fleet_id=${payload.tracking_fleet_id}`;
  return instance.get(url);
};

export const addNewInvoice = async (payload) => {
  let url = "/track/epod/invoice/";
  return instance.post(url, payload);
};

export const addNewMaterial = async (payload) => {
  let url = "/track/load/epod/itemwise/assign";
  return instance.post(url, payload);
};

export const giveConsent = (data) => {
  let url = `track/fleet/send/consent`;

  return instance.post(url, data);
};

export const EndTripTracking = (data) => {
  let url = `track/fleet/${data.fleet_id}`;
  return instance.patch(url, { status: data.status });
};
