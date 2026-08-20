"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import type {
  BinaryFileData,
  BinaryFiles,
  DataURL,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import { useEffect, useState } from "react";

import "@excalidraw/excalidraw/index.css";

type ExternalFile = {
  created: number;
  mimeType: BinaryFileData["mimeType"];
  src: string;
};

type ExternalFileScene = ExcalidrawInitialDataState & {
  externalFiles?: Record<string, ExternalFile>;
};

type ExcalidrawCanvasProps = {
  src: string;
  title: string;
};

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<DataURL>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", () => reject(reader.error));
    reader.addEventListener("load", () => resolve(reader.result as DataURL));
    reader.readAsDataURL(blob);
  });
}

async function loadScene(src: string, signal: AbortSignal) {
  const response = await fetch(src, { signal });
  if (!response.ok) throw new Error(`Unable to load ${src}`);

  const scene = (await response.json()) as ExternalFileScene;
  const externalFiles = Object.entries(scene.externalFiles ?? {});
  if (!externalFiles.length) return scene;

  const files = await Promise.all(
    externalFiles.map(async ([id, file]) => {
      const imageResponse = await fetch(file.src, { signal });
      if (!imageResponse.ok) throw new Error(`Unable to load ${file.src}`);

      return [
        id,
        {
          id: id as BinaryFileData["id"],
          mimeType: file.mimeType,
          dataURL: await readBlobAsDataUrl(await imageResponse.blob()),
          created: file.created,
        },
      ] as const;
    }),
  );

  return {
    ...scene,
    files: {
      ...scene.files,
      ...Object.fromEntries(files),
    } as BinaryFiles,
  };
}

export function ExcalidrawCanvas({ src, title }: ExcalidrawCanvasProps) {
  const [scene, setScene] = useState<ExcalidrawInitialDataState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    loadScene(src, controller.signal)
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
