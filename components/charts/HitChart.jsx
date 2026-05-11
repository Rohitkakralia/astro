"use client";
import React, { useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PLANET_ABBR = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa",
  Rahu: "Ra", Ketu: "Ke", Ascendant: "As", Lagna: "As",
};

const RASHI_ORDER = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

const SIGN_DISPLAY = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Saggi","Capri","Aqua","Pisces",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalize(d) { return ((parseFloat(d) % 360) + 360) % 360; }

function polar(cx, cy, r, lonDeg) {
  const rad = (lonDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function midAngle(a, b) {
  let sweep = b - a;
  if (sweep < 0) sweep += 360;
  return normalize(a + sweep / 2);
}

function getLonHouse(lon, cusps) {
  for (let i = 0; i < 12; i++) {
    const s = cusps[i], e = cusps[(i + 1) % 12];
    const inside = e > s ? (lon >= s && lon < e) : (lon >= s || lon < e);
    if (inside) return i + 1;
  }
  return 1;
}

function extractLon(p) {
  const raw = p.absolute_longitude ?? p.longitude ?? p.lon ?? p.degree ?? null;
  if (raw == null) return null;
  const v = parseFloat(raw);
  return isNaN(v) ? null : normalize(v);
}

function extractPlanetName(p) {
  return p.planet || p.name || p.Planet || p.Name || null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WesternHitChart({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = svgRef.current;
    svg.innerHTML = "";
    const NS = "http://www.w3.org/2000/svg";

    const mk = (tag, attrs, text) => {
      const el = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
      if (text !== undefined) el.textContent = text;
      return el;
    };

    // ── Canvas & Radii ────────────────────────────────────────────────────────
    const W = 960, H = 960;
    const cx = W / 2, cy = H / 2;

    const R_RASHI       = 380;  // outer zodiac ring circle
    const R_RASHI_INNER = 320;  // inner edge of rashi band = outer edge of box area
    const R_BOX         = 320;  // box/house boundary (same as R_RASHI_INNER)
    const R_HIT_END     = 440;  // hit lines extend beyond outer circle
    const R_LABEL_START = R_RASHI + 20; // where outside hit labels start (400)
    const LABEL_STEP    = 16;   // px between stacked labels radially

    // Derived positions inside the box area (0 → R_BOX = 320)
    const R_HOUSE_NUM   = R_BOX * 0.76;  // ≈ 243 — house number circles
    const R_PLANET      = R_BOX * 0.50;  // ≈ 160 — planet abbreviations
    const R_PLANET_INNER= R_BOX * 0.30;  // ≈ 96  — second row planets (if crowded)

    // ── Colors ────────────────────────────────────────────────────────────────
    const COLOR_RASHI_CIRCLE = "#1565c0";  // blue  — outer zodiac boundary circles
    const COLOR_RASHI_LINE   = "#1976d2";  // blue  — rashi dividing lines (every 30°)
    const COLOR_RASHI_TEXT   = "#1565c0";  // blue  — rashi sign labels
    const COLOR_BOX_CIRCLE   = "#6a1b9a";  // purple — inner box boundary circle
    const COLOR_BOX_LINE     = "#7b1fa2";  // purple — box / house cusp dividing lines
    const COLOR_HIT_LINE     = "#111111";  // red   — hit / aspect projection lines
    const COLOR_HIT_LABEL    = "#111111";  // red   — hit labels outside circle
    const COLOR_PLANET_TEXT  = "#111111";  // dark  — planet abbreviations
    const COLOR_HOUSE_NUM    = "#222222";  // dark  — house numbers

    // ── Background ────────────────────────────────────────────────────────────
    svg.appendChild(mk("rect", { x:0, y:0, width:W, height:H, fill:"#fffdf5" }));

    // ── Build planet longitude map ────────────────────────────────────────────
    const planetLon = {};
    (data.planet_position || []).forEach(p => {
      const name = extractPlanetName(p);
      if (!name || name === "Ascendant" || name === "Lagna") return;
      const lon = extractLon(p);
      if (lon != null) planetLon[name] = lon;
    });

    // Fallback via astro_script
    (data.astro_script || []).forEach(row => {
      const name = row.planet;
      if (!name || planetLon[name] != null) return;
      const si = RASHI_ORDER.indexOf(row.sign);
      if (si === -1) return;
      const deg = parseFloat(row.degree_in_sign ?? row.degree ?? 0);
      if (!isNaN(deg)) planetLon[name] = normalize(si * 30 + deg);
    });

    // Ascendant
    const ascLon = data.house_cusps?.[0] != null ? normalize(data.house_cusps[0]) : null;
    if (ascLon != null) planetLon["Ascendant"] = ascLon;

    // ── House cusps ───────────────────────────────────────────────────────────
    const cusps = data.house_cusps
      ? data.house_cusps.map(c => normalize(c))
      : Array.from({ length: 12 }, (_, i) => i * 30);

    // ── Which house each planet sits in ──────────────────────────────────────
    const planetsByHouse = {};
    Object.entries(planetLon).forEach(([name, lon]) => {
      if (name === "Ascendant") return;
      const h = getLonHouse(lon, cusps);
      if (!planetsByHouse[h]) planetsByHouse[h] = [];
      planetsByHouse[h].push({ name, lon });
    });

    // ── Collect hit labels per house sector ───────────────────────────────────
    // ── Collect hit labels per house sector ───────────────────────────────────
const houseLabels = {};
for (let i = 1; i <= 12; i++) houseLabels[i] = [];

(data.projection_hits || []).forEach(src => {
  const srcName = src.source_planet;
  const srcAbbr = PLANET_ABBR[srcName] || srcName.slice(0, 2);

  (src.projections || []).forEach(proj => {
    const angle = proj.angle;

    // Hits to house boxes — format: "(H3) Sa 90°"
    (proj.hit_houses || []).forEach(hh => {
      const text = `(H${hh.house}) ${srcAbbr} ${angle}°`;
      houseLabels[hh.house].push(text);
    });

    // Hits to planets — format: "(Ke) Sa 90°"
    (proj.hit_planets || []).forEach(hp => {
      const tgtLon = planetLon[hp.planet];
      if (tgtLon == null) return;
      const tgtAbbr = PLANET_ABBR[hp.planet] || hp.planet.slice(0, 2);
      const h = getLonHouse(tgtLon, cusps);
      const text = `(${tgtAbbr}) ${srcAbbr} ${angle}°`;
      houseLabels[h].push(text);
    });
  });
});

    // Deduplicate labels per house
    Object.keys(houseLabels).forEach(h => {
      houseLabels[h] = [...new Set(houseLabels[h])];
    });

    // ═════════════════════════════════════════════════════════════════════════
    // DRAW ORDER (back → front)
    // ═════════════════════════════════════════════════════════════════════════

    // ── 1. Outer rashi circle (BLUE) ──────────────────────────────────────────
    svg.appendChild(mk("circle", {
      cx, cy, r: R_RASHI,
      fill: "none", stroke: COLOR_RASHI_CIRCLE, "stroke-width": "2",
    }));

    // ── 2. Rashi dividing lines every 30° (BLUE, full length center→outer) ───
    for (let i = 0; i < 12; i++) {
      const deg = i * 30;
      const p1  = polar(cx, cy, 0,       deg);
      const p2  = polar(cx, cy, R_RASHI, deg);
      svg.appendChild(mk("line", {
        x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y,
        stroke: COLOR_RASHI_LINE, "stroke-width": "1.2",
      }));
    }

    // ── 3. Rashi sign labels in outer band ───────────────────────────────────
    for (let i = 0; i < 12; i++) {
      const midDeg = i * 30 + 15;
      const r      = (R_RASHI + R_RASHI_INNER) / 2;  // ≈ 350
      const sp     = polar(cx, cy, r, midDeg);

      svg.appendChild(mk("text", {
        x: sp.x, y: sp.y,
        "text-anchor": "middle", "dominant-baseline": "central",
        "font-size": "13", "font-weight": "700",
        "font-family": "Arial,sans-serif", fill: COLOR_RASHI_TEXT,
        transform: `rotate(${midDeg}, ${sp.x}, ${sp.y})`,
      }, SIGN_DISPLAY[i]));
    }

    // ── 4. Inner box boundary circle (PURPLE) ────────────────────────────────
    svg.appendChild(mk("circle", {
      cx, cy, r: R_BOX,
      fill: "none", stroke: COLOR_BOX_CIRCLE, "stroke-width": "2",
    }));

    // ── 5. Box / house cusp lines (PURPLE, center → R_BOX) ───────────────────
    for (let i = 0; i < 12; i++) {
      const deg = cusps[i];
      const p1  = polar(cx, cy, 0,     deg);
      const p2  = polar(cx, cy, R_BOX, deg);
      svg.appendChild(mk("line", {
        x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y,
        stroke: COLOR_BOX_LINE, "stroke-width": "1.8",
      }));
    }

    // ── 6. Hit lines (RED, center → beyond outer circle) ─────────────────────
    const drawnHitLines = new Set();

    (data.projection_hits || []).forEach(src => {
      const srcName = src.source_planet;
      const srcLon  = planetLon[srcName];
      if (srcLon == null) return;

      (src.projections || []).forEach(proj => {
        const angle   = proj.angle;
        const projLon = normalize(srcLon + angle);
        const lineKey = String(Math.round(projLon * 10)); // 0.1° precision key

        if (drawnHitLines.has(lineKey)) return;

        const hasHit = (proj.hit_planets?.length > 0) || (proj.hit_houses?.length > 0);
        if (!hasHit) return;

        drawnHitLines.add(lineKey);

        const p1 = polar(cx, cy, 0,          projLon);
        const p2 = polar(cx, cy, R_HIT_END,  projLon);
        svg.appendChild(mk("line", {
          x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y,
          stroke: COLOR_HIT_LINE, "stroke-width": "1.4", opacity: "0.85",
        }));
      });
    });

    // ── 7. House numbers & planet names (drawn last so they sit on top) ───────
    for (let i = 0; i < 12; i++) {
      const hNum     = i + 1;
      const startDeg = cusps[i];
      const endDeg   = cusps[(i + 1) % 12];
      const mid      = midAngle(startDeg, endDeg);

      // House number circle — positioned at 76% of box radius
      const hp = polar(cx, cy, R_HOUSE_NUM, mid);
      svg.appendChild(mk("circle", {
        cx: hp.x, cy: hp.y, r: 16,
        fill: "#fffdf5", stroke: "#999", "stroke-width": "1",
      }));
      svg.appendChild(mk("text", {
        x: hp.x, y: hp.y,
        "text-anchor": "middle", "dominant-baseline": "central",
        "font-size": "12", "font-weight": "700",
        "font-family": "Georgia,serif", fill: COLOR_HOUSE_NUM,
      }, String(hNum)));

      // Planet abbreviations — positioned at 50% of box radius
      const planets = planetsByHouse[hNum] || [];
      const n       = planets.length;

      planets.forEach((p, pi) => {
        const abbr = PLANET_ABBR[p.name] || p.name.slice(0, 2);

        // For >3 planets, alternate inner/outer radius to avoid overlap
        const rPlanet = (n <= 3)
          ? R_PLANET
          : (pi % 2 === 0 ? R_PLANET : R_PLANET_INNER);

        // Angular offset spreads planets within the sector
        const totalSpread = Math.min(n * 7, 20); // max ±20°
        const angOff = n === 1 ? 0 : (pi - (n - 1) / 2) * (totalSpread / (n - 1));

        const lp = polar(cx, cy, rPlanet, mid + angOff);

        // White halo behind text for readability over lines
        svg.appendChild(mk("text", {
          x: lp.x, y: lp.y,
          "text-anchor": "middle", "dominant-baseline": "central",
          "font-size": "13", "font-weight": "700",
          "font-family": "Arial,sans-serif",
          fill: "white", stroke: "white", "stroke-width": "3",
          "paint-order": "stroke",
        }, abbr));

        svg.appendChild(mk("text", {
          x: lp.x, y: lp.y,
          "text-anchor": "middle", "dominant-baseline": "central",
          "font-size": "13", "font-weight": "700",
          "font-family": "Arial,sans-serif", fill: COLOR_PLANET_TEXT,
        }, abbr));
      });
    }

    // ── 8. Hit labels OUTSIDE the outer circle ────────────────────────────────
    // Stacked radially outward per house sector midpoint
    for (let i = 0; i < 12; i++) {
      const hNum     = i + 1;
      const startDeg = cusps[i];
      const endDeg   = cusps[(i + 1) % 12];
      const mid      = midAngle(startDeg, endDeg);

      const labels = houseLabels[hNum] || [];
      if (labels.length === 0) continue;

      labels.forEach((lbl, li) => {
        const r  = R_LABEL_START + li * LABEL_STEP;
        const lp = polar(cx, cy, r, mid);

        // White halo for readability
        svg.appendChild(mk("text", {
          x: lp.x, y: lp.y,
          "text-anchor": "middle", "dominant-baseline": "central",
          "font-size": "10", "font-weight": "700",
          "font-family": "Arial,sans-serif",
          fill: "white", stroke: "white", "stroke-width": "2.5",
          "paint-order": "stroke",
          transform: `rotate(${mid}, ${lp.x}, ${lp.y})`,
        }, lbl));

        svg.appendChild(mk("text", {
          x: lp.x, y: lp.y,
          "text-anchor": "middle", "dominant-baseline": "central",
          "font-size": "10", "font-weight": "700",
          "font-family": "Arial,sans-serif", fill: COLOR_HIT_LABEL,
          transform: `rotate(${mid}, ${lp.x}, ${lp.y})`,
        }, lbl));
      });
    }

    // ── 9. Title ──────────────────────────────────────────────────────────────
    svg.appendChild(mk("text", {
      x: cx, y: 22,
      "text-anchor": "middle",
      "font-size": "14", "font-weight": "700",
      "font-family": "Arial,sans-serif", fill: "#222",
    }, "Planet Hits on Planets and Boxes (Life Contexts)"));

    // ── 10. Centre watermark ──────────────────────────────────────────────────
    svg.appendChild(mk("text", {
      x: cx, y: cy - 8,
      "text-anchor": "middle", "dominant-baseline": "central",
      "font-size": "9", "font-family": "Arial,sans-serif", fill: "#ddd",
    }, "©2020 Dr. Khushdeep Bansal"));
    svg.appendChild(mk("text", {
      x: cx, y: cy + 8,
      "text-anchor": "middle", "dominant-baseline": "central",
      "font-size": "8", "font-family": "Arial,sans-serif", fill: "#ddd",
    }, "www.mahavastu.com"));

    // ── 11. Color legend ──────────────────────────────────────────────────────
    const legend = [
      { color: COLOR_RASHI_LINE, label: "Rashi dividing lines" },
      { color: COLOR_BOX_LINE,   label: "Box / house cusp lines" },
      { color: COLOR_HIT_LINE,   label: "Hit / aspect lines" },
    ];
    legend.forEach(({ color, label }, i) => {
      const lx = 14, ly = H - 56 + i * 18;
      svg.appendChild(mk("line", { x1:lx, y1:ly, x2:lx+24, y2:ly, stroke:color, "stroke-width":"2.5" }));
      svg.appendChild(mk("text", {
        x: lx + 30, y: ly,
        "dominant-baseline": "central",
        "font-size": "10", "font-family": "Arial,sans-serif", fill: "#444",
      }, label));
    });

  }, [data]);

  if (!data) return null;

  return (
    <div style={{ textAlign:"center", width:"100%", background:"#fffdf5", borderRadius:8 }}>
      <svg
        ref={svgRef}
        viewBox="0 0 960 960"
        width="100%"
        style={{ display:"block", margin:"0 auto" }}
      />
    </div>
  );
}