import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readArticles, generateArticles } from './article-source.mjs';

test('one folder per article: optional metadata, assets, updates, removal and drafts', () => {
  const root=mkdtempSync(path.join(os.tmpdir(),'story-articles-'));
  const add=(slug,body)=>{const dir=path.join(root,'docs/articles',slug);mkdirSync(dir,{recursive:true});writeFileSync(path.join(dir,'正文.md'),body);return dir;};
  try {
    const dir=add('hdfs','# HDFS 入门\n\n一篇无需 frontmatter 的原文。\n\n![示意图](images/图 一.png)');
    mkdirSync(path.join(dir,'images'));writeFileSync(path.join(dir,'images/图 一.png'),'test-image');
    add('es','---\ntitle: ES\ndate: "2026-09-10"\n---\n# ES\n\n摘要。');
    add('draft','---\npublished: false\n---\n# 草稿');
    let articles=generateArticles(root);
    assert.equal(articles.length,2);assert.equal(articles[0].slug,'es');
    const hdfs=articles.find(article=>article.slug==='hdfs');
    assert.equal(hdfs.title,'HDFS 入门');assert.equal(hdfs.description,'一篇无需 frontmatter 的原文。');
    assert.ok(!hdfs.body.startsWith('# '));assert.deepEqual(hdfs.assets,['images/图 一.png']);
    const image=path.join(root,'public/_article-assets/hdfs/images/图 一.png');
    assert.equal(readFileSync(image,'utf8'),'test-image');
    add('new','# 新文章\n\n新摘要。');assert.equal(generateArticles(root).length,3);
    writeFileSync(path.join(dir,'正文.md'),'# 更新标题\n\n已更新');
    assert.equal(generateArticles(root).find(a=>a.slug==='hdfs').title,'更新标题');
    writeFileSync(path.join(dir,'正文.md'),'---\npublished: false\n---\n# 隐藏');
    articles=generateArticles(root);assert.equal(articles.length,2);assert.ok(!existsSync(image));
    writeFileSync(path.join(root,'docs/articles/new/另一篇.md'),'# 重复');
    assert.throws(()=>readArticles(root),/一个 Markdown/);
  } finally { rmSync(root,{recursive:true,force:true}); }
});
