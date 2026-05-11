"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

const NAV_LINKS = [
  { label: "Fill Details", href: "/" },
  { label: "Charts", href: "/charts", private: true },
  { label: "History", href: "/history", private: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const [open, setOpen] = useState(false);

  
  const dropdownItemStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "white",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: 14,
  color: "#5c4200",
  transition: "background 0.2s",
};


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");

      // 2. Clear the cookie (set expiry in the past)
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

      // 3. Redirect to login
      router.push("/login");
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <header
      style={{
        fontFamily: "'Jost', sans-serif",
        background: "#fffef9",
        borderBottom: "1px solid #d4b96a",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* ── Font import — move to app/layout.tsx <head> in production ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500&display=swap');
      `}</style>

      {/* ══ Main bar ════════════════════════════════════════════════════════ */}
      <nav
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "30px",
          width: "100%",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Mandala-style icon matching chart aesthetic */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="15" cy="15" r="13" stroke="#d4b96a" strokeWidth="1" />
            <circle cx="15" cy="15" r="3" fill="#8b6914" />
            <circle cx="15" cy="3.5" r="1.5" fill="#c9a84c" />
            <circle cx="26.5" cy="15" r="1.5" fill="#c9a84c" />
            <circle cx="15" cy="26.5" r="1.5" fill="#c9a84c" />
            <circle cx="3.5" cy="15" r="1.5" fill="#c9a84c" />
            <line
              x1="15"
              y1="3.5"
              x2="15"
              y2="26.5"
              stroke="#e8d89a"
              strokeWidth="0.6"
            />
            <line
              x1="3.5"
              y1="15"
              x2="26.5"
              y2="15"
              stroke="#e8d89a"
              strokeWidth="0.6"
            />
          </svg>

          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#3d2800",
              letterSpacing: "0.04em",
            }}
          >
            MD
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "#8b6914",
              textTransform: "uppercase",
              fontWeight: 300,
              marginTop: 2,
              display: "none", // shown via media query below
            }}
            className="jy-tagline"
          >
            Vedic Kundali
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
  className="jy-links"
  style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}
>
  {NAV_LINKS.filter((l) => !l.private || isLoggedIn).map((l) => {
    const isActive = pathname === l.href;

    return (
      <Link
        key={l.href}
        href={l.href}
        style={{
          padding: "0.35rem 0.9rem",
          fontFamily: "'Jost', sans-serif",
          fontSize: 14,
          fontWeight: isActive ? 500 : 300,
          color: isActive ? "#3d2800" : "#7a5c2e",
          textDecoration: "none",
          borderRadius: 2,
          letterSpacing: "0.02em",
          borderBottom: isActive
            ? "1.5px solid #8b6914"
            : "1.5px solid transparent",
          transition: "color 0.2s, border-color 0.2s",
          paddingBottom: "0.3rem",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = "#3d2800";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = "#7a5c2e";
          }
        }}
      >
        {l.label}
      </Link>
    );
  })}
</div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button className="jy-right-btn" style={{ padding: "0 1rem", height: 32, background: "transparent", border: "1px solid #d4b96a", borderRadius: 2, color: "#8b6914", fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 400, letterSpacing: "0.06em", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s, border-color 0.2s, color 0.2s", }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff8e8"; e.currentTarget.style.borderColor = "#8b6914"; e.currentTarget.style.color = "#3d2800"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#d4b96a"; e.currentTarget.style.color = "#8b6914"; }} onClick={handleClick} > {isLoggedIn ? "Sign Out" : "Login"} </button>

          {/* Hamburger — shown only on mobile */}
          <button
            className={`jy-burger${open ? " open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{
              display: "none", // overridden by media query
              flexDirection: "column",
              gap: 5,
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 4,
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ══ Mobile drawer ═══════════════════════════════════════════════════ */}
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#fffef9",
            borderTop: "1px solid #e8d89a",
            padding: "0.75rem 1.5rem 1rem",
            gap: "0.1rem",
          }}
        >
          {NAV_LINKS.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "0.6rem 0.5rem",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 15,
                  fontWeight: isActive ? 500 : 300,
                  color: isActive ? "#3d2800" : "#7a5c2e",
                  textDecoration: "none",
                  borderBottom: isActive
                    ? "1px solid #8b6914"
                    : "1px solid transparent",
                  display: "block",
                }}
              >
                {l.label}
              </Link>
            );
          })}
          <button
            style={{
              marginTop: "0.6rem",
              width: "100%",
              height: 38,
              background: "transparent",
              border: "1px solid #d4b96a",
              borderRadius: 2,
              color: "#8b6914",
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
            onClick={handleClick}
          >
            {isLoggedIn ? "Sign Out" : "Login"}
          </button>
        </div>
      )}

      {/* ── Scoped styles for responsive behaviour ── */}
      <style>{`
        @media (max-width: 640px) {
          .jy-links     { display: none !important; }
          .jy-right-btn { display: none !important; }
          .jy-burger    { display: flex !important; }
        }
        @media (min-width: 900px) {
          .jy-tagline { display: inline !important; }
        }

        /* Burger bar lines */
        .jy-burger span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: #8b6914;
          transition: all 0.25s;
        }
        .jy-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .jy-burger.open span:nth-child(2) { opacity: 0; }
        .jy-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
      `}</style>
    </header>
  );
}
