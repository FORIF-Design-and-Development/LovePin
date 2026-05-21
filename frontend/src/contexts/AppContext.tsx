/**
 * LovePin AppContext
 * Design: Emotional Minimalism — manages auth state, couple status, records
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

export type RecordTag = '여행' | '일상' | '데이트';
export type RecordType = '커플 기록' | '개별 기록';
export type CoupleStatus = 'solo' | 'pending_sent' | 'pending_received' | 'coupled';

export interface MemoryRecord {
  id: string;
  title: string;
  place: string;
  address: string;
  visitDate: string;
  photos: string[];
  representativePhoto: number;
  tags: RecordTag[];
  recordType: RecordType;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  lat: number;
  lng: number;
  district: string;
}

export interface Notification {
  id: string;
  type: 'matching_request' | 'matching_accepted' | 'matching_rejected' | 'matching_expired' | 'couple_record_added' | 'couple_record_edited' | 'dday_changed' | 'disconnected';
  message: string;
  read: boolean;
  createdAt: string;
  relatedRecordId?: string;
}

export interface User {
  id: string;
  nickname: string;
  email: string;
  accountType: 'general' | 'kakao';
  profileImage: string;
  coupleCode: string;
  notificationsEnabled: boolean;
}

interface AppState {
  isLoggedIn: boolean;
  currentUser: User | null;
  partner: User | null;
  coupleStatus: CoupleStatus;
  dday: string | null;
  records: MemoryRecord[];
  notifications: Notification[];
  activeTab: string;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, nickname: string) => void;
  setActiveTab: (tab: string) => void;
  addRecord: (record: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => MemoryRecord;
  updateRecord: (id: string, record: Partial<MemoryRecord>) => void;
  deleteRecord: (id: string) => void;
  sendMatchRequest: (code: string) => boolean;
  cancelMatchRequest: () => void;
  acceptMatch: () => void;
  rejectMatch: () => void;
  disconnect: () => void;
  setDday: (date: string) => void;
  markNotificationRead: (id: string) => void;
  setCoupleStatus: (status: CoupleStatus) => void;
}

const PROFILE_YEBIN = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663666287881/a6vhHtyQsDTNyBG78iJnQM/lovepin-profile-yebin-3wx5KTinu6MNpvGiMwjpKs.webp';
const PROFILE_MINJI = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663666287881/a6vhHtyQsDTNyBG78iJnQM/lovepin-profile-minji-HEM4UzKTBWf5odDuob9E4v.webp';
const CAFE_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663666287881/a6vhHtyQsDTNyBG78iJnQM/lovepin-memory-cafe-YoutCYFe6tHz66i2VDGW3W.webp';

const DUMMY_RECORDS: MemoryRecord[] = [
  {
    id: '1',
    title: '서울숲 산책한 날',
    place: '서울숲',
    address: '서울 성동구 뚝섬로 273',
    visitDate: '2025-04-12',
    photos: [
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&q=80',
      'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80',
      CAFE_IMG,
    ],
    representativePhoto: 0,
    tags: ['데이트', '일상'],
    recordType: '커플 기록',
    content: '봄날 서울숲에서 함께 산책했어요. 벚꽃이 정말 예뻤고 날씨도 너무 좋았어요.',
    author: '예빈',
    createdAt: '2025-04-12T14:30:00',
    updatedAt: '2025-04-12T14:30:00',
    lat: 37.5445,
    lng: 127.0374,
    district: '성동구',
  },
  {
    id: '2',
    title: '처음 같이 간 카페',
    place: '성수 카페거리',
    address: '서울 성동구 성수이로 77',
    visitDate: '2025-03-20',
    photos: [
      CAFE_IMG,
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    ],
    representativePhoto: 0,
    tags: ['데이트'],
    recordType: '커플 기록',
    content: '처음으로 함께 간 카페. 라떼가 정말 맛있었어요.',
    author: '예빈',
    createdAt: '2025-03-20T11:00:00',
    updatedAt: '2025-03-20T11:00:00',
    lat: 37.5448,
    lng: 127.0558,
    district: '성동구',
  },
  {
    id: '3',
    title: '한강에서 본 노을',
    place: '한강공원',
    address: '서울 영등포구 여의동로 330',
    visitDate: '2025-03-14',
    photos: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    ],
    representativePhoto: 0,
    tags: ['데이트', '일상'],
    recordType: '커플 기록',
    content: '한강에서 노을을 봤어요. 정말 아름다웠어요.',
    author: '민지',
    createdAt: '2025-03-14T18:30:00',
    updatedAt: '2025-03-14T18:30:00',
    lat: 37.5283,
    lng: 126.9322,
    district: '영등포구',
  },
  {
    id: '4',
    title: '주말 데이트 기록',
    place: '경복궁',
    address: '서울 종로구 사직로 161',
    visitDate: '2025-02-22',
    photos: [
      'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=400&q=80',
    ],
    representativePhoto: 0,
    tags: ['여행', '데이트'],
    recordType: '커플 기록',
    content: '경복궁 나들이. 한복 입고 사진도 찍었어요.',
    author: '예빈',
    createdAt: '2025-02-22T10:00:00',
    updatedAt: '2025-02-22T10:00:00',
    lat: 37.5796,
    lng: 126.9770,
    district: '종로구',
  },
  {
    id: '5',
    title: '비 오는 날의 연남동',
    place: '연남동 골목길',
    address: '서울 마포구 연남동',
    visitDate: '2025-01-30',
    photos: [
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&q=80',
    ],
    representativePhoto: 0,
    tags: ['일상', '데이트'],
    recordType: '개별 기록',
    content: '비 오는 날 연남동 골목을 걸었어요.',
    author: '예빈',
    createdAt: '2025-01-30T16:00:00',
    updatedAt: '2025-01-30T16:00:00',
    lat: 37.5617,
    lng: 126.9239,
    district: '마포구',
  },
];

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'couple_record_added',
    message: '민지님이 커플 기록을 새로 작성했어요.',
    read: false,
    createdAt: '2025-04-12T15:00:00',
    relatedRecordId: '1',
  },
  {
    id: 'n2',
    type: 'matching_accepted',
    message: '민지님이 매칭 요청을 수락했어요.',
    read: true,
    createdAt: '2025-03-14T10:00:00',
  },
  {
    id: 'n3',
    type: 'dday_changed',
    message: '디데이가 변경되었어요.',
    read: true,
    createdAt: '2025-03-14T10:05:00',
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    isLoggedIn: false,
    currentUser: null,
    partner: {
      id: 'minji',
      nickname: '민지',
      email: 'minji@example.com',
      accountType: 'general',
      profileImage: PROFILE_MINJI,
      coupleCode: 'MINJI-2025',
      notificationsEnabled: true,
    },
    coupleStatus: 'coupled',
    dday: '2025-03-14',
    records: DUMMY_RECORDS,
    notifications: DUMMY_NOTIFICATIONS,
    activeTab: 'timeline',
  });

  const login = useCallback((email: string, _password: string): boolean => {
    if (email === 'yebin@example.com' || email === 'test@test.com' || email.includes('@')) {
      setState(prev => ({
        ...prev,
        isLoggedIn: true,
        currentUser: {
          id: 'yebin',
          nickname: '예빈',
          email,
          accountType: 'general',
          profileImage: PROFILE_YEBIN,
          coupleCode: 'YEBIN-2025',
          notificationsEnabled: true,
        },
      }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isLoggedIn: false, currentUser: null, activeTab: 'timeline' }));
  }, []);

  const register = useCallback((_email: string, _password: string, _nickname: string) => {
    // Registration handled in UI, redirects to login
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const addRecord = useCallback((record: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt' | 'author'>): MemoryRecord => {
    const newRecord: MemoryRecord = {
      ...record,
      id: String(Date.now()),
      author: '예빈',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, records: [newRecord, ...prev.records] }));
    return newRecord;
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<MemoryRecord>) => {
    setState(prev => ({
      ...prev,
      records: prev.records.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r),
    }));
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setState(prev => ({ ...prev, records: prev.records.filter(r => r.id !== id) }));
  }, []);

  const sendMatchRequest = useCallback((code: string): boolean => {
    if (!code || code === 'YEBIN-2025') return false;
    setState(prev => ({ ...prev, coupleStatus: 'pending_sent' }));
    return true;
  }, []);

  const cancelMatchRequest = useCallback(() => {
    setState(prev => ({ ...prev, coupleStatus: 'solo' }));
  }, []);

  const acceptMatch = useCallback(() => {
    setState(prev => ({
      ...prev,
      coupleStatus: 'coupled',
      notifications: [
        {
          id: String(Date.now()),
          type: 'matching_accepted',
          message: '민지님이 매칭 요청을 수락했어요.',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const rejectMatch = useCallback(() => {
    setState(prev => ({
      ...prev,
      coupleStatus: 'solo',
      notifications: [
        {
          id: String(Date.now()),
          type: 'matching_rejected',
          message: '매칭 요청이 거절되었어요.',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const disconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      coupleStatus: 'solo',
      dday: null,
      notifications: [
        {
          id: String(Date.now()),
          type: 'disconnected',
          message: '민지님과의 연결이 해제되었어요.',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const setDday = useCallback((date: string) => {
    setState(prev => ({
      ...prev,
      dday: date,
      notifications: [
        {
          id: String(Date.now()),
          type: 'dday_changed',
          message: '디데이가 변경되었어요.',
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  }, []);

  const setCoupleStatus = useCallback((status: CoupleStatus) => {
    setState(prev => ({ ...prev, coupleStatus: status }));
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      login, logout, register, setActiveTab,
      addRecord, updateRecord, deleteRecord,
      sendMatchRequest, cancelMatchRequest, acceptMatch, rejectMatch,
      disconnect, setDday, markNotificationRead, setCoupleStatus,
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
