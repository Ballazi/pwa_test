import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function BasicCard({ children }) {
  return (
    <Card sx={{ width: 275 }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
