import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/Dashboard/DashboardLayout';
import { AboutPage, DeFiPage } from '../pages';

export const menuRoutes = [
  {
    path: '/defi',
    icon: 'fa-brands fa-ethereum',
    title: 'DeFi',
    component: <DeFiPage />,
  },
  {
    path: '/about',
    icon: 'fa-solid fa-user',
    title: 'About',
    component: <AboutPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />, //
    children: [
      ...menuRoutes.map(({ path, component }) => ({
        path,
        element: component,
      })),
      {
        path: '',
        element: <Navigate to={menuRoutes[0].path} />,
      },
    ],
  },
]);
