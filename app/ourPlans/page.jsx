"use client";

import Link from "next/link";
import { Star, Sparkles, Check } from "lucide-react";

// ─── plans ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    key: "starter",
    name: "100 Kundalis",
    total: 100,
    desc: "Ideal for individual astrologers",
    amount: 999,
    per: "₹9.99 / kundali",
    popular: false,
  },
  {
    key: "pro",
    name: "500 Kundalis",
    total: 500,
    desc: "Best for active practitioners",
    amount: 3499,
    per: "₹6.99 / kundali",
    popular: true,
  },
  {
    key: "enterprise",
    name: "1,000 Kundalis",
    total: 1000,
    desc: "For institutions & large bureaus",
    amount: 5999,
    per: "₹5.99 / kundali",
    popular: false,
  },
];

// ─── page ─────────────────────────────────────────────────────────────────
export default function PricingPage() {
  return (
    <div style={pageStyle}>
      <style>{fonts + animations + responsive}</style>

      {/* Hero */}
      <div
        style={{
          borderBottom: "1px solid #e8d89a",
          background: "#fffef9",
        }}
      >
        <div style={{ ...container, paddingTop: "5rem", paddingBottom: "4rem" }}>
          <div
            style={{
              textAlign: "center",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                border: "1px solid #d4b96a",
                borderRadius: 20,
                color: "#8b6914",
                fontSize: 12,
                letterSpacing: "0.08em",
                background: "#fff8e8",
                marginBottom: "1.25rem",
              }}
            >
              <Sparkles size={13} color="#c9a84c" />
              PREMIUM KUNDALI PLANS
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "3rem",
                lineHeight: 1.1,
                color: "#3d2800",
                marginBottom: "1rem",
                fontWeight: 600,
              }}
            >
              Choose Your Astrology Plan
            </h1>

            <p
              style={{
                fontSize: 15,
                color: "#7a5c2e",
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Generate accurate kundalis with flexible plans tailored
              for individual astrologers, professionals, and institutions.
            </p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div style={{ ...container, paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div className="pricing-grid">
          {PLANS.map((plan, i) => (
            <div
              key={plan.key}
              style={{
                position: "relative",
                background: plan.popular ? "#fffaf0" : "#fffef9",
                border: plan.popular
                  ? "2px solid #c9a84c"
                  : "1px solid #e8d89a",
                borderRadius: 6,
                padding: "2rem",
                animation: `fadeUp 0.45s ${i * 0.1}s ease both`,
                boxShadow: plan.popular
                  ? "0 10px 40px rgba(201,168,76,0.08)"
                  : "none",
              }}
            >
              {/* popular badge */}
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: "#c9a84c",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    letterSpacing: "0.06em",
                  }}
                >
                  <Star size={11} fill="white" />
                  MOST POPULAR
                </div>
              )}

              {/* heading */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    color: "#3d2800",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  {plan.name}
                </h2>

                <p
                  style={{
                    fontSize: 13,
                    color: "#8b6914",
                    fontWeight: 300,
                    lineHeight: 1.7,
                  }}
                >
                  {plan.desc}
                </p>
              </div>

              {/* pricing */}
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 50,
                      color: "#3d2800",
                      lineHeight: 1,
                    }}
                  >
                    ₹{plan.amount}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    color: "#8b6914",
                    fontSize: 13,
                    letterSpacing: "0.04em",
                  }}
                >
                  {plan.per}
                </div>
              </div>

              {/* features */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: "2rem",
                }}
              >
                {[
                  `${plan.total} Kundali Credits`,
                  "Detailed Kundali Reports",
                  "Instant Chart Generation",
                  "Premium Astrology Access",
                ].map((feature) => (
                  <div
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#fff8e8",
                        border: "1px solid #d4b96a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} color="#8b6914" />
                    </div>

                    <span
                      style={{
                        fontSize: 13,
                        color: "#5f4517",
                        fontWeight: 300,
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* button */}
              <Link
                href={`/update-plan`}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  background: plan.popular ? "#c9a84c" : "transparent",
                  color: plan.popular ? "#fff" : "#8b6914",
                  border: "1px solid #c9a84c",
                  padding: "12px 18px",
                  borderRadius: 3,
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#c9a84c";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = plan.popular
                    ? "#c9a84c"
                    : "transparent";
                  e.currentTarget.style.color = plan.popular
                    ? "#fff"
                    : "#8b6914";
                }}
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────
const pageStyle = {
  minHeight: "100vh",
  background: "#faf8f0",
  fontFamily: "'Jost', sans-serif",
};

const container = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 1.5rem",
};

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500&display=swap');
`;

const animations = `
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const responsive = `
.pricing-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:2rem;
}

@media (max-width: 900px){
  .pricing-grid{
    grid-template-columns:1fr;
  }
}
`;