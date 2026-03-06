"use client";

import { useEffect } from "react";

export default function Error({
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
    <div style={{
      paddingTop: 64,
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
      }}>ERROR</p>
      <p style={{
        fontFamily: "'Black Han Sans', sans-serif",
        fontSize: 24,
        color: "var(--text)",
        marginTop: 16,
        marginBottom: 12,
      }}>오류가 발생했습니다</p>
      <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 40 }}>
        일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-primary" onClick={reset} style={{ padding: "12px 32px" }}>
          다시 시도
        </button>
        <a href="/" className="btn-secondary" style={{ padding: "12px 32px" }}>
          홈으로
        </a>
      </div>
    </div>
  );
}
