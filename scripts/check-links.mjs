import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'public');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) files.push(file);
  }
}
await walk(root);
const errors = [];
const documents = new Map(await Promise.all(files.map(async file => [file, await readFile(file, 'utf8')])));
const decode = value => value.replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code))).replaceAll('&amp;', '&').replaceAll('&quot;', '"');
let references = 0;
for (const [file, html] of documents) {
  if (!/<h1[\s>]/.test(html)) errors.push(`${file}: missing H1`);
  if (!/<link[^>]*rel=["']?canonical/.test(html)) errors.push(`${file}: missing canonical`);
  for (const block of html.matchAll(/<script[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(block[1]); } catch (e) { errors.push(`${file}: invalid JSON-LD: ${e.message}`); }
  }
  for (const match of html.matchAll(/\b(?:href|src)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    const ref = decode(match[1] ?? match[2] ?? match[3]);
    if (/^(?:https?:|mailto:|data:|tel:)/.test(ref)) continue;
    references++;
    const url = new URL(ref, `https://local.test/${path.relative(root, file).split(path.sep).join('/')}`);
    let target = path.join(root, decodeURIComponent(url.pathname));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
    } catch { errors.push(`${path.relative(root, file)}: broken reference ${ref}`); continue; }
    if (url.hash && documents.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      const ids = [...documents.get(target).matchAll(/\bid=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(match => match[1] ?? match[2] ?? match[3]);
      if (!ids.includes(id)) errors.push(`${path.relative(root, file)}: missing anchor ${ref}`);
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`PASS: ${files.length} HTML pages, ${references} local references, anchors, canonical metadata, and JSON-LD.`);
