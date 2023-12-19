import instance from '../api';

export const createAdmin = async (payload) => {
  let url = '/shipper/user/admin';
  return instance.post(url, payload);
};

export const fetchAllRole = async (payload) => {
  let url = `/master/role/?shipperId=${payload.id}`;
  return instance.get(url);
};

export const fetchAdmin = (data) => {
  let url = `/secure/user/admin?shipper_id=${data}`;
  return instance.get(url);
};
export const createModulemap = async (payload) => {
  let url = '/shipper/module/assign';
  return instance.post(url, payload);
};

export const fetchSelectModule = (data) => {
  let url = `/shipper/module/?shipper_id=${data}`;
  return instance.get(url);
};

export const updateUser = (id, data) => {
  let url = `/secure/user/${id}?shipper_admin=true`;
  return instance.patch(url, data);
};
