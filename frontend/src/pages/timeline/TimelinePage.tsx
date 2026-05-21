/**
 * LovePin Timeline Page (API Integrated)
 * Design: Emotional Minimalism — card-based feed with photo strips
 * Features: filter conditional layout by mode, infinite scroll, API fetching
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp, type MemoryRecord } from '@/contexts/AppContext';

const api = axios.create({ baseURL: '/api' });

type FilterState = {
  tag: string;
  recordType: 'COUPLE' | 'INDIVIDUAL' | '';
  startDate: string;
  endDate: string;
  district: string;
};

export default function TimelinePage() {
  const navigate = useNavigate();
  //  mode 상태를 정상적으로 가져와 하위 컴포넌트 제어에 활용합니다.
  const { mode, records: contextRecords } = useApp(); 

  const [records, setRecords] = useState<MemoryRecord[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<FilterState>({
    tag: '',
    recordType: '',
    startDate: '',
    endDate: '',
    district: '',
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  const hasFilter = !!(filter.tag || filter.recordType || filter.district || filter.startDate || filter.endDate);
  
  const resetFilter = () => setFilter({ tag: '', recordType: '', startDate: '', endDate: '', district: '' });

  const fetchRecords = useCallback(async (isReset = false) => {
    if (isLoading || (!isReset && !hasMore)) return;

    setIsLoading(true);
    try {
      const currentCursor = isReset ? null : nextCursor;
      const params = {
        cursor: currentCursor,
        limit: 20,
        tag: filter.tag || undefined,
        recordType: filter.recordType || undefined,
        startDate: filter.startDate || undefined,
        endDate: filter.endDate || undefined,
        district: filter.district || undefined,
      };

      const { data } = await api.get('/records', { params });
      
      const newRecords = data.data.records;
      setRecords(prev => (isReset ? newRecords : [...prev, ...newRecords]));
      setNextCursor(data.data.nextCursor);
      setHasMore(data.data.hasMore);
    } catch (error) {
      console.error('기록 목록을 불러오는데 실패했습니다:', error);
      if (isReset) setRecords(contextRecords);
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor, hasMore, isLoading, filter, contextRecords]);

  useEffect(() => {
    fetchRecords(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchRecords();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchRecords, hasMore, isLoading]);

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#191F28', letterSpacing: '-0.5px' }}>타임라인</h1>
          <button
            onClick={() => setShowFilter(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: hasFilter ? '#FFF0F1' : '#F4F6F8', border: 'none', borderRadius: 20, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: hasFilter ? '#f76e7e' : '#8B95A1' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            필터{hasFilter ? ` (${[!!filter.tag, !!filter.recordType, !!filter.district, !!filter.startDate].filter(Boolean).length})` : ''}
          </button>
        </div>
      </div>

      {/* Record list */}
      <div style={{ padding: '16px 20px 100px' }}>
        {records.length === 0 && !isLoading ? (
          <EmptyState hasFilter={hasFilter} onReset={resetFilter} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {records.map(record => (
              /*  작성자 분기를 위해 mode 상태를 Card에 props로 전달합니다. */
              <RecordCard key={record.recordId} record={record} mode={mode} onClick={() => navigate(`/app/record/${record.recordId}`)} />
            ))}
          </div>
        )}
        
        <div ref={observerTarget} style={{ height: 40, marginTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isLoading && <span style={{ fontSize: 13, color: '#8B95A1' }}>불러오는 중...</span>}
        </div>
      </div>

      {/* Filter bottom sheet */}
      {showFilter && (
        <>
          <div className="overlay-bg" onClick={() => setShowFilter(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            {/*  필터 목록 제어를 위해 mode 상태를 Sheet에 props로 전달합니다. */}
            <FilterSheet 
              filter={filter} 
              mode={mode}
              onChange={setFilter} 
              onClose={() => setShowFilter(false)} 
              onReset={resetFilter} 
            />
          </div>
        </>
      )}
    </div>
  );
}

function RecordCard({ record, mode, onClick }: { record: MemoryRecord; mode: 'personal' | 'couple'; onClick: () => void }) {
  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const sortedPhotos = [...record.photos].sort((a, b) => a.sequence - b.sequence);
  
  return (
    <div
      className="lp-card"
      onClick={onClick}
      style={{ overflow: 'hidden', cursor: 'pointer', background: 'white', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}
    >
      {/* Photos strip */}
      {sortedPhotos.length > 0 && (
        <div className="photo-strip" style={{ display: 'flex', overflowX: 'auto', gap: 8, padding: '16px 16px 0', scrollbarWidth: 'none' }}>
          {sortedPhotos.map((photo) => (
            <div key={photo.imageId} style={{ flexShrink: 0, width: sortedPhotos.length === 1 ? '100%' : 140, height: 140, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              <img src={photo.imageUrl} alt="Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {photo.isRepresentative && sortedPhotos.length > 1 && (
                <span style={{ position: 'absolute', top: 8, left: 8, background: '#f76e7e', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '3px 6px' }}>대표</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#191F28', letterSpacing: '-0.3px', flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {record.title}
          </h3>
          {/* 커플 모드일 때만 기록 유형 배지를 노출하여 직관성을 높입니다 */}
          {mode === 'couple' && (
            <span style={{ 
              fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
              background: record.recordType === 'COUPLE' ? '#FFF0F1' : '#F4F6F8', 
              color: record.recordType === 'COUPLE' ? '#f76e7e' : '#8B95A1' 
            }}>
              {record.recordType === 'COUPLE' ? '커플 기록' : '개별 기록'}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f76e7e" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontSize: 13, color: '#8B95A1' }}>{record.placeName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ fontSize: 13, color: '#8B95A1' }}>{formatDate(record.visitDate)}</span>
          </div>
          {/*  요구사항 준수: 커플 모드이면서 동시에 '개별 기록(INDIVIDUAL)'인 경우에만 작성자 닉네임을 표시합니다. */}
          {mode === 'couple' && record.recordType === 'INDIVIDUAL' && record.authorNickname && (
            <span style={{ fontSize: 12, color: '#C5CDD6' }}>by {record.authorNickname}</span>
          )}
        </div>

        {record.tags && record.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {record.tags.map(tag => (
              <span key={tag} style={{ fontSize: 12, color: '#f76e7e', background: '#FFF0F1', borderRadius: 6, padding: '3px 8px', fontWeight: 600 }}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasFilter, onReset }: { hasFilter: boolean; onReset: () => void }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ width: 72, height: 72, background: '#F4F6F8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="1.5" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#191F28', marginBottom: 8 }}>
        {hasFilter ? '조건에 맞는 기록이 없어요.' : '아직 작성한 기록이 없어요.'}
      </p>
      <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 24 }}>
        {hasFilter ? '필터를 조정해보세요.' : '첫 번째 기록을 남겨보세요!'}
      </p>
      {hasFilter && (
        <button onClick={onReset} style={{ background: '#FFF0F1', color: '#f76e7e', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 600 }}>
          필터 초기화
        </button>
      )}
    </div>
  );
}

function FilterSheet({ filter, mode, onChange, onClose, onReset }: {
  filter: FilterState;
  mode: 'personal' | 'couple';
  onChange: (f: FilterState) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const [local, setLocal] = useState<FilterState>(filter);

  const apply = () => { onChange(local); onClose(); };
  const reset = () => { 
    setLocal({ tag: '', recordType: '', startDate: '', endDate: '', district: '' }); 
    onReset(); 
    onClose(); 
  };

  const TAGS = ['여행', '일상', '데이트'];
  
  //  요구사항 반영: 커플 모드일 때만 선택지를 동적으로 활성화합니다.
  const TYPES: { label: string, value: 'COUPLE' | 'INDIVIDUAL' }[] = mode === 'couple' 
    ? [
        { label: '커플 기록', value: 'COUPLE' },
        { label: '개별 기록', value: 'INDIVIDUAL' }
      ]
    : [
        { label: '개별 기록', value: 'INDIVIDUAL' } // 개인 모드일 땐 커플 기록 필터가 의미 없음
      ];

  const DISTRICTS = ['강남구', '마포구', '서초구', '성동구', '송파구', '영등포구', '용산구', '종로구'];

  const getChipStyle = (isSelected: boolean) => ({
    padding: '8px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    border: isSelected ? '1px solid #f76e7e' : '1px solid #E5E8EB',
    background: isSelected ? '#FFF0F1' : 'white',
    color: isSelected ? '#f76e7e' : '#4E5968',
    cursor: 'pointer'
  });

  return (
    <div style={{ padding: '24px 20px 40px' }}>
      <div style={{ width: 40, height: 4, background: '#E5E8EB', borderRadius: 2, margin: '0 auto 24px' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#191F28' }}>필터</h3>
        <button onClick={reset} style={{ background: 'none', border: 'none', color: '#8B95A1', fontSize: 14, cursor: 'pointer' }}>초기화</button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#8B95A1', marginBottom: 10 }}>태그</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {TAGS.map(tag => (
            <button 
              key={tag} 
              onClick={() => setLocal(prev => ({ ...prev, tag: prev.tag === tag ? '' : tag }))} 
              style={getChipStyle(local.tag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 개인 모드일 때는 굳이 단일 선택지밖에 없으므로 UI 혼선을 줄이기 위해 영역을 노출하지 않거나 조정합니다 */}
      {mode === 'couple' && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#8B95A1', marginBottom: 10 }}>기록 유형</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {TYPES.map(type => (
              <button 
                key={type.value} 
                onClick={() => setLocal(prev => ({ ...prev, recordType: prev.recordType === type.value ? '' : type.value }))} 
                style={getChipStyle(local.recordType === type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#8B95A1', marginBottom: 10 }}>위치</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DISTRICTS.map(d => (
            <button 
              key={d} 
              onClick={() => setLocal(prev => ({ ...prev, district: prev.district === d ? '' : d }))} 
              style={getChipStyle(local.district === d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#8B95A1', marginBottom: 10 }}>기간</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input 
            type="date" 
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E8EB', borderRadius: 8, fontSize: 13, outline: 'none' }} 
            value={local.startDate} 
            onChange={e => setLocal(prev => ({ ...prev, startDate: e.target.value }))} 
          />
          <span style={{ color: '#C5CDD6', fontSize: 14 }}>~</span>
          <input 
            type="date" 
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E8EB', borderRadius: 8, fontSize: 13, outline: 'none' }} 
            value={local.endDate} 
            onChange={e => setLocal(prev => ({ ...prev, endDate: e.target.value }))} 
          />
        </div>
      </div>

      <button 
        onClick={apply}
        style={{ width: '100%', background: '#f76e7e', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
      >
        적용하기
      </button>
    </div>
  );
}