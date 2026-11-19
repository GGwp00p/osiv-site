// Updates src/content/team/*.json from the "Members" tab of the Team Profiles Google Sheet.
//   Google Sheet -> File -> Download -> CSV (Members tab), then:   npm run team -- ~/Downloads/members.csv
// Rules: skips rows with "Show (Y/N)" = N or consent "I do not agree"; drops placeholder answers ("N/A", "chua co" ...);
// normalises ORCID / LinkedIn links; never deletes a field that already exists in a member file.
// Photos are NOT downloaded: save the portrait to public/img/team/<slug>.jpg (16:9 crop) and set "photo" by hand;
// the script lists members whose sheet row has a photo link but no local photo yet.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: npm run team -- members.csv'); process.exit(1); }

function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const fold = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();
const JUNK = new Set(['', 'n/a', 'na', 'no', 'none', '-', 'khong', 'khong co', 'chua co']);
const isJunk = (v) => { const f = fold(v).trim().replace(/[ .!?]+$/, ''); return JUNK.has(f) || /^(ch co|chua co|tam thoi|khong)/.test(f) || f === 'anything'; };
const linkKeys = new Set(['web', 'scholar', 'linkedin', 'orcid', 'github', 'researchgate', 'facebook']);

function clean(key, v) {
  v = (v || '').trim();
  if (isJunk(v)) return '';
  if (!linkKeys.has(key)) return v;
  if (key === 'orcid') { const m = v.match(/\d{4}-\d{4}-\d{4}-\d{3}[\dX]/); return m ? `https://orcid.org/${m[0]}` : ''; }
  if (/^(www\.|[a-z0-9-]+\.[a-z]{2,}\/)/i.test(v)) v = 'https://' + v;
  if (!/^https?:\/\/\S+$/.test(v)) return '';
  try { const u = new URL(v); [...u.searchParams.keys()].filter((k) => k.startsWith('utm_')).forEach((k) => u.searchParams.delete(k)); return u.href; } catch { return ''; }
}
const group = (div, explicit) => {
  const g = (explicit || '').trim().toLowerCase();
  if (['lead', 'research', 'media', 'design', 'advisor'].includes(g)) return g;
  const d = fold(div);
  if (d.includes('leadership')) return 'lead';
  if (d.includes('advisor')) return 'advisor';
  if (d.includes('design')) return 'design';
  if (/operations|media|event|partner/.test(d)) return 'media';
  return 'research';
};

const [head, ...rows] = parseCsv(readFileSync(file, 'utf8').replace(/^﻿/, ''));
const col = Object.fromEntries(head.map((h, i) => [h.trim(), i]));
const fields = { role: 'Role', research: 'Research interests', edu: 'Degree & affiliation', web: 'Website', scholar: 'Google Scholar', linkedin: 'LinkedIn', orcid: 'ORCID', github: 'GitHub', researchgate: 'ResearchGate', facebook: 'Facebook', profile: 'OSiV profile page' };
const needPhoto = [];
let written = 0;
for (const r of rows) {
  const get = (name) => (r[col[name]] ?? '').trim();
  const name = get('Display name') || get('Full name');
  if (!name || get('Show (Y/N)').toUpperCase().startsWith('N') || fold(get('Public display consent')).includes('not')) continue;
  const slug = fold(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const path = `src/content/team/${slug}.json`;
  const old = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { order: 100 };
  const m = { ...old, name, group: old.group ?? group(get('Division'), get('Web group')) };
  for (const [k, c] of Object.entries(fields)) { const v = clean(k, get(c)); if (v) m[k] = v; }
  if (!m.photo && !isJunk(get('Photo link'))) needPhoto.push(`${name}: ${get('Photo link')}`);
  writeFileSync(path, JSON.stringify(m, null, 2) + '\n');
  written++;
}
console.log(`${written} member file(s) written.`);
if (needPhoto.length) console.log('\nPhotos to add by hand (save as public/img/team/<slug>.jpg and set "photo"):\n  ' + needPhoto.join('\n  '));
