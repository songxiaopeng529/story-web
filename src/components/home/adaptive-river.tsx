"use client";

import { useEffect, useId, useRef, useState } from "react";
import { WaterSurface } from "./water-surface";
import { assetPath } from "@/lib/asset-path";

type Geometry = { width: number; height: number; riverWidth: number; paths: string[] };
type Point = { x: number; y: number };

export function AdaptiveRiver({ revision, onMeasure, watercolor = false, paused = false, onStatus }: { revision: string; onMeasure: (metrics: { segments: number; height: number }) => void; watercolor?: boolean; paused?: boolean; onStatus: (status: string) => void }) {
  const uid = useId().replaceAll(":", "");
  const root = useRef<SVGSVGElement>(null);
  const center = useRef<SVGPathElement>(null);
  const ship = useRef<SVGGElement>(null);
  const [geometry, setGeometry] = useState<Geometry>({ width: 1, height: 1, riverWidth: 36, paths: [] });

  useEffect(() => {
    const parent = root.current?.parentElement;
    if (!parent) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!parent.isConnected) return;
      const box = parent.getBoundingClientRect();
      const cat = parent.querySelector<HTMLElement>(".paper-cat");
      const footer = parent.querySelector<HTMLElement>(".paper-footer");
      if (!cat || !footer) return;
      const width = box.width;
      const mobile = width <= 650;
      const riverWidth = mobile ? 23 : Math.min(56, width * .041);
      const middle = mobile ? 32 : width * .069;
      const amplitude = mobile ? 8 : width * .018;
      const catBox = cat.getBoundingClientRect();
      const start = { x: width * .72, y: catBox.top - box.top + catBox.height * .90 };
      const anchors = [...parent.querySelectorAll<HTMLElement>("[data-river-anchor]")].map((element, index) => {
        const rect = element.getBoundingClientRect();
        return { x: middle + (index % 2 ? -amplitude : amplitude), y: rect.top - box.top + Math.min(rect.height * .5, 120) };
      }).filter(point => point.y > start.y + 40);
      const endY = footer.getBoundingClientRect().top - box.top + 35;
      const points: Point[] = [start, ...anchors, { x: middle, y: endY }];
      const paths: string[] = [];
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        const gap = b.y - a.y;
        // Each content anchor adds a curve; control points preserve vertical tangency.
        paths.push(`M ${a.x} ${a.y} C ${a.x} ${a.y + gap * .5}, ${b.x} ${b.y - gap * .5}, ${b.x} ${b.y}`);
      }
      const last = points.at(-1)!;
      paths.push(`M ${last.x} ${last.y} C ${last.x} ${endY + 65}, ${width * .4} ${endY + 65}, ${width * .75} ${endY + 66}`);
      setGeometry({ width, height: parent.offsetHeight, riverWidth, paths });
      onMeasure({ segments: paths.length, height: Math.round(parent.offsetHeight) });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(parent);
    parent.querySelectorAll("[data-river-anchor], .paper-cat").forEach(element => observer.observe(element));
    window.addEventListener("resize", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", schedule); };
  }, [revision, onMeasure]);

  useEffect(() => {
    const path = center.current, marker = ship.current, parent = root.current?.parentElement;
    if (!path || !marker || !parent || !geometry.paths.length) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const length = path.getTotalLength();
    let frame = 0;
    const position = () => {
      frame = 0;
      if (!parent.isConnected) return;
      const top = parent.getBoundingClientRect().top;
      const first = path.getPointAtLength(0), last = path.getPointAtLength(length);
      const y = reduced.matches ? first.y : Math.max(first.y, Math.min(last.y, innerHeight * .60 - top));
      // Monotonic river Y lets the boat stay at reading height even on very long pages.
      let low = 0, high = length;
      for (let i = 0; i < 18; i++) {
        const mid = (low + high) / 2;
        if (path.getPointAtLength(mid).y < y) low = mid; else high = mid;
      }
      const distance = (low + high) / 2;
      const at = path.getPointAtLength(distance);
      const before = path.getPointAtLength(Math.max(0, distance - 2));
      const after = path.getPointAtLength(Math.min(length, distance + 2));
      const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
      const scale = geometry.width <= 650 ? .65 : 1;
      marker.setAttribute("transform", `translate(${at.x} ${at.y}) rotate(${angle}) scale(${scale})`);
      marker.dataset.distance = distance.toFixed(1);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(position); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    reduced.addEventListener("change", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); reduced.removeEventListener("change", schedule); };
  }, [geometry]);

  const whole = geometry.paths.map((path, index) => index ? path.replace(/^M [\d.e-]+ [\d.e-]+ /, "") : path).join(" ");
  return <>{watercolor && whole && <WaterSurface path={whole} riverWidth={geometry.riverWidth} paused={paused} onStatus={onStatus} />}<svg ref={root} className={`adaptive-river ${watercolor ? "watercolor-river" : ""}`} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true" data-segments={geometry.paths.length}>
    <defs>
      <pattern id={`${uid}-paint`} width="190" height="190" patternUnits="userSpaceOnUse"><image href={assetPath("/images/river/water-texture.webp")} width="190" height="190" /></pattern>
      <pattern id={`${uid}-water`} width="67" height="49" patternUnits="userSpaceOnUse"><path d="M5 9q12-4 24 0m12 12q9 3 21-1M1 36q13 3 23-1m10 9 15-1" stroke="white" strokeOpacity=".8" strokeWidth="1.5" fill="none" /><path d="m31 7 13-1M8 26l10-1m31 10 9-1" stroke="#719caa" strokeOpacity=".30" strokeWidth=".8" /></pattern>
      <pattern id={`${uid}-grain`} width="23" height="29" patternUnits="userSpaceOnUse"><circle cx="3" cy="8" r="1.6" fill="white" opacity=".38" /><circle cx="17" cy="23" r="2.4" fill="#91b5bc" opacity=".2" /><path d="m8 20 4 1" stroke="white" strokeWidth=".8" opacity=".6" /></pattern>
      <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffdf3" /><stop offset="1" stopColor="#e2d2af" /></linearGradient>
    </defs>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">{geometry.paths.length > 0 && <g className="river-surface">
      <path d={whole} stroke="#e4eeea" strokeOpacity=".5" strokeWidth={geometry.riverWidth + 13} />
      <path d={whole} stroke="#d4e6e8" strokeOpacity=".65" strokeWidth={geometry.riverWidth + 5} />
      <path d={whole} stroke={watercolor ? `url(#${uid}-paint)` : "#a9ccd6"} strokeOpacity={watercolor ? ".82" : ".65"} strokeWidth={geometry.riverWidth} />
      <path d={whole} stroke="#8fb8c5" strokeOpacity=".28" strokeWidth={geometry.riverWidth * .53} />
      <path d={whole} stroke={`url(#${uid}-grain)`} strokeWidth={geometry.riverWidth + 4} />
      {!watercolor && <><path d={whole} stroke={`url(#${uid}-water)`} strokeWidth={geometry.riverWidth * .85} />
      <path d={whole} stroke="white" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="19 37 9 52" /></>}
    </g>}</g>
    {watercolor && geometry.paths.slice(1,-1).filter((_,index)=>index%3===0).map((path,index)=>{
      const numbers=path.match(/-?\d+(?:\.\d+)?/g)?.map(Number)||[];
      const x=numbers[0], y=numbers[1];
      // White-paper assets stay outside the water; never obscure it with a white rectangle.
      const size=Math.max(15,Math.min(geometry.width<=650?38:100,x-geometry.riverWidth*.8-3));
      const bankX=Math.max(0,x-geometry.riverWidth*.8-size-2);
      return <image key={index} className="river-bank-art" href={assetPath("/images/river/bank-white.webp")} x={bankX} y={y-size*.4} width={size} height={size*.5} opacity=".88" />;
    })}
    <path ref={center} className="river-centerline" d={whole} fill="none" stroke="none" />
    <g ref={ship} className="river-ship">
      <path d="M-22-10q-12-8-25-8m25 28q-12 8-25 8" stroke="white" strokeWidth="1.4" opacity=".85" fill="none" />
      <ellipse cx="-1" cy="4" rx="26" ry="13" fill="#4d7e8b" opacity=".19" />
      <g stroke="#8e836c" strokeWidth=".75" strokeLinejoin="round">
        <path d="M-28-12 31 0-23 14-14 0Z" fill={`url(#${uid}-paper)`} />
        <path d="m-28-12 20 10 39 2-45 0Z" fill="#fffdf1" />
        <path d="M-23 14-8-2 31 0Z" fill="#e8d9b8" />
        <path d="M-14 0 4-17 13 0Z" fill="#fffef6" />
        <path d="M4-17 1 0h12Z" fill="#e4d5b7" />
        <path d="m-23 14 24-14-9-2Z" fill="#f6edda" />
      </g>
      <path d="m-20-9 8 4m-7 15 8-7M5-11l5 9m-31-1 6 3" stroke="#bbae8c" opacity=".55" strokeWidth=".5" />
    </g>
  </svg></>;
}
