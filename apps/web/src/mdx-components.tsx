import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

import { Callout } from "@/components/content/callout";
import { Figure } from "@/components/content/figure";
import { Whiteboard } from "@/components/content/whiteboard";

function ScrollableCodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  return <pre aria-label="代码示例，可横向滚动" tabIndex={0} {...props} />;
}

function ScrollableTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div
      aria-label="数据表格，可横向滚动"
      className="table-scroll"
      role="region"
      tabIndex={0}
    >
      <table {...props} />
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = "", ...props }) => {
      const external =
        href.startsWith("http://") || href.startsWith("https://");
      return (
        <a
          href={href}
          rel={external ? "noreferrer" : undefined}
          target={external ? "_blank" : undefined}
          {...props}
        />
      );
    },
    pre: ScrollableCodeBlock,
    table: ScrollableTable,
    Callout,
    Figure,
    Whiteboard,
    ...components,
  };
}
