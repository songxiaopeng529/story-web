import type { ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  type?: "note" | "tip" | "warning";
};

const labels = {
  note: "说明",
  tip: "提示",
  warning: "注意",
} as const;

export function Callout({ children, title, type = "note" }: CalloutProps) {
  return (
    <aside className="callout" data-type={type}>
      <p className="callout__label">{title ?? labels[type]}</p>
      <div className="callout__content">{children}</div>
    </aside>
  );
}
