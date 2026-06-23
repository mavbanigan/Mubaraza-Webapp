import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM bugs ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch bugs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let title: string, category: string, severity: string,
        description: string, version: string, reporter: string,
        status: string, resolution: string;

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      ({ title, category, severity, description, version, reporter, status, resolution } = body);
    } else {
      const fd = await req.formData();
      title       = (fd.get("title")       as string) ?? "";
      category    = (fd.get("category")    as string) ?? "";
      severity    = (fd.get("severity")    as string) ?? "";
      description = (fd.get("description") as string) ?? "";
      version     = (fd.get("version")     as string) ?? "unknown";
      reporter    = (fd.get("reporter")    as string) ?? "Anonymous";
      status      = (fd.get("status")      as string) ?? "Open";
      resolution  = (fd.get("resolution")  as string) ?? "";
    }

    if (!title || !category || !severity || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { rows: countRows } = await pool.query("SELECT COUNT(*) FROM bugs");
    const next = parseInt(countRows[0].count, 10) + 101;
    const id = `MUB-${next}`;

    await pool.query(
      `INSERT INTO bugs (id, title, category, severity, description, reporter, version_affected, status, resolution)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, title, category, severity, description, reporter || "Anonymous", version || "unknown", status || "Open", resolution || null]
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create bug" }, { status: 500 });
  }
}
