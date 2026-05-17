import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, MapPin, Edit2, Trash2, X, Download, ChevronRight } from "lucide-react";
import { toast } from "sonner";

// ==========================================
// 1. API 명세서 기반 TypeScript 타입 정의
// ==========================================
interface RecordData {
  id: string;
  title: string;
  location: string;
  locationDetail: string;
  date: string;
  images: string[];
  content: string | null;
  tags: string[];
  type: "couple" | "individual";
  authorId: string;
  authorNickname: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function RecordDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // ==========================================
  // 2. 상태 관리 (State)
  // ==========================================
  const [record, setRecord] = useState<RecordData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 💡 [권한 제어용 Mock 데이터] 실제로는 Context나 상태 관리 라이브러리에서 가져옵니다.
  const currentUserId = "user_123";

  // ==========================================
  // 3. API 연동 및 비즈니스 로직
  // ==========================================
  
  // 🚨 TODO: [API 연동] 기록 상세 조회 (GET /api/records/:id)
  useEffect(() => {
    const fetchRecordDetail = async () => {
      setIsLoading(true);
      /*
      try {
        const response = await api.get(`/api/records/${id}`);
        setRecord(response.data);
      } catch (error) {
        toast.error("기록을 불러오지 못했습니다.");
        navigate(-1);
      }
      */

      // 시연용 Mock Data
      setTimeout(() => {
        setRecord({
          id: id || "1",
          title: "서울숲 산책한 날",
          location: "서울숲",
          locationDetail: "서울 성동구 뚝섬로 273",
          date: "2026-05-10",
          images: [
            "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
          ],
          content: "오랜만에 서울숲에서 산책을 했어요. 날씨가 정말 좋았고, 함께 걸으면서 많은 이야기를 나눴습니다. 다음에 또 오고 싶네요. 🌳",
          tags: ["일상", "데이트"],
          type: "couple",
          authorId: "user_123", // 권한 체크용
          authorNickname: "예빈",
          createdAt: "2026.05.10 14:30",
          updatedAt: "2026.05.10 14:30",
        });
        setIsLoading(false);
      }, 300);
    };

    fetchRecordDetail();
  }, [id, navigate]);

  // 🚨 TODO: [API 연동] 기록 삭제 (DELETE /api/records/:id)
  const handleDelete = async () => {
    /*
    try {
      await api.delete(`/api/records/${id}`);
      // 알림 처리: 백엔드에서 커플 기록 삭제 시 상대방에게 푸시 알림 전송 요망
      toast.success("기록이 삭제되었습니다");
      navigate("/app/timeline", { replace: true });
    } catch (error) {
      toast.error("기록 삭제에 실패했습니다.");
    }
    */
    setShowDeleteModal(false);
    toast.success("기록이 삭제되었습니다");
    navigate("/app/timeline", { replace: true });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setCurrentImageIndex(newIndex);
  };

  // ==========================================
  // 4. 권한 제어 로직
  // ==========================================
  const canEditOrDelete = record ? (record.type === "couple" || record.authorId === currentUserId) : false;

  // ==========================================
  // 5. UI 렌더링
  // ==========================================
  if (isLoading || !record) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <p className="text-sm font-medium text-muted-foreground animate-pulse">기록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background pb-[65px] page-enter relative">
      
      {/* 🔹 상단 헤더 (투명 배경으로 사진 위에 얹음) */}
      <div className="absolute top-0 left-0 w-full z-10 px-5 pt-12 pb-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm">
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-safe">
        
        {/* 📸 1. 사진 캐러셀 영역 (사진 크기 최적화 반영) */}
        {record.images.length > 0 && (
          // ✨ 변경 포인트: 고정 높이 h-[360px]를 비율 기반 aspect-[4/3]으로 변경
          // 기기 가로폭에 맞춰 세로 높이가 황금비율로 자동 조절되어 한눈에 들어옵니다.
          <div className="relative w-full aspect-[4/3] bg-black shrink-0 animate-fade-in">
            <div 
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              onScroll={handleScroll}
            >
              {record.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="w-full h-full shrink-0 snap-center relative cursor-pointer flex items-center justify-center"
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setShowImageModal(true);
                  }}
                >
                  {/* object-contain 유지: 사진 비율을 지키면서 영역 안에 쏙 들어오게 함 */}
                  <img 
                    src={img} 
                    alt={`기록 사진 ${idx + 1}`} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))}
            </div>
            
            {/* 캐러셀 인덱스 표시 (위치 미세 조정) */}
            {record.images.length > 1 && (
              <div className="absolute bottom-4 right-5 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider shadow-sm z-10">
                {currentImageIndex + 1} / {record.images.length}
              </div>
            )}
          </div>
        )}

        {/* 📝 2. 기록 상세 영역 */}
        <div className="px-5 py-6">
          
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-[22px] font-bold text-foreground leading-[1.3] tracking-tight truncate pr-4">{record.title}</h1>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-primary shrink-0" />
              <p className="text-[14px] font-bold text-foreground truncate">{record.location}</p>
            </div>
            <p className="text-[13px] text-muted-foreground ml-[22px] truncate">{record.locationDetail}</p>
          </div>

          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-6">
            <div className="flex gap-1.5 flex-wrap">
              {record.tags.map(tag => (
                <span key={tag} className="text-[12px] font-semibold text-muted-foreground bg-input-background px-3 py-1 rounded-full border border-border">
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-[13px] font-bold text-muted-foreground shrink-0">{record.date.replace(/-/g, '.')}</p>
          </div>

          {/* 명세서: 본문이 있는 경우에만 렌더링 */}
          {record.content && (
            <div className="mb-8">
              <p className="text-[15px] text-foreground leading-[1.6] whitespace-pre-wrap font-medium">
                {record.content}
              </p>
            </div>
          )}

          {/* 메타데이터 (Emotional Card Style 적용) */}
          <div className="card-emotional bg-secondary/50 p-5 space-y-3 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-semibold text-muted-foreground">기록 유형</span>
              <span className={`text-[12px] font-bold px-2.5 py-1 rounded-md ${record.type === 'couple' ? 'bg-primary/10 text-primary' : 'bg-white text-muted-foreground border border-border'}`}>
                {record.type === "couple" ? "커플 기록" : "개별 기록"}
              </span>
            </div>
            
            {/* 개별 기록일 때만 작성자 표시 */}
            {record.type === "individual" && record.authorNickname && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-muted-foreground">작성자</span>
                <span className="text-[13px] font-bold text-foreground">{record.authorNickname}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-semibold text-muted-foreground">등록일</span>
              <span className="text-[13px] font-medium text-foreground">{record.createdAt}</span>
            </div>

            {record.updatedAt !== record.createdAt && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-semibold text-muted-foreground">수정일</span>
                <span className="text-[13px] font-medium text-foreground">{record.updatedAt}</span>
              </div>
            )}
          </div>

          {/* 3. 액션 버튼 (수정/삭제 권한 제어) */}
          {canEditOrDelete && (
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/app/record/${record.id}/edit`)} 
                className="flex-1 h-[52px] bg-input-background text-foreground font-bold rounded-[14px] flex items-center justify-center gap-2 hover:bg-border/50 transition-colors"
              >
                <Edit2 size={16} />
                수정하기
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className="flex-1 h-[52px] bg-red-50 text-destructive font-bold rounded-[14px] flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
                삭제하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🖼 4. 전체화면 사진 뷰어 모달 */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in" onClick={() => setShowImageModal(false)}>
          <div className="flex items-center justify-between p-5 pt-12 shrink-0 bg-gradient-to-b from-black/50 to-transparent">
            <button onClick={(e) => { e.stopPropagation(); setShowImageModal(false); }} className="p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm">
              <X size={28} className="text-white" />
            </button>
            <span className="text-[14px] font-bold tracking-widest text-white">
              {currentImageIndex + 1} / {record.images.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 🚨 TODO: 이미지 다운로드 로직 (a태그 활용 blob 다운로드 등)
                toast.success("사진이 기기에 저장되었습니다.");
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            >
              <Download size={24} className="text-white" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            {currentImageIndex > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev - 1); }} 
                className="absolute left-4 p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
            )}

            <img
              src={record.images[currentImageIndex]}
              alt={`크게 보기 ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {currentImageIndex < record.images.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev + 1); }} 
                className="absolute right-4 p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🗑 5. 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-card rounded-[24px] p-7 max-w-[320px] w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-destructive" strokeWidth={2.5} />
            </div>
            <h3 className="text-[18px] font-bold text-foreground mb-2">기록을 삭제할까요?</h3>
            <p className="text-[14px] text-muted-foreground mb-8 leading-[1.6]">
              삭제한 기록은 복구할 수 없어요.<br/>
              {record.type === 'couple' ? '상대방의 화면에서도 삭제됩니다.' : ''}
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-input-background text-foreground font-bold rounded-[14px] py-4 hover:bg-border/50 transition-colors">취소</button>
              <button onClick={handleDelete} className="flex-1 bg-destructive text-white font-bold rounded-[14px] py-4 hover:bg-destructive/90 transition-colors shadow-md shadow-destructive/20">삭제하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}