"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { isLoggedIn, getUser } from "@/lib/auth";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Post } from "@/types";
import s from "../../users/adminUsers.module.css";
import ps from "../adminPosts.module.css";

export default function ReportedPostsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const user = getUser();

  useEffect(() => {
    if (!isLoggedIn() || user?.role !== "ROLE_ADMIN") router.replace("/");
  }, [router, user]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "posts", "reported"],
    queryFn: async () => (await adminApi.getReportedPosts()).data.data,
    enabled: isLoggedIn() && user?.role === "ROLE_ADMIN",
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deletePost(id),
    onSuccess: () => {
      toast.success("게시글이 삭제되었습니다.");
      qc.invalidateQueries({ queryKey: ["admin", "posts", "reported"] });
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const clearReportsMutation = useMutation({
    mutationFn: (id: number) => adminApi.clearReports(id),
    onSuccess: () => {
      toast.success("신고가 초기화되었습니다.");
      qc.invalidateQueries({ queryKey: ["admin", "posts", "reported"] });
    },
    onError: () => toast.error("처리에 실패했습니다."),
  });

  const posts: Post[] = data?.content ?? data ?? [];

  return (
    <div>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>신고된 게시글</h1>
        <Link href="/admin/posts" className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13, textDecoration: "none", display: "inline-block" }}>
          ← 전체 게시글
        </Link>
      </div>

      {isLoading ? (
        <div className={s.tableWrap}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: 56, background: "var(--bg-card)", marginBottom: 4, animation: "pulse 1.4s ease-in-out infinite" }} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className={s.empty} style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          신고된 게시글이 없습니다.
        </div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th className={s.th}>게시글</th>
                <th className={s.th}>작성자</th>
                <th className={s.th}>신고 수</th>
                <th className={s.th}>작성일</th>
                <th className={s.th}>관리</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className={s.tr}>
                  <td className={s.td} style={{ maxWidth: 360 }}>
                    <Link href={`/community/${post.id}`} className={ps.postTitle} target="_blank" rel="noopener">
                      {post.title}
                    </Link>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                      {post.content?.slice(0, 60)}...
                    </p>
                  </td>
                  <td className={s.td}>{post.userName}</td>
                  <td className={s.td}>
                    <span style={{ color: "var(--red)", fontWeight: 700 }}>{post.reportCount ?? 0}</span>건
                  </td>
                  <td className={s.td}>{dayjs(post.createdAt).format("YYYY.MM.DD")}</td>
                  <td className={s.td}>
                    <div className={ps.actionBtns}>
                      <button
                        className={ps.unpinBtn}
                        onClick={() => { if (window.confirm("신고를 초기화하시겠습니까?")) clearReportsMutation.mutate(post.id); }}
                        disabled={clearReportsMutation.isPending}
                      >
                        신고 초기화
                      </button>
                      <button
                        className={ps.deleteBtn}
                        onClick={() => { if (window.confirm("게시글을 삭제하시겠습니까?")) deleteMutation.mutate(post.id); }}
                        disabled={deleteMutation.isPending}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
