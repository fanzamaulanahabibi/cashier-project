import { requireUserOrRedirect } from '../../lib/auth.js';
import { db } from '../../lib/db.js';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }) {
  const { redirect } = await requireUserOrRedirect();
  if (redirect) return null;
  const fromInput = (searchParams?.from || '').trim();
  const toInput = (searchParams?.to || '').trim();

  const whereSql = fromInput || toInput
    ? sql`WHERE ${fromInput ? sql`o.created_at >= ${fromInput + ' 00:00:00'}` : sql``} ${fromInput && toInput ? sql`AND` : sql``} ${toInput ? sql`o.created_at <= ${toInput + ' 23:59:59'}` : sql``}`
    : sql``;
  const query = sql`
    SELECT o.*, COALESCE(string_agg(COALESCE(oi.product_name, 'Produk Terhapus') || ' x' || oi.qty, ', '), '') AS product_summary
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    ${whereSql}
    GROUP BY o.id
    ORDER BY o.id DESC
    ${fromInput || toInput ? sql`` : sql`LIMIT 100`}
  `;
  const result = await db.execute(query);
  const orders = result.rows;
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const formatIDR = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

  return (
    <div className="page-stack animate-fade-in">
      <div className="section-heading">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider w-max">Riwayat Transaksi</span>
        <h1 className="heading-xl">Riwayat Orders</h1>
        <p className="text-lead">Pantau transaksi terbaru, akses struk, dan ikuti performa kasir dengan tampilan yang lega.</p>
      </div>

      <div className="section-card grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="metric-card">
          <span>Total order ditampilkan</span>
          <strong>{orders.length} transaksi</strong>
        </div>
        <div className="metric-card" style={{ background: 'rgba(15,118,110,0.08)', borderColor: 'rgba(15,118,110,0.2)' }}>
          <span>Nominal transaksi</span>
          <strong className="text-accent">{formatIDR.format(totalSales)}</strong>
        </div>
        <div className="metric-card" style={{ background: 'rgba(244,213,178,0.3)' }}>
          <span>Periode filter</span>
          <strong>{fromInput || toInput ? `${fromInput || 'awal'} → ${toInput || 'akhir'}` : 'Menampilkan 100 terbaru'}</strong>
        </div>
      </div>

      <form className="section-card filter-bar" method="get" action="/orders">
        <div className="filter-group">
          <label className="filter-label" htmlFor="from">Mulai</label>
          <input id="from" name="from" type="date" defaultValue={fromInput} className="glass-input px-3 py-2" />
        </div>
        <div className="filter-group">
          <label className="filter-label" htmlFor="to">Selesai</label>
          <input id="to" name="to" type="date" defaultValue={toInput} className="glass-input px-3 py-2" />
        </div>
        <div className="filter-actions">
          <button type="submit" className="glass-button px-4 py-2 font-semibold">Terapkan</button>
          <a href="/orders" className="glass-button alt px-4 py-2 font-semibold">Reset</a>
        </div>
      </form>

      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-xl font-semibold text-strong">Daftar Orders</h2>
            <p className="text-sm text-muted">Klik struk untuk melihat detail atau cetak ulang.</p>
          </div>
          <span className="badge-soft">{orders.length} entri</span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Waktu</th>
                <th>Kasir</th>
                <th>Produk</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th>Uang</th>
                <th>Kembali</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const method = (o.payment_method || '').toLowerCase();
                return (
                  <tr key={o.id}>
                    <td className="font-semibold text-strong">#{o.id}</td>
                    <td>{new Date(o.created_at).toLocaleString('id-ID')}</td>
                    <td className="text-strong">{o.cashier || '-'}</td>
                    <td className="text-muted">{o.product_summary || '-'}</td>
                    <td className="text-accent font-semibold">{formatIDR.format(o.total)}</td>
                    <td><span className="badge-soft" style={{ background: 'rgba(15,118,110,0.1)' }}>{method ? method.toUpperCase() : '-'}</span></td>
                    <td>{o.cash_received != null ? formatIDR.format(o.cash_received) : '-'}</td>
                    <td>{o.change_amount != null ? formatIDR.format(o.change_amount) : '-'}</td>
                    <td>
                      <div className="section-actions">
                        <a className="glass-button px-3 py-2 text-sm" target="_blank" href={`/orders/${o.id}/receipt`}>
                          Lihat Struk
                        </a>
                        <a className="glass-button alt px-3 py-2 text-sm" target="_blank" href={`/orders/${o.id}/receipt?print=1`}>
                          Print
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

