"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { userApi, badgeApi } from "@/lib/api";
import { Badge } from "@/types";
import dayjs from "dayjs";
import s from "./profile.module.css";

const ROLE_LABEL: Record<string, string> = {
  ROLE_USER: "회원",
  ROLE_BOX_OWNER: "박스 오너",
  ROLE_ADMIN: "관리자",
};

const TIER_COLOR: Record<string, string> = {
  BRONZE: "#cd7f32",
  SILVER: "#c0c0c0",
  GOLD: "#eab308",
  PLATINUM: "#0ea5e9",
};

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user", userId, "profile"],
    queryFn: async () => (await userApi.getPublicProfile(userId)).data.data,
  });

  const { data: badges } = useQuery({
    queryKey: ["badges", "user", userId],
    queryFn: async () => (await badgeApi.getUserBadges(userId)).data.data as Badge[],
  });

  if (isLoading) {
    return (
      <div className={s.page}>
        <div className={s.inner}>
          <div className={s.skeleton} style={{ height: 200 }} />
        </div>
      </div>
    );
  }
  if (!profile) return null;

  const platinumBadges = badges?.filter((b) => b.tier === "PLATINUM") ?? [];
  const goldBadges = badges?.filter((b) => b.tier === "GOLD") ?? [];
  const silverBadges = badges?.filter((b) => b.tier === "SILVER") ?? [];
  const bronzeBadges = badges?.filter((b) => b.tier === "BRONZE") ?? [];

  return (
    <div className={s.page}>
      <div className={s.inner}>
        {/* Profile Header */}
        <div className={s.profileCard}>
          <div className={s.avatarWrap}>
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt={profile.name} className={s.avatar} />
            ) : (
              <div className={s.avatarFallback}>{profile.name?.[0] || "?"}</div>
            )}
          </div>
          <div className={s.profileInfo}>
            <h1 className={s.name}>{profile.name}</h1>
            <span className={`badge badge-default`}>
              {ROLE_LABEL[profile.role] || profile.role}
            </span>
          </div>
          {badges && badges.length > 0 && (
            <div className={s.badgeSummary}>
              {platinumBadges.length > 0 && (
                <div className={s.tierCount} style={{ color: TIER_COLOR.PLATINUM }}>
                  <span>💠</span> {platinumBadges.length}
                </div>
              )}
              {goldBadges.length > 0 && (
                <div className={s.tierCount} style={{ color: TIER_COLOR.GOLD }}>
                  <span>🥇</span> {goldBadges.length}
                </div>
              )}
              {silverBadges.length > 0 && (
                <div className={s.tierCount} style={{ color: TIER_COLOR.SILVER }}>
                  <span>🥈</span> {silverBadges.length}
                </div>
              )}
              {bronzeBadges.length > 0 && (
                <div className={s.tierCount} style={{ color: TIER_COLOR.BRONZE }}>
                  <span>🥉</span> {bronzeBadges.length}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Badges */}
        {badges && badges.length > 0 ? (
          <div className={s.section}>
            <p className={s.sectionTitle}>획득한 배지 <span>{badges.length}개</span></p>
            <div className={s.badgeGrid}>
              {badges.map((badge: Badge) => (
                <div
                  key={badge.id}
                  className={s.badgeItem}
                  style={{ borderColor: `${TIER_COLOR[badge.tier]}40` }}
                >
                  <div className={s.badgeIcon}>
                    {badge.tier === "PLATINUM" ? "💠" :
                     badge.tier === "GOLD" ? "🥇" :
                     badge.tier === "SILVER" ? "🥈" : "🥉"}
                  </div>
                  <p className={s.badgeName}>{badge.name}</p>
                  <p className={s.badgeDesc}>{badge.description}</p>
                  <p className={s.badgeTier} style={{ color: TIER_COLOR[badge.tier] }}>
                    {badge.tier}
                  </p>
                  <p className={s.badgeDate}>{dayjs(badge.awardedAt).format("YYYY.MM.DD")}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={s.empty}>
            <div className={s.emptyIcon}>🏅</div>
            <p>아직 획득한 배지가 없습니다</p>
          </div>
        )}

        <div className={s.backRow}>
          <Link href="/boxes" className={s.backLink}>← 박스 찾기로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}
