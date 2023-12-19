import { useState } from 'react';
import RegisterCard from '../../components/card/RegisterCard';
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
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import EditSvg from '../../assets/carbon_edit.svg';
import DeleteSvg from '../../assets/ant-design_delete-outlined.svg';
import TransporterDetails from './TransporterDetails';
import { getTransporterById } from '../../api/register/transporter';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function SelectedTransporterListTable({
  transporterDetails,
  handleComplete,
  handleTransporterDelete,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [modalTransporterData, setModalTransporterData] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const shipper_id = localStorage.getItem('shipper_id');
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

  const handleClose = () => {
    setModalTransporterData(null);
    setIsEdit(false);
  };

  const handleCloseDelete = () => {
    setIsDelete(false);
    setTargetId(null);
  };

  const handleCompleteTransporter = (users, id) => {
    handleComplete(users, id);
    setIsEdit(false);
  };

  return (
    <RegisterCard>
      <Grid container sx={{ alignItems: 'center', mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4">User List</Typography>
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
          <Close />
        </IconButton>
        <DialogContent>
          <TransporterDetails
            onClose={handleClose}
            modalTransporterData={modalTransporterData}
            handleComplete={handleCompleteTransporter}
            isEdit={true}
          />
        </DialogContent>
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleCloseDelete}
        aria-labelledby="edit-dialog-title"
        open={isDelete}
      >
        <DialogTitle
          sx={{
            m: 0,
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '23.76px',
            // width: '80%',
          }}
          id="edit-dialog-title"
        >
          Delete Transporter details
        </DialogTitle>
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
          <Close />
        </IconButton>
        <DialogContent sx={{ ml: 1 }}>
          <Typography
            sx={{ fontWeight: 500, fontSize: '14px', color: '#5D6778', mb: 2 }}
          >
            Are you sure to delete transporter details?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleTransporterDelete(targetId)}
          >
            Delete
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </RegisterCard>
  );
}
