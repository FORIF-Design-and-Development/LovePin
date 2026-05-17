import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, MapPin, Search, Calendar, Heart, User, X } from "lucide-react";
import { toast } from "sonner";

export default function RecordNewPage() {
  const navigate = useNavigate();
  
  // ==========================================
  // 1. 상태 관리 (State)
  // ==========================================
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [recordType, setRecordType] = useState<"COUPLE" | "INDIVIDUAL">("COUPLE");
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [repPhotoIndex, setRepPhotoIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [place, setPlace] = useState<{ name: string; address: string; lat: number; lng: number } | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const isFormValid = title.trim() && photos.length > 0 && visitDate && place && tags.length > 0;

  // ==========================================
  // 2. 액션 핸들러 및 API 연동 포인트
  // ==========================================
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length > 10) {
      toast.error("사진은 최대 10장까지만 업로드할 수 있어요.");
      return;
    }

    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    if (repPhotoIndex >= idx && repPhotoIndex > 0) setRepPhotoIndex(prev => prev - 1);
  };

  const handlePlaceSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) return;
    // 🚨 TODO: 장소 검색 로직
  };

  const handleSubmit = async () => {
    if (!isFormValid || !place) return;
    // 🚨 TODO: [API 연동] 새 기록 등록
    toast.success("기록이 등록되었어요!");
    setTimeout(() => navigate("/app/timeline"), 300); // 완료 후 타임라인으로 이동
  };

  return (
    <div className="h-full flex flex-col bg-background relative">
      
      {/* 🔹 상단 헤더 (개별 페이지 헤더) */}
      <div className="px-6 py-4 bg-background sticky top-0 z-10 flex items-center justify-between border-b border-border/50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground hover:bg-input-background rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-bold text-foreground">새 기록 추가</h1>
        <div className="w-10" />
      </div>

      {/* 🔹 스크롤 폼 영역 (하단 탭바 높이만큼 pb-32 추가) */}
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
              placeholder="제목을 입력하세요 (최대 30자)"
              maxLength={30}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 w-[84px] h-[84px] rounded-[14px] border-2 border-dashed border-border bg-input-background flex flex-col items-center justify-center gap-1 hover:bg-border/50 transition-colors"
                >
                  <Upload size={20} className="text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground font-medium">추가</span>
                </button>
              )}

              {photos.map((photo, idx) => (
                <div key={idx} className={`shrink-0 w-[84px] h-[84px] rounded-[14px] overflow-hidden relative border-2 ${idx === repPhotoIndex ? 'border-primary' : 'border-transparent'}`}>
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setRepPhotoIndex(idx)} className={`absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm ${idx === repPhotoIndex ? 'bg-primary text-white' : 'bg-black/40 text-white/90'}`}>
                    {idx === repPhotoIndex ? '대표' : '선택'}
                  </button>
                  <button onClick={() => handleRemovePhoto(idx)} className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
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
              <input className="lp-input !pl-11 w-full" type="date" max={today} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-foreground block mb-2">
              장소 <span className="text-primary">*</span>
            </label>
            {place ? (
              <div className="bg-input-background rounded-[12px] p-4 flex items-center justify-between">
                <div className="flex gap-3 items-center overflow-hidden pr-2">
                  <MapPin size={20} className="shrink-0 text-primary" />
                  <div className="truncate">
                    <p className="text-[14px] font-bold text-foreground mb-0.5 truncate">{place.name}</p>
                    <p className="text-[12px] text-muted-foreground truncate">{place.address}</p>
                  </div>
                </div>
                <button onClick={() => setPlace(null)} className="shrink-0 text-[13px] font-bold text-primary hover:underline">
                  변경
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLocationSearch(true)}
                className="w-full bg-input-background border border-border rounded-[12px] h-[52px] px-4 flex items-center gap-2.5 text-muted-foreground hover:bg-border/50 transition-colors"
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
              {['여행', '일상', '데이트'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  className={`px-4 h-[40px] rounded-full text-[13px] font-bold transition-all border ${
                    tags.includes(tag) ? 'bg-primary/5 text-primary border-primary shadow-sm' : 'bg-input-background text-muted-foreground border-transparent'
                  }`}
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
                onClick={() => setRecordType("COUPLE")}
                className={`flex-1 h-[48px] rounded-xl text-[14px] font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  recordType === "COUPLE" ? "bg-primary text-white border-primary shadow-sm" : "bg-input-background text-muted-foreground border-transparent"
                }`}
              >
                <Heart size={16} fill={recordType === "COUPLE" ? "currentColor" : "none"} /> 커플
              </button>
              <button
                onClick={() => setRecordType("INDIVIDUAL")}
                className={`flex-1 h-[48px] rounded-xl text-[14px] font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  recordType === "INDIVIDUAL" ? "bg-foreground text-background border-foreground shadow-sm" : "bg-input-background text-muted-foreground border-transparent"
                }`}
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
            placeholder="추억을 자유롭게 남겨보세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={500}
            style={{ resize: "none", height: "auto" }}
          />
          <p className="text-[12px] text-muted-foreground text-right mt-1.5">{content.length}/500</p>
        </div>

        {/* 💡 하단 탭바에 안 가리게 스크롤 제일 밑에 버튼을 자연스럽게 배치 */}
        <button onClick={handleSubmit} disabled={!isFormValid} className="btn-primary mt-4">
          기록 저장
        </button>

      </div>

      {/* 🔹 장소 검색 바텀시트 */}
      {showLocationSearch && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center animate-fade-in" onClick={() => setShowLocationSearch(false)}>
          <div className="bg-card rounded-t-[28px] p-6 w-full max-h-[85vh] h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6 shrink-0" />
            
            <form onSubmit={handlePlaceSearch} className="relative mb-6 shrink-0">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" autoFocus placeholder="장소명, 주소를 검색하세요" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="lp-input !pl-12 w-full" />
            </form>

            <div className="flex-1 overflow-y-auto space-y-2">
              {[
                { name: "서울숲", address: "서울 성동구 뚝섬로 273", lat: 37.5448, lng: 127.0557 },
                { name: "성수 카페거리", address: "서울 성동구 연무장길 일대", lat: 37.5422, lng: 127.0544 },
                { name: "한강공원", address: "서울 용산구 이촌동", lat: 37.5212, lng: 126.9697 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => { setPlace(p); setShowLocationSearch(false); }}
                  className="w-full p-4 rounded-xl hover:bg-input-background text-left transition-colors flex items-center gap-3"
                >
                  <MapPin size={20} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[15px] font-bold text-foreground mb-0.5">{p.name}</p>
                    <p className="text-[13px] text-muted-foreground">{p.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}