import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  // InputLabel,
  // Select,
  // MenuItem,
  // FormControl
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  viewNetworkProvider,
  createNetworkProvider,
  updateNetworkProvider,
  deleteNetworkProvider,
} from "../../../api/master-data/network";
import AlertPage from "../../../components/masterData/alert-component/AlertPage";
import {
  nonSpecialCharacterValidator,
  requiredValidator,
} from "../../../validation/common-validator";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";

const schema = yup.object().shape({
  name: nonSpecialCharacterValidator("Network Provider"),
});

// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarExport />
//     </GridToolbarContainer>
//   );
// }

function CustomPagination(props) {
  const exportValue = ["name"];
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",

          // padding: '8px',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "25px",
            padding: "8px",
          }}
        >
          <GridToolbarExport
            csvOptions={{
              fields: exportValue,
            }}
          />
        </div>
        <div>
          <GridPagination {...props} />
        </div>
      </div>
    </>
  );
}

const Network = () => {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const columns = [
    // { field: 'id', headerName: 'ID', width: 150 },
    { field: "name", headerName: "Provider Name", width: 400 },
    // { field: 'status', headerName: 'Status', width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEditClick(params.row)}>
              <BorderColorIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  // const [newNetwork, setNewNetwork] = useState({name: ''})
  const [networks, setNetworks] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const closePopup = () => {
    setAlertType("");
    setMessage("");
  };

  const fetchData = () => {
    return viewNetworkProvider()
      .then((data) => {
        if (data.success === true) {
          const updatedMaterials = data.data.map((item) => ({
            id: item.id,
            name: item.name,
          }));
          // Filter the data based on the search query
          const filterNetwork = updatedMaterials.filter((network) =>
            network.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setNetworks(filterNetwork);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setNetworks([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleAddNetwork = (form_data) => {
    const data = {
      name: form_data.name.toUpperCase(),
    };
    createNetworkProvider(data)
      .then((data) => {
        if (data.success === true) {
          const updatedMaterials = {
            id: data.data.id,
            // type: item.type,
            name: data.data.name,
          };
          setNetworks((preData) => [updatedMaterials, ...preData]);
          // fetchData();
          // setNewNetwork({  name: '' });
          dispatch(
            openSnackbar({ type: "success", message: data.clientMessage })
          );
          setValue("name", "");
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleEditClick = (network) => {
    setSelectedNetwork(network);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setSelectedNetwork(null);
    setEditDialogOpen(false);
  };

  const handleEditSave = () => {
    if (!selectedNetwork.name || selectedNetwork.name.trim() === "") {
      setAlertType("error");
      setMessage("Please type a valid network name");
    } else {
      const data = {
        name: selectedNetwork.name.toUpperCase(),
      };
      updateNetworkProvider(selectedNetwork.id, data)
        .then((data) => {
          if (data.success === true) {
            fetchData();
            dispatch(
              openSnackbar({ type: "success", message: data.clientMessage })
            );
            setSelectedNetwork(null);
            setEditDialogOpen(false);
          } else {
            dispatch(
              openSnackbar({ type: "error", message: data.clientMessage })
            );
          }
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  };

  const handleDeleteClick = (networkId) => {
    setSelectedNetwork(networks.find((network) => network.id === networkId));
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteNetworkProvider(selectedNetwork.id)
      .then((data) => {
        if (data.success === true) {
          handleDeleteCancel();
          fetchData();
          dispatch(
            openSnackbar({ type: "success", message: data.clientMessage })
          );
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedNetwork(null);
  };

  const editDialogContent = (
    <div>
      <TextField
        label="Edit Provider Name *"
        size="small"
        fullWidth
        value={selectedNetwork ? selectedNetwork.name : ""}
        onChange={(e) =>
          setSelectedNetwork((prevState) => ({
            ...prevState,
            name: e.target.value,
          }))
        }
        style={{ marginBottom: "20px" }}
      />
      {/* <TextField
        label="Edit Status"
        size="small"
        fullWidth
        value={selectedNetwork ? selectedNetwork.status : ''}
        onChange={e => setSelectedNetwork(prevState => ({ ...prevState, status: e.target.value }))}
        style={{ marginBottom: '20px' }}
      /> */}
      <DialogActions>
        <Button onClick={handleEditSave} variant="contained">
          Save
        </Button>
        <Button
          onClick={handleEditDialogClose}
          variant="contained"
          color="error"
        >
          Cancel
        </Button>
      </DialogActions>
    </div>
  );

  return (
    <Card style={{ padding: "10px" }}>
      {alertType !== "" ? (
        <AlertPage
          alertType={alertType}
          message={message}
          closePopup={closePopup}
        />
      ) : null}
      <CardContent>
        <div className="customCardheader">
          <Typography variant="h4"> Network Data</Typography>
        </div>
        <form onSubmit={handleSubmit(handleAddNetwork)}>
          <Card style={{ marginTop: "20px", padding: "10px" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Provider Name *"
                        size="small"
                        fullWidth
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                        // value={newUOM.type}
                        // onChange={e => handleNewUOMChange('type', e.target.value)}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item sm={6}>
                <FormControl fullWidth variant="outlined" size='small'>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newNetwork.status}
                    label="Status"
                    fullWidth
                    size='small'
                    onChange={(e) => handleNewNetworkChange('status', e.target.value)}
                  >
                    <MenuItem value={"Active"}>Active</MenuItem>
                    <MenuItem value={"Inactive"}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Button variant="contained" type="submit">
                  Add Network
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </form>
        <div style={{ width: "100%", marginTop: "20px" }}>
          <div className="customCardheader">
            <Typography variant="h4"> Network Table</Typography>
          </div>
          <div>
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <div
                    style={{
                      marginBottom: "20px",
                      position: "relative",
                      marginLeft: "auto",
                      width: "40%",
                    }}
                  >
                    <TextField
                      size="small"
                      label="Search"
                      variant="outlined"
                      fullWidth
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </Grid>
              </Grid>
              <div className="customDataGridTable">
                <DataGrid
                  rows={networks}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableColumnMenu
                  disableRowSelectionOnClick
                  headerClassName="custom-header"
                  components={{
                    pagination: CustomPagination,
                    // toolbar: CustomToolbar,
                  }}
                />
              </div>
            </>
          </div>
        </div>
      </CardContent>
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <div className="customCardheader">
          <Typography variant="h4"> Edit Network</Typography>
        </div>

        <DialogContent>{editDialogContent}</DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <div className="customCardheader">
          <Typography variant="h4"> Delete Network</Typography>
        </div>

        <DialogContent>
          <Typography>
            Are you sure you want to delete the Provider Name
            {selectedNetwork && <strong>: {selectedNetwork.name}</strong>}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={handleDeleteCancel}
            variant="contained"
            color="error"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Network;
