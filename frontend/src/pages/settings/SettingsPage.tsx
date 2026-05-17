/**
 * LovePin Settings Page
 * Design: Emotional Minimalism — clean settings with profile management
 * Features: profile edit, email/password change, notifications, logout, delete account
 */
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type SettingsScreen = 'main' | 'edit-profile' | 'edit-email' | 'edit-password';

export default function SettingsPage() {
  const [screen, setScreen] = useState<SettingsScreen>('main');
  if (screen === 'edit-profile') return <EditProfileScreen onBack={() => setScreen('main')} />;
  if (screen === 'edit-email') return <EditEmailScreen onBack={() => setScreen('main')} />;
  if (screen === 'edit-password') return <EditPasswordScreen onBack={() => setScreen('main')} />;
  return <MainSettings onNavigate={setScreen} />;
}

function MainSettings({ onNavigate }: { onNavigate: (s: any) => void }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [notifEnabled, setNotifEnabled] = useState(currentUser?.notificationsEnabled ?? true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast.success('로그아웃되었어요');
  };

  const handleDeleteAccount = () => {
    logout();
    navigate('/auth');
    toast.success('계정이 삭제되었어요');
  };

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#191F28', letterSpacing: '-0.5px' }}>설정</h1>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        {/* Profile card */}
        <div className="lp-card" style={{ padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', border: '3px solid #FFF0F1', flexShrink: 0 }}>
              <img src={currentUser?.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 2 }}>{currentUser?.nickname}</p>
              <p style={{ fontSize: 13, color: '#8B95A1', marginBottom: 4 }}>{currentUser?.email}</p>
              <span style={{ background: '#F4F6F8', color: '#8B95A1', borderRadius: 6, fontSize: 11, fontWeight: 600, padding: '2px 8px' }}>
                {currentUser?.accountType === 'kakao' ? '카카오 계정' : '일반 계정'}
              </span>
            </div>
          </div>
        </div>

        {/* Account settings */}
        <div className="lp-card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#8B95A1', padding: '14px 20px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>계정 관리</p>
          {[
            { label: '프로필 수정', sub: '사진, 닉네임 변경', action: () => onNavigate('edit-profile') },
            { label: '이메일 수정', sub: currentUser?.email, action: () => onNavigate('edit-email') },
            { label: '비밀번호 변경', sub: currentUser?.accountType === 'kakao' ? '카카오 계정은 변경 불가' : '현재 비밀번호 확인 후 변경', action: () => onNavigate('edit-password') },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', width: '100%', borderTop: i > 0 ? '1px solid #F0F2F4' : 'none' }}
            >
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#191F28', marginBottom: 2 }}>{item.label}</p>
                {item.sub && <p style={{ fontSize: 12, color: '#8B95A1' }}>{item.sub}</p>}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>

        {/* Notification settings */}
        <div className="lp-card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#8B95A1', padding: '14px 20px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>알림</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#191F28', marginBottom: 2 }}>알림 설정</p>
              <p style={{ fontSize: 12, color: '#8B95A1' }}>매칭, 기록 관련 알림 수신</p>
            </div>
            <button
              onClick={() => setNotifEnabled(!notifEnabled)}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: notifEnabled ? '#f76e7e' : '#E5E8EB',
                border: 'none',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: 3,
                left: notifEnabled ? 23 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }} />
            </button>
          </div>
        </div>

        {/* Logout & Delete */}
        <div className="lp-card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', width: '100%' }}
          >
            <p style={{ fontSize: 15, fontWeight: 500, color: '#191F28' }}>로그아웃</p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5CDD6" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div style={{ height: 1, background: '#F0F2F4', margin: '0 20px' }} />
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', width: '100%' }}
          >
            <p style={{ fontSize: 15, fontWeight: 500, color: '#f76e7e' }}>계정 삭제</p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f76e7e" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#C5CDD6', marginTop: 24 }}>LovePin v1.0.0</p>
      </div>

      {/* Logout modal */}
      {showLogoutModal && (
        <>
          <div className="overlay-bg" onClick={() => setShowLogoutModal(false)} />
          <div className="modal-center">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 8, textAlign: 'center' }}>로그아웃</h3>
            <p style={{ fontSize: 14, color: '#8B95A1', textAlign: 'center', marginBottom: 24 }}>정말 로그아웃하시겠어요?</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ flex: 1, background: '#F4F6F8', color: '#191F28', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600 }}>취소</button>
              <button onClick={handleLogout} className="btn-primary" style={{ flex: 1 }}>로그아웃</button>
            </div>
          </div>
        </>
      )}

      {/* Delete account modal */}
      {showDeleteModal && (
        <>
          <div className="overlay-bg" onClick={() => setShowDeleteModal(false)} />
          <div className="modal-center">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 8, textAlign: 'center' }}>계정을 삭제할까요?</h3>
            <p style={{ fontSize: 14, color: '#8B95A1', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>계정을 삭제하면 복구할 수 없어요.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, background: '#F4F6F8', color: '#191F28', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600 }}>취소</button>
              <button onClick={handleDeleteAccount} style={{ flex: 1, background: '#f76e7e', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600 }}>계정 삭제</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function EditProfileScreen({ onBack }: { onBack: () => void }) {
  const { currentUser } = useApp();
  const [nickname, setNickname] = useState(currentUser?.nickname || '');

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '4px 8px 4px 0' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#191F28' }}>프로필 수정</h1>
        </div>
      </div>
      <div style={{ padding: '32px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '3px solid #FFF0F1' }}>
              <img src={currentUser?.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, background: '#f76e7e', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>닉네임</label>
          <input className="lp-input" value={nickname} onChange={e => setNickname(e.target.value)} maxLength={20} />
          <p style={{ fontSize: 12, color: '#C5CDD6', textAlign: 'right', marginTop: 4 }}>{nickname.length}/20</p>
        </div>
        <button className="btn-primary" onClick={() => { onBack(); toast.success('프로필이 수정되었어요'); }}>저장</button>
      </div>
    </div>
  );
}

function EditEmailScreen({ onBack }: { onBack: () => void }) {
  const { currentUser } = useApp();
  const [currentPw, setCurrentPw] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [step, setStep] = useState<'verify' | 'change'>(currentUser?.accountType === 'kakao' ? 'change' : 'verify');

  if (currentUser?.accountType === 'kakao') {
    return (
      <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
        <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '4px 8px 4px 0' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#191F28' }}>이메일 수정</h1>
          </div>
        </div>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: '#FEE500', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#191F28"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.636 1.627 4.952 4.07 6.306L5.2 20.1a.5.5 0 0 0 .72.55l4.43-2.96A11.5 11.5 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/></svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#191F28', marginBottom: 8 }}>카카오 계정은 앱 내 수정이 불가해요</p>
          <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>카카오 계정 이메일은 카카오에서 변경해주세요</p>
          <button className="btn-primary" onClick={onBack}>확인</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '4px 8px 4px 0' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#191F28' }}>이메일 수정</h1>
        </div>
      </div>
      <div style={{ padding: '32px 20px' }}>
        {step === 'verify' ? (
          <>
            <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 24 }}>현재 비밀번호를 확인해주세요</p>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>현재 비밀번호</label>
              <input className="lp-input" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="현재 비밀번호 입력" />
            </div>
            <button className="btn-primary" onClick={() => setStep('change')} disabled={!currentPw} style={{ background: currentPw ? '#f76e7e' : '#E5E8EB', color: currentPw ? 'white' : '#8B95A1' }}>확인</button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 24 }}>새 이메일을 입력해주세요</p>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>새 이메일</label>
              <input className="lp-input" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="새 이메일 입력" />
            </div>
            <button className="btn-primary" onClick={() => { onBack(); toast.success('이메일이 변경되었어요. 다시 로그인해주세요.'); }} disabled={!newEmail.includes('@')} style={{ background: newEmail.includes('@') ? '#f76e7e' : '#E5E8EB', color: newEmail.includes('@') ? 'white' : '#8B95A1' }}>변경 완료</button>
          </>
        )}
      </div>
    </div>
  );
}

function EditPasswordScreen({ onBack }: { onBack: () => void }) {
  const { currentUser } = useApp();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  if (currentUser?.accountType === 'kakao') {
    return (
      <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
        <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '4px 8px 4px 0' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#191F28' }}>비밀번호 변경</h1>
          </div>
        </div>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#191F28', marginBottom: 8 }}>카카오 계정은 앱 내 변경이 불가해요</p>
          <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 32 }}>카카오에서 비밀번호를 변경해주세요</p>
          <button className="btn-primary" onClick={onBack}>확인</button>
        </div>
      </div>
    );
  }

  const isValid = currentPw && newPw.length >= 8 && newPw === confirmPw;

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      <div style={{ background: 'white', padding: '56px 20px 16px', borderBottom: '1px solid #F0F2F4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: '4px 8px 4px 0' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#191F28' }}>비밀번호 변경</h1>
        </div>
      </div>
      <div style={{ padding: '32px 20px' }}>
        {[
          { label: '현재 비밀번호', value: currentPw, onChange: setCurrentPw, placeholder: '현재 비밀번호 입력' },
          { label: '새 비밀번호', value: newPw, onChange: setNewPw, placeholder: '8자 이상 입력' },
          { label: '새 비밀번호 확인', value: confirmPw, onChange: setConfirmPw, placeholder: '새 비밀번호 다시 입력' },
        ].map((field, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#191F28', display: 'block', marginBottom: 6 }}>{field.label}</label>
            <input className="lp-input" type="password" value={field.value} onChange={e => field.onChange(e.target.value)} placeholder={field.placeholder} />
          </div>
        ))}
        {confirmPw && newPw !== confirmPw && <p style={{ fontSize: 12, color: '#f76e7e', marginBottom: 16 }}>비밀번호가 일치하지 않아요.</p>}
        <button className="btn-primary" onClick={() => { onBack(); toast.success('비밀번호가 변경되었어요. 다시 로그인해주세요.'); }} disabled={!isValid} style={{ background: isValid ? '#f76e7e' : '#E5E8EB', color: isValid ? 'white' : '#8B95A1' }}>변경 완료</button>
      </div>
    </div>
  );
}
