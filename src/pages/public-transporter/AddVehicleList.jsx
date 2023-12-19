import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Button,
  TableBody,
  // TableFooter,
} from '@mui/material';
import AddVehicleSingleRow from './AddVehicleSingleRow';
import { fetchMasterFleets } from '../../api/register/transporter';

export default function AddVehicleList({
  handleNewFleets,
  newFleets,
  handleInsertFleet,
}) {
  const [masterFleets, setMasterFleets] = useState([]);
  useEffect(() => {
    fetchMasterFleets()
      .then((res) => {
        if (res.data.success) {
          console.log('res', res.data.data);
          const masterData = res.data.data.map((data) => {
            return {
              label: data.name,
              value: data.id,
            };
          });
          setMasterFleets(masterData);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log('fleet>>>>>>>>>>>', newFleets);
  }, [newFleets]);
  const handleAddFleet = () => {
    handleNewFleets('hi');
  };

  return (
    <Box sx={{ my: 3, border: '0.5px solid #BDCCD3', borderRadius: '4px' }}>
      <Grid container sx={{ alignItems: 'center', mb: 3, px: 2, mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Box display="flex" gap={2} alignItems="center">
            <Typography variant="h4">Vehicle List</Typography>
            <Button variant="outlined" onClick={handleAddFleet}>
              Add Vehicle
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid
            container
            sx={{ justifyContent: 'right', alignItems: 'center' }}
          >
            <Avatar
              sx={{
                background: '#E7EFFC',
                color: '#065AD8',
                fontWeight: 500,
                fontSize: 14,
                width: 32,
                height: 32,
                lineHeight: '20px',
              }}
            >
              {newFleets.length}
            </Avatar>
            <Typography
              sx={{ marginLeft: 1, color: '#95A7B8', fontWeight: 500 }}
            >
              Vehicle added
            </Typography>
            {/* <Button color="primary" sx={{ mx: 1 }}>
                Collapse list
              </Button> */}
          </Grid>
        </Grid>
      </Grid>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ background: '#E7EFFC' }}>
              <TableCell
                sx={{ color: '#969CA6', fontSize: '12px' }}
                align="left"
              >
                Sl No.
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                Vehicle type
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                No. of owned vehicles
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                No. of leased vehicles
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newFleets.map((fleet, index) => (
              <AddVehicleSingleRow
                masterFleets={masterFleets}
                fleet={fleet}
                index={index}
                key={fleet.create_id}
                handleInsertFleet={handleInsertFleet}
              />
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow
              sx={{
                '&:first-child td, &:first-child th': {
                  borderRight: 0,
                  borderLeft: 0,
                },
              }}
            >
              <TableCell align="left">
                <Typography>Total</Typography>
              </TableCell>
              <TableCell align=""></TableCell>
              <TableCell align="right">
                {newFleets
                  ?.map((item) => item.no_of_owned)
                  ?.reduce((acc, sum) => acc + sum, 0)}
              </TableCell>
              <TableCell align="right">
                {newFleets
                  ?.map((item) => item.no_of_leased)
                  ?.reduce((acc, sum) => acc + sum, 0)}
              </TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </TableContainer>
    </Box>
  );
}
