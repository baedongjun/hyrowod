"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import s from "../users/adminUsers.module.css";
import bs from "./adminBadges.module.css";

const TIER_COLOR: Record<string, string> = {
  BRONZE: "#cd7f32",
  SILVER: "#c0c0c0",
  GOLD: "#eab308",
  PLATINUM: "#0ea5e9",
};

const TIER_ICON: Record<string, string> = {
  BRONZE: "🥉", SILVER: "🥈", GOLD: "🥇", PLATINUM: "💠",
};

export default function AdminBadgesPage() {
  const [page, setPage] = useState(0);
  const [activeView, setActiveView] = useState<"awarded" | "types">("awarded");
  const [awardForm, setAwardForm] = useState({ userId: "", badgeType: "" });
  const [showAwardForm, setShowAwardForm] = useState(false);
  const qc = useQueryClient();

  const { data: awarded, isLoading } = useQuery({
    queryKey: ["admin", "badges", "awarded", page],
    queryFn: async () => (await adminApi.getBadges(page)).data.data,
    enabled: activeView === "awarded",
  });

  const { data: types } = useQuery({
    queryKey: ["admin", "badges", "types"],
    queryFn: async () => (await adminApi.getBadgeTypes()).data.data as Array<{
      type: string; name: string; description: string; tier: string; count: number;
    }>,
    enabled: activeView === "types",
  });

  const awardMutation = useMutation({
    mutationFn: () => adminApi.awardBadge(Number(awardForm.userId), awardForm.badgeType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "badges"] });
      toast.success("배지가 수여되었습니다.");
      setAwardForm({ userId: "", badgeType: "" });
      setShowAwardForm(false);
    },
    onError: () => toast.error("배지 수여에 실패했습니다."),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: number) => adminApi.revokeBadge(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "badges"] });
      toast.success("배지가 회수되었습니다.");
    },
    onError: () => toast.error("배지 회수에 실패했습니다."),
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>배지 관리</h1>
        <button
          className="btn-primary"
          style={{ padding: "8px 20px", fontSize: 13 }}
          onClick={() => setShowAwardForm(!showAwardForm)}
        >
          + 배지 수여
        </button>
      </div>

      {/* Award Form */}
      {showAwardForm && (
        <div className={bs.awardForm}>
          <h3 className={bs.awardTitle}>배지 수여</h3>
          <div className={bs.awardGrid}>
            <div>
              <label className={bs.fieldLabel}>회원 ID</label>
              <input
                type="number"
                className={bs.fieldInput}
                placeholder="회원 ID 입력"
                value={awardForm.userId}
                onChange={(e) => setAwardForm({ ...awardForm, userId: e.target.value })}
              />
            </div>
            <div>
              <label className={bs.fieldLabel}>배지 타입</label>
              <select
                className={bs.fieldSelect}
                value={awardForm.badgeType}
                onChange={(e) => setAwardForm({ ...awardForm, badgeType: e.target.value })}
              >
                <option value="">배지 선택</option>
                {types?.map((t) => (
                  <option key={t.type} value={t.type}>
                    [{t.tier}] {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="btn-primary"
              style={{ padding: "8px 20px", fontSize: 13 }}
              disabled={!awardForm.userId || !awardForm.badgeType || awardMutation.isPending}
              onClick={() => awardMutation.mutate()}
            >
              수여
            </button>
            <button
              className="btn-secondary"
              style={{ padding: "8px 20px", fontSize: 13 }}
              onClick={() => setShowAwardForm(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={bs.tabs}>
        <button
          className={activeView === "awarded" ? bs.tabActive : bs.tab}
          onClick={() => setActiveView("awarded")}
        >
          수여 내역
        </button>
        <button
          className={activeView === "types" ? bs.tabActive : bs.tab}
          onClick={() => setActiveView("types")}
        >
          배지 종류
        </button>
      </div>

      {/* Awarded History */}
      {activeView === "awarded" && (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                <th className={s.th}>회원</th>
                <th className={s.th}>배지</th>
                <th className={`${s.th} ${s.thCenter}`}>등급</th>
                <th className={s.th}>설명</th>
                <th className={`${s.th} ${s.thCenter}`}>수여일</th>
                <th className={`${s.th} ${s.thCenter}`}>관리</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className={s.tr}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className={s.td}><div className={s.skeletonCell} /></td>
                    ))}
                  </tr>
                ))
              ) : (
                awarded?.content?.map((badge: {
                  id: number;
                  userId: number;
                  userName: string;
                  type: string;
                  name: string;
                  description: string;
                  tier: string;
                  awardedAt: string;
                }) => (
                  <tr key={badge.id} className={s.tr}>
                    <td data-label="회원" className={`${s.td} ${s.tdName}`}>
                      {badge.userName}
                      <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400, marginLeft: 6 }}>#{badge.userId}</span>
                    </td>
                    <td data-label="배지" className={s.td}>
                      <span className={bs.badgeName}>
                        {TIER_ICON[badge.tier]} {badge.name}
                      </span>
                    </td>
                    <td data-label="등급" className={`${s.td} ${s.tdCenter}`}>
                      <span style={{ color: TIER_COLOR[badge.tier], fontWeight: 600, fontSize: 12 }}>
                        {badge.tier}
                      </span>
                    </td>
                    <td data-label="설명" className={`${s.td} ${s.hideOnMobile}`}>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{badge.description}</span>
                    </td>
                    <td data-label="수여일" className={`${s.td} ${s.tdCenter}`}>
                      {dayjs(badge.awardedAt).format("MM.DD HH:mm")}
                    </td>
                    <td data-label="관리" className={`${s.td} ${s.tdCenter}`}>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${badge.name}" 배지를 회수하시겠습니까?`)) {
                            revokeMutation.mutate(badge.id);
                          }
                        }}
                        className={bs.revokeBtn}
                        disabled={revokeMutation.isPending}
                      >
                        회수
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {awarded && awarded.totalPages > 1 && (
            <div className={s.pagination}>
              <button onClick={() => setPage(page - 1)} disabled={awarded.first} className="btn-secondary">이전</button>
              <span className={s.pageInfo}>{awarded.number + 1} / {awarded.totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={awarded.last} className="btn-secondary">다음</button>
            </div>
          )}
        </div>
      )}

      {/* Badge Types */}
      {activeView === "types" && (
        <div className={bs.typesGrid}>
          {types?.map((t) => (
            <div key={t.type} className={bs.typeCard} style={{ borderColor: `${TIER_COLOR[t.tier]}30` }}>
              <div className={bs.typeIcon}>{TIER_ICON[t.tier]}</div>
              <div className={bs.typeInfo}>
                <p className={bs.typeName}>{t.name}</p>
                <p className={bs.typeDesc}>{t.description}</p>
                <div className={bs.typeMeta}>
                  <span style={{ color: TIER_COLOR[t.tier], fontSize: 11, fontWeight: 600 }}>{t.tier}</span>
                  <span className={bs.typeCount}>{t.count.toLocaleString()}명 보유</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
