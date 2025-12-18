import { NextResponse } from 'next/server';
import { db } from '../../../lib/db.js';
import { getSessionUser } from '../../../lib/auth.js';
import { sql } from 'drizzle-orm';

async function ensureCartTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS carts (
      user_id INTEGER PRIMARY KEY,
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);
}

function normalizeItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  const cleaned = [];
  for (const it of rawItems) {
    const productId = parseInt(it?.product_id ?? it?.id, 10);
    const qty = parseInt(it?.qty ?? 0, 10);
    if (Number.isInteger(productId) && productId > 0 && Number.isInteger(qty) && qty > 0) {
      cleaned.push({ product_id: productId, qty });
    }
  }
  return cleaned;
}

export async function GET(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureCartTable();
  const rows = await db.execute(sql`
    SELECT items, updated_at
    FROM carts
    WHERE user_id = ${Number(user.id)}
    LIMIT 1
  `);
  const row = rows.rows[0];
  return NextResponse.json({
    items: row?.items ?? [],
    updated_at: row?.updated_at ?? null,
  });
}

export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await ensureCartTable();

  const body = await req.json().catch(() => ({}));
  const items = normalizeItems(body?.items || []);
  const now = sql`NOW()`;

  const result = await db.execute(sql`
    INSERT INTO carts (user_id, items, updated_at)
    VALUES (${Number(user.id)}, ${JSON.stringify(items)}::jsonb, ${now})
    ON CONFLICT (user_id)
    DO UPDATE SET items = EXCLUDED.items, updated_at = EXCLUDED.updated_at
    RETURNING items, updated_at
  `);

  const row = result.rows[0];
  return NextResponse.json({
    items: row?.items ?? items,
    updated_at: row?.updated_at ?? null,
  });
}
