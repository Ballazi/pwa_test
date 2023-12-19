import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridPagination } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { viewRegion, updateRegion, createRegion, deleteRegion } from "../../../api/master-data/region";
import AlertPage from "../../../components/masterData/alert-component/AlertPage";
import { requiredValidator } from "../../../validation/common-validator";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';

const schema = yup.object().shape({
    name: requiredValidator("Region name"),
    // details: requiredValidator("Region details"),
});

// function CustomToolbar() {
//     return (
//         <GridToolbarContainer>
//             <GridToolbarExport />
//         </GridToolbarContainer>
//     );
// }

function CustomPagination(props) {
    const exportValue = [
        'name'
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

const Region = () => {
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
        { field: "name", headerName: "Region Name", width: 400 },
        // { field: "details", headerName: "Details ", width: 250 },
        {
            field: "actions",
            headerName: "Actions",
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
    const [Region, setRegion] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [alertType, setAlertType] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch()
    const closePopup = () => {
        setAlertType("");
        setMessage("");
    };

    const fetchData = () => {

        return viewRegion({ isRegion: true })
            .then((data) => {
                if (data.success === true) {
                    const updatedRegions = data.data.map((item) => ({
                        id: item.id,
                        name: item.name,
                        // details: item.details,
                    }));
                    const filterRegion = updatedRegions.filter((region) =>
                        region.name.toLowerCase().includes(searchQuery.toLowerCase())

                    );
                    setRegion(filterRegion);
                } else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                    setRegion([]);
                }
            })
            .catch((error) => {
                console.error("Error", error);
            });
    };
    useEffect(() => {
        fetchData();
    }, [searchQuery]);


    const handleAddRegion = (form_data) => {

        const data = {
            name: form_data.name.toUpperCase(),
            // details: form_data.details,
        };
        createRegion(data)
            .then((data) => {
                // console.log(data)
                if (data.success === true) {
                    const updatedMaterials = {
                        id: data.data.id,
                        name: data.data.name,
                    };
                    setRegion((preData) => [updatedMaterials, ...preData]);
                    // fetchData();
                    dispatch(
                        openSnackbar({ type: 'success', message: data.clientMessage })
                    )
                    setValue('name', '')
                    // setValue('details', '')
                } else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                }
            })
            .catch((error) => {
                console.error("Error", error);
            });
        setNewRegion({ name: "" });
    };
    const handleEditClick = (regions) => {
        setSelectedRegion(regions);
        setEditDialogOpen(true);
    };
    const handleEditDialogClose = () => {
        setSelectedRegion(null);
        setEditDialogOpen(false);
    };
    const handleEditSave = () => {
        if (!selectedRegion.name || selectedRegion.name.trim() === "") {
            setAlertType("error")
            setMessage("Please type a valid region name")
        } else {
            const data = {
                name: selectedRegion.name.toUpperCase(),
                // details: selectedRegion.details,
            };
            updateRegion(selectedRegion.id, data)
                .then((data) => {
                    if (data.success === true) {
                        fetchData();
                        dispatch(
                            openSnackbar({ type: 'success', message: data.clientMessage })
                        )
                        setSelectedRegion(null)
                        setEditDialogOpen(false);
                    } else {
                        dispatch(
                            openSnackbar({ type: 'error', message: data.clientMessage })
                        )
                    }
                })
                .catch((error) => {
                    console.error("Error", error);
                });
        }
    };
    const handleDeleteClick = (regionsId) => {
        setSelectedRegion(Region.find((regions) => regions.id === regionsId));
        setDeleteDialogOpen(true);
    };
    const handleDeleteConfirm = () => {
        deleteRegion(selectedRegion.id)
            .then((data) => {
                // console.log("ok");

                if (data.success === true) {
                    setDeleteDialogOpen(false);
                    fetchData();
                    dispatch(
                        openSnackbar({ type: 'success', message: data.clientMessage })
                    )
                } else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                }
            })
            .catch((error) => {
                console.error("Error", error);
            });

        setSelectedRegion(null);
    };
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedRegion(null);
    };

    //edit dialog box
    const editDialogContent = (
        <div>
            <TextField
                label="Edit Region Name *"
                size="small"
                fullWidth
                value={selectedRegion ? selectedRegion.name : ""}
                onChange={(e) =>
                    setSelectedRegion((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                    }))
                }
                style={{ marginBottom: "20px" }}
            />
            {/* <TextField
                label="Edit Region Details *  "
                size="small"
                fullWidth
                value={selectedRegion ? selectedRegion.details : ""}
                onChange={(e) =>
                    setSelectedRegion((prevState) => ({
                        ...prevState,
                        details: e.target.value,
                    }))
                }
                style={{ marginBottom: "20px" }}
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
                <Grid item sm={12}>
                    <Card style={{ padding: "10px" }}>
                        <CardContent>
                            <div className="customCardheader">
                                <Typography variant="h4"> Region Information</Typography>
                            </div>
                            <form onSubmit={handleSubmit(handleAddRegion)}>
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
                                                            label="Region Name *"
                                                            size="small"
                                                            fullWidth
                                                            error={Boolean(errors.name)}
                                                            helperText={errors.name?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* <Grid item sm={6}>
                                                <Controller
                                                    name="details"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Details *"
                                                            size="small"
                                                            fullWidth
                                                            error={Boolean(errors.details)}
                                                            helperText={errors.details?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid> */}

                                        </Grid>
                                        <Grid
                                            container
                                            justifyContent="flex-end"
                                            alignItems="center"
                                            sx={{ mt: 2 }}
                                        >
                                            <Button variant="contained" type='submit'>
                                                Add Region
                                            </Button>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </form>
                            <div style={{ width: "100%", marginTop: "20px" }}>
                                <div className="customCardheader">
                                    <Typography variant="h4">Region Table</Typography>
                                </div>
                                <div >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <div style={{ marginBottom: '20px', position: 'relative', marginLeft: 'auto', width: '40%' }}>
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
                                    <div className='customDataGridTable'>

                                        <DataGrid rows={Region} columns={columns} pageSize={1}
                                            components={{
                                                pagination: CustomPagination,
                                                // toolbar: CustomToolbar,

                                            }}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* // edit dialog */}
                            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Edit Region</Typography>
                                </div>

                                <DialogContent>{editDialogContent}</DialogContent>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Delete Region</Typography>
                                </div>
                                <DialogContent>
                                    {selectedRegion && (
                                        <Typography>
                                            Are you sure you want to delete the Region :{" "}
                                            <strong>{selectedRegion.name}</strong>?
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

export default Region;