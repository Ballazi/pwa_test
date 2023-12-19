import instance from '../api';

export const getAlltransporters = async () => {
  let url = `/transporter/`;
  return instance.get(url);
};

export const getTransporterById = async (Id, shipper_id) => {
  let url = `shipper/transporter/${Id}?shipper_id=${shipper_id}`;
  return instance.get(url);
};

export const postAlltransporters = async (payload) => {
  let url = `/shipper/transporter/`;
  return instance.post(url, payload);
};

export const fetchKamRole = async () => {
  let url = `/master/role/specific?type=KAM`;
  return instance.get(url);
};

export const fetchKams = async (id) => {
  let url = `/transporter/${id}/kam`;
  return instance.get(url);
};

export const fetchBranch = async (shipper_id) => {
  let url = `/shipper/branch/?shipperId=${shipper_id}`;
  return instance.get(url);
};

export const addTransporter = async (payload) => {
  let url = `/shipper/transporter/add`;
  return instance.post(url, payload);
};

export const checkKamIsExistOrNot = async (contact_no, email) => {
  let url = `/secure/user/existing/?contact_no=${contact_no}&email=${email}`;
  return instance.get(url);
};

export const fetchMasterFleets = async () => {
  let url = `/master/fleet/`;
  return instance.get(url);
};

export const addNewShipper = async (payload) => {
  let url = `/shipper/transporter/`;
  return instance.post(url, payload);
};

export const fetchTransporterDetailsData = async (shipper_id) => {
  let url = `/shipper/transporter/?shipperId=${shipper_id}`;
  return instance.get(url);
};

export const deleteTransporter = async (payload) => {
  let url = `/shipper/transporter/`;
  return instance.delete(url, payload);
};

export const getPublicTransporter = async (trans_id) => {
  let url = `/transporter/${trans_id}`;
  return instance.get(url);
};

export const getAllTransporterByStatus = async (status) => {
  let url = `/transporter/?status=${status}`;
  return instance.get(url);
};
