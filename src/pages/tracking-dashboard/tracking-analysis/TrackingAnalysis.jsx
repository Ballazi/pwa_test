import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: '20-09-2023',
    completed: 4000,
    inprogress: 2400,
    cancelled: 1000,
    dcrequire: 2400,
    dcdone: 2000,
  },
  {
    name: '21-09-2023',
    completed: 3000,
    inprogress: 1398,
    cancelled: 500,
    dcrequire: 2210,
    dcdone: 1000,
  },
  {
    name: '22-09-2023',
    completed: 2000,
    inprogress: 9800,
    cancelled: 3000,
    dcrequire: 2290,
    dcdone: 5000,
  },
  {
    name: '23-09-2023',
    completed: 2780,
    inprogress: 3908,
    cancelled: 1000,
    dcrequire: 2000,
    dcdone: 2700,
  },
  {
    name: '24-09-2023',
    completed: 1890,
    inprogress: 4800,
    cancelled: 4000,
    dcrequire: 2181,
    dcdone: 700,
  },
  {
    name: '25-09-2023',
    completed: 2390,
    inprogress: 3800,
    cancelled: 1000,
    dcrequire: 2500,
    dcdone: 2800,
  },
  {
    name: '26-09-2023',
    completed: 3490,
    inprogress: 4300,
    cancelled: 1500,
    dcrequire: 2100,
    dcdone: 2100,
  },
];

const TrackingAnalysis = ({ trackingAnalysisData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={trackingAnalysisData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          horizontal={true}
          vertical={false}
          stroke="rgba(229, 230, 235, 1)"
        />
        <XAxis dataKey="x-axis-label" />
        <YAxis axisLine={false} />
        <Tooltip />
        <Legend
          align="left"
          verticalAlign="top"
          iconSize={10}
          iconType="circle"
          layout="horizontal"
          height={50}
        />
        <Bar dataKey="inprogress" stackId="a" fill="#065AD8" barSize={30} />
        <Bar
          dataKey="completed_count"
          stackId="a"
          fill="#6599E7"
          barSize={30}
        />
        <Bar
          dataKey="cancelled_count"
          stackId="a"
          fill="#22CAC6"
          barSize={30}
        />
        <Bar dataKey="dc_require" stackId="a" fill="#9FE8E7" barSize={30} />
        <Bar dataKey="dc_done" stackId="a" fill="#E2F8F8" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TrackingAnalysis;
