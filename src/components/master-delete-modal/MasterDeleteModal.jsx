import {
  Typography,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  styled,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Trash from '../../assets/icon _trash.svg';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-elevation': {
    borderTop: '5px solid #c83000',
  },
}));

export default function MasterDeleteModal({
  deleteId,
  index,
  handleDeleteById,
  //   title,
  open,
  handleClose,
}) {
  const handleDelete = (id) => {
    handleDeleteById(index, id);
  };
  return (
    <BootstrapDialog
      // onClose={handleClose}
      aria-labelledby="customized-dialog-title-delete"
      open={open}
    >
      {/* <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title-delete">
        Delete Kam data
      </DialogTitle> */}
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
          px={2}
        >
          <Box>
            <img src={Trash} />
          </Box>

          <Typography sx={{ color: '#5E6871', fontSize: '16px' }} my={1}>
            Are you sure to delete{' '}
            <Typography component="strong" sx={{ fontWeight: 600 }}>
              KAM
            </Typography>{' '}
            details
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ backgroundColor: '#C83000', textTransform: 'none' }}
          onClick={() => handleDelete(deleteId)}
        >
          Delete
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
