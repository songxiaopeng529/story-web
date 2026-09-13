import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/components/layout/site-header";
import { getEntries, type ContentKind } from "@/lib/content";
import { assetPath } from "@/lib/asset-path";
import { articleUrl } from "@/lib/article-url";

type Params = { kind: string; slug: string };
const kinds: ContentKind[] = ["articles", "works"];
export const dynamicParams = false;
export function generateStaticParams() { return kinds.flatMap(kind => getEntries(kind).map(({ slug }) => ({ kind, slug }))); }

function findEntry({ kind, slug }: Params) {
  if (kind !== "articles" && kind !== "works") notFound();
  const entry = getEntries(kind).find(entry => entry.slug === slug);
  if (!entry) notFound();
  return entry;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const entry = findEntry(await params);
  return { title: `${entry.title} · 宋小鹏`, description: entry.description };
}

export default async function EntryPage({ params }: { params: Promise<Params> }) {
  const entry = findEntry(await params);
  // Preserve existing Callout prose without evaluating arbitrary MDX JavaScript.
  const markdown = entry.body.replace(/<Callout\b[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/Callout>/g, (_, title: string, body: string) => `\n> **${title}**\n>\n${body.trim().split("\n").map(line => `> ${line}`).join("\n")}\n`);
  return <>
    <a href="#entry" className="skip-link">跳至正文</a>
    <SiteHeader landing={false} current={entry.kind} />
    <main id="entry" className="entry-shell" tabIndex={-1}>
      <Link className="entry-back" href={`/#${entry.kind}`}>← 回到{entry.kind === "articles" ? "最近文章" : "作品"}</Link>
      <header className="entry-header"><h1>{entry.title}</h1><p>{entry.description}</p><div className="entry-meta">{entry.date && <time dateTime={entry.date}>{entry.date.replaceAll("-", ".")}</time>}{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div></header>
      <div className="entry-body"><Markdown remarkPlugins={[remarkGfm]} urlTransform={(url, key) => {
        const safeUrl = defaultUrlTransform(url);
        if (key !== "src") return safeUrl;
        const resolved = entry.kind === "articles" ? articleUrl(safeUrl, entry.slug, entry.assets || []) : safeUrl;
        if (safeUrl && !resolved) throw new Error(`文章 ${entry.slug} 的图片不存在或路径不受支持：${safeUrl}`);
        return resolved.startsWith("/") && !resolved.startsWith("//") ? assetPath(resolved) : resolved;
      }} components={{
        a: ({ href, children }) => <a href={href?.startsWith("/") ? assetPath(href) : href}>{children}</a>,
        table: ({ children }) => <div className="table-scroll"><table>{children}</table></div>,
      }}>{markdown}</Markdown></div>
      {entry.repository && <a href={entry.repository} className="text-link">查看 GitHub 仓库 <span aria-hidden="true">↗</span></a>}
    </main>
    <footer className="site-footer">持续生长，不必着急。</footer>
  </>;
}
