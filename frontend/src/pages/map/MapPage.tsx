/**
 * LovePin Map Page - Kakao Map Ready
 * Design: Emotional Minimalism — 카카오맵 연동 준비된 목업 화면
 * Features: 줌 레벨별 클러스터링 (시/군 → 구 → 상세위치), 기록 수 기반 핀 강조
 */
import { useState, useEffect, useRef } from 'react';
import { useApp, type MemoryRecord } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { MapView, type MockMapRef } from '@/components/Map';

type ZoomLevel = 'city' | 'district' | 'detail';

interface PinData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  records: MemoryRecord[];
  type: 'city' | 'district' | 'place';
}

export default function MapPage() {
  const { records } = useApp();
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('district');
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'couple' | 'personal'>('all');
  const mapRef = useRef<MockMapRef | null>(null);

  const filteredRecords = records.filter(r => {
    if (filterType === 'couple') return r.recordType === '커플 기록';
    if (filterType === 'personal') return r.recordType === '개별 기록';
    return true;
  });

  // 줌 레벨에 따른 핀 데이터 생성
  const getPinsForZoomLevel = (): PinData[] => {
    if (zoomLevel === 'city') {
      // 시/군 단위 그룹핑
      const cityGroups: Record<string, PinData> = {};
      filteredRecords.forEach(r => {
        const city = r.district.includes('구') ? '서울' : r.district.split(' ')[0];
        if (!cityGroups[city]) {
          cityGroups[city] = {
            id: city,
            name: city,
            lat: r.lat,
            lng: r.lng,
            records: [],
            type: 'city',
          };
        }
        cityGroups[city].records.push(r);
      });
      return Object.values(cityGroups);
    } else if (zoomLevel === 'district') {
      // 구/동 단위 그룹핑
      const districtGroups: Record<string, PinData> = {};
      filteredRecords.forEach(r => {
        if (!districtGroups[r.district]) {
          districtGroups[r.district] = {
            id: r.district,
            name: r.district,
            lat: r.lat,
            lng: r.lng,
            records: [],
            type: 'district',
          };
        }
        districtGroups[r.district].records.push(r);
      });
      return Object.values(districtGroups);
    } else {
      // 상세 위치 (개별 장소)
      const placeGroups: Record<string, PinData> = {};
      filteredRecords.forEach(r => {
        if (!placeGroups[r.place]) {
          placeGroups[r.place] = {
            id: r.place,
            name: r.place,
            lat: r.lat,
            lng: r.lng,
            records: [],
            type: 'place',
          };
        }
        placeGroups[r.place].records.push(r);
      });
      return Object.values(placeGroups);
    }
  };

  const pins = getPinsForZoomLevel();

  const handleMapReady = (map: MockMapRef) => {
    mapRef.current = map;
  };

  const handlePinClick = (pin: PinData) => {
    setSelectedPin(pin);
    setActiveCardIdx(0);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
    }
  };

  // 줌 레벨 변경 감지
  useEffect(() => {
    if (!mapRef.current) return;

    const interval = setInterval(() => {
      if (!mapRef.current) return;
      const zoom = mapRef.current.getZoom();

      let newZoomLevel: ZoomLevel;
      if (zoom < 10) {
        newZoomLevel = 'city';
      } else if (zoom < 13) {
        newZoomLevel = 'district';
      } else {
        newZoomLevel = 'detail';
      }

      if (newZoomLevel !== zoomLevel) {
        setZoomLevel(newZoomLevel);
        setSelectedPin(null);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [zoomLevel]);

  const getMapLabel = () => {
    if (zoomLevel === 'city') return '서울 전체';
    if (zoomLevel === 'district') return '구/동 보기';
    return '상세 위치';
  };

  return (
    <div style={{ height: '100dvh', position: 'relative', background: '#F4F6F8' }}>
      {/* Map */}
      <div style={{ position: 'absolute', inset: 0, paddingBottom: 80 }}>
        <MapView
          onMapReady={handleMapReady}
          initialCenter={{ lat: 37.5519, lng: 126.9918 }}
          initialZoom={12}
          className="w-full h-full"
        >
          {/* Render pins */}
          <div className="absolute inset-0 pointer-events-none">
            {pins.map((pin) => {
              const count = pin.records.length;
              const repPhoto = pin.records[0]?.photos[0];

              // 기록 개수에 따른 핀 크기 결정 (강조)
              let pinSize: number;
              if (count >= 10) pinSize = 72;
              else if (count >= 5) pinSize = 64;
              else if (count >= 3) pinSize = 56;
              else pinSize = 48;

              // 위치 계산
              const offsetX = (pin.lng - 126.9918) * 800;
              const offsetY = (37.5519 - pin.lat) * 800;

              return (
                <div
                  key={pin.id}
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handlePinClick(pin)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(1.1)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(1)`;
                  }}
                >
                  <div style={{ position: 'relative', transformOrigin: 'bottom center' }}>
                    {/* Pin Shape - 테라드롭 형태 */}
                    <div
                      style={{
                        width: `${pinSize}px`,
                        height: `${pinSize}px`,
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        border: '3px solid white',
                        overflow: 'hidden',
                        background: count >= 5 ? 'linear-gradient(135deg, #f45d75 0%, #e9334f 100%)' : '#e9334f',
                      }}
                    >
                      {repPhoto ? (
                        <img
                          src={repPhoto}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: 'rotate(45deg) scale(1.4)',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(45deg)',
                          }}
                        >
                          <svg
                            width={pinSize * 0.4}
                            height={pinSize * 0.4}
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" fill="white" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Count Badge */}
                    {count > 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: count >= 5 ? 'linear-gradient(135deg, #f45d75 0%, #e9334f 100%)' : '#e9334f',
                          color: 'white',
                          borderRadius: '50%',
                          width: count >= 10 ? '28px' : '24px',
                          height: count >= 10 ? '28px' : '24px',
                          fontSize: count >= 10 ? '13px' : '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid white',
                          fontFamily: "'Pretendard Variable', sans-serif",
                          boxShadow: '0 2px 8px rgba(233, 51, 79, 0.3)',
                        }}
                      >
                        {count}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </MapView>
      </div>

      {/* Overlay when pin selected */}
      {selectedPin && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 20,
            paddingBottom: 80,
          }}
          onClick={() => setSelectedPin(null)}
        />
      )}

      {/* Top labels */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 0,
          right: 0,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 15,
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 20,
            padding: '8px 14px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            fontSize: 13,
            fontWeight: 600,
            color: '#191F28',
          }}
        >
          {getMapLabel()} · {filteredRecords.length}개 기록
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          style={{
            background: filterType !== 'all' ? 'linear-gradient(135deg, rgba(244, 93, 117, 0.95) 0%, rgba(233, 51, 79, 0.95) 100%)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: 20,
            padding: '8px 14px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            fontSize: 13,
            fontWeight: 600,
            color: filterType !== 'all' ? 'white' : '#191F28',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          필터
        </button>
      </div>

      {/* Filter dropdown */}
      {showFilter && (
        <div
          style={{
            position: 'absolute',
            top: 104,
            right: 16,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            zIndex: 30,
            overflow: 'hidden',
            minWidth: 160,
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          {[
            { id: 'all', label: '전체' },
            { id: 'couple', label: '커플 기록' },
            { id: 'personal', label: '개별 기록' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setFilterType(opt.id as any);
                setShowFilter(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 16px',
                background: filterType === opt.id ? 'linear-gradient(135deg, rgba(244, 93, 117, 0.1) 0%, rgba(233, 51, 79, 0.1) 100%)' : 'transparent',
                border: 'none',
                textAlign: 'left',
                fontSize: 14,
                fontWeight: filterType === opt.id ? 600 : 400,
                color: filterType === opt.id ? '#e9334f' : '#191F28',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Overlay card carousel */}
      {selectedPin && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            zIndex: 25,
            padding: '0 0 8px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px 12px',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              {selectedPin.name} · {selectedPin.records.length}개의 기록
            </span>
            <button
              onClick={() => setSelectedPin(null)}
              style={{
                background: 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Cards */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '0 20px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {selectedPin.records.map((record, i) => (
              <div
                key={record.id}
                style={{
                  flexShrink: 0,
                  width: 200,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transform: i === activeCardIdx ? 'scale(1.03)' : 'scale(0.97)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
                onClick={() => setActiveCardIdx(i)}
              >
                <div style={{ height: 120, overflow: 'hidden' }}>
                  <img
                    src={record.photos[record.representativePhoto] || record.photos[0]}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '12px' }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#191F28',
                      marginBottom: 4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {record.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#8B95A1', marginBottom: 8 }}>
                    {record.visitDate.replace(/-/g, '.')}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/record/${record.id}`);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(244, 93, 117, 0.15) 0%, rgba(233, 51, 79, 0.15) 100%)',
                      color: '#e9334f',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    상세 보기
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicator */}
          {selectedPin.records.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
              {selectedPin.records.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeCardIdx ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === activeCardIdx ? '#e9334f' : 'rgba(255,255,255,0.6)',
                    transition: 'all 0.2s',
                    boxShadow: i === activeCardIdx ? '0 1px 3px rgba(233, 51, 79, 0.3)' : 'none',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
