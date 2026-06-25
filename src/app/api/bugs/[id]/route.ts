import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const bugId = id.toUpperCase();

  try {
    const { rows } = await pool.query("SELECT * FROM bugs WHERE id = $1", [bugId]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("[GET /api/bugs/:id]", err);
    return NextResponse.json({ error: "Failed to fetch bug" }, { status: 500 });
  }
}
