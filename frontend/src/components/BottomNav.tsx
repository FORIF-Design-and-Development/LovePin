/**
 * LovePin BottomNav
 * Design: Emotional Minimalism — clean tab bar with active indicator
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const TABS = [
  {
    id: 'timeline',
    path: '/app/timeline',
    label: '타임라인',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#f76e7e' : '#C5CDD6'} strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    id: 'map',
    path: '/app/map',
    label: '지도',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#f76e7e' : '#C5CDD6'} strokeWidth="2" strokeLinecap="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3" fill={active ? '#f76e7e' : 'none'}/>
      </svg>
    ),
  },
  {
    id: 'add',
    path: '/app/record/new',
    label: '',
    icon: (_active: boolean) => (
      <div style={{
        width: 52,
        height: 52,
        background: 'linear-gradient(135deg, #f76e7e 0%, #ff9a9e 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(247,110,126,0.4)',
        marginTop: -20,
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
    ),
  },
  {
    id: 'couple',
    path: '/app/couple',
    label: '연인',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#f76e7e' : 'none'} stroke={active ? '#f76e7e' : '#C5CDD6'} strokeWidth="2" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    path: '/app/settings',
    label: '설정',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#f76e7e' : '#C5CDD6'} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useApp();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const activeTab = location.pathname.startsWith('/app/timeline') ? 'timeline'
    : location.pathname.startsWith('/app/map') ? 'map'
    : location.pathname.startsWith('/app/record/new') ? 'add'
    : location.pathname.startsWith('/app/couple') ? 'couple'
    : location.pathname.startsWith('/app/settings') ? 'settings'
    : 'timeline';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: 'white',
      borderTop: '1px solid #F0F2F4',
      display: 'flex',
      alignItems: 'flex-end',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      zIndex: 50,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
    }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        const isAdd = tab.id === 'add';

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: isAdd ? '0 0 4px' : '10px 0 8px',
              background: 'none',
              border: 'none',
              position: 'relative',
              minHeight: 56,
            }}
          >
            <div style={{ position: 'relative' }}>
              {tab.icon(isActive)}
              {tab.id === 'couple' && unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#f76e7e',
                  border: '1.5px solid white',
                }} />
              )}
            </div>
            {!isAdd && (
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#f76e7e' : '#C5CDD6',
                marginTop: 3,
                letterSpacing: '-0.2px',
              }}>
                {tab.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
