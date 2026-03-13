"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { boxApi } from "@/lib/api";
import { Box } from "@/types";
import BoxCard from "@/components/box/BoxCard";
import s from "./page.module.css";

const CITIES = [
  { name: "서울", count: "120+" },
  { name: "경기", count: "80+" },
  { name: "부산", count: "45+" },
  { name: "인천", count: "30+" },
  { name: "대구", count: "25+" },
  { name: "대전", count: "20+" },
  { name: "광주", count: "18+" },
  { name: "제주", count: "10+" },
];

const FEATURES = [
  {
    title: "지역별 박스 검색",
    desc: "카카오맵 기반으로 내 주변 크로스핏 박스를 지도에서 바로 찾아보세요.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    title: "수업 시간표",
    desc: "박스별 수업 시간표를 요일 기준으로 한눈에 확인하세요.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="0"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="4" x2="9" y2="22"/>
      </svg>
    ),
  },
  {
    title: "오늘의 WOD",
    desc: "매일 업데이트되는 WOD를 확인하고 기록을 남겨보세요.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    title: "대회 일정",
    desc: "전국 크로스핏 대회 정보를 한곳에서 확인하고 접수하세요.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 21h8m-4-4v4M5 3h14l1 7H4L5 3zM4 10c0 4.418 3.582 8 8 8s8-3.582 8-8"/>
      </svg>
    ),
  },
];

const STATS = [
  { num: "300+",  label: "등록 박스" },
  { num: "17",    label: "서비스 지역" },
  { num: "5,000+",label: "커뮤니티 회원" },
  { num: "매일",  label: "WOD 업데이트" },
];

export default function HomePage() {
  const { data: premiumBoxes } = useQuery({
    queryKey: ["premium-boxes"],
    queryFn: async () => (await boxApi.getPremium()).data.data as Box[],
  });

  return (
    <>
      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroGlow} />
        <div className={s.heroContent}>
          <div className={s.heroEyebrow}>
            <span className={s.heroDot} />
            <span className={s.heroEyebrowText}>Korea&apos;s #1 CrossFit Platform</span>
          </div>
          <h1 className={s.heroTitle}>
            CROSSFIT
            <span className={s.heroTitleRed}>KOREA</span>
          </h1>
          <p className={s.heroSub}>대한민국 크로스핏 커뮤니티</p>
          <p className={s.heroDesc}>
            전국 크로스핏 박스를 지도에서 찾고,<br />
            시간표·코치·후기를 한눈에 확인하세요.<br />
            오늘의 WOD와 대회 일정도 제공합니다.
          </p>
          <div className={s.heroCta}>
            <Link href="/boxes" className="btn-primary">박스 찾기</Link>
            <Link href="/wod"   className="btn-secondary">오늘의 WOD</Link>
          </div>
        </div>
        <span className={s.heroBg} aria-hidden="true">CROSSFIT</span>
      </section>

      {/* Stats */}
      <div className={s.stats}>
        <div className={s.statsGrid}>
          {STATS.map((s2) => (
            <div key={s2.label} className={`${s.statItem} fade-in`}>
              <p className={s.statNum}>{s2.num}</p>
              <p className={s.statLabel}>{s2.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Boxes */}
      {premiumBoxes && premiumBoxes.length > 0 && (
        <section className={s.premium}>
          <div className={s.premiumInner}>
            <div className={s.premiumHeader}>
              <div>
                <p className="section-tag">FEATURED</p>
                <h2 className="section-title">
                  프리미엄<br /><span>박스</span>
                </h2>
              </div>
              <Link href="/boxes?premium=true" className={s.viewAll}>전체 보기</Link>
            </div>
            <div className={s.premiumGrid}>
              {premiumBoxes.slice(0, 3).map((box) => (
                <BoxCard key={box.id} box={box} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cities */}
      <section className={s.cities}>
        <div className={s.citiesInner}>
          <div className={s.citiesHeader}>
            <div>
              <p className="section-tag">지역별 검색</p>
              <h2 className="section-title">
                가까운 박스를<br /><span>찾아보세요</span>
              </h2>
            </div>
            <Link href="/boxes" className={s.viewAll}>전체 보기</Link>
          </div>

          <div className={s.cityGrid}>
            {CITIES.map((city) => (
              <Link
                key={city.name}
                href={`/boxes?city=${city.name}`}
                className={s.cityCard}
              >
                <p className={s.cityName}>{city.name}</p>
                <p className={s.cityCount}>{city.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={s.features}>
        <div className={s.featuresInner}>
          <div>
            <p className="section-tag">서비스 소개</p>
            <h2 className="section-title">
              CrossFit Korea에서<br /><span>할 수 있는 것</span>
            </h2>
          </div>

          <div className={s.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={`${s.featureCard} fade-in`}>
                <div className={s.featureIcon}>{f.icon}</div>
                <h3 className={s.featureTitle}>{f.title}</h3>
                <p className={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={s.cta}>
        <div className={s.ctaInner}>
          <h2 className={s.ctaTitle}>
            박스를<br />운영하고 계신가요?
          </h2>
          <p className={s.ctaDesc}>
            CrossFit Korea에 박스를 등록하고 더 많은 회원과 연결되세요.<br />
            프리미엄 노출로 더 높은 가시성을 확보하세요.
          </p>
          <div className={s.ctaButtons}>
            <Link href="/signup"    className="btn-primary">무료 박스 등록</Link>
            <Link href="/advertise" className="btn-secondary">프리미엄 광고 문의</Link>
          </div>
        </div>
      </section>
    </>
  );
}
