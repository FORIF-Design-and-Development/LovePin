import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", passwordConfirm: "", nickname: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 에러 체크 로직 (프론트 단 검증)
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.includes("@")) e.email = "올바른 이메일 형식을 입력해주세요.";
    if (form.password.length < 8) e.password = "비밀번호는 8자 이상이어야 해요.";
    if (form.password !== form.passwordConfirm) e.passwordConfirm = "비밀번호가 일치하지 않아요.";
    if (!form.nickname) e.nickname = "닉네임을 입력해주세요.";
    return e;
  };

  const isValid = form.email && form.password && form.passwordConfirm && form.nickname && agreed;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      return; 
    }
    // 🚨 TODO: [API 연동] 일반 회원가입 호출 (POST /api/auth/register)
    toast.success("회원가입이 완료되었어요!");
    navigate("/auth/login");
  };

  const handleKakaoRegister = () => {
    // 🚨 TODO: [API 연동] 카카오 회원가입 호출 (OAuth 연동)
    // 보통 백엔드에서 제공하는 카카오 인가 코드 요청 URL로 window.location.href 이동
    toast.info("카카오 로그인 창으로 이동합니다.");
  };

  return (
    <div className="h-full bg-white px-6 flex flex-col page-enter">
      
      {/* 🔹 상단 뒤로가기 헤더 */}
      <div className="flex items-center py-4 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-foreground hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
      </div>

      {/* 🔹 스크롤 폼 영역 */}
      <div className="flex-1 overflow-y-auto pt-2 pb-8">
        <h1 className="text-[26px] font-bold text-foreground mb-2 tracking-[-0.5px]">회원가입</h1>
        <p className="text-[14px] text-muted-foreground mb-8">LovePin에 오신 것을 환영해요</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-8">
          {/* 이메일 */}
          <div>
            <label className="text-[13px] font-semibold text-foreground block mb-1.5">이메일</label>
            <input 
              className={`lp-input ${errors.email ? '!border-destructive focus:!border-destructive' : ''}`}
              type="email" 
              placeholder="이메일을 입력하세요" 
              value={form.email} 
              onChange={e => { setForm(prev => ({ ...prev, email: e.target.value })); setErrors(prev => ({ ...prev, email: "" })); }} 
            />
            {errors.email && <p className="text-[12px] text-destructive mt-1.5 ml-1 font-medium">{errors.email}</p>}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="text-[13px] font-semibold text-foreground block mb-1.5">비밀번호</label>
            <input 
              className={`lp-input ${errors.password ? '!border-destructive focus:!border-destructive' : ''}`}
              type="password" 
              placeholder="8자 이상 입력하세요" 
              value={form.password} 
              onChange={e => { setForm(prev => ({ ...prev, password: e.target.value })); setErrors(prev => ({ ...prev, password: "" })); }} 
            />
            {errors.password && <p className="text-[12px] text-destructive mt-1.5 ml-1 font-medium">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="text-[13px] font-semibold text-foreground block mb-1.5">비밀번호 확인</label>
            <input 
              className={`lp-input ${errors.passwordConfirm ? '!border-destructive focus:!border-destructive' : ''}`}
              type="password" 
              placeholder="비밀번호를 다시 입력하세요" 
              value={form.passwordConfirm} 
              onChange={e => { setForm(prev => ({ ...prev, passwordConfirm: e.target.value })); setErrors(prev => ({ ...prev, passwordConfirm: "" })); }} 
            />
            {errors.passwordConfirm && <p className="text-[12px] text-destructive mt-1.5 ml-1 font-medium">{errors.passwordConfirm}</p>}
          </div>

          {/* 닉네임 */}
          <div>
            <label className="text-[13px] font-semibold text-foreground block mb-1.5">닉네임</label>
            <input 
              className={`lp-input ${errors.nickname ? '!border-destructive focus:!border-destructive' : ''}`}
              type="text" 
              placeholder="닉네임을 입력하세요" 
              value={form.nickname} 
              onChange={e => { setForm(prev => ({ ...prev, nickname: e.target.value })); setErrors(prev => ({ ...prev, nickname: "" })); }} 
            />
            {errors.nickname && <p className="text-[12px] text-destructive mt-1.5 ml-1 font-medium">{errors.nickname}</p>}
          </div>
        </form>

        {/* 약관 동의 (회색 박스 래퍼 적용) */}
        <div className="flex items-start gap-2.5 mb-8 p-4 bg-secondary rounded-[12px]">
          <div 
            className={`w-[18px] h-[18px] mt-0.5 flex-shrink-0 rounded-[6px] border-[1.5px] flex items-center justify-center transition-colors cursor-pointer ${agreed ? "bg-primary border-primary" : "bg-white border-border"}`}
            onClick={() => setAgreed(!agreed)}
          >
            {agreed && <Check size={12} strokeWidth={3} className="text-white" />}
          </div>
          <label className="text-[14px] text-foreground leading-[1.5] cursor-pointer" onClick={() => setAgreed(!agreed)}>
            <span className="text-primary font-semibold mr-1">[필수]</span>
            이용약관 및 개인정보처리방침에 동의합니다
          </label>
        </div>

        {/* 일반 회원가입 버튼 */}
        <button 
          className="btn-primary mb-6" 
          onClick={() => handleSubmit()} 
          disabled={!isValid}
        >
          회원가입 완료
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-[1px] bg-border" />
          <span className="text-[13px] text-muted-foreground font-medium">또는</span>
          <div className="flex-1 h-[1px] bg-border" />
        </div>

        {/* 카카오 간편 회원가입 버튼 */}
        <button 
          type="button"
          onClick={handleKakaoRegister}
          className="w-full bg-[#FEE500] text-[#191F28] rounded-[14px] font-semibold text-[16px] p-[16px] border-none flex items-center justify-center gap-2 hover:bg-[#FDD835] transition-colors shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#191F28">
            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.636 1.627 4.952 4.07 6.306L5.2 20.1a.5.5 0 0 0 .72.55l4.43-2.96A11.5 11.5 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
          </svg>
          카카오로 간편 회원가입
        </button>

      </div>
    </div>
  );
}