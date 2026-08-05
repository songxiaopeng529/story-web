import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={["site-container", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
