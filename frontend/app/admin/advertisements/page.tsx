"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { advertisementApi } from "@/lib/api";
import s from "./adminAds.module.css";

interface Ad {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  position: string;
  priority: number;
  active: boolean;
  createdAt: string;
}

const POSITIONS = [
  { value: "BANNER", label: "배너 (메인)" },
  { value: "SIDEBAR", label: "사이드바 (커뮤니티)" },
  { value: "COMMUNITY", label: "커뮤니티 인라인" },
  { value: "BOXES", label: "박스 검색" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  position: "BANNER",
  priority: 0,
};

export default function AdminAdvertisementsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });
  const [positionFilter, setPositionFilter] = useState("ALL");

  const { data: ads, isLoading } = useQuery({
    queryKey: ["advertisements", "all"],
    queryFn: async () => (await advertisementApi.getAds()).data.data as Ad[],
    staleTime: 1000 * 60,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      advertisementApi.createAd({
        ...form,
        priority: Number(form.priority),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      setForm({ ...EMPTY_FORM });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      advertisementApi.updateAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      setEditingId(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      advertisementApi.toggleActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => advertisementApi.deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    createMutation.mutate();
  };

  const handleEditSave = (id: number) => {
    updateMutation.mutate({
      id,
      data: { ...editForm, priority: Number(editForm.priority) },
    });
  };

  const startEdit = (ad: Ad) => {
    setEditingId(ad.id);
    setEditForm({
      title: ad.title,
      description: ad.description ?? "",
      imageUrl: ad.imageUrl ?? "",
      linkUrl: ad.linkUrl ?? "",
      position: ad.position,
      priority: ad.priority,
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("광고를 삭제하시겠습니까?")) return;
    deleteMutation.mutate(id);
  };

  const filteredAds =
    positionFilter === "ALL"
      ? (ads ?? [])
      : (ads ?? []).filter((a) => a.position === positionFilter);

  const positionLabel = (pos: string) =>
    POSITIONS.find((p) => p.value === pos)?.label ?? pos;

  return (
    <div>
      <h1 className={s.pageTitle}>광고 관리</h1>

      {/* 광고 등록 폼 */}
      <div className={s.panel}>
        <p className={s.panelTitle}>새 광고 등록</p>
        <form onSubmit={handleCreate} className={s.form}>
          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label className={s.label}>제목 *</label>
              <input
                className={s.input}
                type="text"
                placeholder="광고 제목"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>위치</label>
              <select
                className={s.select}
                value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
              >
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className={s.formGroupSmall}>
              <label className={s.label}>우선순위</label>
              <input
                className={s.input}
                type="number"
                min={0}
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label className={s.label}>설명</label>
              <input
                className={s.input}
                type="text"
                placeholder="짧은 설명 (선택)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>이미지 URL</label>
              <input
                className={s.input}
                type="url"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>링크 URL</label>
              <input
                className={s.input}
                type="url"
                placeholder="https://..."
                value={form.linkUrl}
                onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn-primary ${s.submitBtn}`}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "등록 중..." : "광고 등록"}
          </button>
        </form>
      </div>

      {/* 광고 목록 */}
      <div className={s.panel} style={{ marginTop: "1px" }}>
        <div className={s.listHeader}>
          <p className={s.panelTitle}>광고 목록</p>
          <div className={s.filterWrap}>
            <select
              className={s.select}
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="ALL">전체 위치</option>
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className={s.loading}>로딩 중...</div>
        ) : filteredAds.length === 0 ? (
          <div className={s.empty}>등록된 광고가 없습니다</div>
        ) : (
          <div className={s.adList}>
            {filteredAds.map((ad) => (
              <div key={ad.id} className={`${s.adCard} ${!ad.active ? s.adCardInactive : ""}`}>
                {editingId === ad.id ? (
                  /* Edit mode */
                  <div className={s.editForm}>
                    <div className={s.formRow}>
                      <div className={s.formGroup}>
                        <label className={s.label}>제목</label>
                        <input
                          className={s.input}
                          value={editForm.title}
                          onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        />
                      </div>
                      <div className={s.formGroup}>
                        <label className={s.label}>위치</label>
                        <select
                          className={s.select}
                          value={editForm.position}
                          onChange={(e) => setEditForm((f) => ({ ...f, position: e.target.value }))}
                        >
                          {POSITIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className={s.formGroupSmall}>
                        <label className={s.label}>우선순위</label>
                        <input
                          className={s.input}
                          type="number"
                          min={0}
                          value={editForm.priority}
                          onChange={(e) => setEditForm((f) => ({ ...f, priority: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                    <div className={s.formRow}>
                      <div className={s.formGroup}>
                        <label className={s.label}>설명</label>
                        <input
                          className={s.input}
                          value={editForm.description}
                          onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        />
                      </div>
                      <div className={s.formGroup}>
                        <label className={s.label}>이미지 URL</label>
                        <input
                          className={s.input}
                          type="url"
                          value={editForm.imageUrl}
                          onChange={(e) => setEditForm((f) => ({ ...f, imageUrl: e.target.value }))}
                        />
                      </div>
                      <div className={s.formGroup}>
                        <label className={s.label}>링크 URL</label>
                        <input
                          className={s.input}
                          type="url"
                          value={editForm.linkUrl}
                          onChange={(e) => setEditForm((f) => ({ ...f, linkUrl: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className={s.editActions}>
                      <button
                        className={s.saveBtn}
                        onClick={() => handleEditSave(ad.id)}
                        disabled={updateMutation.isPending}
                      >
                        저장
                      </button>
                      <button
                        className={s.cancelBtn}
                        onClick={() => setEditingId(null)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <>
                    <div className={s.adInfo}>
                      <div className={s.adMeta}>
                        <span className={s.adPosition}>{positionLabel(ad.position)}</span>
                        <span className={s.adPriority}>우선순위 {ad.priority}</span>
                        {!ad.active && <span className={s.inactiveBadge}>비활성</span>}
                      </div>
                      <p className={s.adTitle}>{ad.title}</p>
                      {ad.description && <p className={s.adDesc}>{ad.description}</p>}
                      <div className={s.adUrls}>
                        {ad.imageUrl && (
                          <span className={s.urlChip}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                            이미지
                          </span>
                        )}
                        {ad.linkUrl && (
                          <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className={s.urlChip}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                            </svg>
                            링크
                          </a>
                        )}
                      </div>
                    </div>

                    <div className={s.adActions}>
                      <button
                        className={ad.active ? s.toggleActiveBtn : s.toggleInactiveBtn}
                        onClick={() => toggleMutation.mutate({ id: ad.id, active: !ad.active })}
                        disabled={toggleMutation.isPending}
                      >
                        {ad.active ? "비활성화" : "활성화"}
                      </button>
                      <button
                        className={s.editBtn}
                        onClick={() => startEdit(ad)}
                      >
                        수정
                      </button>
                      <button
                        className={s.deleteBtn}
                        onClick={() => handleDelete(ad.id)}
                        disabled={deleteMutation.isPending}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
