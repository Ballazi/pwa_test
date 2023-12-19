import { useState, useEffect } from 'react';
import {
  TextField,
  TableRow,
  Autocomplete,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../../redux/slices/snackbar-slice';
import FleetDeleteModal from './FleetDeatilModal';

export default function FleetTableSingleRow({
  masterFleets,
  index,
  key,
  fleet,
  saveFleetDetails,
  masterFleetsCopy,
  handleDelete,
}) {
  const [ownedVehicle, setOwnedVehicle] = useState(fleet.no_of_owned);
  const [leasedVehicle, setLeasedVehicle] = useState(fleet.no_of_leased);
  const [isEdit, setIsEdit] = useState(
    fleet.no_of_owned === '0' && fleet.no_of_leased === '0' ? true : false
  );
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [deletedFleetModalOpen, setDeletedFleetModalOpen] = useState(false);
  const transp_id = localStorage.getItem('transp_id');
  const dispatch = useDispatch();

  useEffect(() => {
    if (fleet?.mtf_fleet_id) {
      const selectedFleet = masterFleets.filter(
        (item) => item.value === fleet.mtf_fleet_id
      );
      setSelectedFleet(selectedFleet[0]);
    }
  }, []);

  const handleSave = () => {
    if (selectedFleet === null) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Please assign a fleet!',
        })
      );
    } else if (ownedVehicle === '' || parseInt(ownedVehicle) < 0) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Please assign a valid number of owned vehicles!',
        })
      );
    } else if (leasedVehicle === '' || parseInt(leasedVehicle) < 0) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Please assign a valid number of leased vehicles!',
        })
      );
    } else if (parseInt(ownedVehicle) === 0 && parseInt(leasedVehicle) === 0) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Both owned and leased vehicle values cannot be zero',
        })
      );
    } else {
      setIsEdit(false);
      if (transp_id) {
        saveFleetDetails({
          ...fleet,
          is_updated: true,
          no_of_owned: ownedVehicle,
          no_of_leased: leasedVehicle,
          mtf_fleet_id: selectedFleet.value,
        });
      } else {
        saveFleetDetails({
          ...fleet,
          no_of_owned: ownedVehicle,
          no_of_leased: leasedVehicle,
          mtf_fleet_id: selectedFleet.value,
        });
      }
    }
  };

  const handleDeleteFleet = () => {
    setDeletedFleetModalOpen(true);
  };

  const handleFleetChange = (_, newValue) => {
    setSelectedFleet(newValue);
  };

  const handleDeleteFleetDetails = () => {
    handleDelete(fleet);
    setDeletedFleetModalOpen(false);
  };

  return (
    <TableRow
      key={key}
      // key={fleet.mtf_fleet_id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell align="left" sx={{ borderLeft: 0, borderRight: 0 }}>
        {index + 1}
      </TableCell>
      <TableCell align="left" sx={{ borderLeft: 0, borderRight: 0 }}>
        {isEdit ? (
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={masterFleetsCopy}
            size="small"
            popupIcon={<KeyboardArrowDownIcon />}
            clearIcon={null}
            value={selectedFleet}
            onChange={handleFleetChange}
            //   sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Vehicle Name" variant="filled" />
            )}
          />
        ) : (
          <Typography>
            {
              masterFleets.filter(
                (item) => item.value === fleet.mtf_fleet_id
              )[0]?.label
            }
          </Typography>
        )}
      </TableCell>
      <TableCell
        align="right"
        sx={{ borderLeft: 0, borderRight: 0, width: 200 }}
      >
        {isEdit ? (
          <TextField
            id="outlined-basic-vehicle"
            label="No. of owned vehicles"
            size="small"
            variant="filled"
            type="number"
            value={ownedVehicle}
            onChange={(e) => setOwnedVehicle(e.target.value)}
          />
        ) : (
          <Typography>{ownedVehicle}</Typography>
        )}
      </TableCell>
      <TableCell
        align="right"
        sx={{ borderLeft: 0, borderRight: 0, width: 200 }}
      >
        {isEdit ? (
          <TextField
            id="outlined-basic-vehicle-2"
            label="No. of leased vehicles"
            size="small"
            variant="filled"
            type="number"
            value={leasedVehicle}
            onChange={(e) => setLeasedVehicle(e.target.value)}
          />
        ) : (
          <Typography>{leasedVehicle}</Typography>
        )}
      </TableCell>
      <TableCell
        align="center"
        sx={{ borderLeft: 0, borderRight: 0, width: 200 }}
      >
        {isEdit ? (
          <IconButton aria-label="edit" color="primary" onClick={handleSave}>
            <SaveIcon sx={{ color: '#209342' }} />
          </IconButton>
        ) : (
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => setIsEdit(true)}
          >
            <EditIcon />
          </IconButton>
        )}
        <IconButton aria-label="delete" onClick={handleDeleteFleet}>
          <DeleteIcon sx={{ color: '#C83000' }} />
        </IconButton>
      </TableCell>
      <FleetDeleteModal
        open={deletedFleetModalOpen}
        handleClose={() => setDeletedFleetModalOpen(false)}
        handleDelete={handleDeleteFleetDetails}
      />
    </TableRow>
  );
}
