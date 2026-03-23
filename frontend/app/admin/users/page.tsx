"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { toast } from "react-toastify";
import s from "./adminUsers.module.css";

interface UserItem {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  active: boolean;
}

const ROLE_OPTIONS = ["ROLE_USER", "ROLE_BOX_OWNER", "ROLE_ADMIN"];
const ROLE_LABEL: Record<string, string> = {
  ROLE_USER: "일반 회원",
  ROLE_BOX_OWNER: "박스 오너",
  ROLE_ADMIN: "관리자",
};

export default function AdminUsersPage() {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editTarget, setEditTarget] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page, keyword],
    queryFn: async () => (await adminApi.getUsers(page, keyword || undefined)).data.data,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  };

  const activeMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      adminApi.toggleUserActive(id, active),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); toast.success("변경되었습니다."); },
    onError: () => toast.error("오류가 발생했습니다."),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      adminApi.updateUserRole(id, role),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); toast.success("역할이 변경되었습니다."); },
    onError: () => toast.error("오류가 발생했습니다."),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; phone?: string } }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("회원 정보가 수정되었습니다.");
      setEditTarget(null);
    },
    onError: () => toast.error("수정 중 오류가 발생했습니다."),
  });

  const openEdit = (user: UserItem) => {
    setEditTarget(user);
    setEditName(user.name ?? "");
    setEditPhone(user.phone ?? "");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    editMutation.mutate({ id: editTarget.id, data: { name: editName, phone: editPhone } });
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>회원 관리</h1>
        <form onSubmit={handleSearch} className={s.searchForm}>
          <input
            type="text"
            className={s.searchInput}
            placeholder="이름 또는 이메일 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className={s.searchBtn}>검색</button>
          {keyword && (
            <button type="button" className={s.searchClear} onClick={() => { setKeyword(""); setSearchInput(""); setPage(0); }}>✕ 초기화</button>
          )}
        </form>
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>이름</th>
              <th className={s.th}>이메일</th>
              <th className={s.th}>전화번호</th>
              <th className={`${s.th} ${s.thCenter}`}>역할</th>
              <th className={`${s.th} ${s.thCenter}`}>상태</th>
              <th className={`${s.th} ${s.thCenter}`}>관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className={s.tr}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className={s.td}><div className={s.skeletonCell} /></td>
                  ))}
                </tr>
              ))
            ) : (
              data?.content?.map((user: UserItem) => (
                <tr key={user.id} className={s.tr}>
                  <td className={`${s.td} ${s.tdName}`}>{user.name}</td>
                  <td className={s.td}>{user.email}</td>
                  <td className={s.td}>{user.phone || "—"}</td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <select
                      className={s.roleSelect}
                      value={user.role}
                      onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value })}
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <button
                      onClick={() => activeMutation.mutate({ id: user.id, active: !user.active })}
                      className={`${s.activeBtn} ${user.active ? s.activeBtnOn : s.activeBtnOff}`}
                    >
                      {user.active ? "활성" : "비활성"}
                    </button>
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <button className={s.editBtn} onClick={() => openEdit(user)}>수정</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {data && data.totalPages > 1 && (
          <div className={s.pagination}>
            <button onClick={() => setPage(page - 1)} disabled={data.first} className="btn-secondary">이전</button>
            <span className={s.pageInfo}>{data.number + 1} / {data.totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={data.last} className="btn-secondary">다음</button>
          </div>
        )}
      </div>

      {/* 수정 모달 */}
      {editTarget && (
        <div className={s.overlay} onClick={() => setEditTarget(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>회원 정보 수정</h2>
              <button className={s.modalClose} onClick={() => setEditTarget(null)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className={s.modalForm}>
              <div className={s.infoRow}>
                <span className={s.infoLabel}>이메일</span>
                <span className={s.infoValue}>{editTarget.email}</span>
              </div>
              <div className={s.formField}>
                <label className={s.fieldLabel}>이름 *</label>
                <input
                  className={s.fieldInput}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className={s.formField}>
                <label className={s.fieldLabel}>전화번호</label>
                <input
                  className={s.fieldInput}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="예: 010-1234-5678"
                />
              </div>
              <div className={s.modalActions}>
                <button type="button" className="btn-secondary" onClick={() => setEditTarget(null)}>취소</button>
                <button type="submit" className="btn-primary" disabled={editMutation.isPending}>
                  {editMutation.isPending ? "저장 중..." : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
