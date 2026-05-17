/**
 * LovePin AddRecord Page
 * Design: Emotional Minimalism — form-based record creation
 * Features: photo upload, date picker, place search, tags, record type
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp, type MemoryRecord, type RecordTag, type RecordType } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface AddRecordProps {
  editRecord?: MemoryRecord;
}

const PLACE_SUGGESTIONS = [
  { name: '서울숲', address: '서울 성동구 뚝섬로 273', lat: 37.5445, lng: 127.0374, district: '성동구' },
  { name: '성수 카페거리', address: '서울 성동구 성수이로 77', lat: 37.5448, lng: 127.0558, district: '성동구' },
  { name: '한강공원', address: '서울 영등포구 여의동로 330', lat: 37.5283, lng: 126.9322, district: '영등포구' },
  { name: '경복궁', address: '서울 종로구 사직로 161', lat: 37.5796, lng: 126.9770, district: '종로구' },
  { name: '연남동 골목길', address: '서울 마포구 연남동', lat: 37.5617, lng: 126.9239, district: '마포구' },
  { name: '북촌 한옥마을', address: '서울 종로구 계동길 37', lat: 37.5826, lng: 126.9836, district: '종로구' },
  { name: '이태원 거리', address: '서울 용산구 이태원로', lat: 37.5344, lng: 126.9944, district: '용산구' },
  { name: '홍대 거리', address: '서울 마포구 홍익로', lat: 37.5563, lng: 126.9237, district: '마포구' },
];

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&q=80',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663666287881/a6vhHtyQsDTNyBG78iJnQM/lovepin-memory-cafe-YoutCYFe6tHz66i2VDGW3W.webp',
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
];

export default function AddRecordPage({ editRecord }: AddRecordProps) {
  const { addRecord, updateRecord, coupleStatus } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState(editRecord?.title || '');
  const [photos, setPhotos] = useState<string[]>(editRecord?.photos || []);
  const [repPhoto, setRepPhoto] = useState(editRecord?.representativePhoto || 0);
  const [visitDate, setVisitDate] = useState(editRecord?.visitDate || new Date().toISOString().split('T')[0]);
  const [place, setPlace] = useState(editRecord ? { name: editRecord.place, address: editRecord.address, lat: editRecord.lat, lng: editRecord.lng, district: editRecord.district } : null as null | typeof PLACE_SUGGESTIONS[0]);
  const [placeSearch, setPlaceSearch] = useState(editRecord?.place || '');
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [tags, setTags] = useState<RecordTag[]>(editRecord?.tags || []);
  const [recordType, setRecordType] = useState<RecordType>(editRecord?.recordType || '개별 기록');
  const [content, setContent] = useState(editRecord?.content || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = title.trim() && photos.length > 0 && visitDate && place && tags.length > 0;

  const handleAddPhoto = () => {
    // Demo: add a random photo from demo set
    const available = DEMO_PHOTOS.filter(p => !photos.includes(p));
    if (available.length > 0 && photos.length < 10) {
      setPhotos(prev => [...prev, available[0]]);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    if (repPhoto >= idx && repPhoto > 0) setRepPhoto(prev => prev - 1);
  };

  const toggleTag = (tag: RecordTag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = () => {
    if (!isValid || !place) return;
    if (editRecord) {
      updateRecord(editRecord.id, { title, photos, representativePhoto: repPhoto, visitDate, place: place.name, address: place.address, lat: place.lat, lng: place.lng, district: place.district, tags, recordType, content });
      toast.success('기록이 수정되었어요');
      navigate(`/app/record/${editRecord.id}`);
    } else {
      const newRecord = addRecord({ title, photos, representativePhoto: repPhoto, visitDate, place: place.name, address: place.address, lat: place.lat, lng: place.lng, district: place.district, tags, recordType, content });
      toast.success('기록이 등록되었어요');
      navigate(`/app/record/${newRecord.id}`);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', padding: '4px 8px 4px 0' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', letterSpacing: '-0.3px' }}>
            {editRecord ? '기록 수정' : '새 기록 추가'}
          </h1>
          <div style={{ width: 32 }} />
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        {/* Title */}
        <FormSection label="제목" required>
          <input
            className="lp-input"
            placeholder="제목을 입력하세요 (최대 30자)"
            value={title}
            maxLength={30}
            onChange={e => setTitle(e.target.value)}
          />
          <p style={{ fontSize: 12, color: '#C5CDD6', textAlign: 'right', marginTop: 4 }}>{title.length}/30</p>
        </FormSection>

        {/* Photos */}
        <FormSection label="사진" required>
          <div className="photo-strip" style={{ paddingBottom: 4 }}>
            {/* Add button */}
            <button
              onClick={handleAddPhoto}
              style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 12, border: '2px dashed #E5E8EB', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span style={{ fontSize: 11, color: '#C5CDD6' }}>{photos.length}/10</span>
            </button>
            {photos.map((photo, i) => (
              <div key={i} style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 12, overflow: 'hidden', position: 'relative', border: i === repPhoto ? '2.5px solid #f76e7e' : '2.5px solid transparent' }}>
                <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {photos.length > 1 && (
                  <button
                    onClick={() => setRepPhoto(i)}
                    style={{ position: 'absolute', bottom: 4, left: 4, background: i === repPhoto ? '#f76e7e' : 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 4, padding: '2px 5px', fontSize: 10, color: 'white', fontWeight: 600 }}
                  >
                    {i === repPhoto ? '대표' : '선택'}
                  </button>
                )}
                <button
                  onClick={() => handleRemovePhoto(i)}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} />
        </FormSection>

        {/* Visit Date */}
        <FormSection label="방문 날짜" required>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{ width: '100%', background: '#F4F6F8', border: '1.5px solid transparent', borderRadius: 12, padding: '14px 16px', fontSize: 15, color: visitDate ? '#191F28' : '#C5CDD6', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>{visitDate ? visitDate.replace(/-/g, '.') : '날짜를 선택하세요'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </button>
          {showDatePicker && (
            <input
              type="date"
              max={today}
              value={visitDate}
              onChange={e => { setVisitDate(e.target.value); setShowDatePicker(false); }}
              style={{ marginTop: 8, width: '100%', background: '#F4F6F8', border: '1.5px solid #f76e7e', borderRadius: 12, padding: '14px 16px', fontSize: 15, color: '#191F28' }}
            />
          )}
        </FormSection>

        {/* Place */}
        <FormSection label="장소" required>
          {place ? (
            <div style={{ background: '#F4F6F8', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 2 }}>{place.name}</p>
                <p style={{ fontSize: 13, color: '#8B95A1' }}>{place.address}</p>
              </div>
              <button onClick={() => { setPlace(null); setPlaceSearch(''); setShowPlaceSearch(true); }} style={{ background: 'none', border: 'none', color: '#f76e7e', fontSize: 13, fontWeight: 600 }}>변경</button>
            </div>
          ) : (
            <div>
              <div style={{ position: 'relative' }}>
                <input
                  className="lp-input"
                  placeholder="장소명, 주소, 상호 검색"
                  value={placeSearch}
                  onChange={e => { setPlaceSearch(e.target.value); setShowPlaceSearch(true); }}
                  onFocus={() => setShowPlaceSearch(true)}
                />
                <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              {showPlaceSearch && (
                <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginTop: 4, overflow: 'hidden', maxHeight: 200, overflowY: 'auto' }}>
                  {PLACE_SUGGESTIONS.filter(p => !placeSearch || p.name.includes(placeSearch) || p.address.includes(placeSearch)).map(p => (
                    <button
                      key={p.name}
                      onClick={() => { setPlace(p); setPlaceSearch(p.name); setShowPlaceSearch(false); }}
                      style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', borderBottom: '1px solid #F4F6F8' }}
                    >
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: 2 }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: '#8B95A1' }}>{p.address}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </FormSection>

        {/* Tags */}
        <FormSection label="태그" required>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['여행', '일상', '데이트'] as RecordTag[]).map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} className={`tag-chip ${tags.includes(tag) ? 'selected' : ''}`}>{tag}</button>
            ))}
          </div>
          {tags.length === 0 && <p style={{ fontSize: 12, color: '#C5CDD6', marginTop: 6 }}>최소 1개 이상 선택해주세요</p>}
        </FormSection>

        {/* Record Type */}
        <FormSection label="기록 유형" required>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setRecordType('개별 기록')}
              className={`tag-chip ${recordType === '개별 기록' ? 'selected' : ''}`}
            >
              개별 기록
            </button>
            {coupleStatus === 'coupled' && (
              <button
                onClick={() => setRecordType('커플 기록')}
                className={`tag-chip ${recordType === '커플 기록' ? 'selected' : ''}`}
              >
                커플 기록
              </button>
            )}
          </div>
          {coupleStatus !== 'coupled' && (
            <p style={{ fontSize: 12, color: '#C5CDD6', marginTop: 6 }}>커플 모드에서 커플 기록을 작성할 수 있어요</p>
          )}
        </FormSection>

        {/* Content */}
        <FormSection label="본문">
          <textarea
            className="lp-input"
            placeholder="기록에 대한 이야기를 남겨보세요 (선택)"
            value={content}
            maxLength={500}
            onChange={e => setContent(e.target.value)}
            rows={4}
            style={{ resize: 'none', lineHeight: 1.6 }}
          />
          <p style={{ fontSize: 12, color: '#C5CDD6', textAlign: 'right', marginTop: 4 }}>{content.length}/500</p>
        </FormSection>
      </div>

      {/* Save button - fixed */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        paddingBottom: editRecord ? 'max(12px, env(safe-area-inset-bottom))' : 72,
        paddingTop: 12,
        paddingLeft: 20,
        paddingRight: 20,
        background: '#FAFAFA',
        borderTop: '1px solid #F0F2F4',
        zIndex: 20
      }}>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={!isValid}
          style={{ background: isValid ? '#f76e7e' : '#E5E8EB', color: isValid ? 'white' : '#8B95A1' }}
        >
          {editRecord ? '수정 완료' : '기록 저장'}
        </button>
      </div>
    </div>
  );
}

function FormSection({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 8 }}>
        {label}
        {required && <span style={{ color: '#f76e7e', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}
