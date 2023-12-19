import instance from "../api";

export const getAllshiper = () => {
  let url = "/shipper/";
  return instance
    .get(url)
    .then((response) => {
      //   console.log("response", response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    })
    .finally(() => {
      // Code to execute regardless of success or error
    });
};
