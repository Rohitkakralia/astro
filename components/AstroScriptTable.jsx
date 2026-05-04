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

// ─── NEW: Conclusion label from strength ──────────────────────────────────────
function getConclusion(strength) {
  if (strength < 27) return "SHORT";
  if (strength > 33) return "EXCESS";
  return "AVERAGE";
}

export default function AstroScriptTable({ data }) {
  if (!data || !data.astro_script) return null;

  const planetPositions = data.planet_position || [];
  const projectionHits = data.projection_hits || [];
  const houseCusps = data.house_cusps || [];

  useEffect(() => {
    console.log("AstroScriptTable data:", data);
  }, [data]);

  // ─── 1. BUILD HOUSE INFO FROM house_cusps ─────────────────────────────────
  const houseInfoList = useMemo(() => {
  return houseCusps.map((lon, idx) => {
    const sign = signFromLongitude(lon);
    const degIn = degInSign(lon);

    const current = lon;
    const next =
      idx < houseCusps.length - 1
        ? houseCusps[idx + 1]
        : houseCusps[0];

    // ✅ FIXED strength calculation
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

  // ─── 2. GROUP HOUSES BY SIGN ──────────────────────────────────────────────
  const housesBySign = useMemo(() => {
    const map = {};
    RASHI_ORDER.forEach((s) => {
      map[s] = [];
    });
    houseInfoList.forEach((h) => {
      if (map[h.sign]) map[h.sign].push(h);
    });
    return map;
  }, [houseInfoList]);

  // ─── 3. GROUP PLANETS BY SIGN ─────────────────────────────────────────────
  const groupedBySign = useMemo(() => {
    const map = {};
    RASHI_ORDER.forEach((s) => {
      map[s] = [];
    });
    data.astro_script.forEach((row) => {
      if (map[row.sign] !== undefined) map[row.sign].push(row);
    });
    RASHI_ORDER.forEach((s) => {
      map[s].sort((a, b) => (a.house || 0) - (b.house || 0));
    });
    return map;
  }, [data.astro_script]);

  // ─── 4. PLANET DEGREE MAP ─────────────────────────────────────────────────
  const planetDegMap = useMemo(() => {
    const map = {};
    planetPositions.forEach((p) => {
      map[p.name] = p.degree_formatted || "";
    });
    return map;
  }, [planetPositions]);

  // ─── 5. HIT MAP ───────────────────────────────────────────────────────────
  const hitMap = useMemo(() => {
    const map = { houses: {}, planets: {} };
    projectionHits.forEach((source) => {
      const src = source.source_planet;
      source.projections.forEach((proj) => {
        const angle = proj.angle;
        proj.hit_houses?.forEach((h) => {
          if (!map.houses[h.house]) map.houses[h.house] = [];
          map.houses[h.house].push(`${src.slice(0, 2)} ${angle}`);
        });
        proj.hit_planets?.forEach((p) => {
          if (!map.planets[p.planet]) map.planets[p.planet] = [];
          map.planets[p.planet].push(`${src.slice(0, 2)} ${angle}`);
        });
      });
    });
    return map;
  }, [projectionHits]);

  // ─── 6. LORDSHIP BOX MAP ──────────────────────────────────────────────────
  const houseBoxMap = useMemo(() => {
    const map = {};
    if (data.lordships) {
      Object.entries(data.lordships).forEach(([houseNum, info]) => {
        map[parseInt(houseNum)] = info.box || info.meaning || "";
      });
    }
    return map;
  }, [data.lordships]);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full overflow-x-auto mt-6 text-black mb-6">
      <h2 className="text-center font-bold text-base mb-2 tracking-wide">
        Astro Details
      </h2>

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
              <span style={thSub}>Signs</span>
            </th>
            <th style={th}>
              4<br />
              <span style={thSub}>Deg</span>
            </th>
            <th style={th}>
              5<br />
              <span style={thSub}>Box (Life Context)</span>
            </th>
            {/* ── NEW COLUMNS ── */}
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

        {/* ── BODY ── */}
        <tbody>
          {RASHI_ORDER.map((sign) => {
            const planets = groupedBySign[sign] || [];
            const houses = housesBySign[sign] || [];
            const rowCount = Math.max(planets.length, houses.length, 1);
            const firstHouseNum = houses[0]?.house;

            return Array.from({ length: rowCount }).map((_, rowIdx) => {
              const planet = planets[rowIdx] || null;
              const houseInfo = houses[rowIdx] || null;

              const planetHits = planet
                ? hitMap.planets[planet.planet] || []
                : [];
              const houseHits = houseInfo
                ? hitMap.houses[houseInfo.house] || []
                : [];
              const degFormatted = planet
                ? planetDegMap[planet.planet] || ""
                : "";
              const boxLabel = houseInfo
                ? houseBoxMap[houseInfo.house] || houseInfo.box || ""
                : "";

              const isFirstRow = rowIdx === 0;

              // ── NEW: Only show strength/conclusion on first row of house ──
              const showStrength = houseInfo != null;

              // ── Conclusion colour ──────────────────────────────────────────
              const conclusionColor =
                houseInfo?.conclusion === "SHORT"
                  ? "#ef4444"
                  : houseInfo?.conclusion === "EXCESS"
                    ? "#f97316"
                    : houseInfo?.conclusion === "AVERAGE"
                      ? "#22c55e"
                      : "";

              return (
                <tr key={`${sign}-${rowIdx}`} style={{ verticalAlign: "top" }}>
                  {/* A */}
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

                  {/* B */}
                  <td style={td}>
                    {planetHits.length > 0
                      ? planetHits.map((h, i) => <div key={i}>{h}</div>)
                      : ""}
                  </td>

                  {/* C — Sign spine */}
                  {isFirstRow && (
                    <td
                      rowSpan={rowCount}
                      style={{
                        ...td,
                        textAlign: "center",
                        fontWeight: 700,
                        background: "#f3f4f6",
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

                  {/* D */}
                  <td
                    style={{ ...td, textAlign: "center", whiteSpace: "nowrap" }}
                  >
                    {houseInfo ? (
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

                  {/* E */}
                  <td style={td}>
                    {houseInfo ? (
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

                  {/* J — Strength (NEW) */}
                  <td
                    style={{
                      ...td,
                      textAlign: "center",
                      background: "#fefce8",
                    }}
                  >
                    {showStrength ? houseInfo.strength : ""}
                  </td>

                  {/* K — Conclusion (NEW) */}
                  <td
                    style={{
                      ...td,
                      textAlign: "center",
                      background: "#fefce8",
                      fontWeight: 600,
                      color: conclusionColor,
                    }}
                  >
                    {showStrength ? houseInfo.conclusion : ""}
                  </td>

                  {/* I */}
                  <td style={td}>
                    {houseHits.length > 0
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
