"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./bugtracker.module.css";
import Link from "next/link";


type Status   = "Open" | "In Progress" | "Resolved" | "Closed";
type Severity = "Critical" | "High" | "Medium" | "Low";
type Category = "Client" | "Server" | "Combat" | "UI" | "Audio" | "Network";

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



const STATUS_OPTIONS:   Status[]   = ["Open", "In Progress", "Resolved", "Closed"];
const SEVERITY_OPTIONS: Severity[] = ["Critical", "High", "Medium", "Low"];
const CATEGORY_OPTIONS: Category[] = ["Client", "Server", "Combat", "UI", "Audio", "Network"];

// Map values to CSS module class names
const STATUS_CLASS: Record<Status, string> = {
  "Open":        styles.statusOpen,
  "In Progress": styles.statusProgress,
  "Resolved":    styles.statusResolved,
  "Closed":      styles.statusClosed,
};

const SEVERITY_CLASS: Record<Severity, string> = {
  "Critical": styles.sevCritical,
  "High":     styles.sevHigh,
  "Medium":   styles.sevMedium,
  "Low":      styles.sevLow,
};


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


export default function BugTracker() {
  const [bugs, setBugs]       = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState<Status | "">("");
  const [severityF, setSevF]  = useState<Severity | "">("");
  const [categoryF, setCatF]  = useState<Category | "">("");
  const [sortKey, setSortKey] = useState<"createdAt" | "severity" | "comments">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/bugs")
      .then(r => { if (!r.ok) throw new Error("Failed to load bugs"); return r.json(); })
      .then((rows: Record<string, unknown>[]) => {
        setBugs(rows.map(r => ({
          id:        r.id        as string,
          title:     r.title     as string,
          status:    r.status    as Status,
          severity:  r.severity  as Severity,
          category:  r.category  as Category,
          reporter:  r.reporter  as string,
          createdAt: (r.created_at as string).slice(0, 10),
          comments:  r.comment_count as number,
        })));
      })
      .catch(err => setFetchErr(err.message))
      .finally(() => setLoading(false));
  }, []);

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
  }, [bugs, search, statusF, severityF, categoryF, sortKey, sortDir]);

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
          <Link href="/bugtracker/new" className={styles.reportBtn}>
            <BugPlusIcon />
            Report Bug
          </Link>
        </div>
      </header>

      <main className={styles.main}>

        {/* --- Stats row --- */}
        <div className={styles.statsRow}>
          <StatCard label="Open"        value={openCount}     type="open" />
          <StatCard label="In Progress" value={progressCount} type="progress" />
          <StatCard label="Resolved"    value={resolvedCount} type="resolved" />
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

          {/* Body */}
          {loading ? (
            <div className={styles.issueEmpty}>
              <p style={{ color: "var(--text-muted)" }}>Loading…</p>
            </div>
          ) : fetchErr ? (
            <div className={styles.issueEmpty}>
              <span className={styles.issueEmptyIcon}>🔍</span>
              <p>No results</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                Try adjusting your search filters.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.issueEmpty}>
              <span className={styles.issueEmptyIcon}>🔍</span>
              <p>No results</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                Try adjusting your search filters.
              </p>
              {(search || statusF || severityF || categoryF) && (
                <button className={styles.emptyReset} onClick={() => {
                  setSearch(""); setStatusF(""); setSevF(""); setCatF("");
                }}>
                  Clear all filters
                </button>
              )}
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
