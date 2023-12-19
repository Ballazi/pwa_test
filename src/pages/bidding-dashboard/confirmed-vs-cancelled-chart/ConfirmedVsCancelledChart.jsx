import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Box } from '@mui/material';

const ConfirmedVsCancelledChart = ({ confirmedVsCancelledChartData }) => {
  const maxConfirmed = Math.max(
    ...confirmedVsCancelledChartData.map((item) => item.confirmed)
  );
  const maxCancelled = Math.max(
    ...confirmedVsCancelledChartData.map((item) => item.cancelled)
  );
  const maxYAxis = Math.max(maxConfirmed, maxCancelled);
  return (
    <Box width="100%" height={307}>
      <ResponsiveContainer width="100%">
        <AreaChart
          margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
          data={confirmedVsCancelledChartData}
        >
          <defs>
            <linearGradient id="confirmed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#065AD8" stopOpacity={0.17} />
              <stop offset="95%" stopColor="#065AD8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="cancelled" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0FC6C2" stopOpacity={0.17} />
              <stop offset="95%" stopColor="#0FC6C2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x-axis-label" stroke="rgba(134, 144, 156, 1)" />
          <YAxis
            domain={[0, maxYAxis]}
            stroke="rgba(134, 144, 156, 1)"
            axisLine={false}
          />
          <CartesianGrid
            // strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="rgba(229, 230, 235, 1)"
          />
          <Legend
            align="left"
            verticalAlign="top"
            iconSize={10}
            iconType="circle"
            layout="horizontal"
            height={50}
          />
          <Tooltip />
          <Area
            type="linear"
            dataKey="confirmed"
            stroke="#065AD8"
            fillOpacity={1}
            strokeWidth={2}
            fill="url(#confirmed)"
          />
          <Area
            type="linear"
            dataKey="cancelled"
            stroke="#0FC6C2"
            fillOpacity={1}
            strokeWidth={2}
            fill="url(#cancelled)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ConfirmedVsCancelledChart;
