"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { leaderboardApi } from "@/lib/api";
import { BoxRanking } from "@/types";
import dayjs from "dayjs";
import s from "./boxRanking.module.css";

export default function BoxRankingPage() {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["box-ranking", date],
    queryFn: async () => (await leaderboardApi.getBoxRanking(date)).data.data as BoxRanking[],
  });

  const handleDateChange = (offset: number) => {
    setDate(dayjs(date).add(offset, "day").format("YYYY-MM-DD"));
  };

  const isToday = date === dayjs().format("YYYY-MM-DD");

  return (
    <div className={s.page}>
      <div className={s.inner}>
        {/* Header */}
        <div className={s.header}>
          <div className={s.headerLeft}>
            <Link href="/wod" className={s.back}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              WOD
            </Link>
            <h1 className={s.title}>BOX RANKING</h1>
            <p className={s.subtitle}>박스별 WOD 참여 현황</p>
          </div>

          {/* Date Navigation */}
          <div className={s.dateNav}>
            <button className={s.dateBtn} onClick={() => handleDateChange(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div className={s.dateDisplay}>
              <span className={s.dateText}>{dayjs(date).format("YYYY.MM.DD")}</span>
              <span className={s.dateSub}>{dayjs(date).format("ddd")}</span>
              {isToday && <span className={s.todayBadge}>TODAY</span>}
            </div>
            <button
              className={s.dateBtn}
              onClick={() => handleDateChange(1)}
              disabled={isToday}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        {rankings && rankings.length > 0 && (
          <div className={s.summary}>
            <div className={s.summaryItem}>
              <span className={s.summaryNum}>{rankings.length}</span>
              <span className={s.summaryLabel}>참여 박스</span>
            </div>
            <div className={s.summaryItem}>
              <span className={s.summaryNum}>{rankings.reduce((a, b) => a + b.participantCount, 0)}</span>
              <span className={s.summaryLabel}>총 참여자</span>
            </div>
            <div className={s.summaryItem}>
              <span className={s.summaryNum}>{rankings.reduce((a, b) => a + b.rxCount, 0)}</span>
              <span className={s.summaryLabel}>RX 완료</span>
            </div>
          </div>
        )}

        {/* Rankings */}
        {isLoading ? (
          <div className={s.loading}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={s.skeletonCard} />
            ))}
          </div>
        ) : !rankings || rankings.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <p className={s.emptyText}>이 날짜의 박스 랭킹 데이터가 없습니다</p>
            <p className={s.emptyHint}>WOD 기록이 등록된 날짜를 선택해보세요</p>
          </div>
        ) : (
          <div className={s.rankList}>
            {rankings.map((box, index) => {
              const rxRate = box.participantCount > 0
                ? Math.round((box.rxCount / box.participantCount) * 100)
                : 0;
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

              return (
                <div key={box.boxId} className={`${s.rankCard} ${index < 3 ? s.topCard : ""}`}>
                  <div className={s.rankNum}>
                    {medal ? (
                      <span className={s.medal}>{medal}</span>
                    ) : (
                      <span className={s.rankIndex}>{index + 1}</span>
                    )}
                  </div>

                  <div className={s.rankInfo}>
                    <div className={s.rankHeader}>
                      <div>
                        <h3 className={s.boxName}>{box.boxName}</h3>
                        <p className={s.boxCity}>{box.boxCity}</p>
                      </div>
                      <div className={s.rankStats}>
                        <div className={s.statBadge}>
                          <span className={s.statNum}>{box.participantCount}</span>
                          <span className={s.statLabel}>참여</span>
                        </div>
                        <div className={`${s.statBadge} ${s.rxBadge}`}>
                          <span className={s.statNum}>{box.rxCount}</span>
                          <span className={s.statLabel}>RX</span>
                        </div>
                      </div>
                    </div>

                    {/* RX Rate Bar */}
                    <div className={s.rxBar}>
                      <div className={s.rxBarTrack}>
                        <div
                          className={s.rxBarFill}
                          style={{ width: `${rxRate}%` }}
                        />
                      </div>
                      <span className={s.rxRate}>RX {rxRate}%</span>
                    </div>

                    {/* Top Scores */}
                    {box.topScores && box.topScores.length > 0 && (
                      <div className={s.topScores}>
                        <span className={s.topScoresLabel}>TOP 기록</span>
                        <div className={s.scoreList}>
                          {box.topScores.slice(0, 3).map((score, si) => (
                            <span key={si} className={s.scoreChip}>{score}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className={s.footer}>
          <Link href="/wod/leaderboard" className={s.footerLink}>
            개인 리더보드 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
