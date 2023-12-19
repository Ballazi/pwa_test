import instance, { nonTokenInstance } from "../api";

export const viewState = () => {
  let url = "/master/state/all";
  return instance
    .get(url)
    .then((response) => {
      console.log("response", response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};

export const createState = (data) => {
  let url = "/master/state/";
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

export const updateState = (id, data) => {
  let url = `/master/state/${id}`;
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

export const deleteState = (id) => {
  let url = `/master/state/${id}`;
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

export const getAllStateByCountry = (id) => {
  let url = `/master/state/?countryId=${id}`;
  return instance.get(url);
};

export const getAllStateByCountryWithoutToken = (id) => {
  let url = `/state/?country_id=${id}`;
  return nonTokenInstance.get(url);
};
