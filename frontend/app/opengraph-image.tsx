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
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 상단 레드 라인 */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#e8220a" }} />
        {/* 하단 레드 라인 */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "#e8220a" }} />

        {/* 배경 격자 패턴 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* 왼쪽: 아이콘 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 420,
            height: 420,
            background: "#111111",
            border: "2px solid rgba(255,255,255,0.08)",
            marginRight: 80,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* CFK 텍스트 */}
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: "#f5f0e8",
              letterSpacing: 10,
              lineHeight: 1,
              marginBottom: 24,
            }}
          >
            CFK
          </div>

          {/* 바벨 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
            {/* 왼쪽 원판 */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#e8220a",
              }}
            />
            {/* 왼쪽 칼라 */}
            <div style={{ width: 14, height: 22, background: "#c01a08" }} />
            {/* 바 */}
            <div style={{ width: 120, height: 12, background: "#e8220a" }} />
            {/* 오른쪽 칼라 */}
            <div style={{ width: 14, height: 22, background: "#c01a08" }} />
            {/* 오른쪽 원판 */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#e8220a",
              }}
            />
          </div>

          {/* CROSSFIT */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#f5f0e8",
              letterSpacing: 8,
              marginTop: 24,
            }}
          >
            CROSSFIT
          </div>
          {/* KOREA */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#e8220a",
              letterSpacing: 8,
            }}
          >
            KOREA
          </div>
        </div>

        {/* 오른쪽: 텍스트 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {/* 상단 레드 포인트 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ width: 40, height: 3, background: "#e8220a" }} />
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#e8220a",
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              한국 No.1 크로스핏 플랫폼
            </div>
          </div>

          {/* 메인 타이틀 */}
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "#f5f0e8",
              lineHeight: 1.1,
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            CROSSFIT
            <br />
            <span style={{ color: "#e8220a" }}>KOREA</span>
          </div>

          {/* 구분선 */}
          <div style={{ width: 60, height: 3, background: "#e8220a", marginBottom: 20 }} />

          {/* 설명 */}
          <div
            style={{
              fontSize: 20,
              color: "#888888",
              lineHeight: 1.6,
              marginBottom: 32,
              maxWidth: 460,
            }}
          >
            전국 크로스핏 박스 검색
            {"\n"}WOD 기록 · 대회 신청 · 커뮤니티
          </div>

          {/* URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8220a" }} />
            <div
              style={{
                fontSize: 18,
                color: "#f5f0e8",
                letterSpacing: 2,
                opacity: 0.7,
              }}
            >
              crossfitkorea.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
