import { nonAuthorizedInstance } from "../api";



export const getSettings = (data) => {
    let url = `/shipper/settings/all/?shipperId=${data.shipper_id}`;
    return nonAuthorizedInstance.get(url, data);
};

export const createSettings = (data) => {
    let url = "/shipper/settings/all/";
    return nonAuthorizedInstance.post(url, data);
}

export const updateSettings = (data) => {
    let url = "/shipper/settings/all/";
    return nonAuthorizedInstance.patch(url, data);
}

export const getShipperModule = (id) => {
    let url = `/shipper/module/?shipper_id=${id}`;
    return nonAuthorizedInstance.get(url);
};

export const viewBranch = (data) => {
    let url = `/shipper/branch/?shipperId=${data.shipper_id}`;
    return nonAuthorizedInstance.get(url);
};