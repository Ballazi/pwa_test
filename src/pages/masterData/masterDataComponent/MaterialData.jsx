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
  viewMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../../../api/master-data/material";
import AlertPage from "../../../components/masterData/alert-component/AlertPage";
import { requiredValidator } from "../../../validation/common-validator";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
// import { saveAs } from 'file-saver'

const schema = yup.object().shape({
  name: requiredValidator("Material name"),
  // type: requiredValidator("Material type"),
});

// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>

//     </GridToolbarContainer>
//   );
// }

const MaterialData = () => {
  // Define columns for the DataGrid
  const columns = [
    // { field: 'id', headerName: 'ID', width: 200 },
    { field: "name", headerName: "Material Name", width: 400 },
    // { field: 'type', headerName: 'Type', width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
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

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // State for new material entry
  // const [newMaterial, setNewMaterial] = useState({ name: '', type: '' });

  // State for list of materials
  const [materials, setMaterials] = useState([]);

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // State for delete confirmation dialog and selected material
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const closePopup = () => {
    setAlertType("");
    setMessage("");
  };

  const fetchData = () => {
    return viewMaterials()
      .then((data) => {
        if (data.success === true) {
          const updatedMaterials = data.data.map((item) => ({
            id: item.id,
            // type: item.type,
            name: item.name,
          }));

          // Filter the data based on the search query
          const filterMaterial = updatedMaterials.filter((material) =>
            material.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setMaterials(filterMaterial);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
          setMaterials([]);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  // const handleExportCSV = () => {
  //   const csvData = materials.map((row) =>
  //     columns.map((column) => row[column.field]).join(',')
  //   );

  //   const csvContent = [
  //     columns.map((column) => column.headerName).join(','),
  //     ...csvData,
  //   ].join('\n');

  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  //   saveAs(blob, 'data.csv');
  // };

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

  // Handle adding new material
  const handleAddMaterial = (form_data) => {
    console.log("sas");
    const data = {
      // "type": form_data.type,
      name: form_data.name.toUpperCase(),
    };
    createMaterial(data)
      .then((data) => {
        if (data.success === true) {
          const updatedMaterials = {
            id: data.data.id,
            // type: item.type,
            name: data.data.name,
          };
          setMaterials((preData) => [updatedMaterials, ...preData]);
          dispatch(
            openSnackbar({ type: "success", message: data.clientMessage })
          );
          setValue("name", "");
          // setValue('type', '')
        } else {
          dispatch(
            openSnackbar({ type: "error", message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  // Handle clicking the edit button
  const handleEditClick = (material) => {
    setSelectedMaterial(material);
    setEditDialogOpen(true);
  };

  // Handle closing the edit dialog
  const handleEditDialogClose = () => {
    setSelectedMaterial(null);
    setEditDialogOpen(false);
  };

  // Handle saving changes in the edit dialog
  const handleEditSave = () => {
    if (!selectedMaterial.name || selectedMaterial.name.trim() === "") {
      setAlertType("error");
      setMessage("Please type a valid material name");
    } else {
      const data = {
        // "type": selectedMaterial.type,
        name: selectedMaterial.name.toUpperCase(),
      };
      updateMaterial(selectedMaterial.id, data)
        .then((data) => {
          if (data.success === true) {
            // const updatedMaterials ={
            //   id: data.data.id,
            //   // type: item.type,
            //   name: data.data.name,
            // };
            // const filteredData = materials.filter(ele => ele.id !== selectedMaterial.id);
            // setMaterials([updatedMaterials, ...filteredData]);
            fetchData();
            dispatch(
              openSnackbar({ type: "success", message: data.clientMessage })
            );
            setSelectedMaterial(null);
            setEditDialogOpen(false);
          } else {
            dispatch(
              openSnackbar({ type: "error", message: data.clientMessage })
            );
          }
        })
        .catch((error) => {
          console.error("error", error);
        });
    }
  };

  // Handle clicking the delete button
  const handleDeleteClick = (materialId) => {
    setSelectedMaterial(
      materials.find((material) => material.id === materialId)
    );
    setDeleteDialogOpen(true);
  };

  // Handle confirming material deletion
  const handleDeleteConfirm = () => {
    deleteMaterial(selectedMaterial.id)
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

  // Handle canceling material deletion
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedMaterial(null);
  };

  // Edit dialog content JSX
  const editDialogContent = (
    <div>
      <TextField
        label="Edit Material Name *"
        size="small"
        fullWidth
        value={selectedMaterial ? selectedMaterial.name : ""}
        onChange={(e) =>
          setSelectedMaterial((prevState) => ({
            ...prevState,
            name: e.target.value,
          }))
        }
        style={{ marginBottom: "20px" }}
      />
      {/* <TextField
        label="Edit Material Type  *"
        size="small"
        fullWidth
        value={selectedMaterial ? selectedMaterial.type : ''}
        onChange={e => setSelectedMaterial(prevState => ({ ...prevState, type: e.target.value }))}
        style={{ marginBottom: '20px' }}
      /> */}

      <DialogActions>
        <Button variant="contained" type="submit" onClick={handleEditSave}>
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
        {/* Header */}
        <div className="customCardheader">
          <Typography variant="h4"> Material Data</Typography>
        </div>

        {/* Add Material Section */}
        {/* <form onSubmit={handleSubmit(handleAddMaterial)}> */}
        <form onSubmit={handleSubmit(handleAddMaterial)}>
          <Card style={{ marginTop: "20px", padding: "10px" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    sx={{ mb: 2 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Material Name *"
                        fullWidth
                        style={{ marginBottom: "20px" }}
                        sx={{ mb: 2 }}
                        error={Boolean(errors.name)}
                        size="small"
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>

                  <Controller
                    name="type"
                    control={control}
                    defaultValue=""
                    sx={{ mb: 2 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{ mb: 2 }}
                        label="Material Type *"
                        fullWidth
                        error={Boolean(errors.type)}
                        size="small"
                        helperText={errors.type?.message}
                      />
                    )}
                  /> */}

                {/* <TextField
                  label="Material Type"
                  size="small"
                  fullWidth
                  value={newMaterial.type}
                  onChange={e => handleNewMaterialChange('type', e.target.value)}
                /> */}
                {/* </Grid> */}
              </Grid>

              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Button variant="contained" type="submit">
                  Add Material
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </form>

        {/* Material Table */}
        <div style={{ width: "100%", marginTop: "20px" }}>
          <div className="customCardheader">
            <Typography variant="h4"> Material Table</Typography>
          </div>
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
            {materials.length != 0 ? (
              // <>
              <DataGrid
                rows={materials}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableColumnMenu
                disableRowSelectionOnClick
                components={{
                  pagination: CustomPagination,
                  // toolbar: CustomToolbar,
                }}
              />
            ) : (
              <div style={{ textAlign: "center" }}>
                {" "}
                <Typography variant="h6">No data to display</Typography>{" "}
              </div>
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <div className="customCardheader">
            <Typography variant="h4"> Edit Material</Typography>
          </div>

          <DialogContent>{editDialogContent}</DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <div className="customCardheader">
            <Typography variant="h4"> Delete Material</Typography>
          </div>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the material
              {selectedMaterial && <strong>: {selectedMaterial.name}</strong>}?
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
      </CardContent>
    </Card>
  );
};

export default MaterialData;
