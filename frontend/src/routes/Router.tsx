import { createBrowserRouter, Navigate } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import AuthPage from '../pages/auth/AuthPage';
import CouplePage from '../pages/couple/CouplePage';
import MapPage from '../pages/map/MapPage';
import RecordDetailPage from '../pages/record/RecordDetailPage';
import RecordEditPage from '../pages/record/RecordEditPage';
import RecordNewPage from '../pages/record/RecordNewPage';
import SettingsPage from '../pages/settings/SettingsPage';
import TimelinePage from '../pages/timeline/TimelinePage';
import { RequireAuth } from './RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/app/timeline" replace /> },
      { path: 'timeline', element: <TimelinePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'record/new', element: <RecordNewPage /> },
      { path: 'record/:id', element: <RecordDetailPage /> },
      { path: 'record/:id/edit', element: <RecordEditPage /> },
      { path: 'couple', element: <CouplePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
