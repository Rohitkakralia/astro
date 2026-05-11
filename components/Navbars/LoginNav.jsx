"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [{ label: "Home", href: "/" }];

export default function LoginNav() {
  const pathname = usePathname();

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
              fontSize: 13,
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
          {" "}
          {NAV_LINKS.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "0.35rem 0.9rem",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 18,
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
                {" "}
                {l.label}{" "}
              </Link>
            );
          })}{" "}
        </div>
      </nav>

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
