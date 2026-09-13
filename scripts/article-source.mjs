import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync, copyFileSync, unlinkSync, lstatSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const imageExtensions = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

/** One direct child directory = one article. No source content is modified. */
export function readArticles(root = process.cwd()) {
  const directory = path.join(root, 'docs/articles');
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes:true }).filter(item => item.isDirectory() && !item.name.startsWith('.')).flatMap(item => {
    const folder = path.join(directory, item.name);
    const files = readdirSync(folder).filter(name => /\.mdx?$/i.test(name));
    if (!files.length) return [];
    if (files.length !== 1) throw new Error(`一篇文章只能有一个 Markdown 文件：${folder}`);
    const file = path.join(folder, files[0]);
    if (lstatSync(file).isSymbolicLink()) throw new Error(`不支持文章符号链接：${file}`);
    const { data, content } = matter(readFileSync(file, 'utf8'));
    if (data.published === false) return [];
    const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const title = typeof data.title === 'string' && data.title.trim() ? data.title : heading || files[0].replace(/\.mdx?$/i, '');
    const body = heading === title ? content.replace(/^#\s+.+\r?\n/m, '').trim() : content.trim();
    const paragraph = body.split(/\n\s*\n/).find(text => text.trim() && !/^[#>|!`<\-]/.test(text.trim())) || '';
    const description = typeof data.description === 'string' ? data.description : paragraph.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').slice(0, 140);
    const date = data.date instanceof Date ? data.date.toISOString().slice(0,10) : data.date ?? '';
    if (typeof date !== 'string' || (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))) throw new Error(`日期格式应为 YYYY-MM-DD：${file}`);
    const assets = [];
    const walk = (dir) => {
      for (const child of readdirSync(dir, { withFileTypes:true })) {
        if (child.name.startsWith('.') || child.isSymbolicLink()) continue;
        const full = path.join(dir,child.name);
        if (child.isDirectory()) walk(full);
        else if (imageExtensions.test(child.name)) assets.push(path.relative(folder,full).split(path.sep).join('/'));
      }
    };
    walk(folder);
    return [{ slug:item.name, kind:'articles', title, description, date, tags:Array.isArray(data.tags)?data.tags.filter(tag=>typeof tag==='string'):[], body, assets }];
  }).sort((a,b)=>b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

function writeIfChanged(file, data) {
  if (existsSync(file) && readFileSync(file,'utf8') === data) return;
  mkdirSync(path.dirname(file), { recursive:true });
  writeFileSync(file,data);
}

export function generateArticles(root = process.cwd()) {
  const articles = readArticles(root);
  const destination = path.join(root,'public/_article-assets');
  const expected = new Set();
  for (const article of articles) {
    for (const asset of article.assets) {
      const source = path.join(root,'docs/articles',article.slug,asset);
      const target = path.join(destination,article.slug,asset);
      expected.add(target);
      mkdirSync(path.dirname(target), { recursive:true });
      if (!existsSync(target) || !readFileSync(source).equals(readFileSync(target))) copyFileSync(source,target);
    }
  }
  // Only prune files inside this dedicated, ignored build-output directory.
  const prune = dir => {
    if (!existsSync(dir)) return;
    for (const item of readdirSync(dir,{withFileTypes:true})) {
      const full = path.join(dir,item.name);
      if (item.isDirectory()) prune(full);
      else if (!expected.has(full)) unlinkSync(full);
    }
  };
  prune(destination);
  writeIfChanged(path.join(root,'.generated/articles.json'),JSON.stringify(articles,null,2)+'\n');
  return articles;
}
