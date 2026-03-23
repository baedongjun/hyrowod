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

  // 마커를 boxes에 맞게 갱신
  const updateMarkers = (boxes: Box[]) => {
    const clusterer = clustererRef.current;
    const map = mapInstanceRef.current;
    if (!clusterer || !map) return;

    clusterer.clear();

    const markers = boxes
      .filter((box) => box.latitude && box.longitude)
      .map((box) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(box.latitude, box.longitude),
          title: box.name,
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px 14px;min-width:160px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.08)">
              <p style="font-family:'Black Han Sans',sans-serif;font-size:14px;color:#f5f0e8;margin:0 0 4px">${box.name}</p>
              <p style="font-size:12px;color:#888;margin:0">${box.address}</p>
              <a href="/boxes/${box.id}" style="display:block;margin-top:8px;font-size:12px;color:#e8220a;font-weight:700;text-decoration:none">상세 보기 →</a>
            </div>
          `,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });

    clusterer.addMarkers(markers);
  };

  // 지도 초기화 (최초 1회)
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

    updateMarkers(boxes);
  };

  // 카카오 SDK 로드 및 지도 초기화 (마운트 시 1회)
  useEffect(() => {
    // 이미 SDK가 로드되어 있으면 바로 초기화
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
      return;
    }

    // 이미 스크립트가 삽입되어 있으면 load 이벤트 대기
    const existing = document.querySelector(`script[src*="dapi.kakao.com/v2/maps"]`);
    if (existing) {
      existing.addEventListener("load", () => window.kakao.maps.load(initMap));
      return;
    }

    // 스크립트 새로 삽입
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => window.kakao.maps.load(initMap);

    return () => {
      // 언마운트 시 지도 인스턴스 해제
      mapInstanceRef.current = null;
      clustererRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // boxes가 바뀔 때 마커만 갱신
  useEffect(() => {
    if (!mapInstanceRef.current || !clustererRef.current) return;
    updateMarkers(boxes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxes]);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "600px", border: "1px solid var(--border)" }}
      />
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
