import instance from '../api';

export const viewLicense = () => {
  let url = '/master/license/';
  return instance
    .get(url)
    .then((response) => {
      console.log('response', response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const createLicense = (data) => {
  let url = '/master/license';
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

export const updateLicense = (id, data) => {
  let url = `/master/license/${id}`;
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

export const deleteLicense = (id) => {
  let url = `/master/license/${id}`;
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

export const viewAllLicense = () => {
  let url = '/master/license/';
  return instance.get(url);
};
