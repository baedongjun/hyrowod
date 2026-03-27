"use client";

import { useEffect, useState } from "react";
import s from "./InstallPwa.module.css";

export default function InstallPwa() {
  const [prompt, setPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pwa-dismissed")) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window as unknown as Record<string, unknown>).MSStream;

    if (ios) {
      setIsIos(true);
      setVisible(true);
    } else {
      const handler = (e: Event) => {
        e.preventDefault();
        setPrompt(e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> });
        setVisible(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("pwa-dismissed", "1");
    setVisible(false);
    setShowIosGuide(false);
  };

  const handleInstall = async () => {
    if (isIos) {
      setShowIosGuide(true);
    } else if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") dismiss();
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className={s.banner}>
        <div className={s.bannerInner}>
          <img src="/hyrowod-icon.png" className={s.icon} alt="HyroWOD" />
          <div className={s.text}>
            <strong className={s.title}>HyroWOD</strong>
            <span className={s.sub}>홈화면에 추가하고 앱처럼 사용하세요</span>
          </div>
          <button className={s.installBtn} onClick={handleInstall}>
            홈화면 추가
          </button>
          <button className={s.closeBtn} onClick={dismiss} aria-label="닫기">
            ✕
          </button>
        </div>
      </div>

      {showIosGuide && (
        <div className={s.overlay} onClick={() => setShowIosGuide(false)}>
          <div className={s.guide} onClick={(e) => e.stopPropagation()}>
            <div className={s.guideHeader}>
              <h3 className={s.guideTitle}>홈화면에 추가하기</h3>
              <button className={s.guideClose} onClick={() => setShowIosGuide(false)}>
                ✕
              </button>
            </div>
            <div className={s.guideBody}>
              <div className={s.guideStep}>
                <span className={s.stepNum}>1</span>
                <span>
                  하단 <strong>공유 버튼</strong> (□↑) 을 탭하세요
                </span>
              </div>
              <div className={s.guideStep}>
                <span className={s.stepNum}>2</span>
                <span>
                  <strong>&quot;홈 화면에 추가&quot;</strong>를 탭하세요
                </span>
              </div>
              <div className={s.guideStep}>
                <span className={s.stepNum}>3</span>
                <span>
                  오른쪽 상단 <strong>&quot;추가&quot;</strong>를 탭하세요
                </span>
              </div>
            </div>
            <button className={s.guideDismiss} onClick={dismiss}>
              다음에 보지 않기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
