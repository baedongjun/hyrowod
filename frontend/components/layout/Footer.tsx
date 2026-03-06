import Link from "next/link";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.grid}>
          <div>
            <span className={s.logo}>CF<span>KOREA</span></span>
            <p className={s.desc}>
              전국 크로스핏 박스를 한눈에 찾아보세요.<br />
              시간표, 후기, 코치 정보까지 제공합니다.
            </p>
            <div className={s.social}>
              <a
                href="https://instagram.com/crossfitkorea"
                target="_blank"
                rel="noopener noreferrer"
                className={s.socialLink}
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@crossfitkorea"
                target="_blank"
                rel="noopener noreferrer"
                className={s.socialLink}
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className={s.colTitle}>서비스</p>
            <div className={s.links}>
              <Link href="/boxes"        className={s.link}>박스 찾기</Link>
              <Link href="/wod"          className={s.link}>오늘의 WOD</Link>
              <Link href="/competitions" className={s.link}>대회 일정</Link>
              <Link href="/community"    className={s.link}>커뮤니티</Link>
            </div>
          </div>

          <div>
            <p className={s.colTitle}>정보</p>
            <div className={s.links}>
              <Link href="/advertise" className={s.link}>광고 문의</Link>
              <Link href="/terms"     className={s.link}>이용약관</Link>
              <Link href="/privacy"   className={s.link}>개인정보처리방침</Link>
            </div>
          </div>
        </div>

        <div className={s.bottom}>
          <p className={s.copyright}>© 2025 CrossFit Korea. All rights reserved.</p>
          <p className={s.trademark}>CrossFit is a registered trademark of CrossFit, LLC.</p>
        </div>
      </div>
    </footer>
  );
}
