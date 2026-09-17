import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const output = "apps/web/out";
const html = readFileSync(`${output}/index.html`, "utf8");
for (const text of ["STORY", "Home", "Blog", "Project", "Notes &amp;", "Made with"]) assert.ok(html.includes(text), `Missing Story content: ${text}`);
for (const route of ["lumenix", "minimal", "river-prototype"]) assert.ok(!existsSync(`${output}/${route}`), `Retired route remains: ${route}`);
for (const asset of ["images/story/model-poster.jpg", "videos/story/model-turn.mp4"]) {
  assert.ok(existsSync(`${output}/${asset}`), `Missing asset: ${asset}`);
  assert.ok(html.includes(`${basePath}/${asset}`), `Incorrect asset URL: ${asset}`);
}
const { readSiteContent } = await import('./site-content.mjs');
const content = readSiteContent();
for(const entry of [...content.articles, ...content.works]) {
  const route = `${basePath}/${entry.kind}/${entry.slug}/`;
  assert.ok(html.includes(`href="${route}"`), `Missing homepage link: ${route}`);
  const detail = readFileSync(`${output}/${entry.kind}/${entry.slug}/index.html`, 'utf8');
  const escapedTitle = entry.title.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;',
  })[character]);
  assert.ok(detail.includes(`<h1>${escapedTitle}</h1>`), `Missing article title: ${entry.slug}`);
  const imageCount = [...entry.body.matchAll(/!\[[^\]]*\]\([^\n]+\)/g)].length;
  assert.ok((detail.match(/<img\b/g) || []).length >= imageCount, `Missing article images: ${entry.slug}`);
}
const pages = readdirSync(output, { recursive: true }).filter(file => file.endsWith(".html"));
let checked = 0;
for (const page of pages) {
  const source = readFileSync(path.join(output, page), "utf8");
  for (const match of source.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
    const reference = match[1];
    assert.ok(reference.startsWith(`${basePath}/`), `Missing base path in ${page}: ${reference}`);
    let target = path.join(output, decodeURIComponent(reference.slice(basePath.length)));
    if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, "index.html");
    assert.ok(existsSync(target), `Missing exported target in ${page}: ${target}`);
    checked++;
  }
}
console.log(`Verified Story, ${pages.length} pages and ${checked} local references (basePath: ${basePath || "/"}).`);
