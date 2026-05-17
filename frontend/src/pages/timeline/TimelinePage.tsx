import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Filter, Heart, User, X, Check, Loader2 } from "lucide-react";

// ==========================================
// 1. API 명세서 기반 TypeScript 타입 정의
// ==========================================
interface Photo {
  imageId: number;
  imageUrl: string;
  isRepresentative: boolean;
  sequence: number;
}

interface RecordItem {
  recordId: number;
  title: string;
  visitDate: string;
  placeName: string;
  placeAddress?: string;
  latitude: number;
  longitude: number;
  tags: string[];
  recordType: "INDIVIDUAL" | "COUPLE";
  authorNickname?: string;
  photos: Photo[];
  visitCount?: number;
}

interface FilterState {
  tags: string[];
  startDate: string;
  endDate: string;
  city: string;
  district: string;
  recordType: "ALL" | "INDIVIDUAL" | "COUPLE";
  isFrequentOnly: boolean;
}

export default function TimelinePage() {
  const navigate = useNavigate();
  
  // ==========================================
  // 2. 상태 관리 (State)
  // ==========================================
  const [allRecords, setAllRecords] = useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 당겨서 새로고침 (Pull-to-Refresh) 상태
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);

  const [showFilter, setShowFilter] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const initialFilters: FilterState = { tags: [], startDate: "", endDate: "", city: "", district: "", recordType: "ALL", isFrequentOnly: false };
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);

  const isDragging = useRef(false);

  const isFilterApplied = useMemo(() => {
    return filters.tags.length > 0 || filters.startDate !== "" || filters.endDate !== "" || 
           filters.city !== "" || filters.district !== "" || filters.recordType !== "ALL" || filters.isFrequentOnly;
  }, [filters]);

  // ==========================================
  // 3. API 연동 및 비즈니스 로직
  // ==========================================
  const fetchRecords = async (cursor: string | null = null, isRefresh = false) => {
    if (!isRefresh && !isRefreshing) setIsLoading(true);
    
    try {
      const mockData: RecordItem[] = [
        {
          recordId: 10, title: "서울숲 산책한 날", visitDate: "2026-05-10", placeName: "서울숲", latitude: 37.5448, longitude: 127.0557, tags: ["일상", "데이트"], recordType: "COUPLE", visitCount: 4,
          photos: [{ imageId: 1, imageUrl: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800", isRepresentative: true, sequence: 0 }, { imageId: 2, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", isRepresentative: false, sequence: 1 }]
        },
        {
          recordId: 9, title: "주말 데이트 기록", visitDate: "2026-05-01", placeName: "경복궁", latitude: 37.5796, longitude: 126.9770, tags: ["여행"], recordType: "INDIVIDUAL", authorNickname: "예빈", visitCount: 1,
          photos: [{ imageId: 3, imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800", isRepresentative: true, sequence: 0 }]
        },
        {
          recordId: 8, title: "비 오는 날의 연남동", visitDate: "2026-04-28", placeName: "연남동 골목길", latitude: 37.5621, longitude: 126.9242, tags: ["일상"], recordType: "COUPLE", visitCount: 1,
          photos: [{ imageId: 4, imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800", isRepresentative: true, sequence: 0 }, { imageId: 5, imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800", isRepresentative: false, sequence: 1 }, { imageId: 6, imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800", isRepresentative: false, sequence: 2 }]
        }
      ];

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          if (isRefresh) setAllRecords(mockData);
          else setAllRecords((prev) => [...prev, ...mockData]);
          setNextCursor(null);
          setIsLoading(false);
          resolve();
        }, 800);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      if (filters.tags.length > 0 && !filters.tags.some(tag => record.tags.includes(tag))) return false;
      if (filters.recordType !== "ALL" && record.recordType !== filters.recordType) return false;
      if (filters.startDate && record.visitDate < filters.startDate) return false;
      if (filters.endDate && record.visitDate > filters.endDate) return false;
      if (filters.city && !record.placeAddress?.includes(filters.city)) return false;
      if (filters.district && !record.placeAddress?.includes(filters.district)) return false;
      if (filters.isFrequentOnly && (record.visitCount || 0) < 3) return false;
      return true;
    });
  }, [allRecords, filters]);

  // ==========================================
  // 4. 스크롤 및 터치(당겨서 새로고침) 이벤트
  // ==========================================
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !isLoading && !isRefreshing && nextCursor) {
      fetchRecords(nextCursor);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop <= 1) {
      startY.current = e.touches[0].clientY;
    } else {
      startY.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const y = e.touches[0].clientY;
    const diff = y - startY.current;

    if (diff > 0 && scrollRef.current && scrollRef.current.scrollTop <= 1) {
      setPullDistance(Math.min(diff * 0.4, 80));
    } else if (diff < 0) {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (startY.current === null) return;

    if (pullDistance >= 60) {
      setIsRefreshing(true);
      setPullDistance(60); 
      await fetchRecords(null, true);
      setIsRefreshing(false);
    }
    
    setPullDistance(0);
    startY.current = null;
  };

  const handleTagToggle = (tag: string) => {
    setTempFilters(prev => ({
      ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    setShowFilter(false);
  };

  const handleResetFilters = () => {
    setTempFilters(initialFilters);
    // 바로 적용을 원한다면 필터 상태까지 초기화
    // setFilters(initialFilters);
    // setShowFilter(false);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-background pb-[65px]">
      
      {/* 🔹 상단 헤더 영역 */}
      <div className="px-6 pt-6 pb-4 bg-background shrink-0 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-foreground tracking-tight">타임라인</h1>
            <p className="text-sm text-muted-foreground">함께 남긴 순간들을 모아봤어요</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setTempFilters({ ...filters }); setShowFilter(true); }} 
              className={`p-2.5 rounded-full transition-all border shadow-sm active:scale-95 ${isFilterApplied ? "bg-primary/10 border-primary/20 text-primary" : "bg-card border-border text-foreground"}`}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 타임라인 피드 영역 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-2 relative overscroll-none" 
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex justify-center items-end overflow-hidden transition-all duration-200 ease-out w-full left-0"
          style={{ height: pullDistance, opacity: pullDistance / 60 }}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center mb-2">
            <Loader2 
              size={18} 
              className={`text-primary ${isRefreshing ? "animate-spin" : ""}`} 
              style={{ transform: !isRefreshing ? `rotate(${pullDistance * 4}deg)` : "none" }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {!isLoading && filteredRecords.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Filter size={32} className="text-muted-foreground opacity-50" />
              </div>
              <p className="text-foreground font-semibold mb-2">
                {isFilterApplied ? "조건에 맞는 기록이 없어요." : "아직 작성한 기록이 없어요."}
              </p>
              <p className="text-sm text-muted-foreground">
                {isFilterApplied ? "필터 조건을 변경해 보세요." : "새로운 추억을 기록해 보세요!"}
              </p>
              {isFilterApplied && (
                <button onClick={() => { setFilters(initialFilters); setTempFilters(initialFilters); }} className="mt-6 px-5 py-2.5 rounded-full bg-input-background text-sm font-semibold text-foreground hover:bg-border/50 transition-colors">
                  필터 초기화
                </button>
              )}
            </div>
          )}

          {filteredRecords.map((record) => (
            <div
              key={record.recordId}
              onClick={() => navigate(`/app/record/${record.recordId}`)}
              className="card-emotional transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <div className="relative pt-4 px-4 pb-2">
                <div 
                  className="flex gap-2 overflow-x-auto scrollbar-hide"
                  onClick={(e) => { if (isDragging.current) e.stopPropagation(); }}
                  onMouseDown={() => { isDragging.current = false; }}
                  onMouseMove={() => { isDragging.current = true; }}
                  onTouchMove={() => { isDragging.current = true; }}
                >
                  {record.photos.map((photo, idx) => (
                    <div key={photo.imageId} className="w-[140px] h-[120px] shrink-0 rounded-[12px] overflow-hidden border border-border/40 relative">
                      <img src={photo.imageUrl} alt={`${record.title} ${idx + 1}`} className="w-full h-full object-cover" />
                      {photo.isRepresentative && record.photos.length > 1 && (
                        <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold rounded-md px-2 py-0.5">대표</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[16px] text-foreground tracking-[-0.3px] flex-1 mr-2 truncate">
                    {record.title}
                  </h3>
                  <span className={record.recordType === 'COUPLE' ? 'badge-couple' : 'badge-personal'}>
                    {record.recordType === 'COUPLE' ? '커플 기록' : '개별 기록'}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span className="text-[13px] text-muted-foreground">{record.placeName}</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="text-[13px] text-muted-foreground">{formatDate(record.visitDate)}</span>
                  </div>
                  {record.recordType === 'INDIVIDUAL' && record.authorNickname && (
                    <span className="text-[12px] text-[#C5CDD6]">by {record.authorNickname}</span>
                  )}
                </div>

                {record.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {record.tags.map(tag => (
                      <span key={tag} className="text-[12px] text-primary bg-accent rounded-md px-2 py-0.5 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && !isRefreshing && <p className="text-center text-sm text-muted-foreground py-6 font-medium animate-pulse">로딩 중...</p>}
        </div>
      </div>

      {/* 🔹 📍 상세 필터 바텀시트 모달 */}
      {showFilter && (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/60 z-[100] flex items-end justify-center animate-fade-in" onClick={() => setShowFilter(false)}>
          <div className="bg-card rounded-t-[28px] p-6 w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
            
            {/* 💡 헤더: 제목 + 초기화 + 닫기 */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[20px] font-bold text-foreground">필터</h3>
              <div className="flex items-center gap-3">
                {/* 우측 상단 초기화 버튼 */}
                <button 
                  onClick={handleResetFilters} 
                  className="text-[14px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  초기화
                </button>
                <button onClick={() => setShowFilter(false)} className="p-1.5 -mr-1.5 text-muted-foreground hover:text-foreground bg-input-background rounded-full transition-colors">
                  <X size={20}/>
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {/* 💡 태그 (Tailwind 선택 스타일 반영) */}
              <div>
                <label className="block text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-wide">태그</label>
                <div className="flex gap-2 flex-wrap">
                  {["여행", "일상", "데이트"].map((tag) => {
                    const isSelected = tempFilters.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-4 h-[40px] rounded-full text-[13px] font-bold transition-all border ${
                          isSelected ? 'bg-primary/5 text-primary border-primary shadow-sm' : 'bg-input-background text-muted-foreground border-transparent'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 💡 기록 유형 (Tailwind 선택 스타일 반영) */}
              <div>
                <label className="block text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-wide">기록 유형</label>
                <div className="flex gap-2">
                  {(["ALL", "COUPLE", "INDIVIDUAL"] as const).map((type) => {
                    const isSelected = tempFilters.recordType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setTempFilters({ ...tempFilters, recordType: type })}
                        className={`flex-1 h-[42px] rounded-xl text-[13px] font-bold transition-all border ${
                          isSelected ? 'bg-primary text-white border-primary shadow-sm' : 'bg-input-background text-muted-foreground border-transparent hover:bg-border/50'
                        }`}
                      >
                        {type === "ALL" ? "전체" : type === "COUPLE" ? "커플" : "개별"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-wide">위치 (시/군/구)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="시/도" value={tempFilters.city} onChange={(e) => setTempFilters({ ...tempFilters, city: e.target.value })} className="lp-input flex-1 !text-[14px]" />
                  <input type="text" placeholder="구/군" value={tempFilters.district} onChange={(e) => setTempFilters({ ...tempFilters, district: e.target.value })} className="lp-input flex-1 !text-[14px]" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-wide">방문 기간</label>
                <div className="flex items-center gap-2">
                  <input type="date" value={tempFilters.startDate} onChange={(e) => setTempFilters({ ...tempFilters, startDate: e.target.value })} className="lp-input flex-1 !text-[13px]" />
                  <span className="text-[#C5CDD6] font-bold">~</span>
                  <input type="date" value={tempFilters.endDate} onChange={(e) => setTempFilters({ ...tempFilters, endDate: e.target.value })} className="lp-input flex-1 !text-[13px]" />
                </div>
              </div>

              {/* 💡 하단은 필터 적용 버튼 하나로 깔끔하게 통일 */}
              <div className="pt-2 pb-safe mt-4">
                <button onClick={handleApplyFilters} className="btn-primary w-full shadow-md shadow-primary/20">필터 적용</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}