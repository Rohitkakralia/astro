"use client";
import React, { useState } from "react";

const SIGNS_DATA = [
  {
    box: 1, sign: "ARIES", lord: "MARS", element: "Fire", gender: "MALE",
    type: "MOVABLE", tridosha: "PITTA", triguna: "RAJAS",
    attribute: "Resolve and Safety, Spontaneous, Action, Initiative, Leadership",
    environment: "Emergency place, battlefield, gym, police/military area",
    color: "#b71c1c", bg: "#fff5f5", header: "#fde8e8", border: "#c62828",
  },
  {
    box: 2, sign: "TAURUS", lord: "VENUS", element: "Earth", gender: "FEMALE",
    type: "FIXED", tridosha: "KAPHA", triguna: "RAJAS",
    attribute: "Consistent processes, Stability, Comfort, Wealth, Luxury",
    environment: "Bank, farmhouse, luxury places, food areas, jewelry shops",
    color: "#1b5e20", bg: "#f0fdf4", header: "#d1fae5", border: "#2e7d32",
  },
  {
    box: 3, sign: "GEMINI", lord: "MERCURY", element: "Air", gender: "MALE",
    type: "DUAL", tridosha: "TRIDOSHA", triguna: "RAJAS",
    attribute: "Pairs, Networking, Communication, Duality, Networking",
    environment: "Offices, call centers, media houses, classrooms",
    color: "#0d47a1", bg: "#f0f7ff", header: "#dbeafe", border: "#1565c0",
  },
  {
    box: 4, sign: "CANCER", lord: "MOON", element: "Water", gender: "FEMALE",
    type: "MOVABLE", tridosha: "KAPHA", triguna: "SATAV",
    attribute: "Intuitive, Care, Emotions, Care, Motherhood, Protection",
    environment: "Home, kitchen, hospitals, water places",
    color: "#880e4f", bg: "#fff0f7", header: "#fce7f3", border: "#ad1457",
  },
  {
    box: 5, sign: "LEO", lord: "SUN", element: "Fire", gender: "MALE",
    type: "FIXED", tridosha: "PITTA", triguna: "SATAV",
    attribute: "Compliance, Reinstating systems, Authority, Ego, Power, Creativity",
    environment: "Government offices, stage, cinema, leadership positions",
    color: "#c8500a", bg: "#fff8f0", header: "#feebd0", border: "#e07020",
  },
  {
    box: 6, sign: "VIRGO", lord: "MERCURY", element: "Earth", gender: "FEMALE",
    type: "DUAL", tridosha: "VATA", triguna: "TAMAS",
    attribute: "Organising, Packaging, Analysis, Perfection, Service, Health",
    environment: "Clinics, labs, offices, accounting places",
    color: "#37474f", bg: "#f4f6f7", header: "#eceff1", border: "#546e7a",
  },
  {
    box: 7, sign: "LIBRA", lord: "VENUS", element: "Air", gender: "MALE",
    type: "MOVABLE", tridosha: "VATA", triguna: "RAJAS",
    attribute: "Balance, Weighing, Partnership, Beauty, Agreement",
    environment: "Court, marriage halls, fashion industry, business deals",
    color: "#7b4f00", bg: "#fffbeb", header: "#fef3c7", border: "#b45309",
  },
  {
    box: 8, sign: "SCORPIO", lord: "MARS", element: "Water", gender: "FEMALE",
    type: "FIXED", tridosha: "KAPHA", triguna: "TAMAS",
    attribute: "Layout, Planning, Secrets, Depth, Transformation, Mystery",
    environment: "Hidden places, research labs, underground areas, occult",
    color: "#4a148c", bg: "#fdf4ff", header: "#f3e8ff", border: "#6a1b9a",
  },
  {
    box: 9, sign: "SAGITTARIUS", lord: "JUPITER", element: "Fire", gender: "MALE",
    type: "DUAL", tridosha: "PITTA", triguna: "SATAV",
    attribute: "What to do, Setting Goals, Struggle, Knowledge, Wisdom, Religion, Expansion",
    environment: "Temples, universities, travel places, spiritual areas",
    color: "#1a6b3c", bg: "#f0fdf4", header: "#d1fae5", border: "#2e7d32",
  },
  {
    box: 10, sign: "CAPRICORN", lord: "SATURN", element: "Earth", gender: "FEMALE",
    type: "MOVABLE", tridosha: "PITTA", triguna: "TAMAS",
    attribute: "Strategy, Structuring, Discipline, Hard work, Structure, Authority",
    environment: "Corporate offices, construction sites, mountains, factories",
    color: "#1a237e", bg: "#f5f5ff", header: "#e8eaf6", border: "#283593",
  },
  {
    box: 11, sign: "AQUARIUS", lord: "SATURN", element: "Air", gender: "MALE",
    type: "FIXED", tridosha: "VATA", triguna: "TAMAS",
    attribute: "Social Welfare, Help, Innovation, Society, Technology, Uniqueness",
    environment: "NGOs, tech hubs, social groups, research centers",
    color: "#006064", bg: "#e0f7fa", header: "#b2ebf2", border: "#00838f",
  },
  {
    box: 12, sign: "PISCES", lord: "JUPITER", element: "Water", gender: "FEMALE",
    type: "DUAL", tridosha: "KAPHA", triguna: "SATAV",
    attribute: "Meaningful Research, Imagination, Spirituality, Escape, Creativity",
    environment: "Ashrams, hospitals, meditation places, film world",
    color: "#4a148c", bg: "#fdf4ff", header: "#f3e8ff", border: "#7b1fa2",
  },
];

const COLUMNS = ["Box", "Zodiac Sign", "Lord", "Element", "Gender", "Type", "Tridosha", "Triguna", "Attribute", "Environment"];

export default function RashiRahasya() {
  const [search, setSearch] = useState("");
  const [activeSign, setActiveSign] = useState(null);

  const filtered = SIGNS_DATA.filter(row => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      row.sign.toLowerCase().includes(q) ||
      row.lord.toLowerCase().includes(q) ||
      row.element.toLowerCase().includes(q) ||
      row.type.toLowerCase().includes(q) ||
      row.tridosha.toLowerCase().includes(q) ||
      row.triguna.toLowerCase().includes(q) ||
      row.attribute.toLowerCase().includes(q) ||
      row.environment.toLowerCase().includes(q)
    );
  });

  const highlight = (text) => {
    if (!search) return text;
    const idx = text.toLowerCase().indexOf(search.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ background: "#fef08a", borderRadius: 2, padding: "0 1px" }}>
          {text.slice(idx, idx + search.length)}
        </span>
        {text.slice(idx + search.length)}
      </>
    );
  };

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      maxWidth: "100%",
      color: "#111",
    }}>

      
      {/* ── Sign nav pills ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6,
        marginBottom: 14, justifyContent: "center",
      }}>
        {SIGNS_DATA.map(s => (
          <button
            key={s.box}
            onClick={() => {
              setActiveSign(activeSign === s.box ? null : s.box);
              if (activeSign !== s.box) {
                setTimeout(() => {
                  document.getElementById(`sign-row-${s.box}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
              }
            }}
            style={{
              padding: "4px 11px",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "Arial, sans-serif",
              border: `1.5px solid ${s.border}`,
              borderRadius: 99,
              cursor: "pointer",
              background: activeSign === s.box ? s.color : s.bg,
              color: activeSign === s.box ? "#fff" : s.color,
              transition: "all 0.15s",
              letterSpacing: "0.04em",
            }}
          >
            {s.box}. {s.sign}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
        <input
          placeholder="Search signs, lords, elements, attributes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 420,
            padding: "7px 14px",
            fontSize: 12,
            fontFamily: "Arial, sans-serif",
            border: "1.5px solid #8b6914",
            borderRadius: 6,
            outline: "none",
            color: "#333",
          }}
        />
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          border: "1.5px solid #333",
          tableLayout: "auto",
        }}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th key={col} style={{
                  padding: col === "Attribute" || col === "Environment" ? "9px 12px" : "9px 10px",
                  border: "1px solid #444",
                  background: "#222",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                  whiteSpace: col === "Attribute" || col === "Environment" ? "normal" : "nowrap",
                  textAlign: col === "Box" ? "center" : "left",
                  textDecoration: col === "Attribute" || col === "Environment" ? "underline" : "none",
                  minWidth: col === "Attribute" ? 180 : col === "Environment" ? 180 : "auto",
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{
                  padding: "20px", textAlign: "center",
                  color: "#aaa", fontStyle: "italic", fontSize: 12,
                  fontFamily: "Arial, sans-serif",
                  border: "1px solid #eee",
                }}>
                  No matches for "{search}"
                </td>
              </tr>
            ) : filtered.map((row, idx) => (
              <tr
                key={row.box}
                id={`sign-row-${row.box}`}
                style={{ verticalAlign: "top" }}
              >
                {/* Box */}
                <td style={{
                  ...tdBase,
                  background: row.header,
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  color: row.color,
                  fontFamily: "Arial, sans-serif",
                  width: 36,
                }}>
                  {row.box}
                </td>

                {/* Zodiac Sign */}
                <td style={{
                  ...tdBase,
                  background: row.header,
                  borderRight: `3px solid ${row.border}`,
                  fontWeight: 700,
                  fontSize: 12,
                  color: row.color,
                  fontFamily: "Arial, sans-serif",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.04em",
                }}>
                  {highlight(row.sign)}
                </td>

                {/* Lord */}
                <td style={{
                  ...tdBase,
                  background: idx % 2 === 0 ? "#fff" : row.bg,
                  fontWeight: 600,
                  fontFamily: "Arial, sans-serif",
                  whiteSpace: "nowrap",
                  color: "#333",
                }}>
                  {highlight(row.lord)}
                </td>

                {/* Element */}
                <td style={{
                  ...tdBase,
                  background: idx % 2 === 0 ? "#fff" : row.bg,
                  fontFamily: "Arial, sans-serif",
                  whiteSpace: "nowrap",
                  color: "#444",
                }}>
                  {highlight(row.element)}
                </td>

                {/* Gender */}
                <td style={{
                  ...tdBase,
                  background: idx % 2 === 0 ? "#fff" : row.bg,
                  fontFamily: "Arial, sans-serif",
                  whiteSpace: "nowrap",
                  color: "#444",
                }}>
                  {highlight(row.gender)}
                </td>

                {/* Type */}
                <td style={{
                  ...tdBase,
                  background: idx % 2 === 0 ? "#fff" : row.bg,
                  fontFamily: "Arial, sans-serif",
                  whiteSpace: "nowrap",
                  color: "#444",
                }}>
                  {highlight(row.type)}
                </td>

                {/* Tridosha */}
                <td style={{
                  ...tdBase,
                  background: idx % 2 === 0 ? "#fff" : row.bg,
                  fontFamily: "Arial, sans-serif",
                  whiteSpace: "nowrap",
                  color: "#444",
                }}>
                  {highlight(row.tridosha)}
                </td>

                {/* Triguna */}
                <td style={{
                  ...tdBase,
                  background: idx % 2 === 0 ? "#fff" : row.bg,
                  fontFamily: "Arial, sans-serif",
                  whiteSpace: "nowrap",
                  color: "#444",
                }}>
                  {highlight(row.triguna)}
                </td>

                {/* Attribute */}
                <td style={{
                  ...tdBase,
                  background: idx % 2 === 0 ? "#fff" : row.bg,
                  lineHeight: 1.6,
                  color: "#222",
                  minWidth: 180,
                }}>
                  {highlight(row.attribute)}
                </td>

                {/* Environment */}
                <td style={{
                  ...tdBase,
                  background: idx % 2 === 0 ? "#fff" : row.bg,
                  lineHeight: 1.6,
                  fontWeight: 700,
                  color: "#111",
                  minWidth: 180,
                }}>
                  {highlight(row.environment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div style={{
        textAlign: "center",
        marginTop: 14,
        fontSize: 10,
        color: "#aaa",
        fontFamily: "Arial, sans-serif",
        letterSpacing: "0.05em",
        borderTop: "1px solid #eee",
        paddingTop: 10,
      }}>
        THEORY BY MD &nbsp;·&nbsp; SECRETS OF SIGNS
      </div>
    </div>
  );
}

const tdBase = {
  border: "1px solid #ccc",
  padding: "9px 10px",
};