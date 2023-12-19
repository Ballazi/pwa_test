import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

const COLORS = ['#22CAC6', '#065AD8'];

const TripSuccessRate = ({ tripSuccessRateVales }) => {
  // useEffect(() => {
  //   console.log('check', stats);

  // }, []);
  const total = tripSuccessRateVales?.reduce(
    (acc, entry) => acc + entry.value,
    0
  );
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={tripSuccessRateVales}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          startAngle={180}
          endAngle={0}
          paddingAngle={0}
          dataKey="value"
        >
          {tripSuccessRateVales.map((entry, index) => (
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

export default TripSuccessRate;
