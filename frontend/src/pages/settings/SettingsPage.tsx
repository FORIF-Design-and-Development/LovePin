import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 💡 useLocation 추가
import { User, ChevronRight, Bell, LogOut, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation(); // 💡 라우터 상태 확인용
  
  // 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // 사용자 정보 상태 (API 연동 전 임시 데이터)
  const [userInfo, setUserInfo] = useState({
    nickname: "예빈",
    email: "yebin@example.com",
    provider: "LOCAL", // "LOCAL" (일반) 또는 "KAKAO" (카카오)
    profileImgUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  });

  // 💡 프로필 수정 등 다른 페이지에서 넘어온 Toast 메시지 처리 로직
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      // 메시지를 띄운 후 state 초기화 (새로고침 시 무한 반복 방지)
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // 🚨 TODO: [API 연동] 내 프로필 조회 (GET /api/users/me)
  useEffect(() => {
    const fetchMyProfile = async () => {
      /*
      try {
        const response = await api.get('/api/users/me');
        setUserInfo(response.data);
        setNotificationsEnabled(response.data.pushEnabled);
      } catch (error) {
        toast.error("프로필 정보를 불러오지 못했습니다.");
      }
      */
    };
    fetchMyProfile();
  }, []);

  // 🚨 TODO: [API 연동] 알림 설정 변경 (PATCH /api/users/me/push)
  const handleTogglePush = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    /*
    try {
      await api.patch('/api/users/me/push', { pushEnabled: newValue });
      toast.success(`알림이 ${newValue ? '켜졌습니다' : '꺼졌습니다'}.`);
    } catch (error) {
      setNotificationsEnabled(!newValue); // 실패 시 원상복구
      toast.error("알림 설정 변경에 실패했습니다.");
    }
    */
  };

  // 🚨 TODO: [API 연동] 로그아웃 (POST /api/auth/logout)
  const handleLogout = async () => {
    /*
    try {
      await api.post('/api/auth/logout');
      // localStorage.removeItem('accessToken');
    } catch (error) {
      console.error(error);
    }
    */
    toast.success("로그아웃되었어요");
    setShowLogoutModal(false);
    setTimeout(() => navigate("/auth/login"), 300);
  };

  // 🚨 TODO: [API 연동] 계정 삭제 (DELETE /api/users/me)
  const handleDeleteAccount = async () => {
    /*
    try {
      await api.delete('/api/users/me');
      // localStorage.removeItem('accessToken');
    } catch (error) {
      toast.error("계정 삭제에 실패했습니다.");
      return;
    }
    */
    toast.success("계정이 삭제되었어요");
    setShowDeleteModal(false);
    setTimeout(() => navigate("/auth/login"), 300);
  };

  return (
    <div className="h-full flex flex-col bg-background pb-[65px]">
      
      {/* 🔹 상단 헤더 */}
      <div className="px-5 pt-12 pb-4 bg-background sticky top-0 z-10 border-b border-border/50">
        <h1 className="text-[22px] font-bold text-foreground tracking-[-0.5px]">설정</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        
        {/* 1. 프로필 카드 */}
        <div className="card-emotional p-5">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full bg-secondary flex items-center justify-center overflow-hidden border-[3px] border-accent shrink-0">
              {userInfo.profileImgUrl ? (
                <img src={userInfo.profileImgUrl} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-[18px] font-bold text-foreground mb-0.5 tracking-tight">{userInfo.nickname}</p>
              <p className="text-[13px] text-muted-foreground mb-1.5">{userInfo.email}</p>
              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${
                userInfo.provider === 'KAKAO' ? 'bg-[#FEE500] text-black' : 'bg-input-background text-muted-foreground'
              }`}>
                {userInfo.provider === 'KAKAO' ? '카카오 계정' : '일반 계정'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. 계정 관리 메뉴 */}
        <div className="card-emotional overflow-hidden">
          <p className="text-[12px] font-bold text-muted-foreground pt-4 pb-2 px-5 tracking-wide uppercase">계정 관리</p>
          
          <button 
            onClick={() => navigate('/app/settings/profile')}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-input-background transition-colors"
          >
            <div className="text-left">
              <p className="text-[15px] font-semibold text-foreground mb-0.5">프로필 수정</p>
              <p className="text-[12px] text-muted-foreground">사진, 닉네임 변경</p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </button>
          
          <div className="h-[1px] bg-border/50 mx-5" />
          
          <button 
            onClick={() => navigate('/app/settings/email')}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-input-background transition-colors"
          >
            <div className="text-left">
              <p className="text-[15px] font-semibold text-foreground mb-0.5">이메일 수정</p>
              <p className="text-[12px] text-muted-foreground">{userInfo.email}</p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </button>

          <div className="h-[1px] bg-border/50 mx-5" />

          <button 
            onClick={() => navigate('/app/settings/password')}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-input-background transition-colors"
          >
            <div className="text-left">
              <p className="text-[15px] font-semibold text-foreground mb-0.5">비밀번호 변경</p>
              <p className="text-[12px] text-muted-foreground">
                {userInfo.provider === 'KAKAO' ? '카카오 계정은 앱 내 변경 불가' : '현재 비밀번호 확인 후 변경'}
              </p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* 3. 알림 설정 */}
        <div className="card-emotional overflow-hidden">
          <p className="text-[12px] font-bold text-muted-foreground pt-4 pb-2 px-5 tracking-wide uppercase">알림</p>
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[15px] font-semibold text-foreground mb-0.5">앱 푸시 알림</p>
              <p className="text-[12px] text-muted-foreground">매칭, 기록 관련 알림 수신</p>
            </div>
            
            <button
              onClick={handleTogglePush}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                notificationsEnabled ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-all ${
                  notificationsEnabled ? "left-[23px]" : "left-[3px]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. 기타 영역 */}
        <div className="card-emotional overflow-hidden">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-input-background transition-colors"
          >
            <p className="text-[15px] font-semibold text-foreground">로그아웃</p>
            <LogOut size={16} className="text-muted-foreground" />
          </button>
          
          <div className="h-[1px] bg-border/50 mx-5" />
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-red-50 transition-colors"
          >
            <p className="text-[15px] font-semibold text-destructive">계정 삭제</p>
            <Trash2 size={16} className="text-destructive" />
          </button>
        </div>

        <p className="text-center text-[12px] text-muted-foreground pt-4 pb-8">LovePin v1.0.0</p>
      </div>

      {/* 🔹 로그아웃 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowLogoutModal(false)}>
          <div className="bg-card rounded-[24px] p-7 max-w-[320px] w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-[18px] font-bold text-foreground mb-2">로그아웃하시겠어요?</h3>
            <p className="text-[14px] text-muted-foreground mb-8 leading-[1.5]">다시 로그인하여 서비스를<br/>이용하실 수 있습니다.</p>
            <div className="flex gap-2.5">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 bg-input-background text-foreground font-bold rounded-[14px] py-4 hover:bg-border/50 transition-colors">취소</button>
              <button onClick={handleLogout} className="flex-1 btn-primary !w-auto">로그아웃</button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 계정 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-card rounded-[24px] p-7 max-w-[320px] w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-destructive" />
            </div>
            <h3 className="text-[18px] font-bold text-foreground mb-2">계정을 삭제할까요?</h3>
            <p className="text-[14px] text-muted-foreground mb-8 leading-[1.5]">계정을 삭제하면 복구할 수 없어요.<br/>모든 기록이 영구적으로 삭제됩니다.</p>
            <div className="flex gap-2.5">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-input-background text-foreground font-bold rounded-[14px] py-4 hover:bg-border/50 transition-colors">취소</button>
              <button onClick={handleDeleteAccount} className="flex-1 bg-destructive text-white font-bold rounded-[14px] py-4 hover:bg-destructive/90 transition-colors shadow-md shadow-destructive/20">계정 삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}