import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articles, works } from '@/lib/content';
import { assetPath } from '@/lib/asset-path';
import { T, LanguageToggle, OriginalImageLink } from '@/components/language';
import styles from './reader.module.css';

const entries = [...articles, ...works];
type Params = { kind: string; slug: string };
export const dynamicParams = false;
export function generateStaticParams() { return entries.map(({ kind, slug }) => ({ kind, slug })); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { kind, slug } = await params;
  const entry = entries.find(e => e.kind === kind && e.slug === slug);
  return { title: entry ? `${entry.title} — Story` : 'Story', description: entry?.description };
}
export default async function Reader({ params }: { params: Promise<Params> }) {
  const { kind, slug } = await params;
  const entry = entries.find(e => e.kind === kind && e.slug === slug);
  if (!entry) notFound();
  const section = kind === 'articles' ? 'blog' : 'projects';
  function imageUrl(src: string) {
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith('/')) return assetPath(src);
    const resolved = new URL(src, `https://story.local/article-assets/${encodeURIComponent(slug)}/`);
    return assetPath(resolved.pathname);
  }
  return <div className={styles.reader}>
    <header className={styles.header}><Link href="/" className={styles.brand}>Story</Link><Link href={`/#story-${section}`}>← {kind === 'articles' ? <T en="Back to blog" zh="返回博客列表" /> : <T en="Back to projects" zh="返回作品集" />}</Link><LanguageToggle className={styles.languageButton} /></header>
    <main className={styles.main}>
      <div className={styles.meta}><span>{kind === 'articles' ? <T en="Blog" zh="博客" /> : <T en="Project" zh="作品" />}</span>{entry.date && <time dateTime={entry.date}>{entry.date.replaceAll('-', '.')}</time>}<span>{entry.tags.join(' / ')}</span></div>
      <h1>{entry.title}</h1><p className={styles.description}>{entry.project ? <T {...entry.project.description} /> : entry.description}</p>
      {entry.repository && <a className={styles.repository} href={entry.repository} target="_blank" rel="noreferrer"><T en="View on GitHub ↗" zh="在 GitHub 查看 ↗" /></a>}
      <article className={styles.body}>{entry.project ? <><h2><T en="About this project" zh="项目介绍" /></h2><ul>{entry.project.features.map((feature, index) => <li key={index}><T {...feature} /></li>)}</ul></> : <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
        img: ({ src, alt }) => typeof src === 'string' ? <OriginalImageLink href={imageUrl(src)} alt={alt}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Markdown images retain their original intrinsic proportions. */}
          <img src={imageUrl(src)} alt={alt || ''} loading="lazy" />
        </OriginalImageLink> : null,
        table: ({ children }) => <div className={styles.tableScroll} tabIndex={0}><table>{children}</table></div>,
        a: ({ href, children }) => <a href={href?.startsWith('/') ? assetPath(href) : href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noreferrer' : undefined}>{children}</a>,
      }}>{entry.body}</Markdown>}</article>
      <footer className={styles.bottom}><Link href={`/#story-${section}`}>← {kind === 'articles' ? <T en="Read more articles" zh="继续阅读其他文章" /> : <T en="More projects" zh="查看其他作品" />}</Link><span>Story ©2026</span></footer>
    </main>
  </div>;
}
