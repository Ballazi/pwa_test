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

const DelayAnalysis = ({ data }) => {
  const maxOntime = Math.max(...data.map((item) => item.ontime));
  const maxDelay = Math.max(...data.map((item) => item.delay_count));
  const maxYAxis = Math.max(maxOntime, maxDelay);
  return (
    <Box width="100%" height={320}>
      <ResponsiveContainer width="100%">
        <AreaChart
          margin={{ top: 10, right: 0, left: -33, bottom: 10 }}
          data={data}
        >
          <Legend
            align="right"
            verticalAlign="top"
            iconSize={10}
            iconType="circle"
            layout="horizontal"
            height={50}
          />
          <defs>
            <linearGradient id="ontime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#065AD8" stopOpacity={0.17} />
              <stop offset="95%" stopColor="#065AD8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="delay_count" x1="0" y1="0" x2="0" y2="1">
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
            horizontal={true}
            vertical={false}
            stroke="rgba(229, 230, 235, 1)"
          />

          <Tooltip />
          <Area
            type="linear"
            dataKey="ontime"
            stroke="#065AD8"
            fillOpacity={1}
            strokeWidth={2}
            fill="url(#ontime)"
          />
          <Area
            type="linear"
            dataKey="delay_count"
            stroke="#0FC6C2"
            fillOpacity={1}
            strokeWidth={2}
            fill="url(#delay_count)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DelayAnalysis;
