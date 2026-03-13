"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, wodApi } from "@/lib/api";
import { Wod } from "@/types";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import s from "./adminWod.module.css";

const WOD_TYPES = ["AMRAP","FOR_TIME","EMOM","TABATA","STRENGTH","SKILL","REST_DAY","CUSTOM"] as const;
const WOD_LABELS: Record<string, string> = {
  AMRAP:"AMRAP", FOR_TIME:"FOR TIME", EMOM:"EMOM", TABATA:"TABATA",
  STRENGTH:"STRENGTH", SKILL:"SKILL", REST_DAY:"REST DAY", CUSTOM:"CUSTOM",
};

const WOD_TYPE_BADGE: Record<string, string> = {
  AMRAP:"badge-amrap", FOR_TIME:"badge-fortime", EMOM:"badge-emom",
  STRENGTH:"badge-strength", SKILL:"badge-strength", TABATA:"badge-amrap",
  REST_DAY:"badge-default", CUSTOM:"badge-default",
};

export default function AdminWodPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    type: "AMRAP",
    content: "",
    scoreType: "",
    wodDate: dayjs().format("YYYY-MM-DD"),
  });

  const { data } = useQuery({
    queryKey: ["wod", "history"],
    queryFn: async () => (await wodApi.getHistory()).data.data,
  });

  const mutation = useMutation({
    mutationFn: () => adminApi.createCommonWod(form),
    onSuccess: () => {
      toast.success("WOD가 등록되었습니다.");
      setForm({ title: "", type: "AMRAP", content: "", scoreType: "", wodDate: dayjs().format("YYYY-MM-DD") });
      queryClient.invalidateQueries({ queryKey: ["wod"] });
    },
    onError: () => toast.error("등록에 실패했습니다."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteWod(id),
    onSuccess: () => {
      toast.success("WOD가 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["wod"] });
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("제목과 내용을 입력하세요.");
      return;
    }
    mutation.mutate();
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <h1 className={s.pageTitle}>WOD 관리</h1>
      <div className={s.grid}>
        {/* Form */}
        <div className={s.formCard}>
          <p className={s.formTitle}>WOD 등록</p>
          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label className={s.label}>날짜</label>
              <input type="date" className="input-field" value={form.wodDate} onChange={(e) => set("wodDate", e.target.value)} />
            </div>
            <div className={s.field}>
              <label className={s.label}>유형</label>
              <select className={s.select} value={form.type} onChange={(e) => set("type", e.target.value)}>
                {WOD_TYPES.map((t) => <option key={t} value={t}>{WOD_LABELS[t]}</option>)}
              </select>
            </div>
            <div className={s.field}>
              <label className={s.label}>제목</label>
              <input type="text" className="input-field" placeholder="WOD 제목" value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className={s.field}>
              <label className={s.label}>내용</label>
              <textarea
                className={s.textarea}
                placeholder={"3 Rounds For Time:\n21 Thrusters (43/29 kg)\n21 Pull-ups"}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>점수 유형 (선택)</label>
              <input type="text" className="input-field" placeholder="예: Time, Reps, Load" value={form.scoreType} onChange={(e) => set("scoreType", e.target.value)} />
            </div>
            <button type="submit" className={`btn-primary ${s.submitBtn}`} disabled={mutation.isPending}>
              {mutation.isPending ? "등록 중..." : "WOD 등록"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className={s.listCard}>
          <p className={s.listHeader}>등록된 WOD</p>
          <div className={s.list}>
            {data?.content?.length > 0 ? (
              data.content.map((wod: Wod) => (
                <div key={wod.id} className={s.item}>
                  <div className={s.itemDate}>
                    <p className={s.itemDateNum}>{dayjs(wod.wodDate).format("DD")}</p>
                    <p className={s.itemDateMon}>{dayjs(wod.wodDate).format("MMM")}</p>
                  </div>
                  <div className={s.itemBody}>
                    <span className={`badge ${WOD_TYPE_BADGE[wod.type] || "badge-default"}`}>
                      {WOD_LABELS[wod.type] || wod.type}
                    </span>
                    <p className={s.itemTitle}>{wod.title}</p>
                    <p className={s.itemSnippet}>{wod.content}</p>
                  </div>
                  <button
                    className={s.deleteBtn}
                    onClick={() => {
                      if (window.confirm(`"${wod.title}" WOD를 삭제하시겠습니까?`)) {
                        deleteMutation.mutate(wod.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    삭제
                  </button>
                </div>
              ))
            ) : (
              <div className={s.empty}>등록된 WOD가 없습니다</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
