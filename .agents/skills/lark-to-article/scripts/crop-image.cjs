#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { parseArgs } = require('node:util');

async function main() {
  const { values: v } = parseArgs({ options: {
    root: { type: 'string', default: process.cwd() },
    input: { type: 'string' }, output: { type: 'string' },
    padding: { type: 'string', default: '30' },
    threshold: { type: 'string', default: '235' },
    overwrite: { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  }});
  if (v.help) {
    console.log('crop-image.cjs --root <project> --input <original> --output <new.png> [--padding 30] [--threshold 235] [--overwrite]');
    return;
  }
  if (!v.input || !v.output) throw Error('--input and --output are required');
  const input = path.resolve(v.input), output = path.resolve(v.output);
  if (input === output) throw Error('Keep the original: input and output must differ');
  if (!/\.png$/i.test(output)) throw Error('Output must end in .png');
  if (fs.existsSync(output) && !v.overwrite) throw Error('Output exists; use --overwrite only for an intended replacement');
  const padding = Number(v.padding), threshold = Number(v.threshold);
  if (!Number.isInteger(padding) || padding < 0 || padding > 1000) throw Error('padding must be an integer in 0..1000');
  if (!Number.isInteger(threshold) || threshold < 1 || threshold > 255) throw Error('threshold must be an integer in 1..255');
  const projectRequire = createRequire(path.join(path.resolve(v.root), 'package.json'));
  let sharp;
  try { sharp = projectRequire('sharp'); }
  catch {
    try { sharp = createRequire(projectRequire.resolve('next/package.json'))('sharp'); }
    catch { throw Error('Cannot resolve sharp from project or Next.js. Install it in a temporary tool directory and supply that directory as --root.'); }
  }
  const normalized = await sharp(input).rotate().flatten({background: '#fff'}).toColourspace('srgb').removeAlpha().png().toBuffer();
  const {data, info} = await sharp(normalized).raw().toBuffer({resolveWithObject: true});
  let l=info.width, t=info.height, r=-1, b=-1;
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    const p=(y*info.width+x)*info.channels;
    if(Math.min(data[p],data[p+1],data[p+2])<threshold) {
      l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);
    }
  }
  if(r<l) throw Error('No non-background content detected; inspect the original');
  const left=Math.max(0,l-padding), top=Math.max(0,t-padding);
  const right=Math.min(info.width-1,r+padding), bottom=Math.min(info.height-1,b+padding);
  const result=await sharp(normalized).extract({left,top,width:right-left+1,height:bottom-top+1}).extend({
    left:Math.max(0,padding-l), top:Math.max(0,padding-t),
    right:Math.max(0,r+padding+1-info.width), bottom:Math.max(0,b+padding+1-info.height), background:'#fff',
  }).png().toBuffer();
  const meta=await sharp(result).metadata();
  if(meta.width!==r-l+1+2*padding || meta.height!==b-t+1+2*padding) throw Error('Incorrect output bounds');
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,result,{flag:v.overwrite?'w':'wx'});
  console.log(JSON.stringify({input,output,original:[info.width,info.height],contentBounds:[l,t,r,b],size:[meta.width,meta.height],padding,threshold}));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
