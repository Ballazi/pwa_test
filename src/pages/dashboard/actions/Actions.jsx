import { Grid } from "@mui/material";
// import Group from "../../../assets/groups.png";
// import Person from "../../../assets/person.png";
// import Setting from "../../../assets/setting.png";
// import Truck from "../../../assets/truck.png";
// import WeightScale from "../../../assets/weight-scale.png";
import ActionCard from "./card/ActionCard";
import {
  Person4Outlined,
  LocalShippingOutlined,
  ScaleOutlined,
  Groups2Outlined,
  SettingsOutlined,
} from "@mui/icons-material";

const DUMMY_DATA = [
  {
    title: "Create load",
    image: <LocalShippingOutlined />,
    alt: "load create image",
  },
  {
    title: "Manage load",
    image: <ScaleOutlined />,
    alt: "load manage image",
  },
  {
    title: "Shipper profit",
    image: <Person4Outlined />,
    alt: "shipper profit image",
  },
  {
    title: "Manage Users",
    image: <Groups2Outlined />,
    alt: "manage Users image",
  },
  {
    title: "Settings",
    image: <SettingsOutlined />,
    alt: "settings image",
  },
];

export default function Actions() {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ my: 0 }}
      spacing={3}
    >
      {DUMMY_DATA.map((item, index) => (
        <ActionCard
          key={index}
          title={item.title}
          alt={item.alt}
          image={item.image}
        />
      ))}
    </Grid>
  );
}
