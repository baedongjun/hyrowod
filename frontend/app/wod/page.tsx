"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { wodApi } from "@/lib/api";
import { Wod } from "@/types";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import s from "./wod.module.css";

dayjs.locale("ko");

const WOD_TYPE_LABELS: Record<string, string> = {
  AMRAP: "AMRAP",
  FOR_TIME: "FOR TIME",
  EMOM: "EMOM",
  TABATA: "TABATA",
  STRENGTH: "STRENGTH",
  SKILL: "SKILL",
  REST_DAY: "REST DAY",
  CUSTOM: "WOD",
};

const WOD_TYPE_BADGE: Record<string, string> = {
  AMRAP: "badge-amrap",
  FOR_TIME: "badge-fortime",
  EMOM: "badge-emom",
  STRENGTH: "badge-strength",
  SKILL: "badge-strength",
  TABATA: "badge-amrap",
  REST_DAY: "badge-default",
  CUSTOM: "badge-default",
};

const WOD_TYPE_DOT: Record<string, string> = {
  AMRAP: "#e8220a",
  FOR_TIME: "#ff6b1a",
  EMOM: "#3b82f6",
  STRENGTH: "#eab308",
  SKILL: "#eab308",
  TABATA: "#e8220a",
  REST_DAY: "#888",
  CUSTOM: "#888",
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function WodPage() {
  const today = dayjs().format("YYYY년 MM월 DD일 dddd");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calMonth, setCalMonth] = useState(dayjs().startOf("month"));
  const [selectedWod, setSelectedWod] = useState<Wod | null>(null);

  const { data: todayWod, isLoading } = useQuery({
    queryKey: ["wod", "today"],
    queryFn: async () => {
      const res = await wodApi.getToday();
      return res.data.data as Wod;
    },
  });

  const { data: historyData } = useQuery({
    queryKey: ["wod", "history", 0, 90],
    queryFn: async () => {
      const res = await wodApi.getHistory(0, 90);
      return res.data.data;
    },
  });

  // Build date -> wod map
  const wodByDate: Record<string, Wod> = {};
  historyData?.content?.forEach((wod: Wod) => {
    wodByDate[wod.wodDate] = wod;
  });

  // Calendar cells
  const startPad = calMonth.startOf("month").day();
  const daysInMonth = calMonth.daysInMonth();
  const calendarCells: Array<{ date: dayjs.Dayjs | null; wod?: Wod }> = [];
  for (let i = 0; i < startPad; i++) calendarCells.push({ date: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = calMonth.date(d);
    calendarCells.push({ date, wod: wodByDate[date.format("YYYY-MM-DD")] });
  }
  while (calendarCells.length % 7 !== 0) calendarCells.push({ date: null });

  return (
    <div className={s.page}>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroEyebrow}>
            <svg className={s.fireIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67z"/>
            </svg>
            <span className={s.heroTag}>Workout of the Day</span>
          </div>
          <h1 className={s.heroTitle}>오늘의 WOD</h1>
          <p className={s.heroDate}>{today}</p>
        </div>
      </div>

      {/* Content */}
      <div className={s.content}>
        {isLoading ? (
          <div className={s.wodSkeleton} />
        ) : todayWod ? (
          <div className={s.wodCard}>
            <div className={s.wodCardHeader}>
              <div>
                <span className={`badge ${WOD_TYPE_BADGE[todayWod.type] || "badge-default"}`}>
                  {WOD_TYPE_LABELS[todayWod.type] || todayWod.type}
                </span>
                <h2 className={s.wodTitle}>{todayWod.title}</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {todayWod.scoreType && (
                  <div className={s.scoreBox}>
                    <p className={s.scoreLabel}>SCORE</p>
                    <p className={s.scoreValue}>{todayWod.scoreType}</p>
                  </div>
                )}
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button
                    className={s.shareBtn}
                    onClick={() => {
                      navigator.share({
                        title: `오늘의 WOD: ${todayWod.title}`,
                        text: todayWod.content,
                        url: window.location.href,
                      }).catch(() => {});
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    공유
                  </button>
                )}
              </div>
            </div>
            <div className={s.wodBody}>
              <div className={s.wodContent}>{todayWod.content}</div>
              {todayWod.imageUrl && (
                <img src={todayWod.imageUrl} alt="WOD" className={s.wodImage} />
              )}
            </div>
          </div>
        ) : (
          <div className={s.wodEmpty}>
            <div className={s.wodEmptyIcon}>🔥</div>
            <p className={s.wodEmptyText}>오늘의 WOD가 아직 등록되지 않았습니다</p>
          </div>
        )}

        {/* View Toggle */}
        <div className={s.viewToggle}>
          <p className={s.historyTitle}>WOD 기록</p>
          <div className={s.viewBtns}>
            <button
              className={`${s.viewBtn} ${viewMode === "list" ? s.viewBtnActive : ""}`}
              onClick={() => setViewMode("list")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              목록
            </button>
            <button
              className={`${s.viewBtn} ${viewMode === "calendar" ? s.viewBtnActive : ""}`}
              onClick={() => { setViewMode("calendar"); setSelectedWod(null); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="0" ry="0"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              달력
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className={s.historyList}>
            {historyData?.content?.map((wod: Wod) => (
              <div key={wod.id} className={s.historyItem}>
                <div className={s.historyDate}>
                  <p className={s.historyDateMd}>{dayjs(wod.wodDate).format("DD")}</p>
                  <p className={s.historyDateDay}>{dayjs(wod.wodDate).format("ddd")}</p>
                </div>
                <div className={s.historyBody}>
                  <span className={`badge ${WOD_TYPE_BADGE[wod.type] || "badge-default"}`}>
                    {WOD_TYPE_LABELS[wod.type] || wod.type}
                  </span>
                  <p className={s.historyName}>{wod.title}</p>
                  <p className={s.historySnippet}>{wod.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={s.calendar}>
            {/* Month Navigation */}
            <div className={s.calNav}>
              <button className={s.calNavBtn} onClick={() => { setCalMonth(calMonth.subtract(1, "month")); setSelectedWod(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <span className={s.calMonthLabel}>{calMonth.format("YYYY년 MM월")}</span>
              <button className={s.calNavBtn} onClick={() => { setCalMonth(calMonth.add(1, "month")); setSelectedWod(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            {/* Weekday Headers */}
            <div className={s.calGrid}>
              {WEEKDAYS.map((d) => (
                <div key={d} className={s.calWeekday}>{d}</div>
              ))}

              {/* Day Cells */}
              {calendarCells.map((cell, i) => {
                const isToday = cell.date?.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
                const isSelected = selectedWod && cell.date?.format("YYYY-MM-DD") === selectedWod.wodDate;
                return (
                  <div
                    key={i}
                    className={`${s.calCell} ${!cell.date ? s.calCellEmpty : ""} ${isToday ? s.calCellToday : ""} ${cell.wod ? s.calCellHasWod : ""} ${isSelected ? s.calCellSelected : ""}`}
                    onClick={() => cell.wod && setSelectedWod(isSelected ? null : cell.wod)}
                  >
                    {cell.date && (
                      <>
                        <span className={s.calDay}>{cell.date.date()}</span>
                        {cell.wod && (
                          <span
                            className={s.calDot}
                            style={{ background: WOD_TYPE_DOT[cell.wod.type] || "#888" }}
                          />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Day WOD */}
            {selectedWod && (
              <div className={s.calWodDetail}>
                <div className={s.calWodDetailHeader}>
                  <div>
                    <span className={`badge ${WOD_TYPE_BADGE[selectedWod.type] || "badge-default"}`}>
                      {WOD_TYPE_LABELS[selectedWod.type] || selectedWod.type}
                    </span>
                    <p className={s.calWodDate}>{dayjs(selectedWod.wodDate).format("YYYY년 MM월 DD일 ddd")}</p>
                    <p className={s.calWodTitle}>{selectedWod.title}</p>
                  </div>
                  <button className={s.calCloseBtn} onClick={() => setSelectedWod(null)}>✕</button>
                </div>
                <div className={s.wodContent}>{selectedWod.content}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
