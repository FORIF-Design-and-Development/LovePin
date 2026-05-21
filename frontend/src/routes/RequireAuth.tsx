import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useApp } from '@/contexts/AppContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useApp();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
