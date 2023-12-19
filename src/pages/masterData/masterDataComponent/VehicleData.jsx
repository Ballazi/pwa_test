import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
  viewVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../../../api/master-data/vehicle';
import AlertPage from '../../../components/masterData/alert-component/AlertPage';
import {
  pricingValidator,
  requiredValidator,
} from '../../../validation/common-validator';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';

const schema = yup.object().shape({
  name: requiredValidator('Vehicle Name'),
  type: requiredValidator('Vehicle Type'),
  wheels: pricingValidator('Wheels'),
  capacity: pricingValidator('Capacity'),
  distance: pricingValidator('Travel Distance Per Day'),
});

function CustomPagination(props) {
  const exportValue = [
    'name',
    'category',
    'type',
    'capacity',
    'distanceTravel',
  ];
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',

          // padding: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '25px',
            padding: '8px',
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

// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarExport />
//     </GridToolbarContainer>
//   );
// }

const VehicleData = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const columns = [
    // { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'category', headerName: 'Wheels', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'capacity', headerName: 'Capacity', width: 100 },
    {
      field: 'distanceTravel',
      headerName: 'Travel Distance / Day',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      align: 'center',
      headerAlign: 'center',
      width: 100,
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

  const [vehicles, setVehicles] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const closePopup = () => {
    setAlertType('');
    setMessage('');
  };

  const fetchData = () => {
    return viewVehicle()
      .then((data) => {
        if (data.success === true) {
          const updatedMaterials = data.data.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.wheels,
            type: item.type,
            capacity: item.capacity,
            distanceTravel: item.std_travel_dist_per_day,
          }));
          // Filter the data based on the search query
          const filterVehicle = updatedMaterials.filter(
            (vehicle) =>
              vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              vehicle.category
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              vehicle.capacity
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              vehicle.distanceTravel.toString().includes(searchQuery)
          );
          setVehicles(filterVehicle);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
          setVehicles([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleAddVehicle = (form_data) => {
    const data = {
      type: form_data.type.toUpperCase(),
      name: form_data.name.toUpperCase(),
      wheels: parseInt(form_data.wheels),
      capacity: parseInt(form_data.capacity),
      std_travel_dist_per_day: parseInt(form_data.distance),
    };
    createVehicle(data)
      .then((data) => {
        if (data.success === true) {
          const updatedMaterials = {
            id: data.data.id,
            name: data.data.name,
            category: data.data.wheels,
            type: data.data.type,
            capacity: data.data.capacity,
            distanceTravel: data.data.std_travel_dist_per_day,
          };
          setVehicles((preData) => [updatedMaterials, ...preData]);
          // fetchData();
          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          );
          setValue('type', '');
          setValue('name', '');
          setValue('wheels', '');
          setValue('capacity', '');
          setValue('distance', '');
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setSelectedVehicle(null);
    setEditDialogOpen(false);
  };

  const handleEditSave = () => {
    if (
      !selectedVehicle.name ||
      !selectedVehicle.type ||
      !selectedVehicle.category ||
      !selectedVehicle.capacity ||
      !selectedVehicle.distanceTravel ||
      selectedVehicle.name.trim() === '' ||
      selectedVehicle.type.trim() === ''
    ) {
      setAlertType('error');
      setMessage('Please fill all the Vehicle Data');
    } else {
      const data = {
        type: selectedVehicle.type.toUpperCase(),
        name: selectedVehicle.name.toUpperCase(),
        wheels: parseInt(selectedVehicle.category),
        capacity: parseInt(selectedVehicle.capacity),
        std_travel_dist_per_day: parseInt(selectedVehicle.distanceTravel),
      };
      updateVehicle(selectedVehicle.id, data)
        .then((data) => {
          if (data.success === true) {
            fetchData();
            dispatch(
              openSnackbar({ type: 'success', message: data.clientMessage })
            );
            setSelectedVehicle(null);
            setEditDialogOpen(false);
          } else {
            dispatch(
              openSnackbar({ type: 'error', message: data.clientMessage })
            );
          }
        })
        .catch((error) => {
          console.error('Error', error);
        });
    }
  };

  const handleDeleteClick = (vehicleId) => {
    setSelectedVehicle(vehicles.find((vehicle) => vehicle.id === vehicleId));
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteVehicle(selectedVehicle.id)
      .then((data) => {
        if (data.success === true) {
          handleDeleteCancel();
          fetchData();
          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          );
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedVehicle(null);
  };

  // Edit dialog content JSX
  const editDialogContent = (
    <div>
      <TextField
        label="Edit Vehicle Name *"
        size="small"
        fullWidth
        value={selectedVehicle ? selectedVehicle.name : ''}
        onChange={(e) =>
          setSelectedVehicle((prevState) => ({
            ...prevState,
            name: e.target.value,
          }))
        }
        style={{ marginBottom: '20px' }}
      />
      {/* Additional text input fields */}
      <TextField
        label="Edit Wheels *"
        size="small"
        type="number"
        fullWidth
        value={selectedVehicle ? selectedVehicle.category : ''}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (/^\d+(\.\d+)?$/.test(inputValue) && parseFloat(inputValue) > 0) {
            setSelectedVehicle((prevState) => ({
              ...prevState,
              category: inputValue,
            }));
          } else {
            setSelectedVehicle((prevState) => ({ ...prevState, category: '' }));
          }
        }}
        style={{ marginBottom: '20px' }}
      />

      <TextField
        label="Edit Type *"
        size="small"
        fullWidth
        value={selectedVehicle ? selectedVehicle.type : ''}
        onChange={(e) =>
          setSelectedVehicle((prevState) => ({
            ...prevState,
            type: e.target.value,
          }))
        }
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Edit Capacity *"
        size="small"
        type="number"
        fullWidth
        value={selectedVehicle ? selectedVehicle.capacity : ''}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (/^\d+(\.\d+)?$/.test(inputValue) && parseFloat(inputValue) > 0) {
            setSelectedVehicle((prevState) => ({
              ...prevState,
              capacity: inputValue,
            }));
          } else {
            setSelectedVehicle((prevState) => ({ ...prevState, capacity: '' }));
          }
        }}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Edit Travel Distance Per Day *"
        size="small"
        type="number"
        fullWidth
        value={selectedVehicle ? selectedVehicle.distanceTravel : ''}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (/^\d+(\.\d+)?$/.test(inputValue) && parseFloat(inputValue) > 0) {
            setSelectedVehicle((prevState) => ({
              ...prevState,
              distanceTravel: inputValue,
            }));
          } else {
            setSelectedVehicle((prevState) => ({
              ...prevState,
              distanceTravel: '',
            }));
          }
        }}
        style={{ marginBottom: '20px' }}
      />
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
    <Card style={{ padding: '10px' }}>
      {alertType !== '' ? (
        <AlertPage
          alertType={alertType}
          message={message}
          closePopup={closePopup}
        />
      ) : null}
      <CardContent>
        <div className="customCardheader">
          <Typography variant="h4"> Vehicle Data</Typography>
        </div>
        <form onSubmit={handleSubmit(handleAddVehicle)}>
          <Card style={{ marginTop: '20px', padding: '10px' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label=" Vehicle Name*"
                        size="small"
                        fullWidth
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="wheels"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Wheels*"
                        type="number"
                        size="small"
                        fullWidth
                        error={Boolean(errors.wheels)}
                        helperText={errors.wheels?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="type"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Vehicle Type*"
                        size="small"
                        fullWidth
                        error={Boolean(errors.type)}
                        helperText={errors.type?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="capacity"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Capacity*"
                        type="number"
                        size="small"
                        fullWidth
                        error={Boolean(errors.capacity)}
                        helperText={errors.capacity?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Controller
                    name="distance"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Travel Distance Per Day*"
                        type="number"
                        size="small"
                        fullWidth
                        error={Boolean(errors.distance)}
                        helperText={errors.distance?.message}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={8}>
                  <TextField
                    label="Travel Distance Per Day"
                    type='number'
                    size="small"
                    fullWidth
                    value={newVehicle.distanceTravel}
                    onChange={e => handleNewVehicleChange('distanceTravel', e.target.value)}
                  />
                </Grid> */}
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Button variant="contained" type="submit">
                  Add Vehicle
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </form>
        <div style={{ width: '100%', marginTop: '20px' }}>
          <div className="customCardheader">
            <Typography variant="h4"> Vehicle Table</Typography>
          </div>
          <div>
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <div
                    style={{
                      marginBottom: '20px',
                      position: 'relative',
                      marginLeft: 'auto',
                      width: '40%',
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
                  rows={vehicles}
                  columns={columns}
                  pageSize={5}
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
          <Typography variant="h4"> Edit Vehicle </Typography>
        </div>

        <DialogContent>{editDialogContent}</DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <div className="customCardheader">
          <Typography variant="h4">Delete Vehicle</Typography>
        </div>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the vehicle{' '}
            {selectedVehicle && <strong>: {selectedVehicle.name}</strong>}?
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

export default VehicleData;
