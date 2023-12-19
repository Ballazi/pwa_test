import { Card, CardContent, Typography, Grid, styled } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#042656",
  height: 80,
  textAlign: "center",
  cursor: "pointer",
  color: "#fff",
  transition: "300ms ease-out background-color",
  "&:hover": {
    color: "#042656",
    backgroundColor: "#fff",
  },
}));

export default function ActionCard(props) {
  return (
    <Grid item xs={12} sm={12} md={2.4} lg={2.4}>
      <StyledCard key={props.key}>
        <CardContent>
          {/* <img
            src={props.image}
            alt={props.alt}
            style={{ width: "30px", height: "30px" }}
          /> */}
          {props.image}
          <Typography variant="h6" gutterBottom>
            {props.title}
          </Typography>
        </CardContent>
      </StyledCard>
    </Grid>
  );
}
