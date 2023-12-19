import instance from "../api";

export const getFleetInfo = (id) => {
  let url = `/track/fleet/${id}`;
  return instance.get(url);
};
