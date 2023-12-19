import instance from '../api';

export const viewTrackDashboardData = (payload) => {
  let url = `/track/trackingdashboard?`;
  if (payload.shipper_id !== null) {
    url += `shipper_id=${payload.shipper_id}&`;
  }

  if (payload.region_cluster_id !== null) {
    url += `region_cluster_id=${payload.region_cluster_id}&`;
  }

  if (payload.branch_id !== null) {
    url += `branch_id=${payload.branch_id}&`;
  }

  if (payload.from_date !== null) {
    url += `from_date=${payload.from_date}&`;
  }

  if (payload.to_date !== null) {
    url += `to_date=${payload.to_date}&`;
  }

  // Remove the trailing '&' if there are any parameters
  if (url.endsWith('&')) {
    url = url.slice(0, -1);
  }
  return instance.get(url);
};
