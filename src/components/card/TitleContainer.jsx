import { Box, styled, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Cookies from 'js-cookie';
import Logout from '../../assets/icon_park_logout.svg';

const TitleContainerBox = styled(Box)(({ theme }) => ({
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    marginBottom: '12px',
    display: 'block',
  },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export default function TitleContainer({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log('here in log out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiryTime');
    Cookies.remove('authToken');
    ///////////////////
    /////////////////
    localStorage.removeItem('authToken');
    localStorage.removeItem('transporter_name');
    localStorage.removeItem('shipper_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('shipper_name');
    localStorage.removeItem('shipper_logo');
    localStorage.removeItem('region_cluster_id');
    localStorage.removeItem('branch_id');
    localStorage.removeItem('transporter_logo');
    navigate('/');
  };
  return (
    <TitleContainerBox>
      <Box>{children}</Box>

      <ButtonContainer>
        <Box>
          <Button
            sx={{ mx: 2, textTransform: 'capitalize' }}
            onClick={() => navigate('/acculead-secured/shiperdata')}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Button
            sx={{ textTransform: 'capitalize' }}
            startIcon={<img src={Logout} alt="logout" />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </ButtonContainer>
    </TitleContainerBox>
  );
}
