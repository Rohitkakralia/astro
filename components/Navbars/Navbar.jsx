"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { User, LogOut, UserCircle } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Fill Details", href: "/input" },
  { label: "Charts", href: "/charts", private: true },
  { label: "History", href: "/history", private: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    setProfileOpen(false);
    router.push("/login");
  };

  const handleLogin = () => {
    window.location.href = "/login";
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500&display=swap');

        .jy-nav-link {
          padding: 0.35rem 0.9rem;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: #7a5c2e;
          text-decoration: none;
          border-radius: 2px;
          letter-spacing: 0.02em;
          border-bottom: 1.5px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          padding-bottom: 0.3rem;
        }
        .jy-nav-link:hover { color: #3d2800; }
        .jy-nav-link.active { font-weight: 500; color: #3d2800; border-bottom: 1.5px solid #8b6914; }

        .jy-outline-btn {
          padding: 0 1rem;
          height: 32px;
          background: transparent;
          border: 1px solid #d4b96a;
          border-radius: 2px;
          color: #8b6914;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.06em;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .jy-outline-btn:hover {
          background: #fff8e8;
          border-color: #8b6914;
          color: #3d2800;
        }

        .jy-profile-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid #d4b96a;
          border-radius: 50%;
          cursor: pointer;
          color: #8b6914;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .jy-profile-btn:hover {
          background: #fff8e8;
          border-color: #8b6914;
          color: #3d2800;
        }

        .jy-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid #e8d89a;
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(139, 105, 20, 0.12);
          min-width: 152px;
          overflow: hidden;
          z-index: 100;
          animation: jy-fade-in 0.15s ease;
        }
        @keyframes jy-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .jy-dropdown-item {
          width: 100%;
          padding: 10px 14px;
          background: white;
          border: none;
          border-bottom: 1px solid #f5edd9;
          text-align: left;
          cursor: pointer;
          font-size: 13px;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s;
        }
        .jy-dropdown-item:last-child { border-bottom: none; }
        .jy-dropdown-item:hover { background: #fff8e8; }
        .jy-dropdown-item.danger { color: #8b3a2a; }
        .jy-dropdown-item:not(.danger) { color: #5c4200; }

        @media (max-width: 640px) {
          .jy-links     { display: none !important; }
          .jy-right-btn { display: none !important; }
          .jy-burger    { display: flex !important; }
        }
        @media (min-width: 900px) {
          .jy-tagline { display: inline !important; }
        }

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

      {/* ══ Main bar ═════════════════════════════════════════════════════════ */}
      <nav
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
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
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="15" cy="15" r="13" stroke="#d4b96a" strokeWidth="1" />
            <circle cx="15" cy="15" r="3" fill="#8b6914" />
            <circle cx="15" cy="3.5" r="1.5" fill="#c9a84c" />
            <circle cx="26.5" cy="15" r="1.5" fill="#c9a84c" />
            <circle cx="15" cy="26.5" r="1.5" fill="#c9a84c" />
            <circle cx="3.5" cy="15" r="1.5" fill="#c9a84c" />
            <line x1="15" y1="3.5" x2="15" y2="26.5" stroke="#e8d89a" strokeWidth="0.6" />
            <line x1="3.5" y1="15" x2="26.5" y2="15" stroke="#e8d89a" strokeWidth="0.6" />
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
            className="jy-tagline"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "#8b6914",
              textTransform: "uppercase",
              fontWeight: 300,
              marginTop: 2,
              display: "none",
            }}
          >
            Vedic Kundali
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="jy-links" style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
          {NAV_LINKS.filter((l) => !l.private || isLoggedIn).map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`jy-nav-link${isActive ? " active" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {!isLoggedIn && (
            <>
              <button
                className="jy-outline-btn jy-right-btn"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
              <button
                className="jy-outline-btn jy-right-btn"
                onClick={handleLogin}
              >
                Login
              </button>
            </>
          )}

          {isLoggedIn && (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                className="jy-profile-btn jy-right-btn"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Account menu"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <User size={15} />
              </button>

              {profileOpen && (
                <div className="jy-dropdown" role="menu">
                  <button
                    className="jy-dropdown-item"
                    role="menuitem"
                    onClick={() => { router.push("/profile"); setProfileOpen(false); }}
                  >
                    <UserCircle size={15} color="#c9a84c" />
                    Profile
                  </button>
                  <button
                    className="jy-dropdown-item danger"
                    role="menuitem"
                    onClick={handleSignOut}
                  >
                    <LogOut size={15} color="#c9a84c" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button
            className={`jy-burger${open ? " open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{
              display: "none",
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

      {/* ══ Mobile drawer ════════════════════════════════════════════════════ */}
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
          {NAV_LINKS.filter((l) => !l.private || isLoggedIn).map((l) => {
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
                  borderBottom: isActive ? "1px solid #8b6914" : "1px solid transparent",
                  display: "block",
                }}
              >
                {l.label}
              </Link>
            );
          })}

          {!isLoggedIn && (
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
              onClick={handleLogin}
            >
              Login
            </button>
          )}

          {isLoggedIn && (
            <>
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onClick={() => { router.push("/profile"); setOpen(false); }}
              >
                <UserCircle size={15} />
                Profile
              </button>
              <button
                style={{
                  marginTop: "0.4rem",
                  width: "100%",
                  height: 38,
                  background: "transparent",
                  border: "1px solid #d4b96a",
                  borderRadius: 2,
                  color: "#8b3a2a",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 14,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onClick={handleSignOut}
              >
                <LogOut size={15} />
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}