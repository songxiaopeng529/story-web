import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync, copyFileSync, rmSync, lstatSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function readEntry(file, slug, kind) {
  const { data, content } = matter(readFileSync(file, 'utf8'));
  if (data.published === false) return null;
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  const title = String(data.title || heading || path.basename(file).replace(/\.mdx?$/, ''));
  const body = heading === title ? content.replace(/^#\s+.+\r?\n/m, '').trim() : content.trim();
  const paragraph = body.split(/\n\s*\n/).find(t => t.trim() && !/^[#>|!`<\-]/.test(t.trim())) || '';
  return { slug, kind, title, description: String(data.description || paragraph.replace(/[*_`]/g, '').slice(0, 150)), date: data.date ? new Date(data.date).toISOString().slice(0,10) : '', tags: Array.isArray(data.tags) ? data.tags.map(String) : [], repository: typeof data.repository === 'string' && /^https?:\/\//.test(data.repository) ? data.repository : '', body };
}
export function readProjects() {
  const data = JSON.parse(readFileSync(path.join(root, 'content/projects.json'), 'utf8'));
  if (!Array.isArray(data)) throw new Error('projects.json 必须是数组');
  const slugs = new Set();
  const bilingual = value => value && ['en', 'zh'].every(lang => typeof value[lang] === 'string' && value[lang].trim());
  return data.map((project, index) => {
    const fail = message => { throw new Error(`projects.json 第 ${index + 1} 项：${message}`); };
    if (!project || typeof project !== 'object') fail('必须是项目对象');
    if (typeof project.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) || slugs.has(project.slug)) fail('slug 必须唯一且使用英文小写、数字或连字符');
    slugs.add(project.slug);
    if (typeof project.title !== 'string' || !project.title.trim()) fail('缺少 title');
    if (typeof project.repository !== 'string' || !/^https:\/\//.test(project.repository)) fail('repository 必须是 HTTPS 链接');
    if (!bilingual(project.description)) fail('description 需要 en 和 zh');
    if (!Array.isArray(project.tags) || !project.tags.every(tag => typeof tag === 'string')) fail('tags 必须是字符串数组');
    if (!project.cover || !['ember','paper'].includes(project.cover.theme) || !['kicker','headline','caption'].every(key => bilingual(project.cover[key])) || typeof project.cover.mark !== 'string') fail('cover 需要 theme、双语 kicker/headline/caption 和 mark');
    if (!Array.isArray(project.features) || !project.features.every(bilingual)) fail('features 必须是双语对象数组');
    if (project.published !== undefined && typeof project.published !== 'boolean') fail('published 必须是布尔值');
    return { slug: project.slug, kind: 'works', title: project.title, description: project.description.zh, date: '', tags: project.tags, repository: project.repository, body: project.features.map(item => '- ' + item.zh).join('\n'), project };
  }).filter(entry => entry.project.published !== false);
}
export function readSiteContent() {
  const articles = [];
  const directory = path.join(root, 'docs/articles');
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    if (item.name.startsWith('.') || item.isSymbolicLink()) continue;
    if (item.isFile() && /\.mdx?$/.test(item.name)) {
      const entry = readEntry(path.join(directory,item.name), item.name.replace(/\.mdx?$/, ''), 'articles');
      if(entry) articles.push(entry);
    } else if(item.isDirectory()) {
      const files = readdirSync(path.join(directory,item.name)).filter(n => /\.mdx?$/.test(n));
      if(files.length > 1) throw new Error(`每个文章目录应只有一个正文文件：${item.name}`);
      if(files.length) { const entry = readEntry(path.join(directory,item.name,files[0]),item.name,'articles'); if(entry) articles.push(entry); }
    }
  }
  const works = readProjects();
  articles.sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug));
  return { articles, works };
}
export function generateSiteContent() {
  const content = readSiteContent();
  const output = path.join(root,'apps/web/.generated'); mkdirSync(output,{recursive:true});
  const json = JSON.stringify(content,null,2)+'\n';
  const file = path.join(output,'content.json');
  if(!existsSync(file)||readFileSync(file,'utf8')!==json) writeFileSync(file,json);
  const assets = path.join(root,'apps/web/public/article-assets');
  rmSync(assets,{recursive:true,force:true});
  function copyImages(source,destination) {
    for(const item of readdirSync(source,{withFileTypes:true})) {
      if(item.isSymbolicLink()) continue;
      const from=path.join(source,item.name), to=path.join(destination,item.name);
      if(item.isDirectory()) copyImages(from,to);
      else if(/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(item.name)&&lstatSync(from).isFile()){mkdirSync(path.dirname(to),{recursive:true});copyFileSync(from,to);}
    }
  }
  for(const article of content.articles) {
    const source=path.join(root,'docs/articles',article.slug);
    if(existsSync(source)) copyImages(source,path.join(assets,article.slug));
  }
  return content;
}
