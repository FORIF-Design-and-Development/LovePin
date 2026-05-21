/**
 * LovePin Auth Pages
 * Design: Emotional Minimalism — clean login/register screens
 * Screens: Landing → Login / Register → Login
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from '@/contexts/AppContext';

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

      {/* Title */}
      <h1 style={{
        fontSize: 36,
        fontWeight: 700,
        color: '#e9334f',
        letterSpacing: '-1.5px',
        marginBottom: 8,
        fontFamily: 'GmarketSans, var(--font-logo)',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
      }}>
        LovePin
      </h1>

      {/* Description */}
      <p style={{
        fontSize: 14,
        color: '#8B95A1',
        textAlign: 'center',
        lineHeight: 1.3,
        marginBottom: 48,
      }}>
        우리가 함께한 모든 순간을<br />지도 위에 기록해요
      </p>

      {/* CTA Button */}
      <button
        onClick={onRegister}
        style={{
          width: '100%',
          maxWidth: 300,
          background: 'linear-gradient(135deg, #f45d75 0%, #e9334f 100%)',
          color: 'white',
          borderRadius: 14,
          fontWeight: 700,
          fontSize: 15,
          padding: 14,
          border: 'none',
          transition: 'all 0.15s',
          marginBottom: 14,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        회원가입
      </button>

      {/* Login Link */}
      <p style={{ fontSize: 13, color: '#191F28', textAlign: 'center' }}>
        이미 계정이 있나요?{' '}
        <button
          onClick={onLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#e9334f',
            fontWeight: 700,
            fontSize: 13,
            padding: 0,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          로그인
        </button>
      </p>
    </div>
  );
}

function LoginScreen({ onBack, onRegister, onForgot, onLogin }: { onBack: () => void; onRegister: () => void; onForgot: () => void; onLogin: (email: string, pw: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    const ok = true; // demo: always succeed
    if (ok) { onLogin(email, password); }
    else { setError('이메일 또는 비밀번호가 올바르지 않아요.'); }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'white', padding: '0 24px' }} className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0 8px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <div style={{ paddingTop: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', marginBottom: 8, letterSpacing: '-0.5px' }}>로그인</h1>
        <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 36 }}>이메일과 비밀번호를 입력해주세요</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>이메일</label>
            <input
              className="lp-input"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>비밀번호</label>
            <input
              className="lp-input"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        {error && <p style={{ fontSize: 13, color: '#f76e7e', marginBottom: 12 }}>{error}</p>}

        <button onClick={onForgot} style={{ background: 'none', border: 'none', color: '#8B95A1', fontSize: 13, marginBottom: 24, padding: 0 }}>
          비밀번호를 잊으셨나요?
        </button>

        <button className="btn-primary" onClick={handleLogin} style={{ marginBottom: 16 }}>로그인</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#E5E8EB' }} />
          <span style={{ fontSize: 13, color: '#C5CDD6' }}>또는</span>
          <div style={{ flex: 1, height: 1, background: '#E5E8EB' }} />
        </div>

        <button
          style={{ background: '#FEE500', color: '#191F28', borderRadius: 14, fontWeight: 600, fontSize: 16, padding: 16, width: '100%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}
          onClick={handleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#191F28"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.636 1.627 4.952 4.07 6.306L5.2 20.1a.5.5 0 0 0 .72.55l4.43-2.96A11.5 11.5 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/></svg>
          카카오 간편 로그인
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#8B95A1' }}>
          아직 계정이 없으신가요?{' '}
          <button onClick={onRegister} style={{ background: 'none', border: 'none', color: '#f76e7e', fontWeight: 600, fontSize: 14, padding: 0 }}>회원가입</button>
        </p>
      </div>
    </div>
  );
}

function RegisterScreen({ onBack, onComplete, onKakao }: { onBack: () => void; onComplete: () => void; onKakao: () => void }) {
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', nickname: '' });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.includes('@')) e.email = '올바른 이메일 형식을 입력해주세요.';
    if (form.password.length < 8) e.password = '비밀번호는 8자 이상이어야 해요.';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = '비밀번호가 일치하지 않아요.';
    if (!form.nickname) e.nickname = '닉네임을 입력해주세요.';
    return e;
  };

  const isValid = form.email && form.password && form.passwordConfirm && form.nickname && agreed && Object.keys(validate()).length === 0;

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onComplete();
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'white', padding: '0 24px 40px' }} className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0 8px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', marginBottom: 8, letterSpacing: '-0.5px' }}>회원가입</h1>
      <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>LovePin에 오신 것을 환영해요</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        {[
          { key: 'email', label: '이메일', type: 'email', placeholder: '이메일을 입력하세요' },
          { key: 'password', label: '비밀번호', type: 'password', placeholder: '8자 이상 입력하세요' },
          { key: 'passwordConfirm', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호를 다시 입력하세요' },
          { key: 'nickname', label: '닉네임', type: 'text', placeholder: '닉네임을 입력하세요' },
        ].map(field => (
          <div key={field.key}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>{field.label}</label>
            <input
              className="lp-input"
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form]}
              onChange={e => { setForm(prev => ({ ...prev, [field.key]: e.target.value })); setErrors(prev => ({ ...prev, [field.key]: '' })); }}
            />
            {errors[field.key] && <p style={{ fontSize: 12, color: '#f76e7e', marginTop: 4 }}>{errors[field.key]}</p>}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24, padding: '16px', background: '#F4F6F8', borderRadius: 12 }}>
        <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: '#f76e7e', width: 16, height: 16 }} />
        <label htmlFor="agree" style={{ fontSize: 14, color: '#191F28', lineHeight: 1.5 }}>
          <span style={{ color: '#f76e7e', fontWeight: 600 }}>[필수]</span> 이용약관 및 개인정보처리방침에 동의합니다
        </label>
      </div>

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!isValid}
        style={{ background: isValid ? '#f76e7e' : '#E5E8EB', color: isValid ? 'white' : '#8B95A1', marginBottom: 16 }}
      >
        회원가입
      </button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: '#E5E8EB' }} />
        <span style={{ fontSize: 13, color: '#C5CDD6' }}>또는</span>
        <div style={{ flex: 1, height: 1, background: '#E5E8EB' }} />
      </div>

      {/* Kakao Signup Button */}
      <button
        onClick={onKakao}
        style={{
          background: '#FEE500',
          color: '#191F28',
          borderRadius: 14,
          fontWeight: 600,
          fontSize: 16,
          padding: 16,
          width: '100%',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
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
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8 }}>
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

      <button className="btn-primary" onClick={onComplete} disabled={!agreed || !nickname} style={{ background: agreed && nickname ? '#f76e7e' : '#E5E8EB', color: agreed && nickname ? 'white' : '#8B95A1' }}>
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
      <button className="btn-primary" onClick={onConfirm}>로그인하러 가기</button>
    </div>
  );
}

function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div style={{ minHeight: '100dvh', background: 'white', padding: '0 24px' }} className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0 8px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 8, marginLeft: -8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', marginBottom: 8, letterSpacing: '-0.5px', marginTop: 24 }}>비밀번호 찾기</h1>
      <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>가입한 이메일로 재설정 링크를 보내드려요</p>

      {!sent ? (
        <>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>이메일</label>
            <input className="lp-input" type="email" placeholder="이메일을 입력하세요" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => setSent(true)} disabled={!email.includes('@')} style={{ background: email.includes('@') ? '#f76e7e' : '#E5E8EB', color: email.includes('@') ? 'white' : '#8B95A1' }}>
            재설정 링크 보내기
          </button>
        </>
      ) : (
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <div style={{ width: 64, height: 64, background: '#FFF0F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f76e7e" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#191F28', marginBottom: 8 }}>이메일을 확인해주세요</p>
          <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 40 }}>{email}로 재설정 링크를 보냈어요</p>
          <button className="btn-primary" onClick={onBack}>로그인으로 돌아가기</button>
        </div>
      )}
    </div>
  );
}
