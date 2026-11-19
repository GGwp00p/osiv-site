# Template survey (research-lab websites)

Goal: pick a structure for the OSiV site, not copy a look. The look follows siplab.org plus the leader's rules
(black text, bold headings, every screen shows image and text together).

| Template | Stack | License | What we borrow | Verified |
|---|---|---|---|---|
| [Astro Scholar](https://github.com/shravanngoswamii/astro-scholar) | Astro 6, MDX | MIT (stated on its theme page) | Pages: blog, projects, publications, team; team/author data model; sitemap, RSS, Pagefind search, GitHub Pages deploy workflow | License and feature list read on astro.build; code not audited; last-update date not stated |
| [Scholar Lite](https://github.com/fjd2004711/scholar-lite) | Astro 6, Tailwind 4 | Not stated on the theme page | Collections: Team, News, Research Projects, Patents, Software, Honors, Activities; publications from one BibTeX file; Pagefind search | License must be checked in the repo before any code is reused |
| [Space Lab](https://choucisan.github.io/collections/spacelab/) | n/a | not checked | Team profile and news/blog layout ideas | Layout reference only |
| [Hugo Blox research lab](https://hugoblox.com/templates/research-lab) | Hugo | MIT core (vendor claim) | Content-first section list | Different stack, reference only |
| [al-folio](https://github.com/alshedivat/al-folio) | Jekyll | MIT (vendor claim) | Section organisation | Different stack, reference only |
| siplab.org | custom | n/a | Visual standard already adopted | n/a |

## What OSiV needs vs what the templates give

| OSiV need | Astro Scholar | Scholar Lite | Decision |
|---|---|---|---|
| Two research areas with their own pages and themes | no | partial (projects) | own collection `research` |
| Project detail pages (overview, goals, approach, outcomes) | projects | projects | own collection `projects` |
| Team with consent, photos, link priority | team | team | own collection `team` (fed from Google Sheet) |
| Publications with status (accepted, under review) and figures | from BibTeX | from BibTeX | own collection `publications` (Markdown, BibTeX export later) |
| News + blog | blog | news | collections `news`, `blog` |
| Full-screen home sections, siplab look | no | no | custom |
| GitHub Pages deploy | yes | Vercel/Netlify/Cloudflare | own workflow |

## Decision

Build our own Astro project and reuse the **structure and schemas** of Astro Scholar and Scholar Lite as references.
No code is copied. If code is reused later, check the repository license first and credit the source in the README.
Research ideas and templates from the content owner will be added later; the schemas leave room for extra fields.
