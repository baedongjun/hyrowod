"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, communityApi } from "@/lib/api";
import { isLoggedIn, getUser } from "@/lib/auth";
import { Post } from "@/types";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import s from "./my.module.css";

const ROLE_LABEL: Record<string, string> = {
  ROLE_USER: "일반 회원",
  ROLE_BOX_OWNER: "박스 오너",
  ROLE_ADMIN: "관리자",
};

const CATEGORY_BADGE: Record<string, string> = {
  FREE: "badge-default", QNA: "badge-upcoming", RECORD: "badge-open", MARKET: "badge-amrap",
};
const CATEGORY_LABEL: Record<string, string> = {
  FREE: "자유", QNA: "Q&A", RECORD: "기록", MARKET: "장터",
};

export default function MyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const localUser = getUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await userApi.getMe()).data.data,
    enabled: isLoggedIn(),
  });

  const { data: myPosts } = useQuery({
    queryKey: ["posts", "mine"],
    queryFn: async () => (await communityApi.getPosts({ page: 0 })).data.data,
    enabled: isLoggedIn(),
  });

  useEffect(() => {
    if (me) {
      setName(me.name || "");
      setPhone(me.phone || "");
    }
  }, [me]);

  const updateMutation = useMutation({
    mutationFn: () => userApi.updateMe({ name, phone }),
    onSuccess: () => {
      toast.success("정보가 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  if (!isLoggedIn()) return null;

  const user = me || localUser;

  return (
    <div className={s.page}>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.avatar}>
            {me?.profileImageUrl
              ? <img src={me.profileImageUrl} alt="" className={s.avatarImg} />
              : (user?.name?.[0] || "U")
            }
          </div>
          <div className={s.heroInfo}>
            <p className={s.heroName}>{user?.name || "—"}</p>
            <p className={s.heroEmail}>{user?.email || ""}</p>
            <div className={s.heroBadge}>
              <span className="badge badge-default">
                {ROLE_LABEL[user?.role || "ROLE_USER"] || user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={s.content}>
        {/* 정보 수정 */}
        <div className={s.formCard}>
          <p className={s.cardTitle}>내 정보 수정</p>
          <div className={s.form}>
            <div className={s.field}>
              <label className={s.label}>이메일</label>
              <p className={s.staticValue}>{me?.email || localUser?.email}</p>
            </div>
            <div className={s.field}>
              <label className={s.label}>이름</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>전화번호</label>
              <input
                type="tel"
                className="input-field"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              className={`btn-primary ${s.submitBtn}`}
              disabled={updateMutation.isPending || !name.trim()}
              onClick={() => updateMutation.mutate()}
            >
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>

        {/* 활동 통계 */}
        <div>
          <div className={s.statsCard}>
            <p className={s.statsHeader}>내 활동</p>
            <div className={s.statsGrid}>
              <div className={s.statItem}>
                <p className={s.statNum}>{myPosts?.totalElements || 0}</p>
                <p className={s.statLabel}>작성 게시글</p>
              </div>
              <div className={s.statItem}>
                <p className={s.statNum}>0</p>
                <p className={s.statLabel}>작성 후기</p>
              </div>
            </div>
          </div>
        </div>

        {/* 내 게시글 */}
        <div className={s.postsCard}>
          <p className={s.postsHeader}>내가 쓴 게시글</p>
          {myPosts?.content?.length > 0 ? (
            <div className={s.postList}>
              {myPosts.content.slice(0, 10).map((post: Post) => (
                <Link key={post.id} href={`/community/${post.id}`} className={s.postItem}>
                  <span className={`badge ${CATEGORY_BADGE[post.category] || "badge-default"}`}>
                    {CATEGORY_LABEL[post.category]}
                  </span>
                  <span className={s.postTitle}>{post.title}</span>
                  <span className={s.postDate}>{dayjs(post.createdAt).format("MM.DD")}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className={s.empty}>아직 작성한 게시글이 없습니다</div>
          )}
        </div>
      </div>
    </div>
  );
}
