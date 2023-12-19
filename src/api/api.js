import axios from 'axios';
const baseUrl = import.meta.env.VITE_TMS_APP_API_URL;
const tractBidBaseUrl = import.meta.env.VITE_TMS_APP_API_URL_BID;
const token = JSON.parse(localStorage.getItem('authToken'));

// console.log("token....", token);

export const bidInstance = axios.create({
  baseURL: tractBidBaseUrl,

  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
  // other configurations like headers, timeouts, etc.
});
export default instance;

export const nonAuthorizedInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
    // 'Content-Type': 'multipart/form-data',
  },
});

export const nonTokenInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
    // 'Content-Type': 'multipart/form-data',
  },
});

export const formAuthorizedInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
    // "Content-Type": "application/json",
    'Content-Type': 'multipart/form-data',
  },
});

export const trackingInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
  // other configurations like headers, timeouts, etc.
});
