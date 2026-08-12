import Link from "next/link";

import type { ArticleMeta } from "@/generated/content-manifest";
import { formatCompactDate } from "@/lib/format";

type ArticleListProps = {
  articles: readonly ArticleMeta[];
  compact?: boolean;
};

export function ArticleList({ articles, compact = false }: ArticleListProps) {
  return (
    <ol className="content-index" data-compact={compact || undefined}>
      {articles.map((article) => (
        <li key={article.slug}>
          <Link
            className="content-index__row article-row"
            href={`/articles/${article.slug}`}
          >
            <time dateTime={article.date}>
              {formatCompactDate(article.date)}
            </time>
            <span className="content-index__main">
              <strong>{article.title}</strong>
              <span>{article.description}</span>
            </span>
            <span className="content-index__tags">
              {article.tags.slice(0, 2).join(" / ")}
            </span>
            <span aria-hidden="true" className="content-index__arrow">
              ↗
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
