"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import s from "./notifications.module.css";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface Notif {
  id: number;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<string, string> = {
  BADGE: "🏅",
  MEMBERSHIP: "🏋️",
  REVIEW: "⭐",
  COMPETITION: "🏆",
  COMMUNITY: "💬",
  SYSTEM: "🔔",
};

export default function NotificationsPage() {
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, [router]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", "all"],
    queryFn: async () => (await notificationApi.getAll()).data.data as Notif[],
    enabled: isLoggedIn(),
  });

  const markOneMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("모든 알림을 읽음 처리했습니다.");
    },
  });

  const handleClick = (n: Notif) => {
    if (!n.read) markOneMutation.mutate(n.id);
    if (n.link) router.push(n.link);
  };

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <div>
            <p className={s.eyebrow}>NOTIFICATIONS</p>
            <h1 className={s.title}>알림</h1>
            {unreadCount > 0 && (
              <p className={s.sub}>읽지 않은 알림 {unreadCount}개</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              className={s.readAllBtn}
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
            >
              모두 읽음 처리
            </button>
          )}
        </div>

        {isLoading ? (
          <div className={s.list}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={s.skeleton} />
            ))}
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>🔔</div>
            <p className={s.emptyText}>아직 알림이 없습니다</p>
            <p className={s.emptySub}>WOD 기록, 배지 획득, 대회 소식이 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className={s.list}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`${s.item} ${!n.read ? s.itemUnread : ""} ${n.link ? s.itemClickable : ""}`}
                onClick={() => handleClick(n)}
              >
                <div className={s.itemIcon}>
                  {TYPE_ICON[n.type] || "🔔"}
                </div>
                <div className={s.itemBody}>
                  <p className={s.itemMessage}>{n.message}</p>
                  <p className={s.itemTime}>{dayjs(n.createdAt).fromNow()}</p>
                </div>
                {!n.read && <div className={s.unreadDot} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
