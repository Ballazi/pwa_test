import instance, { bidInstance } from "../api";

export const getTripData = (status) => {
  let url = `/shipper/bid/status/${status}`;
  return bidInstance.get(url);
};

export const publishDraftBid = (bid_id) => {
  let url = `/shipper/bid/publish/${bid_id}`;
  return bidInstance.patch(url);
};

export const getLiveBidDetails = (bid_id) => {
  let url = `/shipper/bid/live/${bid_id}`;
  return bidInstance.get(url);
};

export const getPendingBidDetails = (bid_id) => {
  let url = `/shipper/bid/details/${bid_id}`;
  return bidInstance.get(url);
};
export const updateBId = () => {
  let url = `shipper/bid/control`;
  return bidInstance.get(url);
};
export const getBidHistory = (bid_id, data) => {
  let url = `/shipper/bid/history/${bid_id}`;
  return bidInstance.post(url, data);
};

export const getUnasighnHistory = (bid_id, data) => {
  let url = `/shipper/bid/history/assignment/${bid_id}`;
  return bidInstance.post(url, data);
};

export const assignVehicel = (bid_id, data) => {
  let url = `/shipper/bid/assign/${bid_id}`;
  return bidInstance.post(url, data);
};

export const unAssignVehicel = (bid_id, data) => {
  let url = `/shipper/bid/unassign/${bid_id}`;
  return bidInstance.post(url, data);
};

export const assignNewBidValue = (bid_id, data) => {
  let url = `/shipper/bid/match/${bid_id}`;
  return bidInstance.post(url, data);
};

export const cancelBid = (bid_id, payload) => {
  let url = `/shipper/bid/cancel/${bid_id}`;
  return bidInstance.post(url, payload);
};

export const getFilteredBidData = (status, data) => {
  let url = `shipper/bid/filter/${status}`;
  return bidInstance.post(url, data);
};

export const deleteBid = (id) => {
  let url = `/shipper/load/${id}`;
  return instance.delete(url);
};

export const viewBidDetails = (id) => {
  const userType = localStorage.getItem("user_type");
  let url = `/shipper/load/${id}/?trans_view=${userType === "trns"}`;
  return instance.get(url);
};

export const markCompleted = (id, status, payload) => {
  let url = `/shipper/load/${id}/status/?type=${status}`;
  return instance.patch(url, payload);
};

export const viewBranch = (data) => {
  let url = `/shipper/branch/?shipperId=${data.shipper_id}&regionClusterId=${data.region_cluster_id} `;
  return instance.get(url);
};

export const enableTracking = (selectedId) => {
  let url = `/shipper/load/${selectedId}/track/enable`;
  return instance.patch(url);
};

export const viewCancelReason = () => {
  let url = "/master/reason/";
  return instance.get(url);
};

export const viewNetworkProvider = () => {
  let url = "/master/networkprovider";
  return instance.get(url);
};

export const getFleet = (id) => {
  let url = `/track/fleet/?load_id=${id}`;
  return instance.get(url);
};

export const createFleet = (data) => {
  let url = "/track/fleet/";
  return instance.post(url, data);
};

export const updateFleet = (data, id) => {
  let url = `/track/fleet/${id}`;
  return instance.patch(url, data);
};

export const deleteFleet = (id) => {
  let url = `/track/fleet/${id}`;
  return instance.delete(url);
};

export const fetchSimNetworkPro = (contact_no) => {
  let url = `/service/external/neutrino/sim/track/${contact_no}`;
  return instance.get(url);
}