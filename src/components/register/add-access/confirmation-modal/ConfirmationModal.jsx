import {
  Dialog,
  DialogContent,
  Box,
  styled,
  DialogActions,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const StyledDialogActions = styled(DialogActions)(() => ({
  '&.MuiDialogActions-root': {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    // justifyContent: 'space-between',
  },
}));

export default function ConfirmationModal({
  handleCloseConfirmation,
  openConfirmationModal,
}) {
  return (
    <BootstrapDialog
      onClose={() => handleCloseConfirmation(false)}
      aria-labelledby="edit-dialog-title"
      open={openConfirmationModal}
    >
      <Box mb={4}>
        <IconButton
          aria-label="close"
          onClick={() => handleCloseConfirmation(false)}
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

      <DialogContent sx={{ ml: 1 }}>
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
            Please ensure you have
            <Typography component="strong" sx={{ fontWeight: 600 }}>
              &nbsp;Submitted
            </Typography>{' '}
            your access
            <br /> and role before proceeding new tab
          </Typography>
        </Box>
      </DialogContent>
      <StyledDialogActions>
        <Button
          variant="contained"
          color="primary"
          // sx={{ backgroundColor: '#C83000', textTransform: 'none' }}
          onClick={() => handleCloseConfirmation(true)}
        >
          Proceed
        </Button>
      </StyledDialogActions>
    </BootstrapDialog>
  );
}
