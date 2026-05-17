import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, X, ChevronRight, Calendar } from 'lucide-react';
import { toast } from 'sonner';

// 🚨 TODO: [API 연동] 실제 카카오맵 컴포넌트 Import
// import { MapView, MockMapRef } from '@/components/Map';

// ==========================================
// 1. 기능 명세서 기반 타입 정의
// ==========================================
type ZoomLevel = 'city' | 'district' | 'detail';

interface Photo {
  imageId: number;
  imageUrl: string;
}

interface RecordItem {
  recordId: number;
  title: string;
  visitDate: string;
  placeName: string;
  placeAddress: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  recordType: 'INDIVIDUAL' | 'COUPLE';
  photos: Photo[];
}

interface PinData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  records: RecordItem[];
  type: ZoomLevel;
}

interface FilterState {
  startDate: string;
  endDate: string;
  city: string;
  district: string;
}

export default function MapPage() {
  const navigate = useNavigate();
  
  // ==========================================
  // 2. 상태 관리
  // ==========================================
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('district');
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  
  // 필터 상태
  const [showFilter, setShowFilter] = useState(false);
  const initialFilters: FilterState = { startDate: '', endDate: '', city: '', district: '' };
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);

  // 🚨 TODO: [API 연동] 위치 기반 기록 목록 조회
  useEffect(() => {
    // 시연용 Mock Data (방문 날짜순, 위치 데이터 포함)
    setTimeout(() => {
      setRecords([
        { recordId: 1, title: '서울숲 피크닉', visitDate: '2026-05-10', placeName: '서울숲', placeAddress: '서울 성동구 뚝섬로 273', city: '서울', district: '성동구', lat: 37.5448, lng: 127.0557, recordType: 'COUPLE', photos: [{ imageId: 1, imageUrl: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800' }] },
        { recordId: 2, title: '성수 카페 투어', visitDate: '2026-05-08', placeName: '성수동 카페거리', placeAddress: '서울 성동구 연무장길', city: '서울', district: '성동구', lat: 37.5422, lng: 127.0544, recordType: 'INDIVIDUAL', photos: [{ imageId: 2, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' }] },
        { recordId: 3, title: '경복궁 야간개장', visitDate: '2026-04-20', placeName: '경복궁', placeAddress: '서울 종로구 사직로 161', city: '서울', district: '종로구', lat: 37.5796, lng: 126.9770, recordType: 'COUPLE', photos: [{ imageId: 3, imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800' }] },
        { recordId: 4, title: '연남동 데이트', visitDate: '2026-04-15', placeName: '연남동 골목길', placeAddress: '서울 마포구 성미산로', city: '서울', district: '마포구', lat: 37.5617, lng: 126.9239, recordType: 'COUPLE', photos: [{ imageId: 4, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' }] },
        { recordId: 5, title: '망원 한강공원', visitDate: '2026-04-05', placeName: '망원 한강공원', placeAddress: '서울 마포구 마포나루길', city: '서울', district: '마포구', lat: 37.5532, lng: 126.8988, recordType: 'COUPLE', photos: [{ imageId: 6, imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800' }] },
      ]);
    }, 300);
  }, []);

  // ==========================================
  // 3. 필터 및 클러스터링(Grouping) 로직
  // ==========================================
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (filters.startDate && r.visitDate < filters.startDate) return false;
      if (filters.endDate && r.visitDate > filters.endDate) return false;
      if (filters.city && !r.city.includes(filters.city)) return false;
      if (filters.district && !r.district.includes(filters.district)) return false;
      return true;
    });
  }, [records, filters]);

  const pins = useMemo(() => {
    const groups: Record<string, PinData> = {};
    
    filteredRecords.forEach(r => {
      let key = '';
      let name = '';
      
      // 명세서: 줌 레벨에 따른 시/군 -> 구 -> 상세 위치 클러스터링
      if (zoomLevel === 'city') {
        key = r.city;
        name = r.city;
      } else if (zoomLevel === 'district') {
        key = r.district;
        name = r.district;
      } else {
        key = `${r.lat},${r.lng}`; // 좌표가 다르면 개별 핀
        name = r.placeName;
      }

      if (!groups[key]) {
        groups[key] = { id: key, name, lat: r.lat, lng: r.lng, records: [], type: zoomLevel };
      }
      groups[key].records.push(r);
    });

    // 명세서: 각 핀의 대표 사진은 가장 최근 기록의 첫 번째 사진
    Object.values(groups).forEach(group => {
      group.records.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
    });

    return Object.values(groups);
  }, [filteredRecords, zoomLevel]);

  // 명세서: 좌측 상단 지도 범위 문구 표시 로직
  const mapLabel = useMemo(() => {
    if (filteredRecords.length === 0) return "전체 지도";
    if (zoomLevel === 'city') return "전체 지도";
    if (zoomLevel === 'district') {
      const uniqueDistricts = new Set(pins.map(p => p.name));
      if (uniqueDistricts.size === 1) return `${pins[0].name} 일대`;
      return "현재 지도 범위";
    }
    return "상세 위치";
  }, [zoomLevel, pins, filteredRecords.length]);

  const isFilterApplied = filters.startDate || filters.endDate || filters.city || filters.district;

  // ==========================================
  // 4. 액션 핸들러
  // ==========================================
  const handlePinClick = (pin: PinData) => {
    setSelectedPin(pin);
    setActiveCardIdx(0);
    // 🚨 TODO: mapRef.current.panTo({ lat: pin.lat, lng: pin.lng }); 카카오맵 이동 로직 연동
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilter(false);
    setSelectedPin(null);
  };

  const resetFilters = () => {
    setTempFilters(initialFilters);
    setFilters(initialFilters);
    setShowFilter(false);
    setSelectedPin(null);
  };

  // 캐러셀 스와이프 감지
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = 280; // 카드의 고정 너비
    const newIndex = Math.round(scrollLeft / width);
    setActiveCardIdx(newIndex);
  };

  return (
    <div className="h-full flex flex-col bg-background pb-[65px] relative overflow-hidden">
      
      {/* 🔹 상단 컨트롤 바 (지도 범위 문구 & 필터 버튼) */}
      <div className="absolute top-10 left-0 w-full px-5 flex items-center justify-between z-10 pointer-events-none mt-safe">
        <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-auto border border-border/50">
          <MapPin size={16} className="text-primary shrink-0" />
          <span className="text-[14px] font-bold text-foreground tracking-tight">{mapLabel}</span>
        </div>
        
        <button
          onClick={() => setShowFilter(true)}
          className={`px-4 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 pointer-events-auto transition-all ${
            isFilterApplied ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-white/95 backdrop-blur-md text-foreground border border-border/50'
          }`}
        >
          <Filter size={16} />
          <span className="text-[13px] font-bold">필터</span>
        </button>
      </div>

      {/* 🔹 카카오맵 렌더링 영역 */}
      <div className="flex-1 w-full relative bg-[#E5E8EB]">
        {/* 🚨 TODO: 실제 카카오맵 컴포넌트로 교체 */}
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground font-medium opacity-50">카카오맵 로드 영역</p>
        </div>

        {/* 📍 마커(핀) 렌더링 */}
        <div className="absolute inset-0 pointer-events-none">
          {pins.map((pin) => {
            const count = pin.records.length;
            const repPhoto = pin.records[0]?.photos[0]?.imageUrl;
            
            // 명세서: 5개 이상일 경우 강조 핀 스타일 적용 (크기 1.2배, 테두리 진하게)
            const isHighlighted = count >= 5;
            const pinSize = isHighlighted ? 64 : 52;
            
            // 시연용 임시 좌표 계산 (실제로는 카카오맵 CustomOverlay 활용)
            const offsetX = (pin.lng - 126.9918) * 800;
            const offsetY = (37.5519 - pin.lat) * 800;

            return (
              <div
                key={pin.id}
                className="absolute pointer-events-auto cursor-pointer flex flex-col items-center hover:z-20 transition-transform active:scale-95"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
                }}
                onClick={() => handlePinClick(pin)}
              >
                <div className="relative flex items-center justify-center drop-shadow-md">
                  {/* 테라드롭 핀 형태 */}
                  <div 
                    className={`rounded-full overflow-hidden flex items-center justify-center bg-white ${isHighlighted ? 'border-[3px] border-primary' : 'border-2 border-white'}`}
                    style={{ width: pinSize, height: pinSize, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)' }}
                  >
                    {repPhoto ? (
                      <img src={repPhoto} alt="" className="w-full h-full object-cover" style={{ transform: 'rotate(45deg) scale(1.4)' }} />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center" style={{ transform: 'rotate(45deg)' }}>
                        <MapPin size={24} className="text-primary" />
                      </div>
                    )}
                  </div>
                  
                  {/* 기록 수 표시 */}
                  {count > 1 && (
                    <div className={`absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${isHighlighted ? 'bg-primary w-6 h-6 text-[12px] border-2 border-white' : 'bg-foreground w-5 h-5 text-[11px] border-[1.5px] border-white'}`}>
                      {count}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 명세서: 빈 상태 안내 문구 */}
        {!selectedPin && filteredRecords.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md px-6 py-5 rounded-[20px] shadow-sm text-center flex flex-col items-center border border-border/50">
            <Filter size={28} className="text-muted-foreground mb-3 opacity-40" />
            <p className="text-[15px] font-bold text-foreground">조건에 맞는 기록이 없어요.</p>
            <p className="text-[13px] text-muted-foreground mt-1.5">필터를 변경하거나 지도를 이동해 보세요.</p>
          </div>
        )}
      </div>

      {/* 🔹 상세 카드 오버레이 캐러셀 (명세서 반영) */}
      {selectedPin && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end animate-fade-in">
          {/* 어두운 배경 (클릭 시 닫힘) */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setSelectedPin(null)} />
          
          <div className="relative z-30 pb-[80px] w-full flex flex-col">
            {/* 오버레이 헤더: 범위명 및 기록 수 */}
            <div className="px-5 mb-4 drop-shadow-md">
              <span className="bg-black/70 text-white text-[13px] font-bold px-4 py-2 rounded-full backdrop-blur-md">
                {selectedPin.name} · {selectedPin.records.length}개의 기록
              </span>
            </div>

            {/* 좌우 스냅 캐러셀 */}
            <div 
              className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide px-5 gap-3 pb-2"
              onScroll={handleScroll}
            >
              {selectedPin.records.map((record, idx) => (
                <div 
                  key={record.recordId} 
                  className="w-[280px] shrink-0 snap-center bg-card rounded-[20px] shadow-xl overflow-hidden flex flex-col border border-border/50 active:scale-[0.98] transition-transform cursor-pointer"
                  onClick={() => navigate(`/app/record/${record.recordId}`)}
                >
                  {/* 대표 사진 */}
                  <div className="w-full h-[180px] bg-secondary relative">
                    {record.photos[0] ? (
                      <img src={record.photos[0].imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 text-[13px] font-medium">사진 없음</div>
                    )}
                  </div>
                  
                  {/* 기록 정보 */}
                  <div className="p-5 bg-white flex flex-col">
                    <h3 className="text-[17px] font-bold text-foreground truncate mb-2.5">{record.title}</h3>
                    
                    <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                      <Calendar size={14} />
                      <p className="text-[13px] font-medium">{record.visitDate.replace(/-/g, '.')}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin size={14} />
                      <p className="text-[13px] font-medium truncate">{record.placeName}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* 우측 여백 확보용 빈 박스 */}
              <div className="w-[20px] shrink-0" />
            </div>

            {/* 액션 및 페이지네이션 (닫기, 도트, 이동) */}
            <div className="flex items-center justify-between px-6 mt-4">
              <button 
                onClick={() => setSelectedPin(null)} 
                className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              {/* 하단 중앙 인덱스 (페이지네이션 도트) */}
              <div className="flex gap-1.5">
                {selectedPin.records.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeCardIdx ? 'w-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1.5 bg-white/40'}`} 
                  />
                ))}
              </div>

              <button 
                onClick={() => navigate(`/app/record/${selectedPin.records[activeCardIdx].recordId}`)} 
                className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-colors"
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 필터 바텀시트 모달 (✨ fixed -> absolute 변경하여 컴퓨터 화면 꽉참 버그 해결) */}
      {showFilter && (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/60 z-[100] flex items-end justify-center animate-fade-in" onClick={() => setShowFilter(false)}>
    <div className="bg-card rounded-t-[28px] p-6 w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">지도 필터</h3>
              <button onClick={() => setShowFilter(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground bg-input-background rounded-full transition-colors"><X size={20}/></button>
            </div>

            <div className="space-y-7">
              {/* 명세서: 기간 (달력 선택) */}
              <div>
                <label className="block text-[13px] font-semibold text-muted-foreground mb-2.5 uppercase tracking-wide">방문 기간</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input type="date" value={tempFilters.startDate} onChange={(e) => setTempFilters({ ...tempFilters, startDate: e.target.value })} className="lp-input !pl-9 w-full !text-[13px]" />
                  </div>
                  <span className="text-muted-foreground font-bold">~</span>
                  <div className="relative flex-1">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input type="date" value={tempFilters.endDate} onChange={(e) => setTempFilters({ ...tempFilters, endDate: e.target.value })} className="lp-input !pl-9 w-full !text-[13px]" />
                  </div>
                </div>
              </div>

              {/* 명세서: 위치 (시/군/구) */}
              <div>
                <label className="block text-[13px] font-semibold text-muted-foreground mb-2.5 uppercase tracking-wide">위치 (시/군/구)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="시/도 (예: 서울)" value={tempFilters.city} onChange={(e) => setTempFilters({ ...tempFilters, city: e.target.value })} className="lp-input flex-1 !text-[13px]" />
                  <input type="text" placeholder="구/군 (예: 마포구)" value={tempFilters.district} onChange={(e) => setTempFilters({ ...tempFilters, district: e.target.value })} className="lp-input flex-1 !text-[13px]" />
                </div>
              </div>

              {/* 적용 버튼 영역 */}
              <div className="pt-2 flex gap-3 pb-safe">
                <button onClick={resetFilters} className="flex-1 h-[52px] rounded-[14px] bg-input-background text-muted-foreground font-bold hover:bg-border/50 transition-all">초기화</button>
                <button onClick={applyFilters} className="btn-primary flex-[2]">필터 적용</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}