/**
 * LovePin Auth Pages (API Integrated Structure)
 * Design: Emotional Minimalism — clean login/register screens
 * Screens: Landing → Login / Register → Login
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from '@/contexts/AppContext';

// 로고 이미지는 기존 경로 유지
import LogoImage from '../../assets/LovePin____png__-1.png';

type AuthScreen = 'landing' | 'login' | 'register' | 'kakao-register' | 'register-complete' | 'forgot-password';

export default function AuthPage() {
  const [screen, setScreen] = useState<AuthScreen>('landing');
  const { login, isLoggedIn } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/app/timeline', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (screen === 'landing') return <LandingScreen onLogin={() => setScreen('login')} onRegister={() => setScreen('register')} />;
  if (screen === 'login') return <LoginScreen onBack={() => setScreen('landing')} onRegister={() => setScreen('register')} onForgot={() => setScreen('forgot-password')} onLogin={(email, pw) => { if (login(email, pw)) navigate('/app/timeline'); }} />;
  if (screen === 'register') return <RegisterScreen onBack={() => setScreen('landing')} onComplete={() => setScreen('register-complete')} onKakao={() => setScreen('kakao-register')} />;
  if (screen === 'kakao-register') return <KakaoRegisterScreen onBack={() => setScreen('landing')} onComplete={() => setScreen('register-complete')} />;
  if (screen === 'register-complete') return <RegisterCompleteScreen onConfirm={() => setScreen('login')} />;
  if (screen === 'forgot-password') return <ForgotPasswordScreen onBack={() => setScreen('login')} />;
  return null;
}

function LandingScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <div
          style={{
            width: 180,
            height: 180,
            background: 'linear-gradient(135deg, #f45d75 0%, #e9334f 100%)',
            maskImage: `url(${LogoImage})`,
            WebkitMaskImage: `url(${LogoImage})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))',
          }}
        />
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 700, color: '#e9334f', letterSpacing: '-1.5px', marginBottom: 8, fontFamily: 'GmarketSans, var(--font-logo)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.08)' }}>
        LovePin
      </h1>

      <p style={{ fontSize: 14, color: '#8B95A1', textAlign: 'center', lineHeight: 1.3, marginBottom: 48 }}>
        우리가 함께한 모든 순간을<br />지도 위에 기록해요
      </p>

      <button
        onClick={onRegister}
        style={{ width: '100%', maxWidth: 300, background: 'linear-gradient(135deg, #f45d75 0%, #e9334f 100%)', color: 'white', borderRadius: 14, fontWeight: 700, fontSize: 15, padding: 14, border: 'none', marginBottom: 14, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', cursor: 'pointer' }}
      >
        회원가입
      </button>

      <p style={{ fontSize: 13, color: '#191F28', textAlign: 'center' }}>
        이미 계정이 있나요?{' '}
        <button onClick={onLogin} style={{ background: 'none', border: 'none', color: '#e9334f', fontWeight: 700, fontSize: 13, padding: 0, textDecoration: 'underline', cursor: 'pointer' }}>
          로그인
        </button>
      </p>
    </div>
  );
}

function LoginScreen({ onBack, onRegister, onForgot, onLogin }: { onBack: () => void; onRegister: () => void; onForgot: () => void; onLogin: (email: string, pw: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(true); // API 스펙 반영 (refresh_token 발급용)
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    // TODO: 실제 API (POST /api/auth/login) 연동 시 autoLogin 값 전송 필요
    const ok = true; 
    if (ok) { onLogin(email, password); }
    else { setError('이메일 또는 비밀번호가 올바르지 않아요.'); }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'white', padding: '0 24px' }} className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0 8px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8, cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <div style={{ paddingTop: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', marginBottom: 8, letterSpacing: '-0.5px' }}>로그인</h1>
        <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 36 }}>이메일과 비밀번호를 입력해주세요</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>이메일</label>
            <input className="lp-input" type="email" placeholder="이메일을 입력하세요" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>비밀번호</label>
            <input className="lp-input" type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
        </div>

        {error && <p style={{ fontSize: 13, color: '#f76e7e', marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)} style={{ accentColor: '#f76e7e' }} />
            <span style={{ fontSize: 13, color: '#8B95A1' }}>자동 로그인</span>
          </label>
          <button onClick={onForgot} style={{ background: 'none', border: 'none', color: '#8B95A1', fontSize: 13, padding: 0, cursor: 'pointer' }}>
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <button 
          style={{ width: '100%', background: '#f76e7e', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}
          onClick={handleLogin}
        >
          로그인
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#E5E8EB' }} />
          <span style={{ fontSize: 13, color: '#C5CDD6' }}>또는</span>
          <div style={{ flex: 1, height: 1, background: '#E5E8EB' }} />
        </div>

        <button
          style={{ background: '#FEE500', color: '#191F28', borderRadius: 14, fontWeight: 600, fontSize: 16, padding: 16, width: '100%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32, cursor: 'pointer' }}
          onClick={handleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#191F28"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.636 1.627 4.952 4.07 6.306L5.2 20.1a.5.5 0 0 0 .72.55l4.43-2.96A11.5 11.5 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/></svg>
          카카오 간편 로그인
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#8B95A1' }}>
          아직 계정이 없으신가요?{' '}
          <button onClick={onRegister} style={{ background: 'none', border: 'none', color: '#f76e7e', fontWeight: 600, fontSize: 14, padding: 0, cursor: 'pointer' }}>회원가입</button>
        </p>
      </div>
    </div>
  );
}

function RegisterScreen({ onBack, onComplete, onKakao }: { onBack: () => void; onComplete: () => void; onKakao: () => void }) {
  // API 스펙 (이메일 인증 흐름) 반영
  const [form, setForm] = useState({ email: '', code: '', password: '', passwordConfirm: '', nickname: '' });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendCode = () => {
    if (!form.email.includes('@')) { setErrors({ email: '올바른 이메일 형식을 입력해주세요.' }); return; }
    // TODO: POST /api/auth/email/send-code 연동
    setIsCodeSent(true);
    setErrors({});
  };

  const handleVerifyCode = () => {
    if (form.code.length < 4) { setErrors({ code: '올바른 인증 코드를 입력해주세요.' }); return; }
    // TODO: POST /api/auth/email/verify-code 연동
    setIsEmailVerified(true);
    setErrors({});
  };

  const validateSubmit = () => {
    const e: Record<string, string> = {};
    if (!isEmailVerified) e.email = '이메일 인증이 필요합니다.';
    if (form.password.length < 8) e.password = '비밀번호는 8자 이상이어야 해요.';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = '비밀번호가 일치하지 않아요.';
    if (!form.nickname) e.nickname = '닉네임을 입력해주세요.';
    return e;
  };

  const isValid = isEmailVerified && form.password && form.passwordConfirm && form.nickname && agreed;

  const handleSubmit = () => {
    const e = validateSubmit();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    // TODO: POST /api/auth/register 연동
    onComplete();
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'white', padding: '0 24px 40px' }} className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0 8px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8, cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', marginBottom: 8, letterSpacing: '-0.5px' }}>회원가입</h1>
      <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>LovePin에 오신 것을 환영해요</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        {/* 이메일 및 인증 코드 영역 */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>이메일</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="lp-input" type="email" placeholder="이메일을 입력하세요" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} disabled={isEmailVerified} style={{ flex: 1 }} />
            {!isEmailVerified && (
              <button onClick={handleSendCode} style={{ padding: '0 16px', borderRadius: 12, border: '1px solid #E5E8EB', background: 'white', fontSize: 13, fontWeight: 600, color: '#4E5968', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {isCodeSent ? '재발송' : '인증요청'}
              </button>
            )}
          </div>
          {errors.email && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{errors.email}</p>}
        </div>

        {isCodeSent && !isEmailVerified && (
          <div className="page-enter">
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="lp-input" type="text" placeholder="인증 코드 6자리" value={form.code} onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))} style={{ flex: 1 }} />
              <button onClick={handleVerifyCode} style={{ padding: '0 16px', borderRadius: 12, border: 'none', background: '#f76e7e', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>확인</button>
            </div>
            {errors.code && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{errors.code}</p>}
          </div>
        )}

        {isEmailVerified && (
          <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>비밀번호 (8자 이상, 영문/숫자/특수문자 포함)</label>
              <input className="lp-input" type="password" placeholder="비밀번호를 입력하세요" value={form.password} onChange={e => { setForm(prev => ({ ...prev, password: e.target.value })); setErrors(prev => ({ ...prev, password: '' })); }} />
              {errors.password && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{errors.password}</p>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>비밀번호 확인</label>
              <input className="lp-input" type="password" placeholder="비밀번호를 다시 입력하세요" value={form.passwordConfirm} onChange={e => { setForm(prev => ({ ...prev, passwordConfirm: e.target.value })); setErrors(prev => ({ ...prev, passwordConfirm: '' })); }} />
              {errors.passwordConfirm && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{errors.passwordConfirm}</p>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>닉네임</label>
              <input className="lp-input" type="text" placeholder="닉네임을 입력하세요" value={form.nickname} onChange={e => { setForm(prev => ({ ...prev, nickname: e.target.value })); setErrors(prev => ({ ...prev, nickname: '' })); }} />
              {errors.nickname && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{errors.nickname}</p>}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24, padding: '16px', background: '#F4F6F8', borderRadius: 12 }}>
        <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: '#f76e7e', width: 16, height: 16 }} />
        <label htmlFor="agree" style={{ fontSize: 14, color: '#191F28', lineHeight: 1.5 }}>
          <span style={{ color: '#f76e7e', fontWeight: 600 }}>[필수]</span> 이용약관 및 개인정보처리방침에 동의합니다
        </label>
      </div>

      <button
        style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: isValid ? 'pointer' : 'default', background: isValid ? '#f76e7e' : '#E5E8EB', color: isValid ? 'white' : '#8B95A1', marginBottom: 16 }}
        onClick={handleSubmit}
        disabled={!isValid}
      >
        회원가입 완료
      </button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: '#E5E8EB' }} />
        <span style={{ fontSize: 13, color: '#C5CDD6' }}>또는</span>
        <div style={{ flex: 1, height: 1, background: '#E5E8EB' }} />
      </div>

      <button onClick={onKakao} style={{ background: '#FEE500', color: '#191F28', borderRadius: 14, fontWeight: 600, fontSize: 16, padding: 16, width: '100%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#191F28"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.636 1.627 4.952 4.07 6.306L5.2 20.1a.5.5 0 0 0 .72.55l4.43-2.96A11.5 11.5 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/></svg>
        카카오로 간편 회원가입
      </button>
    </div>
  );
}

function KakaoRegisterScreen({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [nickname, setNickname] = useState('예빈');
  const [agreed, setAgreed] = useState(false);

  return (
    <div style={{ minHeight: '100dvh', background: 'white', padding: '0 24px 40px' }} className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0 8px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8, cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <div style={{ padding: '24px 0', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: '#FEE500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#191F28"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.636 1.627 4.952 4.07 6.306L5.2 20.1a.5.5 0 0 0 .72.55l4.43-2.96A11.5 11.5 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/></svg>
        </div>
        <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>카카오 계정으로 연결되었어요</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>닉네임 확인/수정</label>
        <input className="lp-input" value={nickname} onChange={e => setNickname(e.target.value)} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 32, padding: '16px', background: '#F4F6F8', borderRadius: 12 }}>
        <input type="checkbox" id="agree2" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: '#f76e7e', width: 16, height: 16 }} />
        <label htmlFor="agree2" style={{ fontSize: 14, color: '#191F28', lineHeight: 1.5 }}>
          <span style={{ color: '#f76e7e', fontWeight: 600 }}>[필수]</span> 이용약관 및 개인정보처리방침에 동의합니다
        </label>
      </div>

      <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: agreed && nickname ? 'pointer' : 'default', background: agreed && nickname ? '#f76e7e' : '#E5E8EB', color: agreed && nickname ? 'white' : '#8B95A1' }} onClick={onComplete} disabled={!agreed || !nickname}>
        가입 완료
      </button>
    </div>
  );
}

function RegisterCompleteScreen({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }} className="page-enter">
      <div style={{ width: 80, height: 80, background: '#FFF0F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f76e7e" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#191F28', marginBottom: 8, letterSpacing: '-0.5px' }}>회원가입이 완료되었어요.</h2>
      <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 48, textAlign: 'center' }}>이제 연인과 함께 소중한 기록을 남겨보세요</p>
      <button style={{ width: '100%', background: '#f76e7e', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer' }} onClick={onConfirm}>로그인하러 가기</button>
    </div>
  );
}

function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  // API 스펙 (비밀번호 변경 흐름) 반영
  const [form, setForm] = useState({ email: '', code: '', newPassword: '', newPasswordConfirm: '' });
  const [step, setStep] = useState<'request' | 'verify' | 'reset' | 'done'>('request');
  const [error, setError] = useState('');

  const handleSendCode = () => {
    if (!form.email.includes('@')) { setError('올바른 이메일 형식을 입력해주세요.'); return; }
    // TODO: POST /api/auth/email/send-code (purpose: PASSWORD_RESET) 연동
    setError('');
    setStep('verify');
  };

  const handleVerifyCode = () => {
    if (form.code.length < 4) { setError('인증 코드를 확인해주세요.'); return; }
    // TODO: POST /api/auth/email/verify-code 연동
    setError('');
    setStep('reset');
  };

  const handleResetPassword = () => {
    if (form.newPassword.length < 8) { setError('비밀번호는 8자 이상이어야 해요.'); return; }
    if (form.newPassword !== form.newPasswordConfirm) { setError('비밀번호가 일치하지 않아요.'); return; }
    // TODO: PATCH /api/auth/password/reset 연동
    setError('');
    setStep('done');
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'white', padding: '0 24px' }} className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0 8px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8, cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>
      
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', marginBottom: 8, letterSpacing: '-0.5px', marginTop: 24 }}>비밀번호 찾기</h1>
      
      {step === 'request' && (
        <div className="page-enter">
          <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>가입한 이메일로 인증 코드를 보내드려요</p>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>이메일</label>
            <input className="lp-input" type="email" placeholder="이메일을 입력하세요" value={form.email} onChange={e => { setForm(prev => ({ ...prev, email: e.target.value })); setError(''); }} />
            {error && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{error}</p>}
          </div>
          <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: form.email.includes('@') ? 'pointer' : 'default', background: form.email.includes('@') ? '#f76e7e' : '#E5E8EB', color: form.email.includes('@') ? 'white' : '#8B95A1' }} onClick={handleSendCode} disabled={!form.email.includes('@')}>
            인증 코드 발송
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="page-enter">
          <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>이메일로 전송된 코드를 입력해주세요</p>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>인증 코드</label>
            <input className="lp-input" type="text" placeholder="인증 코드 6자리" value={form.code} onChange={e => { setForm(prev => ({ ...prev, code: e.target.value })); setError(''); }} />
            {error && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{error}</p>}
          </div>
          <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', background: '#f76e7e', color: 'white' }} onClick={handleVerifyCode}>
            코드 확인
          </button>
        </div>
      )}

      {step === 'reset' && (
        <div className="page-enter">
          <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>새로운 비밀번호를 설정해주세요</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>새 비밀번호</label>
              <input className="lp-input" type="password" placeholder="새 비밀번호 입력" value={form.newPassword} onChange={e => { setForm(prev => ({ ...prev, newPassword: e.target.value })); setError(''); }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>새 비밀번호 확인</label>
              <input className="lp-input" type="password" placeholder="비밀번호 다시 입력" value={form.newPasswordConfirm} onChange={e => { setForm(prev => ({ ...prev, newPasswordConfirm: e.target.value })); setError(''); }} />
              {error && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{error}</p>}
            </div>
          </div>
          <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', background: '#f76e7e', color: 'white' }} onClick={handleResetPassword}>
            비밀번호 변경
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="page-enter" style={{ textAlign: 'center', paddingTop: 20 }}>
          <div style={{ width: 64, height: 64, background: '#FFF0F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f76e7e" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#191F28', marginBottom: 8 }}>비밀번호가 변경되었습니다</p>
          <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 40 }}>새로운 비밀번호로 로그인해주세요</p>
          <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', background: '#f76e7e', color: 'white' }} onClick={onBack}>로그인으로 돌아가기</button>
        </div>
      )}
    </div>
  );
}