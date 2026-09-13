"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import styles from "./scene.module.css";

const FRAME_COUNT = 101;
const services = ["Digital Marketing", "UI/UX Design", "Web Design", "Experience Design", "Visual Identity"];
const projects = [
  { name: "Chromatic", category: "Art direction / Visual identity", image: "portrait-pink.jpg", description: "A study in contrast. Electric blue and vivid pink bring a new perspective to contemporary portraiture." },
  { name: "Afterlight", category: "Campaign / Photography", image: "portrait-ember.jpg", description: "Warm light, deep shadows, and a singular point of view. An exploration of character through cinematic portraiture." },
  { name: "New perspective", category: "Digital experience / Art direction", image: "portrait-cobalt.jpg", description: "Human expression meets a digital future. A visual world built around the unexpected meeting of color and light." },
];

function Mark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30} 20 20)`}><path d="M18 2h4v7h-4zM18 12h4v4h-4z" fill="currentColor" /></g>)}</svg>;
}

export function Lumenix() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<number | "contact" | "journal" | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const el = root.current;
    const surface = canvas.current;
    if (!el || !surface) return;
    const context = surface.getContext("2d", { alpha: false });
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frames: (HTMLImageElement | undefined)[] = Array(FRAME_COUNT);
    let disposed = false;
    let raf = 0;
    let current = 0;
    let target = 0;
    let lastDrawn = -1;
    let width = 0;
    let height = 0;

    function draw(index: number) {
      let frame = frames[index];
      if (!frame) {
        for (let distance = 1; distance < FRAME_COUNT; distance++) {
          frame = frames[Math.max(0, index - distance)] || frames[Math.min(FRAME_COUNT - 1, index + distance)];
          if (frame) break;
        }
      }
      if (!frame || !context || !surface) return;
      const scale = Math.max(width / frame.naturalWidth, height / frame.naturalHeight);
      const dw = frame.naturalWidth * scale;
      const dh = frame.naturalHeight * scale;
      context.drawImage(frame, (width - dw) / 2, (height - dh) * 0.28, dw, dh);
      surface.style.opacity = "1";
    }
    function tick() {
      raf = 0;
      current = motion.matches ? 0 : current + (target - current) * 0.16;
      const index = Math.round(current);
      if (index !== lastDrawn) { draw(index); lastDrawn = index; }
      if (Math.abs(target - current) > 0.05 && !motion.matches) raf = requestAnimationFrame(tick);
    }
    function update() {
      if (!el) return;
      const progress = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / (window.innerHeight * 2.65)));
      target = motion.matches ? 0 : progress * (FRAME_COUNT - 1);
      el.style.setProperty("--progress", String(progress));
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function resize() {
      if (!surface) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.round(window.innerWidth * dpr);
      height = Math.round(window.innerHeight * dpr);
      surface.width = width;
      surface.height = height;
      lastDrawn = -1;
      draw(Math.round(current));
      update();
    }
    async function load(index: number) {
      const frame = new window.Image();
      frame.src = assetPath(`/images/lumenix/turn-${String(index + 1).padStart(3, "0")}.jpg`);
      try {
        await frame.decode();
        if (disposed) return;
        frames[index] = frame;
        lastDrawn = -1;
        if (!raf) raf = requestAnimationFrame(tick);
      } catch { /* The poster and other decoded frames remain visible. */ }
    }
    // Coarse angles first; bounded parallel loading fills the in-between frames.
    async function preload() {
      await load(0);
      if (disposed || motion.matches) return;
      await Promise.all([20, 40, 60, 80, 100].map(load));
      const pending = Array.from({ length: FRAME_COUNT }, (_, i) => i).filter(i => i % 20 !== 0);
      let cursor = 0;
      await Promise.all(Array.from({ length: 4 }, async () => {
        while (cursor < pending.length && !disposed) await load(pending[cursor++]);
      }));
    }
    resize();
    void preload();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", update);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (modal !== null) { dialog.current?.showModal(); } else { dialog.current?.close(); }
  }, [modal]);

  function openContact() { setSaved(false); setMenuOpen(false); setModal("contact"); }

  return <main ref={root} className={styles.page} id="lumenix-top" lang="en">
    <a className={styles.skip} href="#lumenix-about">Skip to content</a>
    <div className={styles.backdrop} aria-hidden="true">
      <Image src={assetPath("/images/lumenix/turn-001.jpg")} alt="" width={600} height={440} priority sizes="100vw" className={styles.poster} />
      <canvas ref={canvas} className={styles.canvas} />
      <div className={styles.shade} />
    </div>
    <div className={styles.foreground}>
      <header className={styles.header}>
        <a href="#lumenix-top" className={styles.logo} aria-label="Lumenix home"><Mark />Lumenix</a>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
          {[['Home', '#lumenix-top'], ['About', '#lumenix-about'], ['Services', '#lumenix-services'], ['Projects', '#lumenix-projects']].map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <button onClick={() => { setMenuOpen(false); setModal("journal"); }}>Blog</button>
          <button onClick={openContact}>Contact</button>
        </nav>
        <button className={styles.contactButton} onClick={openContact}>Contact</button>
        <button className={styles.menuButton} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}</button>
      </header>
      <section className={styles.hero} aria-label="Lumenix creative studio">
        <div className={styles.services} id="lumenix-services">{services.map((service, i) => <button key={service} onClick={openContact}><span>({String((i + 1) % 5 + 1).padStart(2, "0")})</span>{service}<span className={styles.serviceArrow} aria-hidden="true">↗</span></button>)}</div>
        <div className={styles.heroCopy}><p><span>Elevating Every Moment<br />into an Extraordinary</span><br />Luxury Experience</p><button className={styles.orangeButton} onClick={openContact}>Contact Us</button></div>
        <h1 className={styles.wordmark}>LUMENIX</h1>
        <a className={styles.scrollCue} href="#lumenix-about">Scroll to explore <span aria-hidden="true">↓</span></a>
      </section>
      <div className={styles.partners} aria-label="Creative collaborators">
        {['Oculis', 'PixelGrid', 'Brightly', 'IntelliSpark', 'Oculis'].map((name, i) => <div key={`${name}-${i}`}><span aria-hidden="true">{i % 3 === 0 ? '◉' : i % 3 === 1 ? '◌' : '✳'}</span>{name}</div>)}
      </div>
      <section className={styles.about} id="lumenix-about">
        <div className={styles.sectionLabel}><span><i /> (About Us)</span><span>/03</span><span>©2026</span></div>
        <h2>From concept to completion, we create<br className={styles.desktopBreak} /> inspiring spaces that blend elegance,<br className={styles.desktopBreak} /> innovation, and enduring value.</h2>
      </section>
      <section className={styles.projects} id="lumenix-projects" aria-label="Selected creative projects">
        {projects.map((project, i) => <button key={project.name} className={`${styles.project} ${styles[`project${i}`]}`} onClick={() => setModal(i)} aria-label={`View ${project.name}`}>
          <Image src={assetPath(`/images/lumenix/${project.image}`)} width={382} height={460} alt={project.name === "Chromatic" ? "Side profile in pink and electric blue light" : project.name === "Afterlight" ? "Portrait in dramatic warm orange light" : "Portrait in contrasting blue and orange light"} sizes="(max-width: 600px) 38vw, 27vw" />
          <span className={styles.projectCaption}>{project.name}<span aria-hidden="true">↗</span></span>
        </button>)}
      </section>
      <footer className={styles.footer} id="lumenix-contact">
        <div className={styles.sectionLabel}><span><i /> (Let’s create)</span><span>New perspectives. Lasting impressions.</span></div>
        <button className={styles.footerCta} onClick={openContact}>Something<br />extraordinary. <span aria-hidden="true">↗</span></button>
        <div className={styles.footerBottom}><a href="#lumenix-top" className={styles.logo}><Mark />Lumenix</a><span>© 2026 Lumenix</span><a href="#lumenix-top">Back to top ↑</a></div>
      </footer>
    </div>
    <dialog ref={dialog} className={styles.dialog} onCancel={() => setModal(null)} onClose={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}>
      <button className={styles.close} onClick={() => setModal(null)} aria-label="Close dialog">×</button>
      {typeof modal === "number" && <div className={styles.projectDetail}><Image src={assetPath(`/images/lumenix/${projects[modal].image}`)} alt={projects[modal].name} width={382} height={460} /><div><p className={styles.kicker}>{projects[modal].category}</p><h2>{projects[modal].name}</h2><p>{projects[modal].description}</p><button className={styles.orangeButton} onClick={openContact}>Create something together</button></div></div>}
      {modal === "journal" && <div className={styles.journal}><p className={styles.kicker}>Studio journal</p><h2>A new perspective.</h2><p>Notes on light, identity, and digital experiences.</p><details><summary>Designing with light</summary><p>Color and shadow do more than set a mood. Here, the warm glow of a visor creates a single focal point, while the surrounding interface gives the portrait room to breathe.</p></details><details><summary>Motion with intention</summary><p>A shift in perspective can tell a story. Moving from profile to a direct gaze connects each section into one continuous experience.</p></details></div>}
      {modal === "contact" && <form className={styles.form} onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const content = `LUMENIX — Project brief\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("brief")}\n`;
        const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a"); link.href = url; link.download = "lumenix-project-brief.txt"; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000); setSaved(true);
      }}><p className={styles.kicker}>Let’s create together</p><h2>Make it<br />extraordinary.</h2><p>Start with a thought. Turn it into a project brief.</p><label>Your name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>What do you have in mind?<textarea name="brief" rows={3} required /></label><button className={styles.orangeButton} type="submit">Save project brief ↓</button><p className={styles.formNote} role="status">{saved ? "Your brief has been downloaded. No message has been sent." : "Download your brief to keep or share. This preview does not send messages."}</p></form>}
    </dialog>
  </main>;
}
