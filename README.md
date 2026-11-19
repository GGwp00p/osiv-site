# OSiV website (osiv.net)

Astro + TypeScript + Tailwind, static output, deployed to GitHub Pages by GitHub Actions.
Content (team, papers, projects, research directions, news) lives in `src/content/` and is validated at build time;
the look lives in `src/styles/global.css` and `src/components/`.

```bash
npm install
npm run dev        # http://localhost:4321, reloads on save
npm run build      # type check is `npm run check`; output goes to dist/
npm run links      # after a build: fails if any internal link or image is broken
```

## Folder map

```
src/pages/            routes (one file = one URL)   index, team, research/[area], projects/[slug], publications, news, join, contact, 404
src/content/          CONTENT, one file per item
  team/*.json           members            (npm run team -- members.csv updates these from the Google Sheet)
  publications/*.md     papers             (status, venue, figure, links; `area` decides which research page lists it)
  projects/*.md         applied projects   (overview, goals, approach, outcomes)
  research/*.yaml       the two directions (statement, themes with research questions, topics)
  news/*.md             news and blog posts
src/content.config.ts schemas: a wrong or missing field fails the build with a clear message
src/data/site.ts      menu, affiliations, home hero slides and the three home research directions
src/components/       Header, Footer, PersonCard, PubItem, ProjectCard, Affiliations
src/layouts/Base.astro  page shell, SEO tags, photo lightbox
public/               files served as they are: CNAME (osiv.net), fonts, img/, papers/ (the three stand-alone paper pages)
scripts/              sheet-to-team.mjs, check-links.mjs
.github/workflows/    deploy.yml (main -> GitHub Pages), ci.yml (every other branch: check + build + links)
legacy/               the previous hand-written HTML site, kept for reference; delete after the new site is approved
docs/template-notes.md  survey of research-lab templates and why we built our own structure
```

## Everyday tasks

- **Add or change a member:** download the Members tab as CSV, run `npm run team -- members.csv`.
  Photos are not downloaded: save a 16:9 crop to `public/img/team/<name>.jpg` and set `"photo": "/img/team/<name>.jpg"` in the member file.
  A member's name links to `profile`, else `web`, else `linkedin`, else `facebook`.
- **Add a paper:** copy a file in `src/content/publications/`, edit the front matter. `homeOrder` puts it on the home page.
- **Add a news or blog post:** copy a file in `src/content/news/`. `sort` only orders posts (newest first); `date` is the text shown.
  Without `image`, an "image coming soon" slot is shown.
- **Add a project:** copy a file in `src/content/projects/`; list related paper slugs (file names) in `papers`.
- **Menu, affiliations, home slides:** `src/data/site.ts`.
- Old `.html` addresses (for example `/team.html`) redirect to the new ones; the list is in `astro.config.mjs`.

## Deploying

Push to `main`: the `Deploy to GitHub Pages` workflow type-checks, builds, checks links and publishes `dist/`.
Settings -> Pages -> Source must be **GitHub Actions**. The custom domain comes from `public/CNAME`; do not delete that file.
Other branches only run the check workflow, so you can review a change before it reaches `main`.

## Credits

Photos and logos: see `public/img/**/CREDITS.md`. Font: Inter (SIL OFL), self-hosted in `public/fonts`.
Structure ideas from Astro Scholar and Scholar Lite (no code copied); look follows siplab.org.
