// Checks every internal link and image in dist/ and fails if one is broken.   usage: npm run build && npm run links
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const dist = resolve('dist');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(dist).filter((f) => f.endsWith('.html'));
const broken = [];
let checked = 0;

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let u = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/.test(u)) continue;
    u = decodeURIComponent(u.split('#')[0].split('?')[0]);
    if (!u) continue;
    const base = u.startsWith('/') ? dist : dirname(page);
    let target = resolve(base, '.' + (u.startsWith('/') ? u : '/' + u));
    if (u.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) target = join(target, 'index.html');
    checked++;
    if (!existsSync(target)) broken.push(`${page.replace(dist, '')}  ->  ${m[1]}`);
  }
}
console.log(`${pages.length} pages, ${checked} internal links checked, ${broken.length} broken`);
if (broken.length) { console.log(broken.slice(0, 40).join('\n')); process.exit(1); }
