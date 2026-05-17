import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, MapPin, Search, Calendar, Heart, User, X } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    kakao: any;
  }
}

interface LocationData {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

interface PhotoItem {
  id?: string | number;
  preview: string;
  file?: File;
}

export default function RecordEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // DOM Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 로딩 및 제출 상태
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<"COUPLE" | "INDIVIDUAL">("COUPLE");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // 장소 검색 모달 상태
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);

  const today = new Date().toISOString().split("T")[0];
  const isFormValid = title.trim().length > 0 && photos.length > 0 && date && location !== null && tags.length > 0;

  // 🚨 TODO: [API 연동] 기존 데이터 상세 조회 (GET /api/records/:id)
  useEffect(() => {
    const fetchOriginalRecord = async () => {
      setIsInitialLoading(true);
      try {
        /*
        const response = await api.get(`/api/records/${id}`);
        const data = response.data;
        setTitle(data.title);
        setContent(data.content || "");
        setDate(data.visitDate);
        setTags(data.tags);
        setType(data.recordType);
        setLocation({ name: data.placeName, address: data.placeAddress, lat: data.latitude, lng: data.longitude });
        setPhotos(data.photos.map(p => ({ id: p.imageId, preview: p.imageUrl })));
        */

        // 시연용 임시 기존 데이터 불러오기 (Mock Data)
        setTimeout(() => {
          setTitle("서울숲 산책한 날");
          setContent("오랜만에 서울숲에서 산책을 했어요. 날씨가 정말 좋았고, 함께 걸으면서 많은 이야기를 나눴습니다. 다음에 또 오고 싶네요. 🌳");
          setDate("2026-05-10");
          setTags(["일상", "데이트"]);
          setType("COUPLE");
          setLocation({
            name: "서울숲",
            address: "서울 성동구 뚝섬로 273",
            lat: 37.5448,
            lng: 127.0557
          });
          setPhotos([
            { id: 1, preview: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800" },
            { id: 2, preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" }
          ]);
          setIsInitialLoading(false);
        }, 300);

      } catch (error) {
        toast.error("기록 데이터를 불러오지 못했습니다.");
        navigate(-1);
      }
    };
    fetchOriginalRecord();
  }, [id, navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 10) {
      toast.error("사진은 최대 10장까지만 업로드할 수 있습니다.");
      return;
    }

    const newPhotos = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    
    setPhotos((prev) => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 🚨 TODO: [API 연동] 카카오맵 장소 검색 API 연동
  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) return;

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      toast.error("카카오맵 API를 불러오지 못했습니다.");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const results = data.map((place) => ({
          name: place.place_name,
          address: place.road_address_name || place.address_name,
          lat: Number(place.y),
          lng: Number(place.x),
        }));
        setSearchResults(results);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setSearchResults([]);
        toast.info("검색 결과가 없습니다.");
      }
    });
  };

  const handleLocationSelect = (loc: LocationData) => {
    setLocation(loc);
    setShowLocationSearch(false);
    setSearchKeyword("");
    setSearchResults([]);
  };

  const handleTagToggle = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  // 🚨 TODO: [API 연동] 수정 데이터 multipart/form-data 전송 (PATCH /api/records/:id)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    
    /*
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("visitDate", date);
    formData.append("placeName", location!.name);
    formData.append("placeAddress", location!.address);
    if (location?.lat && location?.lng) {
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lng.toString());
    }
    formData.append("recordType", type);
    tags.forEach(tag => formData.append("tags", tag));

    const existingImageIds = photos.filter(p => p.id).map(p => p.id);
    formData.append("existingImageIds", JSON.stringify(existingImageIds));

    const newFiles = photos.filter(p => p.file).map(p => p.file as File);
    newFiles.forEach(file => formData.append("newImages", file));

    try {
      await api.patch(`/api/records/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("기록이 수정되었습니다 ✨");
      navigate(`/app/record/${id}`, { replace: true });
    } catch (error) {
      toast.error("기록 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
    */

    // 명세서 반영: 커플 기록 수정 완료 시에만 상대방에게 푸시 알림 발생(백엔드 API 아키텍처 연동 필요)
    toast.success("기록이 수정되었습니다 ✨");
    setTimeout(() => navigate(`/app/record/${id || 1}`, { replace: true }), 300);
  };

  if (isInitialLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <p className="text-sm font-medium text-muted-foreground animate-pulse">기존 기록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    // 💡 page-enter 클래스를 추가하여 상세페이지와의 트랜지션을 부드럽게 매칭했습니다.
    <div className="h-full flex flex-col bg-background relative page-enter">
      
      {/* 🔹 상단 헤더 */}
      <div className="px-6 py-4 bg-background sticky top-0 z-10 flex items-center justify-between border-b border-border/50">
        <button type="button" onClick={() => navigate(-1)} className="text-muted-foreground font-semibold text-[14px] hover:text-foreground transition-colors" disabled={isSubmitting}>
          취소
        </button>
        <h1 className="text-[18px] font-bold text-foreground">기록 수정</h1>
        <div className="w-8" />
      </div>

      {/* 🔹 스크롤 폼 영역 (RecordNewPage와 완전히 동일한 계층 구조 구조화) */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-[120px] space-y-6">
        
        {/* 섹션 1: 제목 및 사진 */}
        <div className="card-emotional p-6">
          <div className="mb-6">
            <label className="text-[14px] font-semibold text-foreground block mb-2">
              제목 <span className="text-primary">*</span>
            </label>
            <input
              className="lp-input"
              type="text"
              placeholder="제목을 입력하세요"
              maxLength={30}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-[12px] text-muted-foreground text-right mt-1.5">{title.length}/30</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[14px] font-semibold text-foreground">
                사진 <span className="text-primary">*</span>
              </label>
              <span className="text-[12px] text-muted-foreground">{photos.length}/10</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
              {photos.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 w-[84px] h-[84px] rounded-[14px] border-2 border-dashed border-border bg-input-background flex flex-col items-center justify-center gap-1 hover:bg-border/50 transition-colors"
                  disabled={isSubmitting}
                >
                  <Upload size={20} className="text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground font-medium">추가</span>
                </button>
              )}

              {photos.map((photo, idx) => (
                <div key={idx} className={`shrink-0 w-[84px] h-[84px] rounded-[14px] overflow-hidden relative border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'}`}>
                  <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-white shadow-sm">
                      대표
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm"
                    disabled={isSubmitting}
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} multiple accept="image/*" className="hidden" />
          </div>
        </div>

        {/* 섹션 2: 언제 어디서 */}
        <div className="card-emotional p-6">
          <div className="mb-6">
            <label className="text-[14px] font-semibold text-foreground block mb-2">
              방문 날짜 <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                className="lp-input !pl-11 w-full"
                type="date"
                max={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-foreground block mb-2">
              장소 <span className="text-primary">*</span>
            </label>
            {location ? (
              <div className="bg-input-background rounded-[12px] p-4 flex items-center justify-between">
                <div className="flex gap-3 items-center overflow-hidden pr-2">
                  <MapPin size={20} className="shrink-0 text-primary" />
                  <div className="truncate">
                    <p className="text-[14px] font-bold text-foreground mb-0.5 truncate">{location.name}</p>
                    <p className="text-[12px] text-muted-foreground truncate">{location.address}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setLocation(null)} className="shrink-0 text-[13px] font-bold text-primary hover:underline" disabled={isSubmitting}>
                  변경
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLocationSearch(true)}
                className="w-full bg-input-background border border-border rounded-[12px] h-[52px] px-4 flex items-center gap-2.5 text-muted-foreground hover:bg-border/50 transition-colors"
                disabled={isSubmitting}
              >
                <Search size={18} />
                <span className="text-[14px]">장소를 검색해 주세요</span>
              </button>
            )}
          </div>
        </div>

        {/* 섹션 3: 분류 */}
        <div className="card-emotional p-6">
          <div className="mb-6">
            <label className="text-[14px] font-semibold text-foreground block mb-3">
              태그 <span className="text-primary">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {["여행", "일상", "데이트"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 h-[40px] rounded-full text-[13px] font-bold transition-all border ${
                    tags.includes(tag) ? 'bg-primary/5 text-primary border-primary shadow-sm' : 'bg-input-background text-muted-foreground border-transparent'
                  }`}
                  disabled={isSubmitting}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-foreground block mb-3">
              기록 유형 <span className="text-primary">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("COUPLE")}
                className={`flex-1 h-[48px] rounded-xl text-[14px] font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  type === "COUPLE" ? "bg-primary text-white border-primary shadow-sm" : "bg-input-background text-muted-foreground border-transparent"
                }`}
                disabled={isSubmitting}
              >
                <Heart size={16} fill={type === "COUPLE" ? "currentColor" : "none"} /> 커플
              </button>
              <button
                type="button"
                onClick={() => setType("INDIVIDUAL")}
                className={`flex-1 h-[48px] rounded-xl text-[14px] font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  type === "INDIVIDUAL" ? "bg-foreground text-background border-foreground shadow-sm" : "bg-input-background text-muted-foreground border-transparent"
                }`}
                disabled={isSubmitting}
              >
                <User size={16} /> 개별
              </button>
            </div>
          </div>
        </div>

        {/* 섹션 4: 본문 */}
        <div className="card-emotional p-6">
          <label className="text-[14px] font-semibold text-foreground block mb-2">
            본문 <span className="text-muted-foreground font-normal ml-1">(선택)</span>
          </label>
          <textarea
            className="lp-input w-full"
            placeholder="추억의 수정본을 작성해 보세요 ✍️"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={500}
            style={{ resize: "none", height: "auto" }}
            disabled={isSubmitting}
          />
          <p className="text-[12px] text-muted-foreground text-right mt-1.5">{content.length}/500</p>
        </div>

        {/* 하단 탭바 레이아웃 밀림 방지용 고정형 단일 버튼 매핑 */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="btn-primary mt-4"
        >
          {isSubmitting ? "수정 사항 저장 중..." : "수정 완료"}
        </button>

      </div>

      {/* 🔹 장소 검색 모달 바텀시트 */}
      {showLocationSearch && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center animate-fade-in" onClick={() => setShowLocationSearch(false)}>
          <div className="bg-card rounded-t-[28px] p-6 w-full max-h-[85vh] h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6 shrink-0" />
            
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-lg font-bold text-foreground">장소 검색</h3>
              <button type="button" onClick={() => setShowLocationSearch(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground bg-input-background rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSearchLocation} className="relative mb-6 shrink-0 flex gap-2">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="예: 서울숲, 스타벅스 성수점"
                  className="lp-input !pl-12 w-full"
                />
              </div>
              <button type="submit" className="px-5 bg-primary text-white font-bold rounded-xl whitespace-nowrap hover:opacity-90 transition-opacity text-sm">
                검색
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((placeItem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLocationSelect(placeItem)}
                    className="w-full p-4 rounded-xl hover:bg-input-background text-left transition-colors flex items-center gap-3 border border-transparent hover:border-border/50"
                  >
                    <MapPin size={20} className="text-primary shrink-0" />
                    <div>
                      <p className="text-[15px] font-bold text-foreground mb-0.5">{placeItem.name}</p>
                      <p className="text-[13px] text-muted-foreground">{placeItem.address}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 pb-20">
                  <MapPin size={40} className="opacity-20 text-foreground" />
                  <p className="font-medium text-sm">검색 결과가 여기에 표시됩니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}