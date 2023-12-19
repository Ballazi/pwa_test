import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { closeSnackbar } from '../../redux/slices/snackbar-slice';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarComponent() {
  const { open, type, message } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const handleClose = () =>
    // event, reason //add in params
    {
      // if (reason === 'clickaway') {
      //   return; // Don't close the snackbar if it's clicked away
      // }

      dispatch(closeSnackbar());
    };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
