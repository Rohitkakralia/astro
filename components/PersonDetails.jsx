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

// Normalize any time string to HH.MM.SS display format
function normalizeTime(timeStr) {
  if (!timeStr) return "—";
  // Already HH:MM:SS — just swap separators
  return timeStr.replace(/:/g, ".");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PersonDetails({ payload, data }) {
  if (!payload) return null;

  const pd = data?.person_details;  // backend response

  const lat = parseFloat(payload.lat);
  const lon = parseFloat(payload.lon);

  const tzHours = payload.utcOffsetMin != null
    ? payload.utcOffsetMin / 60
    : null;

  const ltcHours = tzHours != null
    ? (lon - tzHours * 15) / 15
    : null;

  const ltcSign    = ltcHours != null && ltcHours < 0 ? "-" : "";
  const ltcDisplay = ltcHours != null
    ? `${ltcSign}${toHMS(Math.abs(ltcHours))}`
    : "—";

  const tzDisplay = tzHours != null
    ? `${tzHours >= 0 ? "+" : ""}${tzHours}`
    : (payload.timezone || "—");

  // ── Prefer backend values, fall back to frontend calculations ──
  const rows = [
    {
      label: "Date of Birth",
      value: payload.dob || "—",
    },
    {
      label: "Time of Birth",
      value: payload.tob || "—",
    },
    {
      label: "Place of Birth",
      value: [payload.city, payload.country].filter(Boolean).join(", ") || "—",
    },
    {
      label: "Time Zone",
      value: tzDisplay,
    },
    {
      label: "Latitude",
      value: pd?.latitude ?? toDMS(lat, "N", "S"),
    },
    {
      label: "Longitude",
      value: pd?.longitude ?? toDMS(lon, "E", "W"),
    },
    {
      label: "Local Time Correction",
      value: pd?.local_time_correction
        ? normalizeTime(pd.local_time_correction)
        : ltcDisplay,
    },
    {
      label: "War Time Correction",
      value: pd?.war_time_correction
        ? normalizeTime(pd.war_time_correction)
        : "00.00.00",
    },
    {
      label: "LMT at Birth",
      value: pd?.lmt_at_birth
        ? normalizeTime(pd.lmt_at_birth)
        : (ltcHours != null ? addToTime(payload.tob, ltcHours) : "—"),
    },
    {
      label: "GMT at Birth",
      value: pd?.gmt_at_birth
        ? normalizeTime(pd.gmt_at_birth)
        : (tzHours != null ? addToTime(payload.tob, -tzHours) : "—"),
    },
    {
      label: "Tithi",
      value: pd?.tithi ?? "—",
    },
    {
      label: "Paksha",
      value: pd?.paksha ?? "—",
    },
    {
      label: "Hindu Week Day",
      value: pd?.hindu_week_day ?? "—",
    },
    {
      label: "Yoga",
      value: pd?.yoga ?? "—",
    },
    {
      label: "Karan",
      value: pd?.karan ?? "—",
    },
    {
      label: "Sunrise",
      value: pd?.sunrise ? normalizeTime(pd.sunrise) : "—",
    },
    {
      label: "Sunset",
      value: pd?.sunset ? normalizeTime(pd.sunset) : "—",
    },
    {
      label: "Day Duration",
      value: pd?.day_duration ? normalizeTime(pd.day_duration) : "—",
    },
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