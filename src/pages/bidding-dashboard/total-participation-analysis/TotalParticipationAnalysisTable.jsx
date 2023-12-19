import { Box, styled } from '@mui/material';
import TopContainerChart from '../trip-success-rate/TopContainerChart';
import { DataGrid } from '@mui/x-data-grid';

export default function TotalParticipationAnalysisTable({
  transporterParticipationData,
}) {
  const columns = [
    {
      field: 'id',
      headerName: 'Sl No.',
      width: 90,
      editable: false,
      sortable: false,
    },
    {
      field: 'name',
      headerName: 'Transporter name',
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      field: 'participated',
      headerName: 'Participated',
      width: 100,
      type: 'number',
      editable: false,
      sortable: false,
    },
    {
      field: 'selected',
      headerName: 'Selected',
      type: 'number',
      width: 100,
      editable: false,
      sortable: false,
    },
    {
      field: 'cancelled',
      headerName: 'Cancelled',
      type: 'number',
      width: 100,
      editable: false,
      sortable: false,
    },
    {
      field: 'assignment_delay',
      headerName: 'Assignment delay(days)',
      type: 'number',
      sortable: false,
      editable: false,
      width: 180,
    },
  ];

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
  return (
    <>
      <Box
        sx={{
          background: '#ffffff',
          border: '0.5px solid #BDCCD3',
          borderRadius: '4px',
        }}
      >
        <Box sx={{ py: 3, px: 3 }}>
          <TopContainerChart
            label="Transporter Participation  Analysis"
            subTitle="Total transporters: "
            count={transporterParticipationData.length}
          />
        </Box>
        <StyledDataGrid
          rows={transporterParticipationData.map((item, index) => ({
            ...item,
            id: index + 1,
            cancelled: item?.participated - item?.selected,
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
        />
      </Box>
    </>
  );
}
