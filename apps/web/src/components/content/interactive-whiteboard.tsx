"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ExcalidrawCanvas = dynamic(
  () => import("./excalidraw-canvas").then((module) => module.ExcalidrawCanvas),
  {
    ssr: false,
    loading: () => <p className="board-status">正在准备交互画板…</p>,
  },
);

type InteractiveWhiteboardProps = {
  src: string;
  title: string;
};

export function InteractiveWhiteboard({
  src,
  title,
}: InteractiveWhiteboardProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        className="board-button"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span>交互查看画板</span>
        <span aria-hidden="true">↗</span>
      </button>
    );
  }

  return (
    <div className="board-interactive">
      <div className="board-interactive__bar">
        <p>只读模式 · 可缩放与平移</p>
        <button onClick={() => setOpen(false)} type="button">
          关闭
        </button>
      </div>
      <ExcalidrawCanvas src={src} title={title} />
    </div>
  );
}
