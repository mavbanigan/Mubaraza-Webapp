"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./id.module.css";

/* --- Types --- */
type Status   = "Open" | "In Progress" | "Resolved" | "Closed";
type Severity = "Critical" | "High" | "Medium" | "Low";

interface Bug {
  id:               string;
  title:            string;
  status:           Status;
  severity:         Severity;
  category:         string;
  reporter:         string;
  version_affected: string;
  description:      string;
  resolution:       string | null;
  comment_count:    number;
  created_at:       string;
  updated_at:       string;
}

/* --- Badge maps --- */
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

/* --- Icons --- */
function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BugIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <ellipse cx="10" cy="12" rx="5" ry="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6.5V4M7 8L4.5 6M13 8l2.5-2" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.5 12.5H2.5M17.5 12.5h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 5h11M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor"
        strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M1 1h5l6 6-5 5-6-6V1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="3.5" cy="3.5" r="1" fill="currentColor" />
    </svg>
  );
}

/* --- Helpers --- */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

/* --- Page --- */
export default function BugDetailPage() {
  const params = useParams();
  const rawId  = params.id as string;

  const [bug, setBug]           = useState<Bug | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/bugs/${encodeURIComponent(rawId)}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(data => { if (data) setBug(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [rawId]);

  const header = (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/bugtracker" className={styles.back}>
          <ArrowLeftIcon />
          <span>Back to Bug Tracker</span>
        </Link>
        <div className={styles.headerBrand}>
          <BugIcon />
          <h1 className={styles.headerTitle}>Bug Tracker</h1>
        </div>
        <div className={styles.headerSpacer} />
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className={styles.page}>
        {header}
        <main className={styles.main}>
          <div className={styles.center}>Loading…</div>
        </main>
      </div>
    );
  }

  if (notFound || !bug) {
    return (
      <div className={styles.page}>
        {header}
        <main className={styles.main}>
          <div className={styles.center}>
            <p>Bug not found.</p>
            <Link href="/bugtracker" className={styles.back}>← Back to Bug Tracker</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {header}
      <main className={styles.main}>

        {/* --- Bug header card --- */}
        <div className={styles.bugHeader}>
          <div className={styles.bugMeta}>
            <span className={styles.bugId}>{bug.id}</span>
            <span className={`${styles.badge} ${STATUS_CLASS[bug.status]}`}>{bug.status}</span>
            <span className={`${styles.badge} ${SEVERITY_CLASS[bug.severity]}`}>{bug.severity}</span>
            <span className={styles.catBadge}>{bug.category}</span>
          </div>

          <h2 className={styles.bugTitle}>{bug.title}</h2>

          <div className={styles.bugInfoRow}>
            <span className={styles.bugInfoItem}>
              <UserIcon />
              <span>Reported by <strong>{bug.reporter}</strong></span>
            </span>
            <span className={styles.bugInfoItem}>
              <CalendarIcon />
              <span>Opened <strong>{formatDate(bug.created_at)}</strong></span>
            </span>
            <span className={styles.bugInfoItem}>
              <TagIcon />
              <span>Version <strong>{bug.version_affected}</strong></span>
            </span>
          </div>
        </div>

        {/* --- Content grid --- */}
        <div className={styles.grid}>

          {/* Description */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Description</p>
            <p className={styles.description}>{bug.description}</p>

            {bug.resolution && (
              <div className={styles.resolution}>
                <p className={styles.resolutionLabel}>Resolution</p>
                <p className={styles.resolutionText}>{bug.resolution}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Details</p>
            <div className={styles.detailList}>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={`${styles.badge} ${STATUS_CLASS[bug.status]}`}>{bug.status}</span>
              </div>

              <div className={styles.detailDivider} />

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Severity</span>
                <span className={`${styles.badge} ${SEVERITY_CLASS[bug.severity]}`}>{bug.severity}</span>
              </div>

              <div className={styles.detailDivider} />

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{bug.category}</span>
              </div>

              <div className={styles.detailDivider} />

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Version</span>
                <span className={styles.detailValue}>{bug.version_affected}</span>
              </div>

              <div className={styles.detailDivider} />

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Reporter</span>
                <span className={styles.detailValue}>{bug.reporter}</span>
              </div>

              <div className={styles.detailDivider} />

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Opened</span>
                <span className={styles.detailValue}>{formatDate(bug.created_at)}</span>
              </div>

              <div className={styles.detailDivider} />

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Last updated</span>
                <span className={styles.detailValue}>{formatDate(bug.updated_at)}</span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
