/**
 * LovePin Timeline Page
 * Design: Emotional Minimalism — card-based feed with photo strips
 * Features: filter, infinite scroll feel, record cards
 */
import { useState, useMemo } from 'react';
import { useApp, type MemoryRecord, type RecordTag, type RecordType } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

type FilterState = {
  tags: RecordTag[];
  recordType: RecordType | '';
  period: { from: string; to: string };
  district: string;
};

export default function TimelinePage() {
  const { records } = useApp();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<FilterState>({ tags: [], recordType: '', period: { from: '', to: '' }, district: '' });

  const filtered = useMemo(() => {
    let list = [...records].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
    if (filter.tags.length > 0) list = list.filter(r => r.tags.some(t => filter.tags.includes(t)));
    if (filter.recordType) list = list.filter(r => r.recordType === filter.recordType);
    if (filter.district) list = list.filter(r => r.district === filter.district);
    if (filter.period.from) list = list.filter(r => r.visitDate >= filter.period.from);
    if (filter.period.to) list = list.filter(r => r.visitDate <= filter.period.to);
    return list;
  }, [records, filter]);

  const hasFilter: boolean = filter.tags.length > 0 || !!filter.recordType || !!filter.district || !!filter.period.from || !!filter.period.to;

  const resetFilter = () => setFilter({ tags: [], recordType: '', period: { from: '', to: '' }, district: '' });

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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            필터{hasFilter ? ` (${([filter.tags.length > 0, !!filter.recordType, !!filter.district, !!filter.period.from] as boolean[]).filter(Boolean).length})` : ''}
          </button>
        </div>
      </div>

      {/* Record list */}
      <div style={{ padding: '16px 20px 100px' }}>
        {filtered.length === 0 ? (
          <EmptyState hasFilter={hasFilter} onReset={resetFilter} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(record => (
              <RecordCard key={record.id} record={record} onClick={() => navigate(`/app/record/${record.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* Filter bottom sheet */}
      {showFilter && (
        <>
          <div className="overlay-bg" onClick={() => setShowFilter(false)} />
          <FilterSheet filter={filter} onChange={setFilter} onClose={() => setShowFilter(false)} onReset={resetFilter} />
        </>
      )}
    </div>
  );
}

function RecordCard({ record, onClick }: { record: MemoryRecord; onClick: () => void }) {
  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div
      className="lp-card"
      onClick={onClick}
      style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s' }}
    >
      {/* Photos strip */}
      {record.photos.length > 0 && (
        <div className="photo-strip" style={{ padding: '16px 16px 0' }}>
          {record.photos.map((photo, i) => (
            <div key={i} style={{ flexShrink: 0, width: record.photos.length === 1 ? '100%' : 140, height: 120, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {i === record.representativePhoto && record.photos.length > 1 && (
                <span style={{ position: 'absolute', top: 6, left: 6, background: '#f76e7e', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '2px 6px' }}>대표</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#191F28', letterSpacing: '-0.3px', flex: 1, marginRight: 8 }}>{record.title}</h3>
          <span className={record.recordType === '커플 기록' ? 'badge-couple' : 'badge-personal'}>{record.recordType}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f76e7e" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style={{ fontSize: 13, color: '#8B95A1' }}>{record.place}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style={{ fontSize: 13, color: '#8B95A1' }}>{formatDate(record.visitDate)}</span>
          </div>
          {record.recordType === '개별 기록' && (
            <span style={{ fontSize: 12, color: '#C5CDD6' }}>by {record.author}</span>
          )}
        </div>

        {record.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {record.tags.map(tag => (
              <span key={tag} style={{ fontSize: 12, color: '#f76e7e', background: '#FFF0F1', borderRadius: 6, padding: '2px 8px', fontWeight: 500 }}>#{tag}</span>
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
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
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

function FilterSheet({ filter, onChange, onClose, onReset }: {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const [local, setLocal] = useState(filter);

  const toggleTag = (tag: RecordTag) => {
    setLocal(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const apply = () => { onChange(local); onClose(); };
  const reset = () => { setLocal({ tags: [], recordType: '', period: { from: '', to: '' }, district: '' }); onReset(); onClose(); };

  const TAGS: RecordTag[] = ['여행', '일상', '데이트'];
  const TYPES: RecordType[] = ['커플 기록', '개별 기록'];
  const DISTRICTS = ['성동구', '종로구', '마포구', '영등포구', '강남구'];

  return (
    <div className="bottom-sheet" style={{ padding: '24px 20px 40px' }}>
      <div style={{ width: 40, height: 4, background: '#E5E8EB', borderRadius: 2, margin: '0 auto 24px' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#191F28' }}>필터</h3>
        <button onClick={reset} style={{ background: 'none', border: 'none', color: '#8B95A1', fontSize: 14 }}>초기화</button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#8B95A1', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>태그</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)} className={`tag-chip ${local.tags.includes(tag) ? 'selected' : ''}`}>{tag}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#8B95A1', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>기록 유형</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {TYPES.map(type => (
            <button key={type} onClick={() => setLocal(prev => ({ ...prev, recordType: prev.recordType === type ? '' : type }))} className={`tag-chip ${local.recordType === type ? 'selected' : ''}`}>{type}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#8B95A1', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>위치</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DISTRICTS.map(d => (
            <button key={d} onClick={() => setLocal(prev => ({ ...prev, district: prev.district === d ? '' : d }))} className={`tag-chip ${local.district === d ? 'selected' : ''}`}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#8B95A1', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>기간</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="date" className="lp-input" style={{ flex: 1, fontSize: 13 }} value={local.period.from} onChange={e => setLocal(prev => ({ ...prev, period: { ...prev.period, from: e.target.value } }))} />
          <span style={{ color: '#C5CDD6', fontSize: 14 }}>~</span>
          <input type="date" className="lp-input" style={{ flex: 1, fontSize: 13 }} value={local.period.to} onChange={e => setLocal(prev => ({ ...prev, period: { ...prev.period, to: e.target.value } }))} />
        </div>
      </div>

      <button className="btn-primary" onClick={apply}>적용하기</button>
    </div>
  );
}
