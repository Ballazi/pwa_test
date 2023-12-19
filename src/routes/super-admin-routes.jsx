import { Outlet, Navigate } from 'react-router';
import Layout from '../components/Layout/Layout';
// import { useSelector } from 'react-redux';
import { decodeToken } from 'react-jwt';
import { useLocation } from 'react-router-dom';

const SuperAdminRoutes = () => {
  const token = JSON.parse(localStorage.getItem('authToken'));
  let user_type = null;
  const location = useLocation();
  console.log('location', location);
  const path =
    location.pathname === '/acculead-secured/signup' ||
    location.pathname === '/acculead-secured/public-transporter';

  console.log('path', path);

  if (token) {
    const decodedToken = decodeToken(token);
    console.log('decode', decodedToken);
    user_type = decodedToken?.user_type;
    // const expiryTime = parseInt(localStorage.getItem('expiryTime'), 10);
    // role_list = decodedToken.access ? decodedToken?.access?.submodules : [];
  }

  return token && user_type === 'acu' && !path ? (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  ) : token && user_type === 'acu' ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};
export default SuperAdminRoutes;
