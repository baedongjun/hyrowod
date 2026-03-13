"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { communityApi } from "@/lib/api";
import { PostCategory } from "@/types";
import { isLoggedIn } from "@/lib/auth";
import { toast } from "react-toastify";
import s from "../../write/write.module.css";

const CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: "FREE", label: "자유게시판" },
  { value: "QNA", label: "질문/답변" },
  { value: "RECORD", label: "운동 기록" },
  { value: "MARKET", label: "중고장터" },
];

export default function PostEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("FREE");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, []);

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => (await communityApi.getPost(postId)).data.data,
    enabled: !!postId,
  });

  useEffect(() => {
    if (post && !loaded) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setCategory(post.category || "FREE");
      setLoaded(true);
    }
  }, [post, loaded]);

  const mutation = useMutation({
    mutationFn: () => communityApi.updatePost(postId, { title, content, category }),
    onSuccess: () => {
      toast.success("게시글이 수정되었습니다.");
      router.push(`/community/${postId}`);
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className={s.page}>
      <div className={s.content}>
        <Link href={`/community/${postId}`} className={s.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          게시글 보기
        </Link>

        <h1 className={s.pageTitle}>글 수정</h1>

        <div className={s.card}>
          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label className={s.label}>카테고리</label>
              <select className={s.select} value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className={s.field}>
              <label className={s.label}>제목</label>
              <input
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className={s.field}>
              <label className={s.label}>내용</label>
              <textarea
                className={s.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className={s.actions}>
              <Link href={`/community/${postId}`} className="btn-secondary" style={{ padding: "12px 24px" }}>
                취소
              </Link>
              <button type="submit" className="btn-primary" disabled={mutation.isPending} style={{ padding: "12px 32px" }}>
                {mutation.isPending ? "저장 중..." : "수정 완료"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
