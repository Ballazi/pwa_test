import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Grid,
    TextField,
    Button,
    Dialog,
    DialogActions,
    Tooltip,
    IconButton,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Container
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from "@mui/icons-material/Delete";
import AlertPage from '../../../components/masterData/alert-component/AlertPage';
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { createState, deleteState, updateState, viewState } from '../../../api/master-data/state';
import { viewCountry } from '../../../api/master-data/country';
import { requiredValidator } from '../../../validation/common-validator';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import ErrorTypography from '../../../components/typography/ErrorTypography';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';

const schema = yup.object().shape({
    state_name: requiredValidator("State Name"),
    country_name: requiredValidator("Country Name")
})
const State = () => {
    const {
        handleSubmit,
        setValue,
        formState: { errors },
        control
    } = useForm({
        resolver: yupResolver(schema)
    })
    const columns = [
        // { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'State Name', width: 250 },
        { field: 'country', headerName: 'Country Name', width: 250 },
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
    const [newState, setNewState] = useState({ name: '', country: '' })
    const [State, setState] = useState([])
    const [country, setCountry] = useState([])
    const [selectedCountry, setSelectedCountry] = useState('')
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [alertType, setAlertType] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch()

    const closePopup = () => {
        setAlertType("");
        setMessage("");
    };

    const countryData = () => {
        return viewCountry()
            .then((countryResponse) => {
                if (countryResponse.success === true) {
                    console.log(countryResponse)
                    // const updatedCountry = countryResponse.country.map((item) = ({
                    //     id: item.id,
                    //     label: item.name,
                    //     // country: item.country
                    // }))
                    setCountry(countryResponse.data)
                    console.log(country)

                }
                else {
                    dispatch(
                        openSnackbar({ type: 'error', message: countryResponse.clientMessage })
                    )
                    setCountry([])
                }
            })
            .catch((error) => {
                console.error("Error", error)
            })
    }
    // console.log("lalala", countryData)

    const fetchData = () => {
        return viewState()
            .then((data) => {
                if (data.success === true) {
                    const updatedState = data.data.map(item => ({
                        id: item.id,
                        name: item.name,
                        country: item.country.name,
                        country_id:item.country.id

                    }))
                    setState(updatedState)
                }
                else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                    setState([])
                }
            })
            .catch((error) => {
                console.error("Error", error)
            })
    }


    useEffect(() => {
        fetchData(),
            countryData()
    }, [])


    const handleCountryChange = (e) => {
        setCountry(e.target.value)
    }
    const handleNewStateChange = (field, value) => {
        setNewState(prevState => ({ ...prevState, [field]: value }))
    }
    const handleAddState = (form_data) => {


        var data = {

            country_id: form_data.country_name,
            name: form_data.state_name,
        }
        createState(data)
            .then((data) => {
                if (data.success === true) {
                    fetchData(),
                        countryData()
                    dispatch(
                        openSnackbar({ type: 'success', message: data.clientMessage })
                    )
                    setValue('state_name', '')
                    setValue('country_name', '')
                }
                else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                }
            })
            .catch((error) => {
                console.error("error", error)
                setMessage(error.detail)
            })
        setNewState({ name: '', country: '' })

    }
    const handleEditClick = (state) => {
        console.log(state)
        setSelectedState({ ...state }); // Make a copy of the state data
        setEditDialogOpen(true);
        console.log(selectedState)
    };
    // const handleEditClick = States => {
    //     const handleEditClick = (state) => {
    //         setSelectedState({ ...state }); // Make a copy of the state data
    //         setEditDialogOpen(true);
    //       };
    //     setSelectedState(States)
    //     setEditDialogOpen(true)
    // }
    const handleEditDialogClose = () => {
        setSelectedState(null)
        setEditDialogOpen(false)
    }
    const [editCountry, setEditCountry] = useState('')
    const handleEditSave = () => {
        if (!selectedState.name || !selectedState.country || selectedState.name.trim() === "" || selectedState.country.trim() === "") {
            setAlertType("error")
            setMessage("Please fill in both fields")
        }
        else {
            var data = {
                "name": selectedState.name,
                "country_id": selectedState.country_id
            }
            updateState(selectedState.id, data)
                .then((data) => {
                    if (data.success === true) {
                        fetchData()
                        dispatch(
                            openSnackbar({ type: 'success', message: data.clientMessage })
                        )
                        setNewState({ name: '', country: '' })
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
    const handleDeleteClick = StatesId => {
        setSelectedState(State.find(States => States.id === StatesId))
        setDeleteDialogOpen(true)
    }
    const handleDeleteConfirm = () => {
        deleteState(selectedState.id)
            .then((data) => {
                console.log("Okay")
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
        setSelectedState(null)
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false)
        setSelectedState(null)
    }

    //edit dialog box
    const editDialogContent = (
        <div>
            <FormControl fullWidth variant='outlined' size='small' style={{ marginBottom: '20px' }}>
                <InputLabel id='country_label'>Country Name *</InputLabel>
                <Select
                disabled
                    labelId='country_label'
                    id='country_name_edit'
                    name='country_name_edit'
                    value={selectedState ? selectedState.country : ''}
                    onChange={(e) =>
                        setSelectedState((prevState) => ({
                            ...prevState,
                            country: e.target.value,
                        }))
                    }
                    label='Country Name *'
                    fullWidth
                    size='small'
                >
                    {country.map((option) => (
                        <MenuItem onClick={() => setEditCountry(option.id)} key={option.id} value={option.name}>
                            {option.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.country_name_edit && (
                    <ErrorTypography>{errors.country_name_edit.message}</ErrorTypography>
                )}
            </FormControl>

            <TextField
                label='State Name *'
                size='small'
                fullWidth
                value={selectedState ? selectedState.name : ''}
                onChange={(e) =>
                    setSelectedState((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                    }))
                }
                style={{ marginBottom: '20px' }}
            />

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
            <Grid container >
                <Grid item sm={12}>
                    <Card style={{ padding: '10px' }}>
                        <CardContent>
                            <div className="customCardheader">
                                <Typography variant="h4">  State Information</Typography>
                            </div>
                            <form onSubmit={handleSubmit(handleAddState)}>
                                <Card style={{ marginTop: '20px', padding: '10px' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item sm={6}>
                                                <Controller
                                                    name='country_name'
                                                    control={control}
                                                    defaultValue=''
                                                    render={({ field }) => (
                                                        <FormControl
                                                            fullWidth
                                                            variant='outlined'
                                                            size='small'
                                                            error={Boolean(errors.country_name)}
                                                        >
                                                            <InputLabel id='country_label'>
                                                                Country Name *
                                                            </InputLabel>
                                                            <Select
                                                                {...field}
                                                                // value={country}
                                                                // onChange={handleCountryChange}

                                                                labelId='country_label'
                                                                id='country_name'
                                                                label="Country Name *"
                                                                fullWidth
                                                                size='small'
                                                            // error={Boolean(errors.country_name)}
                                                            // helperText={errors.country_name?.message}
                                                            >
                                                                {country.map((option) => (
                                                                    <MenuItem key={option.id} value={option.id}>
                                                                        {option.name}
                                                                    </MenuItem>
                                                                ))}


                                                            </Select>
                                                            {errors.country_name && (
                                                                <ErrorTypography>
                                                                    {errors.country_name.message}
                                                                </ErrorTypography>
                                                            )}
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item sm={6}>
                                                <Controller
                                                    name='state_name'
                                                    control={control}
                                                    defaultValue=''
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label=' State Name *'
                                                            size='small'
                                                            fullWidth
                                                            error={Boolean(errors.state_name)}
                                                            helperText={errors.state_name?.message}
                                                        />
                                                    )}
                                                />


                                            </Grid>


                                        </Grid>
                                        <Grid container justifyContent="flex-end" alignItems="center" sx={{ mt: 2 }}>
                                            <Button variant="contained" type='submit'>
                                                Add State
                                            </Button>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </form>
                            <div style={{ width: '100%', marginTop: '20px' }}>
                                <div className="customCardheader">
                                    <Typography variant='h4'>
                                        State Table
                                    </Typography>
                                </div>
                                {State.length !== 0 ?
                                    <DataGrid rows={State} columns={columns} pageSize={5} headerClassName="custom-header" />
                                    :
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography variant='h6'>No Data to Display</Typography>
                                    </div>
                                }

                            </div>

                            {/* // edit dialog */}
                            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Edit State</Typography>
                                </div>

                                <DialogContent>{editDialogContent}</DialogContent>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Delete State</Typography>
                                </div>
                                <DialogContent>
                                    {selectedState && (
                                        <Typography>
                                            Are you sure you want to delete the name State : <strong>{selectedState.name}</strong>?
                                        </Typography>
                                    )}
                                </DialogContent>
                                <DialogActions>

                                    <Button onClick={handleDeleteConfirm} variant='contained' color="error">Yes</Button>
                                    <Button onClick={handleDeleteCancel} variant='contained' color="primary">No</Button>
                                </DialogActions>
                            </Dialog>

                            {/* </Card> */}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>

    )
}

export default State