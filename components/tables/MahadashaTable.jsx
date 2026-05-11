"use client";
import React, { useMemo } from "react";

// ─── Vimshottari constants ────────────────────────────────────────────────────

const DASHA_YEARS = {
  Sun: 6, Moon: 10, Mars: 7, Rahu: 18,
  Jupiter: 16, Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20,
};

const DASHA_ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const TOTAL_YEARS = 120;
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * For the FIRST (birth) mahadasha only:
 * The maha.start from API is the ACTUAL start (birth time minus consumed balance),
 * i.e. the theoretical start of that full mahadasha cycle.
 * But birth_mahadasha.balanceYears tells us how much of that mahadasha REMAINS.
 *
 * Strategy:
 * 1. Reconstruct the full theoretical mahadasha start = maha.end - mahaYears
 * 2. Generate ALL 9 antardashas from that theoretical start
 * 3. Filter to only those whose end > maha.start (i.e. still remaining at birth)
 * 4. Clamp the first one's start to maha.start
 *
 * For ALL other mahadashas: generate full 9 antardashas from maha.start normally.
 */
function calcAntardashas(mahaLord, mahaStart, mahaEnd, isBirthMaha) {
  const mahaYears = DASHA_YEARS[mahaLord];
  const startIdx  = DASHA_ORDER.indexOf(mahaLord);
  const mahaEndMs = new Date(mahaEnd).getTime();

  // Theoretical full mahadasha start (going back mahaYears from end)
  const theoreticalStartMs = mahaEndMs - mahaYears * MS_PER_YEAR;
  const birthStartMs       = new Date(mahaStart).getTime();

  const allAntars = [];
  let cursor = theoreticalStartMs;

  for (let i = 0; i < 9; i++) {
    const antarLord  = DASHA_ORDER[(startIdx + i) % 9];
    const antarYears = DASHA_YEARS[antarLord];
    const durMs      = (mahaYears * antarYears / TOTAL_YEARS) * MS_PER_YEAR;
    const start      = cursor;
    const end        = cursor + durMs;
    allAntars.push({ lord: antarLord, start, end });
    cursor = end;
  }

  if (isBirthMaha) {
    // Keep only antardashas that haven't fully passed by birth
    const remaining = allAntars.filter(a => a.end > birthStartMs);
    // Clamp the first one to start at birth mahadasha start
    if (remaining.length > 0) {
      remaining[0] = { ...remaining[0], start: birthStartMs };
    }
    return remaining.map(a => ({
      lord:  a.lord,
      start: new Date(a.start).toISOString(),
      end:   new Date(a.end).toISOString(),
    }));
  }

  // Normal mahadasha — all 9 from maha.start
  return allAntars.map(a => ({
    lord:  a.lord,
    start: new Date(a.start).toISOString(),
    end:   new Date(a.end).toISOString(),
  }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
}

function isNowActive(start, end) {
  const now = Date.now();
  return new Date(start) <= now && now < new Date(end);
}

function toYm(totalYears) {
  const abs = Math.abs(totalYears);
  const y   = Math.floor(abs);
  const m   = Math.round((abs - y) * 12);
  return `${y}y${m}m`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MahadashaTable({ data }) {
  if (!data) return null;

  const {
    mahadasha_timeline   = [],
    antardasha_timeline  = [],
    birth_mahadasha,
  } = data;

  const sorted = useMemo(
    () => [...mahadasha_timeline].sort((a, b) => new Date(a.start) - new Date(b.start)),
    [mahadasha_timeline]
  );

  const firstStart = sorted[0]?.start ? new Date(sorted[0].start) : null;

  function yearOffset(dateStr) {
    if (!firstStart || !dateStr) return 0;
    return (new Date(dateStr) - firstStart) / MS_PER_YEAR;
  }

  const blocks = useMemo(() => {
    return sorted.map((maha, idx) => {
      // Use API antardashas if available (current mahadasha)
      const apiAntars = antardasha_timeline
        .filter(a =>
          new Date(a.start) >= new Date(maha.start) &&
          new Date(a.start) <  new Date(maha.end)
        )
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      const antars = apiAntars.length > 0
        ? apiAntars
        : calcAntardashas(maha.lord, maha.start, maha.end, idx === 0);

      return { maha, antars };
    });
  }, [sorted, antardasha_timeline]);

  // ── Styles ───────────────────────────────────────────────────────────────────

  const cell = {
    padding: "3px 8px",
    fontSize: 11,
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
  };

  const headerCell = {
    ...cell,
    fontSize: 10,
    fontWeight: 700,
    color: "#6b7280",
    borderBottom: "1.5px solid #9ca3af",
    background: "transparent",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ background: "#fffdf5", padding: "16px 12px", fontFamily: "Arial, sans-serif" }}>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif", color: "#111" }}>
          Vimshottari Mahadasha and Antardashas
        </div>
        {birth_mahadasha && (
          <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>
            Dasha balance at birth : {birth_mahadasha.mahadashaLord} {birth_mahadasha.balanceYears?.toFixed(2)}y
          </div>
        )}
      </div>

      {/* 3-column grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px 16px",
      }}>
        {blocks.map(({ maha, antars }, bi) => {
          const mahaActive = isNowActive(maha.start, maha.end);
          const yrs        = DASHA_YEARS[maha.lord] || "";
          const fromY      = yearOffset(maha.start);
          const toY        = yearOffset(maha.end);

          return (
            <div key={bi}>
              {/* Heading */}
              <div style={{ marginBottom: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "Georgia, serif", color: "#111" }}>
                  {maha.lord} ({yrs}y)
                </span>
                {mahaActive && (
                  <span style={{
                    marginLeft: 6, fontSize: 9, fontWeight: 700,
                    background: "#16a34a", color: "#fff",
                    padding: "1px 6px", borderRadius: 10,
                    verticalAlign: "middle",
                  }}>NOW</span>
                )}
              </div>

              {/* Sub-heading */}
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4, fontStyle: "italic" }}>
                From {toYm(fromY)} to {toYm(toY)}
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1.5px solid #374151", marginBottom: 0 }} />

              {/* Table */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...headerCell, textAlign: "left" }}>Antar</th>
                    <th style={{ ...headerCell, textAlign: "left" }}>Beginning</th>
                    <th style={{ ...headerCell, textAlign: "left" }}>Ending</th>
                  </tr>
                </thead>
                <tbody>
                  {antars.map((a, ai) => {
                    const antarActive = mahaActive && isNowActive(a.start, a.end);
                    return (
                      <tr key={ai} style={{ background: antarActive ? "#fef9c3" : "transparent" }}>
                        <td style={{
                          ...cell,
                          fontWeight: antarActive ? 700 : 400,
                          color: antarActive ? "#854d0e" : "#1f2937",
                        }}>
                          {antarActive && "▶ "}{a.lord}
                        </td>
                        <td style={cell}>{formatDate(a.start)}</td>
                        <td style={cell}>{formatDate(a.end)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      
    </div>
  );
}