import { Box, Typography } from "@mui/material";
import classes from "./css/FormWrapper.module.css";

function FormWrapper({ children, title }) {
  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.left}></Box>
        <Box className={classes.right}>
          <Typography component="h1" sx={{ fontWeight: 600, fontSize: "24px" }}>
            {title}
          </Typography>
          {children}
        </Box>
      </Box>
    </>
  );
}

export default FormWrapper;
