import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Grid, TextField, Button, Dialog, DialogActions, Tooltip, IconButton, DialogContent, Container } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { createCountry, deleteCountry, updateCountry, viewCountry } from '../../../api/master-data/country';
import AlertPage from '../../../components/masterData/alert-component/AlertPage';
import { requiredValidator } from '../../../validation/common-validator';
import * as yup from "yup"
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';

const schema = yup.object().shape({
    name: requiredValidator("Country Name")
})

const Country = () => {
    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    })
    const columns = [
        // { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Name', width: 550 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: params => (
                <div>
                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => handleEditClick(params.row)}
                        >
                            <BorderColorIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteClick(params.row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }
    ]
   
    const [Country, setCountry] = useState([
        // { id: 1, name: 'India' }
    ])
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [alertType, setAlertType] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch()
    const closePopup = () => {
        setAlertType("");
        setMessage("");
    };

    const fetchData = () => {
        return viewCountry()
            .then((data) => {
                if (data.success === true) {
                    const updatedCountry = data.data.map(item => ({
                        id: item.id,
                        name: item.name
                    }))
                    setCountry(updatedCountry)
                }
                else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                    setCountry([])
                }
            })
            .catch((error) => {
                console.error("Error", error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

  
    const handleAddCountry = (form_data) => {


        const data = {
            name: form_data.name
        }
        createCountry(data)
            .then((data) => {
                if (data.success === true) {
                    fetchData()
                    dispatch(
                        openSnackbar({ type: 'success', message: data.clientMessage })
                    )
                    setValue('name', '')
                }
                else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                }
            })
            .catch((error) => {
                console.error("error", error)
            })
     

    }
    const handleEditClick = Countries => {
        setSelectedCountry(Countries)
        setEditDialogOpen(true)
    }
    const handleEditDialogClose = () => {
        setSelectedCountry(null)
        setEditDialogOpen(false)
    }
    const handleEditSave = () => {
        if (!selectedCountry.name || selectedCountry.name.trim() === "") {
            setAlertType("error")
            setMessage("Please fill the Country Name")
        }
        else {
            const data = {
                "name": selectedCountry.name
            }
            updateCountry(selectedCountry.id, data)
                .then((data) => {
                    if (data.success === true) {
                        fetchData()
                        dispatch(
                            openSnackbar({ type: 'success', message: data.clientMessage })
                        )
                       
                        setEditDialogOpen(false)
                    }
                    else {
                        dispatch(
                            openSnackbar({ type: 'error', message: data.clientMessage })
                        )
                    }
                })
                .catch((error) => {
                    console.error("Error", error)
                })
        }
    }
    const handleDeleteClick = CountriesId => {
        setSelectedCountry(Country.find(Countries => Countries.id === CountriesId))
        setDeleteDialogOpen(true)
    }
    const handleDeleteConfirm = () => {
        deleteCountry(selectedCountry.id)
            .then((data) => {
                // console.log("Okay")
                if (data.success === true) {
                    setDeleteDialogOpen(false)
                    fetchData()
                    dispatch(
                        openSnackbar({ type: 'success', message: data.clientMessage })
                    )
                }
                else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                }
            })
            .catch((error) => {
                console.error("Error", error)
            })
        setSelectedCountry(null)
    }
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false)
        setSelectedCountry(null)
    }

    //edit dialog box
    const editDialogContent = (
        <div>
            <TextField
                label="Edit Country Name *"
                size="small"
                fullWidth
                value={selectedCountry ? selectedCountry.name : ''}
                onChange={e => setSelectedCountry(prevState => ({ ...prevState, name: e.target.value }))}
                style={{ marginBottom: '20px' }}
            />
            <DialogActions>
                <Button onClick={handleEditSave} variant='contained'>Save</Button>
                <Button onClick={handleEditDialogClose} variant='contained' color='error'>Cancel</Button>
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
                ""
            )}
            <Grid container>

                <Grid item sm={12} md={12}>
                    <Card style={{ padding: '10px' }}>
                        <CardContent>
                            <div className="customCardheader">
                                <Typography variant="h4"> Country Information</Typography>
                            </div>
                            <form onSubmit={handleSubmit(handleAddCountry)}>
                                <Card style={{ marginTop: '20px', padding: '10px' }}>
                                    <CardContent>
                                        <Grid container>

                                            {/* <TextField size='small' /> */}
                                            <Controller
                                                name="name"
                                                control={control}
                                                defaultValue=""
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Country Name *"
                                                        fullWidth
                                                        size="small"
                                                        error={Boolean(errors.name)}
                                                        helperText={errors.name?.message}
                                                    />
                                                )}
                                            />



                                        </Grid>

                                        <Grid container justifyContent="right" sx={{ mt: 2 }}>
                                            <Button variant="contained" type='submit'>
                                                Add Country
                                            </Button>
                                        </Grid>


                                    </CardContent>
                                </Card>
                            </form>
                            <div style={{ width: '100%', marginTop: '20px' }}>
                                <div className="customCardheader">
                                    <Typography variant='h4'>
                                        Country Table
                                    </Typography>
                                </div>
                                {Country.length !== 0 ?
                                    <DataGrid rows={Country} columns={columns} pageSize={5} />
                                    :
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography variant='h6'>
                                            No Data To Display
                                        </Typography>
                                    </div>
                                }

                            </div>

                            {/* // edit dialog */}
                            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Edit Country</Typography>
                                </div>

                                <DialogContent>{editDialogContent}</DialogContent>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Delete Country</Typography>
                                </div>
                                <DialogContent>
                                    {selectedCountry && (
                                        <Typography>
                                            Are you sure you want to delete the country: <strong>{selectedCountry.name}</strong>?
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
            </Grid >

        </Container >

    )
}

export default Country