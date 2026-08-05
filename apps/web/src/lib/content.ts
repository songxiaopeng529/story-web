import "server-only";

import {
  articleLoaders,
  articles,
  workLoaders,
  works,
  type ArticleMeta,
  type ContentLoader,
  type WorkMeta,
} from "@/generated/content-manifest";

const articleLoaderMap: Record<string, ContentLoader> = articleLoaders;
const workLoaderMap: Record<string, ContentLoader> = workLoaders;

export function getArticles(): readonly ArticleMeta[] {
  return articles;
}

export function getWorks(): readonly WorkMeta[] {
  return works;
}

export function getArticle(slug: string): ArticleMeta | undefined {
  return articles.find((entry) => entry.slug === slug);
}

export function getWork(slug: string): WorkMeta | undefined {
  return works.find((entry) => entry.slug === slug);
}

export function getFeaturedArticles(limit = 2): readonly ArticleMeta[] {
  return articles.filter((entry) => entry.featured).slice(0, limit);
}

export function getFeaturedWorks(limit = 2): readonly WorkMeta[] {
  return works.filter((entry) => entry.featured).slice(0, limit);
}

export async function loadArticle(slug: string) {
  const metadata = getArticle(slug);
  const loader = articleLoaderMap[slug];
  if (!metadata || !loader) return undefined;

  const { default: Content } = await loader();
  return { metadata, Content };
}

export async function loadWork(slug: string) {
  const metadata = getWork(slug);
  const loader = workLoaderMap[slug];
  if (!metadata || !loader) return undefined;

  const { default: Content } = await loader();
  return { metadata, Content };
}
