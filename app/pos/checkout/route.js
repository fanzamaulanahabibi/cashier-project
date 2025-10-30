import { NextResponse } from 'next/server';
import { db, schema } from '../../../lib/db.js';
import { runInTransaction } from '../../../lib/tx.js';
import { eq } from 'drizzle-orm';
import { getSessionUser } from '../../../lib/auth.js';

export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { items, payment_method, cash_received } = body || {};
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Tidak ada item' }, { status: 400 });
  }

  try {
    const result = await runInTransaction(async (tx) => {
      let total = 0;
      const itemRows = [];
      for (const it of items) {
        const prodRows = await tx.select().from(schema.products).where(eq(schema.products.id, parseInt(it.product_id, 10))).limit(1);
        const p = prodRows[0];
        if (!p) throw new Error('Produk tidak ditemukan');
        const qty = Math.max(1, parseInt(it.qty || 1, 10));
        const line_total = p.price * qty;
        total += line_total;
        itemRows.push({ p, qty, price_each: p.price, line_total });
        const newStock = (p.stock ?? 0) - qty;
        if (newStock < 0) throw new Error(`Stok tidak cukup untuk ${p.name}`);
        await tx.update(schema.products).set({ stock: newStock }).where(eq(schema.products.id, p.id));
      }

      let cashRecv = null, change = null;
      let payMethod = payment_method || 'cash';
      if (payMethod === 'cash') {
        cashRecv = parseInt(cash_received || 0, 10);
        if (isNaN(cashRecv) || cashRecv < total) throw new Error('Uang cash kurang');
        change = cashRecv - total;
      }

      const inserted = await tx.insert(schema.orders).values({ cashier: user.username, total, paymentMethod: payMethod, cashReceived: cashRecv, changeAmount: change }).returning({ id: schema.orders.id });
      const orderId = inserted[0].id;
      await tx.insert(schema.orderItems).values(itemRows.map(r => ({ orderId, productId: r.p.id, productName: r.p.name, productSku: r.p.sku || null, qty: r.qty, priceEach: r.price_each, lineTotal: r.line_total })));
      return { orderId, total, cashRecv, change };
    });

    return NextResponse.json({ ok: true, ...result, redirectUrl: `/orders/${result.orderId}/receipt?print=1` });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

