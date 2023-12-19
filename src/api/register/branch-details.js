import { nonAuthorizedInstance } from '../api';

export const getRegion = (data) => {
  let url = `/shipper/regioncluster/?shipperId=${data.shipper_id}`;
  return nonAuthorizedInstance.get(url);
};
export const getShipperRoles = (data) => {
  let url = `/shipper/${id}/roles`;
  return nonAuthorizedInstance.get(url);
};

export const viewBranch = (data) => {
  let url = `/shipper/branch/?shipperId=${data.shipper_id}&is_alphabetical=true`;
  return nonAuthorizedInstance.get(url);
};

export const existingBranch = (data) => {
  let url = '/shipper/branch/existing';
  return nonAuthorizedInstance.post(url, data);
};

export const createBranch = (data) => {
  let url = '/shipper/branch/';
  return nonAuthorizedInstance.post(url, data);
};

export const updateBranch = (id, data) => {
  let url = `/shipper/branch/${id}`;
  return nonAuthorizedInstance.patch(url, data);
};

export const deleteBranch = (id) => {
  let url = `/shipper/branch/${id}`;
  return nonAuthorizedInstance.delete(url);
};
