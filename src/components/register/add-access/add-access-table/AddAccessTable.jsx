import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, styled, Typography, TextField } from '@mui/material';

const StyledDataGrid = styled(DataGrid)(() => ({
  border: '0px !important',
  '--unstable_DataGrid-radius': '0px',
  '& .MuiDataGrid-root': {
    borderRadius: '0px !important',
  },
  '& .MuiDataGrid-columnHeaders': {
    background: 'rgba(6, 90, 216, 0.10)',
    color: 'rgba(128, 142, 153, 1)',
    fontWeight: '500px',
  },
}));

const columns = [
  {
    field: 'id',
    headerName: 'Sl No.',
    width: 90,
    editable: false,
    sortable: false,
  },
  {
    field: 'role_name',
    headerName: 'Role name',
    width: 200,
    editable: false,
    sortable: false,
    renderCell: (params) => {
      return (
        <Typography
          sx={{
            whiteSpace: 'normal',
            fontSize: '12px',
            paddingTop: '16px',
            paddingBottom: '16px',
          }}
        >
          {params.row.role_name}
        </Typography>
      );
    },
  },
  {
    field: 'submodules',
    headerName: 'Accessible Menu',
    editable: false,
    sortable: false,
    flex: 1,
    renderCell: (params) => {
      return (
        <Typography
          sx={{
            whiteSpace: 'normal',
            paddingTop: '16px',
            paddingBottom: '16px',
            fontSize: '12px',
          }}
        >
          {params.row.submodules.map((item) => item.submodule_name).join(', ')}
        </Typography>
      );
    },
  },
];

export default function AddAccessTable({ roleData, handleSearchChangeProps }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    console.log(e);
    const { value } = e.target;
    handleSearchChangeProps(value);
    setSearchValue(value);
  };

  return (
    <>
      <Box display="flex" justifyContent="right" sx={{ marginBottom: '20px' }}>
        <TextField
          label="Search"
          size="small"
          value={searchValue}
          onChange={(e) => handleSearchChange(e)}
          variant="outlined"
          sx={{ width: 300 }}
          // fullWidth
        />
      </Box>

      <Box
        sx={{
          background: '#ffffff',
          border: '0.5px solid #BDCCD3',
          borderRadius: '4px',
        }}
      >
        <StyledDataGrid
          rows={roleData.map((item, index) => ({
            ...item,
            id: index + 1,
          }))}
          columns={columns}
          sx={{ border: 'none' }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          disableSelectionOnClick
          disableColumnSelector
          disableDensitySelector
          isRowSelectable={false}
          disableColumnMenu
          disableTool
          getRowHeight={() => 'auto'}
        />
      </Box>
    </>
  );
}
