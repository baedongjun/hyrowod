import Link from "next/link";

export default function NotFound() {
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
        fontSize: "clamp(120px, 20vw, 200px)",
        lineHeight: 1,
        color: "rgba(255,255,255,0.04)",
        userSelect: "none",
        marginBottom: 0,
      }}>404</p>
      <p style={{
        fontFamily: "'Black Han Sans', sans-serif",
        fontSize: 28,
        color: "var(--text)",
        marginTop: 16,
        marginBottom: 12,
      }}>페이지를 찾을 수 없습니다</p>
      <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 40 }}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link href="/" className="btn-primary" style={{ padding: "14px 40px" }}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}
