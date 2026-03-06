"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { Box } from "@/types";
import { toast } from "react-toastify";
import s from "./adminBoxes.module.css";

export default function AdminBoxesPage() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "boxes", page],
    queryFn: async () => {
      const res = await adminApi.getBoxes(page);
      return res.data.data;
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: number; verified: boolean }) =>
      adminApi.verifyBox(id, verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "boxes"] });
      toast.success("변경되었습니다.");
    },
    onError: () => toast.error("오류가 발생했습니다."),
  });

  const premiumMutation = useMutation({
    mutationFn: ({ id, premium }: { id: number; premium: boolean }) =>
      adminApi.setPremium(id, premium),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "boxes"] });
      toast.success("변경되었습니다.");
    },
    onError: () => toast.error("오류가 발생했습니다."),
  });

  return (
    <div>
      <h1 className={s.pageTitle}>박스 관리</h1>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>박스명</th>
              <th className={s.th}>지역</th>
              <th className={s.th}>오너</th>
              <th className={`${s.th} ${s.thCenter}`}>평점</th>
              <th className={`${s.th} ${s.thCenter}`}>인증</th>
              <th className={`${s.th} ${s.thCenter}`}>프리미엄</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className={s.tr}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className={s.td}>
                      <div className={s.skeletonCell} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              data?.content?.map((box: Box) => (
                <tr key={box.id} className={s.tr}>
                  <td className={`${s.td} ${s.tdName}`}>{box.name}</td>
                  <td className={s.td}>{box.city}{box.district && ` · ${box.district}`}</td>
                  <td className={s.td}>{box.ownerName || "—"}</td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <span className={s.rating}>
                      <svg className={s.star} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      {box.rating ? Number(box.rating).toFixed(1) : "0.0"}
                    </span>
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <button
                      onClick={() => verifyMutation.mutate({ id: box.id, verified: !box.verified })}
                      className={`${s.toggleBtn} ${box.verified ? s.toggleVerified : ""}`}
                    >
                      {box.verified ? (
                        <>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                          </svg>
                          인증됨
                        </>
                      ) : "미인증"}
                    </button>
                  </td>
                  <td className={`${s.td} ${s.tdCenter}`}>
                    <button
                      onClick={() => premiumMutation.mutate({ id: box.id, premium: !box.premium })}
                      className={`${s.toggleBtn} ${box.premium ? s.togglePremium : ""}`}
                    >
                      {box.premium ? "PREMIUM" : "일반"}
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
