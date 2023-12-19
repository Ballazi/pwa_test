import {
  Box,
  Grid,
  Typography,
  Avatar,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
} from '@mui/material';
import EditSvg from '../../assets/carbon_edit.svg';
import DeleteSvg from '../../assets/ant-design_delete-outlined.svg';
import MasterDeleteModal from '../../components/master-delete-modal/MasterDeleteModal';
import { useState } from 'react';

export default function KamList({ users, handleClickEdit, handleClickDelete }) {
  const [openDeleteModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleDeleteFromModal = () => {
    handleClickDelete(deleteIndex, deleteId);
    setOpenModal(false);
  };

  const handleClose = () => {
    setDeleteId(null);
    setDeleteIndex(null);
    setOpenModal(false);
  };

  const openModal = (index, user_id) => {
    setDeleteId(user_id);
    setDeleteIndex(index);
    setOpenModal(true);
  };

  return (
    <Box sx={{ my: 3, border: '0.5px solid #BDCCD3', borderRadius: '4px' }}>
      <Grid container sx={{ alignItems: 'center', mb: 3, px: 2, mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4">Key account manager list</Typography>
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
              {users.length}
            </Avatar>
            <Typography
              sx={{ marginLeft: 1, color: '#95A7B8', fontWeight: 500 }}
            >
              KAMs added
            </Typography>
            {/* <Button color="primary" sx={{ mx: 1 }}>
          Collapse list
        </Button> */}
          </Grid>
        </Grid>
      </Grid>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ background: '#E7EFFC' }}>
              <TableCell
                sx={{ color: '#969CA6', fontSize: '12px' }}
                align="left"
              >
                Sl No.
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                KAM name
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                Mobile no.
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
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow
                  key={user.user_id}
                  // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    align="left"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {user.name}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    {user.contact_no}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderLeft: 0, borderRight: 0 }}
                  >
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleClickEdit(user, index)}
                    >
                      <img src={EditSvg} alt="edit" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => openModal(index, user.user_id)}
                    >
                      <img src={DeleteSvg} alt="delete" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography>Please create KAM first!</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <MasterDeleteModal
        handleDeleteById={handleDeleteFromModal}
        open={openDeleteModal}
        handleClose={handleClose}
      />
    </Box>
  );
}
