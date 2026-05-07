"use client";
import React, { useEffect, useRef } from "react";

const PLANET_ABBR = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa",
  Rahu: "Ra", Ketu: "Ke", Ascendant: "As", Lagna: "As",
};

const ANGLE_COLOR = {
  0:   "#d32f2f",
  30:  "#90a4ae",
  45:  "#f06292",
  60:  "#388e3c",
  90:  "#f57c00",
  120: "#1976d2",
  135: "#ab47bc",
  150: "#795548",
  180: "#7b1fa2",
};

function angleColor(angle) {
  const key = Object.keys(ANGLE_COLOR).find(k => Math.abs(Number(k) - angle) < 1);
  return key ? ANGLE_COLOR[key] : "#999";
}

function normalize(d) {
  return ((parseFloat(d) % 360) + 360) % 360;
}

function polarToXY(cx, cy, r, lonDeg) {
  const rad = (lonDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function extractLon(p) {
  const raw = p.absolute_longitude ?? p.longitude ?? p.lon ?? p.degree ?? null;
  if (raw == null) return null;
  const val = parseFloat(raw);
  return isNaN(val) ? null : normalize(val);
}

function extractName(p) {
  return p.planet || p.name || p.Planet || p.Name || null;
}

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

    const W = 520, H = 520;
    const cx = W / 2, cy = H / 2;
    const R       = 200;  // outer zodiac ring
    const Rinner  = 168;  // inner ring (aspect line endpoints)
    const Rplanet = 184;  // planet dot
    const Rlabel  = 214;  // base label radius (outside outer ring)

    svg.appendChild(mk("rect", { x: 0, y: 0, width: W, height: H, fill: "#fffef9" }));

    // Outer zodiac circle
    svg.appendChild(mk("circle", { cx, cy, r: R, fill: "none", stroke: "#8b6914", "stroke-width": "2" }));

    // Inner aspect circle
    svg.appendChild(mk("circle", { cx, cy, r: Rinner, fill: "#f5f5f0", stroke: "#ccc", "stroke-width": "1" }));

    // 12 zodiac division lines + rashi numbers
    for (let i = 0; i < 12; i++) {
      const deg = i * 30;
      const p1 = polarToXY(cx, cy, Rinner, deg);
      const p2 = polarToXY(cx, cy, R, deg);
      svg.appendChild(mk("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: "#bbb", "stroke-width": "1" }));

      const midDeg = deg + 15;
      const lp = polarToXY(cx, cy, (R + Rinner) / 2, midDeg);
      svg.appendChild(mk("text", {
        x: lp.x, y: lp.y,
        "text-anchor": "middle", "dominant-baseline": "central",
        "font-size": "11", "font-weight": "600", "font-family": "Arial, sans-serif", fill: "#8b6914",
      }, String(i + 1)));
    }

    // ── Build planetLonMap ────────────────────────────────────────────────────
    const planetLonMap = {};

    (data.planet_position || []).forEach(p => {
      const name = extractName(p);
      if (!name || name === "Ascendant" || name === "Lagna") return;
      const lon = extractLon(p);
      if (lon != null) planetLonMap[name] = lon;
    });

    // Fallback: astro_script sign + degree_in_sign
    const RASHI_ORDER = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
                         "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    (data.astro_script || []).forEach(row => {
      const name = row.planet;
      if (!name || planetLonMap[name] != null) return;
      const signIdx = RASHI_ORDER.indexOf(row.sign);
      if (signIdx === -1) return;
      const degInSign = parseFloat(row.degree_in_sign ?? row.degree ?? 0);
      if (!isNaN(degInSign)) planetLonMap[name] = normalize(signIdx * 30 + degInSign);
    });

    // Ascendant from house_cusps[0]
    if (data.house_cusps?.[0] != null) {
      planetLonMap["Ascendant"] = normalize(data.house_cusps[0]);
    }

    // ── Planet house map ──────────────────────────────────────────────────────
    const planetHouseMap = { Ascendant: 1 };
    (data.astro_script || []).forEach(row => {
      if (row.planet && row.house != null) planetHouseMap[row.planet] = row.house;
    });

    // ── Aspect lines from projection_hits ────────────────────────────────────
    const aspectLines = [];
    const seenKeys = new Set();

    (data.projection_hits || []).forEach(source => {
      const srcName = source.source_planet;
      const srcLon  = planetLonMap[srcName];
      if (srcLon == null) return;

      (source.projections || []).forEach(proj => {
        const angle = proj.angle;
        const color = angleColor(angle);
        (proj.hit_planets || []).forEach(hp => {
          const targetLon = planetLonMap[hp.planet];
          if (targetLon == null) return;
          const key = [srcName, hp.planet, angle].sort().join("|");
          if (seenKeys.has(key)) return;
          seenKeys.add(key);
          aspectLines.push({ fromLon: srcLon, toLon: targetLon, color });
        });
      });
    });

    // Draw aspect lines
    aspectLines.forEach(line => {
      const p1 = polarToXY(cx, cy, Rinner, line.fromLon);
      const p2 = polarToXY(cx, cy, Rinner, line.toLon);
      svg.appendChild(mk("line", {
        x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
        stroke: line.color, "stroke-width": "1.5", opacity: "0.8",
      }));
    });

    // ── Draw planets with collision-aware label spreading ─────────────────────
    // Sort by longitude
    const planetEntries = Object.entries(planetLonMap)
      .map(([name, lon]) => ({ name, lon, abbr: PLANET_ABBR[name] || name.slice(0, 2), houseNum: planetHouseMap[name] }))
      .sort((a, b) => a.lon - b.lon);

    // Cluster planets within 10° of each other
    const CLUSTER_DEG = 10;
    const clusters = [];
    planetEntries.forEach(p => {
      const last = clusters[clusters.length - 1];
      const lastLon = last ? last[last.length - 1].lon : null;
      const diff = lastLon != null
        ? Math.min(Math.abs(p.lon - lastLon), 360 - Math.abs(p.lon - lastLon))
        : 999;
      if (last && diff <= CLUSTER_DEG) {
        last.push(p);
      } else {
        clusters.push([p]);
      }
    });

    clusters.forEach(cluster => {
      const n = cluster.length;
      // Mean lon of cluster for centering spread
      const meanLon = cluster.reduce((s, p) => s + p.lon, 0) / n;

      cluster.forEach((p, i) => {
        const label = p.houseNum != null ? `${p.houseNum} ${p.abbr}` : p.abbr;

        // Spread dots evenly around mean lon: e.g. 3 planets => -2.5°, 0°, +2.5°
        const spreadLon = n > 1 ? meanLon + (i - (n - 1) / 2) * 3 : p.lon;

        const dotPos   = polarToXY(cx, cy, Rplanet, spreadLon);
        // Each stacked label pushed 16px further out
        const labelR   = Rlabel + i * 16;
        const labelPos = polarToXY(cx, cy, labelR, spreadLon);

        // Leader line from dot to label when stacked
        if (n > 1) {
          svg.appendChild(mk("line", {
            x1: dotPos.x, y1: dotPos.y,
            x2: labelPos.x, y2: labelPos.y,
            stroke: "#bbb", "stroke-width": "0.8", "stroke-dasharray": "2 2",
          }));
        }

        // Dot
        svg.appendChild(mk("circle", {
          cx: dotPos.x, cy: dotPos.y, r: "4",
          fill: "#1a1a2e", stroke: "#fff", "stroke-width": "1.5",
        }));

        // Label
        svg.appendChild(mk("text", {
          x: labelPos.x, y: labelPos.y,
          "text-anchor": "middle", "dominant-baseline": "central",
          "font-size": "10", "font-weight": "700",
          "font-family": "Arial, sans-serif", fill: "#1a1a2e",
        }, label));
      });
    });

    // ── Legend ────────────────────────────────────────────────────────────────
    const legendEntries = [
      { angle: 0,   label: "Conj"  },
      { angle: 60,  label: "Sext"  },
      { angle: 90,  label: "Sq"    },
      { angle: 120, label: "Trine" },
      { angle: 180, label: "Opp"   },
    ];
    legendEntries.forEach(({ angle, label }, i) => {
      const lx = 14, ly = 18 + i * 18;
      svg.appendChild(mk("line", { x1: lx, y1: ly, x2: lx + 22, y2: ly, stroke: ANGLE_COLOR[angle], "stroke-width": "2.5" }));
      svg.appendChild(mk("text", {
        x: lx + 28, y: ly, "dominant-baseline": "central",
        "font-size": "9.5", "font-family": "Arial, sans-serif", fill: "#444",
      }, `${label} ${angle}°`));
    });

    // Centre label
    svg.appendChild(mk("text", {
      x: cx, y: cy - 8, "text-anchor": "middle",
      "font-size": "11", "font-family": "Georgia, serif", fill: "#8b6914", opacity: "0.8",
    }, "WESTERN"));
    svg.appendChild(mk("text", {
      x: cx, y: cy + 8, "text-anchor": "middle",
      "font-size": "11", "font-family": "Georgia, serif", fill: "#8b6914", opacity: "0.8",
    }, "HIT CHART"));

  }, [data]);

  if (!data) return null;

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 550"
        width="100%"
        style={{ maxWidth: 700, display: "block", margin: "0 auto" }}
      />
    </div>
  );
}