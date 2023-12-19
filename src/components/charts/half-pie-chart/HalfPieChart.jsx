import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

const COLORS = ['#065AD8', '#22CAC6', '#9FE8E7'];

const HalfPieChart = ({ data, height }) => {
  const total = data?.reduce((acc, entry) => acc + entry.value, 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          startAngle={180}
          endAngle={0}
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
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
            const percentage = (entry.payload.value / total) * 100;
            return `${entry.payload.name} - ${parseInt(percentage)}%`;
          }}
          wrapperStyle={{}}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default HalfPieChart;
