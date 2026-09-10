"use client";

import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/asset-path";

const vertexSource = `
attribute vec2 aPosition;
attribute vec2 aUv;
uniform vec2 uResolution;
uniform vec2 uOffset;
varying vec2 vUv;
varying vec2 vPosition;
void main() {
  vec2 pixel = aPosition + uOffset;
  gl_Position = vec4(pixel / uResolution * vec2(2.0,-2.0) + vec2(-1.0,1.0),0.0,1.0);
  vUv = aUv;
  vPosition = aPosition;
}`;

const fragmentSource = `
precision mediump float;
uniform sampler2D uTexture;
uniform float uTime;
uniform vec3 uBoat;
varying vec2 vUv;
varying vec2 vPosition;
void main() {
  float along = vUv.x;
  float across = vUv.y;
  float edge = abs(across * 2.0 - 1.0);
  float grain = sin(along*47.0+across*18.0)*sin(along*19.0-across*34.0);
  float alpha = (1.0-smoothstep(.77+grain*.018,1.0,edge));
  vec2 drift = vec2(sin(along*8.0+across*6.0-uTime*.65), cos(along*6.0-across*9.0+uTime*.42))*.018;
  vec2 uv = vec2(across*.38, along*.40-uTime*.018);
  vec3 bed = texture2D(uTexture, uv+drift).rgb;
  vec3 flow = texture2D(uTexture, vec2(1.0-uv.x,uv.y*.83-uTime*.012)+drift*.5).rgb;
  vec3 color = mix(bed,flow,.26);
  color = mix(color,vec3(.84,.93,.96),.40);
  float wave = sin(along*36.0-across*13.0-uTime*1.4+sin(across*18.0+along*5.0));
  float glint = pow(max(0.0,wave),18.0)*.055;
  color += glint;
  color = mix(color,vec3(.94,.95,.88),smoothstep(.55,1.0,edge)*.48);
  vec2 delta = vPosition-uBoat.xy;
  float c = cos(uBoat.z), s = sin(uBoat.z);
  vec2 local = vec2(c*delta.x+s*delta.y,-s*delta.x+c*delta.y);
  float behind = smoothstep(0.0,12.0,-local.x)*(1.0-smoothstep(25.0,110.0,-local.x));
  float wake = exp(-pow((abs(local.y)+local.x*.23)/2.2,2.0))*behind;
  float pulse = .7+.3*sin(-local.x*.24-uTime*2.0);
  color = mix(color,vec3(1.0),wake*pulse*.52);
  // Straight-alpha output; the browser composites this transparent canvas on paper.
  gl_FragColor = vec4(color,alpha*.95);
}`;

export function WaterSurface({ path, riverWidth, paused, onStatus }: { path: string; riverWidth: number; paused: boolean; onStatus: (status: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent || !path) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true, powerPreference: "low-power" });
    const fallback = () => { delete parent.dataset.waterReady; onStatus("静态水彩"); };
    if (!gl) { fallback(); return; }
    let disposed = false, frame = 0, ready = false, visible = true, lastTime = 0, elapsed = elapsedRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Water shader compilation failed");
      return shader;
    };
    const program = gl.createProgram()!;
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Water shader linking failed");
    } catch {
      shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); gl.deleteBuffer(buffer); gl.deleteTexture(texture); fallback(); return;
    }
    const curve = document.createElementNS("http://www.w3.org/2000/svg", "path");
    curve.setAttribute("d", path);
    const length = curve.getTotalLength();
    const steps = Math.max(2, Math.ceil(length / 7));
    const vertices = new Float32Array((steps + 1) * 8);
    for (let i = 0; i <= steps; i++) {
      const distance = i / steps * length;
      const point = curve.getPointAtLength(distance);
      const before = curve.getPointAtLength(Math.max(0,distance-1));
      const after = curve.getPointAtLength(Math.min(length,distance+1));
      const dx=after.x-before.x, dy=after.y-before.y, norm=Math.hypot(dx,dy)||1;
      const half = riverWidth * .76 * (.90+.075*Math.sin(distance/63)+.045*Math.sin(distance/19));
      for (let side=0; side<2; side++) {
        const sign=side?1:-1, at=i*8+side*4;
        vertices[at]=point.x-dy/norm*half*sign; vertices[at+1]=point.y+dx/norm*half*sign;
        vertices[at+2]=distance/150; vertices[at+3]=side;
      }
    }
    gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    for (const [name,offset] of [["aPosition",0],["aUv",8]] as const) {
      const location=gl.getAttribLocation(program,name); gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location,2,gl.FLOAT,false,16,offset);
    }
    const resolution=gl.getUniformLocation(program,"uResolution"), offset=gl.getUniformLocation(program,"uOffset"), time=gl.getUniformLocation(program,"uTime"), boat=gl.getUniformLocation(program,"uBoat");
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.MIRRORED_REPEAT); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program,"uTexture"),0);
    const draw = (now: number) => {
      frame=0;
      if (disposed || !ready || !visible || document.hidden || gl.isContextLost()) return;
      const animate = !paused && !reduced.matches;
      if (animate && now-lastTime<32) { frame=requestAnimationFrame(draw); return; }
      if (animate && lastTime) elapsed+=Math.min((now-lastTime)/1000,.05);
      elapsedRef.current=elapsed;
      lastTime=now;
      const dpr=Math.min(devicePixelRatio||1,1.5), width=innerWidth, height=innerHeight;
      if (canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)) { canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr); }
      gl.viewport(0,0,canvas.width,canvas.height); gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      const box=parent.getBoundingClientRect();
      gl.uniform2f(resolution,width,height);gl.uniform2f(offset,box.left,box.top);gl.uniform1f(time,elapsed);
      const marker=parent.querySelector<SVGGElement>(".river-ship");
      const distance=Number(marker?.dataset.distance||0), p=curve.getPointAtLength(distance);
      const a=curve.getPointAtLength(Math.max(0,distance-2)), b=curve.getPointAtLength(Math.min(length,distance+2));
      gl.uniform3f(boat,p.x,p.y,Math.atan2(b.y-a.y,b.x-a.x));
      gl.drawArrays(gl.TRIANGLE_STRIP,0,(steps+1)*2);
      canvas.dataset.time=elapsed.toFixed(2);
      if (animate) frame=requestAnimationFrame(draw);
    };
    const schedule = () => { if (!frame && !disposed) frame=requestAnimationFrame(draw); };
    const image = new Image();
    image.onload=()=>{if(disposed)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);ready=true;parent.dataset.waterReady="true";onStatus(paused||reduced.matches?"静止水彩":"实时水面");schedule();};
    image.onerror=fallback;image.src=assetPath("/images/river/water-texture.webp");
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else schedule();});observer.observe(parent);
    const visibility=()=>{cancelAnimationFrame(frame);frame=0;lastTime=0;schedule();};
    const motion=()=>{onStatus(paused||reduced.matches?"静止水彩":"实时水面");visibility();};
    const lost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;fallback();};
    const restored=()=>setEpoch(value=>value+1);
    canvas.addEventListener("webglcontextlost",lost);canvas.addEventListener("webglcontextrestored",restored);
    window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);document.addEventListener("visibilitychange",visibility);reduced.addEventListener("change",motion);
    return ()=>{disposed=true;image.onload=null;image.onerror=null;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);document.removeEventListener("visibilitychange",visibility);reduced.removeEventListener("change",motion);canvas.removeEventListener("webglcontextlost",lost);canvas.removeEventListener("webglcontextrestored",restored);shaders.forEach(shader=>gl.deleteShader(shader));gl.deleteBuffer(buffer);gl.deleteTexture(texture);gl.deleteProgram(program);delete parent.dataset.waterReady;};
  }, [path, riverWidth, paused, onStatus, epoch]);
  return <canvas ref={canvasRef} className="water-canvas" aria-hidden="true" />;
}
