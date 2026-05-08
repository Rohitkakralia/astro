"use client";
import React, { useRef, useEffect } from "react";

const RASHI_SHORT = ["Ari","Tau","Gem","Can","Leo","Vir","Lib","Sco","Sag","Cap","Aqu","Pis"];

const PLANET_SHORT = {
  Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me",
  Jupiter:"Ju", Venus:"Ve", Saturn:"Sa",
  Rahu:"Ra", Ketu:"Ke", Ascendant:"As", Lagna:"As",
};

function signIndexOf(lon) {
  return Math.floor((((parseFloat(lon) % 360) + 360) % 360) / 30);
}

function degMinStr(lon) {
  const norm = (((parseFloat(lon) % 360) + 360) % 360) % 30;
  const deg  = Math.floor(norm);
  const min  = Math.floor((norm - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
}

function getVedicHouse(planetLon, lagnaLon) {
  const lagnaSign  = signIndexOf(lagnaLon);
  const planetSign = signIndexOf(planetLon);
  return ((planetSign - lagnaSign + 12) % 12) + 1;
}

function centroid(x1,y1, x2,y2, x3,y3) {
  return [(x1+x2+x3)/3, (y1+y2+y3)/3];
}

export default function TransitChart({ data, loading, error }) {
  const svgRef = useRef(null);

  const houseCusps     = data?.house_cusps     || [];
  const planetPosition = data?.planet_position || [];

  useEffect(() => {
    if (!svgRef.current || houseCusps.length < 12) return;

    const svg = svgRef.current;
    svg.innerHTML = "";
    const NS = "http://www.w3.org/2000/svg";

    const W = 600, H = 400;

    const mk = (tag, attrs, text) => {
      const el = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
      if (text !== undefined) el.textContent = text;
      return el;
    };

    svg.appendChild(mk("rect", { x:0, y:0, width:W, height:H, fill:"#fffef9" }));

    const L=5, T=5, R=W-5, B=H-5;
    const bW = R-L, bH = B-T;

    const Tmx=L+bW/2,   Tmy=T;
    const Rmx=R,         Rmy=T+bH/2;
    const Bmx=L+bW/2,   Bmy=B;
    const Lmx=L,         Lmy=T+bH/2;

    const P1x=L+bW/4,   P1y=T+bH/4;
    const P2x=L+bW*3/4, P2y=T+bH/4;
    const P3x=L+bW*3/4, P3y=T+bH*3/4;
    const P4x=L+bW/4,   P4y=T+bH*3/4;

    const Ccx=L+bW/2, Ccy=T+bH/2;

    svg.appendChild(mk("rect", {
      x:L, y:T, width:bW, height:bH,
      fill:"none", stroke:"#8b6914", "stroke-width":"2.5",
    }));

    const lines = [
      [L,T,  R,B], [R,T,  L,B],
      [Lmx,Lmy, Tmx,Tmy], [Tmx,Tmy, Rmx,Rmy],
      [Rmx,Rmy, Bmx,Bmy], [Bmx,Bmy, Lmx,Lmy],
    ];
    lines.forEach(([x1,y1,x2,y2]) =>
      svg.appendChild(mk("line", { x1,y1,x2,y2, stroke:"#8b6914", "stroke-width":"1.4" }))
    );

    const HOUSE_CENTRES = {
      1:  centroid(Tmx,Tmy, P1x,P1y, P2x,P2y),
      2:  centroid(L,T,     Tmx,Tmy, P1x,P1y),
      3:  centroid(L,T,     Lmx,Lmy, P1x,P1y),
      4:  centroid(Lmx,Lmy, P1x,P1y, P4x,P4y),
      5:  centroid(L,B,     Lmx,Lmy, P4x,P4y),
      6:  centroid(L,B,     Bmx,Bmy, P4x,P4y),
      7:  centroid(Bmx,Bmy, P3x,P3y, P4x,P4y),
      8:  centroid(R,B,     Bmx,Bmy, P3x,P3y),
      9:  centroid(R,B,     Rmx,Rmy, P3x,P3y),
      10: centroid(Rmx,Rmy, P2x,P2y, P3x,P3y),
      11: centroid(R,T,     Rmx,Rmy, P2x,P2y),
      12: centroid(R,T,     Tmx,Tmy, P2x,P2y),
    };

    const INNER_CORNERS = {
      1:  [Ccx,       Ccy - 10],
      2:  [P1x,       P1y],
      3:  [P1x,       P1y],
      4:  [Ccx - 10,  Ccy],
      5:  [P4x,       P4y],
      6:  [P4x,       P4y],
      7:  [Ccx,       Ccy + 10],
      8:  [P3x,       P3y],
      9:  [P3x,       P3y],
      10: [Ccx + 10,  Ccy],
      11: [P2x,       P2y],
      12: [P2x,       P2y],
    };

    const lagnaLon  = parseFloat(houseCusps[0] ?? 0);
    const lagnaSign = signIndexOf(lagnaLon);

    const housePlanets = {};
    for (let i = 1; i <= 12; i++) housePlanets[i] = [];

    housePlanets[1].push({ label:"As", retro:false, lon:lagnaLon });

    planetPosition
      .filter((p) => p.name !== "Ascendant" && p.name !== "Lagna")
      .forEach((p) => {
        const lon   = parseFloat(p.longitude ?? p.lon ?? p.absolute_longitude ?? 0);
        const house = getVedicHouse(lon, lagnaLon);
        const label = PLANET_SHORT[p.name] || p.name.slice(0, 2);
        const retro = !!(p.retrograde || p.is_retrograde);
        housePlanets[house].push({ label, retro, lon });
      });

    for (let house = 1; house <= 12; house++) {
      const [bx, by] = HOUSE_CENTRES[house];
      const [cx, cy] = INNER_CORNERS[house];
      const isLagna  = house === 1;
      const ps       = housePlanets[house] || [];

      const houseSignIdx = (lagnaSign + house - 1) % 12;
      const rashiNum     = houseSignIdx + 1;

      const nx = bx + (cx - bx) * 0.75;
      const ny = by + (cy - by) * 0.75;

      svg.appendChild(mk("text", {
        x: nx, y: ny,
        "text-anchor": "middle",
        "dominant-baseline": "central",
        "font-size": "16",
        "font-weight": "700",
        "font-family": "Arial, sans-serif",
        fill: isLagna ? "#cc2200" : "#8b6914",
        opacity: "0.85",
      }, String(rashiNum)));

      if (ps.length > 0) {
        const lineH  = 15;
        const startY = by - ((ps.length - 1) * lineH) / 2;

        ps.forEach((p, pi) => {
          const short = p.label + ((p.retro || p.label === "Ra" || p.label === "Ke") ? "(℞)" : "");
          const dm    = degMinStr(p.lon);
          const rashi = RASHI_SHORT[signIndexOf(p.lon)];
          const line  = `${short} ${dm} ${rashi}`;

          svg.appendChild(mk("text", {
            x: bx, y: startY + pi * lineH,
            "text-anchor": "middle",
            "dominant-baseline": "central",
            "font-size": "11.5",
            "font-weight": "600",
            "font-family": "monospace",
            fill: isLagna ? "#cc2200" : "#1a1a2e",
          }, line));
        });
      }
    }

    // ── Centre label — "TRANSIT CHART" instead of "D1 LAGNA" ─────────────────
    svg.appendChild(mk("text", {
      x:Ccx, y:Ccy - 7,
      "text-anchor":"middle", "font-size":"10",
      fill:"#8b6914", "font-family":"Georgia, serif", opacity:"0.7",
    }, "TRANSIT"));
    svg.appendChild(mk("text", {
      x:Ccx, y:Ccy + 7,
      "text-anchor":"middle", "font-size":"10",
      fill:"#8b6914", "font-family":"Georgia, serif", opacity:"0.7",
    }, "CHART"));

  }, [houseCusps, planetPosition]);

  if (loading) return <div className="text-sm text-gray-500 p-4">Loading transit chart...</div>;
  if (error)   return <div className="text-sm text-red-500 p-4">Error: {error}</div>;
  if (!data)   return null;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      className="block w-full h-full"
    />
  );
}