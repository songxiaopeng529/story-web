import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type TextLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  external?: boolean;
};

export function TextLink({
  children,
  className,
  external,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={["text-link", className].filter(Boolean).join(" ")}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      {...props}
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
