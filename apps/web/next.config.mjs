import { watch } from "node:fs";
import path from "node:path";
import { generateSiteContent, root } from "../../scripts/site-content.mjs";
generateSiteContent();
if (process.env.NODE_ENV === "development") {
  const state = globalThis;
  if (!state.storyContentWatchers) {
    let timer;
    state.storyContentWatchers = ["docs/articles", "content"].map(directory => watch(path.join(root, directory), { recursive: true, persistent: false }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => { try { generateSiteContent(); } catch (error) { console.error(error); } }, 150);
    }));
  }
}
/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
  devIndicators: false,
};
export default nextConfig;
