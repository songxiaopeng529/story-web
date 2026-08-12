"use client";

import { useCallback, useEffect, useState } from "react";

type IntroPhase = "checking" | "playing" | "closing" | "done";

const storageKey = "story-web:intro-seen";

export function IntroOverlay({ name }: { name: string }) {
  const [phase, setPhase] = useState<IntroPhase>("checking");

  const finish = useCallback(() => setPhase("done"), []);

  useEffect(() => {
    let closingTimer: number | undefined;
    let finishTimer: number | undefined;
    const startTimer = window.setTimeout(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const alreadySeen = window.sessionStorage.getItem(storageKey) === "true";
      if (reducedMotion || alreadySeen) {
        finish();
        return;
      }

      window.sessionStorage.setItem(storageKey, "true");
      setPhase("playing");
      closingTimer = window.setTimeout(() => setPhase("closing"), 650);
      finishTimer = window.setTimeout(finish, 970);
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      if (closingTimer) window.clearTimeout(closingTimer);
      if (finishTimer) window.clearTimeout(finishTimer);
    };
  }, [finish]);

  useEffect(() => {
    if (phase === "done" || phase === "checking") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finish, phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden={phase === "checking"}
      className={`intro-overlay intro-overlay--${phase}`}
    >
      <button className="intro-overlay__skip" onClick={finish} type="button">
        跳过 <span aria-hidden="true">ESC</span>
      </button>
      <div className="intro-overlay__content">
        <p>PERSONAL ARCHIVE / 2026</p>
        <div className="intro-overlay__name-mask">
          <p className="intro-overlay__name">{name}</p>
        </div>
        <span className="intro-overlay__line" />
        <p className="intro-overlay__note">简历 · 文章 · 作品</p>
      </div>
    </div>
  );
}
