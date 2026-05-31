
"use client";
import React, { useEffect, useMemo } from "react";

const RASHI_ORDER = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const RASHI_SHORT = {
  Aries: "Ar",
  Taurus: "Ta",
  Gemini: "Ge",
  Cancer: "Cn",
  Leo: "Le",
  Virgo: "Vi",
  Libra: "Li",
  Scorpio: "Sc",
  Sagittarius: "Sg",
  Capricorn: "Cp",
  Aquarius: "Aq",
  Pisces: "Pi",
};

function toRoman(num) {
  const map = [
    [12, "XII"],
    [11, "XI"],
    [10, "X"],
    [9, "IX"],
    [8, "VIII"],
    [7, "VII"],
    [6, "VI"],
    [5, "V"],
    [4, "IV"],
    [3, "III"],
    [2, "II"],
    [1, "I"],
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

export default function AstroScriptTable({ data }) {
  // ✅ ALL hooks must come before any return
  
  const planetPositions = data?.planet_position || [];
  const projectionHits = data?.projection_hits || [];
  const houseCusps = data?.house_cusps || [];

  useEffect(() => {
    console.log("AstroScriptTable data:", planetPositions, projectionHits, houseCusps);
  }, [data]);

  const houseInfoList = useMemo(() => {
    if (!houseCusps.length) return [];
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
        box: data?.lordships?.[idx + 1]?.box || "",
        strength: Math.round(strength),
        conclusion: getConclusion(strength),
      };
    });
  }, [houseCusps, data?.lordships]);

  const planetsByHouse = useMemo(() => {
    const map = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    data?.astro_script?.forEach((row) => {
      if (row.house != null) map[row.house].push(row);
    });
    return map;
  }, [data?.astro_script]);

  const planetDegMap = useMemo(() => {
    const map = {};
    planetPositions.forEach((p) => { map[p.name] = p.degree_formatted || ""; });
    return map;
  }, [planetPositions]);

  const planetHouseMap = useMemo(() => {
    const map = {};
    data?.astro_script?.forEach((row) => {
      if (row.planet && row.house != null) map[row.planet] = row.house;
    });
    return map;
  }, [data?.astro_script]);

  const hitMap = useMemo(() => {
    const map = { houses: {}, planets: {} };
    projectionHits.forEach((source) => {
      const src = source.source_planet;
      const srcShort = src.slice(0, 2);
      const srcHouse = planetHouseMap[src] ?? "";
      const prefix = srcHouse !== "" ? `${srcHouse} ${srcShort}` : srcShort;
      source.projections.forEach((proj) => {
        const label = `${prefix} ${proj.angle}`;
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

  const houseBoxMap = useMemo(() => {
    const map = {};
    if (data?.lordships) {
      Object.entries(data.lordships).forEach(([houseNum, info]) => {
        map[parseInt(houseNum)] = info.box || info.meaning || "";
      });
    }
    return map;
  }, [data?.lordships]);

  // ✅ Early return AFTER all hooks
  if (!data || !data.astro_script) return null;
  // ─── RENDER ───────────────────────────────────────────────────────────────
  // Outer loop: houses 1–12 (houseInfoList is already sorted by house index)
  // Inner loop: planets whose sign matches this house's sign
  return (
    <div className="w-full overflow-x-auto mt-6 text-black mb-6">
    

      <table
        className="min-w-full text-xs border-collapse"
        style={{ border: "1px solid #000" }}
      >
        {/* ── HEADER ── */}
        <thead>
          <tr style={{ background: "#e5e7eb" }}>
            <th style={th}>
              1<br />
              <span style={thSub}>Planets</span>
            </th>
            <th style={th}>
              2<br />
              <span style={thSub}>Hit From</span>
            </th>
            <th style={{ ...th, background: "#d1d5db", textAlign: "center" }}>
              3<br />
              <span style={thSub}>Box (Life Context)</span>
            </th>
            <th style={th}>
              4<br />
              <span style={thSub}>Deg</span>
            </th>
            <th style={th}>
              5<br />
              
              <span style={thSub}>Signs</span>
            </th>
            <th style={{ ...th, background: "#fef9c3" }}>
              6<br />
              <span style={thSub}>Strength</span>
            </th>
            <th style={{ ...th, background: "#fef9c3" }}>
              7<br />
              <span style={thSub}>Conclusion</span>
            </th>
            <th style={th}>
              8<br />
              <span style={thSub}>Hit From</span>
            </th>
          </tr>
        </thead>

        {/* ── BODY: iterate by house order 1→12 ── */}
        <tbody>
          {houseInfoList.map((houseInfo) => {
            const sign = houseInfo.sign;
            // Planets that belong to this house's sign
            const planets = planetsByHouse[houseInfo.house] || [];
            const rowCount = Math.max(planets.length, 1);

            const boxLabel = houseBoxMap[houseInfo.house] || houseInfo.box || "";

            const conclusionColor =
              houseInfo.conclusion === "SHORT"
                ? "#ef4444"
                : houseInfo.conclusion === "EXCESS"
                  ? "#f97316"
                  : houseInfo.conclusion === "AVERAGE"
                    ? "#22c55e"
                    : "";

            return Array.from({ length: rowCount }).map((_, rowIdx) => {
              const planet = planets[rowIdx] || null;
              const isFirstRow = rowIdx === 0;

              const planetHits = planet
                ? hitMap.planets[planet.planet] || []
                : [];
              const houseHits = isFirstRow
                ? hitMap.houses[houseInfo.house] || []
                : [];

              const degFormatted = planet
                ? planetDegMap[planet.planet] || ""
                : "";

              return (
                <tr
                  key={`house-${houseInfo.house}-row-${rowIdx}`}
                  style={{ verticalAlign: "top" }}
                >
                  {/* Col 1 — Planet */}
                  <td style={td}>
                    {planet ? (
                      <>
                        <span style={{ fontWeight: 600, fontSize: "1.3em" }}>
                          {planet.planet_number != null
                            ? `${planet.planet_number} `
                            : ""}
                          {planet.planet}
                        </span>
                        {degFormatted ? (
                          <span
                            style={{
                              color: "#13100a",
                              fontFamily: "monospace",
                              fontSize: "1.2em",
                            }}
                          >
                            {" "}
                            {degFormatted}
                          </span>
                        ) : (
                          ""
                        )}
                        {planet.traits ? (
                          <span style={{ color: "#6b7280" }}>
                            {" "}
                            ({planet.traits})
                          </span>
                        ) : null}
                      </>
                    ) : (
                      ""
                    )}
                  </td>

                  {/* Col 2 — Planet Hit From */}
                  <td style={td}>
                    {planetHits.length > 0
                      ? planetHits.map((h, i) => <div key={i}>{h}</div>)
                      : ""}
                  </td>

                  {/* Col 3 — Box / Life Context (only on first row) */}
                  <td style={{
                        ...td,
                        textAlign: "center",
                        fontWeight: 700,
                        background: "#f3f4f6",
                        verticalAlign: "middle",
                        minWidth: 70,
                      }}>
                    {isFirstRow ? (
                      <>
                        <span style={{ fontWeight: 700 }}>
                          {toRoman(houseInfo.house)}
                        </span>{" "}
                        <span>{boxLabel}</span>
                      </>
                    ) : (
                      ""
                    )}
                  </td>

                  {/* Col 4 — Degree (only on first row of house) */}
                  <td
                    style={{ ...td, textAlign: "center", whiteSpace: "nowrap" }}
                  >
                    {isFirstRow ? (
                      <>
                        {houseInfo.degreeFormatted}
                        <span style={{ color: "black", margin: "0 2px" }}>
                          /
                        </span>
                        {formatDeg(houseInfo.longitude)}
                      </>
                    ) : (
                      ""
                    )}
                  </td>

                  

                  {/* Col 5 — Sign spine (rowSpan = rowCount, shown once per house) */}
                  {isFirstRow && (
                    <td
                      rowSpan={rowCount}
                      style={{
                        ...td,
                        textAlign: "center",
                        fontWeight: 700,
                        verticalAlign: "middle",
                        minWidth: 70,
                      }}
                    >
                      <div style={{ fontSize: 13 }}>{RASHI_SHORT[sign]}</div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 400,
                          color: "#6b7280",
                          marginTop: 2,
                        }}
                      >
                        {sign}
                      </div>
                    </td>
                  )}

                  {/* Col 6 — Strength (only on first row) */}
                  <td
                    style={{
                      ...td,
                      textAlign: "center",
                      background: "#fefce8",
                    }}
                  >
                    {isFirstRow ? houseInfo.strength : ""}
                  </td>

                  {/* Col 7 — Conclusion (only on first row) */}
                  <td
                    style={{
                      ...td,
                      textAlign: "center",
                      background: "#fefce8",
                      fontWeight: 600,
                      color: conclusionColor,
                    }}
                  >
                    {isFirstRow ? houseInfo.conclusion : ""}
                  </td>

                  {/* Col 8 — House Hit From (only on first row) */}
                  <td style={td}>
                    {isFirstRow && houseHits.length > 0
                      ? houseHits.map((h, i) => <div key={i}>{h}</div>)
                      : ""}
                  </td>
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

const thSub = {
  fontWeight: 400,
  color: "#4b5563",
};








