import React, { useState, useEffect } from 'react'
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Container
} from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridPagination } from '@mui/x-data-grid'
import DeleteIcon from "@mui/icons-material/Delete";
import AlertPage from '../../../components/masterData/alert-component/AlertPage';
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { createCurrency, deleteCurrency, updateCurrency, viewCurrency } from '../../../api/master-data/currency';
import { viewCountry } from '../../../api/master-data/country';
import { requiredValidator } from '../../../validation/common-validator';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup"
import ErrorTypography from '../../../components/typography/ErrorTypography';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';

const schema = yup.object().shape({
    currency_name: requiredValidator("Currency Name"),
    country_name: requiredValidator("Country Name")
})

// function CustomToolbar() {
//     return (
//         <GridToolbarContainer>
//             <GridToolbarExport />
//         </GridToolbarContainer>
//     );
// }

function CustomPagination(props) {
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
                    <GridToolbarExport />

                </div>
                <div>
                    <GridPagination{...props} />
                </div>
            </div>

        </>
    );
}

const Currency = () => {
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
        { field: 'name', headerName: 'Currency Name', width: 250 },
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

    const [Currency, setCurrency] = useState([])
    const [country, setCountry] = useState([])

    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
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
                    // console.log(countryResponse)

                    setCountry(countryResponse.data)
                    // console.log(country)

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
        return viewCurrency()
            .then((data) => {
                if (data.success === true) {
                    const updatedCurrency = data.data.map(item => ({
                        id: item.id,
                        name: item.name,
                        country: item.country.name,
                        country_id: item.country.id

                    }))
                    setCurrency(updatedCurrency)
                }
                else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                    setCurrency([])
                }
            })
            .catch((error) => {
                console.error("Error", error)
            })
    }


    useEffect(() => {
        fetchData();
        countryData()
    }, [])



    const handleAddCurrency = (form_data) => {


        const data = {

            country_id: form_data.country_name,
            name: form_data.currency_name,
        }
        createCurrency(data)
            .then((data) => {
                if (data.success === true) {
                    fetchData();
                    countryData()
                    dispatch(
                        openSnackbar({ type: 'success', message: data.clientMessage })
                    )
                    setValue('currency_name', '')
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


    }
    const handleEditClick = (currency) => {
        // console.log(currency)
        setSelectedCurrency({ ...currency }); // Make a copy of the currency data
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setSelectedCurrency(null)
        setEditDialogOpen(false)
    }
    const handleEditSave = () => {
        if (!selectedCurrency.name || !selectedCurrency.country || selectedCurrency.name.trim() === "" || selectedCurrency.country.trim() === "") {
            setAlertType("error")
            setMessage("Please type a valid currency name")
        }
        else {
            const data = {
                "name": selectedCurrency.name,
                "country_id": selectedCurrency.country_id
            }
            updateCurrency(selectedCurrency.id, data)
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
    const handleDeleteClick = CurrenciesId => {
        setSelectedCurrency(Currency.find(Currencies => Currencies.id === CurrenciesId))
        setDeleteDialogOpen(true)
    }
    const handleDeleteConfirm = () => {
        deleteCurrency(selectedCurrency.id)
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
        setSelectedCurrency(null)
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false)
        setSelectedCurrency(null)
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
                    value={selectedCurrency ? selectedCurrency.country : ''}
                    onChange={(e) =>
                        setSelectedCurrency((prevState) => ({
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
                label='Currency Name *'
                size='small'
                fullWidth
                value={selectedCurrency ? selectedCurrency.name : ''}
                onChange={(e) =>
                    setSelectedCurrency((prevState) => ({
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
                                <Typography variant="h4">  Currency Information</Typography>
                            </div>
                            <form onSubmit={handleSubmit(handleAddCurrency)}>
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


                                                                labelId='country_label'
                                                                id='country_name'
                                                                label="Country Name *"
                                                                fullWidth
                                                                size='small'

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
                                                    name='currency_name'
                                                    control={control}
                                                    defaultValue=''
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label=' Currency Name *'
                                                            size='small'
                                                            fullWidth
                                                            error={Boolean(errors.currency_name)}
                                                            helperText={errors.currency_name?.message}
                                                        />
                                                    )}
                                                />


                                            </Grid>


                                        </Grid>
                                        <Grid container justifyContent="flex-end" alignItems="center" sx={{ mt: 2 }}>
                                            <Button variant="contained" type='submit'>
                                                Add Currency
                                            </Button>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </form>
                            <div style={{ width: '100%', marginTop: '20px' }}>
                                <div className="customCardheader">
                                    <Typography variant='h4'>
                                        Currency Table
                                    </Typography>
                                </div>
                                <div className='customDataGridTable'>

                                    {Currency.length !== 0 ?
                                        <DataGrid rows={Currency} columns={columns} pageSize={5} headerClassName="custom-header"
                                            components={{
                                                pagination: CustomPagination,
                                                // toolbar: CustomToolbar,

                                            }}
                                        />
                                        :
                                        <div style={{ textAlign: 'center' }}>
                                            <Typography variant='h6'>No Data to Display</Typography>
                                        </div>
                                    }
                                </div>

                            </div>

                            {/* // edit dialog */}
                            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Edit Currency</Typography>
                                </div>

                                <DialogContent>{editDialogContent}</DialogContent>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Delete Currency</Typography>
                                </div>
                                <DialogContent>
                                    {selectedCurrency && (
                                        <Typography>
                                            Are you sure you want to delete the Currency : <strong>{selectedCurrency.name}</strong>?
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

export default Currency