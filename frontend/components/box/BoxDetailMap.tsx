"use client";

import { useEffect, useRef, useState } from "react";

interface BoxDetailMapProps {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export default function BoxDetailMap({ name, address, latitude, longitude }: BoxDetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [geocodeFailed, setGeocodeFailed] = useState(false);
  const hasCoords = !!(latitude && longitude);

  useEffect(() => {
    if (!hasCoords && !address) return;

    // 좌표 → 지도 생성
    const createMap = (lat: number, lng: number) => {
      if (!mapRef.current) return;
      const latlng = new window.kakao.maps.LatLng(lat, lng);
      const map = new window.kakao.maps.Map(mapRef.current, { center: latlng, level: 4 });
      new window.kakao.maps.Marker({ map, position: latlng, title: name });
    };

    // SDK 초기화 완료 후 실행 로직
    const doInit = () => {
      if (hasCoords) {
        createMap(latitude, longitude);
      } else if (address && window.kakao?.maps?.services) {
        // 주소 → 좌표 변환 (Geocoder)
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: { x: string; y: string }[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
            createMap(parseFloat(result[0].y), parseFloat(result[0].x));
          } else {
            setGeocodeFailed(true);
          }
        });
      } else {
        setGeocodeFailed(true);
      }
    };

    const initMap = () => {
      if (!window.kakao?.maps) return;
      // Map 생성자가 있으면 완전히 로드된 상태
      if (window.kakao.maps.Map) {
        doInit();
      } else {
        window.kakao.maps.load(doInit);
      }
    };

    // SDK 이미 로드된 경우
    if (window.kakao?.maps) {
      initMap();
      return;
    }

    // 이미 삽입된 스크립트가 있으면 load 이벤트 대기
    const existing = document.querySelector(`script[src*="dapi.kakao.com"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", initMap);
      return () => existing.removeEventListener("load", initMap);
    }

    // 새 스크립트 로드 (services 라이브러리 포함 — 주소→좌표 변환용)
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, [latitude, longitude, address, name, hasCoords]);

  // 완전히 실패한 경우 (주소도 없거나 geocode 실패)
  if (geocodeFailed || (!hasCoords && !address)) {
    return (
      <div style={{
        height: 180,
        background: "var(--bg-card-2)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>지도 정보를 불러올 수 없습니다</p>
        {address && (
          <a
            href={`https://map.kakao.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "var(--red)", textDecoration: "none", fontWeight: 700 }}
          >
            카카오맵에서 검색 →
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: 200, border: "1px solid var(--border)", background: "var(--bg-card-2)" }}
      />
      <a
        href={`https://map.kakao.com/?q=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          padding: "8px",
          fontSize: 12,
          color: "var(--muted)",
          border: "1px solid var(--border)",
          borderTop: "none",
          background: "var(--bg-card-2)",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
      >
        카카오맵에서 보기 →
      </a>
    </div>
  );
}
