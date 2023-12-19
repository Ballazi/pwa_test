import { Outlet, Navigate } from 'react-router';
import ShipperLayout from '../components/Layout/ShipperLayout';
// import { useSelector } from 'react-redux';
import { decodeToken } from 'react-jwt';

const ShipperRoutes = () => {
  const token = JSON.parse(localStorage.getItem("authToken"));
  let user_type = null;

  if (token) {
    const decodedToken = decodeToken(token);
    console.log("decode", decodedToken);
    user_type = decodedToken?.user_type;
    // const expiryTime = parseInt(localStorage.getItem('expiryTime'), 10);
    // role_list = decodedToken.access ? decodedToken?.access?.submodules : [];
  }

  return token &&           //expiryTime > new Date().getTime() 
    user_type === 'shp' ? (
    <>
      <ShipperLayout>
        <Outlet />
      </ShipperLayout>
    </>
  ) : (
    <Navigate to="/" /> //redirect login
  );
};
export default ShipperRoutes;
