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
  TableBody,
  TableFooter,
} from '@mui/material';
export default function VehicleListTable({ fleets }) {
  return (
    <Box sx={{ my: 3, border: '0.5px solid #BDCCD3' }}>
      <Grid container sx={{ alignItems: 'center', mb: 3, px: 2, mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4">Vehicle list</Typography>
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
              {fleets?.length}
            </Avatar>
            <Typography
              sx={{ marginLeft: 1, color: '#95A7B8', fontWeight: 500 }}
            >
              vehicles added
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
                align="center"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                Vehicle Name
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                No. of owned vehicles
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                No. of leased vehicles
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fleets?.length > 0 ? (
              fleets?.map((fleet, index) => (
                <TableRow
                  key={fleet.mtf_fleet_id}
                  // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    align="left"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {fleet.fleet_name}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {fleet.no_of_owned}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {fleet.no_of_leased}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No fleet available</TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
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
                {fleets
                  ?.map((item) => item.no_of_owned)
                  ?.reduce((acc, sum) => acc + sum, 0)}
              </TableCell>
              <TableCell align="right">
                {fleets
                  ?.map((item) => item.no_of_leased)
                  ?.reduce((acc, sum) => acc + sum, 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
