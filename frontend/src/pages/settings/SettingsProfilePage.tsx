import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, User } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  nickname: string;
  profileImageUrl: string | null;
}

export default function SettingsProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 🚨 TODO: [API 연동] 내 프로필 정보 조회
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const mockData: UserProfile = {
          nickname: "예빈",
          profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        };
        setTimeout(() => {
          setNickname(mockData.nickname);
          setProfileImage(mockData.profileImageUrl);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        toast.error("프로필 정보를 불러오지 못했습니다.");
        navigate(-1);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);
    setProfileImage(tempUrl);
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      toast.error("닉네임을 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    try {
      // 🚨 TODO: [API 연동] 프로필 정보 수정 완료 (PATCH /api/users/me)
      setTimeout(() => {
        setIsSaving(false);
        // 💡 핵심 변경점: 뒤로가기 대신 명시적 라우팅과 함께 state로 메시지 전달
        navigate("/app/settings", { 
          state: { toastMessage: "프로필이 성공적으로 수정되었어요." } 
        });
      }, 400);
    } catch (error) {
      toast.error("프로필 수정에 실패했습니다.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background pb-[65px]">
        <div className="px-5 pt-12 pb-4 bg-background border-b border-border/50">
          <h1 className="text-[18px] font-bold text-foreground opacity-0">프로필 수정</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground animate-pulse font-medium">정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background pb-[65px] page-enter">
      <div className="px-5 py-4 bg-background sticky top-0 z-10 flex items-center justify-between border-b border-border/50 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground hover:bg-input-background rounded-full transition-colors">
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <h1 className="text-[18px] font-bold text-foreground">프로필 수정</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="w-[88px] h-[88px] rounded-full overflow-hidden border-[3px] border-accent bg-input-background flex items-center justify-center shadow-sm">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-muted-foreground opacity-50" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-[28px] h-[28px] bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform border-2 border-white"
            >
              <Camera size={14} strokeWidth={2.5} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>

        <div className="mb-10">
          <label className="text-[14px] font-semibold text-foreground block mb-2">
            닉네임 <span className="text-primary">*</span>
          </label>
          <input 
            className="lp-input w-full" 
            type="text" 
            value={nickname} 
            onChange={e => setNickname(e.target.value)} 
            maxLength={20} 
            placeholder="사용하실 닉네임을 입력해 주세요"
          />
          <p className="text-[12px] text-muted-foreground text-right mt-2 font-medium">
            <span className={nickname.length >= 20 ? "text-primary" : ""}>{nickname.length}</span>/20
          </p>
        </div>

        <button className="btn-primary w-full" onClick={handleSave} disabled={!nickname.trim() || isSaving}>
          {isSaving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}