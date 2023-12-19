import * as React from 'react';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
const baseUrl = import.meta.env.VITE_TMS_APP_API_URL;
import {
  Tooltip,
  Box,
  Drawer,
  Menu,
  MenuItem,
  CssBaseline,
  Typography,
} from '@mui/material';
import {
  Sidebar,
  Menu as SidebarMenu,
  MenuItem as SidebarMenuItem,
  SubMenu,
  menuClasses,
} from 'react-pro-sidebar';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import AcculeadImage from '../../assets/Acculead.svg';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {
  DashboardOutlined,
  LocalShippingOutlined,
  // GavelOutlined,
  MyLocationOutlined,
  Inventory2Outlined,
  SettingsOutlined,
  InsertChartOutlined,
  CorporateFareOutlined,
  SummarizeOutlined,
  SupportAgentOutlined,
  FeedbackOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import BoltIcon from '@mui/icons-material/Bolt';
import { roleMaster } from '../../utility/demo-master-role';
const transporterLogo = localStorage.getItem('transporter_logo');
const transporterId = localStorage.getItem('transporter_id');

const drawerWidth = 250;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#fff',
  borderBottom: '0.5px solid #BDCCD3',
  boxShadow: 'none',
  // boxShadow: '0px 4px 0px 0px #d1d1d1',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const TransporterNameDisplayWrap = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export default function TransporterLayout(props) {
  const path = useLocation();
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const openLang = Boolean(anchorEl);
  console.log('path', path);
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  console.log('loc', location);
  const parts = location.pathname.split('/');
  console.log('parts', parts[1]);
  const secured = parts[1];
  const role_list = useSelector((state) => state?.user?.role_list);
  // console.log('role', role_list);
  // const role_list = JSON.parse(localStorage.getItem('role_list'));
  const submoduleNames = role_list?.map((item) => item.submodule_name);

  // Get the last part which is "dashboard"
  const pageTitle =
    parts[parts.length - 1].charAt(0).toUpperCase() +
    parts[parts.length - 1].slice(1);

  const handleLogout = () => {
    console.log('here in log out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiryTime');
    Cookies.remove('authToken');
    ///////////////
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
    localStorage.removeItem('transporter_id');
    navigate('/');
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const tripManagement = ['Create Trip', 'Manage Trip', 'Trip Reports'];

  const loadingManagement = ['Manage Loading', 'Loading Reports'];

  const trackingManagement = [
    'Create / Add Tracking',
    'Manage Tracking',
    'Alerts',
    'Tracking Reports',
  ];

  const delivery = ['Epod', 'Epod pdf', 'Delivery Reports'];

  const menuItemsStyles = {
    button: ({ active }) => {
      return {
        color: active ? '#f5f9ff !important' : '#97b2d8',
        backgroundColor: active ? '#092f64' : undefined,
        height: '40px',
        fontSize: '13px',
        transition: '200ms ease-out background-color',
        '&:hover': {
          backgroundColor: '#092f64',
        },
        [`&.active`]: {
          backgroundColor: '#092f64',
          color: '#f5f9ff !important',
        },
      };
    },
  };

  const rootStyles = {
    overflow: 'auto',
  };

  const subMenuStyles = {
    ['.' + menuClasses.button]: {
      backgroundColor: '#042656',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#092f64',
      },
    },
  };

  const menuItemStyles = {
    ['.' + menuClasses.button]: {
      backgroundColor: '#042656',
      color: '#fff',
    },
  };
  const d = new Date();
  let year = d.getFullYear();

  const handleRegShipper = () => {
    localStorage.removeItem('shipper_id');
    navigate('/signup');
    // window.open(
    //   "https://www.figma.com/file/CR1Hbo8pZ6U2amczYFSCVK/Aculead-TMS?type=design&node-id=179-12551&mode=design&t=56ijYuoiN2l3hFj3-0",
    //   "_blank" // This specifies to open the link in a new tab or window
    // );
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Aculead pages" />
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '60%' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon sx={{ color: '#042656' }} />
              </IconButton>
              <Box
                sx={{ lineHeight: '1px', cursor: 'pointer' }}
                onClick={() => navigate(`/${secured}/dashboard`)}
              >
                <img
                  src={
                    !transporterLogo || transporterLogo === 'null'
                      ? AcculeadImage
                      : `${baseUrl}/service/file/download/${transporterId}/logo/${transporterLogo}`
                  }
                  style={{ height: '45px' }}
                  alt="logo"
                />
              </Box>
              <TransporterNameDisplayWrap pl={3}>
                <Typography
                  color="secondary"
                  sx={{ fontSize: '16px', fontWeight: 500 }}
                >
                  {localStorage.getItem('transporter_name')}
                </Typography>
              </TransporterNameDisplayWrap>
            </Box>

            <Box sx={{ width: '40%', textAlign: 'right' }}>
              <Tooltip title="Change Language">
                <IconButton
                  id="basic-button"
                  aria-controls={openLang ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openLang ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{
                    mx: 0.5,
                    background: 'rgba(0, 0, 0, 0.08)',
                    borderRadius: '6px',
                  }}
                >
                  <GTranslateIcon
                    sx={{ width: 16, height: 16, color: '#042656' }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openLang}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem
                  onClick={() => {
                    changeLanguage('en');
                    handleClose();
                  }}
                >
                  English
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    changeLanguage('hi');
                    handleClose();
                  }}
                >
                  Hindi
                </MenuItem>
              </Menu>
              <Tooltip title="Logout">
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    mx: 0.5,
                    background: 'rgba(0, 0, 0, 0.08)',
                    borderRadius: '6px',
                  }}
                >
                  <LogoutIcon
                    style={{ color: '#042656', width: 16, height: 16 }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,

            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#042656',
              overflowX: 'hidden',
              boxShadow: '5px 0px 50px 0px rgb(3 21 47 / 55%)',
              zIndex: 9991,
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon style={{ color: '#FFFFFF' }} />
              ) : (
                <ChevronRightIcon style={{ color: '#FFFFFF' }} />
              )}
            </IconButton>
          </DrawerHeader>
          <Sidebar rootStyles={rootStyles}>
            <SidebarMenu menuItemStyles={menuItemsStyles}>
              <SidebarMenuItem
                rootStyles={menuItemStyles}
                component={<Link to={`/${secured}/dashboard`} />}
                active={location.pathname === `/${secured}/dashboard`}
                icon={<DashboardOutlined sx={{ height: '16px' }} />}
              >
                Dashboard
              </SidebarMenuItem>

              {/* <SidebarMenuItem
                rootStyles={menuItemStyles}
                icon={<SettingsOutlined sx={{ height: '16px' }} />}
                component={<Link to={`/${secured}/settings`} />}
                active={location.pathname === `/${secured}/settings`}
                onClick={handleDrawerClose}
              >
                Settings
              </SidebarMenuItem> */}
              {/* <SidebarMenuItem
                rootStyles={menuItemStyles}
                icon={<SupportAgentOutlined sx={{ height: '16px' }} />}
                onClick={handleDrawerClose}
              >
                Help & Support
              </SidebarMenuItem> */}
            </SidebarMenu>
          </Sidebar>
        </Drawer>

        <Main
          sx={{
            background: 'rgba(241, 243, 244, 1)',
            minHeight: '100vh', //new code
            flexDirection: 'column', //new code
            display: 'flex', //new code
            overflow: 'hidden',
          }}
          open={open}
        >
          <DrawerHeader />
          {props.children}
        </Main>
      </Box>
      <Box
        component="footer"
        sx={{
          marginTop: 'auto', //new code
          display: 'flex',
          justifyContent: 'center',
          background: '#e3e3e38a',
          // position: "relative",
          // bottom: 0,
          // width: "100%", // Ensure the footer spans the full width
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Typography
          sx={{
            color: '#80808091',
            fontSize: '12px',
          }}
        >{`© Aculead ${year} copyright reserved`}</Typography>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 2,
          right: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <BoltIcon color="accent" />
        <Typography
          color="secondary"
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            color: 'rgba(122,122,122, 0.64)',
          }}
        >
          Powered by Aculead
        </Typography>
      </Box>
    </>
  );
}
