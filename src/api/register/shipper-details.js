import instance, {
  nonAuthorizedInstance,
  formAuthorizedInstance,
} from '../api';

export const shipperRegistration = async (payload) => {
  let url = '/shipper/register';
  return nonAuthorizedInstance.post(url, payload);
};

export const getShipperDetails = async (payload) => {
  let url = `/shipper/${payload.id}`;
  return nonAuthorizedInstance.get(url);
};
export const approveShipper = (id, data) => {
  let url = `/shipper/status/update/${id}`;
  return nonAuthorizedInstance.patch(url, data);
};
export const updateShipper = async (payload, id) => {
  console.log(id);
  let url = `/shipper/${id}`;
  return nonAuthorizedInstance.patch(url, payload);
};
export const selfRegistration = async (payload) => {
  let url = '/register/self/shipper';
  return nonAuthorizedInstance.post(url, payload);
};

export const downloadDocs = async (id, subfolder) => {
  let url = `/service/file/download/all/${id}/${subfolder}`;
  return instance.get(url);
};
export const blockShipper = async (id) => {
  let url = `/service/file/download/all/${id}/${subfolder}`;
  return instance.get(url);
};

export const updateShipperStatus = async (id, payload) => {
  let url = `/shipper/status/update/${id}`;
  return instance.patch(url, payload);
};
