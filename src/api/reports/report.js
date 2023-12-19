import instance from "../api";

export const viewReportColumns = () => {
    let url = "/report/columns";
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

export const ColumnsData = (payload) => {
    let url = "/report/columns/data";
    return instance
        .post(url, payload)
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
