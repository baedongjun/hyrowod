"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, boxApi } from "@/lib/api";
import { Review } from "@/types";
import { isLoggedIn } from "@/lib/auth";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import s from "./reviews.module.css";

export default function MyReviewsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, [router]);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", "mine", page],
    queryFn: async () => (await userApi.getMyReviews(page)).data.data,
    enabled: isLoggedIn(),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => boxApi.deleteReview(reviewId),
    onSuccess: () => {
      toast.success("후기가 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["reviews", "mine"] });
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, rating, content }: { id: number; rating: number; content: string }) =>
      boxApi.updateReview(id, { rating, content }),
    onSuccess: () => {
      toast.success("후기가 수정되었습니다.");
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["reviews", "mine"] });
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const reviews: Review[] = data?.content || [];
  const totalPages = data?.totalPages || 1;

  if (!isLoggedIn()) return null;

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <Link href="/my" className={s.back}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          마이페이지
        </Link>
        <h1 className={s.title}>내가 쓴 후기</h1>
        <p className={s.sub}>총 {data?.totalElements || 0}개</p>

        {isLoading ? (
          <div className={s.list}>
            {[...Array(5)].map((_, i) => <div key={i} className={s.skeleton} />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className={s.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--muted)" }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <p>아직 작성한 후기가 없습니다</p>
            <Link href="/boxes" className="btn-primary" style={{ marginTop: 8, padding: "10px 24px", fontSize: 14, display: "inline-block" }}>
              박스 찾기
            </Link>
          </div>
        ) : (
          <>
            <div className={s.list}>
              {reviews.map((review) => (
                <div key={review.id} className={s.item}>
                  {editId === review.id ? (
                    <div className={s.editForm}>
                      <div className={s.editStars}>
                        {[1,2,3,4,5].map((n) => (
                          <button
                            key={n}
                            className={`${s.starBtn} ${n <= editRating ? s.starActive : ""}`}
                            onClick={() => setEditRating(n)}
                            type="button"
                          >★</button>
                        ))}
                      </div>
                      <textarea
                        className={s.editTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                      />
                      <div className={s.editActions}>
                        <button
                          className="btn-primary"
                          style={{ padding: "8px 20px", fontSize: 13 }}
                          disabled={!editContent.trim() || updateMutation.isPending}
                          onClick={() => updateMutation.mutate({ id: review.id, rating: editRating, content: editContent })}
                        >
                          저장
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: "8px 20px", fontSize: 13 }}
                          onClick={() => setEditId(null)}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={s.itemHeader}>
                        <Link href={`/boxes/${review.boxId}`} className={s.boxName}>
                          {review.boxName || `박스 #${review.boxId}`}
                        </Link>
                        <span className={s.stars}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                        <span className={s.date}>{dayjs(review.createdAt).format("YYYY.MM.DD")}</span>
                      </div>
                      <p className={s.content}>{review.content}</p>
                      <div className={s.actions}>
                        <button
                          className={s.editBtn}
                          onClick={() => {
                            setEditId(review.id);
                            setEditRating(review.rating);
                            setEditContent(review.content);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className={s.deleteBtn}
                          onClick={() => { if (confirm("후기를 삭제하시겠습니까?")) deleteMutation.mutate(review.id); }}
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

            {totalPages > 1 && (
              <div className={s.pagination}>
                <button className={s.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>이전</button>
                <span className={s.pageInfo}>{page + 1} / {totalPages}</span>
                <button className={s.pageBtn} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>다음</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
