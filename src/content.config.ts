// Content collections. All site content lives in src/content/** and is validated here at build time,
// so a typo in a field name fails the build instead of silently breaking a page.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), url: z.string() });

/** One person per file. Written by `npm run team` from the Google Sheet, or edited by hand. */
const team = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    group: z.enum(['lead', 'research', 'media', 'design', 'advisor']),
    order: z.number().default(100),
    role: z.string().optional(),
    research: z.string().optional(),
    edu: z.string().optional(),
    photo: z.string().optional(), // path under /public, e.g. /img/team/emmi-duong.jpg
    // The name links to: profile page, else web, else linkedin, else facebook.
    profile: z.string().optional(),
    web: z.url().optional(),
    scholar: z.url().optional(),
    linkedin: z.url().optional(),
    orcid: z.url().optional(),
    github: z.url().optional(),
    researchgate: z.url().optional(),
    facebook: z.url().optional(),
  }),
});

/** One paper per file. `area` decides which research page lists it. */
const publications = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    group: z.enum(['OSiV', 'ViSO']).optional(), // badge next to the venue
    kind: z.enum(['conference', 'journal']),
    status: z.enum(['accepted', 'under-review', 'in-preparation', 'pending']),
    year: z.number().default(2026),
    area: z.enum(['technology', 'society']),
    order: z.number().default(100),
    image: z.string().optional(),
    fig: z.boolean().default(false), // true: figure on white, shown whole instead of cropped
    tag: z.string().optional(), // text tile shown while there is no image
    href: z.string().optional(), // internal project page
    links: z.array(link).default([]),
    note: z.string().optional(),
    listed: z.boolean().default(true), // false: hide from the publications page only
    homeOrder: z.number().optional(), // set to show a card on the home page (smaller number = earlier)
    shortTitle: z.string().optional(), // card title on the home page
    cardVenue: z.string().optional(),
  }),
});

/** One applied project per file; sections are frontmatter lists so every page renders them the same way. */
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    sub: z.string(),
    place: z.string(),
    image: z.string(),
    imagePosition: z.string().optional(),
    status: z.string(),
    group: z.enum(['ongoing', 'completed']),
    partner: z.string(),
    lead: z.string().optional(),
    time: z.string().optional(),
    order: z.number().default(100),
    overview: z.array(z.string()),
    goals: z.array(z.string()),
    approach: z.array(z.string()),
    outcomes: z.array(z.string()),
    papers: z.array(z.string()).default([]), // slugs from the publications collection
    homeOrder: z.number().optional(),
    cardVenue: z.string().optional(),
    shortTitle: z.string().optional(),
  }),
});

/** The two research directions: statement, themes with research questions, topics. */
const research = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/research' }),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    statement: z.string(),
    narrative: z.array(z.string()),
    image: z.string(),
    imagePosition: z.string().optional(),
    blurb: z.string(),
    themes: z.array(
      z.object({
        title: z.string(),
        image: z.string(),
        fig: z.boolean().default(false),
        question: z.string(),
        text: z.string(),
        projects: z.array(z.string()).default([]),
        papers: z.array(z.string()).default([]),
      }),
    ),
    topics: z.array(z.string()),
  }),
});

/** News (left two thirds) and blog (right third). A post without `image` shows an empty slot. */
const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.string(), // shown as written, e.g. "October 2026"
    sort: z.string(), // YYYY-MM-DD, newest first
    column: z.enum(['news', 'blog']).default('news'),
    image: z.string().optional(),
    fig: z.boolean().default(false),
    imagePosition: z.string().optional(),
    href: z.string().optional(),
    label: z.string().optional(), // replaces the date, e.g. "OSiV Explained · coming soon"
  }),
});

export const collections = { team, publications, projects, research, news };
