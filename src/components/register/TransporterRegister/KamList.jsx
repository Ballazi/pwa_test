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
import EditSvg from '../../../assets/carbon_edit.svg';
import DeleteSvg from '../../../assets/ant-design_delete-outlined.svg';

export default function KamList({ users, handleClickEdit, handleClickDelete }) {
  return (
    <Box sx={{ my: 3, border: '0.5px solid #BDCCD3' }}>
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
              {users.filter((item) => item.is_deleted !== true).length}
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
                align="left"
                sx={{ color: '#969CA6', fontSize: '12px', fontWeight: 400 }}
              >
                Linked branches
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
              users
                .filter((item) => item.is_deleted !== true)
                .map((user, index) => (
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
                      align="left"
                      sx={{ borderLeft: 0, borderRight: 0 }}
                    >
                      {user?.role_list
                        ?.map((branch) => branch.label)
                        ?.join(', ')}
                    </TableCell>
                    <TableCell
                      align="right"
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
                        onClick={
                          () => handleClickDelete(index, user)
                          // handleClickDelete(index, user.contact_no)
                        }
                      >
                        <img src={DeleteSvg} alt="delete" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
