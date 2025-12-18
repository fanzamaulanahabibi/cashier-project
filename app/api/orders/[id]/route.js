import { NextResponse } from 'next/server';
import { db, schema } from '../../../../lib/db.js';
import { getSessionUser } from '../../../../lib/auth.js';
import { runInTransaction } from '../../../../lib/tx.js';
import { eq, sql } from 'drizzle-orm';

export async function DELETE(_req, { params }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const orderId = Number(params.id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return NextResponse.json({ error: 'ID transaksi tidak valid' }, { status: 400 });
  }

  try {
    const result = await runInTransaction(async (tx) => {
      const orderRows = await tx.select().from(schema.orders).where(eq(schema.orders.id, orderId)).limit(1);
      if (!orderRows[0]) {
        throw new Error('Transaksi tidak ditemukan');
      }

      const items = await tx.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, orderId));
      let restored = 0;
      for (const item of items) {
        if (item.productId != null) {
          await tx.execute(sql`UPDATE products SET stock = COALESCE(stock,0) + ${item.qty} WHERE id = ${item.productId}`);
          restored += item.qty || 0;
        }
      }

      await tx.delete(schema.orders).where(eq(schema.orders.id, orderId));
      return { restored };
    });

    return NextResponse.json({ ok: true, restored: result.restored });
  } catch (error) {
    const message = error?.message || 'Gagal menghapus transaksi';
    const status = /tidak ditemukan/i.test(message) ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
