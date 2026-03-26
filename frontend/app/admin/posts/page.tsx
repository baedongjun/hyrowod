"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Link from "next/link";
import s from "../users/adminUsers.module.css";
import ps from "./adminPosts.module.css";

const CATEGORY_LABEL: Record<string, string> = {
  FREE: "자유", QNA: "Q&A", RECORD: "기록", MARKET: "장터",
};

export default function AdminPostsPage() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPinned, setFilterPinned] = useState("");
  const [filterReported, setFilterReported] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedKeyword(searchInput); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filters = {
    keyword: debouncedKeyword || undefined,
    category: filterCategory || undefined,
    pinned: filterPinned === "" ? undefined : filterPinned === "true",
    reportedOnly: filterReported || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "posts", page, filters],
    queryFn: async () => (await adminApi.getPosts(page, filters)).data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      toast.success("게시글이 삭제되었습니다.");
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const pinMutation = useMutation({
    mutationFn: (id: number) => adminApi.togglePinPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      toast.success("공지 상태가 변경되었습니다.");
    },
    onError: () => toast.error("공지 변경에 실패했습니다."),
  });

  const handleDelete = (id: number, title: string) => {
    if (!window.confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>게시글 관리</h1>
        {data && <span className={s.filterCount}>{data.totalElements}개</span>}
      </div>

      <div className={s.filterBar}>
        <input
          className={s.filterInput}
          placeholder="제목 / 내용 / 작성자 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          className={s.filterSelect}
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(0); }}
        >
          <option value="">전체 카테고리</option>
          <option value="FREE">자유</option>
          <option value="QNA">Q&A</option>
          <option value="RECORD">기록</option>
          <option value="MARKET">장터</option>
        </select>
        <select
          className={s.filterSelect}
          value={filterPinned}
          onChange={(e) => { setFilterPinned(e.target.value); setPage(0); }}
        >
          <option value="">공지 전체</option>
          <option value="true">공지 고정</option>
          <option value="false">일반 게시글</option>
        </select>
        <label className={s.filterCheckLabel}>
          <input
            type="checkbox"
            checked={filterReported}
            onChange={(e) => { setFilterReported(e.target.checked); setPage(0); }}
            style={{ accentColor: "var(--red)" }}
          />
          신고된 게시글만
        </label>
        {(searchInput || filterCategory || filterPinned || filterReported) && (
          <button
            className={s.filterReset}
            onClick={() => { setSearchInput(""); setDebouncedKeyword(""); setFilterCategory(""); setFilterPinned(""); setFilterReported(false); setPage(0); }}
          >
            초기화
          </button>
        )}
        <Link
          href="/admin/posts/reported"
          className={s.reportedLink}
        >
          ⚠ 신고 목록
        </Link>
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>카테고리</th>
              <th className={s.th}>제목</th>
              <th className={s.th}>작성자</th>
              <th className={`${s.th} ${s.thCenter}`}>조회/좋아요/댓글</th>
              <th className={`${s.th} ${s.thCenter}`}>신고</th>
              <th className={`${s.th} ${s.thCenter}`}>작성일</th>
              <th className={`${s.th} ${s.thCenter}`}>관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className={s.tr}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className={s.td}><div className={s.skeletonCell} /></td>
                  ))}
                </tr>
              ))
            ) : (
              data?.content?.map((post: { id: number; category: string; title: string; userName: string; viewCount: number; likeCount: number; commentCount: number; createdAt: string; pinned: boolean; reportCount?: number }) => (
                <tr key={post.id} className={`${s.tr} ${post.pinned ? ps.pinnedRow : ""}`}>
                  <td className={s.td}>
                    <span className={ps.catBadge}>{CATEGORY_LABEL[post.category] || post.category}</span>
                  </td>
                  <td className={`${s.td} ${s.tdName}`}>
                    {post.pinned && <span className={ps.pinnedBadge}>📌 공지</span>}
                    <span className={ps.postTitle}>{post.title}</span>
                  </td>
                  <td className={s.td}>{post.userName}</td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <span className={ps.stats}>
                      {post.viewCount} / {post.likeCount} / {post.commentCount}
                    </span>
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    {(post.reportCount ?? 0) > 0 ? (
                      <span style={{ color: "var(--red)", fontWeight: 600, fontSize: 13 }}>⚠ {post.reportCount}</span>
                    ) : (
                      <span style={{ color: "var(--muted)", fontSize: 12 }}>-</span>
                    )}
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    {dayjs(post.createdAt).format("MM.DD HH:mm")}
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <div className={ps.actionBtns}>
                      <button
                        onClick={() => pinMutation.mutate(post.id)}
                        className={post.pinned ? ps.unpinBtn : ps.pinBtn}
                        disabled={pinMutation.isPending}
                        title={post.pinned ? "공지 해제" : "공지 고정"}
                      >
                        {post.pinned ? "해제" : "고정"}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className={ps.deleteBtn}
                        disabled={deleteMutation.isPending}
                      >
                        삭제
                      </button>
                    </div>
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
    </div>
  );
}
