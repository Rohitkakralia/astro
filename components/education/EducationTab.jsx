"use client";
import React, { useState } from "react";
import PlanetsKarakTatav from "./PlanetsKarakTatav";
import RashiRahasya from "./RashiRahasya";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANETS_DATA = [
  {
    name: "Sun",
    symbol: "☉",
    color: "#e65100",
    bg: "#fff3e0",
    border: "#ff9800",

    keywords: [
      "Soul",
      "Will power",
      "King",
      "Respect",
      "Father",
      "Medical science",
      "Health",
      "Heart",
      "Stomach",
      "Right eye",
      "Blood circulation",
      "Heat",
      "Electricity",
      "WBC",
      "Son",
      "Brain",
      "Ambition",
    ],

    attributes: [
      "Boldness",
      "Brilliance",
      "Dignity",
      "Elevation in rank",
      "Fame",
      "Generosity",
      "Hope",
      "Influence",
      "Loyalty",
      "Nobility",
      "Power",
      "Respect to elders",
      "Reputation",
      "Truth",
      "Jealousy",
    ],

    signifies: [
      "Government services",
      "Orange articles",
      "Copper",
      "Wheat",
      "Medicine",
      "Administrators",
      "Dictators",
      "Royal leaders",
      "Head of departments",
      "People in authority and power",
      "Gold bonds",
      "Reserve bank",
      "Stock exchange",
      "Chamber of commerce",
      "Forests",
      "Mountains",
      "Government buildings",
      "Public offices",
      "District boards",
      "Panchayat unions",
    ],

    animals: ["Lion", "Male horse", "Singing birds"],

    gemstone: "Ruby",

    color_assoc: ["Orange", "Gold"],
  },
];

const BOX_DATA = [
  {
    box: 1,
    title: "Self & Personality",
    keywords: [
      "Self",
      "Physical appearance",
      "Personality",
      "Beginnings",
      "Overall vitality",
      "Image",
      "Nature",
      "Attitude",
      "Self made",
      "Self effort",
    ],
    color: "#c8500a",
    bg: "#fff8f0",
    header: "#feebd0",
    border: "#e07020",
  },
  {
    box: 2,
    title: "Wealth & Family",
    keywords: [
      "Wealth",
      "Possessions",
      "Personal finances",
      "Values",
      "Speech",
      "Early education",
      "Resources",
      "Food",
      "Marka asthan",
      "Possessiveness",
      "Saving A/c",
      "Jewellery",
      "Family",
    ],
    color: "#1b5e20",
    bg: "#f0fdf4",
    header: "#d1fadf",
    border: "#2e7d32",
  },
  {
    box: 3,
    title: "Communication & Courage",
    keywords: [
      "Communication",
      "Siblings",
      "Short trips",
      "Learning",
      "Courage",
      "Expression",
      "Commuting",
      "Visa",
      "Ticket",
      "Documentation",
      "Franchisee",
      "Conscious Mind",
      "Legal Deeds",
      "Marketing",
      "Neighbour",
      "Newspaper",
      "Internet",
      "Marriage Bureau",
    ],
    color: "#0d47a1",
    bg: "#f0f7ff",
    header: "#dbeafe",
    border: "#1565c0",
  },
  {
    box: 4,
    title: "Home & Property",
    keywords: [
      "Home",
      "Family",
      "Roots",
      "Emotional security",
      "Mother",
      "Education",
      "Childhood",
      "Vehicle",
      "Home atmosphere",
      "Land",
      "Property",
      "Real Estate",
      "Mining",
      "Immovable Assets",
    ],
    color: "#880e4f",
    bg: "#fff0f7",
    header: "#fce7f3",
    border: "#ad1457",
  },
  {
    box: 5,
    title: "Creativity & Children",
    keywords: [
      "Creativity",
      "Romance",
      "Children",
      "Hobbies",
      "Speculation",
      "Intelligence",
      "Fun",
      "Affairs",
      "Progeny",
      "Solutions",
      "Healing",
      "Entertainment",
      "Sports",
    ],
    color: "#7b4f00",
    bg: "#fffbeb",
    header: "#fef3c7",
    border: "#b45309",
  },
  {
    box: 6,
    title: "Health & Service",
    keywords: [
      "Health",
      "Daily routine",
      "Service",
      "Job",
      "Enemies",
      "Pets",
      "Challenges",
      "Loan",
      "Disease",
      "Servant",
    ],
    color: "#37474f",
    bg: "#f4f6f7",
    header: "#eceff1",
    border: "#546e7a",
  },
  {
    box: 7,
    title: "Partnerships & Marriage",
    keywords: [
      "Partnerships",
      "Marriage",
      "Open enemies",
      "Legal contracts",
      "Interaction",
      "Public Appearance",
      "Customer",
      "Sales",
    ],
    color: "#b71c1c",
    bg: "#fff5f5",
    header: "#fde8e8",
    border: "#c62828",
  },
  {
    box: 8,
    title: "Transformation & Secrets",
    keywords: [
      "Transformation",
      "Shared resources",
      "Death",
      "Secrets",
      "Intimacy",
      "Pain",
      "Danger",
      "Cremation Ground",
      "Procrastination",
      "Longevity",
      "R&D",
      "Industry",
      "Factory",
      "Production",
      "Sudden",
      "Dowry",
    ],
    color: "#4a148c",
    bg: "#fdf4ff",
    header: "#f3e8ff",
    border: "#6a1b9a",
  },
  {
    box: 9,
    title: "Fortune & Higher Learning",
    keywords: [
      "Higher education",
      "Philosophy",
      "Long-distance travel",
      "Fortune",
      "Beliefs",
      "Insights",
      "Flying",
      "Religion",
      "Law",
    ],
    color: "#2e7d32",
    bg: "#f0fdf4",
    header: "#d1fae5",
    border: "#388e3c",
  },
  {
    box: 10,
    title: "Career & Fame",
    keywords: [
      "Career",
      "Fame",
      "Public reputation",
      "Authority",
      "Success",
      "Govt.",
      "Occupation",
      "Status",
      "Designation",
      "Politics",
      "Branding",
    ],
    color: "#c8500a",
    bg: "#fff8f0",
    header: "#feebd0",
    border: "#e07020",
  },
  {
    box: 11,
    title: "Gains & Social Groups",
    keywords: [
      "Friendships",
      "Social groups",
      "Aspirations",
      "Gains",
      "Humanitarian causes",
      "Fulfilment",
      "NGOs",
      "Trust",
      "Communities",
    ],
    color: "#1565c0",
    bg: "#f0f7ff",
    header: "#dbeafe",
    border: "#1976d2",
  },
  {
    box: 12,
    title: "Spirituality & Foreign",
    keywords: [
      "Subconscious",
      "Spirituality",
      "Isolation",
      "Hidden enemies",
      "Secrets",
      "Karma",
      "Expenditure",
      "Meditation",
      "Research",
      "Import export",
      "Investment",
      "Hospital",
      "Showroom",
      "Foreign",
      "Jail",
    ],
    color: "#37474f",
    bg: "#f4f6f7",
    header: "#eceff1",
    border: "#546e7a",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BoxCard({ box }) {
  return (
    <div
      style={{
        border: `1.5px solid ${box.border}`,
        borderRadius: 10,
        background: box.bg,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          background: `${box.border}22`,
          borderBottom: `1px solid ${box.border}44`,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: box.color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {box.box}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: box.color }}>
            {box.title}
          </div>
          <div style={{ fontSize: 10, color: "#666" }}>
            House / Box {box.box}
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div style={{ padding: "8px 12px 10px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {box.keywords.map((k) => (
            <span
              key={k}
              style={{
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 99,
                background: `${box.border}22`,
                color: box.color,
                border: `0.5px solid ${box.border}55`,
                fontWeight: 500,
              }}
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Full Table views ─────────────────────────────────────────────────────────

function BoxTable() {
  const [search, setSearch] = React.useState("");
  const [activeBox, setActiveBox] = React.useState(null);

  const filtered = BOX_DATA.map((b) => ({
    ...b,
    keywords: search
      ? b.keywords.filter((k) => k.toLowerCase().includes(search.toLowerCase()))
      : b.keywords,
  })).filter((b) => !search || b.keywords.length > 0);

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        maxWidth: "100%",
        color: "#111",
      }}
    >
      {/* ── Box nav pills ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 14,
          justifyContent: "center",
        }}
      >
        {BOX_DATA.map((b) => (
          <button
            key={b.box}
            onClick={() => {
              setActiveBox(activeBox === b.box ? null : b.box);
              if (activeBox !== b.box) {
                setTimeout(() => {
                  document
                    .getElementById(`box-row-${b.box}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
              }
            }}
            style={{
              padding: "4px 11px",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "Arial, sans-serif",
              border: `1.5px solid ${b.border}`,
              borderRadius: 99,
              cursor: "pointer",
              background: activeBox === b.box ? b.color : b.bg,
              color: activeBox === b.box ? "#fff" : b.color,
              transition: "all 0.15s",
              letterSpacing: "0.04em",
            }}
          >
            {b.box} · {b.title}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div
        style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}
      >
        <input
          placeholder="Search any keyword across all houses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 420,
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
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            border: "1.5px solid #333",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  ...thStyle,
                  background: "#222",
                  color: "#fff",
                  width: 90,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textAlign: "center",
                }}
              >
                HOUSE
              </th>
              <th
                style={{
                  ...thStyle,
                  background: "#222",
                  color: "#fff",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textAlign: "left",
                }}
              >
                ATTRIBUTES / KEY SIGNIFICATORS
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, idx) => (
              <tr
                key={b.box}
                id={`box-row-${b.box}`}
                style={{ verticalAlign: "top" }}
              >
                {/* House name cell */}
                <td
                  style={{
                    ...tdStyle,
                    background: b.header,
                    borderRight: `3px solid ${b.border}`,
                    textAlign: "center",
                    padding: "14px 8px",
                    minWidth: 80,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: b.color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 15,
                      fontFamily: "Arial, sans-serif",
                      margin: "0 auto 6px",
                    }}
                  >
                    {b.box}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: b.color,
                      fontFamily: "Arial, sans-serif",
                      textTransform: "uppercase",
                      lineHeight: 1.3,
                    }}
                  >
                    {b.title}
                  </div>
                </td>

                {/* Keywords cell */}
                <td
                  style={{
                    ...tdStyle,
                    background: idx % 2 === 0 ? "#fff" : b.bg,
                    padding: "10px 14px",
                    lineHeight: 1.9,
                  }}
                >
                  {b.keywords.length === 0 ? (
                    <span
                      style={{
                        color: "#aaa",
                        fontStyle: "italic",
                        fontSize: 11,
                      }}
                    >
                      No matches for "{search}"
                    </span>
                  ) : (
                    <span style={{ color: "#222" }}>
                      {b.keywords.map((k, ki) => (
                        <span key={ki}>
                          <span
                            style={{
                              background:
                                search &&
                                k.toLowerCase().includes(search.toLowerCase())
                                  ? "#fef08a"
                                  : "transparent",
                              borderRadius: 2,
                              padding: search ? "0 1px" : 0,
                            }}
                          >
                            {k}
                          </span>
                          {ki < b.keywords.length - 1 && (
                            <span style={{ color: "#8b6914", margin: "0 3px" }}>
                              ·
                            </span>
                          )}
                        </span>
                      ))}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          textAlign: "center",
          marginTop: 14,
          fontSize: 10,
          color: "#aaa",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0.05em",
          borderTop: "1px solid #eee",
          paddingTop: 10,
        }}
      >
        THEORY BY MD &nbsp;·&nbsp; BOX ATTRIBUTES (12 HOUSES)
      </div>
    </div>
  );
}

const thStyle = {
  padding: "9px 14px",
  border: "1px solid #444",
  fontWeight: 700,
  fontFamily: "Arial, sans-serif",
};

const tdStyle = {
  border: "1px solid #ccc",
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "planets", label: "Planets Karak Tatav", icon: "✦" },
  { id: "boxes", label: "Box Attributes", icon: "⬡" },
  { id: "rashi", label: "Rashi Rahsya", icon: "✵" },
];

export default function EducationTab() {
  const [activeSection, setActiveSection] = useState("planets");
  const [viewMode, setViewMode] = useState("table"); // "cards" | "table"

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "100%",
        color: "#222",
      }}
    >
      {/* ── Section tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          borderBottom: "2px solid #e0e0e0",
          paddingBottom: 0,
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              borderRadius: "6px 6px 0 0",
              background: activeSection === s.id ? "#fff" : "transparent",
              color: activeSection === s.id ? "#1565c0" : "#666",
              borderBottom:
                activeSection === s.id
                  ? "2px solid #1565c0"
                  : "2px solid transparent",
              marginBottom: -2,
              transition: "all 0.15s",
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}

        {/* View toggle — only shown for Boxes section */}
        {activeSection === "boxes" && (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            {["cards", "table"].map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                style={{
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 500,
                  border: `1px solid ${viewMode === m ? "#1565c0" : "#ddd"}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  background: viewMode === m ? "#e3f2fd" : "#fff",
                  color: viewMode === m ? "#1565c0" : "#666",
                }}
              >
                {m === "cards" ? "⊞ Cards" : "≡ Table"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Planets section — always table ── */}
      {activeSection === "planets" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1565c0" }}>
              ✦ Planets Karak Tatav — Significators
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
              Each planet governs specific life areas, body parts, professions,
              and energies.
            </div>
          </div>

          <PlanetsKarakTatav />
        </div>
      )}

      {/* ── Boxes section ── */}
      {activeSection === "boxes" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1565c0" }}>
              ⬡ Box Attributes — Life Context Houses
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
              The 12 houses represent different domains of life experience.
            </div>
          </div>

          {viewMode === "cards" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {BOX_DATA.map((b) => (
                <BoxCard key={b.box} box={b} />
              ))}
            </div>
          ) : (
            <BoxTable />
          )}
        </div>
      )}

      {activeSection === "rashi" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1565c0" }}>
              ✵ Rashi Rahsya
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
              Zodiac Signs — Elements, Nature & Environment
            </div>
          </div>

          <RashiRahasya />
        </div>
      )}
    </div>
  );
}
