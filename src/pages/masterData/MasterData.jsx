// import React, { useState } from 'react';
// import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, Container, Grid } from '@mui/material';
// import MaterialData from './masterDataComponent/MaterialData';
// import Network from './masterDataComponent/Network';
// import VehicleData from './masterDataComponent/VehicleData';
// import Cancellation from './masterDataComponent/Cancellation';
// import User from './masterDataComponent/User';
// import RolesAndAccess from './masterDataComponent/RolesAndAccess';
// import Currency from './masterDataComponent/Currency';
// import UOM from './masterDataComponent/UOM';
// import License from './masterDataComponent/License';
// import Region from './masterDataComponent/Region';
// import Role from './masterDataComponent/Role';

// export default function MasterData() {
//   const [selectedMaster, setSelectedMaster] = useState('material');

//   const handleSelectChange = (event) => {
//     setSelectedMaster(event.target.value);
//   };

//   const renderSelectedMaster = () => {
//     switch (selectedMaster) {
//       case 'material':
//         return <MaterialData />;
//       case 'vehicle':
//         return <VehicleData />;
//       case 'network':
//         return <Network />;
//       case 'cancellation':
//         return <Cancellation />
//       case 'user':
//         return <User />
//       case 'roleAccess':
//         return <RolesAndAccess />
//       // case 'country':
//       //   return <Country />
//       case 'currency':
//         return <Currency />
//       case 'uom':
//         return <UOM />
//       case 'license':
//         return <License />
//       case 'region':
//         return <Region />
//       // case 'state':
//       //   return <State />
//       case 'role':
//         return <Role />
//       // case 'comments':
//       //   return <Comments />
//       default:
//         return null;
//     }
//   };

//   return (
//     <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
//       <Grid container spacing={1} >
//         <Grid item sm={12} md={3} xs={12}>
//           <Card style={{ padding: "10px" }}>
//             <CardContent>
//               <div className="customCardheader">
//                 <Typography variant="h4"> Select system master </Typography>
//               </div>

//               <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
//                 <InputLabel id="master-select-label">Select </InputLabel>
//                 <Select
//                   labelId="master-select-label"
//                   id="master-select"
//                   value={selectedMaster}
//                   onChange={handleSelectChange}
//                   label="Select Master"
//                 >
//                   <MenuItem value="material">Manage Material</MenuItem>
//                   <MenuItem value="network">Manage Network Provider </MenuItem>
//                   <MenuItem value="vehicle">Manage Vehicle</MenuItem>
//                   <MenuItem value='user'>Manage User   </MenuItem>
//                   <MenuItem value='cancellation'>Manage Cancellation Reason </MenuItem>
//                   <MenuItem value='roleAccess'>Manage Roles and access  </MenuItem>
//                   {/* <MenuItem value='country'>Manage Country   </MenuItem> */}
//                   <MenuItem value='currency'> Manage Currency   </MenuItem>
//                   <MenuItem value='uom'> Manage UOM   </MenuItem>
//                   <MenuItem value='license'>Manage License   </MenuItem>
//                   <MenuItem value='region'>Manage Region </MenuItem>
//                   {/* <MenuItem value='state'>Manage State</MenuItem> */}
//                   <MenuItem value='role'>Manage Role</MenuItem>
//                   {/* <MenuItem value='comments'>Manage Comments</MenuItem> */}
//                 </Select>
//               </FormControl>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item sm={12} md={9} xs={12}>
//           <div>
//             {renderSelectedMaster()}
//           </div>

//         </Grid>

//       </Grid>



//     </Container>
//   );
// }



import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Container,
  Grid,
  Input,
} from '@mui/material';
import MaterialData from './masterDataComponent/MaterialData';
import Network from './masterDataComponent/Network';
import VehicleData from './masterDataComponent/VehicleData';
import Cancellation from './masterDataComponent/Cancellation';
import User from './masterDataComponent/User';
import RolesAndAccess from './masterDataComponent/RolesAndAccess';
import Currency from './masterDataComponent/Currency';
import UOM from './masterDataComponent/UOM';
import License from './masterDataComponent/License';
import Region from './masterDataComponent/Region';
import Role from './masterDataComponent/Role';

// Your list of master data options
const masterDataOptions = [
  { value: 'material', label: 'Manage Material' },
  { value: 'network', label: 'Manage Network Provider' },
  { value: 'vehicle', label: 'Manage Vehicle' },
  // { value: 'user', label: 'Manage User' },
  { value: 'cancellation', label: 'Manage Cancellation Reason' },
  { value: 'role', label: 'Manage Role' },
  // { value: 'roleAccess', label: 'Manage Roles and access' },
  { value: 'uom', label: 'Manage UOM' },
  // { value: 'license', label: 'Manage License' },
  { value: 'region', label: 'Manage Region' },
  // Add more options as needed
];

export default function MasterData() {
  const [selectedMaster, setSelectedMaster] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(masterDataOptions);

  const handleSelectChange = (event) => {
    setSelectedMaster(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    const input = event.target.value.toLowerCase()
    setSearchInput(input);
    ;

    const filtered = masterDataOptions.filter((option) =>
      option.label.toLowerCase().includes(input)
    );

    setFilteredOptions(filtered)
    if (filtered.length === 1) {
      setSelectedMaster(filtered[0].value);
    }

  }
  const renderSelectedMaster = () => {
    switch (selectedMaster) {
      // Your switch cases...
      case 'material':
        return <MaterialData />;
      case 'vehicle':
        return <VehicleData />;
      case 'network':
        return <Network />;
      case 'cancellation':
        return <Cancellation />
      // case 'user':
      //   return <User />
      case 'role':
        return <Role />
      // case 'roleAccess':
      //   return <RolesAndAccess />

      case 'currency':
        return <Currency />
      case 'uom':
        return <UOM />
      // case 'license':
      //   return <License />
      case 'region':
        return <Region />



      default:
        return null;
    }
  };
  useEffect(() => {
    if (filteredOptions.length > 1) {
      setSelectedMaster(filteredOptions[0].value);
    } else if (filteredOptions.length === 0) {
      setSelectedMaster('');
    }
  }, [filteredOptions]);
  const renderDropdownLabel = () => {
    if (searchInput !== '' && filteredOptions.length > 0) {
      return `Search Results for "${searchInput}"`;
    }
    return 'Select Master';
  };

  const renderDropdownOptions = () => {
    if (searchInput === '') {
      return filteredOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ));
    } else if (filteredOptions.length > 0) {
      return filteredOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ));
    } else {
      return (
        <MenuItem value="" disabled>
          No Data Found
        </MenuItem>
      );
    }
  };

  return (
    <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
      <Grid container spacing={1}>
        <Grid item sm={12} md={3} xs={12}>
          <Card style={{ padding: '10px' }}>
            <CardContent>
              <div className="customCardheader">
                <Typography variant="h4">Select system master</Typography>
              </div>

              <Input
                placeholder="Search"
                fullWidth
                value={searchInput}
                onChange={handleSearchInputChange}
                sx={{ marginTop: 2 }}
              />
              <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
                {/* <InputLabel id="master-select-label">
                  {renderDropdownLabel()}
                </InputLabel> */}
                <Select
                  labelId="master-select-label"
                  id="master-select"
                  value={selectedMaster}
                  onChange={handleSelectChange}
                  label={renderDropdownLabel()}
                  input={<Input />}
                >
                  {renderDropdownOptions()}
                </Select>
              </FormControl>

            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} md={9} xs={12}>
          <div>{renderSelectedMaster()}</div>
        </Grid>
      </Grid>
    </Container>
  );
}
