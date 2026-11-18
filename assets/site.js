/* OSiV site: shared top bar (wordmark + menu with dropdowns), footer, banner carousel, team cards. No dependencies. */
(function () {
  "use strict";

  // TODO(OSiV): replace with the official full name once decided.
  var LAB_SUBTITLE = "Research &amp; Innovation";

  var MENU = [
    ["index.html", "Home"],
    ["team.html", "Team"],
    ["research.html", "Research", [
      ["research-technology.html", "Technology &amp; Engineering", "three papers: video, memory for AI agents, traffic"],
      ["research-society.html", "Economics, Culture &amp; Society", "papers and projects: policy, heritage, agriculture, tourism"]
    ]],
    ["projects.html", "Projects", [
      ["projects.html#ongoing", "Ongoing", "projects in progress"],
      ["projects.html#completed", "Completed", "finished and submitted work"]
    ]],
    ["publications.html", "Publications"],
    ["news.html", "News &amp; Blog"],
    ["join.html", "Join us"],
    ["contact.html", "Contact"]
  ];

  function current() {
    var f = location.pathname.split("/").pop();
    if (/^research-/.test(f)) return "research.html";
    if (/^project-/.test(f)) return "projects.html";
    return f === "" ? "index.html" : f;
  }

  function chrome() {
    var cur = current();
    var bar = document.createElement("header");
    bar.id = "topbar";
    var items = MENU.map(function (m) {
      var cls = (m[0] === cur ? "si" : "") + (m[2] ? " dd" : "");
      var sub = m[2] ? '<ul class="sub">' + m[2].map(function (s) {
        return '<li><a href="' + s[0] + '">' + s[1] + "<span>" + s[2] + "</span></a></li>";
      }).join("") + "</ul>" : "";
      return '<li class="' + cls.trim() + '"><a href="' + m[0] + '">' + m[1] + "</a>" + sub + "</li>";
    }).join("");
    bar.innerHTML = '<div><a class="wordmark" href="index.html"><span class="wm">OS<i>i</i>V</span><span class="wl">' +
      LAB_SUBTITLE + '</span></a><button id="menubtn" aria-expanded="false">menu</button>' +
      '<nav id="mnav"><ul>' + items + "</ul></nav></div>";
    document.body.insertBefore(bar, document.body.firstChild);
    var btn = bar.querySelector("#menubtn"), nav = bar.querySelector("#mnav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });

    var footer = document.createElement("footer");
    footer.innerHTML = "OSiV · " + LAB_SUBTITLE + " · Ho Chi Minh City, Vietnam · © " + new Date().getFullYear();
    document.body.appendChild(footer);
  }

  /* ---------- banner carousel ---------- */
  function carousel() {
    var root = document.getElementById("banner");
    if (!root) return;
    var slides = root.querySelectorAll("article"), tabs = root.querySelectorAll(".bnsw li"), i = 0, timer;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("act", k === i); });
      tabs.forEach(function (t, k) { t.classList.toggle("act", k === i); });
    }
    function start() { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, 6000); }
    tabs.forEach(function (t, k) { t.addEventListener("click", function () { show(k); start(); }); });
    root.addEventListener("mouseenter", function () { clearInterval(timer); });
    root.addEventListener("mouseleave", start);
    show(0); start();
  }

  /* ---------- icons (simple glyphs drawn for this site) ---------- */
  var ICON = {
    web: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m6.9 6h-2.9a15.6 15.6 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8M12 4.1c.8 1.2 1.5 2.5 1.9 3.9h-3.8c.4-1.4 1.1-2.7 1.9-3.9M4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16M8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8m4 11.9c-.8-1.2-1.5-2.5-1.9-3.9h3.8c-.4 1.4-1.1 2.7-1.9 3.9m2.3-5.9H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4m.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6m1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z"/></svg>',
    scholar: '<svg viewBox="0 0 24 24"><path d="M12 3 1 9.5l4 2.4V17c0 2.2 3.1 4 7 4s7-1.8 7-4v-5.1l2-1.2V16h2V9.5zm0 2.3 7.2 4.2L12 13.7 4.8 9.5zM17 17c0 .9-2 2-5 2s-5-1.1-5-2v-3.9l5 3 5-3z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2M8 19H5V9.5h3zM6.5 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5M19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.8 13 12.8 14.3V19h-3V9.5h2.9v1.3a3.2 3.2 0 0 1 2.8-1.6c3 0 3.5 2 3.5 4.5z"/></svg>',
    orcid: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M8.3 17.3H6.7V8.2h1.6zM7.5 7.1a1 1 0 1 1 0-2.1 1 1 0 0 1 0 2.1m3 10.2V8.2h3.4c3.2 0 4.7 2.3 4.7 4.6 0 2.5-1.9 4.5-4.8 4.5zm1.6-1.5h1.7c2.4 0 3.1-1.7 3.1-3s-.8-3-3.1-3h-1.7z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2"/></svg>',
    researchgate: '<svg viewBox="0 0 24 24"><path d="M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1m4.6 15.8h1.9v-4h1l2.6 4h2.2l-2.9-4.3a2.8 2.8 0 0 0 1.9-2.7c0-1.8-1.3-2.8-3.3-2.8H7.6zm1.9-5.5V8.5h1.3c1 0 1.5.6 1.5 1.9s-.6 1.9-1.6 1.9zM15.5 6.2c0 1.5.7 2.3 2 2.3 1.2 0 1.9-.6 1.9-1.9v-.6h-1.8v.6h1v.1c0 .7-.4 1.2-1.1 1.2-.8 0-1.2-.6-1.2-1.7s.4-1.6 1.1-1.6c.5 0 .9.3 1 .8h.9c-.1-.9-.9-1.5-1.9-1.5-1.3 0-1.9.8-1.9 2.3"/></svg>'
  };
  ICON.facebook = '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12"/></svg>';
  var LINK_ORDER = ["web", "scholar", "linkedin", "github", "orcid", "researchgate", "facebook"];
  var LINK_TITLE = { web: "Website", scholar: "Google Scholar", linkedin: "LinkedIn", github: "GitHub", orcid: "ORCID", researchgate: "ResearchGate", facebook: "Facebook" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function safeUrl(u) {
    u = String(u || "").trim();
    if (!u) return "";
    if (/^orcid\.org|^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(u)) u = "https://orcid.org/" + u.replace(/^orcid\.org\//i, "");
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    return /^https:\/\/|^http:\/\//i.test(u) ? u : "";
  }
  function initials(name) {
    var parts = String(name).replace(/\(.*?\)/g, "").replace(/^(Dr|Mr|Ms|Prof)\.?\s+/i, "").trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();   // English order: given + family name
  }

  /* where a member's name points: OSiV profile page, else personal website, else LinkedIn, else Facebook */
  function nameLink(m) {
    if (m.profile) return String(m.profile);
    return safeUrl(m.web) || safeUrl(m.linkedin) || safeUrl(m.facebook) || "";
  }

  function card(m) {
    var home = nameLink(m);
    var ext = home && !m.profile;
    var name = home ? '<a href="' + esc(home) + '"' + (ext ? ' target="_blank" rel="nofollow noopener"' : "") + ">" + esc(m.name) + "</a>" : esc(m.name);
    var links = LINK_ORDER.filter(function (k) { return safeUrl(m[k]); }).map(function (k) {
      return '<a href="' + esc(safeUrl(m[k])) + '" title="' + LINK_TITLE[k] + '" target="_blank" rel="nofollow noopener">' + ICON[k] + "</a>";
    }).join("");
    var pic = m.photo
      ? '<button class="zoom" type="button" aria-label="Enlarge photo of ' + esc(m.name) + '"><img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy"></button>'
      : '<span class="ini" aria-hidden="true">' + esc(initials(m.name)) + "</span>";
    var desc = [m.role, m.research, m.edu].filter(Boolean)
      .map(function (x) { x = String(x).trim(); return esc(x.charAt(0).toUpperCase() + x.slice(1)); }).join(".<wbr> ");
    return '<li><div class="pic">' + pic + "</div>" +
      '<span class="nm">' + name + "</span>" +
      (links ? '<div class="social">' + links + "</div>" : "") +
      '<span class="rl">' + desc + (desc ? "." : "") + "</span></li>";
  }

  /* click a photo to see it large; Esc, a click or the close button closes it */
  function lightbox() {
    var box = document.createElement("div");
    box.className = "lightbox"; box.hidden = true;
    box.innerHTML = '<button class="lbclose" type="button" aria-label="Close">&times;</button><img alt=""><p></p>';
    document.body.appendChild(box);
    var img = box.querySelector("img"), cap = box.querySelector("p");
    function close() { box.hidden = true; document.body.classList.remove("lbopen"); }
    document.addEventListener("click", function (e) {
      var z = e.target.closest(".zoom, img.zoomable");
      if (z) {
        var src = z.tagName === "IMG" ? z : z.querySelector("img");
        img.src = src.currentSrc || src.src; img.alt = src.alt; cap.textContent = src.alt;
        box.hidden = false; document.body.classList.add("lbopen"); return;
      }
      if (!box.hidden && (e.target === box || e.target.closest(".lbclose") || e.target === img)) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) close(); });
  }

  /* one grid of cards (like siplab), ordered by group */
  function team() {
    var host = document.getElementById("people");
    if (!host || !window.OSIV_TEAM) return;
    var order = (window.OSIV_GROUPS || []).map(function (g) { return g.id; });
    var ms = window.OSIV_TEAM.slice().sort(function (x, y) { return order.indexOf(x.group) - order.indexOf(y.group); });
    host.innerHTML = '<ul class="people">' + ms.map(card).join("") + "</ul>";
  }

  function pubFilters() {
    var bar = document.getElementById("pubfilter");
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      bar.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
      var f = b.dataset.f;
      document.querySelectorAll(".pblt > li").forEach(function (li) {
        li.style.display = (f === "all" || (li.dataset.kind || "").split(" ").indexOf(f) >= 0) ? "" : "none";
      });
      document.querySelectorAll(".pubgroup").forEach(function (g) {
        var any = Array.prototype.some.call(g.querySelectorAll(".pblt > li"), function (li) { return li.style.display !== "none"; });
        g.style.display = any ? "" : "none";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    chrome();
    carousel();
    team();
    lightbox();
    pubFilters();
  });
})();
