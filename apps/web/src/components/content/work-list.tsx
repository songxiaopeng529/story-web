import Link from "next/link";

import type { WorkMeta } from "@/generated/content-manifest";

type WorkListProps = {
  compact?: boolean;
  works: readonly WorkMeta[];
};

export function WorkList({ compact = false, works }: WorkListProps) {
  return (
    <ol
      className="content-index work-index"
      data-compact={compact || undefined}
    >
      {works.map((work) => (
        <li key={work.slug}>
          <Link
            className="content-index__row work-row"
            href={`/works/${work.slug}`}
          >
            <span className="content-index__year">{work.year}</span>
            <span className="content-index__main">
              <strong>{work.title}</strong>
              <span>{work.role}</span>
            </span>
            <span className="content-index__tags">
              {work.stack.slice(0, 3).join(" / ")}
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
