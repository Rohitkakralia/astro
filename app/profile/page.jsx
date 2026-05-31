"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Star,
  MapPin,
  Clock,
  Trash2,
  ChevronRight,
} from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function initials(email = "") {
  return email.slice(0, 2).toUpperCase();
}

// ─── sub-components ───────────────────────────────────────────────────────────

function StatPill({ value, label }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem 1.5rem",
        background: "#fffef9",
        border: "1px solid #e8d89a",
        borderRadius: 4,
        minWidth: 100,
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28,
          fontWeight: 600,
          color: "#3d2800",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "#8b6914",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: "1.25rem",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18,
          fontWeight: 600,
          color: "#3d2800",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "#e8d89a" }} />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.65rem 0",
        borderBottom: "1px solid #f5edd9",
      }}
    >
      {/* icon + label — fixed-width left column */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          minWidth: 140,
          flexShrink: 0,
        }}
      >
        <Icon size={14} color="#c9a84c" strokeWidth={1.5} />
        <span style={{ fontSize: 13, color: "#8b6914", fontWeight: 300 }}>
          {label}
        </span>
      </div>

      {/* value */}
      <span
        style={{
          fontSize: 13,
          color: "#3d2800",
          fontWeight: 400,
          flex: 1,
          wordBreak: "break-all",
          overflow: "hidden",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function KundaliCard({ k, onDelete }) {
  const [hover, setHover] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

    const handleView = (k) => {
    const payload = {
      name:         k.name,
      dob:          (k.dob instanceof Date ? k.dob : new Date(k.dob)).toISOString().split("T")[0],
      tob:          (k.tob ?? "12:00").slice(0, 5),
      utcOffsetMin: Number(k.utc_offset_min ?? 330),
      lat:          parseFloat(k.latitude),
      lon:          parseFloat(k.longitude),
      gender:       k.gender,
      city:         k.city    ?? "",
      country:      k.country ?? "",
    };
    const encoded = btoa(JSON.stringify(payload));
    router.push(`/charts?data=${encoded}`);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#fffbf0" : "#fffef9",
        border: "1px solid #e8d89a",
        borderRadius: 4,
        padding: "1rem 1.25rem",
        transition: "background 0.2s",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 17,
              fontWeight: 600,
              color: "#3d2800",
            }}
          >
            {k.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#8b6914",
              marginTop: 2,
              fontWeight: 300,
            }}
          >
            {k.gender} · {formatDate(k.dob)} · {k.tob || "—"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
          <button
  onClick={() => handleView(k)}
  onMouseEnter={(e) => (e.currentTarget.style.background = "#fff8e8")}
  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 10px",
    border: "1px solid #d4b96a",
    borderRadius: 2,
    color: "#8b6914",
    fontSize: 12,
    background: "transparent",
    cursor: "pointer",
    transition: "background 0.15s",
  }}
>
  Charts <ChevronRight size={11} />
</button>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                background: "transparent",
                border: "1px solid #e8c8c0",
                borderRadius: 2,
                color: "#b05a3a",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fff0eb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Trash2 size={13} />
            </button>
          ) : (
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => onDelete(k.id)}
                style={{
                  padding: "3px 8px",
                  background: "#b05a3a",
                  border: "none",
                  borderRadius: 2,
                  color: "white",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: "3px 8px",
                  background: "transparent",
                  border: "1px solid #d4b96a",
                  borderRadius: 2,
                  color: "#8b6914",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {(k.city || k.country) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#7a5c2e",
          }}
        >
          <MapPin size={12} color="#c9a84c" />
          {[k.city, k.country].filter(Boolean).join(", ")}
        </div>
      )}

      {k.description && (
        <p
          style={{
            fontSize: 12,
            color: "#7a5c2e",
            fontStyle: "italic",
            lineHeight: 1.5,
            margin: "8px 0 0",
          }}
        >
          {k.description}
        </p>
      )}
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load profile.");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/saveKundali?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setData((prev) => ({
        ...prev,
        kundalis: prev.kundalis.filter((k) => k.id !== id),
        kundaliCount: prev.kundaliCount - 1,
      }));
    }
  };

  // ── loading ──
  if (loading)
    return (
      <div style={pageStyle}>
        <style>{fonts}</style>
        <div style={shimmerWrap}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                ...shimmerBar,
                width: i === 1 ? "40%" : i === 2 ? "70%" : "55%",
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>
    );

  // ── error ──
  if (error)
    return (
      <div style={{ ...pageStyle, paddingTop: "4rem", textAlign: "center" }}>
        <style>{fonts}</style>
        <p
          style={{
            color: "#8b3a2a",
            fontFamily: "'Jost', sans-serif",
            fontSize: 14,
          }}
        >
          {error}
        </p>
      </div>
    );

  const {
    user,
    remainingKundalis,
    activeSubscription,
    subscriptionHistory,
    kundalis,
    kundaliCount,
  } = data;
  return (
    <div style={pageStyle}>
      <style>{fonts + animations + responsive}</style>

      {/* ── Hero strip ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#fffef9",
          borderBottom: "1px solid #e8d89a",
          padding: "2.5rem 0 2rem",
          animation: "fadeUp 0.5s ease both",
        }}
      >
        <div style={container}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {/* avatar */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e8d89a 0%, #c9a84c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 600,
                color: "#3d2800",
                border: "2px solid #d4b96a",
                flexShrink: 0,
              }}
            >
              {initials(user.email)}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#3d2800",
                  wordBreak: "break-all",
                }}
              >
                {user.email}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#8b6914",
                  marginTop: 3,
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                }}
              >
                Member since {formatDate(user.memberSince)}
              </div>
            </div>

            {/* stat pills */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                flexShrink: 0,
              }}
            >
              <StatPill value={remainingKundalis} label="Remaining Kundalis" />
              {remainingKundalis < 10 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0.6rem 1rem",
                    background: "#fff7ed",
                    border: "1px solid #fdba74",
                    borderRadius: 4,
                    marginTop: "0.75rem",
                    animation: "fadeUp 0.4s ease both",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c2410c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#c2410c",
                        display: "block",
                      }}
                    >
                      Only {remainingKundalis} kundali
                      {remainingKundalis === 1 ? "" : "s"} remaining
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#9a3412",
                        fontWeight: 300,
                      }}
                    >
                      Top up your balance to continue generating charts
                    </span>
                  </div>
                  <Link
                    href="/update-plan"
                    style={{
                      marginLeft: "auto",
                      flexShrink: 0,
                      padding: "4px 12px",
                      background: "#c2410c",
                      border: "none",
                      borderRadius: 2,
                      color: "white",
                      fontSize: 11,
                      textDecoration: "none",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Top Up →
                  </Link>
                </div>
              )}
              <StatPill value={kundaliCount} label="Saved" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div
        style={{ ...container, paddingTop: "2.5rem", paddingBottom: "4rem" }}
      >
        <div
          className="pf-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* ── LEFT: account + subscription ───────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              minWidth: 0,
            }}
          >
            {/* Account */}
            <div
              style={{
                background: "#fffef9",
                border: "1px solid #e8d89a",
                borderRadius: 4,
                padding: "1.25rem 1.5rem",
                animation: "fadeUp 0.5s 0.1s ease both",
              }}
            >
              <SectionHeading>Account</SectionHeading>
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow
                icon={Calendar}
                label="Member Since"
                value={formatDate(user.memberSince)}
              />
            </div>

            {/* Subscription */}
            <div
              style={{
                background: "#fffef9",
                border: "1px solid #e8d89a",
                borderRadius: 4,
                padding: "1.25rem 1.5rem",
                animation: "fadeUp 0.5s 0.2s ease both",
              }}
            >
              <SectionHeading>Subscription</SectionHeading>

              {activeSubscription ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 12px",
      background: "#fff8e8",
      border: "1px solid #d4b96a",
      borderRadius: 20,
      fontSize: 12,
      color: "#8b6914",
      letterSpacing: "0.05em",
    }}
  >
    <Star size={11} color="#c9a84c" />
    {activeSubscription.planName}
  </div>

  <button
    onClick={() => router.push("/update-plan")}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 12px",
      background: "transparent",
      border: "1px solid #d4b96a",
      borderRadius: 20,
      fontSize: 12,
      color: "#8b6914",
      cursor: "pointer",
      letterSpacing: "0.05em",
      transition: "background 0.15s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff8e8")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    Update subscription
  </button>
</div>
                  <InfoRow
                    icon={Star}
                    label="Plan"
                    value={activeSubscription.planName}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Purchased"
                    value={formatDate(activeSubscription.purchasedAt)}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Amount"
                    value={`₹${activeSubscription.planAmount} + ₹${activeSubscription.gst} GST`}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Total"
                    value={`₹${activeSubscription.total} ${activeSubscription.currency}`}
                  />
                  <InfoRow
                    icon={User}
                    label="Payment ID"
                    value={activeSubscription.razorpayPaymentId}
                  />
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#8b6914",
                      fontWeight: 300,
                      marginBottom: "0.75rem",
                    }}
                  >
                    No active subscription
                  </p>
                  <Link
                    href="/pricing"
                    style={{
                      display: "inline-block",
                      padding: "6px 18px",
                      border: "1px solid #d4b96a",
                      borderRadius: 2,
                      color: "#8b6914",
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                  >
                    View Plans
                  </Link>
                </div>
              )}

              {/* ── Payment History ── */}
              {subscriptionHistory?.length > 1 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      color: "#8b6914",
                      textTransform: "uppercase",
                      marginBottom: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    Payment History
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {subscriptionHistory.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.6rem 0.75rem",
                          background: i === 0 ? "#fff8e8" : "#fffef9",
                          border: "1px solid #e8d89a",
                          borderRadius: 2,
                          fontSize: 12,
                        }}
                      >
                        <div>
                          <span style={{ color: "#3d2800", fontWeight: 500 }}>
                            {s.planName}
                          </span>
                          {i === 0 && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 10,
                                color: "#8b6914",
                                background: "#e8d89a",
                                padding: "1px 6px",
                                borderRadius: 10,
                              }}
                            >
                              Latest
                            </span>
                          )}
                          <div
                            style={{
                              color: "#a08040",
                              marginTop: 2,
                              fontWeight: 300,
                            }}
                          >
                            {formatDate(s.purchasedAt)}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ color: "#8b6914", fontWeight: 500 }}>
                            ₹{s.total.toLocaleString("en-IN")}
                          </div>
                          <div
                            style={{
                              color: "#a08040",
                              fontSize: 11,
                              marginTop: 2,
                              fontWeight: 300,
                            }}
                          >
                            {s.razorpayPaymentId?.slice(-8)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: kundalis ─────────────────────────────────────────── */}
          <div
            style={{ animation: "fadeUp 0.5s 0.15s ease both", minWidth: 0 }}
          >
            <SectionHeading>Saved Kundalis</SectionHeading>

            {kundalis.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  border: "1px dashed #d4b96a",
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18,
                    color: "#c9a84c",
                    marginBottom: 8,
                  }}
                >
                  No kundalis saved yet
                </div>
                <Link
                  href="/input"
                  style={{
                    fontSize: 13,
                    color: "#8b6914",
                    textDecoration: "none",
                    borderBottom: "1px solid #d4b96a",
                  }}
                >
                  Add your first kundali →
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {kundalis.map((k, i) => (
                  <div
                    key={k.id}
                    style={{
                      animation: `fadeUp 0.4s ${0.05 * i + 0.2}s ease both`,
                    }}
                  >
                    <KundaliCard k={k} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const pageStyle = {
  minHeight: "100vh",
  background: "#faf8f0",
  fontFamily: "'Jost', sans-serif",
};

const container = {
  maxWidth: 1000,
  margin: "0 auto",
  padding: "0 1.5rem",
};

const shimmerWrap = {
  maxWidth: 1000,
  margin: "4rem auto",
  padding: "0 1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const shimmerBar = {
  height: 18,
  background: "#e8d89a",
  borderRadius: 4,
  animation: "shimmer 1.2s ease-in-out infinite alternate",
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500&display=swap');
`;

const animations = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    from { opacity: 0.4; }
    to   { opacity: 0.9; }
  }
`;

const responsive = `
  @media (max-width: 768px) {
    .pf-grid { grid-template-columns: 1fr !important; }
  }
`;
