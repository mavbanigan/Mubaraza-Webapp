"use client";

import { useState, useMemo } from "react";
import styles from "./bugtracker.module.css";
import Link from "next/link";

/* --- Types --- */

type Status   = "Open" | "In Progress" | "Resolved" | "Closed" | "Won't Fix";
type Severity = "Critical" | "High" | "Medium" | "Low";
type Category = "Client" | "Server" | "Combat" | "UI" | "World Gen" | "Audio" | "Network";

interface Bug {
  id:        string;
  title:     string;
  status:    Status;
  severity:  Severity;
  category:  Category;
  reporter:  string;
  createdAt: string;
  comments:  number;
}

/* --- Fake Data --- */

const bugs: Bug[] = [
  { id: "MUB-101", title: "Client crashes after joining arena",           status: "Open",        severity: "Critical", category: "Client",    reporter: "Steve",         createdAt: "2026-06-16", comments: 4  },
  { id: "MUB-102", title: "Sword hitbox misaligned in first-person view", status: "In Progress", severity: "High",     category: "Combat",    reporter: "Alex",          createdAt: "2026-06-15", comments: 7  },
  { id: "MUB-103", title: "Leaderboard score not updating after match",   status: "Open",        severity: "High",     category: "Server",    reporter: "Herobrine",     createdAt: "2026-06-14", comments: 2  },
  { id: "MUB-104", title: "Shield block animation plays twice on cancel", status: "Open",        severity: "Medium",   category: "Combat",    reporter: "Notch",         createdAt: "2026-06-13", comments: 1  },
  { id: "MUB-105", title: "HUD health bar flickers when below 3 hearts",  status: "Resolved",    severity: "Medium",   category: "UI",        reporter: "Dinnerbone",    createdAt: "2026-06-12", comments: 5  },
  { id: "MUB-106", title: "Spawn chunks not loading on arena join",       status: "Open",        severity: "High",     category: "World Gen", reporter: "jeb_",          createdAt: "2026-06-11", comments: 3  },
  { id: "MUB-107", title: "Crossbow reload sound plays out of sync",      status: "Resolved",    severity: "Low",      category: "Audio",     reporter: "Grumm",         createdAt: "2026-06-10", comments: 0  },
  { id: "MUB-108", title: "Players can clip through castle gate geometry",status: "In Progress", severity: "Critical", category: "World Gen", reporter: "Marc_IRL",      createdAt: "2026-06-09", comments: 9  },
  { id: "MUB-109", title: "Death screen respawn button unresponsive",     status: "Open",        severity: "High",     category: "UI",        reporter: "Steve",         createdAt: "2026-06-08", comments: 6  },
  { id: "MUB-110", title: "Network timeout not handled gracefully",       status: "Won't Fix",   severity: "Low",      category: "Network",   reporter: "Alex",          createdAt: "2026-06-07", comments: 2  },
  { id: "MUB-111", title: "Axe swing damage inconsistent vs shield users",status: "Open",        severity: "High",     category: "Combat",    reporter: "Technoblade",   createdAt: "2026-06-06", comments: 11 },
  { id: "MUB-112", title: "Settings menu resets on client restart",       status: "In Progress", severity: "Medium",   category: "Client",    reporter: "Dream",         createdAt: "2026-06-05", comments: 3  },
  { id: "MUB-113", title: "Fog distance renders incorrectly on AMD GPUs", status: "Open",        severity: "Medium",   category: "Client",    reporter: "GeorgeNotFound", createdAt: "2026-06-04", comments: 8 },
  { id: "MUB-114", title: "Chat messages delay by ~2s during peak load",  status: "Open",        severity: "Medium",   category: "Network",   reporter: "Sapnap",        createdAt: "2026-06-03", comments: 0  },
  { id: "MUB-115", title: "Footstep audio cuts when sprinting on stone",  status: "Closed",      severity: "Low",      category: "Audio",     reporter: "Punz",          createdAt: "2026-06-02", comments: 1  },
  { id: "MUB-116", title: "Trebuchet projectile despawns on chunk border",status: "Open",        severity: "High",     category: "World Gen", reporter: "BadBoyHalo",    createdAt: "2026-06-01", comments: 5  },
  { id: "MUB-117", title: "Potion effects don't persist across respawns", status: "Resolved",    severity: "Medium",   category: "Combat",    reporter: "Skeppy",        createdAt: "2026-05-31", comments: 4  },
  { id: "MUB-118", title: "Spectator camera clips into walls in keep",    status: "Closed",      severity: "Low",      category: "Client",    reporter: "Antfrost",      createdAt: "2026-05-30", comments: 2  },
  { id: "MUB-119", title: "Inventory opens mid-combat despite lock",      status: "Open",        severity: "Critical", category: "UI",        reporter: "Ponk",          createdAt: "2026-05-29", comments: 7  },
  { id: "MUB-120", title: "Server TPS drops below 15 on wave 5+",        status: "In Progress", severity: "Critical", category: "Server",    reporter: "Awesamdude",    createdAt: "2026-05-28", comments: 14 },
];

/* --- Config --- */

const STATUS_OPTIONS:   Status[]   = ["Open", "In Progress", "Resolved", "Closed", "Won't Fix"];
const SEVERITY_OPTIONS: Severity[] = ["Critical", "High", "Medium", "Low"];
const CATEGORY_OPTIONS: Category[] = ["Client", "Server", "Combat", "UI", "World Gen", "Audio", "Network"];

// Map values to CSS module class names
const STATUS_CLASS: Record<Status, string> = {
  "Open":        styles.statusOpen,
  "In Progress": styles.statusProgress,
  "Resolved":    styles.statusResolved,
  "Closed":      styles.statusClosed,
  "Won't Fix":   styles.statusWontfix,
};

const SEVERITY_CLASS: Record<Severity, string> = {
  "Critical": styles.sevCritical,
  "High":     styles.sevHigh,
  "Medium":   styles.sevMedium,
  "Low":      styles.sevLow,
};

/* --- Icons --- */

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BugPlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <ellipse cx="8" cy="10" rx="4" ry="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5.5V3.5M5.5 6.5L3.5 5M10.5 6.5l2-1.5" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.5 10H1.5M14.5 10h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 2v4M9 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M11.5 1.5H1.5a1 1 0 00-1 1v6a1 1 0 001 1h2l2 2.5 2-2.5h4a1 1 0 001-1v-6a1 1 0 00-1-1z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ dir = "down" }: { dir?: "down" | "up" }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"
      style={{ transform: dir === "up" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
      <path d="M2.5 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* --- Filter dropdown --- */

function FilterSelect<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T | "";
  options: T[];
  onChange: (v: T | "") => void;
}) {
  const [open, setOpen] = useState(false);
  const active = value !== "";

  return (
    <div className={styles.filterSelect} onMouseLeave={() => setOpen(false)}>
      <button
        className={`${styles.filterBtn} ${active ? styles.filterBtnActive : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{active ? value : label}</span>
        {active
          ? <span className={styles.filterClear} onClick={e => { e.stopPropagation(); onChange(""); }}><XIcon /></span>
          : <ChevronIcon dir={open ? "up" : "down"} />
        }
      </button>
      {open && (
        <div className={styles.filterMenu} role="listbox">
          {options.map(opt => (
            <button
              key={opt}
              className={`${styles.filterOption} ${value === opt ? styles.filterOptionSelected : ""}`}
              role="option"
              aria-selected={value === opt}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Stat card --- */

// Map stat type to its CSS module class
const STAT_CLASS = {
  open:     styles.statOpen,
  progress: styles.statProgress,
  resolved: styles.statResolved,
  critical: styles.statCritical,
} as const;

type StatType = keyof typeof STAT_CLASS;

function StatCard({ label, value, type }: { label: string; value: number; type?: StatType }) {
  return (
    <div className={`${styles.statCard} ${type ? STAT_CLASS[type] : ""}`}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

/* --- Main Page --- */

export default function BugTracker() {
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState<Status | "">("");
  const [severityF, setSevF]  = useState<Severity | "">("");
  const [categoryF, setCatF]  = useState<Category | "">("");
  const [sortKey, setSortKey] = useState<"createdAt" | "severity" | "comments">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const SEV_ORDER: Record<Severity, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };

  const filtered = useMemo(() => {
    let list = bugs.filter(b => {
      if (statusF   && b.status   !== statusF)   return false;
      if (severityF && b.severity !== severityF) return false;
      if (categoryF && b.category !== categoryF) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!b.title.toLowerCase().includes(q) &&
            !b.id.toLowerCase().includes(q) &&
            !b.reporter.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "createdAt") cmp = a.createdAt.localeCompare(b.createdAt);
      if (sortKey === "severity")  cmp = SEV_ORDER[a.severity] - SEV_ORDER[b.severity];
      if (sortKey === "comments")  cmp = a.comments - b.comments;
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [search, statusF, severityF, categoryF, sortKey, sortDir]);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const openCount     = bugs.filter(b => b.status === "Open").length;
  const progressCount = bugs.filter(b => b.status === "In Progress").length;
  const resolvedCount = bugs.filter(b => b.status === "Resolved" || b.status === "Closed").length;
  const criticalCount = bugs.filter(b => b.severity === "Critical").length;

  return (
    <div className={styles.page}>

      {/* --- Top bar --- */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.back}>
            <ArrowLeftIcon />
            <span>Back to Mubaraza</span>
          </Link>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🐛</span>
            <h1 className={styles.title}>Bug Tracker</h1>
          </div>
          <button className={styles.reportBtn}>
            <BugPlusIcon />
            Report Bug
          </button>
        </div>
      </header>

      <main className={styles.main}>

        {/* --- Stats row --- */}
        <div className={styles.statsRow}>
          <StatCard label="Open"        value={openCount}     type="open" />
          <StatCard label="In Progress" value={progressCount} type="progress" />
          <StatCard label="Resolved"    value={resolvedCount} type="resolved" />
          <StatCard label="Critical"    value={criticalCount} type="critical" />
          <StatCard label="Total"       value={bugs.length} />
        </div>

        {/* --- Search + filters --- */}
        <div className={styles.controlsRow}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}><SearchIcon /></span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by title, ID, or reporter..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch("")} aria-label="Clear search">
                <XIcon />
              </button>
            )}
          </div>

          <div className={styles.filtersWrap}>
            <FilterSelect label="Status"   value={statusF}   options={STATUS_OPTIONS}   onChange={setStatusF} />
            <FilterSelect label="Severity" value={severityF} options={SEVERITY_OPTIONS} onChange={setSevF} />
            <FilterSelect label="Category" value={categoryF} options={CATEGORY_OPTIONS} onChange={setCatF} />
          </div>
        </div>

        {/* --- Results meta + sort --- */}
        <div className={styles.resultsMeta}>
          <span className={styles.resultsCount}>
            {filtered.length === bugs.length
              ? `${bugs.length} issues`
              : `${filtered.length} of ${bugs.length} issues`}
          </span>
          <div className={styles.sortRow}>
            <span className={styles.sortLabel}>Sort by:</span>
            {(["createdAt", "severity", "comments"] as const).map(k => (
              <button
                key={k}
                className={`${styles.sortBtn} ${sortKey === k ? styles.sortBtnActive : ""}`}
                onClick={() => toggleSort(k)}
              >
                {k === "createdAt" ? "Date" : k === "comments" ? "Comments" : "Severity"}
                {sortKey === k && <ChevronIcon dir={sortDir === "desc" ? "down" : "up"} />}
              </button>
            ))}
          </div>
        </div>

        {/* --- Issue table --- */}
        <div className={styles.issueTable}>

          {/* Header */}
          <div className={`${styles.issueRow} ${styles.issueRowHeader}`}>
            <span>ID</span>
            <span>Title</span>
            <span>Status</span>
            <span>Severity</span>
            <span>Category</span>
            <span className={styles.colReporter}>Reporter</span>
            <span className={styles.colDate}>Date</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className={styles.issueEmpty}>
              <span className={styles.issueEmptyIcon}>🔍</span>
              <p>No issues match your filters.</p>
              <button className={styles.emptyReset} onClick={() => {
                setSearch(""); setStatusF(""); setSevF(""); setCatF("");
              }}>
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map(bug => (
              <div key={bug.id} className={`${styles.issueRow} ${styles.issueRowData}`}>
                <span className={styles.bugId}>{bug.id}</span>
                <span>
                  <Link href={`/bugtracker/${bug.id.toLowerCase()}`} className={styles.bugTitleLink}>
                    {bug.title}
                  </Link>
                </span>
                <span>
                  <span className={`${styles.badge} ${STATUS_CLASS[bug.status]}`}>
                    {bug.status}
                  </span>
                </span>
                <span>
                  <span className={`${styles.badge} ${SEVERITY_CLASS[bug.severity]}`}>
                    {bug.severity}
                  </span>
                </span>
                <span>
                  <span className={styles.catBadge}>{bug.category}</span>
                </span>
                <span className={styles.colReporter}>{bug.reporter}</span>
                <span className={styles.colDate}>{bug.createdAt}</span>
                <span className={styles.commentCount}>
                  <CommentIcon />
                  {bug.comments}
                </span>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
