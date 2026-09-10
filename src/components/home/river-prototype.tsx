"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { PaperCat, Paw } from "./paper-adventure";
import { ForgePreview } from "./forge-preview";
import { AdaptiveRiver } from "./adaptive-river";
import { PaintedCreek } from "./painted-creek";
import { assetPath } from "@/lib/asset-path";

type Article = { slug: string; title: string; description: string; date: string };

export function RiverPrototype({ articles }: { articles: Article[] }) {
  const [count, setCount] = useState(2);
  const [scenic, setScenic] = useState(true);
  const [works, setWorks] = useState(1);
  const [watercolor, setWatercolor] = useState(true);
  const [paused, setPaused] = useState(false);
  const [waterStatus, setWaterStatus] = useState("加载水面");
  const [metrics, setMetrics] = useState({ segments: 0, height: 0 });
  const shown = articles.length ? Array.from({ length: count }, (_, index) => ({ ...articles[index % articles.length], demo: index >= articles.length })) : [];
  return <div id="home" className="river-prototype">
    <a href="#main" className="skip-link">跳至正文</a><SiteHeader />
    <details className="creek-settings"><summary>河流实验设置</summary><aside className="river-controls" aria-label="河流原型控制">
      <div className="prototype-label"><strong>河流生长实验</strong><Link href="/">回到首页 ↗</Link></div>
      <div className="count-control" role="group" aria-label="文章数量"><span>文章</span>{[2, 6, 12].map(n => <button type="button" key={n} aria-pressed={count === n} onClick={() => setCount(n)}>{n} 篇</button>)}</div>
      <div className="count-control" role="group" aria-label="作品数量"><span>作品</span>{[1, 3].map(n => <button type="button" key={n} aria-pressed={works === n} onClick={() => setWorks(n)}>{n} 个</button>)}</div>
      <div className="count-control" role="group" aria-label="场景版本"><button type="button" aria-pressed={scenic} onClick={()=>setScenic(true)}>山间小溪</button><button type="button" aria-pressed={!scenic} onClick={()=>setScenic(false)}>原版河道</button></div>
      <div className="count-control water-mode" role="group" aria-label="水面效果">{!scenic && <><button type="button" aria-pressed={!watercolor} onClick={()=>setWatercolor(false)}>基础版</button><button type="button" aria-pressed={watercolor} onClick={()=>setWatercolor(true)}>水彩 2.5D</button></>}<button type="button" disabled={!scenic && !watercolor} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?"继续水流":"暂停水流"}</button></div>
      <output className="river-metrics" aria-live="polite">{metrics.segments} 段河道 · {metrics.height.toLocaleString()} px · {scenic ? "连续水彩场景" : watercolor?waterStatus:"基础版"}</output>
    </aside></details>
    <main id="main" className={`adventure river-adventure ${scenic ? "unified-creek" : ""}`} tabIndex={-1}>
      {scenic ? <PaintedCreek paused={paused} onMeasure={setMetrics}/> : <AdaptiveRiver revision={`${count}-${works}`} onMeasure={setMetrics} watercolor={watercolor} paused={paused} onStatus={setWaterStatus} />}
      <section className="paper-hero" aria-labelledby="hero-title">
        <div className="paper-copy"><h1 id="hero-title">带着好奇，<br />顺着小溪，慢慢探索。</h1><p>{scenic ? "记录思考，打磨作品，让想法自然生长。" : "文章多一点，河流就长一点。试试数量切换，再向下滚动，看看纸船经过哪里。"}</p><a className="hero-invitation" href="#articles">沿溪阅读 <span aria-hidden="true">↓</span></a></div>{!scenic && <PaperCat />}
      </section>
      <section id="articles" className="journey-section journal-section" aria-labelledby="articles-title">
        <div className="section-heading" data-river-anchor><h2 id="articles-title">最近文章</h2>{count > 2 && <p>增加的条目是演示副本，不会新增真实文章。</p>}</div>
        <div className="journal-list">{shown.map((article, index) => <Link key={`${article.slug}-${index}`} data-river-anchor href={`/articles/${article.slug}/`} className="journal-row">
          <div className="journal-image"><Image src={assetPath(`/images/paper/journal-${index % 2 ? "seaside" : "desk"}.webp`)} alt="" width={900} height={600} sizes="(max-width:650px) 80vw, 310px" /></div>
          <div className="journal-copy"><span className="prototype-entry-label">{article.demo ? `演示副本 · 第 ${index + 1} 篇` : article.date.replaceAll("-", ".")}</span><h3>{article.title}</h3><p>{article.description}{article.demo && index % 3 === 2 ? " 这一段特意保留更长的摘要，用来验证文字换行、条目高度改变时，河岸是否依然避开正文，并保持自然的转弯节奏。" : ""}</p><span className="read-link">阅读原文 <span aria-hidden="true">↗</span></span></div>
        </Link>)}</div>
        {!shown.length && <p>暂无文章。河流会继续连接作品区。</p>}
      </section>
      <section id="works" className="journey-section forge-section" aria-labelledby="works-title">
        <div className="section-heading" data-river-anchor><h2 id="works-title">认真做的小作品</h2></div>
        {Array.from({ length: works }, (_, index) => <div key={index} className="forge-layout" data-river-anchor><div className="forge-copy"><span className="project-mark" aria-hidden="true">sf.</span><h3>Story Forge</h3>{index > 0 && <span className="prototype-entry-label">演示副本 · 非新增项目</span>}<p>一个桌面优先的编程 Agent 平台。<br />围绕自研的原生 Agent Runtime，<br />探索人与工具协作的新方式。</p><a className="text-link" href="https://github.com/songxiaopeng529/story-forge">在 GitHub 查看 ↗</a></div><ForgePreview /></div>)}
      </section>
      <footer className="paper-footer"><a href="#home" className="farewell">下次冒险见。<Paw /></a><Link href="/">回到首页 ↗</Link></footer>
    </main>
  </div>;
}
