"use client";
import React, { useEffect, useMemo } from "react";

const RASHI_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const RASHI_SHORT = {
  Aries: "Ar", Taurus: "Ta", Gemini: "Ge", Cancer: "Cn",
  Leo: "Le", Virgo: "Vi", Libra: "Li", Scorpio: "Sc",
  Sagittarius: "Sg", Capricorn: "Cp", Aquarius: "Aq", Pisces: "Pi",
};

function toRoman(num) {
  const map = [
    [12, "XII"], [11, "XI"], [10, "X"], [9, "IX"], [8, "VIII"],
    [7, "VII"], [6, "VI"], [5, "V"], [4, "IV"], [3, "III"], [2, "II"], [1, "I"],
  ];
  for (const [n, r] of map) if (num >= n) return r;
  return String(num);
}

function signFromLongitude(lon) {
  const idx = Math.floor((((lon % 360) + 360) % 360) / 30);
  return RASHI_ORDER[idx];
}

function degInSign(lon) {
  return (((lon % 360) + 360) % 360) % 30;
}

function formatDeg(decimal) {
  const total = Math.abs(decimal);
  const d = Math.floor(total);
  const m = Math.floor((total - d) * 60);
  const s = Math.round(((total - d) * 60 - m) * 60);
  return `${d}°${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;
}

function getConclusion(strength) {
  if (strength < 27) return "SHORT";
  if (strength > 33) return "EXCESS";
  return "AVERAGE";
}

export default function AstroScriptTableThird({ data }) {
  if (!data || !data.astro_script) return null;

  const planetPositions = data.planet_position || [];
  const projectionHits = data.projection_hits || [];
  const houseCusps = data.house_cusps || [];

  useEffect(() => {
    console.log("AstroScriptTable data:", data);
  }, [data]);

  // ─── 1. BUILD HOUSE INFO LIST (ordered 1–12) ──────────────────────────────
  const houseInfoList = useMemo(() => {
    return houseCusps.map((lon, idx) => {
      const sign = signFromLongitude(lon);
      const degIn = degInSign(lon);
      const current = lon;
      const next = idx < houseCusps.length - 1 ? houseCusps[idx + 1] : houseCusps[0];
      const strength = (next - current + 360) % 360;
      return {
        house: idx + 1,
        longitude: parseFloat(lon),
        sign,
        degreeInSign: degIn,
        degreeFormatted: formatDeg(degIn),
        box: data.lordships?.[idx + 1]?.box || "",
        strength: Math.round(strength),
        conclusion: getConclusion(strength),
      };
    });
  }, [houseCusps, data.lordships]);

  // ─── 2. PLANET DEGREE MAP ─────────────────────────────────────────────────
  const planetDegMap = useMemo(() => {
    const map = {};
    planetPositions.forEach((p) => { map[p.name] = p.degree_formatted || ""; });
    return map;
  }, [planetPositions]);

  // ─── 3. PLANET → HOUSE NUMBER MAP ────────────────────────────────────────
  const planetHouseMap = useMemo(() => {
    const map = {};
    data.astro_script.forEach((row) => {
      if (row.planet && row.house != null) map[row.planet] = row.house;
    });
    return map;
  }, [data.astro_script]);

  // ─── 4. HIT MAP ───────────────────────────────────────────────────────────
  const hitMap = useMemo(() => {
    const map = { houses: {}, planets: {} };
    projectionHits.forEach((source) => {
      const src = source.source_planet;
      const srcShort = src.slice(0, 2);
      const srcHouse = planetHouseMap[src] ?? "";
      const prefix = srcHouse !== "" ? `${srcHouse} ${srcShort}` : srcShort;

      source.projections.forEach((proj) => {
        const angle = proj.angle;
        const label = `${prefix} ${angle}`;
        proj.hit_houses?.forEach((h) => {
          if (!map.houses[h.house]) map.houses[h.house] = [];
          map.houses[h.house].push(label);
        });
        proj.hit_planets?.forEach((p) => {
          if (!map.planets[p.planet]) map.planets[p.planet] = [];
          map.planets[p.planet].push(label);
        });
      });
    });
    return map;
  }, [projectionHits, planetHouseMap]);

  // ─── 5. LORDSHIP BOX MAP ──────────────────────────────────────────────────
  const houseBoxMap = useMemo(() => {
    const map = {};
    if (data.lordships) {
      Object.entries(data.lordships).forEach(([houseNum, info]) => {
        map[parseInt(houseNum)] = info.box || info.meaning || "";
      });
    }
    return map;
  }, [data.lordships]);

  // ─── 6. GROUP PLANETS BY SIGN ─────────────────────────────────────────────
  //    Only used to look up planets for a given house's sign
  const planetsByHouse = useMemo(() => {
  const map = {};
  for (let i = 1; i <= 12; i++) map[i] = [];
  data.astro_script.forEach((row) => {
    if (row.house != null) map[row.house].push(row);
  });
  return map;
}, [data.astro_script]);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  // Layout matches Image 1:
  //  Col 1: "Hits to"      — hits to the HOUSE (left side)
  //  Col 2: BOX            — house number (large, centered)
  //  Col 3: "Hits to Planet" — hits to planets IN this house's sign
  //  Col 4: Rashi          — sign abbreviation (rowSpan per house)
  //  Col 5: Pl             — planet abbreviation/name
  //  Col 6: Degree         — planet degree
  //  Col 7: Orb / extra
  //
  // Row grouping: one group per HOUSE (1–12).
  // Within each group, one row per planet in that house's sign (min 1 row).
  // House hits (col1), BOX (col2), Rashi (col4) span all rows in the group.

  return (
    <div className="w-full overflow-x-auto mt-6 text-black mb-6">
      <h2 className="text-center font-bold text-base mb-2 tracking-wide">
        SCRIPT OF CUSP KUNDLI
      </h2>

      <table
        className="min-w-full text-xs border-collapse"
        style={{ border: "1px solid #000" }}
      >
        {/* ── HEADER ── */}
        <thead>
          <tr style={{ background: "#e5e7eb" }}>
            <th style={th}>Hits to Box</th>
            <th style={{ ...th, textAlign: "center", minWidth: 40 }}>BOX</th>
            <th style={th}>Hits to Planet</th>
            <th style={{ ...th, textAlign: "center", minWidth: 45 }}>Rashi</th>
            <th style={{ ...th, minWidth: 30 }}>Pl</th>
            <th style={{ ...th, background: "#fef9c3", minWidth: 55 }}>Strength</th>
            <th style={{ ...th, background: "#fef9c3", minWidth: 65 }}>Conclusion</th>
          </tr>
        </thead>

        {/* ── BODY: iterate by house order 1→12 ── */}
        <tbody>
          {houseInfoList.map((houseInfo) => {
            const sign = houseInfo.sign;
            const planets = planetsByHouse[houseInfo.house] || [];
            // Number of rows = max(planets in this sign, 1)
            const rowCount = Math.max(planets.length, 1);

            // House-level hits (col 1)
            const houseHits = hitMap.houses[houseInfo.house] || [];

            // Conclusion color
            const conclusionColor =
              houseInfo.conclusion === "SHORT" ? "#ef4444"
              : houseInfo.conclusion === "EXCESS" ? "#f97316"
              : "#22c55e";

            return Array.from({ length: rowCount }).map((_, rowIdx) => {
              const planet = planets[rowIdx] || null;
              const isFirstRow = rowIdx === 0;

              // Planet hits (col 3) — hits TO this planet
              const planetHits = planet
                ? hitMap.planets[planet.planet] || []
                : [];

              // Planet degree (col 6)
              const degFormatted = planet ? planetDegMap[planet.planet] || "" : "";

              return (
                <tr
                  key={`house-${houseInfo.house}-row-${rowIdx}`}
                  style={{ verticalAlign: "top" }}
                >
                  {/* Col 1 — Hits to (house) — rowSpan all rows of this house */}
                  {isFirstRow && (
                    <td
                      rowSpan={rowCount}
                      style={{
                        ...td,
                        verticalAlign: "top",
                        minWidth: 80,
                        background: "#f9fafb",
                      }}
                    >
                      {houseHits.map((h, i) => (
                        <div key={i} style={{ whiteSpace: "nowrap" }}>{h}</div>
                      ))}
                    </td>
                  )}

                  {/* Col 2 — BOX number — rowSpan all rows of this house */}
                  {isFirstRow && (
  <td
    rowSpan={rowCount}
    style={{
      ...td,
      textAlign: "center",
      verticalAlign: "middle",
      fontWeight: 700,
      fontSize: 16,
      background: "#f3f4f6",
    }}
  >
    {houseInfo.house}
    {/* ADD THIS — degree like AstroScriptTable col 4 */}
    <div style={{ fontSize: 10, fontWeight: 400, color: "#6b7280", marginTop: 2 }}>
      {houseInfo.degreeFormatted}
      <span style={{ color: "black", margin: "0 2px" }}>/</span>
      {formatDeg(houseInfo.longitude)}
    </div>
  </td>
)}

                  {/* Col 3 — Hits to Planet */}
                  <td style={{ ...td, minWidth: 90 }}>
                    {planetHits.map((h, i) => (
                      <div key={i} style={{ whiteSpace: "nowrap" }}>{h}</div>
                    ))}
                  </td>

                  {/* Col 4 — Rashi — rowSpan all rows of this house */}
                  {isFirstRow && (
                    <td
                      rowSpan={rowCount}
                      style={{
                        ...td,
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontWeight: 700,
                        background: "#f3f4f6",
                        minWidth: 45,
                      }}
                    >
                      <div style={{ fontSize: 13 }}>{RASHI_SHORT[sign]}</div>
                      <div style={{ fontSize: 9, fontWeight: 400, color: "#6b7280", marginTop: 2 }}>
                        {sign}
                      </div>
                    </td>
                  )}

                  {/* Col 5 — Planet name */}
                  <td style={{ ...td, whiteSpace: "nowrap" }}>
  {planet ? (
    <>
      <span style={{ fontWeight: 600 }}>
        {planet.planet_number != null ? `${planet.planet_number} ` : ""}
        {planet.planet?.slice(0, 2).toUpperCase()}
      </span>
      {/* ADD THIS — degree formatted, same as AstroScriptTable */}
      {degFormatted ? (
        <span style={{ color: "#13100a", fontFamily: "monospace", fontSize: "1.1em" }}>
          {" "}{degFormatted}
        </span>
      ) : ""}
    </>
  ) : ""}
</td>

                  

                  {/* Col 7 — Strength (only first row) */}
                  {isFirstRow && (
                    <td
                      rowSpan={rowCount}
                      style={{
                        ...td,
                        textAlign: "center",
                        verticalAlign: "middle",
                        background: "#fefce8",
                      }}
                    >
                      {houseInfo.strength}
                    </td>
                  )}

                  {/* Col 8 — Conclusion (only first row) */}
                  {isFirstRow && (
                    <td
                      rowSpan={rowCount}
                      style={{
                        ...td,
                        textAlign: "center",
                        verticalAlign: "middle",
                        background: "#fefce8",
                        fontWeight: 600,
                        color: conclusionColor,
                      }}
                    >
                      {houseInfo.conclusion}
                    </td>
                  )}
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── INLINE STYLES ────────────────────────────────────────────────────────────
const td = {
  border: "1px solid #000",
  padding: "3px 5px",
  fontSize: 11,
  lineHeight: 1.4,
};

const th = {
  border: "1px solid #000",
  padding: "4px 5px",
  fontSize: 11,
  fontWeight: 600,
  textAlign: "left",
  lineHeight: 1.4,
};