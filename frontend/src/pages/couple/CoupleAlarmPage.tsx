import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: number;
  type: 'matching' | 'couple_record' | 'dday' | 'disconnect';
  message: string;
  createdAt: string;
  read: boolean;
  relatedRecordId?: number;
}

export default function CoupleAlarmPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🚨 TODO: [API 연동] 알림 목록 조회 (GET /api/notifications)
  useEffect(() => {
    setIsLoading(true);
    // 시연용 더미 데이터
    setTimeout(() => {
      setNotifications([
        { id: 1, type: 'couple_record', message: '민지님이 새로운 커플 기록을 작성했어요.', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false, relatedRecordId: 10 },
        { id: 2, type: 'matching', message: '민지님과 커플로 연결되었어요 💕', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
        { id: 3, type: 'dday', message: '오늘은 함께한 지 100일 되는 날이에요!', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), read: true },
      ]);
      setIsLoading(false);
    }, 300);
  }, []);

  // 🚨 TODO: [API 연동] 알림 읽음 처리 (PATCH /api/notifications/:id/read)
  const handleNotifClick = (notif: NotificationItem) => {
    // 로컬 상태 즉시 업데이트 (Optimistic UI)
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    
    // 관련 기록이 있으면 상세 페이지로 이동
    if (notif.relatedRecordId) {
      navigate(`/app/record/${notif.relatedRecordId}`);
    }
  };

  const getNotifIcon = (type: string) => {
    if (type === 'matching') return '💌';
    if (type === 'couple_record') return '📝';
    if (type === 'dday') return '💕';
    if (type === 'disconnect') return '💔';
    return '🔔';
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-full flex flex-col bg-background pb-[65px]">
      {/* 🔹 상단 헤더 및 서브 탭 */}
      <div className="bg-white px-5 pt-12 pb-0 border-b border-border sticky top-0 z-10">
        <h1 className="text-[22px] font-bold text-foreground tracking-[-0.5px] mb-4">연인</h1>
        <div className="flex">
          <button 
            onClick={() => navigate('/app/couple/status')}
            className="flex-1 pb-3 text-[15px] font-medium text-muted-foreground border-b-2 border-transparent transition-all"
          >
            상태
          </button>
          <button 
            className="flex-1 pb-3 text-[15px] font-bold text-foreground border-b-2 border-primary transition-all flex items-center justify-center gap-1.5"
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

      {/* 🔹 알림 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground py-10 animate-pulse font-medium">알림을 불러오는 중...</p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <span className="text-[32px] opacity-30">🔕</span>
            </div>
            <p className="text-[16px] font-bold text-foreground mb-1.5">아직 받은 알림이 없어요.</p>
            <p className="text-[14px] text-muted-foreground">연인과 연결하면 알림을 받을 수 있어요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map(notif => (
              <button
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`w-full text-left p-4 rounded-[18px] flex items-start gap-4 transition-all ${
                  notif.read ? 'bg-card shadow-sm border border-border/50' : 'bg-accent/50 border border-primary/10 shadow-sm'
                }`}
              >
                <div className="text-[24px] shrink-0 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-border/40">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`text-[14px] mb-1.5 leading-[1.4] ${notif.read ? 'text-foreground font-medium' : 'text-foreground font-bold'}`}>
                    {notif.message}
                  </p>
                  <p className="text-[12px] text-muted-foreground font-medium tracking-wide">
                    {formatTime(notif.createdAt)}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </button>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}