"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { rankingApi } from "@/lib/api";
import { NamedWod, NamedWodCategory, RankingOverview } from "@/types";
import s from "./ranking.module.css";

const CATEGORY_LABEL: Record<NamedWodCategory, string> = {
  GIRLS: "Girls WODs",
  HEROES: "Hero WODs",
  BENCHMARK: "Benchmark",
  CUSTOM: "Custom",
};

const CATEGORY_ORDER: NamedWodCategory[] = ["GIRLS", "HEROES", "BENCHMARK", "CUSTOM"];
const RANK_MEDAL = ["🥇", "🥈", "🥉"];

export default function RankingPage() {
  const [view, setView] = useState<"list" | "overview">("list");

  const { data: wods = [], isLoading: wodsLoading } = useQuery<NamedWod[]>({
    queryKey: ["ranking", "wods"],
    queryFn: async () => (await rankingApi.getWods()).data.data,
  });

  const { data: overview = [], isLoading: overviewLoading } = useQuery<RankingOverview[]>({
    queryKey: ["ranking", "overview"],
    queryFn: async () => (await rankingApi.getOverview()).data.data,
    enabled: view === "overview",
    staleTime: 1000 * 60 * 2,
  });

  const grouped = CATEGORY_ORDER.reduce<Record<NamedWodCategory, NamedWod[]>>(
    (acc, cat) => { acc[cat] = wods.filter((w) => w.category === cat); return acc; },
    { GIRLS: [], HEROES: [], BENCHMARK: [], CUSTOM: [] }
  );

  const groupedOverview = CATEGORY_ORDER.reduce<Record<NamedWodCategory, RankingOverview[]>>(
    (acc, cat) => { acc[cat] = overview.filter((o) => o.category === cat); return acc; },
    { GIRLS: [], HEROES: [], BENCHMARK: [], CUSTOM: [] }
  );

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <p className={s.heroTag}>CROSSFIT KOREA</p>
        <h1 className={s.heroTitle}>NAMED WOD RANKING</h1>
        <p className={s.heroDesc}>
          YouTube 영상으로 기록을 제출하고 박스 오너의 인증을 받아 랭킹에 이름을 올리세요.
        </p>
        <div className={s.heroJudgeNote}>
          ⚖ 어느 박스의 오너든 공개 저지로서 기록을 인증할 수 있습니다
        </div>
        <div className={s.heroSteps}>
          <div className={s.heroStep}>
            <span className={s.heroStepNum}>01</span>
            <span className={s.heroStepText}>아래 WOD 카드 클릭</span>
          </div>
          <span className={s.heroStepArrow}>→</span>
          <div className={s.heroStep}>
            <span className={s.heroStepNum}>02</span>
            <span className={s.heroStepText}>점수 + YouTube URL 제출</span>
          </div>
          <span className={s.heroStepArrow}>→</span>
          <div className={s.heroStep}>
            <span className={s.heroStepNum}>03</span>
            <span className={s.heroStepText}>박스 오너 인증 후 랭킹 등재</span>
          </div>
        </div>
      </div>

      {/* 뷰 전환 탭 */}
      <div className={s.viewTabs}>
        <button
          className={`${s.viewTab} ${view === "list" ? s.viewTabActive : ""}`}
          onClick={() => setView("list")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          WOD 목록
        </button>
        <button
          className={`${s.viewTab} ${view === "overview" ? s.viewTabActive : ""}`}
          onClick={() => setView("overview")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
          종합 랭킹
        </button>
      </div>

      <div className={s.content}>
        {/* ── WOD 목록 뷰 ── */}
        {view === "list" && (
          wodsLoading ? (
            <div className={s.skeletonGrid}>
              {[...Array(8)].map((_, i) => <div key={i} className={s.skeleton} />)}
            </div>
          ) : wods.length === 0 ? (
            <div className={s.empty}>등록된 Named WOD가 없습니다.</div>
          ) : (
            CATEGORY_ORDER.filter((cat) => grouped[cat].length > 0).map((cat) => (
              <section key={cat} className={s.section}>
                <h2 className={s.sectionTitle}>{CATEGORY_LABEL[cat]}</h2>
                <div className={s.grid}>
                  {grouped[cat].map((wod) => (
                    <Link key={wod.id} href={`/ranking/${wod.id}`} className={s.card}>
                      <div className={s.cardCategory}>{CATEGORY_LABEL[cat]}</div>
                      <h3 className={s.cardName}>{wod.name}</h3>
                      {wod.description && <p className={s.cardDesc}>{wod.description}</p>}
                      <div className={s.cardFooter}>
                        <span className={s.cardScore}>
                          {wod.scoreType === "TIME" ? "⏱ TIME" :
                           wod.scoreType === "REPS" ? "🔢 REPS" :
                           wod.scoreType === "WEIGHT" ? "🏋️ WEIGHT" : "🔄 ROUNDS"}
                          {wod.scoreUnit && ` (${wod.scoreUnit})`}
                        </span>
                        <span className={s.cardCount}>{wod.verifiedCount}개 기록</span>
                      </div>
                      <div className={s.cardCta}>기록 제출 / 랭킹 보기 →</div>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )
        )}

        {/* ── 종합 랭킹 뷰 ── */}
        {view === "overview" && (
          overviewLoading ? (
            <div className={s.skeletonGrid}>
              {[...Array(6)].map((_, i) => <div key={i} className={s.skeletonOverview} />)}
            </div>
          ) : overview.length === 0 ? (
            <div className={s.empty}>등록된 Named WOD가 없습니다.</div>
          ) : (
            CATEGORY_ORDER.filter((cat) => groupedOverview[cat].length > 0).map((cat) => (
              <section key={cat} className={s.section}>
                <h2 className={s.sectionTitle}>{CATEGORY_LABEL[cat]}</h2>
                <div className={s.overviewGrid}>
                  {groupedOverview[cat].map((item) => (
                    <Link key={item.wodId} href={`/ranking/${item.wodId}`} className={s.overviewCard}>
                      {/* 카드 헤더 */}
                      <div className={s.overviewCardHead}>
                        <span className={s.overviewWodName}>{item.wodName}</span>
                        <span className={s.overviewScoreType}>
                          {item.scoreType === "TIME" ? "⏱" :
                           item.scoreType === "REPS" ? "🔢" :
                           item.scoreType === "WEIGHT" ? "🏋️" : "🔄"}
                          {" "}{item.scoreType}
                        </span>
                      </div>

                      {/* TOP 3 */}
                      {item.top3.length === 0 ? (
                        <p className={s.overviewEmpty}>아직 기록 없음</p>
                      ) : (
                        <div className={s.overviewRows}>
                          {item.top3.map((entry, idx) => (
                            <div key={entry.recordId} className={`${s.overviewRow} ${idx === 0 ? s.overviewRowFirst : ""}`}>
                              <span className={s.overviewRank}>{RANK_MEDAL[idx]}</span>
                              <span className={s.overviewName}>{entry.userName}</span>
                              <span className={s.overviewScore}>{entry.scoreFormatted}</span>
                              {entry.verifiedBoxName && (
                                <span className={s.overviewBox}>✓ {entry.verifiedBoxName}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className={s.overviewCardFooter}>
                        <span className={s.overviewTotal}>{item.totalVerified}명 인증</span>
                        <span className={s.overviewMore}>전체 보기 →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )
        )}
      </div>
    </div>
  );
}
