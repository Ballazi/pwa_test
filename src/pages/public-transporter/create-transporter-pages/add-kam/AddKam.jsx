import { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import RegisterCard from '../../../../components/card/RegisterCard';
import KamList from '../../KamList';
import KamForm from './KamForm';
import { fetchKamRole } from '../../../../api/register/transporter';
import {
  viewKamList,
  deleteKamUser,
} from '../../../../api/public-transporter/public-transporter';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../../redux/slices/snackbar-slice';
import { useNavigate } from 'react-router-dom';
import BackdropComponent from '../../../../components/backdrop/Backdrop';

export default function AddKam({ handlePrevious }) {
  const [users, setUsers] = useState([]);
  const [kamDataForEdit, setKamDataForEdit] = useState({});
  const [roleId, setRoleId] = useState('');
  const [reloadApi, setReloadApi] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const transp_id = localStorage.getItem('transp_id');
  useEffect(() => {
    setLoading(true);
    viewKamList(transp_id)
      .then((res) => {
        if (res.data.success) {
          console.log('log>>>', res.data.data);
          const users_data = res.data.data.map((user) => {
            return {
              name: user.name,
              email: user.email,
              contact_no: user.contact_no,
              user_id: user.user_id,
              share_login_details: true,
            };
          });
          setUsers(users_data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setReloadApi(false));
    fetchKamRole()
      .then((res) => {
        console.log(res);
        console.log('hi', res.data.data.id);
        setRoleId(res.data.data.id);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [reloadApi, transp_id]);

  function handleForm(values) {
    // setUsers((prevState) => [...prevState, values]);
    setReloadApi(true);
  }

  const handleClickEdit = (user, index) => {
    setKamDataForEdit(user);
    console.log('index', index);
  };

  const handleClickDelete = (index, user_id) => {
    deleteKamUser(user_id)
      .then((res) => {
        if (res.data.success) {
          dispatch(
            openSnackbar({
              type: 'success',
              message: 'Kam deleted successfully',
            })
          );
          setReloadApi(true);
        } else {
          dispatch(
            openSnackbar({
              type: 'error',
              message: res.data.clientMessage,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          openSnackbar({
            type: 'error',
            message: 'Something went wrong! Please try again later',
          })
        );
      });
    // const indexToDelete = index;
    // if (indexToDelete >= 0 && indexToDelete < users.length) {
    //   const newArray = users
    //     .slice(0, indexToDelete)
    //     .concat(users.slice(indexToDelete + 1));
    //   console.log(newArray); // newArray does not contain the element at index 2 (3)
    //   setUsers(newArray);
    // }
  };

  const handleKamEdit = (data) => {
    console.log('hello', data);
    const existingObjectIndex = users.findIndex(
      (obj) => obj.user_id === data.user_id
    );

    if (existingObjectIndex !== -1) {
      // If an object with the same user_id exists, update it
      users[existingObjectIndex] = data;
      setUsers([...users]);
      console.log('Object updated.');
    } else {
      // If it doesn't exist, add it to the array
      return;
    }
  };

  const handleNext = () => {
    dispatch(
      openSnackbar({
        type: 'success',
        message: 'Account setup successfully done',
      })
    );
    navigate('/acculead-secured/transeporterdata');
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      {console.log('users', users)}
      <KamForm
        handleForm={handleForm}
        roleId={roleId}
        kamDataForEdit={kamDataForEdit}
        handleKamEdit={handleKamEdit}
        handleFormReset={() => setKamDataForEdit({})}
      />
      <RegisterCard>
        <KamList
          users={users}
          handleClickEdit={handleClickEdit}
          handleClickDelete={handleClickDelete}
        />
      </RegisterCard>
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={handlePrevious}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Complete account setup
        </Button>
      </Box>
    </>
  );
}
