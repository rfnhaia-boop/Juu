import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(req, { params }) {
  try {
    const sql = getDb()
    const { slug } = await params
    const users = await sql`SELECT * FROM users WHERE slug = ${slug}`
    if (users.length === 0) return NextResponse.json({ error: 'Lista não encontrada' }, { status: 404 })

    const user = users[0]
    const items = await sql`
      SELECT * FROM items WHERE user_id = ${user.id}
      ORDER BY position ASC, id ASC
    `
    return NextResponse.json({ ...user, items })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    const sql = getDb()
    const { slug } = await params
    const users = await sql`SELECT * FROM users WHERE slug = ${slug}`
    if (users.length === 0) return NextResponse.json({ error: 'Lista não encontrada' }, { status: 404 })

    const user = users[0]
    const { text } = await req.json()
    if (!text?.trim()) return NextResponse.json({ error: 'Texto obrigatório' }, { status: 400 })

    const count = await sql`SELECT COUNT(*) AS n FROM items WHERE user_id = ${user.id}`
    if (parseInt(count[0].n) >= 20)
      return NextResponse.json({ error: 'Limite de 20 itens atingido' }, { status: 400 })

    const pos = parseInt(count[0].n)
    const rows = await sql`
      INSERT INTO items (user_id, text, position)
      VALUES (${user.id}, ${text.trim()}, ${pos})
      RETURNING *
    `
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
