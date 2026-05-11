"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  const [kundalis, setKundalis]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // ── Fetch all kundalis ────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }

    (async () => {
      try {
        const res = await fetch("/api/saveKundali", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load history");
        setKundalis(data.kundalis);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── View kundali ──────────────────────────────────────────────────────────
  const handleView = (k) => {
    const payload = {
      name:         k.name,
      dob:          (k.dob instanceof Date ? k.dob : new Date(k.dob)).toISOString().split("T")[0],
      tob:          (k.tob ?? "12:00").slice(0, 5),
      utcOffsetMin: Number(k.utc_offset_min ?? 330),
      lat:          parseFloat(k.latitude),
      lon:          parseFloat(k.longitude),
      gender:       k.gender,
      city:         k.city    ?? "",
      country:      k.country ?? "",
    };
    const encoded = btoa(JSON.stringify(payload));
    router.push(`/charts?data=${encoded}`);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("Delete this kundali profile? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/saveKundali?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setKundalis((prev) => prev.filter((k) => k.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDob = (dob) =>
    new Date(dob).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

        .hy-view-btn:hover {
          background: #8b6914 !important;
          color: #fffef9 !important;
          border-color: #8b6914 !important;
        }
        .hy-delete-btn:hover {
          background: #fff0ee !important;
          border-color: #cc2200 !important;
        }
        .hy-back-btn:hover {
          background: #fff8e8 !important;
          border-color: #8b6914 !important;
          color: #3d2800 !important;
        }
        .hy-tr:hover td {
          background: #fff8e8 !important;
        }
      `}</style>

      <div style={S.page}>

        {/* ── Page header ── */}
        <div style={S.header}>
          <div>
            <p style={S.eyebrow}>— your cosmic archive —</p>
            <h1 style={S.title}>Kundali History</h1>
          </div>
          <button
            className="hy-back-btn"
            style={S.backBtn}
            onClick={() => router.back()}
          >
            ← Back
          </button>
        </div>

        {/* ── Decorative divider ── */}
        <div style={S.dividerRow}>
          <div style={S.dividerLine} />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="7.5" stroke="#d4b96a" strokeWidth="0.8" />
            <circle cx="9" cy="9" r="2"   fill="#8b6914" />
            <line x1="9" y1="2" x2="9" y2="16" stroke="#e8d89a" strokeWidth="0.6" />
            <line x1="2" y1="9" x2="16" y2="9" stroke="#e8d89a" strokeWidth="0.6" />
          </svg>
          <div style={S.dividerLine} />
        </div>

        {/* ── Card ── */}
        <div style={S.card}>

          {/* Loading */}
          {loading && (
            <p style={S.stateMsg}>
              <em>Consulting the cosmic archive…</em>
            </p>
          )}

          {/* Error */}
          {error && (
            <p style={{ ...S.stateMsg, color: "#cc2200", fontStyle: "normal" }}>
              ⚠ {error}
            </p>
          )}

          {/* Empty */}
          {!loading && !error && kundalis.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }} aria-hidden="true">
                <circle cx="20" cy="20" r="18" stroke="#8b6914" strokeWidth="1" />
                <circle cx="20" cy="20" r="3"  fill="#c9a84c" />
                <line x1="20" y1="3"  x2="20" y2="37" stroke="#e8d89a" strokeWidth="0.8" />
                <line x1="3"  y1="20" x2="37" y2="20" stroke="#e8d89a" strokeWidth="0.8" />
              </svg>
              <p style={S.stateMsg}>No kundali profiles saved yet.</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && kundalis.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["#", "Name", "Date of Birth", "Time", "Gender", "City", "Country", "view", "delete"].map((h, i) => (
                      <th key={i} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kundalis.map((k, i) => (
                    <tr
                      key={k.id}
                      className="hy-tr"
                      style={S.tr}
                    >
                      {/* Index */}
                      <td style={{ ...S.td, color: "#c9a84c", fontSize: 11, width: 32 }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>

                      {/* Name */}
                      <td style={{ ...S.td, fontWeight: 500, color: "#3d2800" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {/* Initials circle */}
                          <div style={S.initials}>
                            <span style={S.initialsText}>
                              {k.name.trim().split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </span>
                          </div>
                          {k.name}
                        </div>
                      </td>

                      {/* DOB */}
                      <td style={S.td}>{formatDob(k.dob)}</td>

                      {/* TOB */}
                      <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12 }}>
                        {k.tob ? k.tob.slice(0, 5) : "—"}
                      </td>

                      {/* Gender */}
                      <td style={S.td}>
                        <span style={{
                          ...S.pill,
                          background: k.gender?.toLowerCase() === "female" ? "#fdf0f8" : "#f0f4ff",
                          borderColor: k.gender?.toLowerCase() === "female" ? "#e8a8d8" : "#a8b8e8",
                          color:       k.gender?.toLowerCase() === "female" ? "#aa3388" : "#334488",
                        }}>
                          {k.gender || "—"}
                        </span>
                      </td>

                      {/* City */}
                      <td style={{ ...S.td, color: "#7a5c2e" }}>{k.city    || "—"}</td>

                      {/* Country */}
                      <td style={{ ...S.td, color: "#7a5c2e" }}>{k.country || "—"}</td>

                      {/* View */}
                      <td style={S.td}>
                        <button
                          className="hy-view-btn"
                          style={S.viewBtn}
                          onClick={() => handleView(k)}
                        >
                          View →
                        </button>
                      </td>

                      {/* Delete */}
                      <td style={S.td}>
                        <button
                          className="hy-delete-btn"
                          style={{
                            ...S.deleteBtn,
                            opacity: deletingId === k.id ? 0.5 : 1,
                          }}
                          onClick={() => handleDelete(k.id)}
                          disabled={deletingId === k.id}
                        >
                          {deletingId === k.id ? "…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Row count */}
              <p style={{ margin: "12px 0 0", fontSize: 11, color: "#c9a84c", letterSpacing: "0.08em", fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
                {kundalis.length} profile{kundalis.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          )}
        </div>

        {/* Footer verse */}
        <p style={S.verse}>॥ ज्योतिषं वेदचक्षुः ॥</p>
      </div>
    </>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "#f7f3e8",
    fontFamily: "'Jost', sans-serif",
    padding: "2.5rem 1.5rem",
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "1.25rem",
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#8b6914",
    fontWeight: 300,
  },
  title: {
    margin: "6px 0 0",
    fontSize: 30,
    fontWeight: 500,
    letterSpacing: "0.01em",
    color: "#3d2800",
    fontFamily: "'Cormorant Garamond', serif",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #d4b96a",
    color: "#8b6914",
    padding: "6px 16px",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
    letterSpacing: "0.04em",
    transition: "all 0.2s",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "0 0 1.75rem",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#d4b96a",
  },
  card: {
    background: "#fffef9",
    border: "1px solid #d4b96a",
    borderRadius: 2,
    padding: "1.5rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    fontFamily: "'Jost', sans-serif",
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    color: "#8b6914",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontSize: 10,
    borderBottom: "1.5px solid #d4b96a",
    whiteSpace: "nowrap",
    fontFamily: "'Jost', sans-serif",
  },
  tr: {
    borderBottom: "0.5px solid #e8d89a",
    transition: "background 0.15s",
  },
  td: {
    padding: "11px 12px",
    color: "#5a3c00",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    fontWeight: 300,
    transition: "background 0.15s",
  },
  initials: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#8b6914",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  initialsText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 11,
    fontWeight: 600,
    color: "#fffef9",
    letterSpacing: "0.05em",
  },
  pill: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 10,
    border: "1px solid",
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: "0.04em",
  },
  viewBtn: {
    background: "transparent",
    border: "1px solid #d4b96a",
    color: "#8b6914",
    padding: "5px 14px",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'Jost', sans-serif",
    fontWeight: 400,
    whiteSpace: "nowrap",
    letterSpacing: "0.04em",
    transition: "all 0.2s",
  },
  deleteBtn: {
    background: "transparent",
    border: "1px solid #f0c0b8",
    color: "#cc2200",
    padding: "5px 12px",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  },
  stateMsg: {
    textAlign: "center",
    color: "#8b6914",
    padding: "2rem 0",
    margin: 0,
    fontStyle: "italic",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 16,
  },
  verse: {
    textAlign: "center",
    marginTop: "2rem",
    fontSize: 11,
    letterSpacing: "0.15em",
    color: "#c9a84c",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
  },
};