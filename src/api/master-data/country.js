import instance, { nonTokenInstance } from "../api";

export const viewCountry = () => {
  let url = "/master/country/";

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

export const createCountry = (data) => {
  let url = "/master/country";
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

export const updateCountry = (id, data) => {
  let url = `/master/country/${id}`;
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

export const deleteCountry = (id) => {
  let url = `/master/country/${id}`;
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

export const viewAllCountry = () => {
  let url = "/master/country/";

  return instance.get(url);
};

export const viewWithoutTokenCountry = () => {
  let url = "/country/";

  return nonTokenInstance.get(url);
};
