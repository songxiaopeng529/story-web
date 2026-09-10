"use client";

import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";

type Measure = { width: number; height: number; offset: number };

/** A continuous art plate, with only the uninhabited middle river extended. */
export function PaintedCreek({ paused, onMeasure }: { paused: boolean; onMeasure: (value: { segments: number; height: number }) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const boat = useRef<SVGGElement>(null);
  const route = useRef<SVGPathElement>(null);
  const [size, setSize] = useState<Measure>({ width: 1024, height: 1536, offset: 0 });
  useEffect(() => {
    const parent = root.current?.parentElement;
    if (!parent) return;
    const update = () => {
      const offset = parseFloat(getComputedStyle(parent).getPropertyValue("--scene-offset")) || 0;
      setSize({ width: parent.clientWidth, height: parent.offsetHeight, offset });
    };
    const observer = new ResizeObserver(update);
    observer.observe(parent);
    update();
    return () => observer.disconnect();
  }, []);
  const scale = size.width / 1024;
  const riverScale = .7;
  const height = (size.height - size.offset) / scale;
  const middleHeight = Math.max(100, height - 1016);
  const count = Math.max(1, Math.round(middleHeight / 520));
  const segmentHeight = middleHeight / count;
  const points = [[112,600],[164,660],[106,730],[116,790],[176,870],[138,940],[90,1010],[126,1070],[151,1120]];
  const path = Array.from({ length: count }, (_, index) => points.map(([x,y], pointIndex) => `${index === 0 && pointIndex === 0 ? "M" : "L"}${x} ${600 + index * segmentHeight + (y-600)/520*segmentHeight}`).join(" ")).join(" ");
  useEffect(() => { onMeasure({ segments: count + 2, height: size.height }); }, [count, size.height, onMeasure]);
  useEffect(() => {
    const marker = boat.current, line = route.current, svg = root.current;
    if (!marker || !line || !svg) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = (innerHeight * .64 - svg.getBoundingClientRect().top - size.offset) / scale;
      marker.style.opacity = y > 635 && y < 600 + middleHeight - 25 ? "1" : "0";
      let low = 0, high = line.getTotalLength();
      for (let i=0;i<17;i++) { const mid=(low+high)/2; if (line.getPointAtLength(mid).y<y) low=mid; else high=mid; }
      const at = line.getPointAtLength((low+high)/2);
      marker.setAttribute("transform", `translate(${at.x * riverScale} ${at.y}) rotate(-18) scale(${riverScale})`);
    };
    const schedule = () => { if (!frame) frame=requestAnimationFrame(update); };
    window.addEventListener("scroll",schedule,{ passive:true });
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll",schedule); };
  }, [path, scale, size.offset, middleHeight]);
  const source = assetPath("/images/river/unified-landscape.webp");
  const plate = (top:number, sourceY:number, sourceHeight:number, renderedHeight:number, blend=false, widthScale=1) => ({ position:"absolute" as const, left:0, width:`${widthScale*100}%`, top:size.offset+top*scale, height:renderedHeight*scale, backgroundImage:`url("${source}")`, backgroundRepeat:"no-repeat", backgroundSize:`100% ${1536*renderedHeight/sourceHeight*scale}px`, backgroundPosition:`0 ${-sourceY*renderedHeight/sourceHeight*scale}px`, maskImage:blend?"linear-gradient(to bottom,transparent,black 16px)":undefined });
  return <div ref={root} className={`painted-creek ${paused ? "is-paused" : ""}`} aria-hidden="true" data-segments={count+2}>
    <div style={plate(0,0,430,430)}/>
    {/* Short display slices taper the outlet without scaling the cat or its boat. */}
    {Array.from({length:85},(_,index)=>{
      const t=(index+.5)/85;
      const taper=1-(1-riverScale)*t*t*(3-2*t);
      return <div key={`outlet-${index}`} style={plate(430+index*2,430+index*2,2.1,2.1,false,taper)}/>;
    })}
    {Array.from({length:count},(_,index)=><div key={index} style={plate(600+index*segmentHeight-(index?18:0),600,520,segmentHeight+(index?18:0),index>0,riverScale)}/>)}
    <div style={plate(600+middleHeight,1120,416,416,false,riverScale)}/>
    <svg width="100%" height="100%"><g transform={`translate(0 ${size.offset}) scale(${scale})`}>
      <g className="creek-ripples" fill="none" stroke="#fff" strokeWidth="1.8"><ellipse cx="750" cy="404" rx="103" ry="12"/><ellipse cx="750" cy="404" rx="128" ry="19"/></g>
      <path ref={route} d={path} fill="none" stroke="none"/>
      <g ref={boat} className="painted-boat" opacity="0"><ellipse cy="12" rx="23" ry="5" fill="#577e89" opacity=".17"/><g stroke="#8d8978" strokeWidth=".8" strokeLinejoin="round"><path d="M-25 1 0 11 27-3 14 17-12 18Z" fill="#eee6ce"/><path d="M-25 1 0 11 27-3 1 3Z" fill="#fffdf2"/><path d="M-9 5 4-16 13 6Z" fill="#fffef4"/><path d="M4-16 3 6 13 6Z" fill="#dfd6bd"/></g></g>
    </g></svg>
  </div>;
}
