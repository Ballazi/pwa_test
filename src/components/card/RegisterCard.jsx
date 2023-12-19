import { Paper, Box, Typography, styled } from "@mui/material";

const StyledWrapper = styled(Paper)(({ theme }) => ({
  border: "0.5px solid #D2D9DD",
  boxShadow: "none",
  borderRadius: "8px",
  paddingLeft: "60px",
  paddingRight: "60px",
  paddingTop: "40px",
  paddingBottom: "40px",
  marginBottom: "16px",
  [theme.breakpoints.down("md")]: {
    paddingLeft: "32px",
    paddingRight: "32px",
    paddingTop: "16px",
    paddingBottom: "16px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "24px",
    paddingRight: "24px",
    paddingTop: "16px",
    paddingBottom: "16px",
  },
}));

export default function RegisterCard({ title, children }) {
  return (
    <StyledWrapper>
      <Box>
        {title && <Typography style={{ marginBottom: "32px" }} variant="h4">
          {title}
        </Typography>}
        {children}
      </Box>
    </StyledWrapper>
  );
}
