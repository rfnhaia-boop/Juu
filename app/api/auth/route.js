import { NextResponse } from 'next/server'
import { getDb, setupTables } from '@/lib/db'

function hashPassword(pass) {
  let hash = 0
  for (let i = 0; i < pass.length; i++) {
    hash = ((hash << 5) - hash) + pass.charCodeAt(i)
    hash |= 0
  }
  return hash.toString(36)
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
}

export async function POST(req) {
  try {
    await setupTables()
    const sql = getDb()
    const { action, name, password } = await req.json()
    if (!name?.trim() || !password?.trim())
      return NextResponse.json({ error: 'Nome e senha obrigatórios' }, { status: 400 })

    const hashed = hashPassword(password)

    if (action === 'register') {
      const base = slugify(name.trim()) || 'lista'
      let slug = base, n = 1
      while (true) {
        const rows = await sql`SELECT id FROM users WHERE slug = ${slug}`
        if (rows.length === 0) break
        slug = `${base}-${n++}`
      }
      const existing = await sql`SELECT id FROM users WHERE lower(name) = lower(${name.trim()})`
      if (existing.length > 0)
        return NextResponse.json({ error: 'Esse nome já existe, escolha outro 🌸' }, { status: 400 })
      const rows = await sql`
        INSERT INTO users (slug, name, password_hash)
        VALUES (${slug}, ${name.trim()}, ${hashed})
        RETURNING id, slug, name
      `
      return NextResponse.json(rows[0], { status: 201 })
    }

    if (action === 'login') {
      const rows = await sql`
        SELECT id, slug, name FROM users
        WHERE lower(name) = lower(${name.trim()}) AND password_hash = ${hashed}
      `
      if (rows.length === 0)
        return NextResponse.json({ error: 'Nome ou senha incorretos 🌸' }, { status: 401 })
      return NextResponse.json(rows[0])
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
