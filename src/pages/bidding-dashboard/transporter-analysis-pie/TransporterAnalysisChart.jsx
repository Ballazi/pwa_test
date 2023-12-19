import { Box } from '@mui/material';
import TopContainerChart from '../trip-success-rate/TopContainerChart';
import TransporterAnalysisPieChart from './TransporterAnalysisPie';

export default function TransporterAnalysisChart({
  count,
  transporterAnalysisChartData,
}) {
  return (
    <Box
      sx={{
        background: '#ffffff',
        border: '0.5px solid #BDCCD3',
        borderRadius: '4px',
        py: 3,
        px: 3,
      }}
    >
      <TopContainerChart
        label="Transporter Analysis"
        subTitle="Total transporters: "
        count={count}
      />
      <Box>
        <TransporterAnalysisPieChart
          transporterAnalysisChartData={transporterAnalysisChartData}
        />
      </Box>
    </Box>
  );
}
