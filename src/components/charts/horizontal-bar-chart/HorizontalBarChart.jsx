import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Brush,
} from 'recharts';

const HorizontalBarChartComponent = ({ data, datakeyProps, height }) => {
  const firstElement = datakeyProps[0];
  const secondElement = datakeyProps[1];
  console.log('hello', data, firstElement, height);
  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" barSize={30} barGap={2}>
          <XAxis type="number" />
          <YAxis dataKey={firstElement} type="category" hide={true} />
          <Tooltip />
          <Brush
            dataKey="reason"
            height={30}
            stroke="#0FC6C2"
            // startIndex={0}
            // endIndex={10}
          />
          <Bar dataKey={secondElement} fill="#065AD8">
            <LabelList
              dataKey={firstElement}
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

export default HorizontalBarChartComponent;
