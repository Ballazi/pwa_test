import { nonAuthorizedInstance } from '../api';

export const createRegion = async (payload) => {
  let url = '/master/regioncluster/';
  return nonAuthorizedInstance.post(url, payload);
};

export const fetchAllRegion = async (payload) => {
  let url = `/master/regioncluster/?isRegion=${payload.isRegion}&is_alphabetical=true`;
  return nonAuthorizedInstance.get(url);
};

export const addShipperRegions = async (payload) => {
  let url = '/shipper/regioncluster/';
  return nonAuthorizedInstance.post(url, payload);
};

export const fetchAlreadyAddedRegion = async (payload) => {
  let url = `/shipper/regioncluster/?shipperId=${payload.shipper_id}&isRegion=${payload.isRegion} `;
  return nonAuthorizedInstance.get(url);
};
