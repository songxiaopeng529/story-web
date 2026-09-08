import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { LeafLens } from "@/components/home/leaf-lens";
import { GardenGraph } from "@/components/home/garden-graph";
import { getEntries } from "@/lib/content";
import { assetPath } from "@/lib/asset-path";

export default function Home() {
  const articles = getEntries("articles");
  const works = getEntries("works");
  return (
    <div className="home" id="home">
      <a href="#main" className="skip-link">跳至正文</a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="nature-hero" aria-labelledby="hero-title">
          <div className="hero-copy"><h1 id="hero-title">把好奇，<br />种进生活。</h1><p>记录思考，打磨作品，让小小的想法慢慢生长。</p></div>
          <LeafLens />
        </section>
        <section id="works" className="garden-section" aria-labelledby="works-title">
          <div className="section-copy garden-copy"><h3 className="section-title">数字花园</h3><p>用代码连接想法，<br className="desktop-break" />让作品在探索中持续生长。</p><Link className="text-link" href={`/works/${works[0]?.slug || "story-web"}/`}>探索作品 <span aria-hidden="true">→</span></Link></div>
          <GardenGraph works={works} />
        </section>
        <section id="articles" className="reading-section" aria-labelledby="reading-title">
          <a href="#notes" className="reading-photo-link" aria-label="浏览文章"><Image src={assetPath("/images/natural-reading.webp")} alt="日光洒在阅读器、笔记本与干花上" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 60vw" className="reading-photo" /></a>
          <div className="section-copy reading-copy"><h2 id="reading-title" className="section-title">慢读</h2><p>在碎片时代，重建专注与理解。<br className="desktop-break" />把思考写下来，也留一点时间给阅读。</p><a className="text-link" href="#notes">翻开文章 <span aria-hidden="true">→</span></a></div>
        </section>
        <section id="notes" className="notes-section" aria-labelledby="notes-title">
          <h2 id="notes-title" className="section-title">拾起一些片刻</h2>
          <div className="article-list">{articles.map((article, index) => <Link key={article.slug} href={`/articles/${article.slug}/`} className="article-row">
            <span className={`article-botanical botanical-${index % 2}`} aria-hidden="true"><Image src={assetPath("/images/natural-leaf.webp")} alt="" fill sizes="90px" /></span>
            <span className="article-summary"><h3>{article.title}</h3><span>{article.description}</span></span>
            <time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time><span className="article-arrow" aria-hidden="true">→</span>
          </Link>)}</div>
        </section>
      </main>
      <footer className="site-footer">持续生长，不必着急。</footer>
    </div>
  );
}
