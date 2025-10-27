import { db } from '../drizzle/client.js';
import { sql } from 'drizzle-orm';

export async function daily(req, res) {
  const dayjs = res.locals.dayjs;
  const today = dayjs().format('YYYY-MM-DD');
  const fromInput = (req.query.from || req.query.date || today).trim();
  const toInput = (req.query.to || req.query.date || today).trim();

  let fromDate = dayjs(fromInput);
  if (!fromDate.isValid()) fromDate = dayjs(today);
  let toDate = dayjs(toInput);
  if (!toDate.isValid()) toDate = fromDate;

  const start = fromDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const end = toDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const rows = (await db.execute(sql`
    SELECT o.*, COALESCE(string_agg(COALESCE(oi.product_name, 'Produk Terhapus') || ' x' || oi.qty, ', '), '') AS product_summary
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.created_at >= ${start} AND o.created_at <= ${end}
    GROUP BY o.id
    ORDER BY o.created_at ASC
  `)).rows;
  const total = rows.reduce((a, b) => a + b.total, 0);

  res.render('report', {
    rows,
    total,
    filters: { from: fromDate.format('YYYY-MM-DD'), to: toDate.format('YYYY-MM-DD') },
  });
}

export async function exportCsv(req, res) {
  const dayjs = res.locals.dayjs;
  const from = req.query.from
    ? dayjs(req.query.from + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss')
    : dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const to = req.query.to
    ? dayjs(req.query.to + ' 23:59:59').format('YYYY-MM-DD HH:mm:ss')
    : dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');

  const rows = (await db.execute(sql`
    SELECT o.id, o.created_at, o.cashier, o.total, o.payment_method, o.cash_received, o.change_amount,
           COALESCE(string_agg(COALESCE(oi.product_name, 'Produk Terhapus') || ' x' || oi.qty, ', '), '') AS products
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.created_at >= ${from} AND o.created_at <= ${to}
    GROUP BY o.id
    ORDER BY o.id
  `)).rows;

  const header = ['id','created_at','cashier','total','payment_method','cash_received','change_amount','products'];
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [header.join(',')].concat(rows.map(r => header.map(k => escape(r[k])).join(',')));
  const csv = '\uFEFF' + lines.join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="orders_${from.slice(0,10)}_to_${to.slice(0,10)}.csv"`);
  res.send(csv);
}

export async function monthly(req, res) {
  const dayjs = res.locals.dayjs;
  const ym = req.query.month || dayjs().format('YYYY-MM');
  const start = dayjs(ym + '-01').startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const end   = dayjs(ym + '-01').endOf('month').format('YYYY-MM-DD HH:mm:ss');

  const rows = (await db.execute(sql`
    SELECT o.*, COALESCE(string_agg(COALESCE(oi.product_name, 'Produk Terhapus') || ' x' || oi.qty, ', '), '') AS product_summary
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.created_at >= ${start} AND o.created_at <= ${end}
    GROUP BY o.id
    ORDER BY o.created_at ASC
  `)).rows;
  const total = rows.reduce((a,b)=> a + b.total, 0);

  res.render('report', {
    rows,
    total,
    filters: {
      from: dayjs(ym + '-01').startOf('month').format('YYYY-MM-DD'),
      to: dayjs(ym + '-01').endOf('month').format('YYYY-MM-DD'),
    },
  });
}
