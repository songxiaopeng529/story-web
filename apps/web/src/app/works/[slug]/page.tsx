import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TableOfContents } from "@/components/content/table-of-contents";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getWork, getWorks, loadWork } from "@/lib/content";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getWorks().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const pathname = `/works/${work.slug}`;
  return {
    title: work.title,
    description: work.description,
    alternates: { canonical: pathname },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: pathname,
      title: work.title,
      description: work.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: work.title }],
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const document = await loadWork(slug);
  if (!document) notFound();

  const { metadata, Content } = document;
  const workJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: metadata.title,
    description: metadata.description,
    dateCreated: metadata.date,
    dateModified: metadata.updated ?? metadata.date,
    url: absoluteUrl(`/works/${metadata.slug}`),
    creator: {
      "@type": "Person",
      name: siteConfig.name,
      url: absoluteUrl(),
    },
    keywords: metadata.tags.join(", "),
  };

  return (
    <main data-page="works" id="main-content">
      <article>
        <header className="content-detail-header work-detail-header">
          <Container>
            <p className="meta-label">WORK / {metadata.year}</p>
            <h1>{metadata.title}</h1>
            <p className="content-detail-header__description">
              {metadata.description}
            </p>
            <dl className="work-facts">
              <div>
                <dt>角色</dt>
                <dd>{metadata.role}</dd>
              </div>
              <div>
                <dt>技术</dt>
                <dd>{metadata.stack.join(" / ")}</dd>
              </div>
              <div>
                <dt>状态</dt>
                <dd>{metadata.status ?? "持续迭代"}</dd>
              </div>
              <div>
                <dt>链接</dt>
                <dd className="work-facts__links">
                  {metadata.repository ? (
                    <a
                      href={metadata.repository}
                      rel="noreferrer"
                      target="_blank"
                    >
                      GitHub ↗
                    </a>
                  ) : null}
                  {metadata.demo ? (
                    <a href={metadata.demo} rel="noreferrer" target="_blank">
                      访问项目 ↗
                    </a>
                  ) : null}
                </dd>
              </div>
            </dl>
          </Container>
        </header>

        <Container className="content-detail-grid">
          <TableOfContents headings={metadata.headings} />
          <div className="prose">
            <Content />
          </div>
        </Container>

        <Container className="content-detail-footer">
          <TextLink href="/works">返回全部作品</TextLink>
        </Container>
      </article>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }}
        type="application/ld+json"
      />
    </main>
  );
}
