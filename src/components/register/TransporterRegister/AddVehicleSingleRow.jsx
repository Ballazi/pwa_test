import { useState, useEffect } from 'react';
import { TextField, TableRow, Autocomplete, TableCell } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function AddVehicleSingleRow({
  masterFleets,
  index,
  key,
  fleet,
  handleInsertFleet,
}) {
  const [ownedVehicle, setOwnedVehicle] = useState(fleet.no_of_owned);
  const [leasedVehicle, setLeasedVehicle] = useState(fleet.no_of_leased);
  const [selectedFleet, setSelectedFleet] = useState(masterFleets[0]);

  useEffect(() => {
    handleInsertFleet({
      ...fleet,
      no_of_leased: 0,
      no_of_owned: 0,
      mtf_fleet_id: masterFleets[0].value,
    });
  }, []);

  const handleOwnedVehicleChange = (event) => {
    let newValue = event.target.value;
    console.log('master fleet', fleet);
    if (!isNaN(newValue)) {
      newValue = parseFloat(newValue);

      if (newValue < 0) {
        newValue = 0;
      }
    } else {
      newValue = 0;
    }

    setOwnedVehicle(newValue);
    handleInsertFleet({
      ...fleet,
      mtf_fleet_id: selectedFleet.value,
      no_of_leased: leasedVehicle,
      no_of_owned: newValue,
    });
  };

  const handleLeasedVehicleChange = (event) => {
    let newValue = event.target.value;
    if (!isNaN(newValue)) {
      newValue = parseFloat(newValue);

      if (newValue < 0) {
        newValue = 0;
      }
    } else {
      newValue = 0;
    }
    setLeasedVehicle(newValue);
    handleInsertFleet({
      ...fleet,
      mtf_fleet_id: selectedFleet.value,
      no_of_owned: ownedVehicle,
      no_of_leased: newValue,
    });
  };
  const handleOwnedVehicleBlur = (e) => {
    if (e.target.value === '') {
      setOwnedVehicle(0);
      handleInsertFleet({
        ...fleet,
        mtf_fleet_id: selectedFleet.value,
        no_of_leased: leasedVehicle,
        no_of_owned: 0,
      });
    }
  };

  const handleLeasedVehicleBlur = (e) => {
    if (e.target.value === '') {
      setLeasedVehicle(0);
      handleInsertFleet({
        ...fleet,
        mtf_fleet_id: selectedFleet.value,
        no_of_owned: ownedVehicle,
        no_of_leased: 0,
      });
    }
  };

  const handleFleetChange = (_, newValue) => {
    console.log('new', newValue);
    handleInsertFleet({
      ...fleet,
      no_of_owned: ownedVehicle,
      no_of_leased: leasedVehicle,
      mtf_fleet_id: newValue.value,
    });
    setSelectedFleet(newValue);
  };

  return (
    <TableRow
      key={key}
      // key={fleet.mtf_fleet_id}
      // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell align="left" sx={{ borderLeft: 0, borderRight: 0 }}>
        {index + 1}
      </TableCell>
      <TableCell align="left" sx={{ borderLeft: 0, borderRight: 0 }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={masterFleets}
          size="small"
          popupIcon={<KeyboardArrowDownIcon />}
          clearIcon={null}
          value={selectedFleet}
          onChange={handleFleetChange}
          //   sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Vehicle type" variant="filled" />
          )}
        />
      </TableCell>
      <TableCell
        align="left"
        sx={{ borderLeft: 0, borderRight: 0, width: 200 }}
      >
        <TextField
          id="outlined-basic-vehicle"
          label="No. of owned vehicles"
          size="small"
          variant="filled"
          type="number"
          value={ownedVehicle}
          onChange={handleOwnedVehicleChange}
          onBlur={handleOwnedVehicleBlur}
        />
      </TableCell>
      <TableCell
        align="left"
        sx={{ borderLeft: 0, borderRight: 0, width: 200 }}
      >
        <TextField
          id="outlined-basic-vehicle-2"
          label="No. of leased vehicles"
          size="small"
          variant="filled"
          type="number"
          value={leasedVehicle}
          onChange={handleLeasedVehicleChange}
          onBlur={handleLeasedVehicleBlur}
        />
      </TableCell>
    </TableRow>
  );
}
