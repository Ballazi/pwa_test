import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

// const data = [
//   { name: 'Live', value: 55 },
//   { name: 'Confirm', value: 25 },
//   { name: 'Pending', value: 10 },
//   { name: 'Cancel', value: 15 },
// ];

const COLORS = ['#065AD8', '#0FC6C2', '#3DD6D1', '#A7E5E5'];

const TripAnalysisChart = ({ tripAnalysisData }) => {
  console.log('hi', tripAnalysisData);
  const total = tripAnalysisData?.reduce((acc, entry) => acc + entry.value, 0);
  return (
    <ResponsiveContainer width="100%" height={372}>
      <PieChart>
        <Pie
          data={tripAnalysisData}
          cx="50%"
          cy="50%"
          paddingAngle={1}
          dataKey="value"
        >
          {tripAnalysisData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          align="center"
          verticalAlign="bottom"
          iconSize={10}
          iconType="circle"
          layout="horizontal"
          formatter={(value, entry) => {
            if (entry.payload.value === 0) {
              return `${entry.payload.name} - 0%`;
            } else {
              const percentage = (entry.payload.value / total) * 100;
              return `${entry.payload.name} - ${parseInt(percentage)}%`;
            }
          }}
          wrapperStyle={{}}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TripAnalysisChart;
