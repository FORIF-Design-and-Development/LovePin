import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

import RecordNewPage from './RecordNewPage';

export default function RecordEditPage() {
  const { id } = useParams<{ id: string }>();
  const { records } = useApp();
  
  // API 스펙 반영: id(string) -> recordId(number)
  // URL에서 가져온 id(문자열)를 Number()를 통해 숫자로 변환하여 비교합니다.
  const record = records.find((r) => r.recordId === Number(id));

  if (!record) {
    return <Navigate to="/app/timeline" replace />;
  }

  return <RecordNewPage editRecord={record} />;
}