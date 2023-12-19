import instance from "../api";

export const createTransporterAdmin = async (payload) => {
  let url = `/transporter/user/admin`;
  return instance.post(url, payload);
};

export const fetchTransporterAdmin = async (id) => {
  let url = `/secure/user/admin?transporter_id=${id}`;
  return instance.get(url);
};
export const blockTranseporter = async (payload) => {
  let url = `/transporter/blacklist/`;
  return instance.post(url, payload);
};

export const fetchAllBlacklisted = async (id) => {
  console.log(id)
  let url = `/transporter/blacklist/?transporter_id=${id}`
  return instance.get(url)
}

export const unblockTransporter = async (id) => {
  console.log("::::::bbb:::::::", id)
  let url = `/transporter/blacklist/${id}`
  return instance.delete(url)
}

export const createTransporterKam = async (payload) => {
  let url = `/secure/user/`;
  return instance.post(url, payload);
};

export const viewKamList = async (id) => {
  let url = `/transporter/${id}/kam`;
  return instance.get(url);
};

export const updateTransporterDetails = async (id, payload) => {
  let url = `/transporter/${id}`;
  return instance.patch(url, payload);
};

export const updateKamUser = async (id, payload) => {
  let url = `/secure/user/${id}`;
  return instance.patch(url, payload);
};

export const deleteKamUser = async (id) => {
  let url = `/secure/user/${id}`;
  return instance.delete(url);
};

export const updateAdminUser = async (id, payload) => {
  let url = `/secure/user/${id}`;
  return instance.patch(url, payload);
};
