import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/content/callout";
import { Figure } from "@/components/content/figure";
import { Whiteboard } from "@/components/content/whiteboard";

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
    Callout,
    Figure,
    Whiteboard,
    ...components,
  };
}
