"use client";
import React, { useState } from "react";

const PLANETS = [
  {
    name: "SUN",
    symbol: "☉",
    accent: "#c8860a",
    light: "#fffbf0",
    header: "#fef3d0",
    keywords: [
      "Soul","Will power","King","Respect","Father","Medical science","Health","Heart",
      "Stomach","Right eye","Blood circulation problems","Heat","Electricity","WBC","Son",
      "Brain","Ambition","Boldness","Brilliance","Dignity","Elevation in rank","Fame",
      "Generosity","Hope","Influence","Loyalty","Nobility","Power","Respect to elders",
      "Reputation","Truth","Jealous","Govt. services","Orange articles","Copper","Wheat",
      "Medicine","Administrators","Dictators","Royal leaders","Head of departments",
      "People in authority & power","Gold bonds","Reserve bank","Stock exchange",
      "Chamber of commerce","Forests","Mountains","Government buildings","Public offices",
      "District boards","Panchayat unions","Lion","Male horse","All singing birds","Ruby",
    ],
  },
  {
    name: "MOON",
    symbol: "☽",
    accent: "#1565c0",
    light: "#f0f7ff",
    header: "#dbeafe",
    keywords: [
      "Mind","Mother","Mental state","Confidence","Liquid matter","Peaceful mind","Pond",
      "Journey","Happiness","Wealth","Liquid elements in the body","Blood","Left eye",
      "Breast","Mental problems","Menstrual cycle in women","Cold","Wells","Rivers",
      "Fresh water","Navy","Milk","Nickel","Silver","Female horses","Cooked food",
      "Social function","River projects","Bridges","Swimming pool","Agriculture",
      "Horticulture","Shipping yards","Breweries","Drinks","Water supply","Dairy farms",
      "Water birds","Duck","Tortoise","Mushrooms","Sugarcane","Cabbage","Pearl",
      "White colour",
    ],
  },
  {
    name: "MARS",
    symbol: "♂",
    accent: "#b71c1c",
    light: "#fff5f5",
    header: "#fde8e8",
    keywords: [
      "Courage","Bravery","Power","Aggression","Warrior","War","Enemies","Weapons",
      "Accident","Land","Immovable property","Brothers","Scientists","Police","Army",
      "Head","Animal bites","Burns","Injuries","Exercise","Operations",
      "High blood pressure","Pregnancy","Action","External sex organ","Muscular system",
      "Military","High position in police","Guns","Hunters","Chemists","Dentists",
      "Surgeons","Butchers","Barbers","Kitchen","Boilers","Steam engine","Industry",
      "Ruby","Red articles","Thief","Robber","Dacoit","Murder","Disputes",
      "Mis-understandings","Violence","Tiger","Hunting dogs","Thorny plants",
      "Red colour","Coral",
    ],
  },
  {
    name: "MERCURY",
    symbol: "☿",
    accent: "#1b5e20",
    light: "#f0fdf4",
    header: "#dcfce7",
    keywords: [
      "Intelligence","Cleverness","Voice","Happiness","Education","Maths","Writing",
      "Arguments","Astrology","Dance","Drama","Family","Business","Negotiator",
      "Friends","Relatives","Throat","Nose","Ears","Lungs","Mentality","Analytical",
      "Reproductive ability","Researcher","Occult science","Accounts","Correspondence",
      "Talkative","Good salesman","Insurance agent","Publicity officials","Propagandists",
      "Orators","Many languages","Editing","Publishing","Journalism","Law","Bank",
      "Speculation","Literature","Commerce","Sales tax","Picnic parties",
      "Travel agencies","Clerks","Advertisers","Memory",
    ],
  },
  {
    name: "JUPITER",
    symbol: "♃",
    accent: "#7b4f00",
    light: "#fffbeb",
    header: "#fef9c3",
    keywords: [
      "Knowledge","Intelligence","Education","Religious activities","Devotion",
      "Ancient literature","Wealth","Respect","Elders","Elder brother",
      "Trees with fruits","Fat in the body","Diabetes","Ears","Banks","Income tax",
      "Treasurer","Temple","Religious institutions","Legal matters","Justice department",
      "Court of law","Written exams","Editor","Principal","Teacher","Share market",
      "Minister","Tourist","Municipal corporation","Astrologer","Vedas","Shastras",
      "Gurus","Reasoning ability","Judgement","Religion","Philosophy","Banking",
      "Company administration","Economics","Faith","Honest","Peacock","Temples",
      "Colleges","Schools","Durbar hall","Ghee","Gold",
    ],
  },
  {
    name: "VENUS",
    symbol: "♀",
    accent: "#880e4f",
    light: "#fff0f7",
    header: "#fce7f3",
    keywords: [
      "Marriage","Wife","Lust","Youth","Happiness & prosperity","Ornaments","Beauty",
      "Fragrance","Flowers","Creativity","Designer objects","White colored objects",
      "Beautiful body","Big eyes","Curly hair","Poetry","Music","Black hair","Desire",
      "Alcohol","Drugs","Short height","Sexual diseases","Eyes","Intestines","Appendix",
      "Diabetes","Pleasant voice","Sweet smile","Private secretary","Generative system",
      "Garden","Nursery","Banqueting hall","Silk","Textile","Perfume","Fancy goods",
      "Fruits","Sugar","Salt","Cars","Pink & white colours","Diamond",
    ],
  },
  {
    name: "SATURN",
    symbol: "♄",
    accent: "#1a237e",
    light: "#f5f5ff",
    header: "#e8eaf6",
    keywords: [
      "Life","Age","Death","Sorrow","Poverty","Disrespect","Flatterer","Sickness",
      "Inappropriate behaviour","Lowly works","Natural disasters","Old age","Diseases",
      "Sin","Secrecy","Imprisonment","Job","Scientific laws","Oil","Labour","Servant",
      "Agriculture","Sacrifice","Falling from height","Insult","Drought","Loan",
      "Hardwork","Black seeds of ration","Wooden stick","Poison","Legs","Ash",
      "Handicap","Self sacrifice","Arms","Robbery","Wool","Import","Delay",
      "Service department","Foreign language","Pride","Greed","Theft",
      "Handicapped leg","Feet","Nerves in the feet","Tantra","Sadness","Paralysis",
      "Tiredness","Sesame","Plaintain","Black grains","Deserts","Very old building",
      "Iron","Leather","Mine ores","Novelist","Blue sapphire",
    ],
  },
  {
    name: "RAHU",
    symbol: "☊",
    accent: "#4a148c",
    light: "#fdf4ff",
    header: "#f3e8ff",
    keywords: [
      "Grandfather","Foreign journey","Society","Castes","Snakes","Snake bite",
      "Skin diseases","Itching","Bones","Poison","Chronic diseases","Widow","Fear",
      "Pilgrimage","Rude behaviour","Living in foreign","Desire","Blemishes",
      "Snake poison","Epidemic","Extramarital affair","Grandmother",
      "Unnecessary arguments","Fake","Pain and swelling","Drowning","Darkness",
      "Schedule caste","Cunning woman","Gambler","Cleverness","Backstabber",
      "Addiction to bad habits","Ship","Piercing","Stones in kidney","Leprosy",
      "Strength","Expenses","Self respect","Enemies","Adulteration","Accidents",
      "Exile","Handicap","Explorer","Alcohol","Fights","Illegal activities","Export",
      "Detective","Suicide","Poisonous","Wrestler","Hunter","Excitement",
    ],
  },
  {
    name: "KETU",
    symbol: "☋",
    accent: "#bf360c",
    light: "#fff8f5",
    header: "#ffe8df",
    keywords: [
      "Animals with colorful stripes","Dogs","Rooster","Animals with horns",
      "Black magic","Injury","Microorganisms","Detachment","Salvation","Stammering",
      "Intestines","Imprisonment","Piece of land in foreign","Slavery","Suicide",
      "Grandfather","Grandmother","Eyes","Rude behaviour","Abusive language",
      "Tall height","Smoke colored objects","Chain smoker","Lean body","Convict",
      "Conspiracy","Tourism","Sudden death","Bad soul","Diseases caused by insects",
      "Poisonous bite","Religion","Astrology","Medicines","Adulterator","Kidnapping",
      "Blood","Justice","Murder",
    ],
  },
];

export default function PlanetsKarakTatav() {
  const [search, setSearch] = useState("");
  const [activePlanet, setActivePlanet] = useState(null);

  const filtered = PLANETS.map(p => ({
    ...p,
    keywords: search
      ? p.keywords.filter(k => k.toLowerCase().includes(search.toLowerCase()))
      : p.keywords,
  })).filter(p => !search || p.keywords.length > 0);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      maxWidth: "100%",
      color: "#111",
    }}>

     
      {/* ── Planet nav pills ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6,
        marginBottom: 14, justifyContent: "center",
      }}>
        {PLANETS.map(p => (
          <button
            key={p.name}
            onClick={() => {
              setActivePlanet(activePlanet === p.name ? null : p.name);
              if (activePlanet !== p.name) {
                setTimeout(() => {
                  document.getElementById(`planet-${p.name}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
              }
            }}
            style={{
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "Arial, sans-serif",
              border: `1.5px solid ${p.accent}`,
              borderRadius: 99,
              cursor: "pointer",
              background: activePlanet === p.name ? p.accent : p.light,
              color: activePlanet === p.name ? "#fff" : p.accent,
              transition: "all 0.15s",
              letterSpacing: "0.05em",
            }}
          >
            {p.symbol} {p.name}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
        <input
          placeholder="Search any keyword across all planets…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 420,
            padding: "7px 14px",
            fontSize: 12,
            fontFamily: "Arial, sans-serif",
            border: "1.5px solid #c8860a",
            borderRadius: 6,
            outline: "none",
            color: "#333",
          }}
        />
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          border: "1.5px solid #333",
        }}>
          <thead>
            <tr>
              <th style={{
                ...thStyle,
                background: "#222",
                color: "#fff",
                width: 90,
                fontSize: 11,
                letterSpacing: "0.1em",
                textAlign: "center",
              }}>
                PLANET
              </th>
              <th style={{
                ...thStyle,
                background: "#222",
                color: "#fff",
                fontSize: 11,
                letterSpacing: "0.1em",
                textAlign: "left",
              }}>
                SIGNIFICATORS / KARAK TATAV
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr
                key={p.name}
                id={`planet-${p.name}`}
                style={{ verticalAlign: "top" }}
              >
                {/* Planet name cell */}
                <td style={{
                  ...tdStyle,
                  background: p.header,
                  borderRight: `3px solid ${p.accent}`,
                  textAlign: "center",
                  padding: "14px 8px",
                  minWidth: 80,
                }}>
                  <div style={{
                    fontSize: 22,
                    lineHeight: 1,
                    marginBottom: 4,
                    color: p.accent,
                  }}>
                    {p.symbol}
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.1em",
                    color: p.accent,
                    fontFamily: "Arial, sans-serif",
                    textTransform: "uppercase",
                  }}>
                    {p.name}
                  </div>
                </td>

                {/* Keywords cell */}
                <td style={{
                  ...tdStyle,
                  background: idx % 2 === 0 ? "#fff" : p.light,
                  padding: "10px 14px",
                  lineHeight: 1.9,
                }}>
                  {p.keywords.length === 0 ? (
                    <span style={{ color: "#aaa", fontStyle: "italic", fontSize: 11 }}>
                      No matches for "{search}"
                    </span>
                  ) : (
                    <span style={{ color: "#222" }}>
                      {p.keywords.map((k, ki) => (
                        <span key={ki}>
                          <span style={{
                            background: search && k.toLowerCase().includes(search.toLowerCase())
                              ? "#fef08a" : "transparent",
                            borderRadius: 2,
                            padding: search ? "0 1px" : 0,
                          }}>
                            {k}
                          </span>
                          {ki < p.keywords.length - 1 && (
                            <span style={{ color: "#8b6914", margin: "0 3px" }}>·</span>
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
      <div style={{
        textAlign: "center",
        marginTop: 14,
        fontSize: 10,
        color: "#aaa",
        fontFamily: "Arial, sans-serif",
        letterSpacing: "0.05em",
        borderTop: "1px solid #eee",
        paddingTop: 10,
      }}>
        THEORY BY MD &nbsp;·&nbsp; PLANETS KARAK TATAV (SIGNIFICATORS)
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