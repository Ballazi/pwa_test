import instance from '../api';

export const viewRoleAccess = (id) => {
  let url = `/master/role/access/${id}`;
  return instance.get(url);
};

export const createRoleAccess = (data) => {
  let url = '/master/role';
  return instance
    .post(url, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const updateRoleAccess = (id, data) => {
  let url = `/master/role/${id}`;
  return instance
    .patch(url, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const deleteRole = (id) => {
  let url = `/master/role/${id}`;
  return instance
    .delete(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const fetchSubmodule = () => {
  let url = `/master/submodule/?menu_wise=true`;
  return instance.get(url);
};

export const assignRole = (payload) => {
  let url = `/shipper/role/submodule/assign`;
  return instance.post(url, payload);
};

export const masterRoleAccess = (id) => {
  let url = `/master/role/access/?shipper_id=${id}`;
  return instance.get(url);
};
