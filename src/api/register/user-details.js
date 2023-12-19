import { nonAuthorizedInstance } from "../api";

export const viewRoles = (data) => {
  // let url = `/master/role/?shipperId=${data.shipper_id}`;
  let url = `/master/role/`;
  return nonAuthorizedInstance.get(url);
};
export const viewroleShipper = (data) => {
  // let url = `/master/role/?shipperId=${data.shipper_id}`;
  let url = `/shipper/${data.shipper_id}/roles`;

  return nonAuthorizedInstance.get(url);
};

export const viewBranch = (payload) => {
  let url = '/shipper/branch/?';

  if (payload.shipper_id !== null) {
      url += `shipperId=${payload.shipper_id}&`;
  }

  if (payload.region_cluster_id !== null) {
      url += `regionClusterId=${payload.region_cluster_id}&`;
  }

  // Remove the trailing '&' if there are any parameters
  if (url.endsWith('&')) {
      url = url.slice(0, -1);
  }
  return nonAuthorizedInstance.get(url);
};


export const viewUser = (data) => {
  let url = `/secure/user/?shipperId=${data.shipper_id}`;
  return nonAuthorizedInstance.get(url);
};

export const viewUserExisting = (data) => {
  let url = `/secure/user/existing/?contact_no=${data.contact_no}&email=${data.email}`;
  return nonAuthorizedInstance.get(url);
};

export const createUser = (data) => {
  let url = "/shipper/user";
  return nonAuthorizedInstance.post(url, data);
};

export const updateUser = (id, data) => {
  let url = `/secure/user/${id}`;
  return nonAuthorizedInstance.patch(url, data);
};

export const deleteUser = (id) => {
  let url = `/secure/user/${id}`;
  return nonAuthorizedInstance.delete(url);
};
