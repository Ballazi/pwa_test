import { Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import styles from "./barchart.module.css";

const CustomBarLabel = ({ x, y, value }) => (
  <text
    x={x + 25}
    y={y - 15}
    dy={0}
    fontSize={12}
    textAnchor="middle"
    fill="#222"
  >
    {value}
  </text>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.padding}>{`Analysis: ${label}`}</p>
        <p className={styles.padding}>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const BarChartDashboard = (props) => {
  return (
    <Box width="100%" height={300}>
      <ResponsiveContainer width={"99%"} height={300}>
        <BarChart
          data={props.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e7e7" />
          <XAxis
            Line
            dataKey="name"
            stroke="#e2e7e7"
            fontSize={8}
            label={{
              value: "Load Analysis",
              position: "insideBottom",
              offset: -2,
              fontSize: 14,
              fontColor: "red",
            }}
            tick={{ fill: "#3C4257" }}
          />
          <YAxis
            domain={[0, 100]}
            fontSize={8}
            stroke="#e2e7e7"
            label={{
              value: "value",
              angle: -90,
              position: "insideLeft",
              offset: -6,
              fontSize: 14,
            }}
            tick={{ fill: "#3C4257" }}
          />
          <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }} />
          {/* <Legend

          iconSize={8}
          formatter={(value) => (
            <span style={{ color: "#00B17C", fontSize: 12, textAlign: "left" }}>
              {value}
            </span>
          )}
        /> */}
          <Bar
            dataKey="value"
            // fill="#00a0fc"
            radius={[6, 6, 0, 0]}
            maxBarSize={70}
            className={styles.bar}
          >
            {props.data.map((entry, index) => (
              <>
                <Cell key={`cell-${index}`} fill={entry.color} />
                <LabelList dataKey="value" content={CustomBarLabel} />
              </>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartDashboard;
