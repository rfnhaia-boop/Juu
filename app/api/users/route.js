import { NextResponse } from 'next/server'
import { getDb, setupTables } from '@/lib/db'

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
}

export async function POST(req) {
  try {
    await setupTables()
    const sql = getDb()
    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

    const base = slugify(name.trim()) || 'lista'
    let slug = base, n = 1
    while (true) {
      const rows = await sql`SELECT id FROM users WHERE slug = ${slug}`
      if (rows.length === 0) break
      slug = `${base}-${n++}`
    }

    const rows = await sql`
      INSERT INTO users (slug, name) VALUES (${slug}, ${name.trim()})
      RETURNING id, slug, name, created_at
    `
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
