"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import s from "./reservations.module.css";

interface Reservation {
  id: number;
  scheduleId: number;
  boxId: number;
  boxName: string;
  className: string;
  startTime: string;
  classDate: string;
}

export default function MyReservationsPage() {
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, [router]);

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["my", "reservations"],
    queryFn: async () => (await reservationApi.getMyReservations()).data.data as Reservation[],
    enabled: isLoggedIn(),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ scheduleId, date }: { scheduleId: number; date: string }) =>
      reservationApi.cancel(scheduleId, date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my", "reservations"] });
      toast.success("예약이 취소되었습니다.");
    },
    onError: () => toast.error("취소에 실패했습니다."),
  });

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <p className={s.eyebrow}>MY PAGE</p>
          <h1 className={s.title}>내 예약</h1>
          <p className={s.sub}>예약된 수업 목록입니다.</p>
        </div>

        {isLoading ? (
          <div className={s.list}>
            {[...Array(4)].map((_, i) => <div key={i} className={s.skeleton} />)}
          </div>
        ) : !reservations || reservations.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>📅</div>
            <p className={s.emptyText}>예약된 수업이 없습니다</p>
            <p className={s.emptySub}>박스 시간표 탭에서 수업을 예약하세요.</p>
            <Link href="/boxes" className="btn-primary" style={{ display: "inline-block", padding: "12px 28px", marginTop: 20 }}>
              박스 찾기
            </Link>
          </div>
        ) : (
          <div className={s.list}>
            {reservations.map((r) => (
              <div key={r.id} className={s.item}>
                <div className={s.dateCol}>
                  <p className={s.dateDay}>{dayjs(r.classDate).format("MM/DD")}</p>
                  <p className={s.dateDow}>{dayjs(r.classDate).format("ddd")}</p>
                </div>
                <div className={s.info}>
                  <Link href={`/boxes/${r.boxId}`} className={s.boxName}>{r.boxName}</Link>
                  <p className={s.className}>{r.className}</p>
                  <p className={s.time}>{r.startTime}</p>
                </div>
                <button
                  className={s.cancelBtn}
                  onClick={() => {
                    if (window.confirm("예약을 취소하시겠습니까?")) {
                      cancelMutation.mutate({ scheduleId: r.scheduleId, date: r.classDate });
                    }
                  }}
                  disabled={cancelMutation.isPending}
                >
                  취소
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
