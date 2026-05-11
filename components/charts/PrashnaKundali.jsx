"use client";
import React, { useRef, useEffect } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const RASHI_SHORT = ["Ari","Tau","Gem","Can","Leo","Vir","Lib","Sco","Sag","Cap","Aqu","Pis"];

const PLANET_SHORT = {
  Sun:"Su", Moon:"Mo", Mars:"Ma", Mercury:"Me",
  Jupiter:"Ju", Venus:"Ve", Saturn:"Sa",
  Rahu:"Ra", Ketu:"Ke", Ascendant:"As", Lagna:"As",
};

const PLANET_COLORS = {
  Sun:"#e8730a", Moon:"#6b7fd4", Mars:"#cc2200", Mercury:"#1a8f55",
  Jupiter:"#8b6914", Venus:"#b0368e", Saturn:"#555555",
  Rahu:"#4a3a6b", Ketu:"#7a3a1a", Lagna:"#cc2200",
};

const PLANET_FULL_YEARS = {
  Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16,
  Saturn:19, Mercury:17, Ketu:7, Venus:20,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
  return ((signIndexOf(planetLon) - signIndexOf(lagnaLon) + 12) % 12) + 1;
}

function centroid(x1, y1, x2, y2, x3, y3) {
  return [(x1 + x2 + x3) / 3, (y1 + y2 + y3) / 3];
}

function planetColor(name) {
  return PLANET_COLORS[name] || "#8b6914";
}

function fmtShortDate(s) {
  if (!s) return "";
  const d = new Date(s);
  return `${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()}`;
}

function progressPct(start, end) {
  const s = new Date(start), e = new Date(end), n = new Date();
  return Math.min(100, Math.max(0, ((n - s) / (e - s)) * 100));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KundaliChart({ houseCusps, planetPosition }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || houseCusps.length < 12) return;
    const svg = svgRef.current;
    svg.innerHTML = "";
    const NS = "http://www.w3.org/2000/svg";
    const W = 560, H = 340;

    const mk = (tag, attrs, text) => {
      const el = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
      if (text !== undefined) el.textContent = text;
      return el;
    };

    // Background
    svg.appendChild(mk("rect", { x:0, y:0, width:W, height:H, fill:"#fffcf5" }));

    const L=5, T=5, R=W-5, B=H-5;
    const bW=R-L, bH=B-T;
    const Tmx=L+bW/2, Tmy=T;
    const Rmx=R,      Rmy=T+bH/2;
    const Bmx=L+bW/2, Bmy=B;
    const Lmx=L,      Lmy=T+bH/2;
    const P1x=L+bW/4,   P1y=T+bH/4;
    const P2x=L+bW*3/4, P2y=T+bH/4;
    const P3x=L+bW*3/4, P3y=T+bH*3/4;
    const P4x=L+bW/4,   P4y=T+bH*3/4;
    const Ccx=L+bW/2, Ccy=T+bH/2;

    // Outer border
    svg.appendChild(mk("rect", {
      x:L, y:T, width:bW, height:bH,
      fill:"none", stroke:"#8b6914", "stroke-width":"2.5",
    }));

    // Corner dots
    [[L,T],[R,T],[L,B],[R,B]].forEach(([x,y]) =>
      svg.appendChild(mk("circle", { cx:x, cy:y, r:"4", fill:"#8b6914", opacity:"0.6" }))
    );

    // Structure lines
    [
      [L,T,R,B],[R,T,L,B],
      [Lmx,Lmy,Tmx,Tmy],[Tmx,Tmy,Rmx,Rmy],
      [Rmx,Rmy,Bmx,Bmy],[Bmx,Bmy,Lmx,Lmy],
    ].forEach(([x1,y1,x2,y2]) =>
      svg.appendChild(mk("line", { x1,y1,x2,y2, stroke:"#8b6914", "stroke-width":"1.2", opacity:"0.7" }))
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
      1:[Ccx,Ccy-10], 2:[P1x,P1y],   3:[P1x,P1y],
      4:[Ccx-10,Ccy], 5:[P4x,P4y],   6:[P4x,P4y],
      7:[Ccx,Ccy+10], 8:[P3x,P3y],   9:[P3x,P3y],
      10:[Ccx+10,Ccy],11:[P2x,P2y],  12:[P2x,P2y],
    };

    const lagnaLon  = parseFloat(houseCusps[0] ?? 0);
    const lagnaSign = signIndexOf(lagnaLon);

    // Build house → planets map
    const hp = {};
    for (let i = 1; i <= 12; i++) hp[i] = [];
    hp[1].push({ label:"As", retro:false, lon:lagnaLon, color:"#cc2200" });

    planetPosition
      .filter(p => p.name !== "Ascendant" && p.name !== "Lagna")
      .forEach(p => {
        const lon   = parseFloat(p.longitude ?? p.lon ?? p.absolute_longitude ?? 0);
        const house = getVedicHouse(lon, lagnaLon);
        const label = PLANET_SHORT[p.name] || p.name.slice(0, 2);
        const retro = !!(p.retrograde || p.is_retrograde);
        hp[house].push({ label, retro, lon, color: planetColor(p.name) });
      });

    // Render houses
    for (let house = 1; house <= 12; house++) {
      const [bx, by] = HOUSE_CENTRES[house];
      const [cx, cy] = INNER_CORNERS[house];
      const isLagna  = house === 1;
      const hSignIdx = (lagnaSign + house - 1) % 12;
      const ps       = hp[house] || [];

      // Rashi number (75% toward inner corner)
      const nx = bx + (cx - bx) * 0.72;
      const ny = by + (cy - by) * 0.72;
      svg.appendChild(mk("text", {
        x:nx, y:ny, "text-anchor":"middle", "dominant-baseline":"central",
        "font-size":"15", "font-weight":"700", "font-family":"Georgia,serif",
        fill: isLagna ? "#cc2200" : "#8b6914", opacity:"0.9",
      }, String(hSignIdx + 1)));

      // Rashi abbreviation (softer, midway)
      const rx2 = bx + (cx - bx) * 0.5;
      const ry2 = by + (cy - by) * 0.5;
      svg.appendChild(mk("text", {
        x:rx2, y:ry2+10, "text-anchor":"middle", "dominant-baseline":"central",
        "font-size":"7.5", "font-family":"Georgia,serif",
        fill:"#8b6914", opacity:"0.5",
      }, RASHI_SHORT[hSignIdx]));

      // Planet labels
      if (ps.length > 0) {
        const lineH  = 14;
        const startY = by - ((ps.length - 1) * lineH) / 2;
        ps.forEach((p, pi) => {
          const short = p.label + (p.retro ? "℞" : "");
          const dm    = degMinStr(p.lon);
          svg.appendChild(mk("text", {
            x:bx, y: startY + pi * lineH,
            "text-anchor":"middle", "dominant-baseline":"central",
            "font-size":"10.5", "font-weight":"600", "font-family":"monospace",
            fill: p.color || "#1a1a2e",
          }, `${short} ${dm}`));
        });
      }
    }

    // Center ornament
    svg.appendChild(mk("polygon", {
      points:`${Ccx},${Ccy-8} ${Ccx+7},${Ccy} ${Ccx},${Ccy+8} ${Ccx-7},${Ccy}`,
      fill:"none", stroke:"#8b6914", "stroke-width":"0.8", opacity:"0.5",
    }));
    svg.appendChild(mk("text", {
      x:Ccx, y:Ccy-4, "text-anchor":"middle",
      "font-size":"7", "font-family":"Georgia,serif", fill:"#8b6914", opacity:"0.6",
    }, "PRASHNA"));
    svg.appendChild(mk("text", {
      x:Ccx, y:Ccy+5, "text-anchor":"middle",
      "font-size":"7", "font-family":"Georgia,serif", fill:"#8b6914", opacity:"0.6",
    }, "KUNDALI"));

  }, [houseCusps, planetPosition]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 900 600"
      width="50%"
      height="50%"
      className="block w-full"
    />
  );
}

function SectionTitle({ children }) {
  return (
    <p style={{
      fontFamily:"'Cinzel',serif",
      fontSize:"10px",
      letterSpacing:".12em",
      textTransform:"uppercase",
      color:"#8b6914",
      opacity:0.75,
      marginBottom:"8px",
    }}>
      {children}
    </p>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background:"#fffcf5",
      border:"0.5px solid rgba(139,105,20,0.3)",
      borderRadius:"12px",
      padding:"12px",
      marginBottom:"14px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function PeriodCard({ label, lord, start, end, balanceYears }) {
  const pct   = start && end ? progressPct(start, end) : 0;
  const color = planetColor(lord);

  return (
    <div style={{
      background:"#fffcf5",
      border:`0.5px solid ${color}55`,
      borderRadius:"10px",
      padding:"10px",
    }}>
      <div style={{
        fontFamily:"'Cinzel',serif", fontSize:"9px", letterSpacing:".1em",
        textTransform:"uppercase", color:"#8b6914", marginBottom:"4px",
      }}>{label}</div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"16px", color, fontWeight:700 }}>
        {lord}
      </div>
      {balanceYears != null
        ? <div style={{ fontSize:"10px", color:"rgba(0,0,0,0.45)", marginTop:2, fontStyle:"italic" }}>
            Balance: {balanceYears.toFixed(2)} yrs
          </div>
        : <>
            <div style={{ fontSize:"10px", color:"rgba(0,0,0,0.45)", marginTop:2, fontStyle:"italic" }}>
              {fmtShortDate(start)} – {fmtShortDate(end)}
            </div>
            <div style={{ marginTop:"6px", height:"3px", background:"rgba(139,105,20,0.12)", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct.toFixed(1)}%`, background:color, borderRadius:"2px", transition:"width 0.5s" }} />
            </div>
          </>
      }
    </div>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────
export default function PrashnaKundali({ data }) {
  if (!data) return null;

  const {
    house_cusps         = [],
    planet_position     = [],
    current_mahadasha,
    current_adl,
    current_pd,
    current_pr,
    current_sd,
    birth_mahadasha,

  } = data;

  const currentPeriods = [
    { label:"Mahadasha",       data: current_mahadasha },
    { label:"Antardasha",      data: current_adl },
    { label:"Pratyantardasha", data: current_pd },
    { label:"Sookshma Dasha",  data: current_sd },
    { label:"Prana Dasha",     data: current_pr },
  ].filter(p => p.data);

  const styles = {
    wrap: {
      fontFamily:"'EB Garamond', Georgia, serif",
      color:"#1a1a1a",
      padding:"4px 0",
    },
    periodsGrid: {
      display:"grid",
      gridTemplateColumns:"repeat(3, 1fr)",
      gap:"8px",
      marginBottom:"14px",
    },
  };

  return (
    <div style={styles.wrap}>
      {/* ── Kundali Chart ── */}
      {/* <Card>
        <SectionTitle>Prashna Lagna Chart (D1)</SectionTitle>
        <KundaliChart houseCusps={house_cusps} planetPosition={planet_position} />
      </Card> */}


      {/* ── Current Dasha Periods ── */}
      {(currentPeriods.length > 0 || birth_mahadasha) && (
        <>
          <SectionTitle>Active Dasha Periods</SectionTitle>
          <div style={styles.periodsGrid}>
            {birth_mahadasha && (
              <PeriodCard
                label="Birth Mahadasha"
                lord={birth_mahadasha.mahadashaLord}
                balanceYears={birth_mahadasha.balanceYears}
              />
            )}
            {currentPeriods.map(({ label, data: d }) => (
              <PeriodCard key={label} label={label} lord={d.lord} start={d.start} end={d.end} />
            ))}
          </div>
        </>
      )}

      
    </div>
  );
}

