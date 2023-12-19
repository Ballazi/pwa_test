import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Tooltip,
  Box,
  Drawer,
  Menu,
  MenuItem,
  CssBaseline,
  Typography,
  Badge,
  Avatar,
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
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BoltIcon from '@mui/icons-material/Bolt';
import { roleMaster } from '../../utility/demo-master-role';

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

const StyledAvatar = styled(Avatar)(() => ({
  '&.MuiAvatar-circular': {
    width: '23px',
    height: '23px',
    backgroundColor: 'rgb(32 147 66 / 13%)',
    color: '#209342',
  },
}));

const MenuItemNotification = styled(MenuItem)(() => ({
  whiteSpace: 'normal',
  borderBottom: '0.5px solid #e6eaf1',
  fontSize: '14px',
  paddingTop: '10px',
  paddingBottom: '10px',
  color: '#5E6871',
}));

const NotificationTopItem = styled(MenuItem)(() => ({
  whiteSpace: 'normal',
  borderBottom: '0.5px solid #BDCCD3',
  background: '#065AD8',
  color: '#fff',
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
  cursor: 'default',
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  fontWeight: 500,
  paddingTop: '10px',
  paddingBottom: '10px',
  ':hover': {
    background: '#065AD8',
  },
}));

const NotificationBottomItem = styled(MenuItem)(() => ({
  whiteSpace: 'normal',
  borderBottom: '0.5px solid #e6eaf1',
  paddingTop: '7px',
  paddingBottom: '7px',
  justifyContent: 'space-between',
  fontSize: '13px',
  background: '#e6eefb',
  color: '#065ad8',
  borderRadius: '0px 0px 4px 4px',
  letterSpacing: '0.3px',
}));

const ListArray = [
  'Balaji Transport placed a bid',
  'Truck-12 assigned to a shipment',
  'New user joined in the workplace',
  'Password policy is going to expire in 2 days',
];

export default function Layout(props) {
  const path = useLocation();
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [count, setCount] = useState(0);
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
  console.log('here role', role_list);
  // const role_list = JSON.parse(localStorage.getItem('role_list'));
  const submoduleNames = role_list?.map((item) => item.submodule_name);
  const user_id = localStorage.getItem('user_id');
  useEffect(() => {
    const socket = new WebSocket(
      `ws://13.235.56.142:8000/ws/user/add/${user_id}`
    );
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened.', event);
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      if (data.data !== undefined) {
        console.log('Unread count:', data.data);
        setCount(data.data);
      } else if (data.increment !== undefined) {
        // increment the count
        setCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleClickNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setAnchorElNotification(null);
    // navigate(`/${secured}/notifications`);
  };

  const handleRedirectNotification = () => {
    setAnchorElNotification(null);
    navigate(`/${secured}/notifications`);
  };

  const openNotification = Boolean(anchorElNotification);
  // const notificationId = openNotification ? 'notification-popover' : undefined;

  // Get the last part which is "dashboard"
  const pageTitle =
    parts[parts.length - 1].charAt(0).toUpperCase() +
    parts[parts.length - 1].slice(1);

  const handleLogout = () => {
    console.log('here in log out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiryTime');
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
    Cookies.remove('authToken');
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
    'Dashboard',
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

  const handleNotification = () => {
    console.log('Clicked');
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
                <img src={AcculeadImage} alt="logo" />
              </Box>
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
              <Tooltip title="Notification">
                <IconButton
                  id="notification-button"
                  aria-controls={
                    openNotification ? 'notification-menu' : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={openNotification ? 'true' : undefined}
                  onClick={handleClickNotification}
                >
                  <Badge
                    badgeContent={count}
                    color="badge"
                    sx={{ color: '#065AD8' }}
                  >
                    <NotificationsIcon color="action" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                id="notification-menu"
                anchorEl={anchorElNotification}
                open={openNotification}
                onClose={handleCloseNotification}
                MenuListProps={{
                  'aria-labelledby': 'notification-button',
                }}
                sx={{ paddingTop: '0px', paddingBottom: '0px' }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    maxWidth: '300px',
                    mt: 1.5,

                    // background: 'red',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '& .MuiMenu-list': {
                      paddingTop: '0px',
                      paddingBottom: '0px',
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: '#065AD8',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <NotificationTopItem>Notification</NotificationTopItem>
                {ListArray.map((item, index) => (
                  <MenuItemNotification
                    key={index}
                    onClick={handleRedirectNotification}
                  >
                    <StyledAvatar sizes="small">
                      <NotificationsIcon sx={{ fontSize: '14px' }} />
                    </StyledAvatar>
                    {item}
                  </MenuItemNotification>
                ))}
                <NotificationBottomItem onClick={handleRedirectNotification}>
                  View all <ArrowForwardIosOutlined fontSize="8px" />
                </NotificationBottomItem>
              </Menu>
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

              <SubMenu
                label="Manage Master Data "
                rootStyles={subMenuStyles}
                icon={<InsertChartOutlined sx={{ height: '16px' }} />}
              >
                <SidebarMenuItem
                  component={<Link to={`/${secured}/masterdata`} />}
                  active={location.pathname === `/${secured}/masterdata`}
                  onClick={handleDrawerClose}
                >
                  System Master Data
                </SidebarMenuItem>
                <SidebarMenuItem
                  component={<Link to={`/${secured}/transeporterdata`} />}
                  active={location.pathname === `/${secured}/transeporterdata`}
                  onClick={handleDrawerClose}
                >
                  Transporter Data
                </SidebarMenuItem>
                <SidebarMenuItem
                  component={<Link to={`/${secured}/shiperdata`} />}
                  active={location.pathname === `/${secured}/shiperdata`}
                  onClick={handleDrawerClose}
                >
                  Shipper Data
                </SidebarMenuItem>
                {/* <SidebarMenuItem>Material</SidebarMenuItem>
                <SidebarMenuItem>Vehicle</SidebarMenuItem>
                <SidebarMenuItem>Cancel Reason</SidebarMenuItem>
                <SidebarMenuItem>User Master </SidebarMenuItem>
                <SidebarMenuItem>Network Provider Master </SidebarMenuItem>
                <SidebarMenuItem>Manage Roles and Access </SidebarMenuItem>
                <SidebarMenuItem>Manage Country </SidebarMenuItem>
                <SidebarMenuItem>Manage Currency </SidebarMenuItem>
                <SidebarMenuItem>Manage UOM </SidebarMenuItem>
                <SidebarMenuItem>Manage License</SidebarMenuItem> */}
              </SubMenu>

              <SubMenu
                label="Entity Registration"
                rootStyles={subMenuStyles}
                icon={<CorporateFareOutlined sx={{ height: '16px' }} />}
              >
                <SidebarMenuItem
                  component={<Link to={`/${secured}/signup`} />}
                  active={location.pathname === `/${secured}/signup`}
                  onClick={() => {
                    handleDrawerClose();
                    localStorage.removeItem('shipper_id');
                    localStorage.removeItem('shipper_name');
                    localStorage.setItem('type', 'create');
                  }}
                  // onClick={handleRegShipper}
                >
                  Register Shipper
                </SidebarMenuItem>

                <SidebarMenuItem
                  component={<Link to={`/${secured}/public-transporter`} />}
                  active={
                    location.pathname === `/${secured}/public-transporter`
                  }
                  onClick={() => {
                    handleDrawerClose();
                    localStorage.removeItem('transp_id');
                  }}
                >
                  Register Transporter (Public)
                </SidebarMenuItem>
              </SubMenu>

              <SubMenu
                label="Trip Management"
                rootStyles={subMenuStyles}
                icon={<LocalShippingOutlined sx={{ height: '16px' }} />}
              >
                <SidebarMenuItem
                  component={<Link to={`/${secured}/create-trip`} />}
                  active={location.pathname === `/${secured}/create-trip`}
                  onClick={handleDrawerClose}
                >
                  {' '}
                  Create Trip{' '}
                </SidebarMenuItem>

                <SidebarMenuItem
                  component={<Link to={`/${secured}/manage-trip`} />}
                  active={location.pathname === `/${secured}/manage-trip`}
                  onClick={handleDrawerClose}
                >
                  {' '}
                  Manage Trip{' '}
                </SidebarMenuItem>

                {/* <SidebarMenuItem
                  // component={<Link to={`/${secured}/report`} />} />}
                  // active={location.pathname === `/${secured}/report`}
                  onClick={handleDrawerClose}
                >
                  Reports
                </SidebarMenuItem> */}
              </SubMenu>

              <SubMenu
                label="Loading Management"
                rootStyles={subMenuStyles}
                icon={<AssignmentTurnedInIcon sx={{ height: '16px' }} />}
              >
                <SidebarMenuItem
                  component={<Link to={`/${secured}/manage-load`} />}
                  active={location.pathname === `/${secured}/manage-load`}
                  onClick={handleDrawerClose}
                >
                  {' '}
                  Manage Loading{' '}
                </SidebarMenuItem>

                {/* <SidebarMenuItem
                  // component={<Link to={`/${secured}/report`} />} />}
                  // active={location.pathname === `/${secured}/report`}
                  onClick={handleDrawerClose}
                >
                  Reports
                </SidebarMenuItem> */}
              </SubMenu>

              {/* <SubMenu
                label="Bid Load Management "
                rootStyles={subMenuStyles}
                icon={<GavelOutlined sx={{ height: "16px" }} />}
              >
                <SidebarMenuItem
                  component={<Link to={`/${secured}/view-bid`} />}
                  active={location.pathname === `/${secured}/view-bid`}
                >
                  Manage Bid
                </SidebarMenuItem>
                <SidebarMenuItem
                  component={<Link to="{`/${secured}/report`} />}
                  active={location.pathname === `/${secured}/report`}
                >
                  Reports
                </SidebarMenuItem>
              </SubMenu> */}

              <SubMenu
                label="Tracking Management "
                rootStyles={subMenuStyles}
                icon={<MyLocationOutlined sx={{ height: '16px' }} />}
              >
                {/* <SidebarMenuItem
                  component={<Link to={`/${secured}/trip-dashboard`} />}
                  active={location.pathname === `/${secured}/trip-dashboard`}
                >
                  Dashboard
                </SidebarMenuItem> */}
                <SidebarMenuItem
                  component={<Link to={`/${secured}/create-tracking`} />}
                  active={location.pathname === `/${secured}/create-tracking`}
                  onClick={handleDrawerClose}
                >
                  Create / Add Tracking
                </SidebarMenuItem>

                <SidebarMenuItem
                  component={<Link to={`/${secured}/manage-tracking`} />}
                  active={location.pathname === `/${secured}/manage-tracking`}
                  onClick={handleDrawerClose}
                >
                  Manage Tracking
                </SidebarMenuItem>

                <SidebarMenuItem
                  component={<Link to={`/${secured}/alert`} />}
                  active={location.pathname === `/${secured}/alert`}
                >
                  Alerts
                </SidebarMenuItem>
                {/* 
                <SidebarMenuItem
                  // component={<Link to={`/${secured}/report`} />}
                  // active={location.pathname === `/${secured}/report`}
                  onClick={handleDrawerClose}
                >
                  Reports
                </SidebarMenuItem> */}
              </SubMenu>

              <SubMenu
                label="Delivery"
                rootStyles={subMenuStyles}
                icon={<Inventory2Outlined sx={{ height: '16px' }} />}
              >
                <SidebarMenuItem
                  component={<Link to={`/${secured}/epod`} />}
                  active={location.pathname === `/${secured}/epod`}
                  onClick={handleDrawerClose}
                >
                  Epod
                </SidebarMenuItem>

                {/* <SidebarMenuItem
                  component={<Link to={`/${secured}/epod-pdf`} />}
                  active={location.pathname === `/${secured}/epod-pdf`}
                  onClick={handleDrawerClose}
                >
                  Epod pdf
                </SidebarMenuItem>

                <SidebarMenuItem>Reports</SidebarMenuItem> */}
              </SubMenu>

              <SidebarMenuItem
                rootStyles={menuItemStyles}
                icon={<SettingsOutlined sx={{ height: '16px' }} />}
                component={<Link to={`/${secured}/settings`} />}
                active={location.pathname === `/${secured}/settings`}
                onClick={handleDrawerClose}
              >
                Settings
              </SidebarMenuItem>
              <SidebarMenuItem
                rootStyles={menuItemStyles}
                icon={<SummarizeOutlined sx={{ height: '16px' }} />}
                component={<Link to={`/${secured}/report`} />}
                active={location.pathname === `/${secured}/report`}
                onClick={handleDrawerClose}
              >
                Reports
              </SidebarMenuItem>
              {/* <SidebarMenuItem
                rootStyles={menuItemStyles}
                icon={<SupportAgentOutlined sx={{ height: '16px' }} />}
                onClick={handleDrawerClose}
              >
                Manage Help & Support
              </SidebarMenuItem> */}
              <SidebarMenuItem
                rootStyles={menuItemStyles}
                icon={<FeedbackOutlined sx={{ height: '16px' }} />}
                onClick={handleDrawerClose}
              >
                Manage Feedback
              </SidebarMenuItem>
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
        <BoltIcon
          color="accent"
          sx={
            {
              // marginRight: '4px', // Optional: Add margin to the icon
              // Add a shadow to the icon
            }
          }
        />
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
