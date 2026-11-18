#!/usr/bin/env python3
"""Build the OSiV research-direction pages and the project detail pages.

    python3 osiv/tools/build_research.py

Writes osiv/research-technology.html, osiv/research-society.html and osiv/project-<slug>.html.
Edit the data below (themes, papers, projects) and run again. Project texts are English summaries of the
proposal documents in the lab Drive (BM.01 / A1 proposal forms); keep them conservative: these are proposals
and plans unless a status says otherwise.
"""
import html
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
P = "assets/img/projects/"
OS = '<span class="grp">OSiV</span>'
VI = '<span class="grp">ViSO</span>'
JES = 'Journal of Education and Society, 2026 <span class="muted">(article in Vietnamese)</span>'


def head(title, desc):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} · OSiV</title>
  <meta name="description" content="{html.escape(desc)}">
  <link rel="preload" href="assets/fonts/inter-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/style.css">
  <script src="assets/site.js" defer></script>
</head>
<body>
'''


FOOT = "</main>\n</body>\n</html>\n"

# ----------------------------------------------------------------------------------------------- papers
PAPERS = {
    "episodic": dict(href="papers/structured-episodic-retrieval/", fig=1, img="papers/structured-episodic-retrieval/static/images/fig1_rules.png",
                     title="What Makes Structured Episodic Retrieval Robust to Noisy Query Cues? A Controlled Study",
                     au="Authors withheld during review", ve="Under review, 2026",
                     links=[("project page", "papers/structured-episodic-retrieval/")]),
    "accv": dict(href="papers/index.html", fig=1, img="papers/static/images/fig1_overview.png",
                 title="Probabilistic Structured Event Modeling for Video Event Recognition under Perceptual Uncertainty",
                 au="Nhan Thanh Ho, Anh Dong Nguyen, Thuan Duc Tran, Thang Van Nguyen, Bui Anh Thinh, Nguyen Bao Tran, Long Nhat Ho",
                 ve="Asian Conference on Computer Vision (ACCV) 2026" + VI,
                 links=[("project page", "papers/index.html"), ("pdf", "papers/static/pdf/paper.pdf")]),
    "gnn": dict(href="papers/24h-gnn/", img="papers/24h-gnn/static/images/fig2b_taxi_heatmap.jpg",
                title="24H-GNN: A Pattern-Driven Pseudo-Label Fusion Graph Network for City-Wide Traffic Flow Prediction",
                au="Thanh Nhan Ho, Dong Anh Nguyen, Minh Tai Pham Nguyen, Minh Khue Phan Tran, Hoang Minh Nguyen, Nguyen Bao Tran, Trong Nhan Le",
                ve="International Conference on Intelligent Systems and Networks (ICISN) 2026",
                links=[("project page", "papers/24h-gnn/"), ("pdf", "papers/24h-gnn/static/pdf/paper.pdf")]),
    "clp": dict(img="assets/img/papers/clp-framework.png", fig=1,
                title="Competitive Legitimacy Pressure and Symbolic AI Adoption in Emerging-Market Firms: A Conceptual Framework with Illustrative Evidence from Southeast Asia",
                au="An Duong Thanh Nguyen, et al.", ve='International conference, accepted 2026 <span class="muted">(venue details coming soon)</span>' + OS,
                note="Separates visible AI positioning, symbolic adoption, substantive capability and AI washing, using 50 public documents from Southeast Asia."),
    "apricot": dict(img=P + "yellow-apricot.jpg",
                    title="The Potential of Digitizing Ornamental Yellow Apricot: Lessons from Research on Bonsai, Heritage Landscapes and Artisan Knowledge",
                    au="Authors coming soon", ve=JES + OS),
    "dt_policy": dict(img=P + "mango.jpg",
                      title="From Policy Support to Productivity: The Mediating Role of Technological Innovation and Management Capability in Dong Thap Firms",
                      au="Authors coming soon", ve=JES + OS),
    "tacit1": dict(tag="Tacit knowledge · ornamental plants",
                   title="Developing Technology Absorptive Capacity through Tacit Knowledge Transfer: A Case Study of the An Nhon Dong Ornamental Plant Value Chain",
                   au="Authors coming soon", ve=JES + OS),
    "tacit2": dict(tag="Tacit knowledge · education",
                   title="Tacit Knowledge Transfer and Digitalized Absorptive Capacity in the An Nhon Dong Ornamental Plant Value Chain: An Education and Capability-Development Approach",
                   au="Authors coming soon", ve=JES + OS),
    "muine1": dict(img=P + "mui-ne.jpg",
                   title="From Strategy to Action: Solutions, Implementation Mechanisms and Impact Assessment for Developing Mui Ne into a Green and Smart Tourism Destination",
                   au="Authors coming soon", ve=JES + OS),
    "muine2": dict(tag="Mui Ne · digital transformation",
                   title="Developing Mui Ne into a Green and Smart Tourism Destination: The Role of Innovation, Digital Transformation and Destination Governance",
                   au="Authors coming soon", ve=JES + OS),
    "cbam": dict(tag="Trade · carbon border",
                 title="The EU Carbon Border Adjustment Mechanism and Trade: Early Evidence from the First Months of the Definitive Regime",
                 au="Anh Dong Nguyen, et al.", ve="Under review" + VI),
    "coffee": dict(img="assets/img/papers/coffee-energy.png", fig=1,
                   title="Energy Feasibility Boundaries for Converting Spent Coffee Grounds into Solid Biofuel: Effects of Mechanical Dewatering, Drying, and Solids Loss",
                   au="Thuan Duc Tran, My Linh Thi Le", ve="Under review" + OS,
                   note="Arabica spent coffee grounds from Lam Dong as a solid biofuel: where dewatering, drying and solids loss make conversion worthwhile."),
    "robot": dict(tag="Robotics · scrap sorting", title="AI-Integrated Robots for Industrial Scrap Sorting in Vietnam",
                  au="Authors coming soon", ve="Under review" + OS),
    "ip": dict(tag="Intellectual property · agriculture", title="Commercializing Intellectual Property in the Agricultural Value Chain of Dong Thap",
               au="Authors coming soon", ve="Status coming soon" + OS),
    "policy2": dict(tag="Policy · productivity",
                    title="From Policy Support to Productivity: The Role of Technological Innovation and Management Capability",
                    au="Authors coming soon", ve="Status coming soon" + OS),
    "heritage": dict(tag="Digital heritage · public value",
                     title="From Peripheral Heritage to Public Infrastructure: State-Led Digital Heritage Transformation and Public Value in Soc Bom Bo, Vietnam",
                     au="An Duong Thanh Nguyen, et al.", ve="In preparation" + OS),
}

# ----------------------------------------------------------------------------------------------- projects
DOST = "Department of Science and Technology"
PROJECTS = [
    dict(slug="an-giang-mango", img=P + "an-giang-rice.jpg", place="An Giang",
         title="Smart governance of the mango value chain in An Giang",
         sub="digital traceability, farm logbooks and supply–demand forecasting to reduce market risk",
         status="Ongoing · proposal", partner=f"{DOST}, An Giang",
         overview=["Traceability in An Giang is often reduced to a QR code on the box. Export buyers and supermarkets, however, ask what is behind it: how the fruit was grown, which crop-protection products were used, whether yields are stable and whether the growing area is large enough.",
                   "The second problem is the familiar “good harvest, low price”: many households harvest in the same weeks, nobody knows demand in advance, and farmers depend on traders. The project moves the chain from “grow first, then look for buyers” to “know what the market needs, then organise production”."],
         goals=["Know exactly what the province has: households, hectares, varieties, expected yield and harvest months.",
                "Standardise household, orchard and growing-zone codes, varieties, areas and the harvest calendar.",
                "Introduce electronic farm logbooks so that each batch of fruit carries its production history.",
                "Link cooperatives and buyers through supply–demand forecasting, then batch-level traceability."],
         approach=["Comparative study of Japan (farm records and product history), Thailand (cooperative coordination) and the Netherlands (forecasting and cold logistics), rated for what can be applied in An Giang now.",
                   "Phase one builds data, not software: simple tools (forms, spreadsheets, KoboToolbox, QGIS) to create a verified raw-material-zone database.",
                   "Later phases add logbooks, traceability by batch and forecasting; AI and big data come only once the data foundation exists."],
         outcomes=["A verified database of the mango growing zone (households, area, orchard and zone codes, varieties, harvest calendar), the chain's first digital asset.",
                   "Electronic logbook and batch-traceability workflow for cooperatives.",
                   "Supply–demand forecasting to plan harvests and sales."],
         papers=["ip", "dt_policy"]),
    dict(slug="yellow-apricot", img=P + "yellow-apricot.jpg", place="Gia Lai",
         title="AI for the indigenous knowledge of yellow-apricot growing in An Nhon Dong",
         sub="capturing, modelling and transferring artisans' tacit knowledge with a knowledge base and an AI assistant",
         status="Ongoing · proposal", partner=f"{DOST}, Gia Lai",
         lead="Ho Chi Minh City University of Industry and Trade; principal investigator Dr. Thuan Duc Tran",
         time="12 months, October 2026 to October 2027 (planned)",
         overview=["The value of an An Nhon Dong yellow-apricot tree depends as much on the artisan as on the plant: choosing varieties, shaping roots and trunks, bending branches, controlling the flowering date, spotting problems and judging artistic and commercial value.",
                   "This knowledge is tacit. It passes from master to apprentice by hand and is at risk as older artisans retire. The project turns it into structured, verifiable digital knowledge that can be searched, taught and used to promote the craft."],
         goals=["Capture craft knowledge from at least 5 to 10 leading artisans and households.",
                "Convert tacit knowledge into structured data with the SECI model: 20 to 30 technical procedures and at least 50 real knowledge cases.",
                "Build a knowledge base with artisan profiles, photos and videos, procedures and 10 to 20 digital tree records linked by QR codes.",
                "Develop a domain AI assistant using retrieval-augmented generation (RAG) that answers from verified data and cites its sources.",
                "Create a digital exhibition space and visual technical library to promote the craft."],
         approach=["Field surveys and interviews with artisans; every item records who provided it and is classified by knowledge group.",
                   "Knowledge modelling with SECI: videos, images, procedures, step diagrams, questions and answers, and technical situations, with standard metadata.",
                   "Database and digital tree records with QR codes; RAG-based assistant with source citation, scope control and warnings when data is insufficient.",
                   "Pilot with artisans, growers, apprentices and visitors; evaluation, training and transfer."],
         outcomes=["A structured, traceable knowledge base of the craft.",
                   "One domain AI assistant and one knowledge search platform.",
                   "A digital exhibition space, technical library and working QR system."],
         papers=["apricot", "tacit1", "tacit2"]),
    dict(slug="mui-ne-heritage", img=P + "mui-ne.jpg", place="Lam Dong",
         title="AI and multimodal interaction for a gamified heritage tour at Po Sah Inu, Mui Ne",
         sub="a smart welcome kiosk, a multilingual voice guide and a game-like route for green and smart tourism",
         status="Ongoing · proposal", partner="Lam Dong province",
         overview=["Visitors at the Po Sah Inu Cham towers near Mui Ne mostly meet static signs and QR codes. The project upgrades this to two-way, interactive heritage interpretation that keeps visitors longer and gives the site management a sustainable smart-destination tool."],
         goals=["Build a validated knowledge base on the Cham towers and the Kate festival, reviewed by cultural experts, as the only source for the AI (80 to 100 topics, questions and answers in three languages).",
                "Design an outdoor interactive kiosk: proximity sensors greet visitors and a step pad shows a dynamic QR code; weatherproof and with no biometric data collected.",
                "Develop a real-time voice assistant in Vietnamese, English and Russian (speech recognition, retrieval-grounded answers, speech synthesis) that runs in the phone browser without installing an app.",
                "Design a gamified heritage route with five touchpoints around the site."],
         approach=["Survey of current interpretation at the site and digitisation of historical and cultural sources.",
                   "Vector database of verified content for retrieval-augmented answers, to avoid wrong or invented cultural information.",
                   "Hardware prototyping of the kiosk, then pilot operation with visitors and evaluation."],
         outcomes=["A validated heritage knowledge base and multilingual question set.",
                   "A working kiosk prototype and voice guide.",
                   "A gamified tour route handed over to the site management."],
         papers=["muine1", "muine2"]),
    dict(slug="blao-rainwater", img=P + "farm-pond.jpg", place="Lam Dong",
         title="Rainwater coordination for sustainable agriculture in B'Lao",
         sub="from “drain it fast” to collect, regulate, store, reuse and infiltrate",
         status="Ongoing · proposal", partner=f"{DOST}, Lam Dong",
         lead="Proposed by the B'Lao Ward People's Committee",
         overview=["Greenhouses and sealed surfaces around B'Lao turn rain into fast surface runoff in the wet season, adding to drainage load, erosion and sedimentation, while water runs short in the dry season.",
                   "Current measures focus on drainage, saving irrigation water and storage tanks. Collecting, regulating and infiltrating rainwater on site has not yet been tried as a monitored pilot with a clear operating procedure."],
         goals=["Survey drainage, terrain, soils, infiltration capacity and water demand in the pilot area.",
                "Build a water-balance model and choose a collect, regulate, store, reuse or infiltrate scheme.",
                "Build and operate at least one rainwater-coordination pilot in a representative farming area.",
                "Monitor rainfall and the volumes collected, stored and infiltrated, and quantify the effect on runoff.",
                "Write procedures for design, operation and maintenance, site-selection criteria and a plan for scaling up."],
         approach=["Field survey and measurement, rainfall–runoff data and a water-balance model.",
                   "Distributed, nature-based measures: roof collection from greenhouses, small regulating ponds, infiltration pits and filter media.",
                   "Monitoring system and quantitative evaluation of the pilot."],
         outcomes=["One working pilot with monitoring data.",
                   "A water-balance model and dataset for the area.",
                   "Technical procedures and site-selection criteria for replication."],
         papers=["coffee"]),
    dict(slug="ip-map", img=P + "mekong-satellite.jpg", place="Dong Thap",
         title="A digital map of intellectual property assets in Dong Thap",
         sub="geographical indications and collective trademarks online, linked with production and traceability data",
         status="In preparation", partner="Dong Thap province",
         overview=["The new Dong Thap province (merged with Tien Giang in 2025) has about 135,000 ha of fruit trees and around 2.5 million tonnes of fruit a year; about 49,490 ha already carry 2,715 export growing-area codes.",
                   "Its geographical indications and collective trademarks are an underused asset because their legal data, geography, producers and output are scattered across agencies."],
         goals=["Survey, inventory and standardise data on geographical indications and collective trademarks: legal status, right holders, managers, products, areas and users.",
                "Build a spatial database and an online map that displays the protected areas.",
                "Integrate production volume and traceability data.",
                "Support management, updating, search and promotion of these assets."],
         approach=["Phase 1: survey, baseline, data dictionary, system architecture and data flows.",
                   "Phase 2 (planned April to September 2027): standardise data, build the digital map and a pilot online system.",
                   "Later phases: integration, testing with agencies and handover."],
         outcomes=["A data dictionary and database of intellectual property assets.",
                   "A public online map of geographical indications and collective trademarks.",
                   "Integration with production and traceability data."],
         papers=["ip"]),
    dict(slug="dong-thap-mango", img=P + "mango.jpg", place="Dong Thap",
         title="Digital management of mango-growing zones in Dong Thap",
         sub="Cat Chu mango, Cao Lanh: production management, batch traceability and value-chain linkage",
         status="Completed · proposal submitted, awaiting decision", partner=f"{DOST}, Dong Thap",
         overview=["A pilot model for managing the raw-material zone of Cat Chu mango, with the cooperative as the hub that creates, checks and uses data for purchasing, packing, processing, distribution and export."],
         goals=["Standardise production data and track the season.",
                "Forecast supply capacity and control quality.",
                "Trace products by batch, with data that can be exchanged with the traceability system chosen by the authorities."],
         approach=["Survey of current zone management and the data needs of the mango chain, with a measured baseline for before-and-after comparison.",
                   "A data dictionary, system architecture, business processes and data-exchange plan.",
                   "Pilot with cooperatives, firms and households, then evaluation."],
         outcomes=["Survey and baseline reports, data dictionary and system design.",
                   "A pilot digital zone-management model for mango."],
         papers=["dt_policy", "ip"]),
    dict(slug="dong-thap-pineapple", img=P + "pineapple.jpg", place="Dong Thap",
         title="Digital management of pineapple-growing zones in Dong Thap",
         sub="data by household, plot, variety, crop cycle and harvest lot",
         status="Completed · proposal submitted, awaiting decision", partner=f"{DOST}, Dong Thap",
         overview=["The same model for pineapple: the cooperative coordinates the data, which is standardised by household, plot, variety, crop cycle and harvest lot to follow production, forecast supply, control quality and prepare traceability records. Tan Phuoc 1 pineapple cooperative is the proposed pilot partner."],
         goals=["Standardise pineapple production data.",
                "Track production progress and forecast supply.",
                "Prepare batch traceability records that work with the authorised traceability system."],
         approach=["Survey and baseline, data dictionary, architecture and data flows.",
                   "Pilot with the cooperative, linked household groups and firms."],
         outcomes=["Survey and baseline reports, data dictionary and system design.",
                   "A pilot digital zone-management model for pineapple."],
         papers=["dt_policy", "ip"]),
]
PBY = {p["slug"]: p for p in PROJECTS}

# ----------------------------------------------------------------------------------------------- themes
TECH = dict(
    file="research-technology.html", name="Technology &amp; Engineering",
    statement="We build AI systems that stay reliable when their inputs are uncertain: perception that makes mistakes, memories that must be searched with vague cues, and cities observed through sparse sensors.",
    narrative=["Technology research at OSiV is carried out with our partner group ViSO. The common thread is structure and calibrated uncertainty: instead of trusting one prediction, our systems keep structured records with confidences and let reliable evidence outweigh unreliable evidence.",
               "We work on video understanding, memory for AI agents and spatio-temporal learning, and evaluate on public benchmarks with controlled noise so that robustness can be measured, not assumed."],
    themes=[
        dict(title="Video event understanding under perceptual uncertainty", img="papers/static/images/fig1_overview.png", fig=1,
             q="How can a retrieval system keep finding events when detectors, trackers and action classifiers make mistakes?",
             text="Long videos are summarised as structured events (time, location, actor, action). We treat the correctness of each attribute as a latent variable and calibrate its confidence, so one misrecognised cue no longer discards an event.",
             papers=["accv"]),
        dict(title="Structured memory for AI agents", img="papers/structured-episodic-retrieval/static/images/fig1_rules.png", fig=1,
             q="What makes structured episodic retrieval robust when the query cues themselves are noisy?",
             text="LLM agents need to recall past episodes from partial and sometimes wrong cues. We study, under controlled noise, how confidence-aware matching across several memory axes compares with strict matching and embedding search.",
             papers=["episodic"]),
        dict(title="City-scale spatio-temporal learning", img="papers/24h-gnn/static/images/fig2b_taxi_heatmap.jpg",
             q="How can sparse road sensors and dense vehicle trajectories be combined to predict traffic across a whole city?",
             text="Graph neural networks fuse loop-detector data with taxi GPS trajectories; pattern-driven pseudo-labels fill in roads that have no sensor.",
             papers=["gnn"]),
    ],
    groups=[("2026", ["episodic", "accv", "gnn"])],
    tags=["computer vision", "video event retrieval", "uncertainty calibration", "isotonic regression", "structured event memory",
          "LLM agents", "episodic memory", "retrieval", "graph neural networks", "spatio-temporal forecasting", "pseudo-labelling",
          "intelligent transportation"],
    projects=[],
)
SOC = dict(
    file="research-society.html", name="Economics, Culture &amp; Society",
    statement="We use data and AI to help Vietnamese localities turn what they already have, their farm produce, crafts, heritage, landscapes and water, into lasting value, and we study how firms and policies make that happen.",
    narrative=["Most of this work starts from a concrete request of a province or ward and becomes an applied project prepared with the provincial Department of Science and Technology. Our papers then examine the mechanisms behind it: how policy support turns into productivity, how tacit knowledge is transferred, and why firms adopt technology.",
               "Our approach is data first: survey and standardise what exists, measure a baseline, run a pilot with the people who will use it, and only then add AI."],
    themes=[
        dict(title="Digital governance of agricultural value chains", img=P + "an-giang-rice.jpg",
             q="How can cooperatives and provinces know their supply, prove its origin and sell it at a fair price?",
             text="Digital raw-material zones for mango and pineapple, farm logbooks, batch traceability, supply–demand forecasting and a digital map of geographical indications.",
             projects=["an-giang-mango", "dong-thap-mango", "dong-thap-pineapple", "ip-map"], papers=["ip"]),
        dict(title="Tacit knowledge, heritage and AI", img=P + "yellow-apricot.jpg",
             q="How can knowledge that lives in artisans' hands be captured, verified and taught with AI?",
             text="Yellow-apricot craft in An Nhon Dong, absorptive capacity in ornamental-plant value chains, and digital heritage as public infrastructure.",
             projects=["yellow-apricot"], papers=["apricot", "tacit1", "tacit2", "heritage"]),
        dict(title="Smart and green tourism", img=P + "mui-ne.jpg",
             q="What makes a destination such as Mui Ne both greener and smarter, and how should it be governed?",
             text="Destination governance and digital transformation for Mui Ne, and an interactive, multilingual heritage tour at Po Sah Inu.",
             projects=["mui-ne-heritage"], papers=["muine1", "muine2"]),
        dict(title="Innovation, policy and firm behaviour", img="assets/img/papers/clp-framework.png", fig=1,
             q="Do firms adopt AI and new technology for value or for legitimacy, and does policy support raise productivity?",
             text="Symbolic AI adoption in Southeast Asian firms, policy support and productivity in Dong Thap, and the trade effects of the EU carbon border adjustment mechanism.",
             projects=[], papers=["clp", "dt_policy", "policy2", "cbam"]),
        dict(title="Water, energy and resources", img=P + "farm-pond.jpg",
             q="How can farms and industries use local resources better under a changing climate?",
             text="Rainwater coordination for farming in B'Lao, spent coffee grounds as solid biofuel, and AI robots for scrap sorting.",
             projects=["blao-rainwater"], papers=["coffee", "robot"]),
    ],
    groups=[("2026", ["clp", "apricot", "dt_policy", "tacit1", "tacit2", "muine1", "muine2"]),
            ("Under review &amp; in preparation", ["cbam", "coffee", "robot", "ip", "policy2", "heritage"])],
    tags=["digital agriculture", "traceability", "raw-material zones", "supply–demand forecasting", "geographical indications",
          "tacit knowledge", "SECI", "cultural heritage", "smart tourism", "destination governance", "AI adoption", "legitimacy",
          "public policy", "productivity", "carbon border adjustment", "rainwater management", "biofuel", "circular economy"],
    projects=[p["slug"] for p in PROJECTS],
)


# ----------------------------------------------------------------------------------------------- rendering
def pub_item(key):
    e = PAPERS[key]
    cls = "thumb fig" if e.get("fig") else "thumb"
    zoom = "" if e.get("href") else ' class="zoomable"'
    inner = f'<img src="{e["img"]}" alt="" loading="lazy"{zoom}>' if e.get("img") else f'<span class="tag">{e["tag"]}</span>'
    thumb = f'<a class="{cls}" href="{e["href"]}">{inner}</a>' if e.get("href") else f'<div class="{cls}">{inner}</div>'
    title = f'<a href="{e["href"]}">{e["title"]}</a>' if e.get("href") else e["title"]
    out = [f"      <li>\n        {thumb}\n        <div class=\"text\">\n          <h3>{title}</h3>",
           f'          <div class="au">{e["au"]}</div>\n          <div class="ve">{e["ve"]}</div>']
    if e.get("note"):
        out.append(f'          <p class="thsub" style="margin:4px 0 6px">{e["note"]}</p>')
    if e.get("links"):
        out.append('          <ul class="options">' + "".join(f'<li><a href="{u}">{t}</a></li>' for t, u in e["links"]) + "</ul>")
    out.append("        </div>\n      </li>")
    return "\n".join(out)


def pub_group(label, keys):
    return (f'  <section class="pubgroup">\n    <div class="yr">{label}</div>\n    <ul class="pblt">\n'
            + "\n".join(pub_item(k) for k in keys) + "\n    </ul>\n  </section>\n")


def related_links(theme):
    links = [f'<a href="project-{s}.html">{PBY[s]["title"]}</a>' for s in theme.get("projects", [])]
    links += [f'<a href="{PAPERS[k]["href"]}">{PAPERS[k]["title"]}</a>' if PAPERS[k].get("href") else PAPERS[k]["title"]
              for k in theme.get("papers", [])]
    return "".join(f"<li>{x}</li>" for x in links)


def project_card(slug):
    p = PBY[slug]
    return f'''    <li>
      <a class="nb" href="project-{slug}.html"><div class="ph"><img src="{p["img"]}" alt="" loading="lazy"><span class="tag">{p["place"]}</span></div></a>
      <span class="venue">{p["status"]}</span>
      <span class="thcap"><a href="project-{slug}.html">{p["title"]}</a></span>
      <span class="thsub">{p["sub"]}</span>
    </li>'''


def direction_page(d, other):
    h = head(d["name"], d["statement"])
    h += '<main id="research" class="direction">\n'
    h += f'  <p class="crumbs"><a href="research.html">Research</a> / {d["name"]}</p>\n'
    h += f'  <h1>{d["name"]}</h1>\n  <p class="statement">{d["statement"]}</p>\n'
    h += "".join(f'  <p class="intro">{p}</p>\n' for p in d["narrative"])
    h += '\n  <h2>Research themes</h2>\n'
    for i, t in enumerate(d["themes"], 1):
        cls = "ph fig" if t.get("fig") else "ph"
        h += f'''  <section class="theme">
    <div class="{cls}"><img src="{t["img"]}" alt="" loading="lazy"></div>
    <div>
      <span class="venue">Theme {i}</span>
      <h3>{t["title"]}</h3>
      <p class="rq">{t["q"]}</p>
      <p>{t["text"]}</p>
      <ul class="rel">{related_links(t)}</ul>
    </div>
  </section>
'''
    if d["projects"]:
        h += '\n  <h2>Projects</h2>\n  <ul class="tiles">\n' + "\n".join(project_card(s) for s in d["projects"]) + "\n  </ul>\n"
    h += "\n  <h2>Publications</h2>\n" + "".join(pub_group(l, k) for l, k in d["groups"])
    h += '\n  <h2>Topics</h2>\n  <ul class="tags">' + "".join(f"<li>{t}</li>" for t in d["tags"]) + "</ul>\n"
    h += f'\n  <p class="crumbs" style="margin-top:40px">See also: <a href="{other["file"]}">{other["name"]}</a></p>\n'
    return h + FOOT


def project_page(p):
    rel_papers = "\n".join(pub_item(k) for k in p.get("papers", []))
    others = [s for s in PBY if s != p["slug"]][:3]
    facts = [("Status", p["status"]), ("Partner", p["partner"])]
    if p.get("lead"):
        facts.append(("Lead", p["lead"]))
    if p.get("time"):
        facts.append(("Timeline", p["time"]))
    h = head(p["title"], p["sub"]) + '<main id="project" class="projectpage">\n'
    h += '  <p class="crumbs"><a href="research-society.html">Economics, Culture &amp; Society</a> / <a href="projects.html">Projects</a></p>\n'
    h += f'  <h1>{p["title"]}</h1>\n  <p class="statement">{p["sub"]}</p>\n'
    h += '  <dl class="facts">' + "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in facts) + "</dl>\n"
    h += f'  <section class="teaser"><img src="{p["img"]}" alt=""><span class="brl">illustrative photo</span></section>\n'
    h += '  <h2>Overview</h2>\n' + "".join(f"  <p>{x}</p>\n" for x in p["overview"])
    h += '  <h2>Goals</h2>\n  <ul class="blst">' + "".join(f"<li>{x}</li>" for x in p["goals"]) + "</ul>\n"
    h += '  <h2>Approach</h2>\n  <ol class="steps">' + "".join(f"<li>{x}</li>" for x in p["approach"]) + "</ol>\n"
    h += '  <h2>Expected outcomes</h2>\n  <ul class="blst">' + "".join(f"<li>{x}</li>" for x in p["outcomes"]) + "</ul>\n"
    if rel_papers:
        h += '  <h2>Related papers</h2>\n  <ul class="pblt">\n' + rel_papers + "\n  </ul>\n"
    h += '  <h2>Related projects</h2>\n  <ul class="tiles">\n' + "\n".join(project_card(s) for s in others) + "\n  </ul>\n"
    h += ('  <p class="muted" style="font-size:13px;margin-top:30px">Summary of the project proposal; scope, '
          'timeline and results may change after review by the provincial authorities. Photo: Wikimedia Commons, see '
          '<a href="assets/img/projects/CREDITS.md">credits</a>.</p>\n')
    return h + FOOT


def main():
    with open(os.path.join(OUT, TECH["file"]), "w", encoding="utf-8") as f:
        f.write(direction_page(TECH, SOC))
    with open(os.path.join(OUT, SOC["file"]), "w", encoding="utf-8") as f:
        f.write(direction_page(SOC, TECH))
    for p in PROJECTS:
        with open(os.path.join(OUT, f"project-{p['slug']}.html"), "w", encoding="utf-8") as f:
            f.write(project_page(p))
    print("wrote 2 direction pages and", len(PROJECTS), "project pages")


if __name__ == "__main__":
    main()
