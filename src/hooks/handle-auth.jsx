import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRoleList, deleteRoleList } from '../redux/slices/user-slice';

function useAuth() {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('handle auth');
    const authToken = JSON.parse(localStorage.getItem('authToken'));
    const roleList = JSON.parse(localStorage.getItem('role_list'));
    console.log('lets see', roleList);
    const expiryTime = parseInt(localStorage.getItem('expiryTime'), 10);

    if (authToken && roleList && expiryTime > new Date().getTime()) {
      dispatch(setRoleList(roleList));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('role_list');
      localStorage.removeItem('expiryTime');
      dispatch(deleteRoleList());
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return isAuthenticated;
}

export default useAuth;
