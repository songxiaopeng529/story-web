import type { ReactNode } from "react";

type SectionHeadingProps = {
  index: string;
  title: string;
  label?: string;
  action?: ReactNode;
};

export function SectionHeading({
  index,
  title,
  label,
  action,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="meta-label">
          {index} / {label ?? title.toUpperCase()}
        </p>
        <h2>{title}</h2>
      </div>
      {action ? <div className="section-heading__action">{action}</div> : null}
    </div>
  );
}
