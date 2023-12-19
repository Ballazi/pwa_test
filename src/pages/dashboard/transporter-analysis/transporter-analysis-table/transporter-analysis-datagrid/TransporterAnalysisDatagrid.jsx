import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 30 },
  {
    field: "lead",
    headerName: "Lead",
    width: 200,
  },
  {
    field: "participation",
    headerName: "Participation",
    width: 110,
  },
  {
    field: "selected",
    headerName: "Selected",
    width: 80,
  },
  {
    field: "failed",
    headerName: "Failed",
    width: 80,
  },
];

const rows = [
  {
    id: 1,
    lead: "Cruze Roadlines Pvt Ltd",
    participation: 1,
    selected: 0,
    failed: 0,
  },
  {
    id: 2,
    lead: "Easy India Freights",
    participation: 3,
    selected: 0,
    failed: 0,
  },
  {
    id: 3,
    lead: "New Kolkata Delhi Roadways",
    participation: 2,
    selected: 0,
    failed: 0,
  },
  { id: 4, lead: "Kusum Logistics", participation: 13, selected: 1, failed: 0 },
  {
    id: 5,
    lead: "Shri Balaji Roadlines",
    participation: 1,
    selected: 3,
    failed: 0,
  },
  {
    id: 6,
    lead: "Shubhajeet Logitics",
    participation: 1,
    selected: 0,
    failed: 0,
  },
  { id: 7, lead: "Balram Pvt Ltd", participation: 3, selected: 1, failed: 0 },
  { id: 8, lead: "Chiro Freights", participation: 1, selected: 0, failed: 0 },
  { id: 9, lead: "Humba logitics", participation: 2, selected: 1, failed: 0 },
];

export default function TransporterAnalysisDatagrid() {
  return (
    <Box sx={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
