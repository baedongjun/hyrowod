"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rankingApi } from "@/lib/api";
import { NamedWod, NamedWodCategory, ScoreType, NamedWodRecord } from "@/types";
import { toast } from "react-toastify";
import s from "../admin.module.css";

const CATEGORY_OPTIONS: NamedWodCategory[] = ["GIRLS", "HEROES", "BENCHMARK", "CUSTOM"];
const SCORE_TYPES: ScoreType[] = ["TIME", "REPS", "WEIGHT", "ROUNDS"];

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "GIRLS" as NamedWodCategory,
  scoreType: "TIME" as ScoreType,
  scoreUnit: "",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "대기중",
  VERIFIED: "인증완료",
  REJECTED: "거절됨",
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: "#f59e0b",
  VERIFIED: "#22c55e",
  REJECTED: "#e8220a",
};

export default function AdminRankingPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"wods" | "verify">("wods");

  // ── WOD 관리 상태 ──
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // ── 기록 인증 상태 ──
  const [pendingPage, setPendingPage] = useState(0);
  const [rejectComment, setRejectComment] = useState<Record<number, string>>({});

  // ── 쿼리 ──
  const { data: wods = [], isLoading: wodsLoading } = useQuery<NamedWod[]>({
    queryKey: ["admin", "ranking", "wods"],
    queryFn: async () => (await rankingApi.getWods()).data.data,
    enabled: tab === "wods",
  });

  const { data: pendingPage_data, isLoading: pendingLoading } = useQuery({
    queryKey: ["admin", "ranking", "pending", pendingPage],
    queryFn: async () => (await rankingApi.getPendingRecords(pendingPage, 15)).data.data,
    enabled: tab === "verify",
  });

  const pendingRecords: NamedWodRecord[] = pendingPage_data?.content ?? [];
  const totalPages: number = pendingPage_data?.totalPages ?? 0;
  const totalElements: number = pendingPage_data?.totalElements ?? 0;

  // ── WOD 뮤테이션 ──
  const createMutation = useMutation({
    mutationFn: () => rankingApi.createWod(form),
    onSuccess: () => {
      toast.success("Named WOD가 등록되었습니다.");
      qc.invalidateQueries({ queryKey: ["admin", "ranking"] });
      qc.invalidateQueries({ queryKey: ["ranking"] });
      setShowForm(false);
      setForm(EMPTY_FORM);
    },
    onError: () => toast.error("등록에 실패했습니다."),
  });

  const updateMutation = useMutation({
    mutationFn: () => rankingApi.updateWod(editId!, form),
    onSuccess: () => {
      toast.success("수정되었습니다.");
      qc.invalidateQueries({ queryKey: ["admin", "ranking"] });
      qc.invalidateQueries({ queryKey: ["ranking"] });
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => rankingApi.toggleWodActive(id, active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "ranking"] });
      qc.invalidateQueries({ queryKey: ["ranking"] });
    },
    onError: () => toast.error("상태 변경에 실패했습니다."),
  });

  // ── 인증/거절 뮤테이션 ──
  const verifyMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => rankingApi.verifyRecord(id),
    onSuccess: () => {
      toast.success("기록이 인증되었습니다.");
      qc.invalidateQueries({ queryKey: ["admin", "ranking", "pending"] });
    },
    onError: () => toast.error("인증에 실패했습니다."),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: string }) =>
      rankingApi.rejectRecord(id, comment),
    onSuccess: (_, vars) => {
      toast.success("기록이 거절되었습니다.");
      setRejectComment((prev) => { const next = { ...prev }; delete next[vars.id]; return next; });
      qc.invalidateQueries({ queryKey: ["admin", "ranking", "pending"] });
    },
    onError: () => toast.error("거절 처리에 실패했습니다."),
  });

  const handleEdit = (wod: NamedWod) => {
    setEditId(wod.id);
    setForm({ name: wod.name, description: wod.description || "", category: wod.category, scoreType: wod.scoreType, scoreUnit: wod.scoreUnit || "" });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("이름을 입력하세요.");
    if (editId) { updateMutation.mutate(); } else { createMutation.mutate(); }
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>랭킹 관리</h1>
        {tab === "wods" && (
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}>
            + Named WOD 추가
          </button>
        )}
      </div>

      {/* 탭 */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
        <button
          onClick={() => setTab("wods")}
          style={{ background: "transparent", border: "none", borderBottom: tab === "wods" ? "2px solid var(--red)" : "2px solid transparent", color: tab === "wods" ? "var(--text)" : "var(--muted)", padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: -1 }}
        >
          WOD 관리
        </button>
        <button
          onClick={() => setTab("verify")}
          style={{ background: "transparent", border: "none", borderBottom: tab === "verify" ? "2px solid var(--red)" : "2px solid transparent", color: tab === "verify" ? "var(--text)" : "var(--muted)", padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: -1, display: "flex", alignItems: "center", gap: 6 }}
        >
          기록 인증
          {totalElements > 0 && tab !== "verify" && (
            <span style={{ background: "var(--red)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 0 }}>
              {totalElements}
            </span>
          )}
        </button>
      </div>

      {/* ── WOD 관리 탭 ── */}
      {tab === "wods" && (
        <>
          {showForm && (
            <form className={s.formCard} onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 20px", color: "var(--text)", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1 }}>
                {editId ? "WOD 수정" : "WOD 등록"}
              </h3>
              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label className={s.label}>WOD 이름 *</label>
                  <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Fran, Murph, ..." />
                </div>
                <div className={s.formGroup}>
                  <label className={s.label}>카테고리</label>
                  <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as NamedWodCategory })}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label className={s.label}>점수 타입</label>
                  <select className="input-field" value={form.scoreType} onChange={(e) => setForm({ ...form, scoreType: e.target.value as ScoreType })}>
                    {SCORE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className={s.formGroup}>
                  <label className={s.label}>점수 단위</label>
                  <input className="input-field" value={form.scoreUnit} onChange={(e) => setForm({ ...form, scoreUnit: e.target.value })} placeholder="초, kg, 회, 라운드..." />
                </div>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>설명 (와드 동작 설명)</label>
                <textarea className="input-field" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={"21-15-9\nThruster (43/29 kg)\nPull-up"} style={{ resize: "vertical" }} />
              </div>
              <div className={s.formActions}>
                <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editId ? "수정" : "등록"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null); }}>
                  취소
                </button>
              </div>
            </form>
          )}

          {wodsLoading ? (
            <p style={{ color: "var(--muted)" }}>로딩 중...</p>
          ) : (
            <table className={s.table}>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>카테고리</th>
                  <th>점수 타입</th>
                  <th>인증 기록</th>
                  <th>활성</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {wods.map((wod) => (
                  <tr key={wod.id}>
                    <td style={{ fontWeight: 700, color: "var(--text)" }}>{wod.name}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{wod.category}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{wod.scoreType}</td>
                    <td>{wod.verifiedCount}</td>
                    <td>
                      <button
                        style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", padding: "3px 10px", fontSize: 11, cursor: "pointer" }}
                        onClick={() => toggleMutation.mutate({ id: wod.id, active: true })}
                      >
                        활성
                      </button>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{ fontSize: 12, padding: "4px 12px" }} onClick={() => handleEdit(wod)}>
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ── 기록 인증 탭 ── */}
      {tab === "verify" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            인증 대기 기록 <strong style={{ color: "var(--text)" }}>{totalElements}건</strong> — YouTube 영상을 확인 후 인증 또는 거절하세요.
          </p>

          {pendingLoading ? (
            <p style={{ color: "var(--muted)" }}>로딩 중...</p>
          ) : pendingRecords.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              인증 대기 중인 기록이 없습니다.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pendingRecords.map((record) => (
                <div key={record.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: `3px solid ${STATUS_COLOR[record.status]}`, padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

                    {/* 기록 정보 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: "var(--red)", letterSpacing: 1 }}>{record.namedWodName}</span>
                        <span style={{ fontSize: 11, border: "1px solid var(--border)", color: "var(--muted)", padding: "1px 6px" }}>{record.scoreType}</span>
                        <span style={{ fontSize: 11, background: `${STATUS_COLOR[record.status]}20`, color: STATUS_COLOR[record.status], border: `1px solid ${STATUS_COLOR[record.status]}`, padding: "1px 6px", fontWeight: 700 }}>
                          {STATUS_LABEL[record.status]}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{record.userName}</span>
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>·</span>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "var(--text)" }}>{record.scoreFormatted}</span>
                        {record.scoreUnit && <span style={{ fontSize: 12, color: "var(--muted)" }}>{record.scoreUnit}</span>}
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>{record.recordedAt}</span>
                      </div>

                      {record.notes && (
                        <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 6px", fontStyle: "italic" }}>{record.notes}</p>
                      )}

                      <a
                        href={record.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#fff", background: "#e8220a", padding: "5px 12px", textDecoration: "none", fontWeight: 700 }}
                      >
                        ▶ YouTube 영상 확인
                      </a>
                    </div>

                    {/* 인증/거절 액션 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
                      <button
                        style={{ background: "#22c55e", color: "#fff", border: "none", padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" }}
                        disabled={verifyMutation.isPending}
                        onClick={() => verifyMutation.mutate({ id: record.id })}
                      >
                        ✓ 인증
                      </button>

                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <input
                          type="text"
                          placeholder="거절 사유 (선택)"
                          value={rejectComment[record.id] ?? ""}
                          onChange={(e) => setRejectComment((prev) => ({ ...prev, [record.id]: e.target.value }))}
                          style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", padding: "6px 10px", fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box" }}
                        />
                        <button
                          style={{ background: "transparent", color: "var(--red)", border: "1px solid var(--red)", padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}
                          disabled={rejectMutation.isPending}
                          onClick={() => rejectMutation.mutate({ id: record.id, comment: rejectComment[record.id] ?? "" })}
                        >
                          ✕ 거절
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div style={{ display: "flex", gap: 8, justifyContent: "center", paddingTop: 8 }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: 12, padding: "6px 16px" }}
                    disabled={pendingPage === 0}
                    onClick={() => setPendingPage((p) => p - 1)}
                  >
                    이전
                  </button>
                  <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center" }}>
                    {pendingPage + 1} / {totalPages}
                  </span>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: 12, padding: "6px 16px" }}
                    disabled={pendingPage >= totalPages - 1}
                    onClick={() => setPendingPage((p) => p + 1)}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
