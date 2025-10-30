import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db.js';
import { sql } from 'drizzle-orm';
import { getSessionUser } from '../../../../lib/auth.js';

export async function GET(req) {
  const currentUser = await getSessionUser();
  if (!currentUser) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (currentUser.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') ? `${searchParams.get('from')} 00:00:00` : null;
  const to = searchParams.get('to') ? `${searchParams.get('to')} 23:59:59` : null;
  const rawPayment = searchParams.get('payment');
  const paymentCandidate = typeof rawPayment === 'string' ? rawPayment.toLowerCase().trim() : null;
  const allowedPayments = ['cash', 'qris', 'card'];
  const paymentFilter = allowedPayments.includes(paymentCandidate) ? paymentCandidate : null;
  const rows = (await db.execute(sql`
    SELECT o.id, o.created_at, o.cashier, o.total, o.payment_method, o.cash_received, o.change_amount,
           COALESCE(string_agg(COALESCE(oi.product_name, 'Produk Terhapus') || ' x' || oi.qty, ', '), '') AS products
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE ${from ? sql`o.created_at >= ${from}` : sql`TRUE`} AND ${to ? sql`o.created_at <= ${to}` : sql`TRUE`}
      AND ${paymentFilter ? sql`o.payment_method = ${paymentFilter}` : sql`TRUE`}
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
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders_${(from||'').slice(0,10)}_to_${(to||'').slice(0,10)}.csv"`,
    },
  });
}
