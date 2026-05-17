import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 에러 메시지 상태 (API 연동 시 활용)
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // 에러 초기화

    // 🚨 TODO: [API 연동] 일반 로그인 호출 (POST /api/auth/login)
    /*
    try {
      const response = await api.post('/api/auth/login', { email, password });
      // 1. localStorage에 accessToken 저장
      // 2. 성공 시 타임라인으로 이동
      navigate("/app/timeline");
    } catch (error) {
      // 3. 실패 시 에러 메시지 세팅
      setErrorMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
    */
    
    // (임시) 바로 타임라인으로 이동
    navigate("/app/timeline");
  };

  const handleKakaoLogin = () => {
    // 🚨 TODO: [API 연동] 카카오 OAuth 로그인 호출 (POST /api/auth/kakao)
    /*
      보통 백엔드에서 제공하는 카카오 로그인 URL로 window.location.href 이동 처리를 하거나,
      프론트에서 카카오 SDK로 토큰을 받아 백엔드에 넘겨주는 방식을 사용합니다.
    */
    
    // (임시) 바로 타임라인으로 이동
    navigate("/app/timeline");
  };

  return (
    <div className="h-full bg-white px-6 flex flex-col page-enter">
      {/* 상단 뒤로가기 헤더 */}
      <div className="flex items-center py-4 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-foreground hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pt-2 pb-8">
        <h1 className="text-[26px] font-bold text-foreground mb-2 tracking-[-0.5px]">로그인</h1>
        <p className="text-[14px] text-muted-foreground mb-10">이메일과 비밀번호를 입력해주세요</p>

        <form onSubmit={handleLogin} className="flex flex-col mb-2">
          {/* 이메일 입력 */}
          <div className="mb-5">
            <label className="text-[13px] font-semibold text-foreground block mb-1.5">이메일</label>
            <input
              className={`lp-input ${errorMessage ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : ''}`}
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              required
            />
          </div>
          
          {/* 비밀번호 입력 */}
          <div className="mb-2">
            <label className="text-[13px] font-semibold text-foreground block mb-1.5">비밀번호</label>
            <input
              className={`lp-input ${errorMessage ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : ''}`}
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              required
            />
          </div>

          {/* API 연동 시 에러가 있으면 표시될 문구 */}
          {errorMessage && (
            <p className="text-[13px] text-destructive mt-1.5 px-1 font-medium">{errorMessage}</p>
          )}

          {/* 비밀번호 찾기 링크 */}
          <div className="flex justify-end mt-2 mb-8">
            <button 
              type="button"
              onClick={() => navigate("/auth/password-reset")} 
              className="text-[13px] text-muted-foreground font-medium hover:text-foreground transition-colors"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {/* 일반 로그인 버튼 */}
          <button type="submit" className="btn-primary mb-6">
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-[1px] bg-border" />
          <span className="text-[13px] text-muted-foreground font-medium">또는</span>
          <div className="flex-1 h-[1px] bg-border" />
        </div>

        {/* 카카오 간편 로그인 버튼 */}
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="w-full bg-[#FEE500] text-[#191F28] rounded-[14px] font-semibold text-[16px] p-[16px] border-none flex items-center justify-center gap-2 hover:bg-[#FDD835] transition-colors shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#191F28">
            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.636 1.627 4.952 4.07 6.306L5.2 20.1a.5.5 0 0 0 .72.55l4.43-2.96A11.5 11.5 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
          </svg>
          카카오 간편 로그인
        </button>

        {/* 회원가입 이동 링크 */}
        <p className="text-center text-[14px] text-muted-foreground mt-8">
          아직 계정이 없으신가요?{' '}
          <button 
            type="button" 
            onClick={() => navigate("/auth/register")} 
            className="text-primary font-bold ml-1 hover:opacity-80 transition-opacity"
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}