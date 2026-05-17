import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Copy, Heart, User, LogOut, Check, X } from 'lucide-react';

export default function CoupleStatusPage() {
  const navigate = useNavigate();

  // 🚨 TODO: [API 연동] 본인 정보 및 커플 상태 조회 (GET /api/couple/status)
  // 임시 더미 상태 관리 (실제로는 API 응답값을 기반으로 렌더링)
  const [coupleStatus, setCoupleStatus] = useState<'solo' | 'pending_sent' | 'pending_received' | 'coupled'>('solo');
  
  const currentUser = { nickname: "지민", profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", coupleCode: "JIMIN-2026" };
  const partner = { nickname: "민지", profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200" };
  const dday = "2024-05-10"; // 연동 전 더미값

  // UI 상태 관리
  const [matchCode, setMatchCode] = useState('');
  const [matchError, setMatchError] = useState('');
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showDdayPicker, setShowDdayPicker] = useState(false);
  const [newDday, setNewDday] = useState(dday || '');
  const [copied, setCopied] = useState(false);

  // 안 읽은 알림 갯수 (탭 바 뱃지용)
  const unreadCount = 1; // 🚨 TODO: (GET /api/notifications/unread-count)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.coupleCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('코드가 복사되었어요');
  };

  // 🚨 TODO: [API 연동] 매칭 요청 보내기 (POST /api/couple/request)
  const handleSendRequest = () => {
    if (!matchCode) { setMatchError('상대방 코드를 입력해주세요.'); return; }
    if (matchCode === currentUser.coupleCode) { setMatchError('본인의 코드는 입력할 수 없어요.'); return; }
    
    // 시연용 강제 에러 방어
    if (matchCode !== 'MINJI-2026') { setMatchError('올바르지 않은 코드예요.'); return; }
    
    setMatchError('');
    setCoupleStatus('pending_sent'); // API 성공 시 상태 변경
    toast.success('매칭 요청을 보냈어요');
  };

  // 🚨 TODO: [API 연동] 매칭 수락 (POST /api/couple/accept)
  const handleAcceptMatch = () => {
    setCoupleStatus('coupled');
    toast.success('커플 모드로 전환되었어요 💕');
  };

  // 🚨 TODO: [API 연동] 매칭 거절 (POST /api/couple/reject)
  const handleRejectMatch = () => {
    setCoupleStatus('solo');
    toast.success('요청을 거절했어요');
  };

  // 🚨 TODO: [API 연동] 매칭 요청 취소 (POST /api/couple/cancel)
  const handleCancelRequest = () => {
    setCoupleStatus('solo');
    toast.success('요청이 취소되었어요');
  };

  // 🚨 TODO: [API 연동] 연결 해제 (DELETE /api/couple/disconnect)
  const handleDisconnect = () => {
    setCoupleStatus('solo');
    setShowDisconnectModal(false);
    toast.success('연결이 해제되었어요');
  };

  // 🚨 TODO: [API 연동] 디데이 설정/수정 (PATCH /api/couple/dday)
  const handleSetDday = () => {
    if (newDday) {
      setShowDdayPicker(false);
      toast.success('디데이가 설정되었어요');
    }
  };

  const calcDday = (dateStr: string) => {
    const start = new Date(dateStr);
    const today = new Date();
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="h-full flex flex-col bg-background pb-[65px]">
      {/* 🔹 상단 헤더 및 서브 탭 */}
      <div className="bg-white px-5 pt-12 pb-0 border-b border-border sticky top-0 z-10">
        <h1 className="text-[22px] font-bold text-foreground tracking-[-0.5px] mb-4">연인</h1>
        <div className="flex">
          <button 
            className="flex-1 pb-3 text-[15px] font-bold text-foreground border-b-2 border-primary transition-all"
          >
            상태
          </button>
          <button 
            onClick={() => navigate('/app/couple/alarm')}
            className="flex-1 pb-3 text-[15px] font-medium text-muted-foreground border-b-2 border-transparent transition-all flex items-center justify-center gap-1.5"
          >
            알림
            {unreadCount > 0 && (
              <span className="bg-primary text-white rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 🔹 상태별 UI 영역 */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        
        {/* 1. SOLO 상태 */}
        {coupleStatus === 'solo' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden mx-auto mb-3 border-[3px] border-accent shadow-sm">
                <img src={currentUser.profileImage} alt="" className="w-full h-full object-cover" />
              </div>
              <p className="text-[17px] font-bold text-foreground mb-1.5">{currentUser.nickname}</p>
              <span className="bg-input-background text-muted-foreground rounded-lg text-[12px] font-bold px-2.5 py-1">개인 모드</span>
            </div>

            <div className="card-emotional p-5 mb-5">
              <p className="text-[12px] font-bold text-muted-foreground mb-2 tracking-wide">내 고유 코드</p>
              <div className="flex items-center justify-between">
                <span className="text-[20px] font-bold text-foreground tracking-[2px]">{currentUser.coupleCode}</span>
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${copied ? 'bg-accent text-primary' : 'bg-input-background text-muted-foreground hover:bg-border/50'}`}
                >
                  {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                  {copied ? '복사됨' : '복사'}
                </button>
              </div>
            </div>

            <p className="text-[14px] text-muted-foreground text-center mb-6">연인과 연결하여 함께 기록을 남겨보세요</p>

            <div className="card-emotional p-5">
              <p className="text-[14px] font-bold text-foreground mb-3">연인 코드 입력</p>
              <input
                className={`lp-input mb-2 ${matchError ? '!border-destructive focus:!border-destructive' : ''}`}
                placeholder="상대방의 고유 코드를 입력하세요"
                value={matchCode}
                onChange={e => { setMatchCode(e.target.value); setMatchError(''); }}
              />
              {matchError && <p className="text-[12px] text-destructive mb-3 px-1 font-medium">{matchError}</p>}
              <button
                className="btn-primary mt-2"
                onClick={handleSendRequest}
                disabled={!matchCode}
              >
                매칭 요청 보내기
              </button>
            </div>

            {/* 시연용 버튼 (실제 배포 시 삭제) */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col gap-2">
              <button onClick={() => setCoupleStatus('pending_received')} className="w-full text-xs text-muted-foreground bg-input-background py-3 rounded-xl">[데모] 상대방이 나에게 요청을 보냄</button>
            </div>
          </div>
        )}

        {/* 2. PENDING SENT (요청 보냄) */}
        {coupleStatus === 'pending_sent' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden mx-auto mb-3 border-[3px] border-accent shadow-sm">
                <img src={currentUser.profileImage} alt="" className="w-full h-full object-cover" />
              </div>
              <p className="text-[17px] font-bold text-foreground mb-1.5">{currentUser.nickname}</p>
            </div>

            <div className="card-emotional p-5 mb-5">
              <p className="text-[12px] font-bold text-muted-foreground mb-2 tracking-wide">내 고유 코드</p>
              <span className="text-[20px] font-bold text-foreground tracking-[2px]">{currentUser.coupleCode}</span>
            </div>

            <div className="card-emotional p-5 mb-5 border-l-4 border-l-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shrink-0">
                  <Heart size={20} className="text-primary" fill="currentColor" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground mb-1">매칭 요청을 보냈어요!</p>
                  <p className="text-[13px] text-muted-foreground">현재 상대방의 수락을 기다리는 중입니다.</p>
                </div>
              </div>
              <button onClick={handleCancelRequest} className="w-full bg-input-background text-muted-foreground font-bold text-[14px] py-3 rounded-xl hover:bg-border/50 transition-colors">
                요청 취소
              </button>
            </div>

            <p className="text-[13px] text-muted-foreground text-center">상대방이 수락하면 커플 모드로 전환됩니다.</p>
            
            {/* 시연용 버튼 (실제 배포 시 삭제) */}
            <button onClick={() => setCoupleStatus('coupled')} className="w-full mt-6 text-xs text-muted-foreground bg-input-background py-3 rounded-xl">[데모] 상대방이 수락함 (커플 전환)</button>
          </div>
        )}

        {/* 3. PENDING RECEIVED (요청 받음) */}
        {coupleStatus === 'pending_received' && (
          <div className="animate-fade-in text-center mt-10">
            <div className="w-[88px] h-[88px] rounded-full overflow-hidden mx-auto mb-5 border-[4px] border-accent shadow-md">
              <img src={partner.profileImage} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-[20px] font-bold text-foreground mb-2 tracking-tight"><span className="text-primary">{partner.nickname}</span>님이<br/>매칭을 요청했어요!</p>
            <p className="text-[14px] text-muted-foreground mb-10">수락하면 즉시 커플 모드로 전환돼요</p>

            <div className="flex gap-3">
              <button onClick={handleRejectMatch} className="flex-1 bg-input-background text-foreground font-bold text-[16px] py-4 rounded-[16px] hover:bg-border/50 transition-colors">
                거절
              </button>
              <button onClick={handleAcceptMatch} className="btn-primary flex-1 !w-auto">
                수락
              </button>
            </div>
          </div>
        )}

        {/* 4. COUPLED (커플 연결됨) */}
        {coupleStatus === 'coupled' && (
          <div className="animate-fade-in">
            {/* 커플 프로필 영역 */}
            <div className="flex items-center justify-center gap-4 mb-8 mt-2">
              <div className="text-center">
                <div className="w-[64px] h-[64px] rounded-full overflow-hidden mx-auto mb-2 border-[3px] border-accent shadow-sm">
                  <img src={currentUser.profileImage} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-[14px] font-bold text-foreground">{currentUser.nickname}</p>
              </div>

              <div className="flex flex-col items-center gap-1.5 px-2">
                <Heart size={28} className="text-primary" fill="currentColor" />
                <span className="badge-couple">커플 모드</span>
              </div>

              <div className="text-center">
                <div className="w-[64px] h-[64px] rounded-full overflow-hidden mx-auto mb-2 border-[3px] border-accent shadow-sm">
                  <img src={partner.profileImage} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-[14px] font-bold text-foreground">{partner.nickname}</p>
              </div>
            </div>

            {/* 디데이 카드 영역 */}
            <div className="card-emotional p-6 mb-5 bg-gradient-to-br from-[#FFF0F1] to-[#FFF5F5] border border-primary/10">
              {dday ? (
                <div className="text-center">
                  <p className="text-[13px] text-primary font-bold mb-1 tracking-wide">{dday.replace(/-/g, '.')}부터 함께</p>
                  <p className="text-[36px] font-extrabold text-primary tracking-[-1px] mb-4 drop-shadow-sm">D+{calcDday(dday)}</p>
                  <button onClick={() => setShowDdayPicker(true)} className="bg-white text-primary border border-primary/20 rounded-xl px-5 py-2.5 text-[13px] font-bold hover:bg-primary/5 transition-colors shadow-sm">
                    디데이 수정
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-[16px] font-bold text-foreground mb-1.5">디데이를 설정해보세요</p>
                  <p className="text-[13px] text-muted-foreground mb-5">처음 만난 날을 기록해요</p>
                  <button onClick={() => setShowDdayPicker(true)} className="btn-primary !w-auto px-6 py-3 shadow-md shadow-primary/20">
                    디데이 설정
                  </button>
                </div>
              )}
            </div>

            {/* 디데이 설정 모달 폼 */}
            {showDdayPicker && (
              <div className="card-emotional p-5 mb-5 animate-fade-in border border-border">
                <p className="text-[14px] font-bold text-foreground mb-3">처음 만난 날 선택</p>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={newDday}
                  onChange={e => setNewDday(e.target.value)}
                  className="lp-input mb-4"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowDdayPicker(false)} className="flex-1 bg-input-background text-muted-foreground font-bold rounded-xl py-3.5 hover:bg-border/50 transition-colors">취소</button>
                  <button onClick={handleSetDday} className="btn-primary flex-1 !w-auto !py-3.5">저장</button>
                </div>
              </div>
            )}

            <p className="text-[14px] text-muted-foreground text-center mb-8 mt-8">연인과 함께 기록을 작성할 수 있어요</p>

            <button
              onClick={() => setShowDisconnectModal(true)}
              className="w-full bg-transparent border-[1.5px] border-border rounded-[14px] py-3.5 text-[14px] font-bold text-muted-foreground hover:bg-input-background transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              연결 해제
            </button>
          </div>
        )}

      </div>

      {/* 🔹 연결 해제 팝업 모달 */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowDisconnectModal(false)}>
          <div className="bg-card rounded-[24px] p-7 max-w-[320px] w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={28} className="text-destructive" strokeWidth={2.5} />
            </div>
            <h3 className="text-[18px] font-bold text-foreground mb-2">연결을 해제할까요?</h3>
            <p className="text-[14px] text-muted-foreground mb-8 leading-[1.6]">
              연결을 해제하면 두 사람 사이의<br/>모든 커플 기록은 숨김 처리되며<br/>복구할 수 없어요.
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setShowDisconnectModal(false)} className="flex-1 bg-input-background text-foreground font-bold rounded-[14px] py-4 hover:bg-border/50 transition-colors">취소</button>
              <button onClick={handleDisconnect} className="flex-1 bg-destructive text-white font-bold rounded-[14px] py-4 hover:bg-destructive/90 transition-colors shadow-md shadow-destructive/20">연결 해제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}