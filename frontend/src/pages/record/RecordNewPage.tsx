/**
 * LovePin AddRecord Page
 * Design: Emotional Minimalism — form-based record creation
 * Features: photo upload, date picker, place search, tags, record type (API 연동 적용)
 */
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, type MemoryRecord, type RecordTag, type RecordType } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface AddRecordProps {
  editRecord?: MemoryRecord;
}

// 사진 상태 관리를 위한 타입 (기존 URL과 새로 추가된 File을 구분)
interface PhotoItem {
  file?: File;
  previewUrl: string;
}

export default function AddRecordPage({ editRecord }: AddRecordProps) {
  // API 스펙 반영: coupleStatus -> mode ('personal' | 'couple')
  const { mode } = useApp();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  // 기본 폼 상태 (API 스펙 변수명 매핑: title, visitDate, recordType 등)
  const [title, setTitle] = useState(editRecord?.title || '');
  const [visitDate, setVisitDate] = useState(editRecord?.visitDate || today);
  const [tags, setTags] = useState<RecordTag[]>(editRecord?.tags || []);
  const [recordType, setRecordType] = useState<RecordType>(editRecord?.recordType || 'INDIVIDUAL');
  const [content, setContent] = useState(editRecord?.content || '');
  
  // 대표 사진 인덱스 초기화 (API 규격의 photos 배열에서 isRepresentative 확인)
  const initialRepIdx = editRecord ? editRecord.photos.findIndex(p => p.isRepresentative) : 0;
  const [repPhoto, setRepPhoto] = useState(initialRepIdx >= 0 ? initialRepIdx : 0);

  // 사진 관리 (API 업로드를 위해 File 객체 추적)
  const [photos, setPhotos] = useState<PhotoItem[]>(
    editRecord?.photos.map(p => ({ previewUrl: p.imageUrl })) || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 장소 관리 (API 스펙: placeName, placeAddress, latitude, longitude)
  const [place, setPlace] = useState<any | null>(
    editRecord 
      ? { 
          placeName: editRecord.placeName, 
          address: editRecord.placeAddress, 
          latitude: editRecord.latitude, 
          longitude: editRecord.longitude, 
          city: '서울특별시', // 기존 데이터 파싱 필요 시 보완
          district: '중구' 
        } 
      : null
  );
  
  // 장소 검색용 상태
  const [placeSearch, setPlaceSearch] = useState('');
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 로딩 상태
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isValid = title.trim() && photos.length > 0 && visitDate && place && tags.length > 0;

  // 1. 장소 검색 API (디바운싱 적용)
  useEffect(() => {
    if (!placeSearch.trim()) {
      setSearchResults([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`/api/places/search?keyword=${encodeURIComponent(placeSearch)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.data?.places) {
          setSearchResults(data.data.places);
        }
      } catch (error) {
        console.error('장소 검색 실패:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms 입력 대기 후 API 호출

    return () => clearTimeout(timer);
  }, [placeSearch]);

  // 2. 실제 기기 사진 첨부 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file) // 로컬 미리보기 URL 생성
      }));
      
      setPhotos(prev => {
        const updated = [...prev, ...newFiles];
        return updated.slice(0, 10); // 최대 10장 제한
      });
    }
    // 동일한 파일 재선택 가능하게 리셋
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    if (repPhoto >= idx && repPhoto > 0) setRepPhoto(prev => prev - 1);
  };

  const toggleTag = (tag: RecordTag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // 3. 기록 저장 (API 연동 - multipart/form-data)
  const handleSave = async () => {
    if (!isValid || !place || isSaving) return;
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('visitDate', visitDate);
      formData.append('recordType', recordType); // 'COUPLE' | 'INDIVIDUAL'
      formData.append('representativeIndex', repPhoto.toString());
      if (content) formData.append('content', content);

      // 장소 정보
      formData.append('kakaoPlaceId', place.kakaoPlaceId || '');
      formData.append('placeName', place.placeName);
      formData.append('address', place.address);
      formData.append('latitude', place.latitude.toString());
      formData.append('longitude', place.longitude.toString());
      formData.append('city', place.city || '서울특별시');
      formData.append('district', place.district || place.address.split(' ')[1]);

      // 태그 (명세서 기준: tags: array)
      tags.forEach(tag => formData.append('tags', tag));

      // 사진 파일 (File 객체 1~10장)
      // *주의: Full Replace 방식이므로, 기존 사진 유지를 위해서는 백엔드와 논의된 추가 식별자나 
      // 새로 다운로드받은 File 객체를 묶어서 던지는 로직이 필요할 수 있습니다.
      photos.forEach((photo) => {
        if (photo.file) {
          formData.append('photos', photo.file);
        }
      });

      const token = localStorage.getItem('accessToken');
      // editRecord.id -> editRecord.recordId 변경 적용
      const url = editRecord ? `/api/records/${editRecord.recordId}` : '/api/records';
      const method = editRecord ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
          // FormData 전송 시 Content-Type은 브라우저가 자동 설정하므로 생략해야 함
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editRecord ? '기록이 수정되었어요' : '기록이 등록되었어요');
        // data.data.recordId 사용
        navigate(`/app/record/${data.data.recordId || editRecord?.recordId}`);
      } else {
        toast.error(data.error?.message || '기록 저장에 실패했습니다.');
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', padding: '4px 8px 4px 0', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', letterSpacing: '-0.3px' }}>
            {editRecord ? '기록 수정' : '새 기록 추가'}
          </h1>
          <div style={{ width: 32 }} />
        </div>
      </div>

      <div className="page-enter" style={{ padding: '20px 20px 100px' }}>
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

        {/* Photos (실제 파일 첨부 연동) */}
        <FormSection label="사진" required>
          <div className="photo-strip" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 12, border: '2px dashed #E5E8EB', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span style={{ fontSize: 11, color: '#C5CDD6' }}>{photos.length}/10</span>
            </button>
            
            {photos.map((photo, i) => (
              <div key={i} style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 12, overflow: 'hidden', position: 'relative', border: i === repPhoto ? '2.5px solid #f76e7e' : '2.5px solid transparent' }}>
                <img src={photo.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {photos.length > 1 && (
                  <button
                    onClick={() => setRepPhoto(i)}
                    style={{ position: 'absolute', bottom: 4, left: 4, background: i === repPhoto ? '#f76e7e' : 'rgba(0,0,0,0.4)', border: 'none', borderRadius: 4, padding: '2px 5px', fontSize: 10, color: 'white', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {i === repPhoto ? '대표' : '선택'}
                  </button>
                )}
                <button
                  onClick={() => handleRemovePhoto(i)}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
          {/* 실제 파일 입력을 받는 input (숨김 처리) */}
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
        </FormSection>

        {/* Visit Date */}
        <FormSection label="방문 날짜" required>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{ width: '100%', background: '#F4F6F8', border: '1.5px solid transparent', borderRadius: 12, padding: '14px 16px', fontSize: 15, color: visitDate ? '#191F28' : '#C5CDD6', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
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
              style={{ marginTop: 8, width: '100%', background: '#F4F6F8', border: '1.5px solid #f76e7e', borderRadius: 12, padding: '14px 16px', fontSize: 15, color: '#191F28', outline: 'none' }}
            />
          )}
        </FormSection>

        {/* Place (카카오 장소 검색 연동) */}
        <FormSection label="장소" required>
          {place ? (
            <div style={{ background: '#F4F6F8', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 2 }}>{place.placeName}</p>
                <p style={{ fontSize: 13, color: '#8B95A1' }}>{place.address}</p>
              </div>
              <button onClick={() => { setPlace(null); setPlaceSearch(''); setShowPlaceSearch(true); }} style={{ background: 'none', border: 'none', color: '#f76e7e', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>변경</button>
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
                  {isSearching ? (
                    <div style={{ padding: 16, textAlign: 'center', color: '#8B95A1', fontSize: 13 }}>검색 중...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(p => (
                      <button
                        key={p.kakaoPlaceId}
                        onClick={() => { setPlace(p); setPlaceSearch(p.placeName); setShowPlaceSearch(false); }}
                        style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', borderBottom: '1px solid #F4F6F8', cursor: 'pointer' }}
                      >
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: 2 }}>{p.placeName}</p>
                        <p style={{ fontSize: 12, color: '#8B95A1' }}>{p.address}</p>
                      </button>
                    ))
                  ) : (
                    placeSearch.trim() && <div style={{ padding: 16, textAlign: 'center', color: '#8B95A1', fontSize: 13 }}>검색 결과가 없습니다.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </FormSection>

        {/* Tags */}
        <FormSection label="태그" required>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['여행', '일상', '데이트'] as RecordTag[]).map(tag => (
              <button 
                key={tag} 
                onClick={() => toggleTag(tag)} 
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  border: tags.includes(tag) ? '1px solid #f76e7e' : '1px solid #E5E8EB',
                  background: tags.includes(tag) ? '#FFF0F1' : 'white',
                  color: tags.includes(tag) ? '#f76e7e' : '#4E5968',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          {tags.length === 0 && <p style={{ fontSize: 12, color: '#C5CDD6', marginTop: 6 }}>최소 1개 이상 선택해주세요</p>}
        </FormSection>

        {/* Record Type (API 스펙 매핑) */}
        <FormSection label="기록 유형" required>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setRecordType('INDIVIDUAL')}
              style={{
                padding: '8px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                border: recordType === 'INDIVIDUAL' ? '1px solid #f76e7e' : '1px solid #E5E8EB',
                background: recordType === 'INDIVIDUAL' ? '#FFF0F1' : 'white',
                color: recordType === 'INDIVIDUAL' ? '#f76e7e' : '#4E5968',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              개별 기록
            </button>
            {mode === 'couple' && (
              <button
                onClick={() => setRecordType('COUPLE')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  border: recordType === 'COUPLE' ? '1px solid #f76e7e' : '1px solid #E5E8EB',
                  background: recordType === 'COUPLE' ? '#FFF0F1' : 'white',
                  color: recordType === 'COUPLE' ? '#f76e7e' : '#4E5968',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                커플 기록
              </button>
            )}
          </div>
          {mode !== 'couple' && (
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

      {/* Save button */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, paddingBottom: editRecord ? 'max(12px, env(safe-area-inset-bottom))' : 72, paddingTop: 12, paddingLeft: 20, paddingRight: 20, background: '#FAFAFA', borderTop: '1px solid #F0F2F4', zIndex: 20 }}>
        <button
          style={{ 
            width: '100%', 
            padding: '14px', 
            borderRadius: 12, 
            border: 'none', 
            fontSize: 16, 
            fontWeight: 700, 
            cursor: isValid && !isSaving ? 'pointer' : 'default', 
            background: isValid && !isSaving ? '#f76e7e' : '#E5E8EB', 
            color: isValid && !isSaving ? 'white' : '#8B95A1',
            transition: 'all 0.2s'
          }}
          onClick={handleSave}
          disabled={!isValid || isSaving}
        >
          {isSaving ? '저장 중...' : editRecord ? '수정 완료' : '기록 저장'}
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