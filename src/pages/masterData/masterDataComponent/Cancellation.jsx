import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogActions,
  Tooltip,
  IconButton,
  DialogContent,
  Container,
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
  createCancelReason,
  updateCancelReason,
  deleteCancelReason,
  viewCancelReason,
} from '../../../api/master-data/cancel-reason';

import AlertPage from '../../../components/masterData/alert-component/AlertPage';
import { requiredValidator } from '../../../validation/common-validator';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';

const schema = yup.object().shape({
  type: requiredValidator('Cancellation type'),
  desc: requiredValidator('Cancellation desc'),
});

// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarExport />
//     </GridToolbarContainer>
//   );
// }

function CustomPagination(props) {
  const exportValue = ['type', 'desc'];
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

const Cancellation = () => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const columns = [
    // { field: 'id', headerName: 'ID', width: 50 },

    { field: 'type', headerName: 'Cancellation Type', width: 250 },

    { field: 'desc', headerName: 'Description ', width: 400 },
    {
      field: 'actions',
      headerName: 'Actions',
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

  const [Reason, setReason] = useState([
    // { id: 1, type: 'Type-A', desc: 'Lack of truck' },
  ]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const closePopup = () => {
    setAlertType('');
    setMessage('');
  };

  const fetchData = () => {
    return viewCancelReason()
      .then((data) => {
        if (data.success === true) {
          const updatedReasons = data.data.map((item) => ({
            id: item.id,
            type: item.type,
            desc: item.desc,
          }));
          const filterReason = updatedReasons.filter(
            (reason) =>
              reason.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              reason.desc.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setReason(filterReason);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
          setReason([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleAddReason = (form_data) => {
    // console.log(form_data.type);
    // console.log(form_data.desc);
    const data = {
      type: form_data.type.toUpperCase(),
      desc: form_data.desc.toUpperCase(),
    };
    createCancelReason(data)
      .then((data) => {
        // console.log(data);
        if (data.success === true) {
          const updatedMaterials = {
            id: data.data.id,
            type: data.data.type,
            desc: data.data.desc,
          };
          setReason((preData) => [updatedMaterials, ...preData]);
          // fetchData();
          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          );
          setValue('type', '');
          setValue('desc', '');
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
  const handleEditClick = (reasons) => {
    setSelectedReason(reasons);
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setSelectedReason(null);
    setEditDialogOpen(false);
  };
  const handleEditSave = () => {
    if (
      !selectedReason.type ||
      !selectedReason.desc ||
      selectedReason.type.trim() === '' ||
      selectedReason.desc.trim() === ''
    ) {
      setAlertType('error');
      setMessage('Please fill in both the Reason Type and Description.');
    } else {
      const data = {
        type: selectedReason.type.toUpperCase(),
        desc: selectedReason.desc.toUpperCase(),
      };
      updateCancelReason(selectedReason.id, data)
        .then((data) => {
          if (data.success === true) {
            fetchData();
            dispatch(
              openSnackbar({ type: 'success', message: data.clientMessage })
            );

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
  const handleDeleteClick = (reasonsId) => {
    setSelectedReason(Reason.find((reasons) => reasons.id === reasonsId));
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    deleteCancelReason(selectedReason.id)
      .then((data) => {
        // console.log('ok');

        if (data.success === true) {
          setDeleteDialogOpen(false);
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

    setSelectedReason(null);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedReason(null);
  };

  //edit dialog box
  const editDialogContent = (
    <div>
      <TextField
        label="Edit Reason Type *"
        size="small"
        fullWidth
        value={selectedReason ? selectedReason.type : ''}
        onChange={(e) =>
          setSelectedReason((prevState) => ({
            ...prevState,
            type: e.target.value,
          }))
        }
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Edit Reason Description *  "
        size="small"
        fullWidth
        value={selectedReason ? selectedReason.desc : ''}
        onChange={(e) =>
          setSelectedReason((prevState) => ({
            ...prevState,
            desc: e.target.value,
          }))
        }
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
    <Container>
      {alertType !== '' ? (
        <AlertPage
          alertType={alertType}
          message={message}
          closePopup={closePopup}
        />
      ) : (
        ''
      )}
      <Grid container>
        <Grid item sm={12}>
          <Card style={{ padding: '10px' }}>
            <CardContent>
              <div className="customCardheader">
                <Typography variant="h4">
                  {' '}
                  Cancellation Reason Information
                </Typography>
              </div>
              <form onSubmit={handleSubmit(handleAddReason)}>
                <Card style={{ marginTop: '20px', padding: '10px' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <Controller
                          name="type"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Cancellation Type *"
                              size="small"
                              fullWidth
                              error={Boolean(errors.type)}
                              helperText={errors.type?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item sm={6}>
                        <Controller
                          name="desc"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Description *"
                              size="small"
                              fullWidth
                              error={Boolean(errors.desc)}
                              helperText={errors.desc?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justifyContent="flex-end"
                      alignItems="center"
                      sx={{ mt: 2 }}
                    >
                      <Button variant="contained" type="submit">
                        Add Reason
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>
              </form>
              <div style={{ width: '100%', marginTop: '20px' }}>
                <div className="customCardheader">
                  <Typography variant="h4">
                    Cancellation Reason Table
                  </Typography>
                </div>
                <div>
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
                              label="Search"
                              size="small"
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
                          rows={Reason}
                          columns={columns}
                          pageSize={1}
                          components={{
                            pagination: CustomPagination,
                            // toolbar: CustomToolbar,
                          }}
                        />
                      </div>
                    </>
                  </div>
                </div>
              </div>

              {/* // edit dialog */}
              <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <div className="customCardheader">
                  <Typography variant="h4">
                    {' '}
                    Edit Cancellation Reason
                  </Typography>
                </div>

                <DialogContent>{editDialogContent}</DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <div className="customCardheader">
                  <Typography variant="h4">
                    {' '}
                    Delete Cancellation Reason
                  </Typography>
                </div>
                <DialogContent>
                  {selectedReason && (
                    <Typography>
                      Are you sure you want to delete the Reason :{' '}
                      <strong>{selectedReason.type}</strong>?
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleDeleteConfirm}
                    variant="contained"
                    color="error"
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={handleDeleteCancel}
                    variant="contained"
                    color="primary"
                  >
                    No
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cancellation;
