import { db, runInTransaction } from '../drizzle/client.js';
import { sql, eq } from 'drizzle-orm';
import { schema } from '../drizzle/client.js';
import { STANDARD_CATEGORIES } from '../config/shop.js';

export async function getPos(req, res) {
  const categoryRows = await db.execute(sql`SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category`);
  const dataCategories = categoryRows.rows
    .map((row) => row.category)
    .filter((name) => name && name.trim() !== '');
  const products = await db.select().from(schema.products).where(eq(schema.products.isActive, true)).orderBy(schema.products.name);
  const categories = [...STANDARD_CATEGORIES];
  for (const name of dataCategories) if (!categories.includes(name)) categories.push(name);
  res.render('pos', { products, categories });
}

export async function checkout(req, res) {
  const { items, payment_method, cash_received } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Tidak ada item' });
  }

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

    const inserted = await tx.insert(schema.orders).values({ cashier: req.session.user.username, total, paymentMethod: payMethod, cashReceived: cashRecv, changeAmount: change }).returning({ id: schema.orders.id });
    const orderId = inserted[0].id;

    await tx.insert(schema.orderItems).values(itemRows.map(r => ({ orderId, productId: r.p.id, productName: r.p.name, productSku: r.p.sku || null, qty: r.qty, priceEach: r.price_each, lineTotal: r.line_total })));
    return { orderId, total, cashRecv, change };
  });

  try {
    const resTx = result;
    res.json({ ok: true, ...resTx, redirectUrl: `/orders/${resTx.orderId}/receipt?print=1` });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
}
