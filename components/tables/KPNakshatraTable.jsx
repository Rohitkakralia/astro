"use client";
import React from "react";

/*──────────────────────────────
  CONSTANTS
──────────────────────────────*/
const DASHA_SEQUENCE = [
  "Ketu","Venus","Sun","Moon","Mars",
  "Rahu","Jupiter","Saturn","Mercury"
];

const DASHA_YEARS = {
  Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7,
  Rahu:18, Jupiter:16, Saturn:19, Mercury:17
};

const BASE_LORDS = [
  "Ketu","Venus","Sun","Moon","Mars",
  "Rahu","Jupiter","Saturn","Mercury"
];

// ✅ Safe (no reference bug)
const NAKSHATRA_LORDS = [...BASE_LORDS, ...BASE_LORDS, ...BASE_LORDS];

const NAKSHATRA_NAMES = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mool","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha",
  "Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
];

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const SIGN_LORDS = {
  Aries:"Mars", Taurus:"Venus", Gemini:"Mercury", Cancer:"Moon",
  Leo:"Sun", Virgo:"Mercury", Libra:"Venus", Scorpio:"Mars",
  Sagittarius:"Jupiter", Capricorn:"Saturn", Aquarius:"Saturn", Pisces:"Jupiter"
};

const NAK_SIZE = 360 / 27;
const TOTAL_DASHA = 120;

/*──────────────────────────────
  KP CORE FUNCTION (FIXED)
──────────────────────────────*/
function getKPLords(longitude) {
  if (longitude == null) return {};

  const NAK_SIZE = 360 / 27;   // 13.3333...°
  const TOTAL = 120;

  // ── SIGN ──────────────────────────────────────────────────────────────
  const signIndex = Math.floor(longitude / 30);
  const sign      = SIGNS[signIndex];
  const signLord  = SIGN_LORDS[sign];

  // ── NAKSHATRA ─────────────────────────────────────────────────────────
  const nakIndex  = Math.floor(longitude / NAK_SIZE);
  const nakStart  = nakIndex * NAK_SIZE;
  const offset    = longitude - nakStart;   // 0 → 13.333° within this nak
  const starLord  = NAKSHATRA_LORDS[nakIndex];

  // PADA + STAR label
  const pada = Math.floor(offset / (NAK_SIZE / 4)) + 1;
  const star = `${NAKSHATRA_NAMES[nakIndex]}-${pada}`;

  // ── HELPER: find which segment offset falls in ────────────────────────
  // Returns { lord, segSize, segStartOffset }
  // segStartOffset = cumulative start of matched segment (relative to rangeStart=0)
  // Sequence of 9 lords starts from startLord; each segment size = (years/120)*parentSize
  function findSegment(offsetInRange, startLord, parentSize) {
    const idx = DASHA_SEQUENCE.indexOf(startLord);
    let cum = 0;
    for (let i = 0; i < 9; i++) {
      const lord    = DASHA_SEQUENCE[(idx + i) % 9];
      const segSize = (DASHA_YEARS[lord] / TOTAL) * parentSize;
      const segEnd  = cum + segSize;
      // last segment catches everything remaining (floating point safety)
      if (offsetInRange < segEnd || i === 8) {
        return { lord, segSize, segStart: cum };
      }
      cum = segEnd;
    }
  }

  // ── SUB ───────────────────────────────────────────────────────────────
  const sub = findSegment(offset, starLord, NAK_SIZE);
  const subLord = sub.lord;

  // offset within the sub segment
  const subOffset = offset - sub.segStart;

  // ── SS ────────────────────────────────────────────────────────────────
  const ss = findSegment(subOffset, subLord, sub.segSize);
  const ssLord = ss.lord;

  // offset within the SS segment
  const ssOffset = subOffset - ss.segStart;

  // ── SSS ───────────────────────────────────────────────────────────────
  const sss = findSegment(ssOffset, ssLord, ss.segSize);
  const sssLord = sss.lord;

  // ── DEGREE FORMAT ─────────────────────────────────────────────────────
  const degInSign = longitude % 30;
  const d = Math.floor(degInSign);
  const m = Math.floor((degInSign % 1) * 60);
  const s = Math.floor((((degInSign % 1) * 60) % 1) * 60);
  const position = `${d}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

  return { sign, signLord, star, starLord, subLord, ssLord, sssLord, position };
}

/*──────────────────────────────
  TABLE COMPONENT
──────────────────────────────*/
export default function KPNakshatraTable({ dashaData }) {
  if (!dashaData?.house_cusps) return null;

  const SIGN_ABBR = {
    Aries:"Ari", Taurus:"Tau", Gemini:"Gem", Cancer:"Can",
    Leo:"Leo", Virgo:"Vir", Libra:"Lib", Scorpio:"Sco",
    Sagittarius:"Sag", Capricorn:"Cap", Aquarius:"Aqu", Pisces:"Pis"
  };

  const rows = dashaData.house_cusps.map((cusp, i) => {
    const kp = getKPLords(cusp);

    return {
      house: i + 1,
      sign: SIGN_ABBR[kp.sign] ?? "-",
      position: kp.position,
      star: kp.star,
      signLord: kp.signLord,
      starLord: kp.starLord,
      subLord: kp.subLord,
      ssLord: kp.ssLord,
      sssLord: kp.sssLord,
    };
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-amber-200/60 shadow-sm">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-stone-100">
            {["House","Sign","Position","Star","Sign Lord","Star Lord","Sub Lord","SS Lord","SSS Lord"]
              .map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
              ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={row.house} className={i % 2 === 0 ? "bg-white" : "bg-amber-50/40"}>
              <td className="px-3 py-2 font-bold">{row.house}</td>
              <td className="px-3 py-2">{row.sign}</td>
              <td className="px-3 py-2 font-mono">{row.position}</td>
              <td className="px-3 py-2">{row.star}</td>
              <td className="px-3 py-2">{row.signLord}</td>
              <td className="px-3 py-2">{row.starLord}</td>
              <td className="px-3 py-2">{row.subLord}</td>
              <td className="px-3 py-2">{row.ssLord}</td>
              <td className="px-3 py-2">{row.sssLord}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}