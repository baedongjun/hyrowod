"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { paymentApi } from "@/lib/api";
import s from "./success.module.css";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [competitionId, setCompetitionId] = useState<string | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const cId = searchParams.get("competitionId");

    setCompetitionId(cId);

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setErrorMsg("결제 정보가 올바르지 않습니다.");
      return;
    }

    paymentApi.confirm({ paymentKey, orderId, amount: Number(amount) })
      .then(() => setStatus("success"))
      .catch((err) => {
        const msg = err?.response?.data?.message || "결제 처리에 실패했습니다.";
        setErrorMsg(msg);
        setStatus("error");
      });
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className={s.page}>
        <div className={s.card}>
          <div className={s.spinner} />
          <p className={s.loadingText}>결제를 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={s.page}>
        <div className={s.card}>
          <div className={s.iconFail}>✕</div>
          <h1 className={s.title}>결제 처리 실패</h1>
          <p className={s.desc}>{errorMsg}</p>
          <div className={s.actions}>
            <button className="btn-primary" style={{ padding: "12px 32px" }} onClick={() => router.back()}>
              다시 시도
            </button>
            <Link href="/competitions" className="btn-secondary" style={{ padding: "12px 32px", display: "inline-block", textAlign: "center" }}>
              대회 목록
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.iconSuccess}>✓</div>
        <h1 className={s.title}>참가 신청 완료!</h1>
        <p className={s.desc}>결제가 완료되어 대회 참가 신청이 확정되었습니다.</p>
        <div className={s.actions}>
          {competitionId && (
            <Link href={`/competitions/${competitionId}`} className="btn-primary" style={{ padding: "12px 32px", display: "inline-block", textAlign: "center" }}>
              대회 상세 보기
            </Link>
          )}
          <Link href="/competitions" className="btn-secondary" style={{ padding: "12px 32px", display: "inline-block", textAlign: "center" }}>
            대회 목록
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 120, textAlign: "center", color: "#888" }}>로딩 중...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
