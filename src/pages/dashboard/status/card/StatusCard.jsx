import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function StatusCard(props) {
  return (
    <Grid item xs={12} sm={12} md={2.4} lg={2.4}>
      <Card sx={{ height: 80, textAlign: "center" }} key={props.key}>
        <CardContent>
          <Typography color="text.secondary" variant="h6" gutterBottom>
            {props.title}
          </Typography>

          <Typography
            sx={{ mb: 1.5, color: "#1785EA", fontWeight: 600 }}
            variant="h3"
            color="text.secondary"
          >
            {props.number}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
