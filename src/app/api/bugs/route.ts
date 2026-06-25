// src/app/api/bugs/route.ts
// Next.js App Router API route — handles POST (create) and GET (list)

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

/* --- DB connection pool ---
   Set these in your .env.local file:
   DATABASE_URL=postgresql://user:password@host:5432/mubaraza
*/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

/* --- Types --- */

type Severity = "Critical" | "High" | "Medium" | "Low";
type Category = "Client" | "Server" | "Combat" | "UI" | "Audio" | "Network";
type Status   = "Open" | "In Progress" | "Resolved" | "Closed";

const VALID_SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];
const VALID_CATEGORIES: Category[] = ["Client", "Server", "Combat", "UI", "Audio", "Network"];
const VALID_STATUSES:   Status[]   = ["Open", "In Progress", "Resolved", "Closed"];

/* --- GET /api/bugs ---
   Returns all bugs, newest first.
   Supports ?status=Open&severity=High&category=Combat&q=search query
*/
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status   = searchParams.get("status");
    const severity = searchParams.get("severity");
    const category = searchParams.get("category");
    const q        = searchParams.get("q");

    const conditions: string[] = [];
    const values: unknown[]    = [];
    let idx = 1;

    if (status   && VALID_STATUSES.includes(status as Status))     { conditions.push(`status = $${idx++}`);   values.push(status);   }
    if (severity && VALID_SEVERITIES.includes(severity as Severity)){ conditions.push(`severity = $${idx++}`); values.push(severity); }
    if (category && VALID_CATEGORIES.includes(category as Category)){ conditions.push(`category = $${idx++}`); values.push(category); }
    if (q) {
      conditions.push(`(title ILIKE $${idx} OR reporter ILIKE $${idx})`);
      values.push(`%${q}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT id, title, status, severity, category, reporter, created_at, comment_count
       FROM bugs
       ${where}
       ORDER BY created_at DESC`,
      values
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("[GET /api/bugs]", err);
    return NextResponse.json({ error: "Failed to fetch bugs." }, { status: 500 });
  }
}

/* --- POST /api/bugs ---
   Creates a new bug. Accepts multipart/form-data (for file attachments).
   Returns the newly created bug id, e.g. { id: "MUB-121" }
*/
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title      = (formData.get("title")      as string | null)?.trim();
    const category   =  formData.get("category")   as string | null;
    const version    =  formData.get("version")    as string | null;
    const status     = (formData.get("status")     as string | null) ?? "Open";
    const severity   =  formData.get("severity")   as string | null;
    const resolution = (formData.get("resolution") as string | null)?.trim() ?? "";
    const description = (formData.get("description") as string | null)?.trim();

    /* -- Server-side validation -- */
    if (!title || title.length < 10)
      return NextResponse.json({ error: "Title must be at least 10 characters." }, { status: 422 });
    if (!category || !VALID_CATEGORIES.includes(category as Category))
      return NextResponse.json({ error: "Invalid category." }, { status: 422 });
    if (!severity || !VALID_SEVERITIES.includes(severity as Severity))
      return NextResponse.json({ error: "Invalid severity." }, { status: 422 });
    if (!VALID_STATUSES.includes(status as Status))
      return NextResponse.json({ error: "Invalid status." }, { status: 422 });
    if (!description || description.length < 10)
      return NextResponse.json({ error: "Description too short." }, { status: 422 });
    if (!version)
      return NextResponse.json({ error: "Version is required." }, { status: 422 });

    /* -- Handle attachments --
       In production you would upload these to S3/R2/etc and store the URLs.
       Here we store file metadata only as a JSON column. */
    const attachments: { name: string; size: number; type: string }[] = [];
    const rawFiles = formData.getAll("attachments") as File[];
    for (const file of rawFiles) {
      if (file instanceof File && file.size > 0) {
        attachments.push({ name: file.name, size: file.size, type: file.type });
        // TODO: await uploadToStorage(file) and store URL
      }
    }

    /* -- Auto-generate bug ID (MUB-NNN) --
       We use the bugs table's sequence to get the next number. */
    const countResult = await pool.query("SELECT COUNT(*) FROM bugs");
    const nextNum = parseInt(countResult.rows[0].count, 10) + 101;
    const bugId = `MUB-${nextNum}`;

    /* -- Insert into DB -- */
    const result = await pool.query(
      `INSERT INTO bugs
        (id, title, category, version_affected, status, severity, resolution, description, attachments, reporter, comment_count, created_at)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, NOW())
       RETURNING id`,
      [
        bugId,
        title,
        category,
        version,
        status,
        severity,
        resolution || null,
        description,
        JSON.stringify(attachments),
        "Anonymous",   // replace with session user once auth is wired up
      ]
    );

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });

  } catch (err) {
    console.error("[POST /api/bugs]", err);
    return NextResponse.json({ error: "Failed to create bug report." }, { status: 500 });
  }
}