# CrossFitKorea 프론트엔드 디자인 시스템

이 프로젝트의 모든 프론트엔드 코드는 아래 디자인 시스템을 반드시 따른다.

---

## 색상

```
배경:        #0a0a0a
카드:        #1a1a1a
카드 보조:   #2a2a2a
포인트 레드: #e8220a
포인트 오렌지: #ff6b1a
텍스트 흰색: #f5f0e8
텍스트 흐림: #888888
테두리:      rgba(255, 255, 255, 0.08)
```

---

## 폰트

Google Fonts CDN으로 불러올 것. 외부 라이브러리 사용 금지.

```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Black+Han+Sans&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
```

- 영문 타이틀 / 숫자 강조: `font-family: 'Bebas Neue', sans-serif`
- 한글 타이틀: `font-family: 'Black Han Sans', sans-serif`
- 본문 전체: `font-family: 'Noto Sans KR', sans-serif`

---

## 버튼

```css
.btn-primary {
  background: #e8220a;
  color: #f5f0e8;
  border: none;
  border-radius: 0;
  padding: 15px 32px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #b01a07;
}
.btn-secondary {
  background: transparent;
  color: #f5f0e8;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0;
  padding: 15px 32px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.btn-secondary:hover {
  border-color: #f5f0e8;
}
```

---

## 카드

```css
.card {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0;
  transition: transform 0.3s, border-color 0.3s;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(232, 34, 10, 0.4);
}
```

---

## 배지

border-radius 0 유지. 반투명 배경 + 컬러 테두리 조합.

```css
/* 승인 */
.badge-approved {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 0;
}
/* 대기 */
.badge-pending {
  background: rgba(234, 179, 8, 0.12);
  border: 1px solid rgba(234, 179, 8, 0.3);
  color: #eab308;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 0;
}
/* 반려 */
.badge-rejected {
  background: rgba(232, 34, 10, 0.12);
  border: 1px solid rgba(232, 34, 10, 0.3);
  color: #e8220a;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 0;
}
/* 프리미엄 */
.badge-premium {
  background: rgba(255, 107, 26, 0.12);
  border: 1px solid rgba(255, 107, 26, 0.3);
  color: #ff6b1a;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 0;
}
```

---

## 레이아웃

```css
.section {
  padding: 100px 80px;
}
.section-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #e8220a;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.section-title {
  font-family: 'Black Han Sans', sans-serif;
  font-size: clamp(36px, 4vw, 58px);
  line-height: 1.1;
}
.section-title span {
  color: #e8220a;
}

/* 반응형 */
@media (max-width: 768px) {
  .section {
    padding: 60px 24px;
  }
}
```

---

## 애니메이션

스크롤 진입 시 fadeIn. IntersectionObserver 사용.

```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .fade-in').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
```

---

## 금지 사항

- Bootstrap, Tailwind, MUI, Ant Design 등 외부 CSS 프레임워크 사용 금지
- 흰 배경 금지
- 파란 계열 기본 버튼 금지
- border-radius 있는 둥근 모서리 금지 (모든 요소 각지게)
- 기본 브라우저 스타일 그대로 사용 금지

---

## 기술 스택

- 템플릿 엔진: Thymeleaf
- CSS: 순수 CSS (외부 프레임워크 금지)
- JS: Vanilla JS (jQuery 금지)
- 폰트: Google Fonts CDN
- 반응형 브레이크포인트: 768px
