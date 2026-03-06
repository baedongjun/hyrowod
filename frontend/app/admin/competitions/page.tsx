"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, competitionApi } from "@/lib/api";
import { Competition, CompetitionStatus } from "@/types";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import s from "./adminComp.module.css";

const LEVELS = ["BEGINNER","SCALED","INTERMEDIATE","RX","ELITE","ALL"] as const;
const LEVEL_LABELS: Record<string, string> = {
  BEGINNER:"입문", SCALED:"스케일드", INTERMEDIATE:"중급", RX:"Rx", ELITE:"엘리트", ALL:"전체",
};
const STATUSES: CompetitionStatus[] = ["UPCOMING","OPEN","CLOSED","COMPLETED"];
const STATUS_LABELS: Record<CompetitionStatus, string> = {
  UPCOMING:"예정", OPEN:"접수 중", CLOSED:"접수 마감", COMPLETED:"종료",
};
const STATUS_BADGE: Record<CompetitionStatus, string> = {
  UPCOMING:"badge-upcoming", OPEN:"badge-open", CLOSED:"badge-closed", COMPLETED:"badge-completed",
};

export default function AdminCompetitionsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: "",
    location: "",
    city: "",
    registrationDeadline: "",
    registrationUrl: "",
    level: "ALL",
    entryFee: "",
    maxParticipants: "",
  });

  const { data } = useQuery({
    queryKey: ["competitions", "ALL"],
    queryFn: async () => (await competitionApi.getAll()).data.data,
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createCompetition({
      ...form,
      entryFee: form.entryFee ? Number(form.entryFee) : null,
      maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : null,
      endDate: form.endDate || null,
      registrationDeadline: form.registrationDeadline || null,
      registrationUrl: form.registrationUrl || null,
    }),
    onSuccess: () => {
      toast.success("대회가 등록되었습니다.");
      setForm({ name:"", description:"", startDate:dayjs().format("YYYY-MM-DD"), endDate:"", location:"", city:"", registrationDeadline:"", registrationUrl:"", level:"ALL", entryFee:"", maxParticipants:"" });
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
    },
    onError: () => toast.error("등록에 실패했습니다."),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateCompetitionStatus(id, status),
    onSuccess: () => {
      toast.success("상태가 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
    },
    onError: () => toast.error("변경에 실패했습니다."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.startDate) {
      toast.error("대회명과 시작일을 입력하세요.");
      return;
    }
    createMutation.mutate();
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <h1 className={s.pageTitle}>대회 관리</h1>
      <div className={s.grid}>
        {/* Form */}
        <div className={s.formCard}>
          <p className={s.formTitle}>대회 등록</p>
          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label className={s.label}>대회명</label>
              <input type="text" className="input-field" placeholder="2026 CrossFit Korea Open" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className={s.row}>
              <div className={s.field}>
                <label className={s.label}>시작일</label>
                <input type="date" className="input-field" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div className={s.field}>
                <label className={s.label}>종료일 (선택)</label>
                <input type="date" className="input-field" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
              </div>
            </div>
            <div className={s.row}>
              <div className={s.field}>
                <label className={s.label}>도시</label>
                <input type="text" className="input-field" placeholder="서울" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className={s.field}>
                <label className={s.label}>레벨</label>
                <select className={s.select} value={form.level} onChange={(e) => set("level", e.target.value)}>
                  {LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
                </select>
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>장소</label>
              <input type="text" className="input-field" placeholder="상세 장소" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className={s.row}>
              <div className={s.field}>
                <label className={s.label}>참가비 (원)</label>
                <input type="number" className="input-field" placeholder="50000" value={form.entryFee} onChange={(e) => set("entryFee", e.target.value)} />
              </div>
              <div className={s.field}>
                <label className={s.label}>최대 인원</label>
                <input type="number" className="input-field" placeholder="200" value={form.maxParticipants} onChange={(e) => set("maxParticipants", e.target.value)} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>접수 마감일</label>
              <input type="date" className="input-field" value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)} />
            </div>
            <div className={s.field}>
              <label className={s.label}>접수 URL</label>
              <input type="url" className="input-field" placeholder="https://..." value={form.registrationUrl} onChange={(e) => set("registrationUrl", e.target.value)} />
            </div>
            <div className={s.field}>
              <label className={s.label}>설명 (선택)</label>
              <textarea className={s.textarea} placeholder="대회 설명" value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <button type="submit" className={`btn-primary ${s.submitBtn}`} disabled={createMutation.isPending}>
              {createMutation.isPending ? "등록 중..." : "대회 등록"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className={s.listCard}>
          <p className={s.listHeader}>등록된 대회</p>
          <div className={s.list}>
            {data?.content?.length > 0 ? (
              data.content.map((comp: Competition) => (
                <div key={comp.id} className={s.item}>
                  <div className={s.itemBody}>
                    <span className={`badge ${STATUS_BADGE[comp.status]}`}>{STATUS_LABELS[comp.status]}</span>
                    <p className={s.itemName}>{comp.name}</p>
                    <p className={s.itemMeta}>
                      {dayjs(comp.startDate).format("YYYY.MM.DD")}
                      {comp.location && ` · ${comp.location}`}
                    </p>
                  </div>
                  <div className={s.itemActions}>
                    <select
                      className={s.statusSelect}
                      value={comp.status}
                      onChange={(e) => statusMutation.mutate({ id: comp.id, status: e.target.value })}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>{STATUS_LABELS[st]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className={s.empty}>등록된 대회가 없습니다</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
