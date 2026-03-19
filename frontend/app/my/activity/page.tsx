"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { wodRecordApi, communityApi, badgeApi, competitionApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { WodRecord, Post, Badge } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import s from "./activity.module.css";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface ActivityItem {
  type: "wod" | "post" | "badge" | "competition";
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  link?: string;
  badge?: string;
  rx?: boolean;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  wod: {
    label: "WOD 기록",
    color: "var(--red)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67z"/>
      </svg>
    ),
  },
  post: {
    label: "게시글",
    color: "#3b82f6",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
  badge: {
    label: "배지 획득",
    color: "#eab308",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  competition: {
    label: "대회 신청",
    color: "#a855f7",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="8 6 2 12 8 18"/><path d="M2 12h20"/><polyline points="16 6 22 12 16 18"/>
      </svg>
    ),
  },
};

export default function MyActivityPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, [router]);

  const { data: recentWod } = useQuery({
    queryKey: ["wod", "records", "recent", 90],
    queryFn: async () => (await wodRecordApi.getRecentRecords(90)).data.data as WodRecord[],
    enabled: isLoggedIn(),
  });

  const { data: myPosts } = useQuery({
    queryKey: ["posts", "mine", 0],
    queryFn: async () => (await communityApi.getMyPosts(0)).data.data,
    enabled: isLoggedIn(),
  });

  const { data: myBadges } = useQuery({
    queryKey: ["badges", "mine"],
    queryFn: async () => (await badgeApi.getMyBadges()).data.data as Badge[],
    enabled: isLoggedIn(),
  });

  const { data: myComps } = useQuery({
    queryKey: ["competitions", "mine"],
    queryFn: async () => (await competitionApi.getMyRegistrations()).data.data,
    enabled: isLoggedIn(),
  });

  // Merge and sort all activities
  const activities: ActivityItem[] = [];

  recentWod?.forEach((r: WodRecord) => {
    activities.push({
      type: "wod",
      id: r.id,
      title: r.wodTitle ? `${r.wodTitle} WOD 기록` : "WOD 기록",
      subtitle: r.score ? `기록: ${r.score}${r.rx ? " (RX)" : ""}` : r.rx ? "RX 완료" : "기록 완료",
      date: r.wodDate,
      link: "/wod/records",
      rx: r.rx,
    });
  });

  myPosts?.content?.forEach((p: Post) => {
    activities.push({
      type: "post",
      id: p.id,
      title: p.title,
      subtitle: `좋아요 ${p.likeCount} · 댓글 ${p.commentCount}`,
      date: p.createdAt,
      link: `/community/${p.id}`,
    });
  });

  myBadges?.slice(0, 20).forEach((b: Badge) => {
    activities.push({
      type: "badge",
      id: b.id,
      title: b.name,
      subtitle: b.description,
      date: b.awardedAt,
      badge: b.tier,
    });
  });

  // Competition registrations
  if (Array.isArray(myComps)) {
    myComps.slice(0, 10).forEach((c: { id: number; name: string; startDate: string; status: string }) => {
      activities.push({
        type: "competition",
        id: c.id,
        title: c.name,
        subtitle: `${dayjs(c.startDate).format("YYYY.MM.DD")} · ${c.status}`,
        date: c.startDate,
        link: `/competitions/${c.id}`,
      });
    });
  }

  // Sort by date desc
  activities.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

  // Group by month
  const grouped: Record<string, ActivityItem[]> = {};
  activities.forEach((item) => {
    const key = dayjs(item.date).format("YYYY년 MM월");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const BADGE_TIER_COLOR: Record<string, string> = {
    BRONZE: "#cd7f32", SILVER: "#c0c0c0", GOLD: "#eab308", PLATINUM: "#0ea5e9",
  };

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <Link href="/my" className={s.back}>← 마이페이지</Link>
          <h1 className={s.title}>내 활동 기록</h1>
          <p className={s.subtitle}>최근 90일간의 활동 내역</p>
        </div>

        {/* Stats Row */}
        <div className={s.statsRow}>
          <div className={s.statItem}>
            <span className={s.statNum}>{recentWod?.length ?? 0}</span>
            <span className={s.statLabel}>WOD 기록</span>
          </div>
          <div className={s.statItem}>
            <span className={s.statNum}>{myPosts?.totalElements ?? 0}</span>
            <span className={s.statLabel}>게시글</span>
          </div>
          <div className={s.statItem}>
            <span className={s.statNum}>{myBadges?.length ?? 0}</span>
            <span className={s.statLabel}>배지</span>
          </div>
          <div className={s.statItem}>
            <span className={s.statNum}>{Array.isArray(myComps) ? myComps.length : 0}</span>
            <span className={s.statLabel}>대회 신청</span>
          </div>
        </div>

        {/* Timeline */}
        {activities.length === 0 ? (
          <div className={s.empty}>
            <p>최근 활동이 없습니다.</p>
            <Link href="/wod" className={s.emptyLink}>WOD 기록 시작하기 →</Link>
          </div>
        ) : (
          <div className={s.timeline}>
            {Object.entries(grouped).map(([month, items]) => (
              <div key={month} className={s.monthGroup}>
                <div className={s.monthLabel}>{month}</div>
                <div className={s.itemList}>
                  {items.map((item, idx) => {
                    const config = TYPE_CONFIG[item.type];
                    return (
                      <div key={`${item.type}-${item.id}-${idx}`} className={s.timelineItem}>
                        <div className={s.dot} style={{ background: config.color }} />
                        <div className={s.itemContent}>
                          <div className={s.itemHeader}>
                            <span className={s.typeTag} style={{ color: config.color, background: `${config.color}15`, borderColor: `${config.color}30` }}>
                              {config.icon}
                              {config.label}
                            </span>
                            <span className={s.itemDate}>{dayjs(item.date).fromNow()}</span>
                          </div>
                          {item.link ? (
                            <Link href={item.link} className={s.itemTitle}>{item.title}</Link>
                          ) : (
                            <p className={s.itemTitle}>{item.title}</p>
                          )}
                          {item.subtitle && (
                            <p className={s.itemSubtitle} style={item.badge ? { color: BADGE_TIER_COLOR[item.badge] } : {}}>
                              {item.subtitle}
                            </p>
                          )}
                          {item.rx && <span className={s.rxBadge}>RX</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
