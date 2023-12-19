import { Outlet, Navigate } from 'react-router';
import TransporterLayout from '../components/Layout/TransporterLayout';
import { decodeToken } from 'react-jwt';
// import { useSelector } from 'react-redux';
// import useAuth from '../hooks/handle-auth';

const TransporterRoutes = () => {
  const token = JSON.parse(localStorage.getItem("authToken"));
  let user_type = null;

  if (token) {
    const decodedToken = decodeToken(token);
    console.log("decode", decodedToken);
    user_type = decodedToken?.user_type;
    // const expiryTime = parseInt(localStorage.getItem('expiryTime'), 10);
    // role_list = decodedToken.access ? decodedToken?.access?.submodules : [];
  }

  return token &&
    user_type === 'trns' ? (
    <>
      <TransporterLayout>
        <Outlet />
      </TransporterLayout>
    </>
  ) : (
    <Navigate to="/" /> //redirect login
  );
};
export default TransporterRoutes;
