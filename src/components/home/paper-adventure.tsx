"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { assetPath } from "@/lib/asset-path";

export function Paw() {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><g fill="#edc36d" stroke="#39423b" strokeWidth="1.25"><ellipse cx="10" cy="14" rx="3.5" ry="5" transform="rotate(-28 10 14)" /><ellipse cx="19" cy="9" rx="3.3" ry="4.8" /><ellipse cx="28" cy="13" rx="3.3" ry="4.8" transform="rotate(26 28 13)" /><path d="M13 24c3-8 10-9 14-1 6 9-3 8-7 6-5 5-13 3-7-5Z" /></g></svg>;
}

export function PaperCat() {
  const surface = useRef<HTMLDivElement>(null);
  return <div ref={surface} className="paper-cat" onPointerMove={event => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    surface.current?.style.setProperty("--cat-x", `${((event.clientX - box.left) / box.width - .5) * 10}px`);
    surface.current?.style.setProperty("--cat-r", `${((event.clientY - box.top) / box.height - .5) * -2}deg`);
  }} onPointerLeave={() => { surface.current?.style.setProperty("--cat-x", "0px"); surface.current?.style.setProperty("--cat-r", "0deg"); }}>
    <Image className="cat-art" src={assetPath("/images/paper/cat-boat.webp")} alt="戴圆眼镜、穿绿色卫衣的小猫坐在纸船里写代码，身边是一盆小芽" width={1536} height={1024} sizes="(max-width: 650px) 100vw, 58vw" preload />
    <span className="cat-paw"><Paw /></span>
  </div>;
}

export function JourneyLine() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const boat = useRef<SVGGElement>(null);
  useEffect(() => {
    const canvas = svg.current;
    const line = path.current;
    const marker = boat.current;
    const parent = canvas?.parentElement;
    if (!canvas || !line || !marker || !parent) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (!parent.isConnected) return;
      const box = parent.getBoundingClientRect();
      const cat = parent.querySelector<HTMLElement>(".paper-cat");
      const articles = parent.querySelector<HTMLElement>("#articles");
      const works = parent.querySelector<HTMLElement>("#works");
      if (!cat || !articles || !works) return;
      const w = box.width, h = parent.offsetHeight;
      const mobile = w < 650;
      const x = mobile ? 19 : w * .072;
      const start = cat.offsetTop + cat.offsetHeight * .93;
      const ay = articles.offsetTop + 38, wy = works.offsetTop + 38;
      canvas.setAttribute("viewBox", `0 0 ${w} ${h}`);
      line.setAttribute("d", `M ${w * .73} ${start} C ${w * 1.01} ${start + 85}, ${x - 45} ${start + 105}, ${x} ${ay} C ${x + (mobile ? 14 : 65)} ${ay + 100}, ${x - (mobile ? 18 : 65)} ${wy - 130}, ${x} ${wy} C ${x + (mobile ? 8 : 35)} ${wy + 150}, ${x - 25} ${h - 220}, ${x} ${h - 160} S ${w * .32} ${h - 62}, ${w * .72} ${h - 61}`);
      const length = line.getTotalLength();
      const progress = Math.max(0, Math.min(1, (innerHeight * .7 - box.top - start) / Math.max(1, h - start - 60)));
      const at = line.getPointAtLength(length * progress);
      marker.setAttribute("transform", `translate(${at.x} ${at.y})`);
      marker.style.opacity = reduced.matches ? "0" : "1";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(schedule);
    observer.observe(parent);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    schedule();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduced.removeEventListener("change", schedule); };
  }, []);
  return <svg ref={svg} className="journey-line" aria-hidden="true"><path ref={path} fill="none" stroke="#667269" strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" /><g ref={boat} className="journey-boat"><path d="m-10-2 20 0-5 7h-10z" fill="#f7e7b8" stroke="#727568" strokeWidth="1" /><path d="m-5-3 6-7 5 7z" fill="white" stroke="#727568" strokeWidth=".8" /></g></svg>;
}
