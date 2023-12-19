import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  // Brush,
} from 'recharts';

const HorizontalBarChart = ({ cancellationAnalysis }) => {
  console.log('hello', cancellationAnalysis);
  return (
    <div style={{ width: '100%', height: '380px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={cancellationAnalysis}
          layout="vertical"
          barSize={30}
          barGap={2}
        >
          <XAxis type="number" />
          <YAxis dataKey="reason" type="category" hide={true} />
          <Tooltip />
          {/* <Brush
            dataKey="reason"
            height={30}
            stroke="#0FC6C2"
            startIndex={0}
            endIndex={10}
          /> */}
          <Bar dataKey="count" fill="#065AD8">
            <LabelList
              dataKey="reason"
              position="insideRight"
              fill="#fff"
              style={{ fontSize: '9px' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarChart;
