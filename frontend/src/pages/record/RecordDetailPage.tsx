/**
 * LovePin RecordDetail Page (API Integrated)
 * Design: Emotional Minimalism — full record view with photo carousel
 * Features: photo carousel, full-screen photo modal, edit/delete
 */
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function RecordDetailPage() {
  // API 스펙 반영: mode, myProfile 구조 사용
  const { records, deleteRecord, mode } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // API 스펙 반영: id(string) -> recordId(number) 변환 후 검색
  const record = records.find((r) => r.recordId === Number(id));

  const [photoIdx, setPhotoIdx] = useState(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!record) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <p style={{ fontSize: 16, color: '#8B95A1', marginBottom: 24 }}>기록을 찾을 수 없어요.</p>
        <button className="btn-primary" onClick={() => navigate('/app/timeline')} style={{ width: 'auto', padding: '12px 24px' }}>타임라인으로</button>
      </div>
    );
  }

  // API 스펙의 photos 배열 정렬
  const sortedPhotos = [...record.photos].sort((a, b) => a.sequence - b.sequence);

  // 백엔드 API 명세에 따른 수정/삭제 권한 제어
  const canEdit = record.canEdit;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const formatDateTime = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleDelete = () => {
    deleteRecord(record.recordId);
    toast.success('기록이 삭제되었어요');
    navigate('/app/timeline');
  };

  return (
    <div className="page-enter" style={{ background: 'white', minHeight: '100dvh' }}>
      {/* Photo carousel */}
      <div style={{ position: 'relative', background: '#191F28' }}>
        <div style={{ height: 320, overflow: 'hidden', position: 'relative' }}>
          {sortedPhotos.length > 0 && (
            <img
              src={sortedPhotos[photoIdx]?.imageUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => setShowPhotoModal(true)}
            />
          )}
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)', pointerEvents: 'none' }} />

          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            style={{ position: 'absolute', top: 56, left: 16, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {/* Photo index */}
          {sortedPhotos.length > 1 && (
            <div style={{ position: 'absolute', top: 60, right: 16, background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '4px 10px', fontSize: 13, color: 'white', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
              {photoIdx + 1}/{sortedPhotos.length}
            </div>
          )}
        </div>

        {/* Photo thumbnails */}
        {sortedPhotos.length > 1 && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 16px', background: '#191F28', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {sortedPhotos.map((photo, i) => (
              <button
                key={photo.imageId}
                onClick={() => setPhotoIdx(i)}
                style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 8, overflow: 'hidden', border: i === photoIdx ? '2px solid #f76e7e' : '2px solid transparent', padding: 0, background: 'none', cursor: 'pointer' }}
              >
                <img src={photo.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: canEdit ? '24px 20px 100px' : '24px 20px 40px' }}>
        {/* Title & badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#191F28', letterSpacing: '-0.5px', flex: 1, marginRight: 12, lineHeight: 1.3 }}>{record.title}</h1>
          {/* API 스펙 연동: 커플 모드에서만 배지 노출 */}
          {mode === 'couple' && (
            <span style={{ 
              flexShrink: 0, fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
              background: record.recordType === 'COUPLE' ? '#FFF0F1' : '#F4F6F8', 
              color: record.recordType === 'COUPLE' ? '#f76e7e' : '#8B95A1' 
            }}>
              {record.recordType === 'COUPLE' ? '커플 기록' : '개별 기록'}
            </span>
          )}
        </div>

        {/* Meta info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, padding: '16px', background: '#F4F6F8', borderRadius: 16 }}>
          {/* API 스펙 변수명 연동: placeName, placeAddress */}
          <MetaRow icon={<PinIcon />} label={record.placeName} sub={record.placeAddress} />
          <div style={{ height: 1, background: '#E5E8EB' }} />
          <MetaRow icon={<CalendarIcon />} label={formatDate(record.visitDate)} />
          {/* 요구사항 준수: 커플 모드 + 개별 기록일 때만 작성자 닉네임 노출 */}
          {mode === 'couple' && record.recordType === 'INDIVIDUAL' && record.authorNickname && (
            <>
              <div style={{ height: 1, background: '#E5E8EB' }} />
              <MetaRow icon={<PersonIcon />} label={`작성자: ${record.authorNickname}`} />
            </>
          )}
        </div>

        {/* Tags */}
        {record.tags && record.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {record.tags.map(tag => (
              <span key={tag} style={{ fontSize: 13, color: '#f76e7e', background: '#FFF0F1', borderRadius: 8, padding: '4px 10px', fontWeight: 500 }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Content */}
        {record.content && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 15, color: '#191F28', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{record.content}</p>
          </div>
        )}

        {/* Timestamps */}
        <div style={{ borderTop: '1px solid #F0F2F4', paddingTop: 16 }}>
          <p style={{ fontSize: 12, color: '#C5CDD6', marginBottom: 4 }}>등록일: {formatDateTime(record.createdAt)}</p>
          {record.updatedAt !== record.createdAt && (
            <p style={{ fontSize: 12, color: '#C5CDD6' }}>수정일: {formatDateTime(record.updatedAt)}</p>
          )}
        </div>
      </div>

      {/* Actions - fixed to bottom */}
      {canEdit && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          paddingTop: 12,
          paddingLeft: 20,
          paddingRight: 20,
          background: 'white',
          borderTop: '1px solid #F0F2F4',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate(`/app/record/${record.recordId}/edit`)}
              style={{ flex: 1, background: '#F4F6F8', color: '#191F28', border: 'none', borderRadius: 14, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
            >
              수정
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{ flex: 1, background: '#FFF0F1', color: '#f76e7e', border: 'none', borderRadius: 14, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {/* Full-screen photo modal */}
      {showPhotoModal && (
        <>
          <div className="page-enter" style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '56px 16px 16px' }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{photoIdx + 1}/{sortedPhotos.length}</span>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowPhotoModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <img src={sortedPhotos[photoIdx]?.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '70dvh', objectFit: 'contain' }} />
              {photoIdx > 0 && (
                <button onClick={() => setPhotoIdx(p => p - 1)} style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}
              {photoIdx < sortedPhotos.length - 1 && (
                <button onClick={() => setPhotoIdx(p => p + 1)} style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )}
            </div>
            {sortedPhotos.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 0 40px' }}>
                {sortedPhotos.map((_, i) => (
                  <div key={i} style={{ width: i === photoIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === photoIdx ? '#f76e7e' : 'rgba(255,255,255,0.3)', transition: 'all 0.2s' }} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <>
          <div className="overlay-bg" onClick={() => setShowDeleteModal(false)} />
          <div className="modal-center page-enter">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 8, textAlign: 'center' }}>기록을 삭제할까요?</h3>
            <p style={{ fontSize: 14, color: '#8B95A1', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>이 기록을 삭제하면 복구할 수 없어요.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, background: '#F4F6F8', color: '#191F28', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>취소</button>
              <button onClick={handleDelete} style={{ flex: 1, background: '#f76e7e', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>삭제</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetaRow({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ marginTop: 1, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: sub ? 2 : 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 12, color: '#8B95A1' }}>{sub}</p>}
      </div>
    </div>
  );
}

function PinIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f76e7e" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function CalendarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function PersonIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}