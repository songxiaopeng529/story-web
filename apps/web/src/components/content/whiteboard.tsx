import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { InteractiveWhiteboard } from "./interactive-whiteboard";

type WhiteboardProps = {
  src: string;
  title: string;
};

type ExcalidrawTextElement = {
  type?: string;
  text?: string;
  isDeleted?: boolean;
};

function getBoardLabels(src: string) {
  try {
    const publicRoot = path.resolve(process.cwd(), "public");
    const sourcePath = path.resolve(publicRoot, `.${src}`);
    if (!sourcePath.startsWith(`${publicRoot}${path.sep}`)) return [];
    const scene = JSON.parse(readFileSync(sourcePath, "utf8")) as {
      elements?: ExcalidrawTextElement[];
    };
    return (scene.elements ?? [])
      .filter(
        (element) =>
          element.type === "text" && !element.isDeleted && element.text,
      )
      .map((element) => element.text?.replace(/\n/g, " · ") ?? "")
      .filter(Boolean)
      .slice(0, 3);
  } catch {
    return [];
  }
}

export function Whiteboard({ src, title }: WhiteboardProps) {
  const labels = getBoardLabels(src);

  return (
    <figure className="whiteboard">
      <div
        aria-label={`${title}静态预览`}
        className="whiteboard__preview"
        role="img"
      >
        <p className="whiteboard__corner">EXCALIDRAW / READ ONLY</p>
        <div className="whiteboard__flow">
          {(labels.length
            ? labels
            : ["Markdown / MDX", "Next.js Build", "Static Page"]
          ).map((label, index) => (
            <div className="whiteboard__step" key={`${label}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </div>
      <figcaption>
        <span>{title}</span>
        <span>源文件：{src.split("/").at(-1)}</span>
      </figcaption>
      <InteractiveWhiteboard src={src} title={title} />
    </figure>
  );
}
