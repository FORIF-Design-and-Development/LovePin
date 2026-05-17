import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";

export default function PasswordResetPage() {
  const navigate = useNavigate();
  
  // 1단계: 이메일 인증, 2단계: 새 비밀번호 설정
  const [step, setStep] = useState<1 | 2>(1);
  
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  // 에러 메시지 상태 관리
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 이메일 정규식 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 정규식 검사 (8자 이상, 영문, 숫자, 특수문자 포함)
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/|\\]).{8,}$/;
    return passwordRegex.test(password);
  };

  // 1단계-A: 인증코드 발송 (이메일 형식 검사 추가)
  const handleSendCode = async () => {
    if (!formData.email) {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setEmailError("올바른 이메일 형식으로 입력해 주세요.");
      return;
    }

    // 통과 시 에러 초기화 및 API 호출
    setEmailError("");
    
    // 🚨 TODO: [API 연동] 이메일 인증코드 발송 호출 (POST /api/auth/email/send-code)
    setIsCodeSent(true);
    toast.success("입력하신 이메일로 인증코드가 발송되었습니다.");
  };

  // 1단계-B: 인증코드 확인 및 2단계 이동
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) {
      toast.error("인증코드를 입력해 주세요.");
      return;
    }

    // 🚨 TODO: [API 연동] 인증코드 검증 호출 (POST /api/auth/email/verify-code)
    toast.success("이메일 인증이 완료되었습니다.");
    setStep(2);
  };

  // 2단계: 새 비밀번호 설정 및 조건 검사
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    // 1. 비밀번호 조건 검사
    if (!validatePassword(formData.newPassword)) {
      setPasswordError("영문, 숫자, 특수문자를 포함하여 8자 이상 입력해 주세요.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // 2. 비밀번호 일치 검사
    if (!formData.newPasswordConfirm || formData.newPassword !== formData.newPasswordConfirm) {
      setConfirmError("비밀번호가 일치하지 않습니다. 다시 확인해 주세요.");
      isValid = false;
    } else {
      setConfirmError("");
    }

    // 조건 하나라도 불만족 시 제출 중단 (버튼은 눌리지만 폼이 넘어가지 않음)
    if (!isValid) {
      toast.error("입력하신 비밀번호 조건을 다시 확인해 주세요.");
      return;
    }

    // 🚨 TODO: [API 연동] 비밀번호 재설정 완료 호출 (PATCH /api/auth/password/reset)
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/auth/login");
  };

  return (
    <div className="h-full bg-white px-6 flex flex-col page-enter">
      {/* 상단 뒤로가기 헤더 */}
      <div className="flex items-center py-4 shrink-0">
        <button
          onClick={() => {
            if (step === 2) {
              setStep(1);
            } else {
              navigate(-1);
            }
          }}
          className="p-2 -ml-2 text-foreground hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
      </div>

      {/* 본문 영역 */}
      <div className="flex-1 overflow-y-auto pt-2 pb-8">
        <h1 className="text-[26px] font-bold text-foreground mb-2 tracking-[-0.5px]">비밀번호 재설정</h1>
        <p className="text-[14px] text-muted-foreground mb-10">
          {step === 1 
            ? "가입하신 일반 계정 이메일을 입력해 주세요" 
            : "새롭게 사용할 비밀번호를 설정해 주세요"}
        </p>

        {step === 1 ? (
          /* 1단계: 이메일 인증 폼 */
          <form onSubmit={handleVerifyCode} className="flex flex-col">
            <div className="mb-6">
              <label className="text-[13px] font-semibold text-foreground block mb-1.5">
                이메일
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (emailError) setEmailError(""); // 타이핑 시 에러 문구 해제
                  }}
                  placeholder="example@email.com"
                  className={`lp-input flex-1 ${emailError ? "!border-destructive focus:!border-destructive" : ""}`}
                  disabled={isCodeSent}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="h-[52px] px-5 bg-secondary text-foreground font-semibold rounded-[12px] hover:bg-border transition-colors whitespace-nowrap"
                >
                  {isCodeSent ? "재발송" : "인증 요청"}
                </button>
              </div>
              {/* 이메일 에러 메시지 노출 */}
              {emailError && (
                <p className="text-[13px] text-destructive mt-1.5 px-1 font-medium">{emailError}</p>
              )}
            </div>

            {isCodeSent && (
              <div className="mb-8 animate-fade-in">
                <label className="text-[13px] font-semibold text-foreground block mb-1.5">
                  인증코드
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="인증코드를 입력해 주세요"
                  className="lp-input tracking-widest"
                />
              </div>
            )}

            <button type="submit" className="btn-primary mt-2">
              다음
            </button>
          </form>
        ) : (
          /* 2단계: 새 비밀번호 설정 폼 */
          <form onSubmit={handleResetSubmit} className="flex flex-col animate-fade-in">
            <div className="mb-6">
              <label className="text-[13px] font-semibold text-foreground block mb-1.5">
                새 비밀번호
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => {
                  setFormData({ ...formData, newPassword: e.target.value });
                  if (passwordError) setPasswordError("");
                }}
                placeholder="8자 이상 (영문, 숫자, 특수문자 포함)"
                className={`lp-input ${passwordError ? "!border-destructive focus:!border-destructive" : ""}`}
              />
              {/* 비밀번호 조건 에러 메시지 노출 */}
              {passwordError && (
                <p className="text-[13px] text-destructive mt-1.5 px-1 font-medium leading-snug">{passwordError}</p>
              )}
            </div>

            <div className="mb-8">
              <label className="text-[13px] font-semibold text-foreground block mb-1.5">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={formData.newPasswordConfirm}
                onChange={(e) => {
                  setFormData({ ...formData, newPasswordConfirm: e.target.value });
                  if (confirmError) setConfirmError("");
                }}
                placeholder="새 비밀번호를 다시 입력해 주세요"
                className={`lp-input ${confirmError ? "!border-destructive focus:!border-destructive" : ""}`}
              />
              {/* 비밀번호 불일치 에러 메시지 노출 */}
              {confirmError && (
                <p className="text-[13px] text-destructive mt-1.5 px-1 font-medium">{confirmError}</p>
              )}
            </div>

            <button type="submit" className="btn-primary mt-2">
              비밀번호 재설정 완료
            </button>
          </form>
        )}
      </div>

      {/* 완료 팝업 모달 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white rounded-[24px] p-8 max-w-[320px] w-full text-center shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Check size={32} className="text-primary" strokeWidth={2.5} />
            </div>
            <h3 className="text-[20px] font-bold text-foreground mb-2">재설정 완료</h3>
            <p className="text-muted-foreground text-[14px] mb-8 leading-relaxed">
              비밀번호가 성공적으로 변경되었습니다.<br />
              보안을 위해 기존 세션이 만료되오니<br />다시 로그인해 주세요.
            </p>
            <button onClick={handleSuccessClose} className="btn-primary">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}