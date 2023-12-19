import instance from "../api";

export const viewCurrency = () => {
  let url = "/master/currency/";
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

export const createCurrency = (data) => {
  let url = "/master/currency";
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

export const updateCurrency = (id, data) => {
  let url = `/master/currency/${id}`;
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

export const deleteCurrency = (id) => {
  let url = `/master/currency/${id}`;
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
