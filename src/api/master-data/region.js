import instance from "../api";

export const viewRegion = (data) => {
    let url = `/master/regioncluster/?isRegion=${data.isRegion}&is_alphabetical=true`;
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

export const createRegion = (data) => {
    let url = "/master/regioncluster/";
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

export const updateRegion = (id, data) => {
    let url = `/master/regioncluster/${id}`;
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

export const deleteRegion = (id) => {
    let url = `/master/regioncluster/${id}`;
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
