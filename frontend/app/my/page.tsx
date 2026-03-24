"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, communityApi, uploadApi, boxApi, membershipApi, badgeApi, followApi, wodRecordApi } from "@/lib/api";
import { clearAuth } from "@/lib/auth";
import { Review, Box, BoxMembership, Badge } from "@/types";
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
const TIER_COLOR: Record<string, string> = {
  BRONZE: "#cd7f32", SILVER: "#c0c0c0", GOLD: "#eab308", PLATINUM: "#0ea5e9",
};
const TIER_ICON: Record<string, string> = {
  BRONZE: "🥉", SILVER: "🥈", GOLD: "🥇", PLATINUM: "💠",
};

type ContentTab = "posts" | "comments" | "reviews" | "favorites" | "badges" | "box";

export default function MyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const localUser = getUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentTab>("posts");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, [router]);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await userApi.getMe()).data.data,
    enabled: isLoggedIn(),
  });

  const { data: myPosts } = useQuery({
    queryKey: ["posts", "mine"],
    queryFn: async () => (await communityApi.getMyPosts()).data.data,
    enabled: isLoggedIn(),
  });

  const { data: myReviews } = useQuery({
    queryKey: ["reviews", "mine"],
    queryFn: async () => (await userApi.getMyReviews()).data.data,
    enabled: isLoggedIn(),
  });

  const { data: myFavorites } = useQuery({
    queryKey: ["favorites", "mine"],
    queryFn: async () => (await userApi.getMyFavorites()).data.data,
    enabled: isLoggedIn(),
  });

  const { data: myComments } = useQuery({
    queryKey: ["comments", "mine"],
    queryFn: async () => (await userApi.getMyComments()).data.data,
    enabled: isLoggedIn(),
  });

  const { data: myBox } = useQuery({
    queryKey: ["membership", "myBox"],
    queryFn: async () => (await membershipApi.getMyBox()).data.data as BoxMembership | null,
    enabled: isLoggedIn(),
  });

  const { data: myBadges } = useQuery({
    queryKey: ["badges", "mine"],
    queryFn: async () => (await badgeApi.getMyBadges()).data.data as Badge[],
    enabled: isLoggedIn(),
  });

  const { data: followCounts } = useQuery({
    queryKey: ["follow", "counts", me?.id],
    queryFn: async () =>
      (await followApi.getCounts(me.id as number)).data.data as { followerCount: number; followingCount: number },
    enabled: isLoggedIn() && !!me?.id,
  });

  const { data: streakInfo } = useQuery({
    queryKey: ["wod", "streak"],
    queryFn: async () => (await wodRecordApi.getStreak()).data.data as { currentStreak: number; totalWodCount: number },
    enabled: isLoggedIn(),
  });

  useEffect(() => {
    if (me) {
      setName(me.name || "");
      setPhone(me.phone || "");
    }
  }, [me]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const res = await uploadApi.uploadImage(file, "profile");
      const profileImageUrl = res.data.data as string;
      await userApi.updateMe({ name: me?.name || name, phone: me?.phone || phone, profileImageUrl });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("프로필 사진이 변경되었습니다.");
    } catch {
      toast.error("업로드에 실패했습니다.");
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const deleteAccountMutation = useMutation({
    mutationFn: () => userApi.deleteMyAccount(),
    onSuccess: () => {
      clearAuth();
      router.replace("/");
      toast.success("회원 탈퇴가 완료되었습니다.");
    },
    onError: () => toast.error("탈퇴 처리 중 오류가 발생했습니다."),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => boxApi.deleteReview(reviewId),
    onSuccess: () => {
      toast.success("후기가 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["reviews", "mine"] });
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const updateMutation = useMutation({
    mutationFn: () => userApi.updateMe({ name, phone }),
    onSuccess: () => {
      toast.success("저장되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  if (!isLoggedIn()) return null;

  const user = me || localUser;
  const hasBox = !!myBox;
  const badgeCount = myBadges?.length ?? 0;

  const TABS: { key: ContentTab; label: string; count?: number }[] = [
    { key: "posts", label: "게시글", count: myPosts?.totalElements },
    { key: "comments", label: "댓글", count: myComments?.totalElements },
    { key: "reviews", label: "후기", count: myReviews?.totalElements },
    { key: "favorites", label: "즐겨찾기", count: myFavorites?.totalElements },
    { key: "badges", label: "배지", count: badgeCount || undefined },
    ...(hasBox ? [{ key: "box" as ContentTab, label: "내 박스" }] : []),
  ];

  return (
    <div className={s.page}>
      {/* ── HERO ── */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          {/* Avatar */}
          <div className={s.avatarWrap} onClick={() => avatarInputRef.current?.click()} title="클릭하여 사진 변경">
            <div className={s.avatar}>
              {me?.profileImageUrl
                ? <Image src={me.profileImageUrl} alt="" fill style={{ objectFit: "cover" }} />
                : <span className={s.avatarInitial}>{user?.name?.[0]?.toUpperCase() || "U"}</span>
              }
              {avatarUploading && (
                <div className={s.avatarOverlay}>
                  <span>업로드 중</span>
                </div>
              )}
              <div className={s.avatarCamera}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
          </div>

          {/* Info */}
          <div className={s.heroInfo}>
            <div className={s.heroNameRow}>
              <h1 className={s.heroName}>{user?.name || "—"}</h1>
              <span className={`badge badge-default ${s.roleChip}`}>
                {ROLE_LABEL[user?.role || "ROLE_USER"]}
              </span>
            </div>
            <p className={s.heroEmail}>{user?.email || ""}</p>

            {/* Stats row */}
            <div className={s.heroStats}>
              <div className={s.heroStat}>
                <span className={s.heroStatVal}>
                  {streakInfo?.currentStreak ? `🔥 ${streakInfo.currentStreak}` : "0"}
                </span>
                <span className={s.heroStatLabel}>연속 기록</span>
              </div>
              <div className={s.heroStatDiv} />
              <div className={s.heroStat}>
                <span className={s.heroStatVal}>{streakInfo?.totalWodCount ?? 0}</span>
                <span className={s.heroStatLabel}>총 WOD</span>
              </div>
              <div className={s.heroStatDiv} />
              <Link href={`/users/${me?.id}?tab=followers`} className={s.heroStat} style={{ textDecoration: "none" }}>
                <span className={s.heroStatVal}>{followCounts?.followerCount ?? 0}</span>
                <span className={s.heroStatLabel}>팔로워</span>
              </Link>
              <div className={s.heroStatDiv} />
              <Link href={`/users/${me?.id}?tab=following`} className={s.heroStat} style={{ textDecoration: "none" }}>
                <span className={s.heroStatVal}>{followCounts?.followingCount ?? 0}</span>
                <span className={s.heroStatLabel}>팔로잉</span>
              </Link>
              {badgeCount > 0 && (
                <>
                  <div className={s.heroStatDiv} />
                  <div className={s.heroStat}>
                    <span className={s.heroStatVal}>{badgeCount}</span>
                    <span className={s.heroStatLabel}>배지</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Public profile link */}
          {me?.id && (
            <Link href={`/users/${me.id}`} className={s.publicProfileBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              공개 프로필
            </Link>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className={s.content}>

        {/* ── LEFT SIDEBAR ── */}
        <aside className={s.sidebar}>
          {/* 정보 수정 */}
          <div className={s.card}>
            <p className={s.cardTitle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              정보 수정
            </p>
            <div className={s.form}>
              <div className={s.field}>
                <label className={s.label}>이름</label>
                <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={s.field}>
                <label className={s.label}>전화번호</label>
                <input type="tel" className="input-field" placeholder="010-0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className={s.field}>
                <label className={s.label}>이메일</label>
                <p className={s.staticValue}>{me?.email || localUser?.email}</p>
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

          {/* 빠른 링크 */}
          <div className={s.card}>
            <p className={s.cardTitle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              메뉴
            </p>

            <p className={s.linkGroup}>계정</p>
            <div className={s.linksList}>
              <Link href="/my/profile" className={s.linkItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                프로필 수정
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              <Link href="/my/password" className={s.linkItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                비밀번호 변경
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              <Link href="/my/notification-settings" className={s.linkItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                알림 설정
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>

            <p className={s.linkGroup}>활동</p>
            <div className={s.linksList}>
              <Link href="/my/competitions" className={s.linkItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="8 6 2 12 8 18"/><path d="M2 12h20"/><polyline points="16 6 22 12 16 18"/></svg>
                신청한 대회
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              <Link href="/my/performance" className={s.linkItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                퍼포먼스 기록
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              <Link href="/my/goals" className={s.linkItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                개인 목표
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              <Link href="/my/bookmarks" className={s.linkItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                북마크
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              <Link href="/wod/records" className={s.linkItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                WOD 기록
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>

            {(user?.role === "ROLE_BOX_OWNER" || user?.role === "ROLE_ADMIN") && (
              <>
                <p className={s.linkGroup}>관리</p>
                <div className={s.linksList}>
                  <Link href="/my/box" className={s.linkItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    내 박스 관리
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                </div>
              </>
            )}

            <div className={s.withdrawWrap}>
              <button
                className={s.withdrawBtn}
                onClick={() => {
                  if (window.confirm("정말 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 비활성화됩니다.")) {
                    deleteAccountMutation.mutate();
                  }
                }}
                disabled={deleteAccountMutation.isPending}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                회원 탈퇴
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN ── */}
        <main className={s.main}>
          {/* 활동 통계 */}
          <div className={s.statsGrid}>
            {[
              { val: myPosts?.totalElements ?? 0, label: "게시글", icon: "📝", tab: "posts" as ContentTab },
              { val: myComments?.totalElements ?? 0, label: "댓글", icon: "💬", tab: "comments" as ContentTab },
              { val: myReviews?.totalElements ?? 0, label: "후기", icon: "⭐", tab: "reviews" as ContentTab },
              { val: myFavorites?.totalElements ?? 0, label: "즐겨찾기", icon: "❤️", tab: "favorites" as ContentTab },
              { val: followCounts?.followerCount ?? 0, label: "팔로워", icon: "👥", tab: null },
              { val: followCounts?.followingCount ?? 0, label: "팔로잉", icon: "👣", tab: null },
            ].map((item) => (
              <div
                key={item.label}
                className={`${s.statCard} ${item.tab ? s.statCardClickable : ""}`}
                onClick={() => item.tab && setActiveTab(item.tab)}
              >
                <span className={s.statIcon}>{item.icon}</span>
                <span className={s.statNum}>{item.val}</span>
                <span className={s.statLabel}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* 탭 */}
          <div className={s.tabsCard}>
            <div className={s.tabs}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`${s.tab} ${activeTab === t.key ? s.tabActive : ""}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                  {t.count != null && t.count > 0 && (
                    <span className={s.tabCount}>{t.count}</span>
                  )}
                </button>
              ))}
            </div>

            <div className={s.tabContent}>
              {/* 게시글 */}
              {activeTab === "posts" && (
                <>
                  {myPosts?.content?.length > 0 ? (
                    <div className={s.itemList}>
                      {myPosts.content.map((post: Post) => (
                        <Link key={post.id} href={`/community/${post.id}`} className={s.itemRow}>
                          <span className={`badge ${CATEGORY_BADGE[post.category] || "badge-default"} ${s.itemBadge}`}>
                            {CATEGORY_LABEL[post.category]}
                          </span>
                          <span className={s.itemTitle}>{post.title}</span>
                          <div className={s.itemMeta}>
                            <span>👍 {post.likeCount ?? 0}</span>
                            <span>💬 {post.commentCount ?? 0}</span>
                            <span>{dayjs(post.createdAt).format("MM.DD")}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Empty icon="📝" text="아직 작성한 게시글이 없습니다" link={{ href: "/community/write", label: "첫 글 작성하기" }} />
                  )}
                  {myPosts?.totalElements > 10 && (
                    <Link href="/community" className={s.moreLink}>전체 보기 ({myPosts.totalElements}개) →</Link>
                  )}
                </>
              )}

              {/* 댓글 */}
              {activeTab === "comments" && (
                <>
                  {myComments?.content?.length > 0 ? (
                    <div className={s.itemList}>
                      {myComments.content.slice(0, 15).map((c: { id: number; content: string; postId: number; postTitle: string; createdAt: string }) => (
                        <Link key={c.id} href={`/community/${c.postId}`} className={s.itemRow}>
                          <div className={s.commentItemInner}>
                            <span className={s.commentPostTitle}>{c.postTitle}</span>
                            <span className={s.commentContent}>{c.content}</span>
                          </div>
                          <span className={s.itemDate}>{dayjs(c.createdAt).format("MM.DD")}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Empty icon="💬" text="아직 작성한 댓글이 없습니다" />
                  )}
                  {myComments?.totalElements > 15 && (
                    <Link href="/my/comments" className={s.moreLink}>전체 보기 ({myComments.totalElements}개) →</Link>
                  )}
                </>
              )}

              {/* 후기 */}
              {activeTab === "reviews" && (
                <>
                  {myReviews?.content?.length > 0 ? (
                    <div className={s.itemList}>
                      {myReviews.content.map((rev: Review) => (
                        <div key={rev.id} className={s.itemRow}>
                          <Link href={`/boxes/${rev.boxId}`} className={s.reviewBoxName}>
                            {rev.boxName || "박스 보기"}
                          </Link>
                          <span className={s.reviewStars}>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                          <span className={s.itemTitle}>{rev.content}</span>
                          <span className={s.itemDate}>{dayjs(rev.createdAt).format("MM.DD")}</span>
                          <button
                            className={s.deleteBtn}
                            onClick={() => { if (confirm("후기를 삭제하시겠습니까?")) deleteReviewMutation.mutate(rev.id); }}
                            disabled={deleteReviewMutation.isPending}
                            title="삭제"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty icon="⭐" text="아직 작성한 후기가 없습니다" />
                  )}
                  {myReviews?.totalElements > 10 && (
                    <Link href="/my/reviews" className={s.moreLink}>전체 보기 ({myReviews.totalElements}개) →</Link>
                  )}
                </>
              )}

              {/* 즐겨찾기 */}
              {activeTab === "favorites" && (
                <>
                  {myFavorites?.content?.length > 0 ? (
                    <div className={s.favoriteGrid}>
                      {myFavorites.content.map((box: Box) => (
                        <Link key={box.id} href={`/boxes/${box.id}`} className={s.favCard}>
                          <div className={s.favImg} style={{ position: "relative" }}>
                            {box.imageUrls?.[0]
                              ? <Image src={box.imageUrls[0]} alt={box.name} fill style={{ objectFit: "cover" }} />
                              : <div className={s.favPlaceholder}>CF</div>
                            }
                          </div>
                          <div className={s.favInfo}>
                            <p className={s.favName}>{box.name}</p>
                            <p className={s.favMeta}>{box.city} {box.district}</p>
                            <p className={s.favRating}>★ {Number(box.rating || 0).toFixed(1)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Empty icon="❤️" text="즐겨찾기한 박스가 없습니다" link={{ href: "/boxes", label: "박스 찾아보기" }} />
                  )}
                  {myFavorites?.totalElements > 6 && (
                    <Link href="/my/favorites" className={s.moreLink}>전체 보기 ({myFavorites.totalElements}개) →</Link>
                  )}
                </>
              )}

              {/* 배지 */}
              {activeTab === "badges" && (
                <>
                  {myBadges && myBadges.length > 0 ? (
                    <div className={s.badgeGrid}>
                      {myBadges.map((badge: Badge) => (
                        <div
                          key={badge.id}
                          className={s.badgeCard}
                          style={{ borderColor: `${TIER_COLOR[badge.tier]}33` }}
                        >
                          <div className={s.badgeTierBar} style={{ background: TIER_COLOR[badge.tier] }} />
                          <div className={s.badgeIconWrap}>{TIER_ICON[badge.tier]}</div>
                          <p className={s.badgeName}>{badge.name}</p>
                          <p className={s.badgeDesc}>{badge.description}</p>
                          <p className={s.badgeDate}>{dayjs(badge.awardedAt).format("YYYY.MM.DD")}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty icon="🏅" text="아직 획득한 배지가 없습니다" />
                  )}
                </>
              )}

              {/* 내 박스 */}
              {activeTab === "box" && myBox && (
                <Link href={`/boxes/${myBox.boxId}`} className={s.myBoxCard}>
                  <div className={s.myBoxAccent} />
                  <div className={s.myBoxBody}>
                    <div className={s.myBoxTop}>
                      <div>
                        <p className={s.myBoxName}>{myBox.boxName}</p>
                        <p className={s.myBoxAddr}>{myBox.boxCity} {myBox.boxDistrict} · {myBox.boxAddress}</p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted)", flexShrink: 0 }}>
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                    <div className={s.myBoxStats}>
                      <div className={s.myBoxStat}>
                        <span className={s.myBoxStatVal}>{myBox.memberCount}</span>
                        <span className={s.myBoxStatLabel}>멤버</span>
                      </div>
                      <div className={s.myBoxStat}>
                        <span className={s.myBoxStatVal}>{myBox.daysInBox}</span>
                        <span className={s.myBoxStatLabel}>활동일수</span>
                      </div>
                      <div className={s.myBoxStat}>
                        <span className={s.myBoxStatVal}>{dayjs(myBox.joinedAt).format("YYYY.MM")}</span>
                        <span className={s.myBoxStatLabel}>가입</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Empty({ icon, text, link }: { icon: string; text: string; link?: { href: string; label: string } }) {
  return (
    <div className={s.empty}>
      <span className={s.emptyIcon}>{icon}</span>
      <p className={s.emptyText}>{text}</p>
      {link && (
        <Link href={link.href} className={s.emptyLink}>{link.label}</Link>
      )}
    </div>
  );
}
