import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { PaperCat, JourneyLine, Paw } from "@/components/home/paper-adventure";
import { ForgePreview } from "@/components/home/forge-preview";
import { getEntries } from "@/lib/content";
import { assetPath } from "@/lib/asset-path";

export default function Home() {
  const articles = getEntries("articles");
  return <div className="home" id="home">
    <a href="#main" className="skip-link">跳至正文</a>
    <SiteHeader />
    <main id="main" className="adventure" tabIndex={-1}>
      <JourneyLine />
      <section className="paper-hero" aria-labelledby="hero-title">
        <div className="paper-copy">
          <h1 id="hero-title">带着好奇，<br />去做一点有趣的事。</h1>
          <svg className="hello-wave" viewBox="0 0 90 14" aria-hidden="true"><path d="M2 7 Q9 0 16 7 T30 7 T44 7 T58 7 T72 7 T86 7" /></svg>
          <p>你好，我是宋小鹏，<br />一个爱写代码、喜欢折腾的创造者。<br />做一些有用、有趣、可持续的小东西。</p>
          <a href="#articles" className="hero-invitation">往下逛逛 <span aria-hidden="true">↓</span></a>
        </div>
        <PaperCat />
      </section>
      <section id="articles" className="journey-section journal-section" aria-labelledby="articles-title">
        <div className="section-heading"><span className="map-pin blue" aria-hidden="true" /><h2 id="articles-title">最近文章</h2><p>把沿途的思考，留在这里。</p></div>
        <div className="journal-list">{articles.map((article, index) => <Link key={article.slug} href={`/articles/${article.slug}/`} className="journal-row">
          <div className="journal-image"><Image src={assetPath(`/images/paper/journal-${index % 2 === 0 ? "desk" : "seaside"}.webp`)} alt={index % 2 === 0 ? "窗边的手记与咖啡水彩插画" : "小猫在海边远望的水彩插画"} width={768} height={512} sizes="(max-width: 650px) 85vw, 310px" /></div>
          <div className="journal-copy">{article.date && <time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time>}<h3>{article.title}</h3><p>{article.description}</p><span className="read-link">阅读文章 <span aria-hidden="true">↗</span></span></div>
        </Link>)}</div>
      </section>
      <section id="works" className="journey-section forge-section" aria-labelledby="works-title">
        <div className="section-heading"><span className="map-pin" aria-hidden="true" /><h2 id="works-title">认真做的小作品</h2><p>不急着做很多，先把一个做好。</p></div>
        <div className="forge-layout"><div className="forge-copy"><span className="project-mark" aria-hidden="true">sf.</span><h3>Story Forge</h3><p>一个桌面优先的编程 Agent 平台。<br />围绕自研的原生 Agent Runtime，<br />探索人与工具协作的新方式。</p><a className="text-link" href="https://github.com/songxiaopeng529/story-forge">在 GitHub 查看 <span aria-hidden="true">↗</span></a></div><ForgePreview /></div>
      </section>
      <footer className="paper-footer"><a href="#home" className="farewell">下次冒险见。<Paw /></a><a href="https://github.com/songxiaopeng529" aria-label="宋小鹏的 GitHub">GitHub <span aria-hidden="true">↗</span></a></footer>
    </main>
  </div>;
}
