"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./new-bug.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";


type Severity = "Critical" | "High" | "Medium" | "Low";
type Category = "Client" | "Server" | "Combat" | "UI" | "Audio" | "Network";
type Status   = "Open" | "In Progress" | "Resolved" | "Closed";

interface FormData {
  title:       string;
  category:    Category | "";
  version:     string;
  severity:    Severity | "";
  description: string;
}

interface FormErrors {
  title?:       string;
  category?:    string;
  version?:     string;
  severity?:    string;
  description?: string;
}

interface AttachedFile {
  file: File;
  id:   string;
}


const CATEGORIES: Category[] = ["Client", "Server", "Combat", "UI", "Audio", "Network"];
const STATUSES:   Status[]   = ["Open", "In Progress", "Resolved", "Closed"];
const VERSIONS    = ["1.0.0", "1.0.1", "1.1.0", "1.2.0", "1.2.1", "1.3.0-beta"];

const SEVERITY_OPTIONS: { value: Severity; dotClass: string; label: string }[] = [
  { value: "Critical", dotClass: styles.dotCritical, label: "Critical" },
  { value: "High",     dotClass: styles.dotHigh,     label: "High"     },
  { value: "Medium",   dotClass: styles.dotMedium,   label: "Medium"   },
  { value: "Low",      dotClass: styles.dotLow,      label: "Low"      },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BugPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <ellipse cx="9" cy="11" rx="4.5" ry="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 6V4M6 7.5L4 6M12 7.5l2-1.5" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.5 11H2.5M15.5 11h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 2v4M11 4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 18V8M10 12l4-4 4 4" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 22h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 1h5.5L11 3.5V13H3V1z" stroke="currentColor" strokeWidth="1.3"
        strokeLinejoin="round" />
      <path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M5 13l6 6L21 7" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}


export default function NewBugPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    title:       "",
    category:    "",
    version:     "",
    severity:    "",
    description: "",
  });

  const [errors, setErrors]       = useState<FormErrors>({});
  const [files, setFiles]         = useState<AttachedFile[]>([]);
  const [dragOver, setDragOver]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState<string | null>(null);  // holds new bug ID
  const [toast, setToast]           = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key as keyof FormErrors]) {
      setErrors(e => ({ ...e, [key]: undefined }));
    }
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.title.trim())       e.title       = "Title is required.";
    if (form.title.trim().length < 10) e.title  = "Title must be at least 10 characters.";
    if (!form.category)           e.category    = "Select a category.";
    if (!form.version)            e.version     = "Select a version.";
    if (!form.severity)           e.severity    = "Select a severity level.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (form.description.trim().length < 20) e.description = "Please describe the issue in more detail (at least 20 characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const MAX = 10 * 1024 * 1024; // MAX of 10 MB
    const accepted: AttachedFile[] = [];
    for (const f of arr) {
      if (f.size > MAX) { showToast(`${f.name} is too large (max 10 MB).`); continue; }
      if (files.length + accepted.length >= 5) { showToast("Max 5 attachments."); break; }
      accepted.push({ file: f, id: `${Date.now()}-${Math.random()}` });
    }
    setFiles(prev => [...prev, ...accepted]);
  }, [files]);

  function removeFile(id: string) {
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      files.forEach(f => body.append("attachments", f.file));

      const res = await fetch("/api/bugs", { method: "POST", body });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit bug report.");
      }
      const data = await res.json();
      setSubmitted(data.id);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}><CheckIcon /></div>
            <h2 className={styles.successTitle}>Bug report submitted</h2>
            <p className={styles.successId}>
              Your report has been filed as <strong>{submitted}</strong> and is now visible in the tracker.
            </p>
            <div className={styles.successActions}>
              <Link href="/bugtracker" className={styles.successBtnPrimary}>
                View bug tracker
              </Link>
              <button className={styles.successBtnSecondary}
                onClick={() => {
                  setSubmitted(null);
                  setForm({ title: "", category: "", version: "", status: "Open", severity: "", resolution: "", description: "" });
                  setFiles([]);
                  setErrors({});
                }}>
                Report another
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeading}>
          <h1 className={styles.pageTitle}>Report a bug</h1>
          <p className={styles.pageSubtitle}>
            Describe the issue clearly so the team can reproduce and fix it. Fields marked <span style={{ color: "#e84a4a" }}>*</span> are required.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="title"
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              maxLength={200}
            />
            {errors.title
              ? <span className={styles.errorMsg}>{errors.title}</span>
              : <span className={styles.hint}>{form.title.length}/200 characters</span>
            }
          </div>

          {/* Category + Version */}
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">
                Category <span className={styles.required}>*</span>
              </label>
              <select
                id="category"
                className={`${styles.select} ${errors.category ? styles.inputError : ""}`}
                value={form.category}
                onChange={e => set("category", e.target.value as Category)}
              >
                <option value="" disabled>Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className={styles.errorMsg}>{errors.category}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="version">
                Version affected <span className={styles.required}>*</span>
              </label>
              <select
                id="version"
                className={`${styles.select} ${errors.version ? styles.inputError : ""}`}
                value={form.version}
                onChange={e => set("version", e.target.value)}
              >
                <option value="" disabled>Select version...</option>
                {VERSIONS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.version && <span className={styles.errorMsg}>{errors.version}</span>}
            </div>
          </div>


          {/* Severity */}
          <div className={styles.field}>
            <label className={styles.label}>
              Severity <span className={styles.required}>*</span>
            </label>
            <div className={styles.severityGrid}>
              {SEVERITY_OPTIONS.map(opt => (
                <label key={opt.value} className={styles.severityOption}>
                  <input
                    type="radio"
                    name="severity"
                    value={opt.value}
                    checked={form.severity === opt.value}
                    onChange={() => { set("severity", opt.value); }}
                  />
                  <span className={styles.severityLabel}>
                    <span className={`${styles.severityDot} ${opt.dotClass}`} />
                    <span className={styles.severityText}>{opt.label}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.severity && <span className={styles.errorMsg}>{errors.severity}</span>}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
              placeholder={`Type your description here. Include steps to reproduce.`}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={7}
            />
            {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
          </div>

          {/* Attachments */}
          <div className={styles.field}>
            <label className={styles.label}>Attachments</label>
            <div
              className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
            >
              <span className={styles.dropzoneIcon}><UploadIcon /></span>
              <p className={styles.dropzoneText}>
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p className={styles.dropzoneSub}>PNG, JPG, GIF, MP4, LOG, ZIP -- max 10 MB each, up to 5 files</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/mp4,.log,.zip,.txt"
                style={{ display: "none" }}
                onChange={e => { if (e.target.files) addFiles(e.target.files); }}
              />
            </div>

            {files.length > 0 && (
              <div className={styles.fileList}>
                {files.map(f => (
                  <div key={f.id} className={styles.fileItem}>
                    <span className={styles.fileIcon}><FileIcon /></span>
                    <span className={styles.fileName}>{f.file.name}</span>
                    <span className={styles.fileSize}>{formatBytes(f.file.size)}</span>
                    <button type="button" className={styles.fileRemove}
                      onClick={() => removeFile(f.id)} aria-label="Remove file">
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.divider} />

          {/* Submit */}
          <div className={styles.submitRow}>
            <Link href="/bugtracker" className={styles.cancelBtn}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting
                ? <><span className={styles.spinner} /> Submitting...</>
                : <><BugPlusIcon /> Submit report</>
              }
            </button>
          </div>

        </form>
      </main>

      {/* Toast */}
      {toast && (
        <div className={styles.toast} role="alert">
          <span className={styles.toastIcon}><AlertIcon /></span>
          <span className={styles.toastMsg}>{toast}</span>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/bugtracker" className={styles.back}>
          <ArrowLeftIcon />
          <span>Back to tracker</span>
        </Link>
        <div className={styles.headerBrand}>
          <h1 className={styles.headerTitle}>Bug Tracker</h1>
        </div>
        <div className={styles.headerSpacer} />
      </div>
    </header>
  );
}
