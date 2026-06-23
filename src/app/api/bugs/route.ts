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
    const body = await req.json();
    const { title, category, severity, description, stepsToReproduce, reporter } = body;

    if (!title || !category || !severity || !description || !reporter) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate next MUB-NNN id
    const { rows: countRows } = await pool.query("SELECT COUNT(*) FROM bugs");
    const next = parseInt(countRows[0].count, 10) + 101;
    const id = `MUB-${next}`;

    const fullDescription = stepsToReproduce
      ? `${description}\n\n**Steps to Reproduce:**\n${stepsToReproduce}`
      : description;

    await pool.query(
      `INSERT INTO bugs (id, title, category, severity, description, reporter, version_affected)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, title, category, severity, fullDescription, reporter, "unknown"]
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create bug" }, { status: 500 });
  }
}
