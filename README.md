# OSiV website (osiv.net)

Static site, no build step, served by GitHub Pages with the custom domain in `CNAME` (osiv.net).
Preview locally: `python3 -m http.server 8000` in this folder, then open http://localhost:8000/.

`papers/` holds the stand-alone paper pages (ACCV 2026 at `papers/`, 24H-GNN at `papers/24h-gnn/`,
the episodic-retrieval study at `papers/structured-episodic-retrieval/`); the OSiV pages link to them.

Static site, no build step. Layout and typography follow siplab.org (18 px, weight 300, lowercase sticky blurred
menu, 3-column team grid with 16:9 portraits, light footer). Font: Inter with the Vietnamese subset (SIL OFL,
`assets/fonts/`), Helvetica fallback.

```bash
python3 -m http.server 8000      # then open http://localhost:8000/
```

```
index.html          home: technology banner carousel, overview, research areas, featured papers, affiliations (logos), news
team.html           team photo grid, rendered from data/team.js
research.html       landing page for the two research areas
research-technology.html  Technology & Engineering (with ViSO): statement, 3 themes, publications, topics
research-society.html     Economics, Culture & Society: statement, 5 themes, projects, publications, topics
project-*.html            one detail page per provincial project (overview, goals, approach, outcomes)
tools/build_research.py   source of the three kinds of pages above: edit its data and run it
projects.html       ongoing (#ongoing) and completed (#completed) provincial projects, with photos
publications.html   accepted 2026 papers + under review / in preparation, with filters
news.html           news and blog
join.html           siplab-style opportunities page: application materials, collapsible "apply for" sections
contact.html        address, email, social, directions
assets/             style.css, site.js (top bar + dropdown menu, carousel, team cards), fonts/,
                         img/ (Unsplash placeholders, see img/CREDITS.md), img/projects/ (Wikimedia Commons), img/logos/ (institution logos); each folder has a CREDITS.md
data/team.js        team data
tools/create_form.gs     Apps Script: builds the member Google Form on the Team Profiles sheet
tools/sheet_to_team.py   Members tab (CSV) -> data/team.js
```

The ACCV, 24H-GNN and episodic retrieval entries link to the project pages one level up (`../index.html`, `../24h-gnn/`),
so deploy the whole repo, not just ``.

## Member profiles: Sheet → Form → website (all in English)

1. Google Sheet **OSiV — Team Profiles**: https://docs.google.com/spreadsheets/d/1JqF8_a71uKC5hmJsv0nhOYgiXctujXe2q5lBNOX5Qfw/edit
2. In the sheet: Extensions → Apps Script → paste `tools/create_form.gs` → run `setup` once.
   It first converts the Members tab to English columns and English-order names, then creates the English form.
   The form link to send to members is printed in the log and written to the "Form links" tab.
   Only the full name and the consent question are required; all links (LinkedIn, ORCID, Scholar, GitHub, …) are optional.
3. Each answer is copied into the "Members" tab automatically (matched by full name, ignoring case and diacritics;
   blank answers never erase data). Names are written in English order without diacritics, as on our papers
   (e.g. Nhan Thanh Ho). The seed rows use short names (My, Trang, Vy, Duy, Long) — once a member answers
   with their full name, delete the old short-name row.
4. Update the site: File → Download → CSV (Members tab), then
   `python3 tools/sheet_to_team.py members.csv > data/team.js`.

## Still to fill in (shown as "coming soon" on the site)

- Official full name / tagline of OSiV (`LAB_SUBTITLE` in `assets/site.js`), logo, mission statement (`index.html`).
- Real photos: team banner, office, events (replace files in `assets/img/`).
- Contact: full address of 82 Hoang Van Thu Street (ward / city), map link, official Gmail, Facebook / LinkedIn / TikTok links.
- Team: name of the Internal Manager; confirm Dr. Thuan Duc Tran's role; research lines in `team.js` were inferred from
  each person's projects and will be replaced by the form answers.
- Publications: authors, PDFs and DOIs for the six Journal of Education and Society papers (English titles on the site are our translations; check them); venue of
  "Competitive Legitimacy Pressure…" (the dashboard lists ICECI 2026 and CIEMB 2026); status of TCVN-2026-02 / -03.
- One paper under anonymous review (Master Dashboard code HNQT-2026-03) is left out of publications.html on purpose; add it after the review ends.
- Projects: approval status and outcomes; patents / start-ups section.
- Join us: Gen 1 recruitment form and timeline; training-program syllabus. News section on the home page.
