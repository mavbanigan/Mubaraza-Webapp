CREATE TABLE IF NOT EXISTS bugs (
  id               TEXT PRIMARY KEY,             -- e.g. MUB-101
  title            TEXT        NOT NULL,
  category         TEXT        NOT NULL,          -- Client | Server | Combat | UI | Audio | Network
  version_affected TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'Open',   -- Open | In Progress | Resolved | Closed
  severity         TEXT        NOT NULL,          -- Critical | High | Medium | Low
  resolution       TEXT,                          -- nullable
  description      TEXT        NOT NULL,
  attachments      JSONB       NOT NULL DEFAULT '[]',
  reporter         TEXT        NOT NULL DEFAULT 'Anonymous',
  comment_count    INTEGER     NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bugs_updated_at ON bugs;
CREATE TRIGGER bugs_updated_at
  BEFORE UPDATE ON bugs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes for the common filter/sort queries
CREATE INDEX IF NOT EXISTS bugs_status_idx   ON bugs (status);
CREATE INDEX IF NOT EXISTS bugs_severity_idx ON bugs (severity);
CREATE INDEX IF NOT EXISTS bugs_category_idx ON bugs (category);
CREATE INDEX IF NOT EXISTS bugs_created_idx  ON bugs (created_at DESC);

-- Full-text search index on title + description
CREATE INDEX IF NOT EXISTS bugs_fts_idx ON bugs
  USING GIN (to_tsvector('english', title || ' ' || description));