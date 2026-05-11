"use client";
import React from "react";

const DASHA_SEQUENCE = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];

const DASHA_YEARS = {
  Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7,
  Rahu:18, Jupiter:16, Saturn:19, Mercury:17
};

const NAKSHATRA_LORDS = Array(3).fill([
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"
]).flat();

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

// 🔹 Main KP Logic
function getKPLords(longitude) {
  if (longitude == null) return {};

  const signIndex = Math.floor(longitude / 30);
  const sign = SIGNS[signIndex];
  const signLord = SIGN_LORDS[sign];

  const nakIndex = Math.floor(longitude / NAK_SIZE);
  const starLord = NAKSHATRA_LORDS[nakIndex];

  const nakStart = nakIndex * NAK_SIZE;
  const degInNak = longitude - nakStart;

  const startDashaIdx = DASHA_SEQUENCE.indexOf(starLord);

  let cursor = 0;
  let subLord = "-", ssLord = "-", sssLord = "-";

  for (let i = 0; i < 9; i++) {
    const subPlanet = DASHA_SEQUENCE[(startDashaIdx + i) % 9];
    const subSize = (DASHA_YEARS[subPlanet] / TOTAL_DASHA) * NAK_SIZE;

    if (degInNak >= cursor && degInNak < cursor + subSize) {
      subLord = subPlanet;

      let ssCursor = cursor;
      const ssStartIdx = DASHA_SEQUENCE.indexOf(subPlanet);

      for (let j = 0; j < 9; j++) {
        const ssPlanet = DASHA_SEQUENCE[(ssStartIdx + j) % 9];
        const ssSize = (DASHA_YEARS[ssPlanet] / TOTAL_DASHA) * subSize;

        if (degInNak >= ssCursor && degInNak < ssCursor + ssSize) {
          ssLord = ssPlanet;

          let sssCursor = ssCursor;
          const sssStartIdx = DASHA_SEQUENCE.indexOf(ssPlanet);

          for (let k = 0; k < 9; k++) {
            const sssPlanet = DASHA_SEQUENCE[(sssStartIdx + k) % 9];
            const sssSize = (DASHA_YEARS[sssPlanet] / TOTAL_DASHA) * ssSize;

            if (degInNak >= sssCursor && degInNak < sssCursor + sssSize) {
              sssLord = sssPlanet;
              break;
            }
            sssCursor += sssSize;
          }
          break;
        }
        ssCursor += ssSize;
      }
      break;
    }
    cursor += subSize;
  }

  // 🔹 Nakshatra + Pada
  const NAMES = [
    "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
    "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
    "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
    "Mool","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha",
    "Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
  ];

  const pada = Math.floor((degInNak / (NAK_SIZE / 4))) + 1;
  const star = `${NAMES[nakIndex]}-${pada}`;

  // 🔹 Degree formatting
  const degInSign = longitude % 30;
  const d = Math.floor(degInSign);
  const m = Math.floor((degInSign % 1) * 60);
  const s = Math.floor((((degInSign % 1) * 60) % 1) * 60);

  const position = `${d}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

  return { sign, signLord, star, starLord, subLord, ssLord, sssLord, position };
}

const PLANET_ABBR = {
  Ascendant: "Asc",
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa",
  Rahu: "Ra", Ketu: "Ke",
  Uranus: "Ur", Neptune: "Ne", Pluto: "Pl"
};

const SIGN_ABBR = {
  Aries:"Ari", Taurus:"Tau", Gemini:"Gem", Cancer:"Can",
  Leo:"Leo", Virgo:"Vir", Libra:"Lib", Scorpio:"Sco",
  Sagittarius:"Sag", Capricorn:"Cap", Aquarius:"Aqu", Pisces:"Pis"
};

function PlanetKPTable({ dashaData }) {

  if (!dashaData?.planet_position) return null;

  const rows = dashaData.planet_position.map((p, i) => {

    const kp = getKPLords(p.longitude);

    return {
      planet:
        (PLANET_ABBR[p.name] || p.name) +
        (p.is_retrograde ? "(R)" : ""),

      sign: SIGN_ABBR[p.sign] ?? p.sign,
      position: p.degree_formatted?.replace("°", ":").replace("'", ":").replace('"', ""),
      house: p.house ?? "-",

      star: kp.star ?? "-",
      signLord: kp.signLord ?? "-",
      starLord: kp.starLord ?? "-",
      subLord: kp.subLord ?? "-",
      ssLord: kp.ssLord ?? "-",
      sssLord: kp.sssLord ?? "-"
    };
  });

  const headers = [
    "Planet","Sign","Position","House",
    "Star","Sign Lord","Star Lord","Sub Lord","SS Lord","SSS Lord"
  ];

  return (
    <div className="overflow-x-auto border border-stone-300 rounded-lg">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-blue-100 border-b">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="px-3 py-2 font-medium">{row.planet}</td>
              <td className="px-3 py-2">{row.sign}</td>
              <td className="px-3 py-2 font-mono">{row.position}</td>
              <td className="px-3 py-2">{row.house}</td>
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

export default PlanetKPTable;