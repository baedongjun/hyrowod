import s from "../terms/terms.module.css";

export default function PrivacyPage() {
  return (
    <div className={s.page}>
      <div className={s.content}>
        <div className={s.header}>
          <p className={s.tag}>LEGAL</p>
          <h1 className={s.title}>개인정보처리방침</h1>
          <p className={s.date}>최종 수정일: 2025년 1월 1일</p>
        </div>

        <div className={s.body}>
          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. 개인정보의 처리 목적</h2>
            <p>CrossFit Korea(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul>
              <li>회원 가입 및 관리: 회원제 서비스 이용에 따른 본인 확인, 개인 식별</li>
              <li>서비스 제공: 박스 검색, 커뮤니티, WOD 등 서비스 제공</li>
              <li>불만 처리 및 분쟁 조정: 민원인의 신원 확인, 민원사항 확인</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. 개인정보의 처리 및 보유기간</h2>
            <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
            <ul>
              <li>회원 가입 및 관리: 회원 탈퇴 시까지</li>
              <li>전자상거래에서의 계약·청약 철회, 대금결제, 재화 등 공급기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. 처리하는 개인정보 항목</h2>
            <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
            <ul>
              <li>필수 항목: 이메일 주소, 비밀번호, 이름</li>
              <li>선택 항목: 전화번호, 프로필 이미지</li>
              <li>서비스 이용 과정에서 자동 수집: 접속 IP, 쿠키, 서비스 이용 기록</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. 개인정보의 제3자 제공</h2>
            <p>① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등의 경우에만 개인정보를 제3자에게 제공합니다.</p>
            <p>② 현재 회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. 개인정보처리의 위탁</h2>
            <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
            <ul>
              <li>AWS (Amazon Web Services): 클라우드 서버 및 데이터 저장</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. 정보주체의 권리·의무 및 행사방법</h2>
            <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
            <ul>
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>7. 개인정보 보호책임자</h2>
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          </div>

          <div className={s.contact}>
            <p>개인정보 관련 문의</p>
            <p className={s.email}>privacy@crossfitkorea.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
