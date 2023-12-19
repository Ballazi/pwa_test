import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import TMSTheme from './theme/tms-theme';
import PublicRoutes from './routes/public-routes';
import './App.css';
import SnackbarComponent from './components/snackbar/SnackbarCompoenet';
import { decodeToken } from 'react-jwt';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRoleList, setUserData } from './redux/slices/user-slice';
// import { useNavigate } from 'react-router-dom';

function App() {
  const token = JSON.parse(localStorage.getItem('authToken'));
  const dispatch = useDispatch();
  if (token) {
    const decodedToken = decodeToken(token);
    console.log('decodedToken:', decodedToken);
    decodedToken.access && dispatch(setRoleList(decodedToken.access?.submodules));
    dispatch(setUserData(decodedToken));
    console.log("i am here")
  }

  // useEffect(() => {
  // }, []);

  return (
    <>
      <ThemeProvider theme={TMSTheme}>
        <SnackbarComponent />
        <CssBaseline />
        <PublicRoutes />
      </ThemeProvider>
    </>
  );
}

export default App;
