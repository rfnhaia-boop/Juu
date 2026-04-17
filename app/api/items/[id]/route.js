import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function PATCH(req, { params }) {
  try {
    const sql = getDb()
    const { id } = await params
    const { done, text, deadline } = await req.json()

    if (done !== undefined) {
      const doneAt = done ? new Date().toISOString() : null
      await sql`UPDATE items SET done = ${done}, done_at = ${doneAt} WHERE id = ${id}`
    }
    if (text !== undefined && text.trim())
      await sql`UPDATE items SET text = ${text.trim()} WHERE id = ${id}`
    if (deadline !== undefined)
      await sql`UPDATE items SET deadline = ${deadline || null} WHERE id = ${id}`

    const rows = await sql`SELECT * FROM items WHERE id = ${id}`
    if (rows.length === 0) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const sql = getDb()
    const { id } = await params
    await sql`DELETE FROM items WHERE id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
