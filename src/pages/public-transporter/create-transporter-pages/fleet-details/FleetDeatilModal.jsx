import {
  Typography,
  IconButton,
  DialogActions,
  DialogContent,
  Dialog,
  styled,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Trash from '../../../../assets/icon _trash.svg';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  // '& .MuiDialogContent-root': {
  //   padding: theme.spacing(2),
  // },
  // '& .MuiDialogActions-root': {
  //   padding: theme.spacing(1),
  // },
  // '& .MuiPaper-elevation': {
  //   borderTop: '5px solid #c83000',
  // },
}));

export default function FleetDeleteModal({
  fleet,
  handleDelete,
  open,
  handleClose,
}) {
  const handleDeleteFleet = () => {
    handleDelete(fleet);
  };
  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title-delete"
      open={open}
    >
      <Box mb={4}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          // px={2}
        >
          {/* <Box>
            <img src={Trash} />
          </Box> */}

          <Typography
            sx={{
              // color: '#5E6871',
              fontSize: '16px',
            }}
            my={1}
          >
            Are you sure to delete particular{' '}
            <Typography component="strong" sx={{ fontWeight: 600 }}>
              Fleet
            </Typography>{' '}
            details
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
      // sx={{ justifyContent: 'space-between' }}
      >
        <Button
          variant="contained"
          // variant="text"
          onClick={handleClose}
          // sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          // sx={{ backgroundColor: '#C83000', textTransform: 'none' }}
          onClick={handleDeleteFleet}
        >
          Delete
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
