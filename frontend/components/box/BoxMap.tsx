"use client";

import { useEffect, useRef } from "react";
import { Box } from "@/types";

interface BoxMapProps {
  boxes: Box[];
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export default function BoxMap({ boxes }: BoxMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clustererRef = useRef<any>(null);

  // 항상 최신 boxes를 가리키는 ref — 렌더마다 동기 업데이트
  const boxesRef = useRef<Box[]>(boxes);
  boxesRef.current = boxes;

  // SVG 마커 이미지 생성
  const makeMarkerImage = (color: string, size = 36) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 8}" viewBox="0 0 36 44">
        <circle cx="18" cy="18" r="16" fill="${color}" opacity="0.95"/>
        <circle cx="18" cy="18" r="10" fill="white" opacity="0.25"/>
        <text x="18" y="23" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="13" fill="white" font-weight="bold">CF</text>
        <polygon points="12,32 24,32 18,42" fill="${color}" opacity="0.95"/>
      </svg>`.trim();
    const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return new window.kakao.maps.MarkerImage(
      encoded,
      new window.kakao.maps.Size(size, size + 8),
      { offset: new window.kakao.maps.Point(size / 2, size + 8) }
    );
  };

  // 마커 갱신
  const updateMarkers = (bxs: Box[]) => {
    const clusterer = clustererRef.current;
    const map = mapInstanceRef.current;
    if (!clusterer || !map) return;

    clusterer.clear();

    const markers = bxs
      .filter((box) => box.latitude && box.longitude)
      .map((box) => {
        // premium: 오렌지, verified: 레드, 일반: 회색
        const color = box.premium ? "#ff6b1a" : box.verified ? "#e8220a" : "#555555";
        const markerImage = makeMarkerImage(color);

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(box.latitude, box.longitude),
          title: box.name,
          image: markerImage,
        });

        const badgeHtml = box.premium
          ? `<span style="display:inline-block;background:#ff6b1a;color:#fff;font-size:10px;font-weight:700;padding:1px 6px;margin-left:6px;vertical-align:middle">PREMIUM</span>`
          : box.verified
          ? `<span style="display:inline-block;background:#e8220a;color:#fff;font-size:10px;font-weight:700;padding:1px 6px;margin-left:6px;vertical-align:middle">인증</span>`
          : "";

        const ratingHtml = box.rating
          ? `<span style="font-size:12px;color:#eab308;margin-right:4px">★</span><span style="font-size:12px;color:#888">${Number(box.rating).toFixed(1)}</span>`
          : "";

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:12px 14px;min-width:180px;max-width:220px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-top:3px solid ${color}">
              <p style="font-family:'Black Han Sans',sans-serif;font-size:14px;color:#f5f0e8;margin:0 0 2px;display:flex;align-items:center;flex-wrap:wrap;gap:4px">
                ${box.name}${badgeHtml}
              </p>
              <p style="font-size:12px;color:#888;margin:0 0 6px">${box.city} ${box.district}</p>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div>${ratingHtml}</div>
                <a href="/boxes/${box.id}" style="font-size:12px;color:${color};font-weight:700;text-decoration:none">상세 보기 →</a>
              </div>
            </div>
          `,
          removable: true,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });

    clusterer.addMarkers(markers);
  };

  // 지도 초기화 — boxesRef.current로 항상 최신 boxes 사용
  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 10,
    });
    mapInstanceRef.current = map;

    const clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 6,
      disableClickZoom: false,
      styles: [{
        width: "53px",
        height: "52px",
        background: "rgba(232, 34, 10, 0.8)",
        color: "#f5f0e8",
        textAlign: "center",
        fontWeight: "bold",
        lineHeight: "52px",
        fontSize: "14px",
      }],
    });
    clustererRef.current = clusterer;

    // 클로저의 stale boxes 대신 ref로 최신 boxes 사용
    updateMarkers(boxesRef.current);
  };

  // 카카오 SDK 로드 및 지도 초기화 (마운트 시 1회)
  useEffect(() => {
    const load = () => {
      // maps.Map이 이미 존재하면 완전히 로드된 상태 → 직접 초기화
      if (window.kakao.maps.Map) {
        initMap();
      } else {
        window.kakao.maps.load(initMap);
      }
    };

    if (window.kakao && window.kakao.maps) {
      load();
      return;
    }

    // 이미 다른 페이지에서 스크립트가 삽입돼 있으면 load 이벤트 대기
    const existing = document.querySelector(`script[src*="dapi.kakao.com/v2/maps"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", load);
      return () => existing.removeEventListener("load", load);
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = load;

    return () => {
      mapInstanceRef.current = null;
      clustererRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // boxes 변경 시 마커 갱신
  useEffect(() => {
    updateMarkers(boxes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxes]);

  const verifiedCount = boxes.filter((b) => b.verified && !b.premium).length;
  const premiumCount = boxes.filter((b) => b.premium).length;
  const hasCoords = boxes.filter((b) => b.latitude && b.longitude).length;

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "600px", border: "1px solid var(--border)" }}
      />

      {/* 마커 범례 */}
      {boxes.length > 0 && (
        <div style={{
          position: "absolute", bottom: 12, left: 12, zIndex: 10,
          background: "rgba(10,10,10,0.88)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "8px 12px",
          display: "flex", flexDirection: "column", gap: 4,
          backdropFilter: "blur(4px)",
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 4px" }}>
            마커 범례 · 총 {hasCoords}개
          </p>
          {premiumCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff6b1a", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#f5f0e8" }}>프리미엄 박스 ({premiumCount})</span>
            </div>
          )}
          {verifiedCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e8220a", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#f5f0e8" }}>인증 박스 ({verifiedCount})</span>
            </div>
          )}
        </div>
      )}

      {boxes.length === 0 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--bg-card)",
        }}>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}
