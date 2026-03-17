"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, communityApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import s from "./comments.module.css";

interface MyComment {
  id: number;
  content: string;
  postId: number;
  postTitle: string;
  createdAt: string;
}

export default function MyCommentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, [router]);

  const { data, isLoading } = useQuery({
    queryKey: ["comments", "mine", page],
    queryFn: async () => (await userApi.getMyComments(page)).data.data,
    enabled: isLoggedIn(),
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => communityApi.deleteComment(commentId),
    onSuccess: () => {
      toast.success("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["comments", "mine"] });
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      communityApi.updateComment(id, content),
    onSuccess: () => {
      toast.success("댓글이 수정되었습니다.");
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["comments", "mine"] });
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const comments: MyComment[] = data?.content || [];
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
        <h1 className={s.title}>내가 쓴 댓글</h1>
        <p className={s.sub}>총 {data?.totalElements || 0}개</p>

        {isLoading ? (
          <div className={s.list}>
            {[...Array(5)].map((_, i) => <div key={i} className={s.skeleton} />)}
          </div>
        ) : comments.length === 0 ? (
          <div className={s.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--muted)" }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p>아직 작성한 댓글이 없습니다</p>
            <Link href="/community" className="btn-primary" style={{ marginTop: 8, padding: "10px 24px", fontSize: 14, display: "inline-block" }}>
              커뮤니티 가기
            </Link>
          </div>
        ) : (
          <>
            <div className={s.list}>
              {comments.map((comment) => (
                <div key={comment.id} className={s.item}>
                  <Link href={`/community/${comment.postId}`} className={s.postRef}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {comment.postTitle}
                  </Link>
                  {editId === comment.id ? (
                    <div className={s.editForm}>
                      <textarea
                        className={s.editTextarea}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                      />
                      <div className={s.editActions}>
                        <button
                          className="btn-primary"
                          style={{ padding: "7px 18px", fontSize: 13 }}
                          disabled={!editText.trim() || updateMutation.isPending}
                          onClick={() => updateMutation.mutate({ id: comment.id, content: editText })}
                        >
                          저장
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: "7px 18px", fontSize: 13 }}
                          onClick={() => setEditId(null)}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={s.content}>{comment.content}</p>
                      <div className={s.footer}>
                        <span className={s.date}>{dayjs(comment.createdAt).format("YYYY.MM.DD HH:mm")}</span>
                        <div className={s.actions}>
                          <button
                            className={s.editBtn}
                            onClick={() => { setEditId(comment.id); setEditText(comment.content); }}
                          >
                            수정
                          </button>
                          <button
                            className={s.deleteBtn}
                            onClick={() => { if (confirm("댓글을 삭제하시겠습니까?")) deleteMutation.mutate(comment.id); }}
                            disabled={deleteMutation.isPending}
                          >
                            삭제
                          </button>
                        </div>
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
