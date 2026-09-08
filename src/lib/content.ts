import "server-only";
import { cache } from "react";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ContentKind = "articles" | "works";
export type ContentEntry = {
  slug: string; kind: ContentKind; title: string; description: string; date: string;
  tags: string[]; body: string; repository?: string;
};
export const getEntries = cache((kind: ContentKind): ContentEntry[] => {
  const directory = path.join(process.cwd(), "content", kind);
  return readdirSync(directory).filter(file => /\.mdx?$/.test(file)).flatMap(file => {
    const { data, content } = matter(readFileSync(path.join(directory, file), "utf8"));
    if (data.published !== true) return [];
    for (const field of ["title", "description", "date"]) {
      if (typeof data[field] !== "string" || !data[field]) throw new Error(`Invalid ${field}: ${file}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`Invalid date: ${file}`);
    return [{ slug: file.replace(/\.mdx?$/, ""), kind, title: data.title, description: data.description, date: data.date,
      tags: Array.isArray(data.tags) ? data.tags.filter((tag: unknown): tag is string => typeof tag === "string") : [],
      body: content, repository: typeof data.repository === "string" && data.repository.startsWith("https://github.com/") ? data.repository : undefined,
    }];
  }).sort((a, b) => b.date.localeCompare(a.date));
});
