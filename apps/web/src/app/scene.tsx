"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { EntrySummary } from "@/lib/content";
import { assetPath } from "@/lib/asset-path";
import { LanguageToggle, useLanguage } from "@/components/language";
import styles from "./scene.module.css";

const VIDEO_FRAME_RATE = 24;


function Mark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30} 20 20)`}><path d="M18 2h4v7h-4zM18 12h4v4h-4z" fill="currentColor" /></g>)}</svg>;
}

export function Story({ articles, projects }: { articles: EntrySummary[]; projects: EntrySummary[] }) {
  const { language, t } = useLanguage();
  const services = [t("Developer", "开发者"), t("Writer", "写作者"), t("Creator", "创作者"), t("AI Builder", "AI 构建者")];
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<"contact" | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const el = root.current;
    const media = video.current;
    if (!el || !media) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let target = 0;
    let disposed = false;

    function schedule() {
      if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(tick);
    }
    function tick() {
      raf = 0;
      if (!media || media.readyState < 2 || media.seeking) return;
      const difference = target - media.currentTime;
      if (Math.abs(difference) < 0.5 / VIDEO_FRAME_RATE) return;
      // Serialize decoder seeks. New scroll input always replaces the target.
      const next = motion.matches ? 0 : media.currentTime + difference * 0.35;
      const time = Math.abs(difference) < 2 / VIDEO_FRAME_RATE ? target : next;
      media.currentTime = Math.max(0, time);
    }
    function update() {
      if (!el || !media) return;
      const progress = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / (window.innerHeight * 2.65)));
      const lastFrameTime = Number.isFinite(media.duration) ? Math.max(0, media.duration - 1 / VIDEO_FRAME_RATE) : 0;
      target = motion.matches ? 0 : Math.round(progress * lastFrameTime * VIDEO_FRAME_RATE) / VIDEO_FRAME_RATE;
      el.style.setProperty("--progress", String(motion.matches ? 0 : progress));
      schedule();
    }
    function ready() {
      if (!media) return;
      media.style.opacity = "1";
      update();
    }
    function seeked() { schedule(); }
    function failed() { if (media) media.style.opacity = "0"; }
    media.addEventListener("loadeddata", ready);
    media.addEventListener("seeked", seeked);
    media.addEventListener("error", failed);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    if (media.readyState >= 2) ready();
    else update();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      media.removeEventListener("loadeddata", ready);
      media.removeEventListener("seeked", seeked);
      media.removeEventListener("error", failed);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (modal !== null) { dialog.current?.showModal(); } else { dialog.current?.close(); }
  }, [modal]);

  function openContact() { setSaved(false); setMenuOpen(false); setModal("contact"); }

  return <main ref={root} className={styles.page} id="story-top" lang={language === "zh" ? "zh-CN" : "en"}>
    <a className={styles.skip} href="#story-blog">{t("Skip to content", "跳至正文")}</a>
    <div className={styles.backdrop} aria-hidden="true">
      <Image src={assetPath("/images/story/model-poster.jpg")} alt="" width={1920} height={1080} priority sizes="100vw" className={styles.poster} />
      <video ref={video} className={styles.canvas} src={assetPath("/videos/story/model-turn.mp4")} poster={assetPath("/images/story/model-poster.jpg")} preload="auto" muted playsInline disablePictureInPicture aria-hidden="true" />
      <div className={styles.shade} />
    </div>
    <div className={styles.foreground}>
      <header className={styles.header}>
        <a href="#story-top" className={styles.logo} aria-label={t("Story home", "Story 首页")}><Mark />Story</a>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label={t("Main navigation", "主导航")}>
          <a href="#story-top" onClick={() => setMenuOpen(false)}>{t("Home", "首页")}</a>
          <a href="#story-blog" onClick={() => setMenuOpen(false)}>{t("Blog", "博客")}</a>
          <a href="#story-projects" onClick={() => setMenuOpen(false)}>{t("Project", "作品")}</a>
        </nav>
        <LanguageToggle className={styles.languageToggle} />
        <button className={styles.menuButton} aria-expanded={menuOpen} aria-label={menuOpen ? t("Close menu", "关闭菜单") : t("Open menu", "打开菜单")} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? t("Close", "关闭") : t("Menu", "菜单")}</button>
      </header>
      <section className={styles.hero} aria-label={t("Story personal site", "Story 个人网站")}>
        <div className={styles.services} id="story-services">{services.map((service, i) => <div key={service} className={styles.identity}><span>({String(i + 1).padStart(2, "0")})</span>{service}</div>)}</div>
        <div className={styles.heroCopy}><p><span>{t("Hi, I’m Xiaopeng.", "你好，我是小鹏。")}<br />{t("I build, write,", "写代码，写文字，")}</span><br />{t("and stay curious.", "也始终保持好奇。")}</p><a className={styles.orangeButton} href="#story-projects">{t("Explore my work", "看看我的作品")}</a></div>
        <h1 className={styles.wordmark}>STORY</h1>
      </section>
      <section className={styles.blog} id="story-blog" aria-labelledby="blog-title">
        <div className={styles.sectionLabel}><span><i /> ({t("Blog", "博客")})</span><span>{articles.length} {t("articles", "篇文章")}</span></div>
        <div className={styles.sectionIntro}><h2 id="blog-title">{t("Notes &", "记录与")}<br />{t("perspectives.", "思考。")}</h2><p>{t("Making complex technology clear,", "把复杂的技术讲清楚，")}<br />{t("and keeping thoughts along the way.", "也把沿途的思考留在这里。")}</p></div>
        <div className={styles.articleList}>{articles.map(article => <Link key={article.slug} href={`/articles/${article.slug}/`} className={styles.articleRow}>
          <span className={styles.articleMeta}>{article.date ? <time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time> : t("Technical notes", "技术笔记")}<span>{article.tags[0] || t("Engineering", "技术")}</span></span>
          <div><h3>{article.title}</h3><p>{article.description}</p></div><span className={styles.articleArrow} aria-hidden="true">↗</span>
        </Link>)}</div>
        {!articles.length && <p className={styles.empty}>{t("New articles are on the way.", "新的文章正在路上。")}</p>}
      </section>
      <section className={styles.portfolio} id="story-projects" aria-labelledby="projects-title">
        <div className={styles.sectionLabel}><span><i /> ({t("Selected work", "精选作品")})</span><span>{projects.length} {t("projects", "个作品")}</span></div>
        <div className={styles.sectionIntro}><h2 id="projects-title">{t("Made with", "因好奇，")}<br />{t("curiosity.", "而创造。")}</h2><p>{t("From an idea to something real.", "从想法到实现。")}<br />{t("Useful little things, made with care.", "认真做一些有用、有趣的小东西。")}</p></div>
        <div className={styles.workGrid}>{projects.map((project) => <Link key={project.slug} href={`/works/${project.slug}/`} className={styles.workCard}>
          {project.project && <div className={`${styles.workCover} ${project.project.cover.theme === "paper" ? styles.workflowCover : styles.siteCover}`} aria-hidden="true">
            <span>{t(project.project.cover.kicker.en, project.project.cover.kicker.zh)}</span>
            <strong className={styles.projectHeadline}>{t(project.project.cover.headline.en, project.project.cover.headline.zh)}<span>{t(project.project.cover.caption.en, project.project.cover.caption.zh)}</span></strong>
            <span className={styles.coverMark}>{project.project.cover.mark}</span>
          </div>}
          <div className={styles.workInfo}><p>{project.tags.join(" / ")}</p><h3>{project.title}<span aria-hidden="true">↗</span></h3><p>{project.project ? t(project.project.description.en, project.project.description.zh) : project.description}</p></div>
        </Link>)}</div>
      </section>
      <footer className={styles.footer} id="story-contact">
        <div className={styles.sectionLabel}><span><i /> ({t("Let’s create", "联系我")})</span><span>{t("Ideas, conversations, possibilities.", "想法、交流与新的可能。")}</span></div>
        <button className={styles.footerCta} onClick={openContact}>{t("Let’s make", "一起做点")}<br />{t("something. ", "有趣的事。 ")}<span aria-hidden="true">↗</span></button>
        <div className={styles.footerBottom}><a href="#story-top" className={styles.logo}><Mark />Story</a><a href="https://github.com/songxiaopeng529" target="_blank" rel="noreferrer">GitHub ↗</a><span>© 2026 Story</span><a href="#story-top">{t("Back to top ↑", "返回顶部 ↑")}</a></div>
      </footer>
    </div>
    <dialog ref={dialog} className={styles.dialog} onCancel={() => setModal(null)} onClose={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}>
      <button className={styles.close} onClick={() => setModal(null)} aria-label={t("Close dialog", "关闭弹窗")}>×</button>
      {modal === "contact" && <form className={styles.form} onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const content = `STORY — ${t("Project brief", "项目简报")}\n\n${t("Name", "姓名")}: ${data.get("name")}\n${t("Email", "邮箱")}: ${data.get("email")}\n\n${data.get("brief")}\n`;
        const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a"); link.href = url; link.download = "story-project-brief.txt"; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000); setSaved(true);
      }}><p className={styles.kicker}>{t("Let’s create together", "一起创造点什么")}</p><h2>{t("Make it", "把想法")}<br />{t("extraordinary.", "变为可能。")}</h2><p>{t("Start with a thought. Turn it into a project brief.", "从一个想法开始，整理成一份项目简报。")}</p><label>{t("Your name", "你的姓名")}<input name="name" autoComplete="name" required /></label><label>{t("Email address", "电子邮箱")}<input name="email" type="email" autoComplete="email" required /></label><label>{t("What do you have in mind?", "你有什么想法？")}<textarea name="brief" rows={3} required /></label><button className={styles.orangeButton} type="submit">{t("Save project brief ↓", "保存项目简报 ↓")}</button><p className={styles.formNote} role="status">{saved ? t("Your brief has been downloaded. No message has been sent.", "简报已下载，未发送任何消息。") : t("Download your brief to keep or share. This preview does not send messages.", "下载简报以保存或分享。此预览不会发送消息。")}</p></form>}
    </dialog>
  </main>;
}
