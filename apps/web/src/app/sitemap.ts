import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { getArticles, getWorks } from "@/lib/content";

function isoDate(value: string) {
  return `${value}T00:00:00.000Z`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const works = getWorks();
  const latestDate = [...articles, ...works]
    .map((entry) => entry.updated ?? entry.date)
    .sort((a, b) => b.localeCompare(a))[0];

  return [
    {
      url: absoluteUrl(),
      lastModified: latestDate ? isoDate(latestDate) : undefined,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/articles"),
      lastModified: articles[0]
        ? isoDate(articles[0].updated ?? articles[0].date)
        : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: isoDate(article.updated ?? article.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: absoluteUrl("/works"),
      lastModified: works[0]
        ? isoDate(works[0].updated ?? works[0].date)
        : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...works.map((work) => ({
      url: absoluteUrl(`/works/${work.slug}`),
      lastModified: isoDate(work.updated ?? work.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
