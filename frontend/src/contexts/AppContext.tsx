import React, { createContext, useContext, useState, useCallback } from 'react';

// API 규격 스펙 적용 고정 타입
export type RecordTag = '여행' | '일상' | '데이트';
export type RecordType = 'COUPLE' | 'INDIVIDUAL';
export type MatchingState = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED';
export type AppMode = 'personal' | 'couple';

export interface MemoryRecord {
  recordId: number;
  title: string;
  content: string;
  visitDate: string;
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  tags: RecordTag[];
  recordType: RecordType;
  authorNickname: string | null; // COUPLE 기록일 땐 null 처리 규칙 준수
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
  photos: {
    imageId: number;
    imageUrl: string;
    isRepresentative: boolean;
    sequence: number;
  }[];
}

export interface Notification {
  notificationId: number;
  type: 
    | 'MATCH_REQUEST' | 'MATCH_ACCEPTED' | 'MATCH_REJECTED' | 'MATCH_EXPIRED'
    | 'LINK_DISCONNECTED' | 'ACCOUNT_DELETED' 
    | 'COUPLE_RECORD_CREATED' | 'COUPLE_RECORD_UPDATED' | 'COUPLE_RECORD_DELETED'
    | 'DDAY_UPDATED';
  message: string;
  isRead: boolean;
  senderId?: number;
  senderNickname?: string;
  senderProfileImgUrl?: string;
  requestId?: number;
  recordId?: number | null;
  coupleId?: number | null;
  createdAt: string;
}

export interface UserProfile {
  userId: number;
  email: string;
  nickname: string;
  profileImgUrl: string;
  provider: 'LOCAL' | 'KAKAO';
  uniqueCode?: string;
  pushEnabled?: boolean;
  createdAt?: string;
}

interface AppState {
  isLoggedIn: boolean;
  mode: AppMode;
  matchingState: MatchingState;
  myProfile: UserProfile | null;
  partnerProfile: UserProfile | null;
  coupleId: number | null;
  dDayDate: string | null;
  dDayCount: number | null;
  records: MemoryRecord[];
  notifications: Notification[];
  activeTab: string;
  pendingRequest: { requestId: number; receiverNickname: string; expiredAt: string; } | null;
  receivedRequest: { requestId: number; senderNickname: string; senderProfileImgUrl: string; } | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  addRecord: (formData: FormData) => void; // Multipart Form-Data 형식 대응 준비
  updateRecord: (recordId: number, formData: FormData) => void;
  deleteRecord: (recordId: number) => void;
  sendMatchRequest: (uniqueCode: string) => boolean;
  cancelMatchRequest: (requestId: number) => void;
  acceptMatch: (requestId: number) => void;
  rejectMatch: (requestId: number) => void;
  disconnectCouple: (coupleId: number) => void;
  setDday: (coupleId: number, dDayDate: string) => void;
  markNotificationRead: (notificationId: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// 더미 데이터 주소 유지
const PROFILE_YEBIN = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663666287881/a6vhHtyQsDTNyBG78iJnQM/lovepin-profile-yebin-3wx5KTinu6MNpvGiMwjpKs.webp';
const PROFILE_MINJI = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663666287881/a6vhHtyQsDTNyBG78iJnQM/lovepin-profile-minji-HEM4UzKTBWf5odDuob9E4v.webp';
const CAFE_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663666287881/a6vhHtyQsDTNyBG78iJnQM/lovepin-memory-cafe-YoutCYFe6tHz66i2VDGW3W.webp';

const DUMMY_RECORDS: MemoryRecord[] = [
  {
    recordId: 1,
    title: '서울숲 산책한 날',
    content: '봄날 서울숲에서 함께 산책했어요. 벚꽃이 정말 예뻤고 날씨도 너무 좋았어요.',
    visitDate: '2025-04-12',
    placeName: '서울숲',
    placeAddress: '서울 성동구 뚝섬로 273',
    latitude: 37.5445,
    longitude: 127.0374,
    tags: ['데이트', '일상'],
    recordType: 'COUPLE',
    authorNickname: null,
    canEdit: true,
    canDelete: true,
    createdAt: '2025-04-12T14:30:00Z',
    updatedAt: '2025-04-12T14:30:00Z',
    photos: [
      { imageId: 11, imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&q=80', isRepresentative: true, sequence: 1 },
      { imageId: 12, imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80', isRepresentative: false, sequence: 2 },
      { imageId: 13, imageUrl: CAFE_IMG, isRepresentative: false, sequence: 3 }
    ]
  },
  {
    recordId: 5,
    title: '비 오는 날의 연남동',
    content: '비 오는 날 연남동 골목을 걸었어요.',
    visitDate: '2025-01-30',
    placeName: '연남동 골목길',
    placeAddress: '서울 마포구 연남동',
    latitude: 37.5617,
    longitude: 126.9239,
    tags: ['일상', '데이트'],
    recordType: 'INDIVIDUAL',
    authorNickname: '예빈',
    canEdit: true,
    canDelete: true,
    createdAt: '2025-01-30T16:00:00Z',
    updatedAt: '2025-01-30T16:00:00Z',
    photos: [
      { imageId: 51, imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80', isRepresentative: true, sequence: 1 }
    ]
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    mode: 'couple',
    matchingState: 'NONE',
    myProfile: null,
    partnerProfile: {
      userId: 2,
      nickname: '민지',
      email: 'minji@example.com',
      provider: 'GENERAL' as any,
      profileImgUrl: PROFILE_MINJI,
      uniqueCode: 'MINJI123'
    },
    coupleId: 5,
    dDayDate: '2025-03-14',
    dDayCount: 434, // 2026년 기준 D-Day 일수 자동 추산 가안
    records: DUMMY_RECORDS,
    notifications: [],
    activeTab: 'timeline',
    pendingRequest: null,
    receivedRequest: null,
  });

  const login = useCallback((email: string, _password: string): boolean => {
    setState(prev => ({
      ...prev,
      isLoggedIn: true,
      myProfile: {
        userId: 1,
        nickname: '예빈',
        email,
        provider: 'LOCAL',
        profileImgUrl: PROFILE_YEBIN,
        uniqueCode: 'ab12cd34'
      }
    }));
    return true;
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isLoggedIn: false, myProfile: null, activeTab: 'timeline' }));
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const addRecord = useCallback((formData: FormData) => {
    // 실제 백엔드 연동을 위한 규격 뼈대 매핑
    const title = formData.get('title') as string;
    const newRecord: MemoryRecord = {
      recordId: Date.now(),
      title: title || '새로운 기록',
      content: (formData.get('content') as string) || '',
      visitDate: (formData.get('visitDate') as string) || '2026-05-21',
      placeName: (formData.get('placeName') as string) || '미정 장소',
      placeAddress: (formData.get('address') as string) || '',
      latitude: Number(formData.get('latitude')) || 37.5665,
      longitude: Number(formData.get('longitude')) || 126.9780,
      tags: ['일상'], 
      recordType: (formData.get('recordType') as RecordType) || 'INDIVIDUAL',
      authorNickname: formData.get('recordType') === 'COUPLE' ? null : '예빈',
      canEdit: true,
      canDelete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photos: [{ imageId: Date.now() + 1, imageUrl: CAFE_IMG, isRepresentative: true, sequence: 1 }]
    };
    setState(prev => ({ ...prev, records: [newRecord, ...prev.records] }));
  }, []);

  const updateRecord = useCallback((id: number, _formData: FormData) => {
    setState(prev => ({
      ...prev,
      records: prev.records.map(r => r.recordId === id ? { ...r, updatedAt: new Date().toISOString() } : r),
    }));
  }, []);

  const deleteRecord = useCallback((id: number) => {
    setState(prev => ({ ...prev, records: prev.records.filter(r => r.recordId !== id) }));
  }, []);

  const sendMatchRequest = useCallback((code: string): boolean => {
    if (!code || code === 'ab12cd34') return false;
    setState(prev => ({
      ...prev,
      matchingState: 'PENDING_SENT',
      pendingRequest: { requestId: 7, receiverNickname: '민지', expiredAt: '2026-05-28T12:00:00Z' }
    }));
    return true;
  }, []);

  const cancelMatchRequest = useCallback((_requestId: number) => {
    setState(prev => ({ ...prev, matchingState: 'NONE', pendingRequest: null }));
  }, []);

  const acceptMatch = useCallback((_requestId: number) => {
    setState(prev => ({ ...prev, mode: 'couple', matchingState: 'NONE', receivedRequest: null }));
  }, []);

  const rejectMatch = useCallback((_requestId: number) => {
    setState(prev => ({ ...prev, matchingState: 'NONE', receivedRequest: null }));
  }, []);

  const disconnectCouple = useCallback((_coupleId: number) => {
    setState(prev => ({ ...prev, mode: 'personal', dDayDate: null, dDayCount: null }));
  }, []);

  const setDday = useCallback((_coupleId: number, date: string) => {
    setState(prev => ({ ...prev, dDayDate: date, dDayCount: 1 }));
  }, []);

  const markNotificationRead = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.notificationId === id ? { ...n, isRead: true } : n),
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      login, 
      logout, 
      setActiveTab,
      addRecord, 
      updateRecord, 
      deleteRecord,
      sendMatchRequest, 
      cancelMatchRequest, 
      acceptMatch, 
      rejectMatch,
      disconnectCouple, 
      setDday, 
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}