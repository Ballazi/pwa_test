import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, IconButton, Tooltip, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { DataGrid } from "@mui/x-data-grid";
import FilterComponent from '../../../components/masterData/filter-component/FilterComponent';
import EpodDetails from './epodDetails/EpodDetails';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { viewEPOD } from '../../../api/delivery/epod';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';


export default function Epod() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [epod, setEpod] = useState([])
  const dispatch = useDispatch()


  const columns = [

    { field: 'tracking_id', headerName: 'Tracking ID ', width: 150 },
    { field: 'branch_name', headerName: 'Branch Name', width: 150 },
    { field: 'start_date', headerName: 'Start Date', width: 150 },
    { field: 'vehicle_no', headerName: 'Vehicle No', width: 150 },
    { field: 'driver_contact', headerName: 'Driver Contact', width: 150 },
    { field: 'source', headerName: 'Source', width: 150 },
    { field: 'destination', headerName: 'Destination', width: 150 },
    { field: 'transporter_name', headerName: 'Transporter Name', width: 150 },
    { field: 'transporter_number', headerName: 'Transporter Number', width: 150 },
    { field: 'epod_type', headerName: 'Epod Type', width: 150 },
    
    // { field: 'companyName', headerName: 'Company Name', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (

        <Tooltip title="View">
          <IconButton
            onClick={() => handleActionClick(params.row)}
            aria-label="delete"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>


      ),
    },
  ];

  const fetchData = () => {
    return viewEPOD()
      .then((data) => {
        if (data.success === true) {
          console.log(data)
          const updatedEpod = data.data.map((item) => ({
            id: item.tracking_id,
            tracking_id: item.tracking_id,
            branch_name: item.branch_name,
            start_date: item.start_date,
            vehicle_no: item.vehicle_no,
            driver_contact: item.driver_contact,
            source: item.source,
            destination: item.destination,
            transporter_name: item.transporter_name,
            transporter_number: item.transporter_number,
            epod_type:item.epod_type

          }))

          setEpod(updatedEpod)
        }
        else {
          dispatch(
            openSnackbar({
              type: 'error',
              message: data.clientMessage
            })
          )
          setEpod([])
        }
      })
      .catch((error) => {
        console.error("error", error)
      })
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleActionClick = (row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setOpenModal(false);
  };

  return (
    <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
      <div className="customCardheader">
        <Typography variant="h4"> Manage EPOD </Typography>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <FilterComponent />
        </Grid>
      </Grid>
      <Card sx={{ marginTop: '20px' }}>
        <CardContent>
          <div className="customCardheader">
            <Typography variant="h4">EPOD Table</Typography>
          </div>
          <Grid
            container
            justifyContent="flex-end"
            style={{ width: "100%", marginBottom: "10px", marginTop: "20px" }}
          >
            <Grid item md={8} >
              <Typography variant="h5">
                Filter By : AlL Shipper, AlL Brach , All Cluster/Region
              </Typography>

            </Grid>
            <Grid item md={4}>
              <TextField
                label="Search"
                size="small"

                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <div style={{ height: 400, width: '100%', }}>
            <div className='customDataGridTable'>
              {epod.length !== 0 ? (
                <DataGrid
                  // getRowId={(epod) => epod.trackingId}
                  rows={epod} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />

              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Typography variant='h6'>No Data to Display</Typography>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {selectedRow && (
      <EpodDetails openModal={openModal} handleCloseModal={handleCloseModal} selectedRow={selectedRow} />
      )}
    </Container>
  );
}
