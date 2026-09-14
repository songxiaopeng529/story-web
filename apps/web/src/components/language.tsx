"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
const key = "story-language";
const event = "story-language-change";
function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(event, callback); window.removeEventListener("storage", callback); };
}
let current: "en" | "zh" = "en";
function snapshot(): "en" | "zh" {
  try { const saved = localStorage.getItem(key); if (saved === "en" || saved === "zh") current = saved; } catch {}
  return current;
}
export function useLanguage() {
  const language = useSyncExternalStore(subscribe, snapshot, () => "en" as const);
  return { language, t: (en: string, zh: string) => language === "zh" ? zh : en };
}
export function LanguageDocument() {
  const { language } = useLanguage();
  useEffect(() => { document.documentElement.lang = language === "zh" ? "zh-CN" : "en"; }, [language]);
  return null;
}
export function LanguageToggle({ className }: { className?: string }) {
  const { language, t } = useLanguage();
  return <button type="button" className={className} aria-label={t("Switch to Chinese", "切换为英文")} onClick={() => {
    current = language === "en" ? "zh" : "en";
    try { localStorage.setItem(key, current); } catch {}
    window.dispatchEvent(new Event(event));
  }}><span lang="zh-CN" style={{ opacity: language === "zh" ? 1 : .55 }}>中</span><span aria-hidden="true"> / </span><span lang="en" style={{ opacity: language === "en" ? 1 : .55 }}>EN</span></button>;
}
export function T({ en, zh }: { en: string; zh: string }) { const { t } = useLanguage(); return t(en, zh); }
export function OriginalImageLink({ href, alt, children }: { href: string; alt?: string; children: ReactNode }) {
  const { t } = useLanguage();
  return <a href={href} target="_blank" rel="noreferrer" aria-label={`${t("View original image", "查看原图")}: ${alt || t("Article image", "文章图片")}`}>{children}</a>;
}
