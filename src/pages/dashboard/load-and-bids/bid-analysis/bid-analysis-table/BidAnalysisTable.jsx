import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "year",
    headerName: "Year",
    width: 150,
  },
  {
    field: "totalBid",
    headerName: "Total Bid",
    width: 150,
  },
  {
    field: "avaerageBid",
    headerName: "Average Bid",
    width: 110,
  },
];

const rows = [
  { id: 1, year: "2020", totalBid: 100022, avaerageBid: 3.5 },
  { id: 2, year: "2021", totalBid: 220000, avaerageBid: 4.2 },
  { id: 3, year: "2022", totalBid: 120000, avaerageBid: 4.5 },
  { id: 4, year: "2020", totalBid: 140000, avaerageBid: 1.6 },
  { id: 5, year: "2021", totalBid: 150000, avaerageBid: 2.47 },
  { id: 6, year: "2020", totalBid: 176300, avaerageBid: 1.5 },
  { id: 7, year: "2021", totalBid: 189000, avaerageBid: 4.4 },
  { id: 8, year: "2022", totalBid: 276899, avaerageBid: 3.6 },
  { id: 9, year: "2023", totalBid: 157800, avaerageBid: 6.5 },
];

export default function BidAnalysisTable() {
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
