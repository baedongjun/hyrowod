import s from "./terms.module.css";

export default function TermsPage() {
  return (
    <div className={s.page}>
      <div className={s.content}>
        <div className={s.header}>
          <p className={s.tag}>LEGAL</p>
          <h1 className={s.title}>이용약관</h1>
          <p className={s.date}>최종 수정일: 2025년 1월 1일</p>
        </div>

        <div className={s.body}>
          <div className={s.section}>
            <h2 className={s.sectionTitle}>제1조 (목적)</h2>
            <p>이 약관은 CrossFit Korea(이하 &quot;회사&quot;)가 제공하는 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>제2조 (정의)</h2>
            <p>① &quot;서비스&quot;란 회사가 제공하는 크로스핏 박스 검색, 정보 제공, 커뮤니티 등 일체의 서비스를 말합니다.</p>
            <p>② &quot;이용자&quot;란 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
            <p>③ &quot;회원&quot;이란 회사와 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 말합니다.</p>
            <p>④ &quot;박스 오너&quot;란 크로스핏 박스를 운영하며 해당 박스를 서비스에 등록한 회원을 말합니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>제3조 (약관의 효력 및 변경)</h2>
            <p>① 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력을 발생합니다.</p>
            <p>② 회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
            <p>③ 약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 공지합니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>제4조 (서비스의 제공)</h2>
            <p>① 회사는 다음과 같은 서비스를 제공합니다:</p>
            <ul>
              <li>크로스핏 박스 검색 및 정보 제공</li>
              <li>박스별 수업 시간표, 코치 정보, 이용 후기 제공</li>
              <li>오늘의 WOD(Workout of the Day) 정보 제공</li>
              <li>크로스핏 대회 일정 안내</li>
              <li>커뮤니티 게시판 운영</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>제5조 (이용자의 의무)</h2>
            <p>① 이용자는 다음 행위를 하여서는 안됩니다:</p>
            <ul>
              <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
              <li>회사가 게시한 정보를 무단으로 변경하거나 삭제하는 행위</li>
              <li>타인의 명예를 손상시키거나 불이익을 주는 행위</li>
              <li>음란 또는 폭력적인 메시지, 화상, 음성 등을 공개 또는 게시하는 행위</li>
              <li>회사의 동의 없이 영리를 목적으로 서비스를 사용하는 행위</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>제6조 (면책조항)</h2>
            <p>① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
            <p>② 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</p>
            <p>③ 박스 오너가 등록한 정보의 정확성에 대해 회사는 책임을 지지 않습니다.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>제7조 (분쟁 해결)</h2>
            <p>① 서비스 이용과 관련하여 회사와 이용자 사이에 분쟁이 발생한 경우, 회사는 분쟁의 해결을 위해 성실히 협의합니다.</p>
            <p>② 제1항의 협의에서도 분쟁이 해결되지 않을 경우, 대한민국 법률에 의거하여 처리됩니다.</p>
          </div>

          <div className={s.contact}>
            <p>문의사항이 있으시면 아래 이메일로 연락해 주세요.</p>
            <p className={s.email}>contact@crossfitkorea.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
