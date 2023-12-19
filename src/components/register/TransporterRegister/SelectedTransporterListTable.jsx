import { useState } from 'react';
import RegisterCard from '../../card/RegisterCard';
import {
  Typography,
  Grid,
  Avatar,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  styled,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditSvg from '../../../assets/carbon_edit.svg';
import DeleteSvg from '../../../assets/ant-design_delete-outlined.svg';
import TransporterDetails from './TransporterDetails';
import {
  getTransporterById,
  deleteTransporter,
} from '../../../api/register/transporter';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import Trash from '../../../assets/icon _trash.svg';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogDelete = styled(Dialog)(({ theme }) => ({
  // '& .MuiDialogContent-root': {
  //   padding: theme.spacing(1),
  // },
  // '& .MuiDialogActions-root': {
  //   padding: theme.spacing(1),
  // },
  // '& .MuiPaper-elevation': {
  //   borderTop: '5px solid #c83000',
  // },
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

export default function SelectedTransporterListTable({
  transporterDetails,
  handleComplete,
  reloadApplicationTrigger,
  handleAfterDelete,
  // handleTransporterDelete,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [modalTransporterData, setModalTransporterData] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [targetName, setTargetName] = useState(null);
  const shipper_id = localStorage.getItem('shipper_id');
  const dispatch = useDispatch();
  const handleClickEdit = (transporter) => {
    console.log('hi lets go', transporter);

    getTransporterById(transporter.trnsp_id, shipper_id)
      .then((res) => {
        if (res.data.success) {
          console.log('less go', res.data.data);
          setModalTransporterData((prevState) => {
            return {
              ...prevState,
              ...res.data.data,
            };
          });
          setIsEdit(true);
        }
      })
      .catch((err) => err.response.data.message);
  };

  const handleTransporterDelete = (transporter_id, t_name) => {
    const payload = {
      shipper_id: shipper_id,
      transporter_id: transporter_id,
    };
    deleteTransporter({ data: payload })
      .then((res) => {
        if (res.data.success) {
          dispatch(
            openSnackbar({
              type: 'success',
              message: 'Transporter data deleted successfully!',
            })
          );
          setIsDelete(false);
          // reloadApplicationTrigger();
          handleAfterDelete(transporter_id, t_name);
          // setReloadApplication(true);
        } else {
          console.log('entry>>>');
          dispatch(
            openSnackbar({
              type: 'error',
              message: res.data.clientMessage,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        openSnackbar({
          type: 'error',
          message: err.response.data.clientMessage,
        });
      });
  };

  const handleClose = () => {
    setModalTransporterData(null);
    setIsEdit(false);
  };

  const handleCloseDelete = () => {
    setIsDelete(false);
    setTargetId(null);
    setTargetName(null);
  };

  const handleCompleteTransporter = (users, id) => {
    handleComplete(users, id);
    setIsEdit(false);
  };

  return (
    <RegisterCard>
      {console.log(
        "transporterDetails   ========================>>>>>>> :'(",
        transporterDetails
      )}
      <Grid container sx={{ alignItems: 'center', mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4">Transporter list</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid
            container
            sx={{ justifyContent: 'right', alignItems: 'center' }}
          >
            <Avatar
              sx={{
                background: '#E7EFFC',
                color: '#065AD8',
                fontWeight: 500,
                fontSize: 14,
                width: 32,
                height: 32,
                lineHeight: '20px',
              }}
            >
              {transporterDetails.length}
            </Avatar>
            <Typography
              sx={{ marginLeft: 1, color: '#95A7B8', fontWeight: 500 }}
            >
              transporters added
            </Typography>
            {/* <Button color="primary" sx={{ mx: 1 }}>
              Collapse list
            </Button> */}
          </Grid>
        </Grid>
      </Grid>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ background: '#E7EFFC' }}>
              <TableCell sx={{ color: '#969CA6', fontSize: '12px' }}>
                Name
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                Contact No.
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                Email
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                KAM
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                Options
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log('table', transporterDetails)}
            {transporterDetails?.length > 0 &&
              transporterDetails?.map((transporter) => (
                <TableRow
                  sx={{
                    border: 0,
                  }}
                  key={transporter.trnsp_id}
                >
                  <TableCell
                    align="left"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {transporter.name}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {transporter.contact_no}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {transporter.email}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {transporter?.kam_count || 0}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleClickEdit(transporter)}
                    >
                      <img src={EditSvg} alt="edit" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setIsDelete(true);
                        setTargetId(transporter.trnsp_id);
                        setTargetName(transporter.name);
                      }}
                    >
                      <img src={DeleteSvg} alt="delete" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BootstrapDialog
        // onClose={handleClose}
        aria-labelledby="edit-dialog-title"
        open={isEdit}
      >
        <DialogTitle
          sx={{
            m: 0,
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '23.76px',
            width: '80%',
          }}
          id="edit-dialog-title"
        >
          Transporter details
        </DialogTitle>
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
        <DialogContent>
          <TransporterDetails
            onClose={handleClose}
            modalTransporterData={modalTransporterData}
            handleComplete={handleCompleteTransporter}
            isEdit={true}
            // handleTransporterEditFetch={handleTransporterEditFetch}
          />
        </DialogContent>
      </BootstrapDialog>
      <BootstrapDialogDelete
        onClose={handleCloseDelete}
        aria-labelledby="edit-dialog-title"
        open={isDelete}
      >
        <Box mb={4}>
          <IconButton
            aria-label="close"
            onClick={handleCloseDelete}
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
              Are you sure to delete particular{' '}
              <Typography component="strong" sx={{ fontWeight: 600 }}>
                Transporter
              </Typography>{' '}
              details?
            </Typography>
          </Box>
        </DialogContent>
        <StyledDialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDelete}
            // sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            // sx={{ backgroundColor: '#C83000', textTransform: 'none' }}
            onClick={() => handleTransporterDelete(targetId, targetName)}
          >
            Delete
          </Button>
        </StyledDialogActions>
      </BootstrapDialogDelete>
    </RegisterCard>
  );
}
