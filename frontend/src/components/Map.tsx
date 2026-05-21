/**
 * LovePin Mock Map Component
 * Simple mock map without Google Maps API dependency
 */
import { useEffect, useRef, useState, type ReactNode, type MouseEvent, type WheelEvent } from 'react';

import { cn } from '@/lib/utils';

export interface MockMapRef {
  panTo: (position: { lat: number; lng: number }) => void;
  getCenter: () => { lat: number; lng: number };
  getZoom: () => number;
  setZoom: (zoom: number) => void;
}

interface MapViewProps {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMapReady?: (mapRef: MockMapRef) => void;
  children?: ReactNode;
}

export function MapView({
  className,
  initialCenter = { lat: 37.5519, lng: 126.9918 },
  initialZoom = 12,
  onMapReady,
  children,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    centerLat: number;
    centerLng: number;
  } | null>(null);

  useEffect(() => {
    if (onMapReady) {
      const mockMapRef: MockMapRef = {
        panTo: (position) => setCenter(position),
        getCenter: () => center,
        getZoom: () => zoom,
        setZoom: (z) => setZoom(z),
      };
      onMapReady(mockMapRef);
    }
  }, [center, onMapReady, zoom]);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      centerLat: center.lat,
      centerLng: center.lng,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const latDelta = -deltaY * 0.0001 * (15 - zoom);
    const lngDelta = deltaX * 0.0001 * (15 - zoom);

    setCenter({
      lat: dragStartRef.current.centerLat + latDelta,
      lng: dragStartRef.current.centerLng + lngDelta,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.5 : 0.5;
    setZoom((prev) => Math.max(8, Math.min(16, prev + delta)));
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden select-none', className)}
      style={{
        background: 'linear-gradient(135deg, #f5f3f0 0%, #e8e6e3 100%)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="map-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${zoom / 12})`}
          >
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#999" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </svg>

      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              border: '1px solid #999',
              left: `${20 + i * 12}%`,
              top: `${15 + i * 8}%`,
              transform: `scale(${zoom / 12})`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoom / 12}) translate(${(center.lng - initialCenter.lng) * 100}px, ${(initialCenter.lat - center.lat) * 100}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.min(16, prev + 1));
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ fontSize: '20px', fontWeight: 'bold', color: '#191F28' }}
        >
          +
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoom((prev) => Math.max(8, prev - 1));
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ fontSize: '20px', fontWeight: 'bold', color: '#191F28' }}
        >
          −
        </button>
      </div>
    </div>
  );
}
