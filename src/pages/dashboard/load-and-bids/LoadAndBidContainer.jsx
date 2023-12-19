import { Grid } from "@mui/material";
import LoadAnalysis from "./load-analysis/LoadAnalysis";
import BidAnalysis from "./bid-analysis/BidAnalysis";

export default function LoadAndBidContainer() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <LoadAnalysis />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <BidAnalysis />
      </Grid>
    </Grid>
  );
}
