/** Keep Markdown source URLs relative; resolve them only when rendering. */
export function articleUrl(url: string, slug: string, assets: string[]) {
  if (!url || /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)) return url;
  const split = url.search(/[?#]/);
  const pathname = split < 0 ? url : url.slice(0, split);
  const suffix = split < 0 ? "" : url.slice(split);
  let decoded: string;
  try { decoded = decodeURIComponent(pathname); } catch { return ""; }
  const parts: string[] = [];
  for (const part of decoded.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") { if (!parts.length) return ""; parts.pop(); }
    else parts.push(part);
  }
  const local = parts.join("/");
  if (!assets.includes(local)) return "";
  return `/_article-assets/${encodeURIComponent(slug)}/${parts.map(encodeURIComponent).join("/")}${suffix}`;
}
