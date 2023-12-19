import { bidInstance } from '../api';

export const transporterPostBid = (bid_id, payload) => {
  console.log(bid_id);
  let url = `/transporter/bid/rate/${bid_id}`;
  return bidInstance.post(url, payload);
};

export const incrementBid = (bid_id) => {
  let url = `/bid/increment/${bid_id}`;
  return bidInstance.get(url);
};
export const getBidDetails = (bid_id) => {
  let url = `/transporter/bid/details/${bid_id}`;

  return bidInstance.get(url);
};
export const getlowestBId = (bid_id) => {
  let url = `/transporter/bid/details/${bid_id}`;
  return bidInstance.get(url);
};

export const getTripDataForShipper = (status, tabValue) => {
  console.log(localStorage.getItem('authToken'));
  let url = `/transporter/bid/status/${status}`;
  console.log("....",status,tabValue);
  const flag = tabValue === 0;
  if (status === "live") {
    url += `/?participated=${flag}`;
  }
  return bidInstance.get(url);
};

export const getTripDataForShipperCompleted = (status) => {
  console.log(localStorage.getItem('authToken'));
  let url = `/transporter/bid/${status}`;
  return bidInstance.get(url);
};

export const getTripDataForCategory = () => {
  console.log(localStorage.getItem('authToken'));
  let url = `/transporter/bid/selected/`;
  return bidInstance.get(url);
};

export const getTripDataForCategoryLost = (payload) => {
  console.log(localStorage.getItem('authToken'));
  let url = `/transporter/bid/lost/`;
  return bidInstance.post(url, payload);
};

export const transporterBidMatch = (bid_id, payload) => {
  let url = `transporter/bid/match/${bid_id}`;
  return bidInstance.post(url, payload);
};
