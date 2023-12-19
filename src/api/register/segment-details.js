import { nonAuthorizedInstance } from '../api';

export const getSegmentTransporter = (data) => {
  let url = `/shipper/transporter/?shipperId=${data.shipper_id}&status=allowed `;
  return nonAuthorizedInstance.get(url);
};

export const viewSegment = (data) => {
  let url = `/shipper/segment/?shipperId=${data.shipper_id}`;
  return nonAuthorizedInstance.get(url);
};

export const createSegment = (data) => {
  let url = '/shipper/segment/';
  return nonAuthorizedInstance.post(url, data);
};

export const updateSegment = (id, data) => {
  let url = `/shipper/segment/${id}`;
  return nonAuthorizedInstance.patch(url, data);
};

export const deleteSegment = (id) => {
  let url = `/shipper/segment/${id}`;
  return nonAuthorizedInstance.delete(url);
};
