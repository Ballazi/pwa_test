import { Backdrop, CircularProgress } from '@mui/material';

export default function BackdropComponent({ loading }) {
  return (
    loading && (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  );
}
