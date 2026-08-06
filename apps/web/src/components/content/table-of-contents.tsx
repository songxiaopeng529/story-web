import type { ContentHeading } from "@/generated/content-manifest";

type TableOfContentsProps = {
  headings: readonly ContentHeading[];
};

function Contents({ headings }: TableOfContentsProps) {
  return (
    <ol>
      {headings.map((heading) => (
        <li data-level={heading.level} key={heading.id}>
          <a href={`#${heading.id}`}>{heading.text}</a>
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length < 3) return null;

  return (
    <>
      <details className="toc toc--mobile">
        <summary>本页目录</summary>
        <Contents headings={headings} />
      </details>
      <nav aria-label="本页目录" className="toc toc--desktop">
        <p>本页目录</p>
        <Contents headings={headings} />
      </nav>
    </>
  );
}
