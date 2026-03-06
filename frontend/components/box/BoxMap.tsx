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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 10,
        });

        boxes.forEach((box) => {
          if (!box.latitude || !box.longitude) return;

          const marker = new window.kakao.maps.Marker({
            map,
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
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
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
