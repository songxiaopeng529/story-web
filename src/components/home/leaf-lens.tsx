"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { assetPath } from "@/lib/asset-path";

const ZOOM = 1.85;

export function LeafLens() {
  const surface = useRef<HTMLButtonElement>(null);
  const lens = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = surface.current;
    const glass = lens.current;
    if (!host || !glass) return;
    let position = { x: 0.36, y: 0.24 };
    let frame = 0;
    let touching = false;
    let disposed = false;
    const draw = () => {
      frame = 0;
      const { width, height } = host.getBoundingClientRect();
      const x = position.x * width;
      const y = position.y * height;
      const radius = glass.getBoundingClientRect().width / 2;
      // The lens center samples exactly the same point as the base image.
      glass.style.left = `${x}px`;
      glass.style.top = `${y}px`;
      glass.style.backgroundSize = `${width * ZOOM}px ${height * ZOOM}px`;
      glass.style.backgroundPosition = `${radius - x * ZOOM}px ${radius - y * ZOOM}px`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const show = () => { host.dataset.active = "true"; schedule(); };
    const hide = () => { host.dataset.active = "false"; };
    const locate = (event: PointerEvent) => {
      const box = host.getBoundingClientRect();
      position = { x: Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)), y: Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)) };
      show();
    };
    const move = (event: PointerEvent) => { if (event.pointerType === "mouse" || touching) locate(event); };
    const down = (event: PointerEvent) => { touching = event.pointerType !== "mouse"; locate(event); };
    const up = () => { if (touching) hide(); touching = false; };
    const leave = () => { touching = false; hide(); };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") { hide(); return; }
      const directions: Record<string, [number, number]> = { ArrowLeft: [-0.04, 0], ArrowRight: [0.04, 0], ArrowUp: [0, -0.04], ArrowDown: [0, 0.04] };
      const delta = directions[event.key];
      if (delta) {
        event.preventDefault();
        position = { x: Math.max(0, Math.min(1, position.x + delta[0])), y: Math.max(0, Math.min(1, position.y + delta[1])) };
        show();
      } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); show(); }
    };
    host.querySelector("img")?.decode().then(() => { if (!disposed) { host.dataset.ready = "true"; show(); } }).catch(() => {});
    const observer = new ResizeObserver(schedule);
    observer.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerdown", down, { passive: true });
    host.addEventListener("pointerup", up);
    host.addEventListener("pointercancel", leave);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("focus", show);
    host.addEventListener("blur", hide);
    host.addEventListener("keydown", keyboard);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", leave);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("focus", show);
      host.removeEventListener("blur", hide);
      host.removeEventListener("keydown", keyboard);
    };
  }, []);
  return (
    <div className="leaf-study">
      <button ref={surface} type="button" className="leaf-surface" aria-label="探索银杏叶脉" aria-describedby="lens-help">
        <Image className="leaf-photo" src={assetPath("/images/natural-leaf.webp")} width={1162} height={1353} alt="" preload sizes="(max-width: 700px) 100vw, 60vw" draggable={false} />
        <span ref={lens} className="leaf-lens" aria-hidden="true" style={{ backgroundImage: `url("${assetPath("/images/natural-leaf.webp")}")` }} />
      </button>
      <span id="lens-help" className="sr-only">移动鼠标或按住触摸，透过放大镜观察清晰叶脉。键盘聚焦后用方向键移动，Escape 收起。</span>
    </div>
  );
}
