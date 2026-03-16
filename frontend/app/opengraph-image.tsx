import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CrossFit Korea - 한국 크로스핏 박스 검색 플랫폼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        {/* 배경 레드 라인 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#e8220a",
          }}
        />
        {/* 로고 */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: "#f5f0e8",
            letterSpacing: 8,
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          CROSSFIT KOREA
        </div>
        {/* 서브타이틀 */}
        <div
          style={{
            fontSize: 28,
            color: "#888888",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 48,
          }}
        >
          한국 크로스핏 박스 검색 플랫폼
        </div>
        {/* 설명 */}
        <div
          style={{
            fontSize: 20,
            color: "#f5f0e8",
            opacity: 0.7,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          전국 크로스핏 박스를 지도로 검색하고, 시간표와 후기, 코치 정보를 한눈에 확인하세요.
        </div>
        {/* 하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "#e8220a",
            letterSpacing: 2,
          }}
        >
          crossfitkorea.com
        </div>
        {/* 하단 레드 라인 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#e8220a",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
