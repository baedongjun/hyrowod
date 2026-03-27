import s from "../terms/terms.module.css";

export default function PrivacyPage() {
  return (
    <div className={s.page}>
      <div className={s.content}>
        <div className={s.header}>
          <p className={s.tag}>LEGAL</p>
          <h1 className={s.title}>개인정보처리방침</h1>
          <p className={s.date}>최종 수정일: 2026년 3월 24일 (시행일: 2026년 3월 24일)</p>
        </div>

        <div className={s.body}>
          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. 개인정보의 처리 목적</h2>
            <p>HyroWOD(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
            <ul>
              <li><strong>회원 가입 및 관리:</strong> 회원제 서비스 이용에 따른 본인 확인, 개인 식별, 비밀번호 재설정</li>
              <li><strong>서비스 제공:</strong> 박스 검색, WOD 기록, 대회 신청, 커뮤니티, 챌린지 등 서비스 운영</li>
              <li><strong>결제 처리:</strong> 대회 참가비 등 유료 서비스 결제 및 환불 처리</li>
              <li><strong>알림 및 이메일 발송:</strong> 서비스 이용 관련 공지, 대회 신청 확인, 배지 획득 알림</li>
              <li><strong>불만 처리 및 분쟁 조정:</strong> 민원인의 신원 확인, 민원사항 확인 및 처리</li>
              <li><strong>서비스 개선:</strong> 서비스 이용 통계 분석 및 기능 개선</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. 처리하는 개인정보 항목</h2>
            <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
            <ul>
              <li><strong>필수 항목:</strong> 이메일 주소, 비밀번호(암호화 저장), 이름</li>
              <li><strong>선택 항목:</strong> 전화번호, 프로필 이미지</li>
              <li><strong>박스 오너 추가 항목:</strong> 박스명, 주소, 연락처, 운영 정보</li>
              <li><strong>서비스 이용 과정 자동 수집:</strong> 서비스 이용 기록, WOD 기록, 게시글 및 댓글, 접속 IP, 쿠키</li>
              <li><strong>결제 정보:</strong> 주문번호, 결제 수단 종류 (카드번호 등 민감 결제 정보는 토스페이먼츠에서 직접 처리)</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. 개인정보의 처리 및 보유기간</h2>
            <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 회원 동의 시 고지한 기간 내에서 개인정보를 처리·보유합니다.</p>
            <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
            <ul>
              <li>회원 가입 및 관리: 회원 탈퇴 시까지 (탈퇴 후 즉시 파기. 단, 관계 법령에 따라 보관이 필요한 경우 해당 기간까지)</li>
              <li>전자상거래 계약·대금결제·재화 공급 기록: 5년 (전자상거래법)</li>
              <li>소비자 불만 또는 분쟁처리 기록: 3년 (전자상거래법)</li>
              <li>접속 로그: 3개월 (통신비밀보호법)</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. 개인정보의 제3자 제공</h2>
            <p>① 회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의 또는 법률의 특별한 규정이 있는 경우에만 제3자에게 제공합니다.</p>
            <p>② 다음의 경우에 한해 제한적으로 제3자에게 정보가 제공될 수 있습니다:</p>
            <ul>
              <li><strong>결제 처리:</strong> 토스페이먼츠 — 결제 처리에 필요한 최소한의 정보 (이름, 주문번호, 금액)</li>
            </ul>
            <p>③ 위 경우 외에는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. 개인정보 처리의 위탁</h2>
            <p>회사는 원활한 서비스 운영을 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
            <ul>
              <li><strong>AWS (Amazon Web Services):</strong> 클라우드 서버(EC2), 데이터베이스(RDS), 파일 저장(S3) — 서비스 종료 시까지</li>
              <li><strong>토스페이먼츠:</strong> 결제 처리 — 결제 완료 후 5년</li>
            </ul>
            <p>위탁받은 업체는 위탁받은 업무 이외의 목적으로 개인정보를 처리하지 않습니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. 개인정보의 파기</h2>
            <p>① 회사는 개인정보 보유기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 해당 개인정보를 파기합니다.</p>
            <p>② 파기 방법:</p>
            <ul>
              <li>전자적 파일: 복구·재생이 불가능한 방법으로 영구 삭제</li>
              <li>종이 문서: 분쇄기로 분쇄 또는 소각</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>7. 정보주체의 권리·의무 및 행사방법</h2>
            <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
            <ul>
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구 (단, 법령에 따라 수집·보유가 의무화된 경우 제외)</li>
              <li>처리 정지 요구</li>
            </ul>
            <p>위 권리 행사는 &apos;마이페이지 &gt; 프로필 수정&apos; 메뉴를 통해 직접 처리하거나, 아래 이메일로 요청하시면 처리해 드립니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>8. 쿠키(Cookie)의 사용</h2>
            <p>① 회사는 이용자에게 개인화된 서비스를 제공하기 위하여 쿠키를 사용합니다.</p>
            <p>② 쿠키는 웹사이트를 운영하는 데 이용되는 서버가 이용자의 브라우저에 보내는 소량의 정보이며, 이용자의 기기에 저장됩니다.</p>
            <p>③ 이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있으나, 이 경우 일부 서비스 이용에 불편함이 있을 수 있습니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>9. 개인정보의 안전성 확보 조치</h2>
            <p>회사는 개인정보 보호법 제29조에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다:</p>
            <ul>
              <li>비밀번호 암호화 (BCrypt 단방향 암호화)</li>
              <li>JWT 토큰 기반 인증으로 불법 접근 차단</li>
              <li>HTTPS 적용으로 전송 구간 암호화</li>
              <li>AWS 보안 그룹 및 IAM을 통한 접근 제어</li>
              <li>개인정보 취급자 최소화 및 교육</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>10. 개인정보 보호책임자</h2>
            <p>회사는 개인정보 처리에 관한 업무를 총괄하고, 이용자의 불만처리 및 피해구제를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <ul>
              <li><strong>성명:</strong> HyroWOD 운영팀</li>
              <li><strong>이메일:</strong> qoehd0@gmail.com</li>
            </ul>
            <p>개인정보 침해에 관한 신고·상담은 아래 기관에도 문의하실 수 있습니다:</p>
            <ul>
              <li>개인정보침해신고센터: privacy.kisa.or.kr / 118</li>
              <li>개인정보분쟁조정위원회: www.kopico.go.kr / 1833-6972</li>
              <li>대검찰청 사이버수사과: www.spo.go.kr / 1301</li>
              <li>경찰청 사이버수사국: ecrm.cyber.go.kr / 182</li>
            </ul>
          </div>

          <div className={s.contact}>
            <p>개인정보 처리 관련 문의사항은 아래 이메일로 연락해 주세요.</p>
            <p className={s.email}>qoehd0@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
