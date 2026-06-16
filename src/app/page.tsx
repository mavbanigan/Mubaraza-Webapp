"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./home.module.css";

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M7.5 1.5v8M4.5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SignInArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 5l4 3-4 3M14 8H6" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SafariIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="0.9" fill="currentColor" />
      <path d="M8 8 L10.5 3.5 L8 6.2 Z" fill="currentColor" opacity="0.9" />
      <path d="M8 8 L5.5 12.5 L8 9.8 Z" fill="currentColor" opacity="0.4" />
      <line x1="8" y1="1.4" x2="8" y2="2.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="13.4" x2="8" y2="14.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1.4" y1="8" x2="2.6" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13.4" y1="8" x2="14.6" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LeaderboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="1" y="9" width="3" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6" y="5" width="3" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="1" width="3" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BugIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <ellipse cx="7.5" cy="9.5" rx="3.5" ry="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 5.5V3.5M5 6.5L3 5M10 6.5l2-1.5" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 9.5H2M13 9.5h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SignUpArrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M9 7.5H2M6 5l3.5 2.5L6 10" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 2.5H13a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H4" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Logos ──────────────────────────────────────────────────────────────── */

function MBLogoSmall({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-label="Mubaraza logo">
      <circle cx="17" cy="17" r="15.5" stroke="#1d8fe8" strokeWidth="2.5" fill="#1e2130" />
      <circle cx="17" cy="17" r="10" stroke="#1d8fe8" strokeWidth="2"
        fill="none" strokeDasharray="12 6" strokeDashoffset="3" />
      <circle cx="17" cy="17" r="5" fill="#1d8fe8" />
      <text x="17" y="20.5" textAnchor="middle" dominantBaseline="middle"
        fill="#0f1117" fontSize="7" fontWeight="900" fontFamily="'Inter', sans-serif"
        letterSpacing="0.5">MB</text>
    </svg>
  );
}

function HeroLogo() {
  return (
    <div className={styles.heroLogoWrap} aria-hidden="true">
      <svg className={styles.heroLogoSvg} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="heroGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="120" cy="120" r="115" stroke="#1d8fe8" strokeWidth="1.5" fill="none" opacity="0.25" />
        <circle cx="120" cy="120" r="108" stroke="#1d8fe8" strokeWidth="6"
          fill="rgba(29,143,232,0.07)" filter="url(#heroGlow)"
          strokeDasharray="160 80" strokeDashoffset="0" />
        <circle cx="120" cy="120" r="108" stroke="#1d8fe8" strokeWidth="6"
          fill="none" strokeDasharray="80 160" strokeDashoffset="80" opacity="0.5" />
        <circle cx="120" cy="120" r="80" stroke="#1d8fe8" strokeWidth="3.5"
          fill="none" strokeDasharray="50 30" strokeDashoffset="10" filter="url(#innerGlow)" />
        <circle cx="120" cy="120" r="80" stroke="#1d8fe8" strokeWidth="3.5"
          fill="none" strokeDasharray="30 50" strokeDashoffset="85" opacity="0.4" />
        <circle cx="120" cy="120" r="52" fill="#1d8fe8" filter="url(#innerGlow)" />
        <circle cx="120" cy="120" r="44" fill="#1e2130" />
        <text x="120" y="126" textAnchor="middle" dominantBaseline="middle"
          fill="#1d8fe8" fontSize="36" fontWeight="900"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif" letterSpacing="4"
          filter="url(#innerGlow)">MB</text>
      </svg>
    </div>
  );
}

/* ─── Maze Background ────────────────────────────────────────────────────── */

function MazeBackground() {
  const CELL = 80;
  const WALL_H = 30;
  const COLS = 44;
  const ROWS = 28;

  const isoX = (c: number, r: number) => (c - r) * (CELL / 2);
  const isoY = (c: number, r: number) => (c + r) * (CELL / 4);
  const hasRight  = (r: number, c: number) => ((r * 37 + c * 17) % 7) !== 0 && ((r * 37 + c * 17) % 7) !== 3;
  const hasBottom = (r: number, c: number) => ((r * 37 + c * 17) % 7) !== 1 && ((r * 37 + c * 17) % 7) !== 4;

  const vw = COLS * CELL * 0.2;
  const vh = ROWS * CELL * 0.32;
  const ox = vw / 2;
  const oy = 20;

  const wallTop    = "rgba(180,180,190,0.13)";
  const wallLeft   = "rgba(100,100,110,0.08)";
  const wallRight  = "rgba(140,140,155,0.11)";
  const wallStroke = "rgba(160,160,175,0.18)";

  const wallPaths: JSX.Element[] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (hasRight(r, c) && c < COLS - 1) {
        const ax = ox + isoX(c + 1, r);
        const ay = oy + isoY(c + 1, r);
        const bx = ox + isoX(c + 1, r + 1);
        const by = oy + isoY(c + 1, r + 1);
        wallPaths.push(
          <g key={`rv-${r}-${c}`}>
            <polygon points={`${ax},${ay} ${bx},${by} ${bx},${by + WALL_H} ${ax},${ay + WALL_H}`}
              fill={wallRight} stroke={wallStroke} strokeWidth="0.6" />
            <polygon points={`${ax},${ay} ${ax},${ay + WALL_H} ${ax - 1},${ay + WALL_H} ${ax - 1},${ay}`}
              fill={wallLeft} stroke="none" />
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={wallStroke} strokeWidth="0.8" />
          </g>
        );
      }
      if (hasBottom(r, c) && r < ROWS - 1) {
        const ax = ox + isoX(c, r + 1);
        const ay = oy + isoY(c, r + 1);
        const bx = ox + isoX(c + 1, r + 1);
        const by = oy + isoY(c + 1, r + 1);
        wallPaths.push(
          <g key={`bv-${r}-${c}`}>
            <polygon points={`${ax},${ay} ${bx},${by} ${bx},${by + WALL_H} ${ax},${ay + WALL_H}`}
              fill={wallLeft} stroke={wallStroke} strokeWidth="0.6" />
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={wallStroke} strokeWidth="0.8" />
          </g>
        );
      }
    }
  }

  const floorLines: JSX.Element[] = [];
  for (let r = 0; r <= ROWS; r++) {
    floorLines.push(
      <line key={`fh${r}`}
        x1={ox + isoX(0, r)} y1={oy + isoY(0, r)}
        x2={ox + isoX(COLS, r)} y2={oy + isoY(COLS, r)}
        stroke="rgba(160,160,170,0.07)" strokeWidth="0.6" />
    );
  }
  for (let c = 0; c <= COLS; c++) {
    floorLines.push(
      <line key={`fv${c}`}
        x1={ox + isoX(c, 0)} y1={oy + isoY(c, 0)}
        x2={ox + isoX(c, ROWS)} y2={oy + isoY(c, ROWS)}
        stroke="rgba(160,160,170,0.07)" strokeWidth="0.6" />
    );
  }

  return (
    <svg className={styles.mazeBg} viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {floorLines}
      {wallPaths}
    </svg>
  );
}

/* ─── Dropdown ───────────────────────────────────────────────────────────── */

interface DropdownItem { label: string; href?: string }

function NavDropdown({ label, items, icon }: {
  label: string;
  items: DropdownItem[];
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.navDropdown}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className={styles.navLink} aria-expanded={open} aria-haspopup="true">
        {icon && <span className={styles.navLinkIcon}>{icon}</span>}
        {label}
        <span className={styles.navChevron}><ChevronDown /></span>
      </button>
      {open && (
        <div className={styles.dropdownMenu} role="menu">
          {items.map((item) => (
            <Link key={item.label} href={item.href ?? "#"}
              className={styles.dropdownItem} role="menuitem">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function Home() {
  console.log(styles)
  return (
    <div>
      {/* ── Navbar ── */}
      <nav className={styles.navbar}>
        <div className={styles.navbarInner}>
          <Link href="/" className={styles.brand}>
            <MBLogoSmall size={34} />
            <span className={styles.brandName}>mubaraza</span>
          </Link>

          <div className={styles.navLinks}>
            <NavDropdown
              label="Discover content"
              icon={<SafariIcon />}
              items={[{ label: "Weapon Packs" }, { label: "Armor Sets" }]}
            />
            <NavDropdown
              label="Leaderboard"
              icon={<LeaderboardIcon />}
              items={[{ label: "Global Rankings" }]}
            />
            <Link href="/download" className={styles.navLink}>
              <span className={styles.navLinkIcon}><DownloadIcon /></span>
              Download Client
            </Link>
          </div>

          <div className={styles.navActions}>
            <Link href="/signin" className={styles.signinBtn}>
              <SignInArrow />
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className={styles.hero}>
        <MazeBackground />
        <div className={styles.heroVignette} aria-hidden="true" />

        <div className={styles.heroContent}>
          <HeroLogo />

          <h1 className={styles.heroHeadline}>
            The place where minecraft meets
            <br />
            <span className={styles.heroAccent}>Chivalry&nbsp;2.</span>
          </h1>

          <p className={styles.heroDescription}>
            Idk what this mod does but description here.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/bugtracker" className={`${styles.ctaBtn} ${styles.ctaBtnSecondary}`}>
              <BugIcon />
              Bug Tracker
            </Link>
            <Link href="/signup" className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`}>
              <SignUpArrow />
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
