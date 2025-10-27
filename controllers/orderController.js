import { db } from '../drizzle/client.js';
import { sql } from 'drizzle-orm';

export async function list(req, res) {
  const fromInput = (req.query.from || '').trim();
  const toInput = (req.query.to || '').trim();

  let fromDate = fromInput ? res.locals.dayjs(fromInput) : null; // dayjs is in locals
  if (fromDate && !fromDate.isValid()) fromDate = null;
  let toDate = toInput ? res.locals.dayjs(toInput) : null;
  if (toDate && !toDate.isValid()) toDate = null;

  const fromStart = fromDate ? fromDate.startOf('day').format('YYYY-MM-DD HH:mm:ss') : null;
  const toEnd = toDate ? toDate.endOf('day').format('YYYY-MM-DD HH:mm:ss') : null;

  const whereSql = fromStart || toEnd
    ? sql`WHERE ${fromStart ? sql`o.created_at >= ${fromStart}` : sql``} ${fromStart && toEnd ? sql`AND` : sql``} ${toEnd ? sql`o.created_at <= ${toEnd}` : sql``}`
    : sql``;

  const query = sql`
    SELECT o.*, COALESCE(string_agg(COALESCE(oi.product_name, 'Produk Terhapus') || ' x' || oi.qty, ', '), '') AS product_summary
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    ${whereSql}
    GROUP BY o.id
    ORDER BY o.id DESC
    ${fromStart || toEnd ? sql`` : sql`LIMIT 100`}
  `;
  const result = await db.execute(query);
  const orders = result.rows;
  const filters = {
    from: fromDate ? fromDate.format('YYYY-MM-DD') : '',
    to: toDate ? toDate.format('YYYY-MM-DD') : '',
  };
  res.render('orders', { orders, filters });
}

export async function receipt(req, res) {
  const id = parseInt(req.params.id, 10);
  const orderRes = await db.execute(sql`SELECT * FROM orders WHERE id = ${id}`);
  const order = orderRes.rows[0];
  if (!order) return res.status(404).send('Order tidak ditemukan');
  const itemsRes = await db.execute(sql`
    SELECT oi.*, COALESCE(oi.product_name, p.name, 'Produk Terhapus') AS name, COALESCE(oi.product_sku, p.sku) AS sku
    FROM order_items oi
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ${id}
  `);
  const items = itemsRes.rows;
  res.render('receipt', { order, items });
}
