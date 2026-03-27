import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/components/providers/QueryProvider";
import FadeInObserver from "@/components/common/FadeInObserver";
import ServiceWorkerRegistrar from "@/components/common/ServiceWorkerRegistrar";
import InstallPwa from "@/components/common/InstallPwa";

const SITE_DESCRIPTION =
  "전국 크로스핏 박스 검색·WOD 기록·대회 신청·커뮤니티·챌린지까지. 대한민국 크로스핏 올인원 플랫폼.";

export const metadata: Metadata = {
  title: {
    default: "HyroWOD | 대한민국 크로스핏 커뮤니티 플랫폼",
    template: "%s | HyroWOD",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "크로스핏", "CrossFit", "크로스핏 박스", "WOD", "크로스핏 대회",
    "한국 크로스핏", "크로스핏 커뮤니티", "크로스핏 챌린지", "운동 기록",
    "박스 찾기", "크로스핏 시간표", "HyroWOD",
  ],
  metadataBase: new URL("https://hyrowod.com"),
  icons: {
    icon: "/hyrowod-icon.png",
    apple: "/hyrowod-icon.png",
  },
  openGraph: {
    title: "HyroWOD | 대한민국 크로스핏 커뮤니티 플랫폼",
    description: SITE_DESCRIPTION,
    siteName: "HyroWOD",
    url: "https://hyrowod.com",
    locale: "ko_KR",
    type: "website",
    // images: opengraph-image.tsx 파일에서 자동 생성 (Next.js 파일 기반 메타데이터)
  },
  twitter: {
    card: "summary_large_image",
    title: "HyroWOD | 대한민국 크로스핏 커뮤니티 플랫폼",
    description: SITE_DESCRIPTION,
    // images: opengraph-image.tsx 파일에서 자동 생성
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Black+Han+Sans&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="HyroWOD 커뮤니티" href="/feed.xml" />
        <meta name="theme-color" content="#e8220a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <QueryProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
          <FadeInObserver />
          <ServiceWorkerRegistrar />
          <InstallPwa />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
            toastStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 0 }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
