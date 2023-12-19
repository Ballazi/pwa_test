import { trackingInstance } from "../api";

export const trackingStatus = (data) => {
  console.log("localstorage", localStorage.getItem("user_type"));
  let user_type = localStorage.getItem("user_type");
  let url;
  if (user_type === "acu") {
    url = `/track/fleet/status?status=${data}`;
  } else {
    url = `/track/fleet/status?status=${data}&shipper_id=${localStorage.getItem(
      "user_id"
    )}`;
  }

  return trackingInstance.get(url);
};

export const fleetDetails = (data) => {
  let url = `/track/fleet/${data}/all`;
  return trackingInstance.get(url);
};

export const alertDetails = (data) => {
  let url = `/track/fleet/live/alert?alert=all_alert&fleet_id=${data}`;
  return trackingInstance.get(url);
};

export const fleetTrackReport = (data) => {
  let url = `/track/fleet/${data}/trackReport`;
  return trackingInstance.get(url);
};

export const allDetailsFleet = (data) => {
  let url = `/track/fleet/${data}`;
  return trackingInstance.get(url);
};

export const filterFleet = (data, filter_data) => {
  let url = `/track/fleet/status?status=${data}`;
  const playLoad = {
    shipper_id: filter_data.shipper_id,
    region_cluster_id: filter_data.rc_id,
    branch_id: filter_data.branch_id,
    from_date: filter_data.from_date,
    to_date: filter_data.to_date,
  };
  return trackingInstance.post(url, playLoad);
};
export const saveMaterials = (data) => {
  let url = "/track/epod/itemwise/assign";
  console.log("data in api", data);
  const playLoad = data.map((val) => {
    return {
      mtfitm_tracking_fleet_id: val.material_tracking_fleet_id,
      item_name: val.itemName,
      item_uom: val.uom,
      dispatch_item_qty: val.quantity,
      is_updated: val.is_updated,
    };
  });
  console.log("playload", playLoad);
  return trackingInstance.post(url, playLoad);
};
export const ResendConsent = (data) => {
  let url = `track/fleet/resend/consent?mobNo=${data}`;
  return trackingInstance.post(url);
};
