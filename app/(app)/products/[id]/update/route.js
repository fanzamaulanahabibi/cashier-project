import { NextResponse } from 'next/server';
import { db, schema } from '../../../../../lib/db.js';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '../../../../../lib/auth.js';

export async function POST(req, { params }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const id = parseInt(params.id, 10);
  const form = await req.formData();
  const name = String(form.get('name') || '').trim();
  const price = parseInt(String(form.get('price') || '0'), 10);
  const stock = parseInt(String(form.get('stock') || '0'), 10);
  const category = (String(form.get('category') || '').trim()) || null;
  const isActive = ['true','on','1'].includes(String(form.get('is_active') || '').toLowerCase());
  await db.update(schema.products).set({ name, price, stock, category, isActive }).where(eq(schema.products.id, id));
  return NextResponse.redirect(new URL('/products', req.url));
}
