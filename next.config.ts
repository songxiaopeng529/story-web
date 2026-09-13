import type { NextConfig } from "next";
import { watch } from "node:fs";
import { generateArticles } from "./scripts/article-source.mjs";

generateArticles();
// Generated JSON is imported by server components; updates trigger Next's HMR.
if (process.env.NODE_ENV === "development") {
  const state = globalThis as typeof globalThis & { articleWatcher?: ReturnType<typeof watch> };
  if (!state.articleWatcher) {
    let timer: ReturnType<typeof setTimeout>;
    state.articleWatcher = watch("docs/articles", { recursive:true, persistent:false }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try { generateArticles(); } catch (error) { console.error("Article sync failed:", error); }
      }, 150);
    });
  }
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
