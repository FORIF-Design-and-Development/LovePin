/**
 * LovePin Couple Page (API Integrated)
 * Design: Emotional Minimalism — couple status management
 * Features: mode & matching states, notifications, D-day
 */
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type CoupleTab = 'status' | 'notifications';

export default function CouplePage() {
  const [activeTab, setActiveTab] = useState<CoupleTab>('status');
  const { notifications } = useApp();
  // API 스펙 반영: read -> isRead
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '56px 20px 0', borderBottom: '1px solid #F0F2F4', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#191F28', letterSpacing: '-0.5px', marginBottom: 16 }}>연인</h1>
        {/* Sub tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {(['status', 'notifications'] as CoupleTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: '10px 0',
                fontSize: 15,
                fontWeight: activeTab === tab ? 700 : 400,
                color: activeTab === tab ? '#191F28' : '#8B95A1',
                borderBottom: activeTab === tab ? '2.5px solid #f76e7e' : '2.5px solid transparent',
                transition: 'all 0.15s',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              {tab === 'status' ? '상태' : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  알림
                  {unread > 0 && (
                    <span style={{ background: '#f76e7e', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {unread}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        {activeTab === 'status' ? <CoupleStatus /> : <CoupleNotifications />}
      </div>
    </div>
  );
}

function CoupleStatus() {
  // 백엔드 API 명세에 따른 변수명 동기화
  const { 
    mode, matchingState, myProfile, partnerProfile, coupleId, 
    dDayDate, dDayCount, pendingRequest, receivedRequest, 
    sendMatchRequest, cancelMatchRequest, acceptMatch, rejectMatch, 
    disconnectCouple, setDday 
  } = useApp();
  
  const [matchCode, setMatchCode] = useState('');
  const [matchError, setMatchError] = useState('');
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showDdayPicker, setShowDdayPicker] = useState(false);
  const [newDday, setNewDday] = useState(dDayDate || '');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myProfile?.uniqueCode || '').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('코드가 복사되었어요');
  };

  const handleSendRequest = () => {
    if (!matchCode) { setMatchError('상대방 코드를 입력해주세요.'); return; }
    if (matchCode === myProfile?.uniqueCode) { setMatchError('본인의 코드는 입력할 수 없어요.'); return; }
    
    const ok = sendMatchRequest(matchCode);
    if (!ok) { setMatchError('올바르지 않은 코드예요.'); return; }
    
    setMatchError('');
    setMatchCode('');
    toast.success('매칭 요청을 보냈어요');
  };

  const handleDisconnect = () => {
    if (coupleId) disconnectCouple(coupleId);
    setShowDisconnectModal(false);
    toast.success('연결이 해제되었어요');
  };

  const handleSetDday = () => {
    if (newDday && coupleId) {
      setDday(coupleId, newDday);
      setShowDdayPicker(false);
      toast.success('디데이가 설정되었어요');
    }
  };

  // State 1: 상호 요청 없음 (개인 모드)
  if (mode === 'personal' && matchingState === 'NONE') {
    return (
      <div className="page-enter">
        {/* Profile */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '3px solid #FFF0F1' }}>
            <img src={myProfile?.profileImgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#191F28', marginBottom: 4 }}>{myProfile?.nickname}</p>
          <span style={{ background: '#F4F6F8', color: '#8B95A1', borderRadius: 8, fontSize: 12, fontWeight: 600, padding: '3px 10px' }}>개인 모드</span>
        </div>

        {/* My code */}
        <div className="lp-card" style={{ padding: '16px 20px', marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#8B95A1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>내 고유 코드</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#191F28', letterSpacing: '2px' }}>{myProfile?.uniqueCode}</span>
            <button
              onClick={handleCopyCode}
              style={{ background: copied ? '#FFF0F1' : '#F4F6F8', color: copied ? '#f76e7e' : '#8B95A1', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#8B95A1', textAlign: 'center', marginBottom: 24 }}>연인과 연결하여 함께 기록을 남겨보세요</p>

        {/* Match request */}
        <div className="lp-card" style={{ padding: '20px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: 12 }}>연인 코드 입력</p>
          <input
            className="lp-input"
            placeholder="상대방의 고유 코드를 입력하세요"
            value={matchCode}
            onChange={e => { setMatchCode(e.target.value); setMatchError(''); }}
            style={{ marginBottom: matchError ? 6 : 12 }}
          />
          {matchError && <p style={{ fontSize: 12, color: '#f76e7e', marginBottom: 12 }}>{matchError}</p>}
          <button
            style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 700, cursor: matchCode ? 'pointer' : 'default', background: matchCode ? '#f76e7e' : '#E5E8EB', color: matchCode ? 'white' : '#8B95A1' }}
            onClick={handleSendRequest}
            disabled={!matchCode}
          >
            매칭 요청 보내기
          </button>
        </div>
      </div>
    );
  }

  // State 2: 요청 수락 대기 (송신자)
  if (mode === 'personal' && matchingState === 'PENDING_SENT') {
    return (
      <div className="page-enter">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '3px solid #FFF0F1' }}>
            <img src={myProfile?.profileImgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#191F28', marginBottom: 4 }}>{myProfile?.nickname}</p>
        </div>

        <div className="lp-card" style={{ padding: '16px 20px', marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#8B95A1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>내 고유 코드</p>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#191F28', letterSpacing: '2px' }}>{myProfile?.uniqueCode}</span>
        </div>

        <div className="lp-card" style={{ padding: '20px', marginBottom: 16, borderLeft: '4px solid #f76e7e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, background: '#FFF0F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f76e7e" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: 2 }}>{pendingRequest?.receiverNickname}님에게 매칭 요청을 보냈어요.</p>
              <p style={{ fontSize: 13, color: '#8B95A1' }}>현재 상대방의 수락을 기다리는 중입니다.</p>
            </div>
          </div>
          <button
            onClick={() => { if(pendingRequest) cancelMatchRequest(pendingRequest.requestId); toast.success('요청이 취소되었어요'); }}
            style={{ width: '100%', background: '#F4F6F8', color: '#8B95A1', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            요청 취소
          </button>
        </div>

        <p style={{ fontSize: 13, color: '#8B95A1', textAlign: 'center' }}>상대방이 수락하면 커플 모드로 전환됩니다.</p>
      </div>
    );
  }

  // State 3: 요청 수신 (수신자)
  if (mode === 'personal' && matchingState === 'PENDING_RECEIVED') {
    return (
      <div className="page-enter">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: '3px solid #FFF0F1' }}>
            <img src={receivedRequest?.senderProfileImgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 6 }}>{receivedRequest?.senderNickname}님이 매칭을 요청했어요.</p>
          <p style={{ fontSize: 14, color: '#8B95A1' }}>수락하면 커플 모드로 전환돼요</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => { if(receivedRequest) rejectMatch(receivedRequest.requestId); toast.success('요청을 거절했어요'); }}
            style={{ flex: 1, background: '#F4F6F8', color: '#191F28', border: 'none', borderRadius: 14, padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
          >
            거절
          </button>
          <button
            onClick={() => { if(receivedRequest) acceptMatch(receivedRequest.requestId); toast.success('커플 모드로 전환되었어요 💕'); }}
            style={{ flex: 1, background: '#f76e7e', color: 'white', border: 'none', borderRadius: 14, padding: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
          >
            수락
          </button>
        </div>
      </div>
    );
  }

  // State 4: 커플 모드
  return (
    <div className="page-enter">
      {/* Couple profile */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 8px', border: '3px solid #FFF0F1' }}>
            <img src={myProfile?.profileImgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#191F28' }}>{myProfile?.nickname}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#f76e7e" stroke="#f76e7e" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#FFF0F1', color: '#f76e7e', padding: '3px 8px', borderRadius: 6 }}>커플 모드</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 8px', border: '3px solid #FFF0F1' }}>
            <img src={partnerProfile?.profileImgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#191F28' }}>{partnerProfile?.nickname}</p>
        </div>
      </div>

      {/* D-day card */}
      <div className="lp-card" style={{ padding: '20px', marginBottom: 16, background: 'linear-gradient(135deg, #FFF0F1 0%, #FFF5F5 100%)' }}>
        {dDayDate ? (
          <>
            <p style={{ fontSize: 13, color: '#f76e7e', fontWeight: 600, marginBottom: 4 }}>{dDayDate.replace(/-/g, '.')}부터 함께</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: '#f76e7e', letterSpacing: '-1px', marginBottom: 12 }}>
              D+{dDayCount}
            </p>
            <button
              onClick={() => setShowDdayPicker(true)}
              style={{ background: 'white', color: '#f76e7e', border: '1.5px solid #f76e7e', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              디데이 수정
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 4 }}>디데이를 설정해보세요</p>
            <p style={{ fontSize: 13, color: '#8B95A1', marginBottom: 12 }}>처음 만난 날을 기록해요</p>
            <button
              onClick={() => setShowDdayPicker(true)}
              style={{ background: '#f76e7e', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              디데이 설정
            </button>
          </>
        )}
      </div>

      {showDdayPicker && (
        <div className="lp-card page-enter" style={{ padding: '20px', marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: 12 }}>처음 만난 날 선택</p>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={newDday}
            onChange={e => setNewDday(e.target.value)}
            className="lp-input"
            style={{ marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowDdayPicker(false)} style={{ flex: 1, background: '#F4F6F8', color: '#8B95A1', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>취소</button>
            <button onClick={handleSetDday} style={{ flex: 1, background: '#f76e7e', color: 'white', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>저장</button>
          </div>
        </div>
      )}

      <p style={{ fontSize: 14, color: '#8B95A1', textAlign: 'center', marginBottom: 24 }}>연인과 함께 기록을 작성할 수 있어요</p>

      <button
        onClick={() => setShowDisconnectModal(true)}
        style={{ width: '100%', background: 'none', border: '1.5px solid #E5E8EB', borderRadius: 14, padding: 14, fontSize: 15, fontWeight: 600, color: '#8B95A1', cursor: 'pointer' }}
      >
        연결 해제
      </button>

      {showDisconnectModal && (
        <>
          <div className="overlay-bg" onClick={() => setShowDisconnectModal(false)} />
          <div className="modal-center page-enter">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 8, textAlign: 'center' }}>연결을 해제할까요?</h3>
            <p style={{ fontSize: 14, color: '#8B95A1', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
              연결을 해제하면 두 사람 사이의 커플 기록은 숨김 처리되며 복구할 수 없어요.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowDisconnectModal(false)} style={{ flex: 1, background: '#F4F6F8', color: '#191F28', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>취소</button>
              <button onClick={handleDisconnect} style={{ flex: 1, background: '#f76e7e', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>연결 해제</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CoupleNotifications() {
  const { notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();

  const handleNotifClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.notificationId);
    if (notif.recordId) navigate(`/app/record/${notif.recordId}`);
  };

  const getNotifIcon = (type: string) => {
    if (type.includes('MATCH')) return '💌';
    if (type.includes('RECORD')) return '📝';
    if (type.includes('DDAY')) return '💕';
    if (type.includes('DISCONNECT') || type.includes('DELETE')) return '💔';
    return '🔔';
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  if (notifications.length === 0) {
    return (
      <div className="page-enter" style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#191F28', marginBottom: 8 }}>아직 받은 알림이 없어요.</p>
        <p style={{ fontSize: 14, color: '#8B95A1' }}>연인과 연결하면 알림을 받을 수 있어요</p>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {notifications.map(notif => (
        <button
          key={notif.notificationId}
          onClick={() => handleNotifClick(notif)}
          style={{
            background: notif.isRead ? 'white' : '#FFF5F5',
            borderRadius: 16,
            padding: '16px',
            border: 'none',
            textAlign: 'left',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: 24, flexShrink: 0 }}>{getNotifIcon(notif.type)}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: notif.isRead ? 400 : 600, color: '#191F28', marginBottom: 4, lineHeight: 1.4 }}>{notif.message}</p>
            <p style={{ fontSize: 12, color: '#C5CDD6' }}>{formatTime(notif.createdAt)}</p>
          </div>
          {!notif.isRead && (
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f76e7e', flexShrink: 0, marginTop: 4 }} />
          )}
        </button>
      ))}
    </div>
  );
}