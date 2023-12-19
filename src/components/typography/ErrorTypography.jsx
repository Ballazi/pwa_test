import { Typography } from "@mui/material";

export default function ErrorTypography({ children }) {
  return (
    <Typography
      component="p"
      sx={{ color: "#d32f2f", margin: "4px 14px 0px", fontSize: "12px" }}
    >
      {children}
    </Typography>
  );
}
