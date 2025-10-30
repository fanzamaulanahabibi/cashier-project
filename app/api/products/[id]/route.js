import { NextResponse } from 'next/server';
import { db, schema } from '../../../../lib/db.js';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '../../../../lib/auth.js';

export async function DELETE(_req, { params }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const id = parseInt(params.id, 10);
  await db.update(schema.orderItems).set({ productId: null }).where(eq(schema.orderItems.productId, id));
  await db.delete(schema.products).where(eq(schema.products.id, id));
  return NextResponse.json({ success: true });
}

