import instance from '../api';

export const login = async (payload) => {
  let url = `/login`;
  return instance.post(url, payload);
};
