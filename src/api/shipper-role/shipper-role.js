import instance from '../api';

export const createRole = (payload) => {
  let url = `/master/role/`;
  return instance.post(url, payload);
};

export const getRoleByShipperId = (id) => {
  let url = `/master/role/?shipper_id=${id}`;
  return instance.get(url);
};

export const assignRoleByShipperId = (payload) => {
  let url = `/shipper/role/submodule/assign`;
  return instance.post(url, payload);
};

export const viewRoleAccessByShipperId = (id, shipperId) => {
  let url = `/master/role/access/${id}?shipper_id=${shipperId}`;
  return instance.get(url);
};
