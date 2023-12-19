import { Grid } from "@mui/material";
import StatusCard from "./card/StatusCard";

const DUMMY_DATA = [
  {
    title: "Total",
    number: 10,
  },
  {
    title: "Live",
    number: 6,
  },
  {
    title: "Pending",
    number: 7,
  },
  {
    title: "Confirm",
    number: 6,
  },
  {
    title: "Cancel",
    number: 0,
  },
];
export default function StatusBar() {
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={3}>
      {DUMMY_DATA.map((item, index) => {
        return (
          <StatusCard title={item.title} number={item.number} key={index} />
        );
      })}
    </Grid>
  );
}
