import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { format } from "prettier";
import { z } from "zod";

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const contentRoot = path.join(appRoot, "content");
const outputPath = path.join(appRoot, "src/generated/content-manifest.ts");
const isCheck = process.argv.includes("--check");

const dateField = z
  .union([z.string(), z.date()])
  .transform((value) => {
    const date =
      value instanceof Date ? value : new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(date.valueOf())
      ? "invalid"
      : date.toISOString().slice(0, 10);
  })
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), "must be YYYY-MM-DD");

const baseFields = {
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).max(240),
  date: dateField,
  updated: dateField.optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  published: z.boolean(),
  featured: z.boolean().default(false),
  cover: z.string().startsWith("/").optional(),
};

const articleSchema = z
  .object({
    ...baseFields,
    kind: z.literal("article"),
  })
  .strict();

const workSchema = z
  .object({
    ...baseFields,
    kind: z.literal("work"),
    role: z.string().trim().min(1),
    stack: z.array(z.string().trim().min(1)).default([]),
    repository: z.url().optional(),
    demo: z.url().optional(),
    year: z.union([z.string(), z.number()]).transform(String),
    status: z.string().trim().min(1).optional(),
  })
  .strict();

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const contentExtensions = new Set([".md", ".mdx"]);

function stripInlineMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!??\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[~*_]/g, "")
    .trim();
}

function getHeadings(body) {
  const slugger = new GithubSlugger();
  const headings = [];
  let fence = null;

  for (const line of body.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      fence = fence ? null : fenceMatch[1][0];
      continue;
    }
    if (fence) continue;

    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;
    headings.push({ id: slugger.slug(text), text, level: match[1].length });
  }

  return headings;
}

function estimateReadingMinutes(body) {
  const plain = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, " ");
  const cjkCount = (plain.match(/[\u3400-\u9fff]/g) ?? []).length;
  const wordCount = (
    plain.replace(/[\u3400-\u9fff]/g, " ").match(/[\p{L}\p{N}]+/gu) ?? []
  ).length;
  return Math.max(1, Math.ceil(cjkCount / 350 + wordCount / 220));
}

function getInternalLinks(body) {
  const links = new Set();
  for (const match of body.matchAll(
    /(?<!!)\[[^\]]*\]\((\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
  )) {
    links.add(match[1]);
  }
  for (const match of body.matchAll(/\bhref=["'](\/[^"']+)["']/g)) {
    links.add(match[1]);
  }
  return [...links];
}

async function assertPublicAsset(assetPath, sourceFile) {
  const resolved = path.join(appRoot, "public", assetPath.slice(1));
  try {
    const result = await stat(resolved);
    if (!result.isFile()) throw new Error();
  } catch {
    throw new Error(`${sourceFile}: missing public asset ${assetPath}`);
  }
}

async function collect(kind) {
  const directory = path.join(
    contentRoot,
    kind === "article" ? "articles" : "works",
  );
  const schema = kind === "article" ? articleSchema : workSchema;
  const files = (await readdir(directory)).filter((file) =>
    contentExtensions.has(path.extname(file)),
  );
  const seen = new Set();
  const entries = [];

  for (const file of files.sort()) {
    const extension = path.extname(file);
    const slug = path.basename(file, extension);
    if (!slugPattern.test(slug)) {
      throw new Error(`${file}: slug must use lowercase ASCII kebab-case`);
    }
    if (seen.has(slug)) throw new Error(`${file}: duplicate slug ${slug}`);
    seen.add(slug);

    const sourcePath = path.join(directory, file);
    const raw = await readFile(sourcePath, "utf8");
    const parsed = matter(raw);
    const result = schema.safeParse(parsed.data);
    if (!result.success) {
      throw new Error(`${file}: ${z.prettifyError(result.error)}`);
    }
    if (result.data.kind !== kind) {
      throw new Error(`${file}: kind must be ${kind}`);
    }

    if (result.data.cover) await assertPublicAsset(result.data.cover, file);
    for (const match of parsed.content.matchAll(
      /<Whiteboard[\s\S]*?\bsrc=["']([^"']+)["']/g,
    )) {
      if (!match[1].startsWith("/")) {
        throw new Error(
          `${file}: Whiteboard src must be an absolute public path`,
        );
      }
      await assertPublicAsset(match[1], file);
    }

    if (!result.data.published) continue;
    const metadata = Object.fromEntries(
      Object.entries(result.data).filter(([key]) => key !== "published"),
    );
    entries.push({
      ...metadata,
      slug,
      readingMinutes: estimateReadingMinutes(parsed.content),
      headings: getHeadings(parsed.content),
      internalLinks: getInternalLinks(parsed.content),
      source: `${kind === "article" ? "articles" : "works"}/${file}`,
    });
  }

  return entries.sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
}

function serialize(value) {
  return JSON.stringify(value, null, 2);
}

function loaders(entries) {
  return entries
    .map(
      (entry) =>
        `  ${JSON.stringify(entry.slug)}: () => import(${JSON.stringify(`../../content/${entry.source}`)}),`,
    )
    .join("\n");
}

function createOutput(articles, works) {
  const articleData = articles.map((entry) =>
    Object.fromEntries(
      Object.entries(entry).filter(
        ([key]) => key !== "source" && key !== "internalLinks",
      ),
    ),
  );
  const workData = works.map((entry) =>
    Object.fromEntries(
      Object.entries(entry).filter(
        ([key]) => key !== "source" && key !== "internalLinks",
      ),
    ),
  );

  return `// This file is generated by scripts/generate-content-index.mjs. Do not edit manually.
import "server-only";

import type { ComponentType } from "react";

export type ContentHeading = {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
};

type BaseContentMeta = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly updated?: string;
  readonly tags: readonly string[];
  readonly featured: boolean;
  readonly cover?: string;
  readonly readingMinutes: number;
  readonly headings: readonly ContentHeading[];
};

export type ArticleMeta = BaseContentMeta & {
  readonly kind: "article";
};

export type WorkMeta = BaseContentMeta & {
  readonly kind: "work";
  readonly role: string;
  readonly stack: readonly string[];
  readonly repository?: string;
  readonly demo?: string;
  readonly year: string;
  readonly status?: string;
};

export type ContentModule = { default: ComponentType };
export type ContentLoader = () => Promise<ContentModule>;

export const articles = ${serialize(articleData)} as const satisfies readonly ArticleMeta[];

export const works = ${serialize(workData)} as const satisfies readonly WorkMeta[];

export const articleLoaders = {
${loaders(articles)}
} satisfies Record<string, ContentLoader>;

export const workLoaders = {
${loaders(works)}
} satisfies Record<string, ContentLoader>;
`;
}

async function validateInternalLinks(articles, works) {
  const entries = [...articles, ...works];
  const routes = new Set([
    "/",
    "/articles",
    "/works",
    ...articles.map((entry) => `/articles/${entry.slug}`),
    ...works.map((entry) => `/works/${entry.slug}`),
  ]);

  for (const entry of entries) {
    for (const link of entry.internalLinks) {
      const pathname =
        new URL(link, "https://story-web.local").pathname.replace(/\/$/, "") ||
        "/";
      if (routes.has(pathname)) continue;
      if (path.extname(pathname)) {
        await assertPublicAsset(pathname, entry.source);
        continue;
      }
      throw new Error(`${entry.source}: broken internal link ${link}`);
    }
  }
}

const [articles, works] = await Promise.all([
  collect("article"),
  collect("work"),
]);
await validateInternalLinks(articles, works);
const output = await format(createOutput(articles, works), {
  parser: "typescript",
});

if (isCheck) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== output) {
    console.error(
      "Content manifest is stale. Run: pnpm --filter @story-web/web content:generate",
    );
    process.exitCode = 1;
  }
} else {
  await writeFile(outputPath, output);
  console.log(
    `Generated ${path.relative(appRoot, outputPath)} (${articles.length} articles, ${works.length} works)`,
  );
}
