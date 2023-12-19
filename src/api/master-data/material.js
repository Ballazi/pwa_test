import instance from "../api";

export const viewMaterials = () => {
  let url = `/master/material/?is_alphabetical=true`;
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

export const createMaterial = (data) => {
  let url = "/master/material";
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

export const updateMaterial = (id, data) => {
  let url = `/master/material/${id}`;
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

export const deleteMaterial = (id) => {
  let url = `/master/material/${id}`;
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
