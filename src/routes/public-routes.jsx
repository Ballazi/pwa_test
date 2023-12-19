import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import UserRegister from '../pages/register/UserRegister';
import PageNotFound from '../pages/PageNotFound';
// import { CssBaseline, ThemeProvider } from "@mui/material";
import TestComponent from '../components/masterData/Language Change/TestComponent';
import SuperAdminRoutes from './super-admin-routes';
import ShipperRoutes from './shipper-routes';
import CreateLoad from '../pages/load-management/create-load/CreateLoad';
import ViewBid from '../pages/view-bid/ViewBid';
import ManageTracking from '../pages/tracking/manage-tracking/ManageTracking';
import PreTracking from '../pages/tracking/pre-tracking/PreTracking';
import ManageLoad from '../pages/load-management/manage-load/ManageLoad';
import Epod from '../pages/delivery/epod/Epod';
import EpodPdf from '../pages/delivery/epod-pdf/EpodPdf';
import Login from '../pages/login/Login';
import PlaceBId from '../pages/placeBid/PlaceBId';
import PlaceBidDashboard from '../pages/placeBid/placeBidDashboard';
import SettingComponent from '../pages/setting/SettingComponent';
import MasterData from '../pages/masterData/MasterData';
import TransporterManagement from '../pages/masterData/masterDataComponent/transporter-management/TransporterManagement';
import ShipperManagement from '../pages/masterData/masterDataComponent/shipper-management/ShipperManagement';
import MainReport from '../pages/reports/MainReport';
import Alert from '../pages/alert/Alert';
import SelfRegister from '../components/register/SelfRegister';
import TransporterRoutes from './transporter-routes';
import BiddingDashboard from '../pages/bidding-dashboard/BiddingDashboard';
import TransporterLayout from '../pages/public-transporter/transporter-layout/TransporterLayout';
import LazyLoadingComponent from '../components/lazy-loading-component/LazyLoadingComponent';
import AculeadDashboard from '../pages/aculead-dashboard/AculeadDashboard';
import ShipperDashboard from '../pages/shipper-dashboard/ShipperDashboard';
import NotificationList from '../pages/notifications/NotificationList';
const TrackingDashboard = lazy(() =>
  import('../pages/tracking-dashboard/TrackingDashboard')
);

// import TrackingDashboard from '../pages/tracking-dashboard/TrackingDashboard';
import { decodeToken } from 'react-jwt';
import { useState } from 'react';
// import { roleMaster } from '../utility/demo-master-role';

function PublicRoutes() {
  const token = JSON.parse(localStorage.getItem('authToken'));
  let role_list = [];
  let submoduleArr = [];

  if (token) {
    const decodedToken = decodeToken(token);
    console.log('values', decodedToken);
    role_list = decodedToken.access ? decodedToken?.access?.submodules : [];
    console.log('decode', decodedToken);
    submoduleArr = role_list?.map((item) => item.submodule_name);
  }

  const router = createBrowserRouter([
    { path: '/', element: <Login />, errorElement: <PageNotFound /> },
    // { path: 'signup', element: <UserRegister /> },

    { path: '/selfRegister', element: <SelfRegister /> },
    {
      path: '/secure',
      element: <UserRegister />,
    },
    {
      path: '/language',
      element: <TestComponent />,
    },
    {
      path: '/acculead-secured',
      element: <SuperAdminRoutes />,
      children: [
        { path: 'dashboard', element: <AculeadDashboard /> },
        // { path: 'trip-dashboard', element: <TrackingDashboard /> },
        { path: 'signup', element: <UserRegister /> },
        {
          path: 'create-trip',
          element: <CreateLoad />,
        },
        {
          path: 'manage-trip',
          element: <ViewBid />,
        },
        {
          path: 'manage-load',
          element: <ManageLoad />,
        },
        {
          path: 'create-tracking',
          element: <PreTracking />,
        },
        {
          path: 'manage-tracking',
          element: <ManageTracking />,
        },
        { path: 'epod', element: <Epod /> },
        {
          path: 'epod-pdf',
          element: <EpodPdf />,
        },
        {
          path: 'report',
          element: <MainReport />,
        },
        { path: 'placeBid', element: <PlaceBId /> },
        { path: 'settings', element: <SettingComponent /> },
        { path: 'masterdata', element: <MasterData /> },
        { path: 'transeporterdata', element: <TransporterManagement /> },
        { path: 'shiperdata', element: <ShipperManagement /> },
        { path: 'alert', element: <Alert /> },
        { path: 'public-transporter', element: <TransporterLayout /> },
        { path: 'notifications', element: <NotificationList /> },
      ],
    },
    {
      path: '/shipper-secured',
      element: <ShipperRoutes />,
      children: [
        { path: 'dashboard', element: <ShipperDashboard /> },
        ...(submoduleArr.includes('Create Trip')
          ? [{ path: 'create-trip', element: <CreateLoad /> }]
          : []),
        ...(submoduleArr.includes('Manage Trip')
          ? [{ path: 'manage-trip', element: <ViewBid /> }]
          : []),
        ...(submoduleArr.includes('Manage Loading')
          ? [{ path: 'manage-load', element: <ManageLoad /> }]
          : []),
        ...(submoduleArr.includes('Create / Add Tracking')
          ? [{ path: 'create-tracking', element: <PreTracking /> }]
          : []),
        ...(submoduleArr.includes('Manage Tracking')
          ? [{ path: 'manage-tracking', element: <ManageTracking /> }]
          : []),
        ...(submoduleArr.includes('Epod')
          ? [{ path: 'epod', element: <Epod /> }]
          : []),
        ...(submoduleArr.includes('Epod pdf')
          ? [{ path: 'epod-pdf', element: <EpodPdf /> }]
          : []),
        // {
        //   path: 'report',
        //   element: <MainReport />,
        // },
        { path: 'placeBid', element: <PlaceBidDashboard /> },
        { path: 'settings', element: <SettingComponent /> },
        { path: 'alert', element: <Alert /> },
        { path: 'notifications', element: <NotificationList /> },
      ],
    },
    {
      path: '/transporter-secured',
      element: <TransporterRoutes />,
      children: [
        { path: 'dashboard', element: <PlaceBidDashboard /> },
        // { path: 'settings', element: <SettingComponent /> },
        { path: 'notifications', element: <NotificationList /> },
      ],
    },
  ]);

  return (
    console.log(router),
    (
      <>
        <Suspense fallback={<LazyLoadingComponent />}>
          <RouterProvider router={router} />
        </Suspense>
      </>
    )
  );
}

export default PublicRoutes;
