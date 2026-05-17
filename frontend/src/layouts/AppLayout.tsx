import { Outlet, useLocation } from 'react-router-dom';

import BottomNav from '@/components/BottomNav';

export default function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  const isRecordSubPage =
    path.startsWith('/app/record/') && path !== '/app/record/new';
  const showBottomNav = !isRecordSubPage;

  return (
    <div className="flex flex-col min-h-dvh bg-[#FAFAFA] relative">
      <main className="flex-1 relative">
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

