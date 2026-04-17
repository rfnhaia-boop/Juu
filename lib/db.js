import { neon } from '@neondatabase/serverless'

export function getDb() {
  const url = process.env.STORAGE_DATABASE_URL ||
              process.env.DATABASE_URL ||
              process.env.POSTGRES_URL
  if (!url) throw new Error('DATABASE_URL não configurada')
  return neon(url)
}

export async function setupTables() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      slug          TEXT NOT NULL UNIQUE,
      name          TEXT NOT NULL,
      password_hash TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT`
  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      text       TEXT NOT NULL,
      done       BOOLEAN NOT NULL DEFAULT FALSE,
      done_at    TIMESTAMPTZ,
      deadline   DATE,
      position   INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE items ADD COLUMN IF NOT EXISTS deadline DATE`
}
