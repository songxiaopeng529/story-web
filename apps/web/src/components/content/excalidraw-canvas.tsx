"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import { useEffect, useState } from "react";

import "@excalidraw/excalidraw/index.css";

type ExcalidrawCanvasProps = {
  src: string;
  title: string;
};

export function ExcalidrawCanvas({ src, title }: ExcalidrawCanvasProps) {
  const [scene, setScene] = useState<ExcalidrawInitialDataState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${src}`);
        return response.json() as Promise<ExcalidrawInitialDataState>;
      })
      .then(setScene)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError")
          return;
        setError(true);
      });

    return () => controller.abort();
  }, [src]);

  if (error) {
    return <p className="board-status">画板暂时无法加载，请稍后重试。</p>;
  }

  if (!scene) {
    return <p className="board-status">正在加载交互画板…</p>;
  }

  return (
    <div
      aria-label={`${title}交互画板`}
      className="excalidraw-frame"
      role="region"
    >
      <Excalidraw initialData={scene} viewModeEnabled zenModeEnabled />
    </div>
  );
}
