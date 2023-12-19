import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

const COLORS = ['#065AD8', '#0FC6C2', '#A7E5E5'];

const TransporterAnalysisPieChart = ({ transporterAnalysisChartData }) => {
  console.log('inside transport', transporterAnalysisChartData);
  const total = transporterAnalysisChartData?.reduce(
    (acc, entry) => acc + entry.value,
    0
  );
  const isSmallScreen = window.innerWidth < 600;

  return (
    <ResponsiveContainer width="100%" height={385}>
      <PieChart>
        <Pie
          data={transporterAnalysisChartData}
          cx="50%"
          cy="50%"
          paddingAngle={1}
          dataKey="value"
        >
          {transporterAnalysisChartData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          align={isSmallScreen ? 'center' : 'right'}
          verticalAlign={isSmallScreen ? 'bottom' : 'middle'}
          iconSize={10}
          iconType="circle"
          layout={isSmallScreen ? 'horizontal' : 'vertical'}
          formatter={(value, entry) => {
            if (entry.payload.value === 0) {
              return `${entry.payload.name} - 0%`;
            } else {
              const percentage = (entry.payload.value / total) * 100;
              return `${entry.payload.name} - ${parseInt(percentage)}%`;
            }
          }}
          //   wrapperStyle={isSmallScreen ? {} : {}}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TransporterAnalysisPieChart;
