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
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    GridPagination,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
    createUOM,
    deleteUOM,
    updateUOM,
    viewUOM,
} from "../../../api/master-data/uom";
import AlertPage from "../../../components/masterData/alert-component/AlertPage";
import { requiredValidator } from "../../../validation/common-validator";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";

const schema = yup.object().shape({
    type: requiredValidator("UOM Type"),
});

// function CustomToolbar() {
//     return (
//         <GridToolbarContainer>
//             <GridToolbarExport />
//         </GridToolbarContainer>
//     );
// }

function CustomPagination(props) {
    const exportValue = ["type"];
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

const UOM = () => {
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
        { field: "type", headerName: "Type", width: 550 },
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
    const [UOM, setUOM] = useState([
        // { id: 1, type: 'MT' }
    ]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUOM, setSelectedUOM] = useState(null);
    const [alertType, setAlertType] = useState("");
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const closePopup = () => {
        setAlertType("");
        setMessage("");
    };

    const fetchData = () => {
        return viewUOM()
            .then((data) => {
                if (data.success === true) {
                    const updatedUOM = data.data.map((item) => ({
                        id: item.id,
                        type: item.type,
                    }));
                    const filterUOM = updatedUOM.filter((uom) =>
                        uom.type.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setUOM(filterUOM);
                } else {
                    dispatch(
                        openSnackbar({ type: "error", message: data.clientMessage })
                    );
                    // setUOM([])
                }
            })
            .catch((error) => {
                console.error("error", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const handleAddUOM = (form_data) => {
        // console.log(form_data.type);

        const data = {
            type: form_data.type.toUpperCase(),
        };
        createUOM(data)
            .then((data) => {
                if (data.success === true) {
                    const updatedMaterials = {
                        id: data.data.id,
                        type: data.data.type,
                    };
                    setUOM((preData) => [updatedMaterials, ...preData]);
                    // fetchData()
                    dispatch(
                        openSnackbar({ type: "success", message: data.clientMessage })
                    );
                    setValue("type", "");
                } else {
                    dispatch(
                        openSnackbar({ type: "error", message: data.clientMessage })
                    );
                }
            })
            .catch((error) => {
                console.error("error", error);
            });
        // setUOM({ type: '' })
    };
    const handleEditClick = (uoms) => {
        setSelectedUOM(uoms);
        setEditDialogOpen(true);
    };
    const handleEditDialogClose = () => {
        setSelectedUOM(null);
        setEditDialogOpen(false);
    };
    const handleEditSave = () => {
        if (!selectedUOM.type || selectedUOM.type.trim() === "") {
            dispatch(
                openSnackbar({ type: "error", message: "Please fill the UOM type" })
            );
        } else {
            // alert("ok")
            const data = {
                type: selectedUOM.type.toUpperCase(),
            };
            updateUOM(selectedUOM.id, data)
                .then((data) => {
                    if (data.success === true) {
                        fetchData();
                        dispatch(
                            openSnackbar({ type: "success", message: data.clientMessage })
                        );
                        setSelectedUOM(null);
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
    const handleDeleteClick = (uomsId) => {
        setSelectedUOM(UOM.find((uoms) => uoms.id === uomsId));
        setDeleteDialogOpen(true);
    };
    const handleDeleteConfirm = () => {
        deleteUOM(selectedUOM.id)
            .then((data) => {
                // console.log("okay")
                if (data.success === true) {
                    setDeleteDialogOpen(false);
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
                console.error("error", error);
            });
        setSelectedUOM(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedUOM(null);
    };

    //edit dialog box
    const editDialogContent = (
        <div>
            <TextField
                label="Edit UOM Type *"
                size="small"
                fullWidth
                value={selectedUOM ? selectedUOM.type : ""}
                onChange={(e) =>
                    setSelectedUOM((prevState) => ({
                        ...prevState,
                        type: e.target.value,
                    }))
                }
                style={{ marginBottom: "20px" }}
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
                <Grid item xs={12}>
                    <Card style={{ padding: "10px" }}>
                        <CardContent>
                            <div className="customCardheader">
                                <Typography variant="h4"> UOM Information</Typography>
                            </div>
                            <form onSubmit={handleSubmit(handleAddUOM)}>
                                <Card
                                    style={{ marginTop: "20px", padding: "10px", width: "100%" }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item sm={12}>
                                                <Controller
                                                    name="type"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="UOM Type *"
                                                            size="small"
                                                            fullWidth
                                                            error={Boolean(errors.type)}
                                                            helperText={errors.type?.message}
                                                        // value={newUOM.type}
                                                        // onChange={e => handleNewUOMChange('type', e.target.value)}
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
                                                Add UOM
                                            </Button>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </form>

                            <div style={{ width: "100%", marginTop: "20px" }}>
                                <div className="customCardheader">
                                    <Typography variant="h4">UOM Table</Typography>
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
                                                rows={UOM}
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

                            {/* // edit dialog */}
                            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Edit UOM</Typography>
                                </div>

                                <DialogContent>{editDialogContent}</DialogContent>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Delete UOM</Typography>
                                </div>
                                <DialogContent>
                                    {selectedUOM && (
                                        <Typography>
                                            Are you sure you want to delete the UOM:{" "}
                                            <strong>{selectedUOM.type}</strong>?
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

export default UOM;
