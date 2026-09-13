import type { Metadata } from "next";
import Link from "next/link";
import { getEntries } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "宋小鹏 · 保持好奇，认真创造",
  description: "宋小鹏的个人空间。在产品、设计与工程之间，记录思考，打磨作品。",
};

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function MinimalHome() {
  const articles = getEntries("articles").slice(0, 3);
  return (
    <div className={styles.page} id="top">
      <a className="skip-link" href="#minimal-main">跳至正文</a>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a href="#top" className={styles.identity} aria-label="宋小鹏，回到顶部"><span className={styles.mark}>s.</span><span>宋小鹏</span></a>
          <nav aria-label="主导航"><a href="#selected-work">作品</a><a href="#writing">文字</a><a href="#about-me">关于</a><a href="https://github.com/songxiaopeng529" className={styles.github}>GitHub <Arrow /></a></nav>
        </header>
        <main id="minimal-main" tabIndex={-1}>
          <section className={styles.hero} aria-labelledby="intro-title">
            <div className={styles.eyebrow}><span />一个持续探索的创造者</div>
            <h1 id="intro-title">保持好奇，<br />认真<span className={styles.accent}>创造。</span></h1>
            <div className={styles.heroBottom}>
              <div><p>你好，我是宋小鹏。<br />在产品、设计与工程之间，<br className={styles.mobileBreak} />把想法慢慢变成有用的东西。</p><a className={styles.cta} href="#selected-work">看看我的作品 <span aria-hidden="true">↓</span></a></div>
              <div className={styles.marginNote} aria-hidden="true"><span className={styles.asterisk}>✳</span><p>LESS, BUT<br />WITH INTENTION.</p><span>少一点，也用心一点。</span></div>
            </div>
            <div className={styles.heroFoot}><span>代码 · 设计 · 日常思考</span><span>慢慢来，做值得做的事。</span></div>
          </section>
          <section className={styles.section} id="selected-work" aria-labelledby="work-title">
            <div className={styles.sectionLabel}><span>01 / SELECTED WORK</span><h2 id="work-title">认真做的小作品</h2></div>
            <a className={styles.project} href="https://github.com/songxiaopeng529/story-forge">
              <div className={styles.projectArt} aria-hidden="true"><span className={styles.artIndex}>SF — 01</span><span className={styles.forgeSymbol}>sf<span>.</span></span><span className={styles.artCaption}>A SPACE FOR IDEAS TO BECOME.</span><span className={styles.artArrow}>↗</span></div>
              <div className={styles.projectDetails}><div><span className={styles.category}>开发工具 / AGENT</span><h3>Story Forge <Arrow /></h3><p>一个桌面优先的编程 Agent 平台。<br />探索人与工具协作的新方式。</p></div><span className={styles.projectLink}>在 GitHub 查看 <Arrow /></span></div>
            </a>
          </section>
          <section className={styles.section} id="writing" aria-labelledby="writing-title">
            <div className={styles.sectionLabel}><span>02 / NOTES & THOUGHTS</span><h2 id="writing-title">把思考留在这里</h2><p>关于技术，也关于创造的过程。</p></div>
            <div className={styles.articles}>{articles.map(article => <Link href={`/articles/${article.slug}/`} className={styles.article} key={article.slug}>{article.date && <time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time>}<div><h3>{article.title}</h3><p>{article.description}</p></div><Arrow /></Link>)}</div>
          </section>
          <section className={`${styles.section} ${styles.about}`} id="about-me" aria-labelledby="about-title">
            <div className={styles.sectionLabel}><span>03 / A LITTLE ABOUT ME</span><h2 id="about-title">让好奇心，带路。</h2></div>
            <div className={styles.aboutCopy}><p>我喜欢写代码，也喜欢琢磨一个产品为什么好用。比起做很多东西，我更想把一个小东西做得清楚、顺手，能长久地用下去。</p><p>这里是我的一小块自留地，放作品、记思考，也给还没成形的想法留一点空间。</p><a href="https://github.com/songxiaopeng529">在 GitHub 找到我 <Arrow /></a></div>
          </section>
        </main>
        <footer className={styles.footer}><a href="#top" className={styles.footerName}>宋小鹏 <span>© {new Date().getFullYear()}</span></a><span>用心创造，缓慢生长。</span><a href="#top" aria-label="回到顶部">回到顶部 ↑</a></footer>
      </div>
    </div>
  );
}
