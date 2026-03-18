"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { wodApi } from "@/lib/api";
import { Wod } from "@/types";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import s from "./history.module.css";

dayjs.locale("ko");

const WOD_COLORS: Record<string, string> = {
  AMRAP: "#e8220a", FOR_TIME: "#ff6b1a", EMOM: "#22c55e",
  TABATA: "#3b82f6", STRENGTH: "#a855f7", SKILL: "#eab308",
  REST_DAY: "#888", CUSTOM: "#888",
};

const WOD_LABELS: Record<string, string> = {
  AMRAP: "AMRAP", FOR_TIME: "FOR TIME", EMOM: "EMOM",
  TABATA: "TABATA", STRENGTH: "STRENGTH", SKILL: "SKILL",
  REST_DAY: "REST DAY", CUSTOM: "CUSTOM",
};

export default function WodHistoryPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["wod", "history", page],
    queryFn: async () => (await wodApi.getHistory(page)).data.data,
  });

  const wods: Wod[] = data?.content || [];

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <Link href="/wod" className={s.back}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          오늘의 WOD
        </Link>

        <div className={s.header}>
          <div>
            <p className={s.tag}>WOD ARCHIVE</p>
            <h1 className={s.title}>WOD 히스토리</h1>
            <p className={s.sub}>총 {data?.totalElements?.toLocaleString() || 0}개의 WOD 기록</p>
          </div>
          <Link href="/wod/records" className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13 }}>
            내 기록 보기
          </Link>
        </div>

        {isLoading ? (
          <div className={s.list}>
            {[...Array(6)].map((_, i) => <div key={i} className={s.skeleton} />)}
          </div>
        ) : wods.length === 0 ? (
          <div className={s.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--muted)" }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <p>WOD 기록이 없습니다</p>
          </div>
        ) : (
          <div className={s.list}>
            {wods.map((wod) => (
              <div key={wod.id} className={s.item}>
                <div className={s.itemDate}>
                  <p className={s.itemMonth}>{dayjs(wod.wodDate).format("MMM")}</p>
                  <p className={s.itemDay}>{dayjs(wod.wodDate).format("DD")}</p>
                  <p className={s.itemDow}>{dayjs(wod.wodDate).format("ddd")}</p>
                </div>

                <div className={s.itemBody}>
                  <div className={s.itemTop}>
                    <span
                      className={s.typeBadge}
                      style={{
                        background: (WOD_COLORS[wod.type] || "#888") + "22",
                        color: WOD_COLORS[wod.type] || "#888",
                        border: `1px solid ${(WOD_COLORS[wod.type] || "#888")}44`,
                      }}
                    >
                      {WOD_LABELS[wod.type] || wod.type}
                    </span>
                    {wod.boxName && (
                      <span className={s.boxName}>{wod.boxName}</span>
                    )}
                  </div>
                  <h3 className={s.itemTitle}>{wod.title}</h3>
                  <p className={s.itemContent}>{wod.content}</p>
                </div>

                <div className={s.itemSide}>
                  <span className={s.scoreType}>{wod.scoreType}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className={s.pagination}>
            <button
              className="btn-secondary"
              style={{ padding: "10px 20px", fontSize: 13 }}
              disabled={data.first}
              onClick={() => setPage(p => p - 1)}
            >
              이전
            </button>
            <span className={s.pageInfo}>{data.number + 1} / {data.totalPages}</span>
            <button
              className="btn-secondary"
              style={{ padding: "10px 20px", fontSize: 13 }}
              disabled={data.last}
              onClick={() => setPage(p => p + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
