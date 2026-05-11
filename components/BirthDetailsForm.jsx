"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function BirthDetailsForm() {
  const router = useRouter();

  const [form, setForm]               = useState({ name: "", dob: "", tob: "", gender: "" });
  const [query, setQuery]             = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [activeIdx, setActiveIdx]     = useState(-1);
  const [place, setPlace]             = useState(null);
  const [utc, setUtc]                 = useState(null);
  const [submitting, setSubmitting]   = useState(false);

  const debounceRef = useRef(null);
  const wrapRef     = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setSuggestions([]); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => { computeUTC(form.dob, form.tob, place); }, [form.dob, form.tob, place]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCityInput = (e) => {
    const q = e.target.value;
    setQuery(q);
    setPlace(null);
    setUtc(null);
    setSuggestions([]);
    clearTimeout(debounceRef.current);
    if (q.trim().length < 2) return;
    debounceRef.current = setTimeout(() => fetchCities(q.trim()), 350);
  };

  const fetchCities = async (q) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/long-lat?city=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setSuggestions(json.data);
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  };

  const selectPlace = (r) => {
    setQuery(`${r.city}, ${r.country}`);
    setSuggestions([]);
    setActiveIdx(-1);
    setPlace({ city: r.city, country: r.country, lat: r.lat, lon: r.lon, tz: r.tz });
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown")  { setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); e.preventDefault(); }
    else if (e.key === "ArrowUp")   { setActiveIdx(i => Math.max(i - 1, 0)); e.preventDefault(); }
    else if (e.key === "Enter" && activeIdx >= 0) { selectPlace(suggestions[activeIdx]); e.preventDefault(); }
    else if (e.key === "Escape")    { setSuggestions([]); }
  };

  const computeUTC = (dob, tob, p) => {
    if (!dob || !tob || !p?.tz) { setUtc(null); return; }
    try {
      const tz = p.tz;
      const pad = (n) => String(n).padStart(2, "0");
      const [y, mo, d] = dob.split("-").map(Number);
      const [h, mi] = tob.split(":").map(Number);
      const roughUTC = Date.UTC(y, mo - 1, d, h, mi, 0);
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false,
      });
      const parts = {};
      formatter.formatToParts(new Date(roughUTC)).forEach(x => (parts[x.type] = x.value));
      const localH = parseInt(parts.hour === "24" ? "0" : parts.hour);
      const localMs = Date.UTC(parseInt(parts.year), parseInt(parts.month) - 1, parseInt(parts.day), localH, parseInt(parts.minute), 0);
      const offsetMs  = localMs - roughUTC;
      const offsetMin = Math.round(offsetMs / 60000);
      const realUTC    = new Date(roughUTC - offsetMs);
      const utcDateStr = `${realUTC.getUTCFullYear()}-${pad(realUTC.getUTCMonth() + 1)}-${pad(realUTC.getUTCDate())}`;
      const utcTimeStr = `${pad(realUTC.getUTCHours())}:${pad(realUTC.getUTCMinutes())}`;
      const absOff    = Math.abs(offsetMin);
      const offsetStr = `UTC${offsetMin >= 0 ? "+" : "-"}${pad(Math.floor(absOff / 60))}:${pad(absOff % 60)}`;
      setUtc({ date: utcDateStr, time: utcTimeStr, offsetStr, offsetMin, localStr: `${dob} ${tob}`, tz });
    } catch (err) {
      console.error("UTC conversion error:", err);
      setUtc(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.dob || !form.tob || !place || !utc) return;
    setSubmitting(true);
    const payload = {
      name: form.name, gender: form.gender,
      dob: form.dob, tob: form.tob,
      city: place.city, country: place.country,
      lat: place.lat, lon: place.lon, tz: place.tz,
      utcDate: utc.date, utcTime: utc.time,
      utcOffsetStr: utc.offsetStr, utcOffsetMin: utc.offsetMin,
    };
    const encoded = btoa(JSON.stringify(payload));
    router.push(`/charts?data=${encoded}`);
  };

  const isReady =
  form.name.trim() &&
  form.gender &&
  form.dob &&
  form.tob &&
  place &&
  utc;

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Decorative background elements */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
      <div style={styles.bgDots} />

      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            Vedic Astrology · Jyotish
          </div>
          <h1 style={styles.title}>Birth Details</h1>
          <p style={styles.subtitle}>Enter your janma kundali details below</p>
          <div style={styles.titleDivider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerSymbol}>✦</span>
            <span style={styles.dividerLine} />
          </div>
        </div>

        {/* Card */}
        <div style={styles.card} className="bd-card">

          {/* Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              required
              style={styles.input} className="bd-input"
              type="text" placeholder="e.g. Arjun Sharma"
              value={form.name} onChange={e => set("name", e.target.value)}
            />
          </div>

          {/* DOB + TOB */}
          <div style={styles.twoCol}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input
                style={styles.input} className="bd-input"
                type="date" value={form.dob}
                onChange={e => set("dob", e.target.value)} required
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Time of Birth</label>
              <input
                style={styles.input} className="bd-input"
                type="time" value={form.tob}
                onChange={e => set("tob", e.target.value)} required
              />
            </div>
          </div>

          {/* City */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Place of Birth</label>
            <div style={{ position: "relative" }} ref={wrapRef}>
              <input
                style={styles.input} className="bd-input"
                type="text" placeholder="Type a city name..."
                autoComplete="off" value={query}
                onChange={handleCityInput} onKeyDown={handleKeyDown}
              />
              {loading && <div className="bd-spinner" />}
              {suggestions.length > 0 && (
                <div style={styles.dropdown}>
                  {suggestions.map((r, i) => {
                    const meta = [r.state, r.country].filter(Boolean).join(", ");
                    return (
                      <div
                        key={i}
                        style={{ ...styles.dropItem, ...(activeIdx === i ? styles.dropItemActive : {}) }}
                        className="bd-drop-item"
                        onMouseDown={() => selectPlace(r)}
                      >
                        <span style={styles.dropCity}>{r.city}</span>
                        {meta && <span style={styles.dropMeta}>{meta}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {place && (
              <div style={styles.pillRow}>
                <div style={styles.pill}>
                  <span style={styles.pillLabel}>Coordinates</span>
                  <span style={styles.pillValue}>{place.lat.toFixed(4)}, {place.lon.toFixed(4)}</span>
                </div>
                <div style={styles.pill}>
                  <span style={styles.pillLabel}>Timezone</span>
                  <span style={styles.pillValue}>{place.tz}</span>
                </div>
              </div>
            )}
          </div>

          {/* UTC Box */}
          {utc && (
            <div style={styles.utcBox}>
              <div style={styles.utcHeader}>
                <span style={styles.utcIcon}>⟳</span>
                <span style={styles.utcTitle}>Converted to UTC</span>
              </div>
              <div style={styles.utcGrid}>
                {[
                  { label: "UTC Date", value: utc.date },
                  { label: "UTC Time", value: utc.time },
                  { label: "Offset",   value: utc.offsetStr },
                ].map(({ label, value }) => (
                  <div key={label} style={styles.utcCell}>
                    <span style={styles.utcLabel}>{label}</span>
                    <span style={styles.utcValue}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={styles.utcFooter}>
                <span style={styles.utcFooterLabel}>Local:</span>
                <span style={styles.utcFooterValue}>{utc.localStr}</span>
                <span style={styles.utcFooterTz}>{utc.tz}</span>
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={styles.sectionDivider}>
            <span style={styles.divLine} />
            <span style={styles.divText}>additional details</span>
            <span style={styles.divLine} />
          </div>

          {/* Gender */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Gender </label>
            <div style={styles.genderRow}>
              {[
                { val: "male",   icon: "♂", label: "Male"   },
                { val: "female", icon: "♀", label: "Female" },
                { val: "other",  icon: "◈", label: "Other"  },
              ].map(g => (
                <label
                  key={g.val}
                  style={{ ...styles.genderBtn, ...(form.gender === g.val ? styles.genderBtnSel : {}) }}
                  className={`bd-gender${form.gender === g.val ? " sel" : ""}`}
                >
                  <input
                    required
                    type="radio" name="gender" value={g.val}
                    checked={form.gender === g.val}
                    onChange={() => set("gender", g.val)}
                    style={{ display: "none" }}
                  />
                  <span style={styles.genderIcon}>{g.icon}</span>
                  {g.label}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...((!isReady || submitting) ? styles.submitDisabled : {}),
            }}
            className="bd-submit"
            disabled={!isReady || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <div className="bd-btn-spinner" />
                Calculating...
              </>
            ) : (
              <>
                <svg style={{ width: 17, height: 17, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Calculate Kundali
              </>
            )}
          </button>

          {/* Footer ornament */}
          <div style={styles.cardFooter}>
            <span style={styles.footerDot}>✦</span>
            <span style={styles.footerText}>Jyotish · Light of the Vedas</span>
            <span style={styles.footerDot}>✦</span>
          </div>
        </div>

        <p style={styles.pageFooter}>Your data is used only to calculate your chart</p>
      </div>
    </div>
  );
}

/* ─── Inline styles ───────────────────────────────────────────────────────── */
const C = {
  pageBg:     "#f5f0e8",
  cream:      "#fffdf8",
  white:      "#ffffff",
  amber:      "#a0722a",
  amberLight: "#c8952e",
  amberFaint: "#f0e6cc",
  amberBorder:"rgba(160,114,42,0.2)",
  brown:      "#3d2b0e",
  brownMid:   "#6b4a14",
  brownLight: "#8a6025",
  brownFaint: "rgba(61,43,14,0.08)",
  textPrimary:"#2d1f08",
  textSecond: "#7a5c2a",
  textHint:   "#b8955a",
  darkBtn:    "#2d1f08",
  darkBtnHov: "#1a1005",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: C.pageBg,
    backgroundImage: `
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(200,149,46,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(160,114,42,0.08) 0%, transparent 60%)
    `,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "3rem 1rem 4rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'EB Garamond', Georgia, serif",
  },
  bgCircle1: {
    position: "absolute", top: "-120px", right: "-100px",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(200,149,46,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "absolute", bottom: "-80px", left: "-80px",
    width: 320, height: 320, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(160,114,42,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgDots: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(rgba(160,114,42,0.12) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
    pointerEvents: "none",
    opacity: 0.5,
  },
  inner: { width: "100%", maxWidth: 560, position: "relative", zIndex: 1 },

  header: { textAlign: "center", marginBottom: "2rem" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 7,
    background: C.white, border: `1px solid ${C.amberBorder}`,
    borderRadius: 100, padding: "5px 14px",
    fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase",
    color: C.textSecond, marginBottom: "1rem",
    boxShadow: "0 1px 4px rgba(160,114,42,0.1)",
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: C.amberLight, display: "inline-block",
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 38, fontWeight: 600, color: C.brown,
    letterSpacing: ".04em", margin: "0 0 .5rem",
    lineHeight: 1.1,
  },
  subtitle: { fontSize: 15, color: C.textHint, margin: 0, fontStyle: "italic" },
  titleDivider: { display: "flex", alignItems: "center", gap: 12, margin: "1rem auto 0", maxWidth: 200 },
  dividerLine: { flex: 1, height: 1, background: `rgba(160,114,42,0.2)` },
  dividerSymbol: { fontSize: 10, color: C.amberLight, opacity: 0.6 },

  card: {
    background: C.white,
    border: `1px solid ${C.amberBorder}`,
    borderRadius: 16,
    padding: "2rem 2rem 1.65rem",
    boxShadow: "0 4px 24px rgba(61,43,14,0.08), 0 1px 4px rgba(61,43,14,0.04)",
  },

  fieldGroup: { display: "flex", flexDirection: "column", gap: 7, marginBottom: "1.1rem" },
  label: {
    fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase",
    color: C.textSecond, fontWeight: 500,
  },
  optional: { fontSize: 10, color: C.textHint, letterSpacing: ".08em", textTransform: "none", marginLeft: 4, fontWeight: 400 },
  input: {
    background: "#fdfaf3",
    border: `1px solid rgba(160,114,42,0.22)`,
    borderRadius: 8,
    color: C.textPrimary,
    fontFamily: "'EB Garamond', Georgia, serif",
    fontSize: 16,
    padding: ".65rem .85rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color .2s, box-shadow .2s",
    appearance: "none",
    WebkitAppearance: "none",
  },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.1rem" },

  dropdown: {
    position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0,
    background: C.white,
    border: `1px solid rgba(160,114,42,0.22)`,
    borderRadius: 10, zIndex: 100,
    maxHeight: 220, overflowY: "auto",
    boxShadow: "0 8px 24px rgba(61,43,14,0.1)",
  },
  dropItem: {
    padding: ".6rem .9rem", cursor: "pointer",
    borderBottom: `1px solid rgba(160,114,42,0.07)`,
    display: "flex", flexDirection: "column", gap: 2,
    transition: "background .15s",
  },
  dropItemActive: { background: "rgba(160,114,42,0.06)" },
  dropCity: { fontSize: 15, color: C.textPrimary },
  dropMeta: { fontSize: 12, color: C.textHint },

  pillRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 },
  pill: {
    background: "#fdf7eb",
    border: `1px solid rgba(160,114,42,0.15)`,
    borderRadius: 8, padding: ".5rem .75rem",
    display: "flex", flexDirection: "column", gap: 2,
  },
  pillLabel: { fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: C.textHint },
  pillValue: { fontSize: 13, color: C.brownLight, fontWeight: 500 },

  utcBox: {
    background: "linear-gradient(135deg, #fdf7eb 0%, #fff9f0 100%)",
    border: `1px solid rgba(160,114,42,0.2)`,
    borderRadius: 10, padding: "1rem 1.15rem", marginBottom: "1.1rem",
    marginTop: "-0.2rem",
  },
  utcHeader: { display: "flex", alignItems: "center", gap: 6, marginBottom: ".6rem" },
  utcIcon: { fontSize: 14, color: C.amberLight },
  utcTitle: { fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: C.textHint },
  utcGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".5rem", marginBottom: ".65rem" },
  utcCell: { display: "flex", flexDirection: "column", gap: 3 },
  utcLabel: { fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: C.textHint },
  utcValue: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 18, fontWeight: 600, color: C.brownMid, letterSpacing: ".03em",
  },
  utcFooter: {
    borderTop: `1px solid rgba(160,114,42,0.12)`,
    paddingTop: ".6rem",
    display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
  },
  utcFooterLabel: { fontSize: 12, color: C.textHint },
  utcFooterValue: { fontSize: 13, color: C.textSecond },
  utcFooterTz: { fontSize: 12, color: C.textHint, marginLeft: "auto" },

  sectionDivider: {
    display: "flex", alignItems: "center", gap: 10,
    margin: ".5rem 0 1.1rem",
  },
  divLine: { flex: 1, height: 1, background: "rgba(160,114,42,0.12)" },
  divText: { fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: C.textHint, whiteSpace: "nowrap" },

  genderRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  genderBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: ".6rem .5rem",
    border: `1px solid rgba(160,114,42,0.2)`,
    borderRadius: 8, background: "#fdfaf3",
    fontFamily: "'EB Garamond', Georgia, serif",
    fontSize: 15, color: C.textSecond,
    cursor: "pointer", transition: "all .2s",
    userSelect: "none",
  },
  genderBtnSel: {
    borderColor: C.amber,
    background: "rgba(160,114,42,0.08)",
    color: C.brownMid,
  },
  genderIcon: { fontSize: 14 },

  submitBtn: {
    width: "100%", height: 52,
    marginTop: "1.5rem",
    background: C.darkBtn,
    border: `1.5px solid ${C.darkBtn}`,
    borderRadius: 10,
    color: "#f5e8c8",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 19, fontWeight: 600,
    letterSpacing: ".1em",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    transition: "all .2s",
    boxShadow: "0 4px 14px rgba(61,43,14,0.25)",
  },
  submitDisabled: {
    background: "#c4b8a4",
    border: "1.5px solid #c4b8a4",
    color: "#f5f0e8",
    cursor: "not-allowed",
    boxShadow: "none",
    opacity: 0.7,
  },

  cardFooter: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    marginTop: "1.4rem",
  },
  footerDot: { fontSize: 8, color: "rgba(160,114,42,0.3)" },
  footerText: { fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(160,114,42,0.35)" },

  pageFooter: {
    textAlign: "center", marginTop: "1.25rem",
    fontSize: 12, color: "rgba(160,114,42,0.4)",
    fontStyle: "italic",
  },
};

/* ─── CSS (spinner + hover states + focus) ────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

  .bd-input::placeholder { color: rgba(160,114,42,0.28); }
  .bd-input:focus {
    border-color: rgba(160,114,42,0.5) !important;
    box-shadow: 0 0 0 3px rgba(160,114,42,0.08) !important;
    background: #fffdf6 !important;
  }
  .bd-input[type="date"]::-webkit-calendar-picker-indicator,
  .bd-input[type="time"]::-webkit-calendar-picker-indicator {
    opacity: 0.4; cursor: pointer;
  }

  .bd-drop-item:hover { background: rgba(160,114,42,0.06) !important; }
  .bd-drop-item:last-child { border-bottom: none !important; }

  .bd-gender:hover:not(.sel) {
    border-color: rgba(160,114,42,0.38) !important;
    color: #6b4a14 !important;
    background: #fdf7eb !important;
  }

  .bd-submit:hover:not(:disabled) {
    background: #1a1005 !important;
    box-shadow: 0 6px 20px rgba(61,43,14,0.32) !important;
    transform: translateY(-1px);
  }
  .bd-submit:active:not(:disabled) { transform: translateY(0); }

  .bd-spinner {
    position: absolute; right: .8rem; top: 50%; transform: translateY(-50%);
    width: 15px; height: 15px;
    border: 1.5px solid rgba(160,114,42,0.2);
    border-top-color: rgba(160,114,42,0.7);
    border-radius: 50%;
    animation: bd-spin .7s linear infinite;
  }
  @keyframes bd-spin { to { transform: translateY(-50%) rotate(360deg); } }

  .bd-btn-spinner {
    width: 15px; height: 15px;
    border: 1.5px solid rgba(245,232,200,0.3);
    border-top-color: #f5e8c8;
    border-radius: 50%;
    animation: bd-spin2 .7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes bd-spin2 { to { transform: rotate(360deg); } }

  @media(max-width:480px) {
    .bd-two-col { grid-template-columns: 1fr !important; }
  }
`;
