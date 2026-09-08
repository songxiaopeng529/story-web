import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const html = readFileSync("out/index.html", "utf8");
for (const text of ["把好奇，", "种进生活。", "正在生长的作品", "慢读", "拾起一些片刻", "探索银杏叶脉"]) assert.ok(html.includes(text), `Missing homepage content: ${text}`);
for (const asset of ["natural-leaf.webp", "natural-wash.webp", "natural-reading.webp"]) {
  assert.ok(html.includes(`${basePath}/images/${asset}`), `Asset has incorrect base path: ${asset}`);
  assert.ok(existsSync(`out/images/${asset}`));
}
for (const asset of ["liquid-glass.webp", "ink-gesture.webp", "github-avatar.jpg"]) assert.ok(!existsSync(`public/images/${asset}`), `Old production asset remains: ${asset}`);
for (const kind of ["articles", "works"]) {
  for (const file of readdirSync(`content/${kind}`).filter(file => /\.mdx?$/.test(file))) {
    const { data } = matter(readFileSync(`content/${kind}/${file}`, "utf8"));
    if (data.published !== true) continue;
    const slug = file.replace(/\.mdx?$/, "");
    const entry = readFileSync(`out/${kind}/${slug}/index.html`, "utf8");
    assert.ok(entry.includes(data.title), `Entry title missing: ${slug}`);
    assert.ok(!entry.includes("&lt;Callout"), `Unrendered MDX callout: ${slug}`);
  }
}
const pages = readdirSync("out", { recursive: true }).filter(file => file.endsWith(".html"));
let checked = 0;
for (const page of pages) {
  const source = readFileSync(path.join("out", page), "utf8");
  for (const match of source.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
    const reference = match[1];
    assert.ok(reference.startsWith(`${basePath}/`), `Missing base path in ${page}: ${reference}`);
    let target = path.join("out", reference.slice(basePath.length));
    if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, "index.html");
    assert.ok(existsSync(target), `Missing exported target in ${page}: ${target}`);
    checked++;
  }
}
console.log(`Verified natural archive, ${pages.length} pages and ${checked} local references (basePath: ${basePath || "/"}).`);
