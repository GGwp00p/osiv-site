(() => {
  "use strict";

  /* ---------- math (KaTeX, vendored locally) ---------- */
  const renderMath = () => {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(document.body, {
      delimiters: [{ left: "$$", right: "$$", display: true }],
      throwOnError: false,
    });
  };
  window.addEventListener("load", renderMath);

  /* ---------- lightbox for figures ---------- */
  const box = document.getElementById("lightbox");
  const boxImg = box.querySelector("img");
  document.querySelectorAll(".frame img").forEach((img) => {
    img.addEventListener("click", () => {
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      box.showModal();
    });
  });
  box.addEventListener("click", () => box.close());

  /* ---------- active section in nav ---------- */
  const links = [...document.querySelectorAll(".topnav li a")];
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active"));
        const a = byId.get(e.target.id);
        if (a) a.classList.add("active");
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  byId.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

  /* ---------- copy BibTeX ---------- */
  const copyBtn = document.getElementById("copyBib");
  copyBtn.addEventListener("click", async () => {
    const text = document.getElementById("bibText").innerText;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied ✓";
    } catch {
      const r = document.createRange();
      r.selectNodeContents(document.getElementById("bibText"));
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      copyBtn.textContent = "Press Ctrl+C";
    }
    setTimeout(() => (copyBtn.textContent = "Copy"), 1800);
  });

  /* ---------- interactive demo: pseudo-label fusion (Eq. 1-3) on toy 24 h profiles ---------- */
  const H = 24;
  const gauss = (h, mu, sd) => Math.exp(-0.5 * ((h - mu) / sd) ** 2);
  const norm = (v) => { const s = v.reduce((a, b) => a + b, 0); return v.map((x) => x / s); };
  const mk = (am, pm, base, wob) =>
    norm(Array.from({ length: H }, (_, h) =>
      base + am[0] * gauss(h, am[1], 1.7) + pm[0] * gauss(h, pm[1], 2.0) + wob * Math.sin(h * 1.9 + am[1])));

  // Three toy loop-detector neighbours and one noisy, biased taxi profile for a segment without a sensor.
  const loops = [
    { name: "Loop A", y: mk([1.0, 8], [1.15, 17], 0.25, 0.02) },
    { name: "Loop B", y: mk([0.8, 8.5], [1.0, 17.5], 0.3, 0.02) },
    { name: "Loop C", y: mk([0.5, 11], [0.55, 14], 0.45, 0.03) },   // dissimilar (midday-heavy)
  ];
  const taxi = mk([0.55, 7], [0.7, 20], 0.35, 0.09);                 // nightlife-biased, noisy

  const cos = (a, b) => {
    let d = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2; }
    return d / Math.sqrt(na * nb);
  };
  const sims = loops.map((l) => cos(l.y, taxi));
  const sSum = sims.reduce((a, b) => a + b, 0);
  const w = sims.map((s) => s / sSum);                                // Eq. (1)
  const pseudo = Array.from({ length: H }, (_, h) => loops.reduce((a, l, i) => a + w[i] * l.y[h], 0)); // Eq. (2)

  const slider = document.getElementById("alpha");
  const out = document.getElementById("oAlpha");
  const svg = document.getElementById("fusionChart");
  const simBox = document.getElementById("simBox");
  const fusedTxt = document.getElementById("fusedTxt");

  const W = 640, Ht = 220, m = { l: 36, r: 10, t: 10, b: 28 };
  const all = [...pseudo, ...taxi, ...loops.flatMap((l) => l.y)];
  const ymax = Math.max(...all) * 1.12;
  const X = (h) => m.l + (h / (H - 1)) * (W - m.l - m.r);
  const Y = (v) => Ht - m.b - (v / ymax) * (Ht - m.t - m.b);
  const path = (arr) => arr.map((v, h) => `${h ? "L" : "M"}${X(h).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");

  simBox.innerHTML = loops.map((l, i) =>
    `<div class="cell"><div class="ax">${l.name}</div><b>s = ${sims[i].toFixed(3)}</b><div class="term">w = ${w[i].toFixed(3)}</div></div>`).join("");

  const draw = () => {
    const a = parseFloat(slider.value);
    out.textContent = a.toFixed(2);
    const fused = pseudo.map((p, h) => a * p + (1 - a) * taxi[h]);     // fusion with coefficient alpha
    const ticks = [0, 6, 12, 18, 23].map((h) =>
      `<line class="ax" x1="${X(h)}" x2="${X(h)}" y1="${Ht - m.b}" y2="${Ht - m.b + 4}"/><text x="${X(h)}" y="${Ht - 8}" text-anchor="middle">${h}h</text>`).join("");
    svg.innerHTML = `
      <line class="ax" x1="${m.l}" x2="${W - m.r}" y1="${Ht - m.b}" y2="${Ht - m.b}"/>
      <line class="ax" x1="${m.l}" x2="${m.l}" y1="${m.t}" y2="${Ht - m.b}"/>
      <text x="4" y="${m.t + 8}">flow</text>${ticks}
      ${loops.map((l) => `<path class="l-loop" opacity=".35" d="${path(l.y)}"/>`).join("")}
      <path class="l-loop" d="${path(pseudo)}"/>
      <path class="l-taxi" d="${path(taxi)}"/>
      <path class="l-fused" d="${path(fused)}"/>`;
    const pk = fused.indexOf(Math.max(...fused));
    const pkT = taxi.indexOf(Math.max(...taxi));
    const pkP = pseudo.indexOf(Math.max(...pseudo));
    fusedTxt.innerHTML = a >= 0.99
      ? `α = 1: the fused profile equals the pseudo-label — stable, but no local deviation from the taxi data survives (peak at ${pkP}h).`
      : a <= 0.01
        ? `α = 0: only the noisy, biased taxi profile remains (peak at ${pkT}h) — exactly the signal the pseudo-label is meant to correct.`
        : `Fused peak at <b>${pk}h</b> (pseudo-label peak ${pkP}h, taxi peak ${pkT}h). The paper uses <b>α = 0.7</b>, chosen empirically from [0.6, 0.8].`;
  };
  slider.addEventListener("input", draw);
  draw();
})();

(() => {
  "use strict";

  /* ---------- sticky section headings: compact once stuck ---------- */
  const heads = [...document.querySelectorAll(".stkt")];
  const navH = 48;
  const onScroll = () => heads.forEach((h) => h.classList.toggle("stuck", h.getBoundingClientRect().top <= navH + 1));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- benchmark bars (Table 3) ---------- */
  const DATA = [
    { n: "ASTGCN", r2: 0.71, h50: 0.60, h100: 0.75 },
    { n: "DCRNN", r2: 0.74, h50: 0.64, h100: 0.74 },
    { n: "STGCN", r2: 0.76, h50: 0.68, h100: 0.74 },
    { n: "GCN", r2: 0.75, h50: 0.62, h100: 0.70 },
    { n: "GraphSAGE", r2: 0.82, h50: 0.84, h100: 0.93 },
    { n: "STGFormer", r2: 0.51, h50: 0.00, h100: 0.22 },
    { n: "Fusion-GraphSAGE (Ours)", r2: 0.81, h50: 0.88, h100: 0.97, ours: true },
    { n: "Fusion-MultiScaleGNN (Ours)", r2: 0.79, h50: 0.92, h100: 0.93, ours: true },
  ];
  const barsEl = document.getElementById("bars");
  const tabs = [...document.querySelectorAll(".tab")];
  const drawBars = (m) => {
    const rows = [...DATA].sort((a, b) => b[m] - a[m]);
    const best = rows[0][m];
    barsEl.innerHTML = rows.map((r) =>
      `<div class="bar${r.ours ? " ours" : ""}${r[m] === best ? " top" : ""}"><span class="nm">${r.n}</span>` +
      `<span class="track"><span class="fill" data-w="${r[m] * 100}"></span></span><span class="v">${r[m].toFixed(2)}</span></div>`).join("");
    requestAnimationFrame(() => requestAnimationFrame(() =>
      barsEl.querySelectorAll(".fill").forEach((f) => (f.style.width = f.dataset.w + "%"))));
  };
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => x.setAttribute("aria-pressed", String(x === t)));
    drawBars(t.dataset.metric);
  }));
  drawBars("h50");

  /* ---------- ground truth vs prediction comparison slider ---------- */
  const cmp = document.getElementById("cmp");
  if (cmp) {
    const top = cmp.querySelector(".top");
    const handle = cmp.querySelector(".handle");
    const range = cmp.querySelector("input");
    const set = (v) => {
      top.style.clipPath = `inset(0 0 0 ${v}%)`;
      handle.style.left = v + "%";
    };
    range.addEventListener("input", () => set(range.value));
    set(range.value);
  }
})();
