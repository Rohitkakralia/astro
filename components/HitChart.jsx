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

// 0° Aries = top, increasing clockwise
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
    // Large enough that outside labels don't clip
    const W = 960, H = 960;
    const cx = W / 2, cy = H / 2;

    // Three concentric circles:
    // R_RASHI  = outer circle → rashi (zodiac) labels live in the band between R_RASHI and R_BOX
    // R_BOX    = box/house boundary circle → box lines go from center to here
    // R_CENTER = hub at center (just a dot reference, no circle drawn)

    const R_RASHI      = 280;   // outer zodiac ring
    const R_RASHI_INNER= 230;   // inner edge of rashi label band
    const R_BOX        = 230;   // box boundary = same as rashi inner
    const R_HUB        = 0;     // lines go from exact center
    const R_LABEL      = R_RASHI + 16; // where outside labels start

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

    // Planet → house number (from astro_script)
    const planetHouseNum = {};
    (data.astro_script || []).forEach(row => {
      if (row.planet && row.house != null) planetHouseNum[row.planet] = row.house;
    });

    // ── Which house each planet sits in ──────────────────────────────────────
    const planetsByHouse = {};
    Object.entries(planetLon).forEach(([name, lon]) => {
      if (name === "Ascendant") return;
      const h = getLonHouse(lon, cusps);
      if (!planetsByHouse[h]) planetsByHouse[h] = [];
      planetsByHouse[h].push({ name, lon });
    });

    // ── Collect hit labels per house sector ───────────────────────────────────
    // Each label: "Ab angle°" (e.g. "Su 45°")
    // Assigned to the house containing the target (planet or box)
    const houseLabels = {};
    for (let i = 1; i <= 12; i++) houseLabels[i] = [];

    (data.projection_hits || []).forEach(src => {
      const srcName = src.source_planet;
      const srcAbbr = PLANET_ABBR[srcName] || srcName.slice(0, 2);

      (src.projections || []).forEach(proj => {
        const angle = proj.angle;
        const text  = `${srcAbbr} ${angle}°`;

        // Hits to house boxes
        (proj.hit_houses || []).forEach(hh => {
          const h = hh.house;
          houseLabels[h].push(text);
        });

        // Hits to planets → assign to house containing that planet
        (proj.hit_planets || []).forEach(hp => {
          const tgtLon = planetLon[hp.planet];
          if (tgtLon == null) return;
          const h = getLonHouse(tgtLon, cusps);
          houseLabels[h].push(text);
        });
      });
    });

    // Deduplicate labels per house
    Object.keys(houseLabels).forEach(h => {
      houseLabels[h] = [...new Set(houseLabels[h])];
    });

    // ── Color palette for the 3 line types ───────────────────────────────────
    const COLOR_RASHI_CIRCLE = "#1565c0";   // blue  — outer zodiac boundary circles
    const COLOR_RASHI_LINE   = "#1976d2";   // blue  — rashi dividing lines (every 30°)
    const COLOR_BOX_CIRCLE   = "#6a1b9a";   // purple — inner box boundary circle
    const COLOR_BOX_LINE     = "#7b1fa2";   // purple — box / house cusp dividing lines
    const COLOR_HIT_LINE     = "#b71c1c";   // red    — hit / aspect projection lines

    // ── STEP 1: Draw outer rashi circle ───────────────────────────────────────
    svg.appendChild(mk("circle", {
      cx, cy, r: R_RASHI,
      fill: "none", stroke: COLOR_RASHI_CIRCLE, "stroke-width": "2",
    }));

    // ── STEP 2: Draw 12 rashi dividing lines (every 30°, fixed zodiac) ────────
    // Rashis are fixed: 0°=Aries, 30°=Taurus, ...
    for (let i = 0; i < 12; i++) {
      const deg = i * 30;
      const p1  = polar(cx, cy, 0,       deg);
      const p2  = polar(cx, cy, R_RASHI, deg);
      svg.appendChild(mk("line", {
        x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y,
        stroke: COLOR_RASHI_LINE, "stroke-width": "1.2",
      }));
    }

    // ── STEP 3: Rashi labels in the outer band ────────────────────────────────
    for (let i = 0; i < 12; i++) {
      const midDeg = i * 30 + 15; // midpoint of each rashi
      const sp     = polar(cx, cy, (R_RASHI + R_RASHI_INNER) / 2, midDeg);

      svg.appendChild(mk("text", {
        x: sp.x, y: sp.y,
        "text-anchor": "middle", "dominant-baseline": "central",
        "font-size": "11", "font-weight": "600",
        "font-family": "Arial,sans-serif", fill: COLOR_RASHI_LINE,
        transform: `rotate(${midDeg}, ${sp.x}, ${sp.y})`,
      }, SIGN_DISPLAY[i]));
    }

    // ── STEP 4: Inner circle (box boundary) ───────────────────────────────────
    svg.appendChild(mk("circle", {
      cx, cy, r: R_RASHI_INNER,
      fill: "none", stroke: COLOR_BOX_CIRCLE, "stroke-width": "2",
    }));

    // ── STEP 5: BOX lines — from center to R_BOX at each house cusp ──────────
    for (let i = 0; i < 12; i++) {
      const deg = cusps[i];
      const p1  = polar(cx, cy, 0,      deg);
      const p2  = polar(cx, cy, R_BOX,  deg);
      svg.appendChild(mk("line", {
        x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y,
        stroke: COLOR_BOX_LINE, "stroke-width": "1.6",
      }));
    }

    // ── STEP 6: House numbers and planet names inside boxes ───────────────────
    for (let i = 0; i < 12; i++) {
      const hNum     = i + 1;
      const startDeg = cusps[i];
      const endDeg   = cusps[(i + 1) % 12];
      const mid      = midAngle(startDeg, endDeg);

      // House number in small circle
      const hRad = R_BOX * 0.72;
      const hp   = polar(cx, cy, hRad, mid);
      svg.appendChild(mk("circle", { cx:hp.x, cy:hp.y, r:14, fill:"#fffdf5", stroke:"#888", "stroke-width":"0.8" }));
      svg.appendChild(mk("text", {
        x:hp.x, y:hp.y,
        "text-anchor":"middle", "dominant-baseline":"central",
        "font-size":"11", "font-weight":"700",
        "font-family":"Georgia,serif", fill:"#222",
      }, String(hNum)));

      // Planet abbreviations in this house
      const planets = planetsByHouse[hNum] || [];
      const n       = planets.length;
      planets.forEach((p, pi) => {
        const abbr   = PLANET_ABBR[p.name] || p.name.slice(0, 2);
        const angOff = n === 1 ? 0 : (pi - (n - 1) / 2) * 8;
        const pRad   = R_BOX * 0.45;
        const lp     = polar(cx, cy, pRad, mid + angOff);
        svg.appendChild(mk("text", {
          x:lp.x, y:lp.y,
          "text-anchor":"middle", "dominant-baseline":"central",
          "font-size":"12", "font-weight":"700",
          "font-family":"Arial,sans-serif", fill:"#111",
        }, abbr));
      });
    }

    // ── STEP 7: HIT LINES from center outward ─────────────────────────────────
    // For each hit (planet→planet or planet→house), draw a line from center
    // to the OUTER circle edge (R_RASHI) at the target longitude.
    // Target longitude = the projected longitude (source + angle)
    // This makes lines go from center to the edge like spokes showing where hits land.

    // We draw lines at the PROJECTED longitude (= source longitude + aspect angle)
    // so each line points to where the aspect energy lands.

    const drawnHitLines = new Set();

    (data.projection_hits || []).forEach(src => {
      const srcName = src.source_planet;
      const srcLon  = planetLon[srcName];
      if (srcLon == null) return;

      (src.projections || []).forEach(proj => {
        const angle       = proj.angle;
        const projLon     = normalize(srcLon + angle);
        const lineKey     = `${Math.round(projLon)}`;

        // Only draw one line per unique projected longitude (to avoid overdraw)
        if (drawnHitLines.has(lineKey)) return;
        drawnHitLines.add(lineKey);

        // Only draw if there's actually something hit
        const hasHit = (proj.hit_planets?.length > 0) || (proj.hit_houses?.length > 0);
        if (!hasHit) return;

        const R_HIT_START = 0;    // still from center
        const R_HIT_END   = 340;  // was R_RASHI=280, now extends 60px beyond the outer ring

        const p1 = polar(cx, cy, R_HIT_START, projLon);
        const p2 = polar(cx, cy, R_HIT_END,   projLon);
        svg.appendChild(mk("line", {
          x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y,
          stroke: "black",
          "stroke-width": "1.4",   // was 0.9 or 1.2
          opacity: "0.8",
        }));
      });
    });

    // ── STEP 8: Hit labels OUTSIDE the circle ─────────────────────────────────
    // Per house sector: stack labels radially outward from R_LABEL
    for (let i = 0; i < 12; i++) {
      const hNum     = i + 1;
      const startDeg = cusps[i];
      const endDeg   = cusps[(i + 1) % 12];
      const mid      = midAngle(startDeg, endDeg);

      const labels = houseLabels[hNum] || [];
      if (labels.length === 0) continue;

      labels.forEach((lbl, li) => {
        const r  = R_LABEL + li * 14;
        const lp = polar(cx, cy, r, mid);

        svg.appendChild(mk("text", {
          x: lp.x, y: lp.y,
          "text-anchor": "middle", "dominant-baseline": "central",
          "font-size": "14", "font-weight": "600",
          "font-family": "Arial,sans-serif", fill: "#111",
          transform: `rotate(${mid}, ${lp.x}, ${lp.y})`,
        }, lbl));
      });
    }

    // ── Title ─────────────────────────────────────────────────────────────────
    svg.appendChild(mk("text", {
      x:cx, y:18,
      "text-anchor":"middle",
      "font-size":"13", "font-weight":"600",
      "font-family":"Arial,sans-serif", fill:"#222",
    }, "Planet Hits on Planets and Boxes (Life Contexts)"));

    // ── Centre watermark ──────────────────────────────────────────────────────
    svg.appendChild(mk("text", {
      x:cx, y:cy,
      "text-anchor":"middle", "dominant-baseline":"central",
      "font-size":"8", "font-family":"Arial,sans-serif", fill:"#ccc",
    }, "©2020 Dr. Khushdeep Bansal"));

    

  }, [data]);

  if (!data) return null;

  return (
    <div style={{ textAlign:"center", width:"100%", background:"#fffdf5", borderRadius:8 }}>
      <svg
        ref={svgRef}
        viewBox="0 0 960 960"
        width="100%"
        style={{ maxWidth:960, display:"block", margin:"0 auto" }}
      />
    </div>
  );
}