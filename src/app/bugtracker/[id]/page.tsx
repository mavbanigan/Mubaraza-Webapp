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

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 5l4.5 4.5L11.5 5" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --- Helpers --- */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

/* --- Accordion section --- */
function Section({
  label, date, defaultOpen = true, children,
}: {
  label: string;
  date?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.section}>
      <button className={styles.sectionToggle} onClick={() => setOpen(o => !o)}>
        <span className={styles.sectionToggleLeft}>
          <span className={styles.sectionLabel}>{label}</span>
          {date && <span className={styles.sectionDate}>{date}</span>}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>
          <ChevronIcon />
        </span>
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
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

        <div className={styles.topStrip}>
          <div className={styles.topLeft}>
            <div className={styles.bugMeta}>
              <span className={styles.bugId}>{bug.id}</span>
              <span className={`${styles.badge} ${STATUS_CLASS[bug.status]}`}>{bug.status}</span>
              <span className={`${styles.badge} ${SEVERITY_CLASS[bug.severity]}`}>{bug.severity}</span>
              <span className={styles.catBadge}>{bug.category}</span>
            </div>
            <h2 className={styles.bugTitle}>{bug.title}</h2>
          </div>
          <div className={styles.dates}>
            <span className={styles.dateItem}>Opened <strong>{formatDate(bug.created_at)}</strong></span>
            <span className={styles.dateItem}>Updated <strong>{formatDate(bug.updated_at)}</strong></span>
          </div>
        </div>

        <div className={styles.sections}>

          <Section label="Details" defaultOpen={true}>
            <div className={styles.detailsGrid}>
              <div className={styles.detailCell}>
                <span className={styles.detailLabel}>Status</span>
                <span className={`${styles.badge} ${STATUS_CLASS[bug.status]}`}
                  style={{ alignSelf: "flex-start" }}>{bug.status}</span>
              </div>
              <div className={styles.detailCell}>
                <span className={styles.detailLabel}>Severity</span>
                <span className={`${styles.badge} ${SEVERITY_CLASS[bug.severity]}`}
                  style={{ alignSelf: "flex-start" }}>{bug.severity}</span>
              </div>
              <div className={styles.detailCell}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{bug.category}</span>
              </div>
              <div className={styles.detailCell}>
                <span className={styles.detailLabel}>Version</span>
                <span className={styles.detailValue}>{bug.version_affected}</span>
              </div>
              <div className={styles.detailCell}>
                <span className={styles.detailLabel}>Reporter</span>
                <span className={styles.detailValue}>{bug.reporter}</span>
              </div>
              {bug.resolution && (
                <div className={styles.detailCell}>
                  <span className={styles.detailLabel}>Resolution</span>
                  <span className={styles.detailValue}>{bug.resolution}</span>
                </div>
              )}
            </div>
          </Section>

          <Section label="Description" date={`Reported by ${bug.reporter}`} defaultOpen={true}>
            <p className={styles.description}>{bug.description}</p>
          </Section>

          <Section label="Attachments" defaultOpen={false}>
            <p className={styles.attachEmpty}>No attachments.</p>
          </Section>

        </div>
      </main>
    </div>
  );
}
