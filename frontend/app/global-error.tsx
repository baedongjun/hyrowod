"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body style={{ background: "#0a0a0a", color: "#f5f0e8", fontFamily: "'Noto Sans KR', sans-serif" }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "64px 24px",
        }}>
          <p style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(80px, 15vw, 160px)",
            lineHeight: 1,
            color: "rgba(232, 34, 10, 0.08)",
            userSelect: "none",
            margin: 0,
          }}>ERROR</p>
          <p style={{
            fontFamily: "'Black Han Sans', sans-serif",
            fontSize: 24,
            color: "#f5f0e8",
            marginTop: 16,
            marginBottom: 12,
          }}>치명적인 오류가 발생했습니다</p>
          <p style={{ fontSize: 14, color: "#888888", marginBottom: 40 }}>
            페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#e8220a",
              color: "#f5f0e8",
              border: "none",
              borderRadius: 0,
              padding: "15px 32px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
