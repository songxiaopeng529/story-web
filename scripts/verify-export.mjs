import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readArticles } from "./article-source.mjs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const html = readFileSync("out/index.html", "utf8");
const prototype = readFileSync("out/river-prototype/index.html", "utf8");
for (const text of ["河流生长实验", "文章数量", "作品数量", "12", "painted-creek", "unified-landscape.webp"]) assert.ok(prototype.includes(text), `Missing prototype content: ${text}`);
assert.ok(prototype.includes("noindex"), "Prototype should not be indexed");
for (const text of ["带着好奇，", "去做一点有趣的事。", "最近文章", "认真做的小作品", "Story Forge", "项目结构示意"]) assert.ok(html.includes(text), `Missing homepage content: ${text}`);
assert.ok(html.indexOf('id="articles"') < html.indexOf('id="works"'), "Articles must precede works");
assert.equal((html.match(/class="forge-layout"/g) || []).length, 1, "Expected one featured project");
assert.ok(html.includes('href="https://github.com/songxiaopeng529/story-forge"'));
for (const asset of ["paper/cat-boat.webp", "paper/journal-desk.webp", "paper/journal-seaside.webp"]) {
  assert.ok(html.includes(`${basePath}/images/${asset}`), `Asset has incorrect base path: ${asset}`);
  assert.ok(existsSync(`out/images/${asset}`));
}
for (const asset of ["natural-leaf.webp", "natural-wash.webp", "natural-reading.webp"]) assert.ok(!existsSync(`public/images/${asset}`), `Old production asset remains: ${asset}`);
for (const article of readArticles()) {
  const route = `${basePath}/articles/${article.slug}/`;
  assert.ok(html.includes(`href="${route}"`), `Homepage missing article: ${article.slug}`);
  assert.ok(prototype.includes(`href="${route}"`), `River missing article: ${article.slug}`);
  const entry = readFileSync(`out/articles/${article.slug}/index.html`, "utf8");
  assert.ok(entry.includes(article.title), `Article title missing: ${article.slug}`);
  for (const asset of article.assets) {
    const source = readFileSync(path.join('docs/articles',article.slug,asset));
    const exported = readFileSync(path.join('out/_article-assets',article.slug,asset));
    assert.ok(source.equals(exported), `Article asset differs: ${asset}`);
  }
  assert.ok(!entry.includes('src="images/'), 'Unresolved relative article image');
  const imageCount = [...article.body.matchAll(/!\[[^\]]*\]\([^\n]+\)/g)].length;
  assert.ok((entry.match(/<img\b/g) || []).length >= imageCount, `Missing rendered article images: ${article.slug}`);
}
for (const kind of ["works"]) {
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
    let target = path.join("out", decodeURIComponent(reference.slice(basePath.length)));
    if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, "index.html");
    assert.ok(existsSync(target), `Missing exported target in ${page}: ${target}`);
    checked++;
  }
}
console.log(`Verified paper adventure, ${pages.length} pages and ${checked} local references (basePath: ${basePath || "/"}).`);
