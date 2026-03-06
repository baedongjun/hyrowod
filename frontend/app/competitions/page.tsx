"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { competitionApi } from "@/lib/api";
import { Competition, CompetitionStatus } from "@/types";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import s from "./competitions.module.css";

dayjs.locale("ko");

const STATUS_LABELS: Record<CompetitionStatus, string> = {
  UPCOMING: "예정",
  OPEN: "접수 중",
  CLOSED: "접수 마감",
  COMPLETED: "종료",
};

const STATUS_BADGE: Record<CompetitionStatus, string> = {
  UPCOMING: "badge-upcoming",
  OPEN: "badge-open",
  CLOSED: "badge-closed",
  COMPLETED: "badge-completed",
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "입문",
  SCALED: "스케일드",
  INTERMEDIATE: "중급",
  RX: "Rx",
  ELITE: "엘리트",
  ALL: "전체",
};

const STATUS_FILTERS: { value: CompetitionStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "OPEN", label: "접수 중" },
  { value: "UPCOMING", label: "예정" },
  { value: "CLOSED", label: "접수 마감" },
  { value: "COMPLETED", label: "종료" },
];

export default function CompetitionsPage() {
  const [selectedStatus, setSelectedStatus] = useState<CompetitionStatus | "ALL">("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["competitions", selectedStatus],
    queryFn: async () => {
      const res = await competitionApi.getAll({
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
      });
      return res.data.data;
    },
  });

  return (
    <div className={s.page}>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroEyebrow}>
            <svg className={s.trophyIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
            <span className={s.heroTag}>Competition Schedule</span>
          </div>
          <h1 className={s.heroTitle}>대회 일정</h1>
          <p className={s.heroSub}>전국 크로스핏 대회 일정을 한눈에 확인하세요</p>
        </div>
      </div>

      {/* Content */}
      <div className={s.content}>
        {/* Filter */}
        <div className={s.filters}>
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`${s.pill} ${selectedStatus === filter.value ? s.pillActive : ""}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className={s.list}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={s.skeleton} />
            ))}
          </div>
        ) : data?.content?.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>🏆</div>
            <p>대회 일정이 없습니다</p>
          </div>
        ) : (
          <div className={s.list}>
            {data?.content?.map((comp: Competition) => (
              <div key={comp.id} className={s.item}>
                {/* Date Badge */}
                <div className={s.dateBadge}>
                  <p className={s.dateMonth}>{dayjs(comp.startDate).format("MMM")}</p>
                  <p className={s.dateDay}>{dayjs(comp.startDate).format("DD")}</p>
                  <p className={s.dateDow}>{dayjs(comp.startDate).format("ddd")}</p>
                </div>

                {/* Info */}
                <div className={s.info}>
                  <div className={s.badges}>
                    <span className={`badge ${STATUS_BADGE[comp.status]}`}>
                      {STATUS_LABELS[comp.status]}
                    </span>
                    {comp.level && (
                      <span className="badge badge-default">
                        {LEVEL_LABELS[comp.level] || comp.level}
                      </span>
                    )}
                  </div>
                  <p className={s.compName}>{comp.name}</p>
                  <div className={s.meta}>
                    {comp.location && (
                      <span className={s.metaItem}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {comp.location}
                      </span>
                    )}
                    {comp.registrationDeadline && (
                      <span className={s.metaItem}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        접수 마감: {dayjs(comp.registrationDeadline).format("MM.DD")}
                      </span>
                    )}
                    {comp.entryFee && (
                      <span className={s.feeValue}>
                        {comp.entryFee.toLocaleString()}원
                      </span>
                    )}
                  </div>
                  {comp.description && <p className={s.desc}>{comp.description}</p>}
                </div>

                {/* Action */}
                {comp.registrationUrl && comp.status === "OPEN" && (
                  <div className={s.action}>
                    <a
                      href={comp.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      접수하기
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
