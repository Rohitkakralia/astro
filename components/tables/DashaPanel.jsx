"use client";
import React, { useState, useMemo } from "react";

// ─── Vimshottari constants ────────────────────────────────────────────────────

const DASHA_YEARS = {
  Sun: 6, Moon: 10, Mars: 7, Rahu: 18,
  Jupiter: 16, Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20,
};
const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const TOTAL_YEARS = 120;
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

// ─── Date helpers ─────────────────────────────────────────────────────────────

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

function isNowActive(start, end) {
  const now = Date.now();
  return new Date(start) <= now && now < new Date(end);
}

function toYm(totalYears) {
  const abs = Math.abs(totalYears);
  const y = Math.floor(abs);
  const m = Math.round((abs - y) * 12);
  return `${y}y ${m}m`;
}

// ─── Core dasha generators (all client-side) ──────────────────────────────────

/**
 * Generate all 9 antardashas for any mahadasha.
 * For the birth (first) mahadasha: reconstruct theoretical start from maha.end,
 * filter to remaining ADs, clamp first AD start to maha.start.
 */
function genAntardashas(mahaLord, mahaStart, mahaEnd, isBirthMaha) {
  const mahaYears = DASHA_YEARS[mahaLord];
  const startIdx = DASHA_ORDER.indexOf(mahaLord);
  const mahaEndMs = new Date(mahaEnd).getTime();
  const theoreticalStartMs = mahaEndMs - mahaYears * MS_PER_YEAR;
  const birthStartMs = new Date(mahaStart).getTime();

  const all = [];
  let cursor = theoreticalStartMs;
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const durMs = (mahaYears * DASHA_YEARS[lord] / TOTAL_YEARS) * MS_PER_YEAR;
    all.push({ lord, start: cursor, end: cursor + durMs });
    cursor += durMs;
  }

  if (isBirthMaha) {
    const remaining = all.filter(a => a.end > birthStartMs);
    if (remaining.length > 0) remaining[0] = { ...remaining[0], start: birthStartMs };
    return remaining.map(a => ({ lord: a.lord, start: new Date(a.start).toISOString(), end: new Date(a.end).toISOString() }));
  }

  return all.map(a => ({ lord: a.lord, start: new Date(a.start).toISOString(), end: new Date(a.end).toISOString() }));
}

/** Pratyantar dashas (sub of AD) */
function genPDs(mdLord, adLord, adStart) {
  const startIdx = DASHA_ORDER.indexOf(adLord);
  let cursor = new Date(adStart).getTime();
  return Array.from({ length: 9 }, (_, i) => {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const durMs = (DASHA_YEARS[mdLord] * DASHA_YEARS[adLord] * DASHA_YEARS[lord]) / (TOTAL_YEARS * TOTAL_YEARS) * MS_PER_YEAR;
    const entry = { lord, start: new Date(cursor).toISOString(), end: new Date(cursor + durMs).toISOString() };
    cursor += durMs;
    return entry;
  });
}

/** Sookshma dashas (sub of PD) */
function genSDs(mdLord, adLord, pdLord, pdStart) {
  const startIdx = DASHA_ORDER.indexOf(pdLord);
  let cursor = new Date(pdStart).getTime();
  return Array.from({ length: 9 }, (_, i) => {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const durMs = (DASHA_YEARS[mdLord] * DASHA_YEARS[adLord] * DASHA_YEARS[pdLord] * DASHA_YEARS[lord]) / (TOTAL_YEARS ** 3) * MS_PER_YEAR;
    const entry = { lord, start: new Date(cursor).toISOString(), end: new Date(cursor + durMs).toISOString() };
    cursor += durMs;
    return entry;
  });
}

/** Prana dashas (sub of SD) */
function genPRs(mdLord, adLord, pdLord, sdLord, sdStart) {
  const startIdx = DASHA_ORDER.indexOf(sdLord);
  let cursor = new Date(sdStart).getTime();
  return Array.from({ length: 9 }, (_, i) => {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const durMs = (DASHA_YEARS[mdLord] * DASHA_YEARS[adLord] * DASHA_YEARS[pdLord] * DASHA_YEARS[sdLord] * DASHA_YEARS[lord]) / (TOTAL_YEARS ** 4) * MS_PER_YEAR;
    const entry = { lord, start: new Date(cursor).toISOString(), end: new Date(cursor + durMs).toISOString() };
    cursor += durMs;
    return entry;
  });
}

function findActive(list) {
  return list.find(d => isNowActive(d.start, d.end)) ?? null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const NowBadge = ({ color = "amber" }) => {
  const colors = {
    amber: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
    blue:  { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
    green: { bg: "#dcfce7", border: "#86efac", text: "#166534" },
    purple:{ bg: "#ede9fe", border: "#c4b5fd", text: "#5b21b6" },
    rose:  { bg: "#ffe4e6", border: "#fda4af", text: "#9f1239" },
  };
  const c = colors[color] ?? colors.amber;
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, letterSpacing: "0.05em",
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: "1px 5px", borderRadius: 4, marginLeft: 5,
      verticalAlign: "middle", display: "inline-block",
    }}>NOW</span>
  );
};

function SectionLabel({ label }) {
  return (
    <div style={{ padding: "4px 14px", background: "#fafaf9", borderBottom: "1px solid #f0ebe0" }}>
      <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a8a29e", fontWeight: 700, margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

function Navigator({ lord, start, end, index, total, isNow, nowColor, canPrev, canNext, onPrev, onNext, emptyMsg }) {
  const btnStyle = (disabled) => ({
    fontSize: 11, fontWeight: 600, color: disabled ? "#d4b896" : "#92400e",
    border: "1px solid", borderColor: disabled ? "#f0e6d0" : "#f59e0b",
    borderRadius: 5, padding: "5px 11px", background: "transparent",
    cursor: disabled ? "not-allowed" : "pointer", transition: "background 0.15s",
    opacity: disabled ? 0.4 : 1,
  });

  if (emptyMsg !== undefined) {
    return <p style={{ padding: "12px 16px", fontSize: 11, color: "#a8a29e", textAlign: "center", margin: 0 }}>{emptyMsg}</p>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px" }}>
      <button onClick={onPrev} disabled={!canPrev} style={btnStyle(!canPrev)}>← Prev</button>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1c1917" }}>{lord ?? "—"}</span>
          {isNow && <NowBadge color={nowColor} />}
        </div>
        <p style={{ fontSize: 10, fontFamily: "monospace", color: "#78716c", marginTop: 2, marginBottom: 0 }}>
          {start && end ? `${fmtDate(start)} → ${fmtDate(end)}` : "—"}
        </p>
        <p style={{ fontSize: 9, color: "#a8a29e", marginTop: 1, marginBottom: 0 }}>{index} / {total}</p>
      </div>
      <button onClick={onNext} disabled={!canNext} style={btnStyle(!canNext)}>Next →</button>
    </div>
  );
}

// ─── Main combined component ──────────────────────────────────────────────────

export default function DashaPanel({ data }) {
  const [tab, setTab] = useState("timeline"); // "timeline" | "table"

  // ── Timeline navigator state ──────────────────────────────────────────────
  const [mdIdx, setMdIdx] = useState(null);
  const [adIdxMap, setAdIdxMap] = useState({});
  const [pdIdxMap, setPdIdxMap] = useState({});
  const [sdIdxMap, setSdIdxMap] = useState({});
  const [prIdxMap, setPrIdxMap] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  if (!data) return null;

  const {
    mahadasha_timeline = [],
    antardasha_timeline: apiAntardashas = [],
    pratyantar_timeline: apiPDs = [],
    sookshma_timeline: apiSDs = [],
    prana_timeline: apiPRs = [],
    current_mahadasha,
    current_adl,
    current_pd: api_current_pd,
    current_sd: api_current_sd,
    current_pr: api_current_pr,
    birth_mahadasha,
  } = data;

  // ── Build all blocks for the table view ───────────────────────────────────

  const sortedMDs = useMemo(
    () => [...mahadasha_timeline].sort((a, b) => new Date(a.start) - new Date(b.start)),
    [mahadasha_timeline]
  );

  const firstStart = sortedMDs[0]?.start ? new Date(sortedMDs[0].start) : null;
  const yearOffset = (dateStr) => (!firstStart || !dateStr) ? 0 : (new Date(dateStr) - firstStart) / MS_PER_YEAR;

  const tableBlocks = useMemo(() => {
    return sortedMDs.map((maha, idx) => {
      // Use API antars when available (current MD), otherwise compute client-side
      const apiAntars = apiAntardashas
        .filter(a => new Date(a.start) >= new Date(maha.start) && new Date(a.start) < new Date(maha.end))
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      const antars = apiAntars.length > 0
        ? apiAntars
        : genAntardashas(maha.lord, maha.start, maha.end, idx === 0);

      return { maha, antars };
    });
  }, [sortedMDs, apiAntardashas]);

  // ── Timeline navigator derivations ───────────────────────────────────────

  const currentMDIdx = mahadasha_timeline.findIndex(
    md => current_mahadasha?.lord === md.lord && new Date(md.start).getTime() === new Date(current_mahadasha.start).getTime()
  );

  const activeMDIdx = mdIdx ?? (currentMDIdx >= 0 ? currentMDIdx : 0);
  const viewingMD = mahadasha_timeline[activeMDIdx] ?? null;
  const isCurrentMD = activeMDIdx === currentMDIdx;

  // Generate antardashas for the viewed MD entirely client-side
  const mdsADs = useMemo(() => {
    if (!viewingMD) return [];
    // For current MD use API antars if available
    if (isCurrentMD && apiAntardashas.length > 0) {
      return [...apiAntardashas].sort((a, b) => new Date(a.end) - new Date(b.end));
    }
    const isBirth = activeMDIdx === 0;
    return genAntardashas(viewingMD.lord, viewingMD.start, viewingMD.end, isBirth);
  }, [viewingMD, isCurrentMD, apiAntardashas, activeMDIdx]);

  const currentADIdxInList = isCurrentMD && current_adl
    ? mdsADs.findIndex(ad => ad.lord === current_adl.lord)
    : -1;

  const activeADIdx = (() => {
    if (adIdxMap[activeMDIdx] !== undefined) return Math.max(0, Math.min(mdsADs.length - 1, adIdxMap[activeMDIdx]));
    return currentADIdxInList >= 0 ? currentADIdxInList : 0;
  })();

  const viewingAD = mdsADs[activeADIdx] ?? null;
  const isCurrentAD = isCurrentMD && activeADIdx === currentADIdxInList;
  const adKey = `${activeMDIdx}-${activeADIdx}`;
  const isCurrentCombo = isCurrentMD && isCurrentAD;

  // Generate PDs client-side for ANY MD+AD combo
  const availablePDs = useMemo(() => {
    if (!viewingMD || !viewingAD) return [];
    if (isCurrentCombo && apiPDs.length > 0) return apiPDs;
    return genPDs(viewingMD.lord, viewingAD.lord, viewingAD.start);
  }, [viewingMD, viewingAD, isCurrentCombo, apiPDs]);

  const currentPDIdxInList = isCurrentCombo && api_current_pd
    ? availablePDs.findIndex(pd => pd.lord === api_current_pd.lord && new Date(pd.start).getTime() === new Date(api_current_pd.start).getTime())
    : findActive(availablePDs) ? availablePDs.findIndex(pd => isNowActive(pd.start, pd.end)) : -1;

  const activePDIdx = (() => {
    if (pdIdxMap[adKey] !== undefined) return Math.max(0, Math.min(availablePDs.length - 1, pdIdxMap[adKey]));
    return currentPDIdxInList >= 0 ? currentPDIdxInList : 0;
  })();

  const viewingPD = availablePDs[activePDIdx] ?? null;
  const isCurrentPD = currentPDIdxInList >= 0 && activePDIdx === currentPDIdxInList;
  const pdKey = `${adKey}-${activePDIdx}`;
  const isCurrentPDCombo = isCurrentCombo && isCurrentPD;

  // Generate SDs client-side
  const availableSDs = useMemo(() => {
    if (!viewingMD || !viewingAD || !viewingPD) return [];
    if (isCurrentPDCombo && apiSDs.length > 0) return apiSDs;
    return genSDs(viewingMD.lord, viewingAD.lord, viewingPD.lord, viewingPD.start);
  }, [viewingMD, viewingAD, viewingPD, isCurrentPDCombo, apiSDs]);

  const currentSDIdxInList = isCurrentPDCombo && api_current_sd
    ? availableSDs.findIndex(sd => sd.lord === api_current_sd.lord && new Date(sd.start).getTime() === new Date(api_current_sd.start).getTime())
    : availableSDs.findIndex(sd => isNowActive(sd.start, sd.end));

  const activeSDIdx = (() => {
    if (sdIdxMap[pdKey] !== undefined) return Math.max(0, Math.min(availableSDs.length - 1, sdIdxMap[pdKey]));
    return currentSDIdxInList >= 0 ? currentSDIdxInList : 0;
  })();

  const viewingSD = availableSDs[activeSDIdx] ?? null;
  const isCurrentSD = currentSDIdxInList >= 0 && activeSDIdx === currentSDIdxInList;
  const sdKey = `${pdKey}-${activeSDIdx}`;
  const isCurrentSDCombo = isCurrentPDCombo && isCurrentSD;

  // Generate PRs client-side
  const availablePRs = useMemo(() => {
    if (!viewingMD || !viewingAD || !viewingPD || !viewingSD) return [];
    if (isCurrentSDCombo && apiPRs.length > 0) return apiPRs;
    return genPRs(viewingMD.lord, viewingAD.lord, viewingPD.lord, viewingSD.lord, viewingSD.start);
  }, [viewingMD, viewingAD, viewingPD, viewingSD, isCurrentSDCombo, apiPRs]);

  const currentPRIdxInList = isCurrentSDCombo && api_current_pr
    ? availablePRs.findIndex(pr => pr.lord === api_current_pr.lord && new Date(pr.start).getTime() === new Date(api_current_pr.start).getTime())
    : availablePRs.findIndex(pr => isNowActive(pr.start, pr.end));

  const activePRIdx = (() => {
    if (prIdxMap[sdKey] !== undefined) return Math.max(0, Math.min(availablePRs.length - 1, prIdxMap[sdKey]));
    return currentPRIdxInList >= 0 ? currentPRIdxInList : 0;
  })();

  const viewingPR = availablePRs[activePRIdx] ?? null;
  const isCurrentPR = currentPRIdxInList >= 0 && activePRIdx === currentPRIdxInList;

  // Navigation helpers
  const goMD = (i) => { setMdIdx(i); };
  const goAD = (i) => setAdIdxMap(p => ({ ...p, [activeMDIdx]: i }));
  const goPD = (i) => setPdIdxMap(p => ({ ...p, [adKey]: i }));
  const goSD = (i) => setSdIdxMap(p => ({ ...p, [pdKey]: i }));
  const goPR = (i) => setPrIdxMap(p => ({ ...p, [sdKey]: i }));

  // Date search
  const handleDateSearch = () => {
    if (!searchDate) return;
    const searchTs = new Date(searchDate).getTime();

    const foundMDIdx = mahadasha_timeline.findIndex(
      md => searchTs >= new Date(md.start).getTime() && searchTs < new Date(md.end).getTime()
    );

    if (foundMDIdx < 0) { setSearchResult({ notFound: true }); return; }

    const md = mahadasha_timeline[foundMDIdx];
    const isBirth = foundMDIdx === 0;
    const allADs = genAntardashas(md.lord, md.start, md.end, isBirth);

    const foundADIdx = allADs.findIndex(
      a => searchTs >= new Date(a.start).getTime() && searchTs < new Date(a.end).getTime()
    );
    const ad = allADs[foundADIdx >= 0 ? foundADIdx : 0];

    const pds = genPDs(md.lord, ad.lord, ad.start);
    const foundPDIdx = pds.findIndex(p => searchTs >= new Date(p.start).getTime() && searchTs < new Date(p.end).getTime());
    const pd = pds[foundPDIdx >= 0 ? foundPDIdx : 0];

    const sds = genSDs(md.lord, ad.lord, pd.lord, pd.start);
    const foundSDIdx = sds.findIndex(s => searchTs >= new Date(s.start).getTime() && searchTs < new Date(s.end).getTime());
    const sd = sds[foundSDIdx >= 0 ? foundSDIdx : 0];

    const prs = genPRs(md.lord, ad.lord, pd.lord, sd.lord, sd.start);
    const foundPRIdx = prs.findIndex(p => searchTs >= new Date(p.start).getTime() && searchTs < new Date(p.end).getTime());
    const pr = prs[foundPRIdx >= 0 ? foundPRIdx : 0];

    // Jump navigator
    setMdIdx(foundMDIdx);
    setAdIdxMap(p => ({ ...p, [foundMDIdx]: foundADIdx >= 0 ? foundADIdx : 0 }));
    const newAdKey = `${foundMDIdx}-${foundADIdx >= 0 ? foundADIdx : 0}`;
    setPdIdxMap(p => ({ ...p, [newAdKey]: foundPDIdx >= 0 ? foundPDIdx : 0 }));

    setSearchResult({ md, ad, pd, sd, pr, date: searchDate });
  };

  // ── Shared header summary ────────────────────────────────────────────────

  const headerBadge = (label, lord, end) => lord ? (
    <span key={label} style={{ marginLeft: 4 }}>
      · <span style={{ color: "#9c7240", fontSize: 10 }}>{label}:</span>{" "}
      <span style={{ fontWeight: 700, color: "#78350f" }}>{lord}</span>
      <span style={{ color: "#b09060", fontSize: 10 }}> (→ {fmtDate(end)})</span>
    </span>
  ) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  const panelStyle = {
    background: "#fff",
    border: "1px solid #f5e6c8",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(180,140,60,0.07)",
    fontFamily: "system-ui, sans-serif",
  };

  const tabBtnStyle = (active) => ({
    fontSize: 11, fontWeight: active ? 700 : 500,
    color: active ? "#92400e" : "#a8a29e",
    borderBottom: active ? "2px solid #f59e0b" : "2px solid transparent",
    background: "transparent", border: "none", borderBottomWidth: 2,
    borderBottomStyle: "solid", borderBottomColor: active ? "#f59e0b" : "transparent",
    padding: "8px 14px", cursor: "pointer", letterSpacing: "0.05em",
    textTransform: "uppercase",
  });

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f5e6c8" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1c1917", margin: "0 0 4px" }}>Dasha</p>
        {current_mahadasha && (
          <p style={{ fontSize: 10, color: "#b09060", margin: 0, lineHeight: 1.7 }}>
            <span style={{ color: "#9c7240" }}>MD:</span>{" "}
            <span style={{ fontWeight: 700, color: "#78350f" }}>{current_mahadasha.lord}</span>
            <span style={{ color: "#b09060" }}> ({fmtDate(current_mahadasha.start)} → {fmtDate(current_mahadasha.end)})</span>
            {headerBadge("AD", current_adl?.lord, current_adl?.end)}
            {headerBadge("PD", api_current_pd?.lord, api_current_pd?.end)}
            {headerBadge("SD", api_current_sd?.lord, api_current_sd?.end)}
            {headerBadge("PR", api_current_pr?.lord, api_current_pr?.end)}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #f5e6c8", background: "#fffdf8" }}>
        <button style={tabBtnStyle(tab === "timeline")} onClick={() => setTab("timeline")}>
          Navigator
        </button>
        <button style={tabBtnStyle(tab === "table")} onClick={() => setTab("table")}>
          Full Table
        </button>
      </div>

      {/* ── TIMELINE TAB ── */}
      {tab === "timeline" && (
        <div>
          {/* Date search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "10px 14px", borderBottom: "1px solid #f5e6c8" }}>
            <i className="ti ti-calendar-search" style={{ color: "#c4a065", fontSize: 16 }} aria-hidden="true" />
            <input
              type="date"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
              style={{ fontSize: 11, border: "1px solid #f5e6c8", borderRadius: 6, padding: "5px 9px", background: "#fffdf5", color: "#1c1917", outline: "none" }}
            />
            <button
              onClick={handleDateSearch}
              style={{ fontSize: 11, fontWeight: 600, color: "#92400e", border: "1px solid #f59e0b", borderRadius: 6, padding: "5px 12px", background: "transparent", cursor: "pointer" }}
            >
              Find dasha
            </button>
            {searchResult && (
              <button
                onClick={() => { setSearchResult(null); setSearchDate(""); }}
                style={{ fontSize: 11, color: "#a8a29e", border: "1px solid #e7e0d5", borderRadius: 6, padding: "5px 9px", background: "transparent", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Search result */}
          {searchResult && (
            <div style={{ margin: "8px 14px", background: "#fffbeb", border: "1px solid #f5e6c8", borderRadius: 8, padding: "10px 14px" }}>
              {searchResult.notFound ? (
                <p style={{ fontSize: 11, color: "#a8a29e", margin: 0 }}>No dasha found for this date.</p>
              ) : (
                <>
                  <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#c4a065", fontWeight: 700, margin: "0 0 8px" }}>
                    Dasha on {searchResult.date}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                    {[
                      { label: "MD", d: searchResult.md },
                      { label: "AD", d: searchResult.ad },
                      { label: "PD", d: searchResult.pd },
                      { label: "SD", d: searchResult.sd },
                      { label: "PR", d: searchResult.pr },
                    ].map(({ label, d }) => d && (
                      <div key={label} style={{ background: "#fff", border: "1px solid #f5e6c8", borderRadius: 6, padding: "6px 9px" }}>
                        <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a8a29e", margin: "0 0 2px" }}>{label}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1c1917", margin: "0 0 2px" }}>{d.lord}</p>
                        <p style={{ fontSize: 9, fontFamily: "monospace", color: "#c4a065", margin: 0 }}>
                          {fmtDate(d.start)} →<br />{fmtDate(d.end)}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigator sections */}
          {[
            {
              label: "Mahadasha",
              lord: viewingMD?.lord, start: viewingMD?.start, end: viewingMD?.end,
              index: activeMDIdx + 1, total: mahadasha_timeline.length,
              isNow: isCurrentMD, nowColor: "amber",
              canPrev: activeMDIdx > 0, canNext: activeMDIdx < mahadasha_timeline.length - 1,
              onPrev: () => goMD(activeMDIdx - 1), onNext: () => goMD(activeMDIdx + 1),
            },
            {
              label: "Antardasha",
              lord: viewingAD?.lord, start: viewingAD?.start, end: viewingAD?.end,
              index: activeADIdx + 1, total: mdsADs.length,
              isNow: isCurrentAD, nowColor: "blue",
              canPrev: activeADIdx > 0, canNext: activeADIdx < mdsADs.length - 1,
              onPrev: () => goAD(activeADIdx - 1), onNext: () => goAD(activeADIdx + 1),
              emptyMsg: mdsADs.length === 0 ? "No antardasha data" : undefined,
            },
            {
              label: "Pratyantar Dasha",
              lord: viewingPD?.lord, start: viewingPD?.start, end: viewingPD?.end,
              index: activePDIdx + 1, total: availablePDs.length,
              isNow: isCurrentPD, nowColor: "green",
              canPrev: activePDIdx > 0, canNext: activePDIdx < availablePDs.length - 1,
              onPrev: () => goPD(activePDIdx - 1), onNext: () => goPD(activePDIdx + 1),
            },
            {
              label: "Sookshma Dasha",
              lord: viewingSD?.lord, start: viewingSD?.start, end: viewingSD?.end,
              index: activeSDIdx + 1, total: availableSDs.length,
              isNow: isCurrentSD, nowColor: "purple",
              canPrev: activeSDIdx > 0, canNext: activeSDIdx < availableSDs.length - 1,
              onPrev: () => goSD(activeSDIdx - 1), onNext: () => goSD(activeSDIdx + 1),
            },
            {
              label: "Prana Dasha",
              lord: viewingPR?.lord, start: viewingPR?.start, end: viewingPR?.end,
              index: activePRIdx + 1, total: availablePRs.length,
              isNow: isCurrentPR, nowColor: "rose",
              canPrev: activePRIdx > 0, canNext: activePRIdx < availablePRs.length - 1,
              onPrev: () => goPR(activePRIdx - 1), onNext: () => goPR(activePRIdx + 1),
            },
          ].map(({ label, ...props }, i, arr) => (
            <div key={label} style={{ borderBottom: i < arr.length - 1 ? "1px solid #f5e6c8" : "none" }}>
              <SectionLabel label={label} />
              <Navigator {...props} />
            </div>
          ))}
        </div>
      )}

      {/* ── TABLE TAB ── */}
      {tab === "table" && (
        <div style={{ padding: "14px 12px", background: "#fffdf5" }}>
          {birth_mahadasha && (
            <p style={{ fontSize: 11, color: "#78716c", textAlign: "center", margin: "0 0 12px", fontStyle: "italic" }}>
              Balance at birth: <strong>{birth_mahadasha.mahadashaLord}</strong> {birth_mahadasha.balanceYears?.toFixed(2)}y
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px 14px" }}>
            {tableBlocks.map(({ maha, antars }, bi) => {
              const mahaActive = isNowActive(maha.start, maha.end);
              const fromY = yearOffset(maha.start);
              const toY = yearOffset(maha.end);
              return (
                <div key={bi}>
                  <div style={{ marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1c1917", fontFamily: "Georgia, serif" }}>
                      {maha.lord} ({DASHA_YEARS[maha.lord]}y)
                    </span>
                    {mahaActive && <NowBadge color="amber" />}
                  </div>
                  <div style={{ fontSize: 10, color: "#78716c", marginBottom: 3, fontStyle: "italic" }}>
                    {toYm(fromY)} → {toYm(toY)}
                  </div>
                  <div style={{ borderTop: "1.5px solid #374151", marginBottom: 0 }} />
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Antar", "From", "To"].map(h => (
                          <th key={h} style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", borderBottom: "1.5px solid #9ca3af", padding: "3px 6px", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em", background: "transparent" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {antars.map((a, ai) => {
                        const active = mahaActive && isNowActive(a.start, a.end);
                        return (
                          <tr key={ai} style={{ background: active ? "#fef9c3" : "transparent" }}>
                            <td style={{ fontSize: 11, padding: "3px 6px", borderBottom: "1px solid #e5e7eb", fontWeight: active ? 700 : 400, color: active ? "#854d0e" : "#1f2937", whiteSpace: "nowrap" }}>
                              {active ? "▶ " : ""}{a.lord}
                            </td>
                            <td style={{ fontSize: 10, padding: "3px 6px", borderBottom: "1px solid #e5e7eb", color: "#4b5563", whiteSpace: "nowrap", fontFamily: "monospace" }}>{fmtDate(a.start)}</td>
                            <td style={{ fontSize: 10, padding: "3px 6px", borderBottom: "1px solid #e5e7eb", color: "#4b5563", whiteSpace: "nowrap", fontFamily: "monospace" }}>{fmtDate(a.end)}</td>
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
      )}
    </div>
  );
}