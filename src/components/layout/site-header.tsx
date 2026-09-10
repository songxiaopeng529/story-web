"use client";

import { useEffect, useState } from "react";
import { assetPath } from "@/lib/asset-path";

type Section = "home" | "articles" | "works";
const links: { id: Section; label: string }[] = [
  { id: "home", label: "首页" }, { id: "articles", label: "文章" }, { id: "works", label: "作品" },
];

export function SiteHeader({ current = "home", landing = true }: { current?: Section; landing?: boolean }) {
  const [active, setActive] = useState<Section>(current);
  useEffect(() => {
    if (!landing) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = Math.min(innerHeight * 0.38, 320);
      const articles = document.getElementById("articles");
      const works = document.getElementById("works");
      setActive(works && works.getBoundingClientRect().top <= threshold ? "works" : articles && articles.getBoundingClientRect().top <= threshold ? "articles" : "home");
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [landing]);
  return (
    <header className="site-header">
      <a href={landing ? "#home" : assetPath("/#home")} className="site-name" aria-label="宋小鹏 · 首页">宋小鹏</a>
      <nav className="site-nav" aria-label="主导航">
        {links.map(({ id, label }) => <a key={id} href={landing ? `#${id}` : assetPath(`/#${id}`)} className="nav-item" aria-current={active === id ? (landing ? "location" : "page") : undefined} onClick={() => setActive(id)}>{label}</a>)}
      </nav>
    </header>
  );
}
