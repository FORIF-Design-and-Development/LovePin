import { useParams, Navigate } from 'react-router-dom';

import { useApp } from '@/contexts/AppContext';

import RecordNewPage from './RecordNewPage';

export default function RecordEditPage() {
  const { id } = useParams<{ id: string }>();
  const { records } = useApp();
  const record = records.find((r) => r.id === id);

  if (!record) {
    return <Navigate to="/app/timeline" replace />;
  }

  return <RecordNewPage editRecord={record} />;
}
