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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openInfoRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plainMarkersRef = useRef<any[]>([]);

  const boxesRef = useRef<Box[]>(boxes);
  boxesRef.current = boxes;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildMarker = (box: Box, lat: number, lng: number, map: any) => {
    const color = box.premium ? "#ff6b1a" : box.verified ? "#e8220a" : "#888888";

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(lat, lng),
      title: box.name,
    });

    const badgeHtml = box.premium
      ? `<span style="background:#ff6b1a;color:#fff;font-size:10px;font-weight:700;padding:1px 5px;white-space:nowrap">PREMIUM</span>`
      : box.verified
      ? `<span style="background:#e8220a;color:#fff;font-size:10px;font-weight:700;padding:1px 5px;white-space:nowrap">인증</span>`
      : "";

    const ratingHtml = box.rating
      ? `<span style="color:#eab308;font-size:12px">★</span><span style="color:#aaa;font-size:12px"> ${Number(box.rating).toFixed(1)}</span>`
      : "";

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `
        <div style="
          background:#1a1a1a;
          border:1px solid rgba(255,255,255,0.12);
          border-top:3px solid ${color};
          padding:10px 12px;
          min-width:160px;
          max-width:200px;
          font-family:sans-serif;
        ">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;margin-bottom:4px">
            <span style="font-size:13px;font-weight:700;color:#f5f0e8;line-height:1.3">${box.name}</span>
            ${badgeHtml}
          </div>
          <p style="font-size:11px;color:#888;margin:0 0 8px">${box.city} ${box.district}</p>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span>${ratingHtml}</span>
            <a href="/boxes/${box.id}" style="font-size:11px;color:${color};font-weight:700;text-decoration:none">상세 보기 →</a>
          </div>
        </div>`,
      removable: true,
    });

    window.kakao.maps.event.addListener(marker, "click", () => {
      if (openInfoRef.current && openInfoRef.current !== infoWindow) {
        openInfoRef.current.close();
      }
      infoWindow.open(map, marker);
      openInfoRef.current = infoWindow;
    });

    return marker;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addMarkersToMap = (markers: any[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (clustererRef.current) {
      clustererRef.current.clear();
      clustererRef.current.addMarkers(markers);
    } else {
      plainMarkersRef.current.forEach((m) => m.setMap(null));
      plainMarkersRef.current = markers;
      markers.forEach((m) => m.setMap(map));
    }
  };

  // 박스 배열을 받아 마커 생성 (좌표 없는 박스는 주소로 지오코딩)
  const updateMarkers = (bxs: Box[]) => {
    const map = mapInstanceRef.current;
    if (!map || bxs.length === 0) return;

    // 좌표 있는 박스 → 바로 마커 생성
    const markers = bxs
      .filter((b) => b.latitude && b.longitude)
      .map((b) => buildMarker(b, b.latitude, b.longitude, map));

    // 좌표 없는 박스 → 주소로 지오코딩
    const noCoordBoxes = bxs.filter((b) => !b.latitude || !b.longitude);

    if (noCoordBoxes.length === 0) {
      addMarkersToMap(markers);
      return;
    }

    // services 라이브러리 확인
    if (!window.kakao?.maps?.services?.Geocoder) {
      addMarkersToMap(markers);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    let pending = noCoordBoxes.length;

    noCoordBoxes.forEach((box) => {
      if (!box.address) {
        pending--;
        if (pending === 0) addMarkersToMap(markers);
        return;
      }

      geocoder.addressSearch(
        box.address,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result: any[], status: string) => {
          if (
            status === window.kakao.maps.services.Status.OK &&
            result.length > 0
          ) {
            const lat = parseFloat(result[0].y);
            const lng = parseFloat(result[0].x);
            markers.push(buildMarker(box, lat, lng, map));
          }
          pending--;
          if (pending === 0) addMarkersToMap(markers);
        }
      );
    });
  };

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 10,
    });
    mapInstanceRef.current = map;

    if (window.kakao.maps.MarkerClusterer) {
      const clusterer = new window.kakao.maps.MarkerClusterer({
        map,
        averageCenter: true,
        minLevel: 6,
        disableClickZoom: false,
        styles: [{
          width: "46px",
          height: "46px",
          background: "rgba(232,34,10,0.85)",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          lineHeight: "46px",
          fontSize: "13px",
          borderRadius: "23px",
        }],
      });
      clustererRef.current = clusterer;
    }

    updateMarkers(boxesRef.current);
  };

  useEffect(() => {
    const load = () => {
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

    const existing = document.querySelector(`script[src*="dapi.kakao.com/v2/maps"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", load);
      return () => existing.removeEventListener("load", load);
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = load;

    return () => {
      mapInstanceRef.current = null;
      clustererRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateMarkers(boxes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxes]);

  const verifiedCount = boxes.filter((b) => b.verified && !b.premium).length;
  const premiumCount = boxes.filter((b) => b.premium).length;
  const totalCount = boxes.length;

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
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#888", textTransform: "uppercase", margin: "0 0 4px" }}>
            총 {totalCount}개 박스
          </p>
          {premiumCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff6b1a", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#f5f0e8" }}>프리미엄 ({premiumCount})</span>
            </div>
          )}
          {verifiedCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e8220a", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#f5f0e8" }}>인증 ({verifiedCount})</span>
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
