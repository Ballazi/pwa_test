import { Card, Dialog, DialogContent, DialogActions, Tooltip, IconButton, CardContent, Container, FormControl, Grid, InputLabel, TextField, Button, Typography, Select, MenuItem, Autocomplete } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { moduleValidator, requiredValidator } from '../../../validation/common-validator'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AlertPage from '../../../components/masterData/alert-component/AlertPage';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ErrorTypography from '../../../components/typography/ErrorTypography'
import { createRoleMaster, deleteRoleMaster, updateRoleMaster, viewRoleMaster, getModule } from '../../../api/master-data/roleMaster'
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridPagination } from '@mui/x-data-grid'
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { viewShiper } from '../../../api/master-data/user';
import { DateIcon, DropdownIcon } from '../../../utility/create-svg';
const schema = yup.object().shape({
    role_name: requiredValidator("Role Name"),
    module_ids: moduleValidator("Module Name")
})

// function CustomToolbar() {
//     return (
//         <GridToolbarContainer>
//             <GridToolbarExport />
//         </GridToolbarContainer>
//     );
// }

function CustomPagination(props) {
    const exportValue = [
        'role_name'
    ]
    return (
        <>

            <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',

                // padding: '8px',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '25px',
                    padding: '8px'
                }}>
                    <GridToolbarExport
                        csvOptions={{
                            fields: exportValue
                        }}
                    />

                </div>
                <div>
                    <GridPagination{...props} />
                </div>
            </div>

        </>
    );
}

const Role = () => {
    const {
        handleSubmit,
        setValue,
        formState: { errors },
        control
    } = useForm({
        resolver: yupResolver(schema)
    })

    const columns = [
        { field: 'role_name', headerName: 'Role Name', width: 550 },

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

                </div>
            ),
        },
    ]

    const [Role, setRole] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [alertType, setAlertType] = useState('');
    const [message, setMessage] = useState('');
    const [editedRole, setEditedRole] = useState({
        role_name: '',
        module_ids: [],
    });

    const dispatch = useDispatch();

    const closePopup = () => {
        setAlertType("");
        setMessage("");
    };

    const handleEditClick = (role) => {
        setSelectedRole({ ...role });
        setEditedRole({ ...role });
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (RolesId) => {
        setSelectedRole(Role.find((Roles) => Roles.id === RolesId));
        setDeleteDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setSelectedRole(null);
        setEditDialogOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedRole(null);
    };


    const fetchData = () => {
        return viewRoleMaster()
            .then((data) => {
                if (data.success === true) {
                    const updatedRole = data.data.map((item) => ({
                        id: item.id,
                        role_name: item.role_name,

                    }));
                    setRole(updatedRole);
                } else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    );
                    setRole([]);
                }
            })
            .catch((error) => {
                console.error('error', error);
            });
    };

    useEffect(() => {
        fetchData();

    }, []);




    const handleEditSave = () => {
        if (!editedRole.role_name || editedRole.role_name.trim() === "") {
            setAlertType('error');
            setMessage("Please fill the role name");
        } else {
            const data = {
                role_name: editedRole.role_name.toUpperCase(),

            };
            updateRoleMaster(selectedRole.id, data)
                .then((data) => {
                    if (data.success === true) {
                        fetchData();
                        dispatch(
                            openSnackbar({ type: 'success', message: data.clientMessage })
                        );
                        setSelectedRole(null);
                        setEditedRole({
                            role_name: '',
                            module_ids: [],
                        });
                        setEditDialogOpen(false);
                    } else {
                        dispatch(
                            openSnackbar({ type: 'error', message: data.clientMessage })
                        );
                    }
                })
                .catch((error) => {
                    console.error("error", error);
                });
        }
    };

    const handleDeleteConfirm = () => {
        deleteRoleMaster(selectedRole.id)
            .then((data) => {
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
                console.error("error", error);
            });
        setSelectedRole(null);
    };

    const editDialogContent = (
        <div>
            <TextField
                label='Role Name *'
                size='small'
                fullWidth
                value={editedRole.role_name}
                onChange={(e) =>
                    setEditedRole((prevRole) => ({
                        ...prevRole,
                        role_name: e.target.value,
                    }))
                }
                style={{ marginBottom: '20px' }}
            />

            {/* Include other fields or form elements for editing role attributes here if needed. */}

            <DialogActions>
                <Button onClick={handleEditSave} variant='contained'>
                    Save
                </Button>
                <Button onClick={handleEditDialogClose} variant='contained' color='error'>
                    Cancel
                </Button>
            </DialogActions>
        </div>
    );

    return (
        <Container>
            {alertType !== "" ? (
                <AlertPage
                    alertType={alertType}
                    message={message}
                    closePopup={closePopup}
                />
            ) : (
                null
            )}
            <Grid container>
                <Grid item sm={12}>
                    <Card style={{ padding: '10px' }}>
                        <CardContent>


                            <div style={{ width: '100%', marginTop: '20px' }}>
                                <div className='customCardheader'>
                                    <Typography variant='h4'>Role Table</Typography>
                                </div>
                                <div className='customDataGridTable'>

                                    {Role.length !== 0 ? (
                                        <DataGrid
                                            rows={Role}
                                            columns={columns}
                                            pageSize={5}
                                            headerClassName="custom-header"
                                            components={{
                                                pagination: CustomPagination,
                                                // toolbar: CustomToolbar,

                                            }}
                                        />
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <Typography variant='h6'>No Data to Display</Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Edit Role</Typography>
                                </div>
                                <DialogContent>{editDialogContent}</DialogContent>
                            </Dialog>
                            {/* Delete Confirmation Dialog */}
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Delete Role</Typography>
                                </div>
                                <DialogContent>
                                    {selectedRole && (
                                        <Typography>
                                            Are you sure you want to delete the name Role : <strong>{selectedRole.role_name}</strong>?
                                        </Typography>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDeleteConfirm} variant='contained' color="error">Yes</Button>
                                    <Button onClick={handleDeleteCancel} variant='contained' color="primary">No</Button>
                                </DialogActions>
                            </Dialog>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Role;
