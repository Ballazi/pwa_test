import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import {
  Grid,
  Container,
  Typography,
  Tooltip,
  Card,
  IconButton,
} from "@mui/material";
import FilterComponent from "../../../components/masterData/filter-component/FilterComponent";
import moment from "moment/moment";
import VehicleInfo from "../../tracking/manage-tracking/trackingTable/VechileInfo";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { viewLoading } from "../../../api/manage-loading/manageLoad";
import BackdropComponent from "../../../components/backdrop/Backdrop";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";

export default function ManageLoad() {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const [openVehicleInfo, setVehicleInfo] = React.useState(false);
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [filteredRows, setFilteredRows] = useState([]);
  const userType = localStorage.getItem("user_type");
  const userType_shipperId = localStorage.getItem("user_id");
  const userType_regionClusterId = localStorage.getItem("region_cluster_id");
  const userType_branchId = localStorage.getItem("branch_id");
  const [filterFlag, setFilterFlag] = useState(false);
  const [filterData, setFilterData] = useState({});

  const columns = [
    { field: "lid", headerName: "Load ID", width: 100 },
    { field: "transporter_name", headerName: "Transporter Name", width: 150 },

    { field: "source", headerName: "Source", width: 150 },
    { field: "destination", headerName: "Destination", width: 150 },
    { field: "reportingDate", headerName: "Reporting Date", width: 250 },
    { field: "vehicle_no", headerName: "Total Vehicles", width: 100 },
    {
      field: "VehicleStatus",
      headerName: "Remaining Vehicles",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <Tooltip title="View/Edit">
            <IconButton
              onClick={() => handleVehicle(params.row)}
              aria-label="track"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Complete Load">
            <IconButton aria-label="track">
              <CheckCircleIcon />
            </IconButton>
          </Tooltip> */}
          {/* 
          <Tooltip title="Cancel">
            <IconButton aria-label="track">
              <DoDisturbIcon />
            </IconButton>
          </Tooltip> */}
        </div>
      ),
    },
  ];

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    const filteredRows = rows.filter((row) =>
      Object.values(row).some((fieldValue) =>
        String(fieldValue).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredRows(filteredRows);
  };

  const handleVehicle = (row) => {
    setSelectedRow(row);
    setVehicleInfo(true);
  };

  const closeVehicleModal = () => {
    setSelectedRow({});
    setVehicleInfo(false);
  };

  const fetchData = () => {
    setIsLoading(true);
    const payloadSHP = {
      shipper_id: userType_shipperId,
      rc_id:
        userType_regionClusterId !== "null" ? userType_regionClusterId : null,
      branch_id: userType_branchId !== "null" ? userType_branchId : null,
      from_date: null,
      to_date: null,
    };
    const payload =
      userType !== "shp" ? (filterFlag ? filterData : {}) : payloadSHP;
    viewLoading(payload)
      .then((data) => {
        if (data.data.success === true) {
          const updatedEpod = data.data.data.map((item) => ({
            id: item.load_id + item.transporter_id,
            mainLoadId: item.load_id,
            lid: `L-${item.load_id.slice(-5)}`.toLocaleUpperCase(),
            transporter_name: item.transporter_name,
            source: item.source,
            destination: item.destination,
            reportingDate: moment(item.reporting_to_date).format(
              "YYYY-MM-DD hh:mm A"
            ),
            vehicle_no: item.total_no_of_vehicles,
            VehicleStatus: item.pending_vehicles,
            transporter_id: item.transporter_id,
          }));
          setRows(updatedEpod);
          setFilteredRows(updatedEpod);
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: data.clientMessage,
            })
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [filterFlag]);

  const filterStateHandler = (flag, filter_data) => {
    setFilterFlag(flag);
    setFilterData(filter_data);
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
        <div className="customCardheader">
          <Typography variant="h4">Manage Loading</Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <FilterComponent
              filterStateHandler={filterStateHandler}
              filterHandler={fetchData}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card style={{ marginTop: "20px", padding: "10px" }}>
              <div className="customCardheader">
                <Typography variant="h4">Trip Table</Typography>
              </div>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Grid container justifyContent="flex-end">
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <TextField
                        label="Search "
                        size="small"
                        value={searchValue}
                        onChange={handleSearchChange}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={filteredRows}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10, 20]}
                    />
                  </div>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
        {openVehicleInfo ? (
          <VehicleInfo selectedRow={selectedRow} onClose={closeVehicleModal} />
        ) : null}
      </Container>
    </>
  );
}
