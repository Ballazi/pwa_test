import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid } from "@mui/material";
import { getTabsContent } from "../../../api/alert/alertDashbord";
import { useDispatch } from 'react-redux';
import BackdropComponent from "../../../components/backdrop/Backdrop";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import moment from "moment/moment";

const AlertTable = ({ tabType, shipperId }) => {
    const [loading, setIsLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const dispatch = useDispatch();
    const columns = [
        { field: "tracking_id", headerName: "Tracking Id", width: 100 },
        { field: "vehicle_no", headerName: "Vehicle No.", width: 100 },
        { field: "start_date", headerName: "Start date", width: 200 },
        { field: "driver_contact", headerName: "Driver contact", width: 110 },
        { field: "transporter_name", headerName: "Transporter Name", width: 190 },
        { field: "shipper", headerName: "Shipper", width: 110 },
        { field: "branch", headerName: "Branch", width: 110 },
        {
            field: "source_address",
            headerName: "Route",
            width: 300,
            renderCell: (params) => (
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={6}>
                        <Grid container direction="row">
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    color: "lightgray",
                                    fontSize: "10px"
                                }}
                            >
                                Source
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    fontSize: "15px"
                                }}
                            >{params.row.source_address}</Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container direction="row">
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    color: "lightgray",
                                    fontSize: "10px"
                                }}
                            >
                                Destination
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    fontSize: "15px"
                                }}
                            >{params.row.destination_address}</Grid>
                        </Grid>
                    </Grid>
                </Grid>
            ),
        },
        { field: "eta", headerName: "ETA", width: 180 },
    ]


    const returnRows = (data) => {
        if (data.length !== 0) {
            const rows = data.map(ele => {
                return (
                    {
                        id: ele.tracking_id,
                        tracking_id: `L- ${ele.tracking_id.slice(-5)}`,
                        vehicle_no: ele.vehicle_no,
                        start_date: moment(ele.start_date).format("YYYY-MM-DD hh:mm A"),
                        driver_contact: ele.driver_contact,
                        shipper: `L- ${ele.shipper.slice(-5)}`,
                        branch: ele.branch === null ? "N/A" : ele.branch,
                        transporter_name:ele.transporter_name ? ele.transporter_name :"-",
                        source_address: ele.source_address,
                        destination_address: ele.destination_address,
                        eta: ele.eta,
                    }
                )
            })
            return rows;
        }
        else
            return [];
    }

    useEffect(() => {
        setIsLoading(true);
        const payload = {
            shipper_id: shipperId,
            alert_type: tabType
        };
        getTabsContent(payload)
            .then((res) => {
                if (res.data.success === true) {
                    const outputRows = returnRows(res.data.data)
                    setRows(outputRows);
                } else {
                    dispatch(
                        openSnackbar({ type: "error", message: res.data.clientMessage })
                    );
                }
            })
            .catch((error) => {
                console.error("Error", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [tabType, shipperId, dispatch])


    return (
        <>
            <BackdropComponent loading={loading} />
            <Grid container >
                <Grid
                    item
                    xs={12}
                    md={12}
                    style={{ width: "100px", overflow: "auto", backgroundColor: "#fff" }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default AlertTable