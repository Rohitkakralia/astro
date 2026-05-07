"use client";
import React from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDMS(decimal, posDir, negDir) {
  if (decimal == null || isNaN(decimal)) return "—";
  const dir = decimal >= 0 ? posDir : negDir;
  const abs = Math.abs(decimal);
  const deg = Math.floor(abs);
  const min = Math.floor((abs - deg) * 60);
  return `${deg} : ${String(min).padStart(2, "0")} : ${dir}`;
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2 || parts.some(isNaN)) return null;
  return parts[0] + parts[1] / 60 + (parts[2] || 0) / 3600;
}

function toHMS(decimalHours) {
  if (decimalHours == null || isNaN(decimalHours)) return "—";
  const abs = Math.abs(decimalHours);
  const h   = Math.floor(abs);
  const mF  = (abs - h) * 60;
  const m   = Math.floor(mF);
  const s   = Math.round((mF - m) * 60);
  return `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}.${String(s).padStart(2, "0")}`;
}

function addToTime(timeStr, hoursToAdd) {
  const dec = parseTime(timeStr);
  if (dec == null) return "—";
  return toHMS(((dec + hoursToAdd) % 24 + 24) % 24);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PersonDetails({ payload, data }) {
  if (!payload) return null;

  const lat = parseFloat(payload.lat);
  const lon = parseFloat(payload.lon);

  // utcOffsetMin is always a number (e.g. 330 for IST).
  // payload.timezone may be a string like "Asia/Kolkata" — never use it as a number.
  const tzHours = payload.utcOffsetMin != null
    ? payload.utcOffsetMin / 60          // e.g. 330 / 60 = 5.5
    : null;

  // Local Time Correction = (lon - stdMeridian) / 15 hours
  // stdMeridian = tzHours * 15
  const ltcHours = tzHours != null
    ? (lon - tzHours * 15) / 15
    : null;

  const ltcSign    = ltcHours != null && ltcHours < 0 ? "-" : "";
  const ltcDisplay = ltcHours != null
    ? `${ltcSign}${toHMS(Math.abs(ltcHours))}`
    : "—";

  const lmtDisplay = ltcHours != null ? addToTime(payload.tob, ltcHours) : "—";
  const gmtDisplay = tzHours  != null ? addToTime(payload.tob, -tzHours) : "—";

  const tzDisplay = tzHours != null
    ? `${tzHours >= 0 ? "+" : ""}${tzHours}`
    : (payload.timezone || "—");

  const rows = [
    { label: "Date of Birth",          value: payload.dob      || "—" },
    { label: "Time of Birth",          value: payload.tob      || "—" },
    { label: "Place of Birth",         value: [payload.city, payload.country].filter(Boolean).join(", ") || "—" },
    { label: "Time Zone",              value: tzDisplay },
    { label: "Latitude",               value: toDMS(lat, "N", "S") },
    { label: "Longitude",              value: toDMS(lon, "E", "W") },
    { label: "Local Time Correction",  value: ltcDisplay },
    { label: "War Time Correction",    value: "00.00.00" },
    { label: "LMT at Birth",           value: lmtDisplay },
    { label: "GMT at Birth",           value: gmtDisplay },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#fffdf5" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #d6d3d1",
        fontSize: 13,
      }}>
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr key={i}>
              <td style={{
                padding: "9px 16px",
                fontWeight: 700,
                color: "#1c1917",
                background: i % 2 === 0 ? "#f5f5f4" : "#fafaf9",
                borderBottom: "1px solid #e7e5e4",
                borderRight: "1px solid #e7e5e4",
                width: "50%",
              }}>
                {label}
              </td>
              <td style={{
                padding: "9px 16px",
                color: "#44403c",
                background: i % 2 === 0 ? "#ffffff" : "#fafaf9",
                borderBottom: "1px solid #e7e5e4",
                letterSpacing: "0.02em",
                width: "50%",
              }}>
                {String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}