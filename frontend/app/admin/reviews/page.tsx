"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import s from "../users/adminUsers.module.css";
import rs from "./adminReviews.module.css";

export default function AdminReviewsPage() {
  const [page, setPage] = useState(0);
  const [minRating, setMinRating] = useState<number | "">("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews", page, minRating],
    queryFn: async () => (await adminApi.getReviews(page, minRating === "" ? undefined : minRating)).data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("리뷰가 삭제되었습니다.");
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const handleDelete = (id: number, boxName: string) => {
    if (!window.confirm(`"${boxName}" 리뷰를 삭제하시겠습니까?`)) return;
    deleteMutation.mutate(id);
  };

  const ratingStars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div>
      <h1 className={s.pageTitle}>리뷰 관리</h1>

      {/* Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: "var(--muted)" }}>최소 별점</label>
        <select
          value={minRating}
          onChange={(e) => { setMinRating(e.target.value === "" ? "" : Number(e.target.value)); setPage(0); }}
          className={s.roleSelect}
        >
          <option value="">전체</option>
          {[1,2,3,4,5].map((r) => (
            <option key={r} value={r}>{r}점 이상</option>
          ))}
        </select>
        {minRating !== "" && (
          <button
            onClick={() => { setMinRating(""); setPage(0); }}
            className={s.searchClear}
          >
            초기화
          </button>
        )}
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>박스</th>
              <th className={s.th}>작성자</th>
              <th className={`${s.th} ${s.thCenter}`}>별점</th>
              <th className={s.th}>내용</th>
              <th className={`${s.th} ${s.thCenter}`}>작성일</th>
              <th className={`${s.th} ${s.thCenter}`}>관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className={s.tr}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className={s.td}><div className={s.skeletonCell} /></td>
                  ))}
                </tr>
              ))
            ) : (
              data?.content?.map((review: {
                id: number;
                boxName: string;
                userName: string;
                rating: number;
                content: string;
                createdAt: string;
              }) => (
                <tr key={review.id} className={s.tr}>
                  <td className={`${s.td} ${s.tdName}`}>{review.boxName}</td>
                  <td className={s.td}>{review.userName}</td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <span className={rs.stars} style={{ color: review.rating >= 4 ? "#eab308" : review.rating <= 2 ? "var(--red)" : "var(--muted)" }}>
                      {ratingStars(review.rating)}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>{review.rating}점</span>
                  </td>
                  <td className={s.td}>
                    <span className={rs.reviewContent}>{review.content}</span>
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    {dayjs(review.createdAt).format("MM.DD HH:mm")}
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <button
                      onClick={() => handleDelete(review.id, review.boxName)}
                      className={rs.deleteBtn}
                      disabled={deleteMutation.isPending}
                    >
                      삭제
                    </button>
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
