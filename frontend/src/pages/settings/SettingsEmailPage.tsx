import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Mail } from "lucide-react";
import { toast } from "sonner";

export default function SettingsEmailPage() {
  const navigate = useNavigate();
  
  // 1: 현재 비밀번호 확인, 2: 새 이메일 입력 및 인증
  const [step, setStep] = useState<1 | 2>(1);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🚨 TODO: [API 연동] 유저 계정 타입 확인 (GET /api/users/me)
  // 카카오 계정은 이메일 수정을 막기 위해 provider 정보를 가져옵니다.
  const [provider, setProvider] = useState<"LOCAL" | "KAKAO">("LOCAL");
  const [currentEmail, setCurrentEmail] = useState("");

  useEffect(() => {
    // 시연용 Mock Data 세팅
    setTimeout(() => {
      setProvider("LOCAL"); // KAKAO로 바꾸면 카카오 전용 안내 화면이 나옵니다.
      setCurrentEmail("yebin@example.com");
      setIsLoading(false);
    }, 200);
  }, []);

  // 이메일 정규식 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // [API] 1단계: 현재 비밀번호 검증
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 🚨 TODO: [API 연동] 현재 비밀번호 확인 호출 (POST /api/users/me/verify-password)
    /*
    try {
      await api.post('/api/users/me/verify-password', { password: currentPassword });
      setStep(2); // 성공 시 다음 단계로 이동
    } catch (error) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    }
    */
    setStep(2); // 임시 성공 처리
  };

  // [API] 2단계-A: 새 이메일 인증코드 발송 (형식 및 중복 검사 포함)
  const handleSendCode = async () => {
    setErrorMessage("");
    
    // 이메일 형식 검사
    if (!validateEmail(newEmail)) {
      setErrorMessage("올바른 이메일 형식으로 입력해 주세요.");
      return;
    }

    if (newEmail === currentEmail) {
      setErrorMessage("현재 사용 중인 이메일과 동일합니다.");
      return;
    }

    // 🚨 TODO: [API 연동] 새 이메일 인증코드 발송 (POST /api/auth/email/send-code)
    // 백엔드에서 중복 이메일인지 체크하고, 중복이면 에러를 내려주어야 합니다.
    /*
    try {
      await api.post('/api/auth/email/send-code', { email: newEmail, purpose: 'EMAIL_UPDATE' });
      setIsCodeSent(true);
      toast.success("인증코드가 발송되었습니다.");
    } catch (error) {
      // 409 Conflict 등의 상태 코드에 따라 분기
      if (error.response?.status === 409) {
        setErrorMessage("이미 가입된 이메일 주소입니다.");
      } else {
        setErrorMessage("인증코드 발송에 실패했습니다. 다시 시도해 주세요.");
      }
    }
    */
    setIsCodeSent(true); // 임시 성공 처리
    toast.success("인증코드가 발송되었습니다.");
  };

  // [API] 2단계-B: 최종 이메일 변경 제출
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 🚨 TODO: [API 연동] 이메일 수정 완료 호출 (PATCH /api/users/me/email)
    /*
    try {
      await api.patch('/api/users/me/email', { 
        email: newEmail, 
        code: verificationCode 
      });
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage("인증코드가 올바르지 않거나 만료되었습니다.");
    }
    */
    setShowSuccess(true); // 임시 성공 처리
  };

  // 세션 만료 및 재로그인 유도
  const handleSuccessClose = () => {
    setShowSuccess(false);
    // 🚨 TODO: 로그아웃 처리 로직 추가 (localStorage 삭제 등)
    navigate("/auth/login", { replace: true });
  };

  if (isLoading) return null;

  // 🔹 명세서 반영: 카카오 계정 사용자 차단 화면
  if (provider === "KAKAO") {
    return (
      <div className="h-full flex flex-col bg-background pb-[65px] page-enter">
        <div className="px-5 py-4 bg-background sticky top-0 z-10 flex items-center justify-between border-b border-border/50 shrink-0">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground hover:bg-input-background rounded-full transition-colors">
            <ChevronLeft size={28} strokeWidth={2} />
          </button>
          <h1 className="text-[18px] font-bold text-foreground">이메일 수정</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
          <div className="w-[64px] h-[64px] bg-[#FEE500] rounded-full flex items-center justify-center shadow-sm mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#191F28">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.636 1.627 4.952 4.07 6.306L5.2 20.1a.5.5 0 0 0 .72.55l4.43-2.96A11.5 11.5 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
            </svg>
          </div>
          <p className="text-[18px] font-bold text-foreground mb-2">카카오 계정입니다</p>
          <p className="text-[14px] text-muted-foreground text-center mb-8 leading-[1.5]">
            카카오 연동 계정의 이메일은<br />앱 내에서 임의로 수정할 수 없어요.
          </p>
          <div className="w-full max-w-[280px]">
            <p className="text-[12px] font-semibold text-muted-foreground mb-1.5 ml-1">현재 연결된 이메일</p>
            <div className="lp-input bg-border/50 text-muted-foreground text-center font-medium opacity-70">
              {currentEmail}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 일반 계정 사용자 이메일 수정 화면
  return (
    <div className="h-full flex flex-col bg-background pb-[65px] page-enter">
      
      {/* 상단 헤더 */}
      <div className="px-5 py-4 bg-background sticky top-0 z-10 flex items-center justify-between border-b border-border/50 shrink-0">
        <button
          onClick={() => {
            if (step === 2) setStep(1);
            else navigate(-1);
          }}
          className="p-2 -ml-2 text-foreground hover:bg-input-background rounded-full transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <h1 className="text-[18px] font-bold text-foreground">이메일 수정</h1>
        <div className="w-10" />
      </div>

      {/* 본문 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        
        {step === 1 ? (
          /* 1단계: 현재 비밀번호 확인 */
          <form onSubmit={handleVerifyPassword} className="flex flex-col">
            <h2 className="text-[20px] font-bold text-foreground mb-2 tracking-tight">본인 확인</h2>
            <p className="text-[14px] text-muted-foreground mb-8">
              안전한 정보 변경을 위해<br />현재 비밀번호를 입력해 주세요.
            </p>

            <div className="mb-2">
              <label className="text-[13px] font-semibold text-foreground block mb-2">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="비밀번호 입력"
                className={`lp-input ${errorMessage ? '!border-destructive focus:!border-destructive' : ''}`}
                required
              />
            </div>

            {/* 에러 메시지 */}
            {errorMessage && (
              <p className="text-[12px] text-destructive mt-1 px-1 font-medium">{errorMessage}</p>
            )}

            {/* 💡 명세서 반영: 비밀번호가 기억나지 않아요 링크 */}
            <div className="flex justify-end mt-3 mb-8">
              <button 
                type="button"
                onClick={() => navigate('/auth/password-reset')}
                className="text-[13px] text-primary font-semibold hover:underline underline-offset-2"
              >
                비밀번호가 기억나지 않나요?
              </button>
            </div>

            <button
              type="submit"
              disabled={!currentPassword}
              className="btn-primary"
            >
              다음
            </button>
          </form>
        ) : (
          /* 2단계: 새 이메일 및 인증코드 입력 */
          <form onSubmit={handleEmailSubmit} className="flex flex-col animate-fade-in">
            <h2 className="text-[20px] font-bold text-foreground mb-2 tracking-tight">새 이메일 입력</h2>
            <p className="text-[14px] text-muted-foreground mb-8">
              새롭게 사용하실 이메일을 입력해 주세요.
            </p>

            <div className="mb-6">
              <label className="text-[13px] font-semibold text-foreground block mb-2">
                새 이메일 주소
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="example@email.com"
                  className={`lp-input flex-1 ${errorMessage && !isCodeSent ? '!border-destructive focus:!border-destructive' : ''}`}
                  disabled={isCodeSent}
                  required
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={!newEmail}
                  className="h-[52px] px-5 bg-secondary text-foreground font-semibold rounded-[12px] hover:bg-border transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCodeSent ? "재발송" : "인증 요청"}
                </button>
              </div>
              {/* 이메일 관련 에러 (형식, 중복) */}
              {errorMessage && !isCodeSent && (
                <p className="text-[12px] text-destructive mt-2 px-1 font-medium">{errorMessage}</p>
              )}
            </div>

            {isCodeSent && (
              <div className="mb-8 animate-fade-in">
                <label className="text-[13px] font-semibold text-foreground block mb-2">
                  인증코드
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="인증코드를 입력해 주세요"
                  className={`lp-input tracking-widest ${errorMessage && isCodeSent ? '!border-destructive focus:!border-destructive' : ''}`}
                  required
                />
                {/* 인증코드 관련 에러 */}
                {errorMessage && isCodeSent && (
                  <p className="text-[12px] text-destructive mt-2 px-1 font-medium">{errorMessage}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!newEmail || !verificationCode}
              className="btn-primary mt-4"
            >
              이메일 변경 완료
            </button>
          </form>
        )}
      </div>

      {/* 🔹 성공 팝업 모달 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-card rounded-[24px] p-8 max-w-[320px] w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Check size={32} className="text-primary" strokeWidth={2.5} />
            </div>
            <h3 className="text-[20px] font-bold text-foreground mb-2">변경 완료</h3>
            <p className="text-muted-foreground text-[14px] mb-8 leading-relaxed">
              이메일이 성공적으로 변경되었습니다.<br />안전한 세션 관리를 위해 로그아웃되오니<br />다시 로그인해 주세요.
            </p>
            <button
              onClick={handleSuccessClose}
              className="btn-primary"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}