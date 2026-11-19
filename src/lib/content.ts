// Small helpers so pages do not repeat the same collection queries and sorting.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Pub = CollectionEntry<'publications'>;
export type Project = CollectionEntry<'projects'>;

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export const getPublications = async (opts: { area?: 'technology' | 'society'; listedOnly?: boolean } = {}) => {
  let all = await getCollection('publications');
  if (opts.area) all = all.filter((p) => p.data.area === opts.area);
  if (opts.listedOnly) all = all.filter((p) => p.data.listed);
  return all.sort(byOrder);
};

export const getProjects = async () => (await getCollection('projects')).sort(byOrder);

export const getTeam = async () => {
  const groupOrder = ['lead', 'research', 'media', 'design', 'advisor'];
  return (await getCollection('team')).sort(
    (a, b) => groupOrder.indexOf(a.data.group) - groupOrder.indexOf(b.data.group) || a.data.order - b.data.order,
  );
};

export const getNews = async (column: 'news' | 'blog') =>
  (await getCollection('news'))
    .filter((n) => n.data.column === column)
    .sort((a, b) => b.data.sort.localeCompare(a.data.sort));

/** Where a member's name points: OSiV profile, else personal site, else LinkedIn, else Facebook. */
export const nameLink = (m: CollectionEntry<'team'>['data']) => m.profile ?? m.web ?? m.linkedin ?? m.facebook;

export const initials = (name: string) => {
  const parts = name.replace(/\(.*?\)/g, '').replace(/^(Dr|Mr|Ms|Prof)\.?\s+/i, '').trim().split(/\s+/);
  return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/** Buttons on a publication card: its own links, or a link to the publications page. */
export const pubButtons = (p: Pub['data']) =>
  p.links.length ? p.links.map((l) => ({ label: l.label === 'project page' ? 'project' : l.label === 'pdf' ? 'paper' : l.label, url: l.url })) : [{ label: 'publications', url: '/publications/' }];
