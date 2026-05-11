"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// ─── Decorative Chart SVG ─────────────────────────────────────────────────────
function ChartWatermark() {
  return (
    <svg
      viewBox="0 0 300 200"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3" y="3" width="294" height="194"
        fill="none" stroke="#8b6914" strokeWidth="2.5"
      />
      <line x1="3"   y1="3"   x2="297" y2="197" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="297" y1="3"   x2="3"   y2="197" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="150" y1="3"   x2="3"   y2="100" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="3"   y1="100" x2="150" y2="197" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="150" y1="197" x2="297" y2="100" stroke="#8b6914" strokeWidth="1.2" />
      <line x1="297" y1="100" x2="150" y2="3"   stroke="#8b6914" strokeWidth="1.2" />
    </svg>
  );
}

// ─── Mini decorative chart ────────────────────────────────────────────────────
function MiniChart() {
  return (
    <svg
      viewBox="0 0 180 120"
      width="180"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-60"
    >
      <rect x="2" y="2" width="176" height="116" fill="none" stroke="#8b6914" strokeWidth="1.5" />
      <line x1="2"  y1="2"  x2="178" y2="118" stroke="#8b6914" strokeWidth="0.8" />
      <line x1="178" y1="2" x2="2"   y2="118" stroke="#8b6914" strokeWidth="0.8" />
      <line x1="90"  y1="2" x2="2"   y2="60"  stroke="#8b6914" strokeWidth="0.8" />
      <line x1="2"   y1="60" x2="90" y2="118" stroke="#8b6914" strokeWidth="0.8" />
      <line x1="90"  y1="118" x2="178" y2="60" stroke="#8b6914" strokeWidth="0.8" />
      <line x1="178" y1="60" x2="90"  y2="2"  stroke="#8b6914" strokeWidth="0.8" />
      <text x="90" y="26"  textAnchor="middle" fontSize="8"  fill="#8b6914" fontFamily="monospace">Su Ari</text>
      <text x="34" y="44"  textAnchor="middle" fontSize="7"  fill="#8b6914" fontFamily="monospace">Mo</text>
      <text x="146" y="44" textAnchor="middle" fontSize="7"  fill="#8b6914" fontFamily="monospace">Ju</text>
      <text x="90" y="100" textAnchor="middle" fontSize="8"  fill="#c9a84c" fontFamily="monospace">Sa℞ Aqu</text>
      <text x="90" y="66"  textAnchor="middle" fontSize="7"  fill="#8b6914" fontFamily="Georgia, serif" opacity="0.6">D1</text>
    </svg>
  );
}

// ─── Google Icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#8b6914" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#c9a84c" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#d4b96a" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#8b6914" />
    </svg>
  );
}

// ─── Rashi Dots Animator ──────────────────────────────────────────────────────
function RashiDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % 12);
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-1.5 justify-center mt-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          style={{ background: i === active ? "#8b6914" : "#e8d89a" }}
        />
      ))}
    </div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError] = useState("");


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.message || "Login failed. Please try again.");
      return;
    }

    // 1. Store in localStorage (for fetch() API calls)
    localStorage.setItem("token", data.token);

    // 2. Also store as a plain cookie so middleware can read it on page navigation
    //    (middleware runs on the server and cannot access localStorage)
    document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;

    // 3. Redirect to home
    router.push("/");

  } catch (err) {
    setError("Unable to reach the server. Check your connection.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/*
        ── Global font import ──
        Add this to your app/layout.tsx <head> instead:
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        ── tailwind.config.ts additions needed ──
        theme: {
          extend: {
            fontFamily: {
              serif:  ['Cormorant Garamond', 'Georgia', 'serif'],
              sans:   ['Jost', 'sans-serif'],
            },
            colors: {
              gold: {
                50:  '#fffef9',
                100: '#fff8e8',
                200: '#f7f3e8',
                300: '#e8d89a',
                400: '#d4b96a',
                500: '#c9a84c',
                600: '#8b6914',
                700: '#7a5c2e',
                800: '#5a3c00',
                900: '#3d2800',
              },
            },
          },
        },
      */}

      <div
        className="min-h-screen flex items-stretch"
        style={{ background: "#f7f3e8", fontFamily: "'Jost', sans-serif" }}
      >
        {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
        <div
          className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r"
          style={{ borderColor: "#d4b96a" }}
        >
          {/* Watermark chart */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
            <div className="w-[90%]">
              <ChartWatermark />
            </div>
          </div>

          {/* Brand */}
          <div className="relative z-10">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-4 border-2"
              style={{ borderColor: "#8b6914" }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#8b6914" strokeWidth="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="9" />
                <line x1="11" y1="2"  x2="11" y2="20" />
                <line x1="2"  y1="11" x2="20" y2="11" />
                <circle cx="11" cy="11" r="3" />
              </svg>
            </div>
            <h1
              className="text-3xl font-semibold tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}
            >
              MD
            </h1>
            <p
              className="text-xs tracking-widest uppercase mt-1"
              style={{ color: "#8b6914", letterSpacing: "0.15em" }}
            >
              Vedic Kundali System
            </p>
          </div>

          {/* Hero text */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
            <h2
              className="text-5xl font-medium leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}
            >
              The stars hold<br />
              <em className="not-italic" style={{ color: "#8b6914" }}>your story.</em>
              <br />We reveal it.
            </h2>
            <p
              className="text-sm leading-relaxed font-light max-w-xs"
              style={{ color: "#7a5c2e" }}
            >
              Generate precise Vedic birth charts, transit maps, and planetary
              dashas — rooted in classical Jyotish tradition.
            </p>

            {/* Mini chart */}
            <div className="mt-8">
              <MiniChart />
            </div>
          </div>

          {/* Footer */}
          <div
            className="relative z-10 text-xs tracking-widest"
            style={{ color: "#c9a84c" }}
          >
            ॥ ज्योतिषं वेदचक्षुः ॥
          </div>
        </div>

        {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
        <div
          className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-14"
          style={{ background: "#fffef9" }}
        >
          <div className="w-full max-w-sm mx-auto">

            {/* Mobile brand */}
            <div className="flex items-center gap-3 mb-10 lg:hidden">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: "#8b6914" }}
              >
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="#8b6914" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="11" cy="11" r="9" />
                  <line x1="11" y1="2"  x2="11" y2="20" />
                  <line x1="2"  y1="11" x2="20" y2="11" />
                  <circle cx="11" cy="11" r="3" />
                </svg>
              </div>
              <span
                className="text-xl font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}
              >
                Jyotish
              </span>
            </div>

            {/* Eyebrow */}
            <p
              className="text-xs uppercase tracking-widest mb-7"
              style={{ color: "#8b6914", letterSpacing: "0.18em" }}
            >
              — Welcome back —
            </p>

            {/* Heading */}
            <h2
              className="text-3xl font-medium mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2800" }}
            >
              Sign in to your chart
            </h2>
            <p className="text-sm font-light mb-9" style={{ color: "#a08040" }}>
              Access your Kundali, transits &amp; dashas
            </p>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "#8b6914", letterSpacing: "0.12em" }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3.5 py-2.5 text-sm font-light outline-none transition-colors duration-200"
                  style={{
                    background: "#fffef9",
                    border: "1px solid #d4b96a",
                    borderRadius: "2px",
                    color: "#3d2800",
                    fontFamily: "'Jost', sans-serif",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#8b6914")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#d4b96a")}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-xs uppercase tracking-widest"
                    style={{ color: "#8b6914", letterSpacing: "0.12em" }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-light transition-colors duration-150"
                    style={{ color: "#8b6914" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3d2800")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8b6914")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm font-light outline-none transition-colors duration-200"
                    style={{
                      background: "#fffef9",
                      border: "1px solid #d4b96a",
                      borderRadius: "2px",
                      color: "#3d2800",
                      fontFamily: "'Jost', sans-serif",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#8b6914")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "#d4b96a")}
                  />
                  {/* Show/hide toggle */}
                  <button
                    type="button"
                    aria-label={showPass ? "Hide password" : "Show password"}
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors duration-150"
                    style={{ color: "#c9a84c" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#8b6914")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#c9a84c")}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading ? "#c9a84c" : "#8b6914",
                  color: "#fffef9",
                  border: "none",
                  borderRadius: "2px",
                  fontFamily: "'Jost', sans-serif",
                  letterSpacing: "0.18em",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = "#6b5010";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = "#8b6914";
                }}
              >
                {loading ? "Entering…" : "Enter the Chart Room"}
              </button>
            </form>

            {error && (
  <p
    className="text-sm mt-3"
    style={{ color: "#b91c1c" }}
  >
    {error}
  </p>
)}


            {/* Sign-up link */}
            <p className="text-center text-xs mt-7 font-light" style={{ color: "#a08040" }}>
              New to Jyotish?{" "}
              <a
                href="/register"
                className="font-medium transition-colors duration-150"
                style={{ color: "#8b6914" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3d2800")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8b6914")}
              >
                Create your kundali account →
              </a>
            </p>

            {/* Rashi dots */}
            <RashiDots />
          </div>
        </div>
      </div>
    </>
  );
}