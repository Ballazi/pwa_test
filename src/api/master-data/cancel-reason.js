import instance from "../api";

export const viewCancelReason = () => {
  let url = `/master/reason/?is_alphabetical=true`;
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

export const createCancelReason = (data) => {
  let url = "/master/reason";
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

export const updateCancelReason = (id, data) => {
  let url = `/master/reason/${id}`;
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

export const deleteCancelReason = (id) => {
  let url = `/master/reason/${id}`;
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
