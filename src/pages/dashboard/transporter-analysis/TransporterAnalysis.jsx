import TransporterAnalysisChart from "./transporter-analysis-chart/TransporterAnalysisChart";
import TransporterAnalysisTable from "./transporter-analysis-table/TransporterAnalysisTable";
import Grid from "@mui/system/Unstable_Grid/Grid";

export default function TransporterAnalysis() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TransporterAnalysisTable />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TransporterAnalysisChart />
      </Grid>
    </Grid>
  );
}
