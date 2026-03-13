"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import s from "./dashboard.module.css";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await adminApi.getDashboard();
      return res.data.data as {
        totalUsers: number;
        totalBoxes: number;
        totalPosts: number;
        totalCompetitions: number;
      };
    },
  });

  const stats = [
    {
      label: "총 박스 수",
      value: data?.totalBoxes ?? 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      label: "총 회원 수",
      value: data?.totalUsers ?? 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      label: "커뮤니티 게시글",
      value: data?.totalPosts ?? 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
    {
      label: "등록된 대회",
      value: data?.totalCompetitions ?? 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="8 6 2 12 8 18"/><path d="M2 12h20"/><polyline points="16 6 22 12 16 18"/>
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className={s.pageTitle}>대시보드</h1>

      <div className={s.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={s.statCard}>
            <div className={s.statIcon}>{stat.icon}</div>
            <div>
              <p className={s.statLabel}>{stat.label}</p>
              <p className={s.statValue}>
                {isLoading ? "—" : stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={s.bottomGrid}>
        <div className={s.panel}>
          <p className={s.panelTitle}>빠른 작업</p>
          <div className={s.quickLinks}>
            <a href="/admin/boxes" className={s.quickLink}>박스 인증 처리 →</a>
            <a href="/admin/wod" className={s.quickLink}>오늘의 WOD 등록 →</a>
            <a href="/admin/competitions" className={s.quickLink}>대회 일정 등록 →</a>
          </div>
        </div>

        <div className={s.panel}>
          <p className={s.panelTitle}>서비스 현황</p>
          <div className={s.statusList}>
            <div className={s.statusRow}>
              <span>API 서버</span>
              <span className={s.statusOk}><span className={s.statusDot} />정상</span>
            </div>
            <div className={s.statusRow}>
              <span>데이터베이스</span>
              <span className={s.statusOk}><span className={s.statusDot} />정상</span>
            </div>
            <div className={s.statusRow}>
              <span>Redis 캐시</span>
              <span className={s.statusOk}><span className={s.statusDot} />정상</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
