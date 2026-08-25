import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TableOfContents } from "@/components/content/table-of-contents";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getArticle, getArticles, loadArticle } from "@/lib/content";
import { formatDate } from "@/lib/format";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const pathname = `/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: pathname },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: pathname,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      tags: [...article.tags],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const document = await loadArticle(slug);
  if (!document) notFound();

  const { metadata, Content } = document;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: metadata.title,
    description: metadata.description,
    datePublished: metadata.date,
    dateModified: metadata.updated ?? metadata.date,
    inLanguage: siteConfig.language,
    mainEntityOfPage: absoluteUrl(`/articles/${metadata.slug}`),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: absoluteUrl(),
    },
  };

  return (
    <main data-page="articles" id="main-content">
      <article>
        <header className="content-detail-header">
          <Container>
            <p className="meta-label">ARTICLE / {formatDate(metadata.date)}</p>
            <h1>{metadata.title}</h1>
            <p className="content-detail-header__description">
              {metadata.description}
            </p>
            <div className="content-detail-header__meta">
              <span>{metadata.readingMinutes} 分钟阅读</span>
              <span>{metadata.tags.join(" / ")}</span>
              {metadata.updated ? (
                <span>更新于 {formatDate(metadata.updated)}</span>
              ) : null}
            </div>
          </Container>
        </header>

        <Container className="content-detail-grid">
          <TableOfContents headings={metadata.headings} />
          <div className="prose">
            <Content />
          </div>
        </Container>

        <Container className="content-detail-footer">
          <TextLink href="/articles">返回全部文章</TextLink>
        </Container>
      </article>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        type="application/ld+json"
      />
    </main>
  );
}
