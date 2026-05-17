import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

// auth pages
import LandingPage from '../pages/auth/LandingPage'; // 💡 LandingPage 임포트 추가
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PasswordResetPage from '../pages/auth/PasswordResetPage';

// app pages
import TimelinePage from '../pages/timeline/TimelinePage';
import MapPage from '../pages/map/MapPage';
import RecordNewPage from '../pages/record/RecordNewPage';
import RecordDetailPage from '../pages/record/RecordDetailPage';
import RecordEditPage from '../pages/record/RecordEditPage';
import CoupleStatusPage from '../pages/couple/CoupleStatusPage';
import CoupleAlarmPage from '../pages/couple/CoupleAlarmPage';
import SettingsPage from '../pages/settings/SettingsPage';
import SettingsProfilePage from '../pages/settings/SettingsProfilePage';
import SettingsEmailPage from '../pages/settings/SettingsEmailPage';
import SettingsPasswordPage from '../pages/settings/SettingsPasswordPage';

export const router = createBrowserRouter([
  {
    path: '/',
    // 💡 첫 진입 시 로그인 세션이 없다면 랜딩페이지로 가도록 변경할 수 있습니다.
    // 일단 기본 구조에 맞춰 최초 진입 경로를 랜딩페이지로 매핑해 둡니다.
    element: <Navigate to="/auth" replace />,
  },
  {
    path: '/auth',
    children: [
      // 💡 /auth 뒤에 아무것도 붙지 않았을 때 첫 화면으로 LandingPage가 나오도록 설정
      { index: true, element: <LandingPage /> }, 
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'password-reset', element: <PasswordResetPage /> },
    ],
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/app/timeline" replace /> },
      { path: 'timeline', element: <TimelinePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'record/new', element: <RecordNewPage /> },
      { path: 'record/:id', element: <RecordDetailPage /> },
      { path: 'record/:id/edit', element: <RecordEditPage /> },
      {
        path: 'couple',
        children: [
          { index: true, element: <Navigate to="/app/couple/status" replace /> },
          { path: 'status', element: <CoupleStatusPage /> },
          { path: 'alarm', element: <CoupleAlarmPage /> },
        ],
      },
      {
        path: 'settings',
        children: [
          { index: true, element: <SettingsPage /> },
          { path: 'profile', element: <SettingsProfilePage /> },
          { path: 'email', element: <SettingsEmailPage /> },
          { path: 'password', element: <SettingsPasswordPage /> },
        ],
      },
    ],
  },
]);