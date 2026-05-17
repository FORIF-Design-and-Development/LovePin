import { useNavigate } from "react-router-dom";

// 💡 로고 경로는 현재 프로젝트 위치에 맞게 수정해 주세요!
// 예: import LogoImage from "@/assets/images/lovepin-logo.png";
import LogoImage from "../../assets/LovePin____png__-1.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    // ✨ 핵심: h-[100dvh] (또는 h-screen)을 주어 모바일 래퍼 안에서 세로를 무조건 100% 꽉 채우게 만듭니다.
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-b from-[#f45d75] to-[#e9334f] px-6">
      
      {/* Logo */}
      <div className="mb-4">
        <img
          src={LogoImage}
          alt="LovePin Logo"
          className="w-[180px] h-[180px] object-contain drop-shadow-sm"
        />
      </div>

      {/* Title */}
      {/* 폰트 적용이 안되어 있다면 font-['GmarketSans'] 대신 일반 폰트를 쓰셔도 됩니다 */}
      <h1 className="text-[30px] font-bold text-white tracking-[-1.2px] mb-2">
        LovePin
      </h1>

      {/* Description */}
      <p className="text-[14px] text-white/95 text-center leading-[1.6] mb-12 font-medium">
        우리가 함께한 모든 순간을<br />지도 위에 기록해요
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/auth/register')}
        className="w-full max-w-[300px] bg-white text-[#EC5A6F] rounded-[14px] font-bold text-[15px] py-4 mb-4 hover:bg-white/90 transition-colors shadow-sm"
      >
        회원가입
      </button>

      {/* Login Link */}
      <p className="text-[13px] text-white text-center flex items-center gap-1.5 font-medium">
        이미 계정이 있나요?
        <button
          onClick={() => navigate('/auth/login')}
          className="font-bold underline underline-offset-2 hover:text-white/80 transition-colors"
        >
          로그인
        </button>
      </p>

    </div>
  );
}