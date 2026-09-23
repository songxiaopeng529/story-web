"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { EntrySummary } from "@/lib/content";
import { assetPath } from "@/lib/asset-path";
import { LanguageToggle, useLanguage } from "@/components/language";
import styles from "./scene.module.css";

const VIDEO_FRAME_RATE = 24;
const VIDEO_FRAME_TOLERANCE = 0.75 / VIDEO_FRAME_RATE;
const SCROLL_RANGE_VIEWPORTS = 2.65;
const SPRITE_COLUMNS = 4;
const SPRITE_ROWS = 4;
const SPRITE_FRAME_COUNT = SPRITE_COLUMNS * SPRITE_ROWS;
const SPRITE_END_TIME = 2.25;
const VIDEO_STARTUP_BUFFER_END = SPRITE_END_TIME + 0.25;

function StoryIcon() {
  return <Image src={assetPath("/images/story/story-icon.png")} alt="" width={128} height={128} className={styles.logoIcon} />;
}

export function Story({ articles, projects }: { articles: EntrySummary[]; projects: EntrySummary[] }) {
  const { language, t } = useLanguage();
  const services = [t("Developer", "开发者"), t("Writer", "写作者"), t("Creator", "创作者"), t("AI Builder", "AI 构建者")];
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const sprite = useRef<HTMLImageElement>(null);
  const spriteCanvas = useRef<HTMLCanvasElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<"contact" | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const rootElement = root.current;
    const videoElement = video.current;
    const spriteElement = sprite.current;
    const spriteCanvasElement = spriteCanvas.current;
    if (!rootElement || !videoElement || !spriteElement || !spriteCanvasElement) return;
    const el: HTMLElement = rootElement;
    const media: HTMLVideoElement = videoElement;
    const spriteImage: HTMLImageElement = spriteElement;
    const canvas: HTMLCanvasElement = spriteCanvasElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let frameCallback = 0;
    let frameConfirmationTimer = 0;
    let handoffTimer = 0;
    let target = 0;
    let spriteFrame = 0;
    let lastDrawnSpriteFrame = -1;
    let lastCanvasWidth = 0;
    let lastCanvasHeight = 0;
    let disposed = false;
    let revealed = false;
    let spriteReady = spriteImage.complete && spriteImage.naturalWidth > 0;
    let spriteUnavailable = spriteImage.complete && spriteImage.naturalWidth === 0;
    let readyForSeeking = false;
    let priming = false;
    let playbackBlocked = false;
    let videoLoadStarted = media.preload !== "none";

    function cancelFrameConfirmation() {
      const callback = frameCallback;
      frameCallback = 0;
      window.clearTimeout(frameConfirmationTimer);
      frameConfirmationTimer = 0;
      if (callback && typeof media.cancelVideoFrameCallback === "function") media.cancelVideoFrameCallback(callback);
    }

    function hideVideo() {
      cancelFrameConfirmation();
      window.clearTimeout(handoffTimer);
      revealed = false;
      media.style.opacity = "0";
      canvas.style.opacity = spriteReady && !motion.matches ? "1" : "0";
    }

    function revealVideo() {
      if (revealed || !readyForSeeking || motion.matches) return;
      revealed = true;
      media.style.opacity = "1";
      window.clearTimeout(handoffTimer);
      handoffTimer = window.setTimeout(() => {
        if (revealed) canvas.style.opacity = "0";
      }, 160);
    }

    function schedule() {
      if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(tick);
    }

    function startVideoLoad() {
      if (disposed || videoLoadStarted || motion.matches) return;
      videoLoadStarted = true;
      media.preload = "auto";
      media.load();
    }

    function drawSprite() {
      if (!spriteReady || motion.matches) return;
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;

      const density = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(bounds.width * density));
      const height = Math.max(1, Math.round(bounds.height * density));
      if (spriteFrame === lastDrawnSpriteFrame && width === lastCanvasWidth && height === lastCanvasHeight) return;

      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      const frameWidth = spriteImage.naturalWidth / SPRITE_COLUMNS;
      const frameHeight = spriteImage.naturalHeight / SPRITE_ROWS;
      const destinationRatio = width / height;
      const frameRatio = frameWidth / frameHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = frameWidth;
      let sourceHeight = frameHeight;

      // Match object-fit: cover and the portrait's 50% 28% focal point.
      if (destinationRatio > frameRatio) {
        sourceHeight = frameWidth / destinationRatio;
        sourceY = (frameHeight - sourceHeight) * 0.28;
      } else {
        sourceWidth = frameHeight * destinationRatio;
        sourceX = (frameWidth - sourceWidth) * 0.5;
      }

      const column = spriteFrame % SPRITE_COLUMNS;
      const row = Math.floor(spriteFrame / SPRITE_COLUMNS);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        spriteImage,
        column * frameWidth + sourceX,
        row * frameHeight + sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        width,
        height,
      );
      lastDrawnSpriteFrame = spriteFrame;
      lastCanvasWidth = width;
      lastCanvasHeight = height;
      if (!revealed) canvas.style.opacity = "1";
    }

    function contiguousBufferedEnd() {
      for (let index = 0; index < media.buffered.length; index += 1) {
        if (media.buffered.start(index) <= VIDEO_FRAME_TOLERANCE) return media.buffered.end(index);
      }
      return 0;
    }

    function startPriming() {
      if (disposed || priming || playbackBlocked || readyForSeeking || motion.matches || media.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      priming = true;
      const playback = media.play();
      playback?.catch(() => {
        if (disposed || readyForSeeking) return;
        priming = false;
        playbackBlocked = true;
        // Muted inline playback normally succeeds. If a browser still blocks it,
        // let ordinary preload finish the startup buffer while the sprite remains live.
        maybeFinishPriming();
      });
    }

    function maybeFinishPriming() {
      if (disposed || readyForSeeking || motion.matches || media.readyState < HTMLMediaElement.HAVE_METADATA) return;
      const lastFrameTime = Number.isFinite(media.duration) ? Math.max(0, media.duration - 1 / VIDEO_FRAME_RATE) : VIDEO_STARTUP_BUFFER_END;
      const requiredEnd = Math.min(lastFrameTime, VIDEO_STARTUP_BUFFER_END);
      if (contiguousBufferedEnd() + VIDEO_FRAME_TOLERANCE < requiredEnd) {
        startPriming();
        return;
      }

      readyForSeeking = true;
      priming = false;
      media.pause();
      if (!media.seeking && media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && Math.abs(target - media.currentTime) <= VIDEO_FRAME_TOLERANCE) {
        revealVideo();
      } else {
        schedule();
      }
    }

    function confirmPresentedFrame() {
      if (disposed || revealed || !readyForSeeking || motion.matches || media.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || media.seeking) return;
      if (Math.abs(target - media.currentTime) > VIDEO_FRAME_TOLERANCE) return;

      if (typeof media.requestVideoFrameCallback === "function") {
        if (frameCallback) return;
        frameCallback = media.requestVideoFrameCallback((_now, metadata) => {
          frameCallback = 0;
          window.clearTimeout(frameConfirmationTimer);
          frameConfirmationTimer = 0;
          if (Math.abs(target - metadata.mediaTime) <= VIDEO_FRAME_TOLERANCE) revealVideo();
          schedule();
        });
        // Some engines do not issue a new video-frame callback for an already
        // presented paused frame. Keep the exact-frame callback as the primary
        // signal, then fall back only after the media clock is stable.
        frameConfirmationTimer = window.setTimeout(() => {
          const callback = frameCallback;
          frameCallback = 0;
          frameConfirmationTimer = 0;
          if (callback && typeof media.cancelVideoFrameCallback === "function") media.cancelVideoFrameCallback(callback);
          if (!disposed && !media.seeking && media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && Math.abs(target - media.currentTime) <= VIDEO_FRAME_TOLERANCE) revealVideo();
          schedule();
        }, 180);
        return;
      }

      revealVideo();
    }

    function tick() {
      raf = 0;
      drawSprite();
      if (!readyForSeeking || media.readyState < HTMLMediaElement.HAVE_METADATA || media.seeking) return;
      const difference = target - media.currentTime;
      if (Math.abs(difference) <= VIDEO_FRAME_TOLERANCE) {
        confirmPresentedFrame();
        return;
      }

      // Keep a single decoder seek in flight, then jump straight to the latest
      // scroll target. Easing currentTime itself creates a visible seek backlog.
      cancelFrameConfirmation();
      media.currentTime = target;
    }

    function update() {
      const progress = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / (window.innerHeight * SCROLL_RANGE_VIEWPORTS)));
      const lastFrameTime = Number.isFinite(media.duration) ? Math.max(0, media.duration - 1 / VIDEO_FRAME_RATE) : 0;
      target = motion.matches ? 0 : Math.round(progress * lastFrameTime * VIDEO_FRAME_RATE) / VIDEO_FRAME_RATE;
      spriteFrame = motion.matches ? 0 : Math.min(SPRITE_FRAME_COUNT - 1, Math.round(progress * SCROLL_RANGE_VIEWPORTS * (SPRITE_FRAME_COUNT - 1)));
      el.style.setProperty("--progress", String(motion.matches ? 0 : progress));

      if (motion.matches) {
        media.pause();
        hideVideo();
        canvas.style.opacity = "0";
      } else {
        if (spriteReady || spriteUnavailable) startVideoLoad();
        maybeFinishPriming();
      }
      schedule();
    }

    function ready() {
      update();
      maybeFinishPriming();
      startPriming();
    }

    function seeked() {
      confirmPresentedFrame();
      schedule();
    }

    function spriteLoaded() {
      spriteReady = true;
      spriteUnavailable = false;
      lastDrawnSpriteFrame = -1;
      startVideoLoad();
      schedule();
    }

    function spriteFailed() {
      spriteReady = false;
      spriteUnavailable = true;
      startVideoLoad();
    }

    function failed() {
      priming = false;
      hideVideo();
    }

    media.addEventListener("loadedmetadata", update);
    media.addEventListener("loadeddata", ready);
    media.addEventListener("canplay", startPriming);
    media.addEventListener("progress", maybeFinishPriming);
    media.addEventListener("timeupdate", maybeFinishPriming);
    media.addEventListener("seeked", seeked);
    media.addEventListener("error", failed);
    spriteImage.addEventListener("load", spriteLoaded);
    spriteImage.addEventListener("error", spriteFailed);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    if (spriteReady) spriteLoaded();
    if (media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) ready(); else update();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelFrameConfirmation();
      window.clearTimeout(handoffTimer);
      media.pause();
      media.removeEventListener("loadedmetadata", update);
      media.removeEventListener("loadeddata", ready);
      media.removeEventListener("canplay", startPriming);
      media.removeEventListener("progress", maybeFinishPriming);
      media.removeEventListener("timeupdate", maybeFinishPriming);
      media.removeEventListener("seeked", seeked);
      media.removeEventListener("error", failed);
      spriteImage.removeEventListener("load", spriteLoaded);
      spriteImage.removeEventListener("error", spriteFailed);
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
      <Image src={assetPath("/images/story/model-poster.jpg")} alt="" width={1920} height={1080} preload sizes="100vw" className={styles.poster} />
      <Image ref={sprite} src={assetPath("/images/story/model-turn-sprite.webp")} alt="" width={3200} height={1800} loading="eager" fetchPriority="high" decoding="async" className={styles.spriteSource} />
      <canvas ref={spriteCanvas} className={styles.spriteCanvas} />
      <video ref={video} className={styles.canvas} poster={assetPath("/images/story/model-poster.jpg")} preload="none" muted playsInline disablePictureInPicture aria-hidden="true">
        <source media="(max-width: 650px)" src={assetPath("/videos/story/model-turn-mobile.mp4")} type="video/mp4" />
        <source src={assetPath("/videos/story/model-turn.mp4")} type="video/mp4" />
      </video>
      <div className={styles.shade} />
    </div>
    <div className={styles.foreground}>
      <header className={styles.header}>
        <a href="#story-top" className={styles.logo} aria-label={t("Story home", "Story 首页")}><StoryIcon />Story</a>
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
        <div className={styles.footerBottom}><a href="#story-top" className={styles.logo}><StoryIcon />Story</a><a href="https://github.com/songxiaopeng529" target="_blank" rel="noreferrer">GitHub ↗</a><span>© 2026 Story</span><a href="#story-top">{t("Back to top ↑", "返回顶部 ↑")}</a></div>
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
