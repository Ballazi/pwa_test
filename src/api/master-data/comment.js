import instance from "../api";

export const viewComments = () => {
    let url = "/shipper/comment/";
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

export const createComments = (data) => {
    let url = "/shipper/comment/";
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

export const updateComments = (id, data) => {
    let url = `/shipper/comment/${id}`;
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

export const deleteComments = (id) => {
    let url = `/shipper/comment/${id}`;
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
