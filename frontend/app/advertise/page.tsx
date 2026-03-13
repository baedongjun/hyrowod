import s from "./advertise.module.css";

const PLANS = [
  {
    name: "BASIC",
    label: "기본 등록",
    price: "무료",
    features: [
      "박스 기본 정보 등록",
      "코치 / 시간표 등록",
      "후기 수집",
      "검색 노출",
    ],
    cta: "무료 시작",
    href: "/signup",
    highlight: false,
  },
  {
    name: "PREMIUM",
    label: "프리미엄 노출",
    price: "월 49,000원",
    features: [
      "검색 결과 최상단 노출",
      "홈 페이지 프리미엄 섹션",
      "PREMIUM 배지 표시",
      "인증 박스 우선 노출",
      "월간 통계 리포트 (예정)",
    ],
    cta: "프리미엄 신청",
    href: "mailto:contact@crossfitkorea.com?subject=프리미엄 광고 문의",
    highlight: true,
  },
  {
    name: "SPONSOR",
    label: "스폰서 배너",
    price: "별도 문의",
    features: [
      "홈 / 검색 페이지 배너",
      "대회 페이지 스폰서 노출",
      "뉴스레터 광고 (예정)",
      "SNS 홍보 연계 (예정)",
      "맞춤형 패키지 협의",
    ],
    cta: "문의하기",
    href: "mailto:contact@crossfitkorea.com?subject=스폰서 문의",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "프리미엄 신청은 어떻게 하나요?",
    a: "현재는 이메일 문의로 진행됩니다. 운영팀 검토 후 48시간 이내 회신드립니다.",
  },
  {
    q: "결제는 어떻게 이루어지나요?",
    a: "계좌 이체 또는 카드 결제로 진행됩니다. 토스페이먼츠 연동 예정입니다.",
  },
  {
    q: "프리미엄 노출 위치는 어디인가요?",
    a: "박스 검색 목록 최상단, 홈 페이지 프리미엄 섹션, 지역 필터 상단에 고정 노출됩니다.",
  },
  {
    q: "박스 등록은 무료인가요?",
    a: "기본 박스 등록은 완전 무료입니다. 관리자 승인 후 검색 노출이 시작됩니다.",
  },
];

export default function AdvertisePage() {
  return (
    <div className={s.page}>
      {/* Hero */}
      <div className={s.hero}>
        <p className={s.tag}>PARTNERSHIP</p>
        <h1 className={s.title}>더 많은 회원과<br />연결되세요</h1>
        <p className={s.desc}>CrossFit Korea와 함께 박스를 성장시키세요.<br />전국 크로스피터들에게 직접 노출됩니다.</p>
      </div>

      {/* Plans */}
      <div className={s.plans}>
        <div className={s.plansInner}>
          <div className={s.plansHeader}>
            <p className={s.sectionTag}>PRICING</p>
            <h2 className={s.sectionTitle}>플랜 선택</h2>
          </div>
          <div className={s.plansGrid}>
            {PLANS.map((plan) => (
              <div key={plan.name} className={`${s.planCard} ${plan.highlight ? s.planHighlight : ""}`}>
                {plan.highlight && <div className={s.popularBadge}>MOST POPULAR</div>}
                <div className={s.planTop}>
                  <p className={s.planName}>{plan.name}</p>
                  <p className={s.planLabel}>{plan.label}</p>
                  <p className={s.planPrice}>{plan.price}</p>
                </div>
                <ul className={s.featureList}>
                  {plan.features.map((f) => (
                    <li key={f} className={s.featureItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={plan.highlight ? "btn-primary" : "btn-secondary"}
                  style={{ display: "block", textAlign: "center", padding: "14px" }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={s.stats}>
        <div className={s.statsInner}>
          <div className={s.statItem}>
            <p className={s.statNum}>300+</p>
            <p className={s.statLabel}>등록 박스</p>
          </div>
          <div className={s.statItem}>
            <p className={s.statNum}>5,000+</p>
            <p className={s.statLabel}>월간 방문자</p>
          </div>
          <div className={s.statItem}>
            <p className={s.statNum}>17</p>
            <p className={s.statLabel}>서비스 지역</p>
          </div>
          <div className={s.statItem}>
            <p className={s.statNum}>매일</p>
            <p className={s.statLabel}>WOD 업데이트</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className={s.faq}>
        <div className={s.faqInner}>
          <p className={s.sectionTag}>FAQ</p>
          <h2 className={s.sectionTitle}>자주 묻는 질문</h2>
          <div className={s.faqList}>
            {FAQS.map((item) => (
              <div key={item.q} className={s.faqItem}>
                <p className={s.faqQ}>{item.q}</p>
                <p className={s.faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className={s.contactCta}>
        <div className={s.contactInner}>
          <h2 className={s.contactTitle}>문의하기</h2>
          <p className={s.contactDesc}>궁금한 점이 있으시면 이메일로 연락해 주세요.</p>
          <a
            href="mailto:contact@crossfitkorea.com?subject=광고 문의"
            className="btn-primary"
            style={{ display: "inline-block", marginTop: 24 }}
          >
            contact@crossfitkorea.com
          </a>
        </div>
      </div>
    </div>
  );
}
