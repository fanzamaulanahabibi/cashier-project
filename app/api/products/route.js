import { NextResponse } from 'next/server';
import { db, schema } from '../../../lib/db.js';
import { getSessionUser } from '../../../lib/auth.js';

export async function POST(req) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { name, sku, price, category, stock } = await req.json();
  if (!name || !price) return NextResponse.json({ error: 'Nama dan harga harus diisi' }, { status: 400 });
  const p = parseInt(price, 10);
  if (Number.isNaN(p) || p <= 0) return NextResponse.json({ error: 'Harga tidak valid' }, { status: 400 });
  const s = stock === '' || stock === undefined ? 0 : parseInt(stock, 10);
  const inserted = await db.insert(schema.products).values({ name, sku: sku || null, price: p, category: category || null, stock: Number.isNaN(s) ? 0 : s, isActive: true }).returning();
  return NextResponse.json({ product: inserted[0] });
}

