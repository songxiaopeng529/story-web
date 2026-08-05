import { absoluteUrl, siteConfig } from "@/config/site";
import { getArticles } from "@/lib/content";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const articles = getArticles();
  const latestDate = articles[0]?.updated ?? articles[0]?.date;
  const items = articles
    .map((article) => {
      const url = absoluteUrl(`/articles/${article.slug}`);
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${new Date(`${article.date}T00:00:00.000Z`).toUTCString()}</pubDate>
      ${article.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />
    ${latestDate ? `<lastBuildDate>${new Date(`${latestDate}T00:00:00.000Z`).toUTCString()}</lastBuildDate>` : ""}${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
