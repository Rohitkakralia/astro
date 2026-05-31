"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    title: "Birth Chart (Kundali)",
    desc:  "Detailed analysis of your natal chart — planets, houses, doshas, yogas, and life themes decoded in classical Jyotish tradition.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7" stroke="#8b6914" strokeWidth="1" />
        <circle cx="9" cy="9" r="2" fill="#8b6914" />
        <line x1="9" y1="2" x2="9" y2="16" stroke="#d4b96a" strokeWidth=".8" />
        <line x1="2" y1="9" x2="16" y2="9" stroke="#d4b96a" strokeWidth=".8" />
      </svg>
    ),
  },
  {
    title: "Dasha Predictions",
    desc:  "Vimshottari Dasha timeline — understand the planetary periods governing your career, relationships, and spiritual evolution.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="14" height="14" rx="1" stroke="#8b6914" strokeWidth="1" />
        <line x1="6"  y1="2"  x2="6"  y2="16" stroke="#d4b96a" strokeWidth=".7" />
        <line x1="12" y1="2"  x2="12" y2="16" stroke="#d4b96a" strokeWidth=".7" />
        <line x1="2"  y1="7"  x2="16" y2="7"  stroke="#d4b96a" strokeWidth=".7" />
        <line x1="2"  y1="12" x2="16" y2="12" stroke="#d4b96a" strokeWidth=".7" />
      </svg>
    ),
  },
  {
    title: "Muhurta (Auspicious Timing)",
    desc:  "Find the most favourable moment for marriage, business launch, travel, ceremonies, and any important life event.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7" stroke="#8b6914" strokeWidth="1" />
        <line x1="9" y1="4" x2="9" y2="9"  stroke="#8b6914" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="9" y1="9" x2="13" y2="11" stroke="#d4b96a" strokeWidth="1"   strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Kundali Matching",
    desc:  "Ashtakoot and Dashamsha compatibility analysis for marriage — Guna Milan, Mangal Dosha, and planetary harmony assessed.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="6"  cy="9" r="4" stroke="#8b6914" strokeWidth="1" />
        <circle cx="12" cy="9" r="4" stroke="#c9a84c" strokeWidth="1" />
      </svg>
    ),
  },
  {
    title: "Transit Chart Analysis",
    desc:  "Current planetary transits overlaid on your natal chart — understand what energies are active in your life right now.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 9 Q9 3 15 9 Q9 15 3 9Z" stroke="#8b6914" strokeWidth="1" fill="none" />
        <circle cx="9" cy="9" r="2" fill="#c9a84c" />
      </svg>
    ),
  },
  {
    title: "Remedies & Gemstones",
    desc:  "Personalised Vedic remedies — mantras, gemstone recommendations, charity, and rituals to harmonise planetary influences.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <polygon points="9,2 16,14 2,14" stroke="#8b6914" strokeWidth="1" fill="none" />
        <line x1="9" y1="8"  x2="9" y2="11" stroke="#8b6914" strokeWidth="1.2" />
        <circle cx="9" cy="12.5" r=".8" fill="#8b6914" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    text:   "Pandit ji's reading was eerily precise. He described events in my past I never mentioned and gave me clarity on my career that changed everything.",
    author: "Priya Kapoor",
    loc:    "New Delhi, India",
  },
  {
    text:   "I was sceptical before my consultation. Now I follow my Dasha calendar religiously. The accuracy of his predictions over two years has been remarkable.",
    author: "Rahul Mehta",
    loc:    "London, UK",
  },
  {
    text:   "Our Kundali matching session was thorough and deeply reassuring. Pandit ji took time to explain every aspect and suggested beautiful remedies.",
    author: "Sneha & Arjun Iyer",
    loc:    "Chennai, India",
  },
];

const STATS = [
  { num: "20+",  label: "Years of practice" },
  { num: "15K+", label: "Kundalis read" },
  { num: "40+",  label: "Countries served" },
  { num: "4.9★", label: "Client rating" },
];

const CONTACT_INFO = [
  {
    label: "Address",
    value: "MD Astrology Centre\n14-B, Sector 32, Chandigarh — 160030\nPunjab, India",
  },
  {
    label: "Email",
    value: "contact@mdjyotish.com\nbookings@mdjyotish.com",
  },
  {
    label: "Phone / WhatsApp",
    value: "+91 98765 43210\n+91 94321 09876",
  },
  {
    label: "Consultation Hours",
    value: "Mon – Sat: 9:00 AM – 7:00 PM IST\nSunday: 10:00 AM – 2:00 PM IST\nOnline sessions available globally",
  },
  {
    label: "Social Media",
    value: "Instagram: @md.jyotish\nYouTube: MD Astrology Official\nFacebook: MD Astrology Centre",
  },
];

// ─── Reusable components ──────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: "#d4b96a", flex: 1 }} />;
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
      <Divider />
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <p style={S.eyebrow}>{eyebrow}</p>
        <h2 style={S.sectionTitle}>{title}</h2>
      </div>
      <Divider />
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={S.formLabel}>{label}</label>
      {children}
    </div>
  );
}

// ─── Decorative SVG charts ────────────────────────────────────────────────────
function HeroChart() {
  return (
    <svg
      viewBox="0 0 220 220"
      width="220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0.55, flexShrink: 0 }}
    >
      <rect x="2" y="2" width="216" height="216" fill="none" stroke="#8b6914" strokeWidth="2" />
      <line x1="2"   y1="2"   x2="218" y2="218" stroke="#8b6914" strokeWidth="1" />
      <line x1="218" y1="2"   x2="2"   y2="218" stroke="#8b6914" strokeWidth="1" />
      <line x1="110" y1="2"   x2="2"   y2="110" stroke="#8b6914" strokeWidth="1" />
      <line x1="2"   y1="110" x2="110" y2="218" stroke="#8b6914" strokeWidth="1" />
      <line x1="110" y1="218" x2="218" y2="110" stroke="#8b6914" strokeWidth="1" />
      <line x1="218" y1="110" x2="110" y2="2"   stroke="#8b6914" strokeWidth="1" />
      <text x="110" y="46"  textAnchor="middle" fontSize="9"  fill="#8b6914" fontFamily="monospace">Su 12°Ari</text>
      <text x="40"  y="82"  textAnchor="middle" fontSize="8"  fill="#c9a84c" fontFamily="monospace">Mo℞ Cap</text>
      <text x="180" y="82"  textAnchor="middle" fontSize="8"  fill="#8b6914" fontFamily="monospace">Ju Leo</text>
      <text x="110" y="178" textAnchor="middle" fontSize="9"  fill="#8b6914" fontFamily="monospace">Sa℞ Aqu</text>
      <text x="40"  y="150" textAnchor="middle" fontSize="8"  fill="#c9a84c" fontFamily="monospace">Ra Sco</text>
      <text x="180" y="150" textAnchor="middle" fontSize="8"  fill="#8b6914" fontFamily="monospace">Ma Vir</text>
      <text x="110" y="113" textAnchor="middle" fontSize="8"  fill="#8b6914" fontFamily="Georgia, serif" opacity=".5">D1 Lagna</text>
      <circle cx="110" cy="110" r="18" fill="none" stroke="#e8d89a" strokeWidth="0.8" />
    </svg>
  );
}

function AboutChart() {
  return (
    <svg viewBox="0 0 240 240" width="200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="4" width="232" height="232" fill="none" stroke="#8b6914" strokeWidth="2.5" />
      <line x1="4"   y1="4"   x2="236" y2="236" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="236" y1="4"   x2="4"   y2="236" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="120" y1="4"   x2="4"   y2="120" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="4"   y1="120" x2="120" y2="236" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="120" y1="236" x2="236" y2="120" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="236" y1="120" x2="120" y2="4"   stroke="#8b6914" strokeWidth="1.2" />
      <text x="120" y="34"  textAnchor="middle" fontSize="11" fill="#cc2200" fontFamily="Arial" fontWeight="700">1</text>
      <text x="26"  y="54"  textAnchor="middle" fontSize="11" fill="#8b6914" fontFamily="Arial" fontWeight="700">2</text>
      <text x="26"  y="190" textAnchor="middle" fontSize="11" fill="#8b6914" fontFamily="Arial" fontWeight="700">3</text>
      <text x="120" y="224" textAnchor="middle" fontSize="11" fill="#8b6914" fontFamily="Arial" fontWeight="700">7</text>
      <text x="214" y="54"  textAnchor="middle" fontSize="11" fill="#8b6914" fontFamily="Arial" fontWeight="700">12</text>
      <text x="214" y="190" textAnchor="middle" fontSize="11" fill="#8b6914" fontFamily="Arial" fontWeight="700">9</text>
      <text x="120" y="126" textAnchor="middle" fontSize="9"  fill="#8b6914" fontFamily="Georgia, serif" opacity=".5">D1 Lagna</text>
      <text x="120" y="138" textAnchor="middle" fontSize="9"  fill="#8b6914" fontFamily="Georgia, serif" opacity=".5">Chart</text>
      <text x="120" y="52"  textAnchor="middle" fontSize="8"  fill="#cc2200" fontFamily="monospace">As 4°Leo</text>
    </svg>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to send. Please try again.");
      }
      setSent(true);
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  const focusInput  = (e) => (e.currentTarget.style.borderColor = "#8b6914");
  const blurInput   = (e) => (e.currentTarget.style.borderColor = "#d4b96a");

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ fontSize: 32, marginBottom: 12, color: "#8b6914" }}>✦</div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#3d2800", marginBottom: 8 }}>
          Message received
        </p>
        <p style={{ fontSize: 13, color: "#7a5c2e", fontWeight: 300 }}>
          Pandit ji will respond within 24 hours.
        </p>
        <button style={{ ...S.btnOutline, marginTop: 20 }} onClick={() => setSent(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField label="Your name">
        <input
          name="name" value={form.name} onChange={handleChange}
          required placeholder="Arjun Sharma"
          style={S.input} onFocus={focusInput} onBlur={blurInput}
        />
      </FormField>

      <FormField label="Email address">
        <input
          name="email" type="email" value={form.email} onChange={handleChange}
          required placeholder="arjun@email.com"
          style={S.input} onFocus={focusInput} onBlur={blurInput}
        />
      </FormField>

      <FormField label="Phone (optional)">
        <input
          name="phone" type="tel" value={form.phone} onChange={handleChange}
          placeholder="+91 98765 00000"
          style={S.input} onFocus={focusInput} onBlur={blurInput}
        />
      </FormField>

      <FormField label="Service required">
        <select
          name="service" value={form.service} onChange={handleChange}
          style={{ ...S.input, cursor: "pointer" }}
          onFocus={focusInput} onBlur={blurInput}
        >
          <option value="">Select a service…</option>
          <option>Birth Chart Reading</option>
          <option>Dasha Prediction</option>
          <option>Kundali Matching</option>
          <option>Muhurta Consultation</option>
          <option>Transit Analysis</option>
          <option>Remedies &amp; Gemstones</option>
        </select>
      </FormField>

      <FormField label="Message">
        <textarea
          name="message" value={form.message} onChange={handleChange}
          placeholder="Briefly describe what guidance you're seeking…"
          style={{ ...S.input, resize: "vertical", minHeight: 90 }}
          onFocus={focusInput} onBlur={blurInput}
        />
      </FormField>

      {error && (
        <p style={{ fontSize: 12, color: "#cc2200", marginBottom: 10, padding: "6px 10px", border: "1px solid #f0c0b8", borderRadius: 2, background: "#fff5f3" }}>
          ⚠ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        style={{ ...S.btnPrimary, width: "100%", marginTop: 4, opacity: sending ? 0.7 : 1, cursor: sending ? "not-allowed" : "pointer" }}
      >
        {sending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
// Add fonts to app/layout.jsx <head>:
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

export default function HomePage() {
  return (
    <>
      <div style={{ background: "#f7f3e8", fontFamily: "'Jost', sans-serif", color: "#3d2800" }}>

        {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
        <section style={S.sect}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
            <div>
              <div style={S.heroBadge}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="6" cy="6" r="5" stroke="#8b6914" strokeWidth="0.8" />
                  <circle cx="6" cy="6" r="1.5" fill="#8b6914" />
                </svg>
                Vedic Jyotish · Est. 2003
              </div>

              <h1 style={S.heroTitle}>
                MD Astrology<br />
                <em style={{ fontStyle: "italic", color: "#8b6914" }}>Illuminating Destinies</em><br />
                Since 2003
              </h1>

              <p style={S.heroSub}>
                Authentic Vedic astrology consultations rooted in classical Jyotish tradition.
                Decode your Kundali, navigate life's currents, and align with your cosmic purpose.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/contact" style={{ ...S.btnPrimary, textDecoration: "none", display: "inline-block" }}>
                  Book a Consultation
                </Link>
                <Link href="/ourPlans" style={{ ...S.btnOutline, textDecoration: "none", display: "inline-block" }}>
                  View our plans
                </Link>
              </div>
            </div>

            <div className="hero-chart-hide">
              <HeroChart />
            </div>
          </div>
        </section>

        {/* ══ STATS BAR ══════════════════════════════════════════════════════ */}
        <div style={{ background: "#fffef9", borderTop: "1px solid #d4b96a", borderBottom: "1px solid #d4b96a", padding: "20px 32px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{ textAlign: "center", padding: "10px 0", borderRight: i < 3 ? "1px solid #e8d89a" : "none" }}
              >
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#8b6914", lineHeight: 1 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#7a5c2e", fontWeight: 300, marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SERVICES ═══════════════════════════════════════════════════════ */}
        <section style={S.sect}>
          <SectionHeader eyebrow="What we offer" title="Our Services" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {SERVICES.map((svc) => (
              <div
                key={svc.title}
                style={S.svcCard}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#8b6914")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d4b96a")}
              >
                <div style={S.svcIcon}>{svc.icon}</div>
                <h3 style={S.svcTitle}>{svc.title}</h3>
                <p style={S.svcDesc}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ ABOUT ══════════════════════════════════════════════════════════ */}
        <section style={{ background: "#fffef9", borderTop: "1px solid #d4b96a", borderBottom: "1px solid #d4b96a", padding: "56px 32px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ background: "#f7f3e8", border: "1px solid #d4b96a", borderRadius: 2, padding: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AboutChart />
            </div>
            <div>
              <p style={S.eyebrow}>About the astrologer</p>
              <h2 style={{ ...S.sectionTitle, fontSize: 34, marginBottom: 0 }}>
                Meet Pandit<br />MD Sharma
              </h2>
              <blockquote style={S.quote}>
                "The stars incline, they do not compel — but a wise man reads them."
              </blockquote>
              <p style={S.aboutBody}>
                With over two decades of dedicated practice in Parashari and Jaimini systems of Vedic Jyotish,
                Pandit MD Sharma has guided thousands of seekers across India and the world. Trained under
                revered Jyotish Gurus in Varanasi, his approach combines classical rigour with compassionate counsel.
              </p>
              <p style={{ ...S.aboutBody, marginTop: 12 }}>
                He holds an MA in Sanskrit and is a Gold Medalist from the Bharatiya Vidya Bhavan, Delhi.
                He has been featured in Navbharat Times, Dainik Bhaskar, and Times of India.
              </p>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "#3d2800", marginTop: 24 }}>
                Pandit MD Sharma
              </div>
              <div style={{ fontSize: 11, letterSpacing: ".1em", color: "#8b6914", marginTop: 4 }}>
                MA Sanskrit · Gold Medalist · 20+ Years Experience
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <Link href="/contact" style={{ ...S.btnPrimary, textDecoration: "none", display: "inline-block" }}>
                  Book a Session
                </Link>
                <Link href="/about" style={{ ...S.btnOutline, textDecoration: "none", display: "inline-block" }}>
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ═══════════════════════════════════════════════════ */}
        <section style={S.sect}>
          <SectionHeader eyebrow="Client voices" title="Testimonials" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.author} style={S.testCard}>
                <div style={{ color: "#c9a84c", fontSize: 13, letterSpacing: 3, marginBottom: 10 }}>★★★★★</div>
                <p style={S.testText}>"{t.text}"</p>
                <div style={{ fontSize: 11, letterSpacing: ".08em", color: "#8b6914", textTransform: "uppercase" }}>
                  {t.author}
                </div>
                <div style={{ fontSize: 11, color: "#c9a84c", marginTop: 2 }}>{t.loc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CONTACT ════════════════════════════════════════════════════════ */}
        <section style={{ background: "#fffef9", borderTop: "1px solid #d4b96a", borderBottom: "1px solid #d4b96a", padding: "56px 32px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <SectionHeader eyebrow="Get in touch" title="Contact Us" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>

              {/* Contact info */}
              <div style={S.contactCard}>
                <h3 style={S.contactCardTitle}>Consultation Details</h3>
                {CONTACT_INFO.map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: i < CONTACT_INFO.length - 1 ? 16 : 0,
                      paddingBottom: i < CONTACT_INFO.length - 1 ? 16 : 0,
                      borderBottom: i < CONTACT_INFO.length - 1 ? "0.5px solid #e8d89a" : "none",
                    }}
                  >
                    <div style={S.cinfoIcon}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5" stroke="#8b6914" strokeWidth="0.8" />
                        <circle cx="6" cy="6" r="1.5" fill="#c9a84c" />
                      </svg>
                    </div>
                    <div>
                      <div style={S.cinfoLabel}>{item.label}</div>
                      <div style={S.cinfoVal}>
                        {item.value.split("\n").map((line, j, arr) => (
                          <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              <div style={S.contactCard}>
                <h3 style={S.contactCardTitle}>Send a Message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ═════════════════════════════════════════════════════════ */}
        <footer style={{ background: "#fffef9", borderTop: "1px solid #d4b96a", padding: "32px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="8.5" stroke="#d4b96a" strokeWidth=".8" />
                  <circle cx="10" cy="10" r="2" fill="#8b6914" />
                  <line x1="10" y1="2"  x2="10" y2="18" stroke="#e8d89a" strokeWidth=".6" />
                  <line x1="2"  y1="10" x2="18" y2="10" stroke="#e8d89a" strokeWidth=".6" />
                </svg>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#3d2800" }}>
                  MD Astrology
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#8b6914", fontWeight: 300, letterSpacing: ".06em" }}>
                Vedic Jyotish · Chandigarh, India
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Services", "About", "Testimonials", "Contact", "Privacy Policy"].map((label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase().replace(" ", "-")}`}
                  style={{ fontSize: 12, color: "#7a5c2e", textDecoration: "none", letterSpacing: ".04em", fontWeight: 300 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#3d2800")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#7a5c2e")}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, letterSpacing: ".18em", color: "#c9a84c", fontWeight: 300 }}>
            ॥ ज्योतिषं वेदचक्षुः ॥ &nbsp;·&nbsp; © {new Date().getFullYear()} MD Astrology · All rights reserved
          </div>
        </footer>
      </div>

      {/* Hide hero chart on small screens */}
      <style>{`
        @media (max-width: 640px) {
          .hero-chart-hide { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  sect: {
    padding: "56px 32px",
    maxWidth: 960,
    margin: "0 auto",
  },
  eyebrow: {
    margin: "0 0 8px",
    fontSize: 10,
    letterSpacing: ".22em",
    textTransform: "uppercase",
    color: "#8b6914",
    fontWeight: 300,
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 34,
    fontWeight: 500,
    color: "#3d2800",
    margin: 0,
    whiteSpace: "nowrap",
  },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 52,
    fontWeight: 500,
    lineHeight: 1.1,
    color: "#3d2800",
    marginBottom: 18,
  },
  heroSub: {
    fontSize: 14,
    fontWeight: 300,
    lineHeight: 1.8,
    color: "#7a5c2e",
    maxWidth: 460,
    marginBottom: 32,
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 14px",
    border: "1px solid #d4b96a",
    borderRadius: 20,
    fontSize: 11,
    letterSpacing: ".14em",
    textTransform: "uppercase",
    color: "#8b6914",
    marginBottom: 20,
    fontWeight: 300,
  },
  btnPrimary: {
    padding: "11px 28px",
    background: "#8b6914",
    color: "#fffef9",
    border: "none",
    borderRadius: 2,
    fontFamily: "'Jost', sans-serif",
    fontSize: 13,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  btnOutline: {
    padding: "11px 28px",
    background: "transparent",
    color: "#8b6914",
    border: "1px solid #d4b96a",
    borderRadius: 2,
    fontFamily: "'Jost', sans-serif",
    fontSize: 13,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  svcCard: {
    background: "#fffef9",
    border: "1px solid #d4b96a",
    borderRadius: 2,
    padding: "24px 20px",
    transition: "border-color .2s",
    cursor: "default",
  },
  svcIcon: {
    width: 36,
    height: 36,
    border: "1px solid #d4b96a",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  svcTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 18,
    fontWeight: 500,
    color: "#3d2800",
    marginBottom: 8,
  },
  svcDesc: {
    fontSize: 12,
    fontWeight: 300,
    color: "#7a5c2e",
    lineHeight: 1.7,
    margin: 0,
  },
  quote: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20,
    fontStyle: "italic",
    color: "#5a3c00",
    lineHeight: 1.5,
    margin: "20px 0",
    paddingLeft: 16,
    borderLeft: "2px solid #8b6914",
  },
  aboutBody: {
    fontSize: 13,
    fontWeight: 300,
    lineHeight: 1.9,
    color: "#7a5c2e",
    margin: 0,
  },
  testCard: {
    background: "#fffef9",
    border: "1px solid #d4b96a",
    borderRadius: 2,
    padding: "22px 18px",
  },
  testText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 15,
    fontStyle: "italic",
    color: "#5a3c00",
    lineHeight: 1.6,
    margin: "0 0 14px",
  },
  contactCard: {
    background: "#fffef9",
    border: "1px solid #d4b96a",
    borderRadius: 2,
    padding: "28px 24px",
  },
  contactCardTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20,
    fontWeight: 500,
    color: "#3d2800",
    marginBottom: 20,
    marginTop: 0,
  },
  cinfoIcon: {
    width: 32,
    height: 32,
    border: "1px solid #d4b96a",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  cinfoLabel: {
    fontSize: 10,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "#8b6914",
    marginBottom: 3,
    fontWeight: 400,
  },
  cinfoVal: {
    fontSize: 13,
    color: "#3d2800",
    fontWeight: 300,
    lineHeight: 1.6,
  },
  formLabel: {
    fontSize: 10,
    letterSpacing: ".14em",
    textTransform: "uppercase",
    color: "#8b6914",
    display: "block",
    marginBottom: 6,
    fontWeight: 400,
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #d4b96a",
    borderRadius: 2,
    background: "#fffef9",
    fontFamily: "'Jost', sans-serif",
    fontSize: 13,
    color: "#3d2800",
    outline: "none",
    transition: "border-color .2s",
    boxSizing: "border-box",
  },
};