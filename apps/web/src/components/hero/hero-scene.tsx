"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { HeroArtwork } from "./hero-artwork";

type Phase = "pre" | "sketch" | "color" | "alive" | "static";

const SEEN_KEY = "story-hero-seen";

/** 调试挂钩：?hero=sketch|color|alive|static 直接定格在某一阶段 */
function readInitialPhase(): Phase {
  if (typeof window === "undefined") return "pre";
  const q = new URLSearchParams(window.location.search).get("hero");
  return q === "sketch" || q === "color" || q === "alive" || q === "static"
    ? q
    : "pre";
}
/** 相邻两笔之间的间隔 */
const DRAW_STEP_MS = 55;
/** 单笔绘制时长 */
const DRAW_DURATION_MS = 750;
/** 线稿全部画完后，停顿一下再上色 */
const COLOR_LEAD_MS = 300;
/** 上色阶段时长（与 CSS 中 fill-opacity 的 delay + duration 对齐） */
const COLOR_PHASE_MS = 2400;

/**
 * 首页主视觉：一张「正在被画出来」的插画。
 * pre → sketch（逐笔起稿，铅笔光标跟随）→ color（水彩式晕染上色）→ alive（视差 + 眼神 + 待机生命）。
 * 每个会话只完整演一次；prefers-reduced-motion 直接呈现静态成品。
 */
export function HeroScene() {
  const [phase, setPhase] = useState<Phase>(readInitialPhase);
  const phaseRef = useRef<Phase>(phase);
  const rootRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  // 阶段只能在事件回调 / effect 中推进（渲染期不写 ref）
  const advanceTo = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const finish = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* 隐私模式下静默失败 */
    }
    advanceTo("alive");
  }, [advanceTo]);

  // 阶段编排：为每笔排好延迟，然后 pre → sketch → color → alive
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (phaseRef.current !== "pre") {
      // 调试挂钩：hydration 保留了 SSR 的 pre 类名，这里直接同步成目标阶段
      root.className = `hero-scene hero-scene--${phaseRef.current}`;
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (reduced || seen) {
      // 异步推进，避免在 effect 中同步 setState（CSS 已保证此间画面完整）
      const id = requestAnimationFrame(() =>
        advanceTo(reduced ? "static" : "alive"),
      );
      return () => cancelAnimationFrame(id);
    }

    const drawEls = Array.from(root.querySelectorAll<SVGElement>(".draw"));
    drawEls.forEach((el, i) => {
      el.style.setProperty("--d", `${i * DRAW_STEP_MS}ms`);
    });

    const raf = requestAnimationFrame(() => advanceTo("sketch"));
    const sketchMs =
      drawEls.length * DRAW_STEP_MS + DRAW_DURATION_MS + COLOR_LEAD_MS;
    timersRef.current = [
      window.setTimeout(() => advanceTo("color"), sketchMs),
      window.setTimeout(finish, sketchMs + COLOR_PHASE_MS),
    ];
    return () => {
      cancelAnimationFrame(raf);
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, [advanceTo, finish]);

  // 铅笔光标（sketch）与 视差 + 眼神（alive）的常驻 rAF 循环
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pencil = root.querySelector<SVGGElement>(".pencil");
    const strokes = Array.from(root.querySelectorAll<SVGGeometryElement>(".draw"))
      .map((el, i) => {
        let len = 0;
        try {
          len = el.getTotalLength();
        } catch {
          /* 个别浏览器对基础形状不支持，跳过即可 */
        }
        return { el, len, start: i * DRAW_STEP_MS };
      })
      .filter((s) => s.len > 0);
    const sketchStart = performance.now() + 120;
    const pencilEnd =
      strokes.length * DRAW_STEP_MS + DRAW_DURATION_MS + COLOR_LEAD_MS;

    const pupils = [
      ...Array.from(root.querySelectorAll<SVGGElement>(".pupil-boy")).map(
        (el) => ({ el, ease: 0.14, max: 5, x: 0, y: 0 }),
      ),
      ...Array.from(root.querySelectorAll<SVGGElement>(".pupil-cat")).map(
        (el) => ({ el, ease: 0.045, max: 3.4, x: 0, y: 0 }),
      ),
    ];

    const pointer = { x: 0, y: 0, nx: 0, ny: 0, has: false, lastMove: 0 };
    const par = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.has = true;
      pointer.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const current = phaseRef.current;

      if (pencil) {
        if (current === "sketch") {
          const t = now - sketchStart;
          if (t >= 0 && t <= pencilEnd) {
            let active = strokes[0];
            for (const s of strokes) {
              if (t >= s.start) active = s;
              else break;
            }
            if (active) {
              const local = Math.min(
                1,
                Math.max(0, (t - active.start) / DRAW_DURATION_MS),
              );
              const at = local * active.len;
              const p = active.el.getPointAtLength(at);
              const p2 = active.el.getPointAtLength(
                Math.min(active.len, at + 2),
              );
              const angle =
                (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI - 90;
              pencil.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${angle}deg)`;
              pencil.style.opacity = "1";
            }
          } else {
            pencil.style.opacity = "0";
          }
        } else if (pencil.style.opacity !== "0") {
          pencil.style.opacity = "0";
        }
      }

      if (current !== "alive") return;

      // 无人操作时，视线缓缓地自顾自漂移（移动端也有生命力）
      let tx = pointer.nx;
      let ty = pointer.ny;
      const idle = !pointer.has || now - pointer.lastMove > 5000;
      if (idle) {
        tx = Math.sin(now / 2600) * 0.35;
        ty = Math.cos(now / 3400) * 0.2;
      }
      par.x += (tx - par.x) * 0.06;
      par.y += (ty - par.y) * 0.06;
      root.style.setProperty("--px", par.x.toFixed(4));
      root.style.setProperty("--py", par.y.toFixed(4));

      for (const p of pupils) {
        const rect = p.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = par.x * p.max;
        let dy = par.y * p.max * 0.6;
        if (!idle) {
          const vx = pointer.x - cx;
          const vy = pointer.y - cy;
          const dist = Math.hypot(vx, vy) || 1;
          const reach = Math.min(1, dist / 260);
          dx = (vx / dist) * p.max * reach;
          dy = (vy / dist) * p.max * 0.7 * reach;
        }
        p.x += (dx - p.x) * p.ease;
        p.y += (dy - p.y) * p.ease;
        p.el.style.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px)`;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const skipping = phase === "sketch" || phase === "color";

  return (
    <div
      className={`hero-scene hero-scene--${phase}`}
      id="hero-scene"
      ref={rootRef}
      suppressHydrationWarning
    >
      <HeroArtwork />
      {skipping ? (
        <button className="hero-scene__skip" onClick={finish} type="button">
          跳过
        </button>
      ) : null}
    </div>
  );
}
