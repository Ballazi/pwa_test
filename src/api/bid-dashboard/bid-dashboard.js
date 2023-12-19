import { bidInstance } from '../api';

export const viewStats = (payload) => {
  let url = '/dashboard/stats';
  return bidInstance.post(url, payload);
};

export const transporterReports = (payload) => {
  let url = '/dashboard/transporters';
  return bidInstance.post(url, payload);
};

export const cancellationReason = (payload) => {
  let url = '/dashboard/cancellations';
  return bidInstance.post(url, payload);
};

export const confirmedVsCancelledChart = (payload, type) => {
  let url = `/dashboard/trend/${type}`;
  return bidInstance.post(url, payload);
};
