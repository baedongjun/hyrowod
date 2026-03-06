"use client";

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

export default function WodPage() {
  const today = dayjs().format("YYYY년 MM월 DD일 dddd");

  const { data: todayWod, isLoading } = useQuery({
    queryKey: ["wod", "today"],
    queryFn: async () => {
      const res = await wodApi.getToday();
      return res.data.data as Wod;
    },
  });

  const { data: historyData } = useQuery({
    queryKey: ["wod", "history"],
    queryFn: async () => {
      const res = await wodApi.getHistory();
      return res.data.data;
    },
  });

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
              {todayWod.scoreType && (
                <div className={s.scoreBox}>
                  <p className={s.scoreLabel}>SCORE</p>
                  <p className={s.scoreValue}>{todayWod.scoreType}</p>
                </div>
              )}
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

        {/* History */}
        <p className={s.historyTitle}>지난 WOD</p>
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
      </div>
    </div>
  );
}
