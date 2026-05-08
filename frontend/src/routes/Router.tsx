import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import TimelinePage from '../pages/TimelinePage';
import RecordCreatePage from '../pages/RecordCreatePage';
import MapPage from '../pages/MapPage';
import CouplePage from '../pages/CouplePage';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/timeline" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/records/new" element={<RecordCreatePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/couple" element={<CouplePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;