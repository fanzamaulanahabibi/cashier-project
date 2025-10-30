import { requireUserOrRedirect } from '../../../lib/auth.js';
import { db } from '../../../lib/db.js';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function MonthlyReport({ searchParams }) {
  const { redirect } = await requireUserOrRedirect();
  if (redirect) return null;
  const ym = searchParams?.month || new Date().toISOString().slice(0,7);
  const start = `${ym}-01 00:00:00`;
  const end = `${ym}-31 23:59:59`;
  const rows = (await db.execute(sql`
    SELECT o.*, COALESCE(string_agg(COALESCE(oi.product_name, 'Produk Terhapus') || ' x' || oi.qty, ', '), '') AS product_summary
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.created_at >= ${start} AND o.created_at <= ${end}
    GROUP BY o.id
    ORDER BY o.created_at ASC
  `)).rows;
  const total = rows.reduce((a,b)=>a+b.total,0);
  const formatter = new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});

  return (
    <div className="page-stack animate-fade-in">
      <div className="section-heading">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider w-max">Laporan Bulanan</span>
        <h1 className="heading-xl">Laporan Bulanan</h1>
        <p className="text-lead">Pilih bulan untuk melihat akumulasi transaksi dan performa penjualan bulanan.</p>
      </div>

      <form method="GET" className="section-card form-grid">
        <div>
          <label className="block">Bulan</label>
          <input type="month" name="month" defaultValue={ym} className="glass-input w-full px-3 py-2" />
        </div>
        <div className="section-actions">
          <button className="glass-button px-4 py-2.5 font-semibold">Lihat Laporan</button>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="metric-card">
          <span>Bulan</span>
          <strong>{ym}</strong>
        </div>
        <div className="metric-card">
          <span>Total Transaksi</span>
          <strong>{rows.length} transaksi</strong>
        </div>
        <div className="metric-card" style={{ borderColor: 'rgba(15,118,110,0.2)', background: 'rgba(15,118,110,0.08)' }}>
          <span>Total Penjualan</span>
          <strong className="text-accent">{formatter.format(total)}</strong>
          <p className="text-xs text-muted">Rata-rata {formatter.format(rows.length ? Math.round(total / rows.length) : 0)} per transaksi</p>
        </div>
      </div>

      {rows.length ? (
        <div className="table-card">
          <div className="table-toolbar">
            <div>
              <h2 className="text-xl font-semibold text-strong">Detail Transaksi Bulanan</h2>
              <p className="text-sm text-muted">Daftar transaksi selama bulan {ym}.</p>
            </div>
            <span className="badge-soft">{rows.length} entri</span>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Waktu</th>
                  <th>Kasir</th>
                  <th>Produk</th>
                  <th>Total</th>
                  <th>Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="font-semibold text-strong">#{row.id}</td>
                    <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                    <td className="text-strong">{row.cashier || '-'}</td>
                    <td className="text-muted">{row.product_summary || '-'}</td>
                    <td className="text-accent font-semibold">{formatter.format(row.total)}</td>
                    <td>{(row.payment_method || '-').toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="section-card" style={{ border: '1px dashed rgba(120,53,15,0.25)', textAlign: 'center' }}>
          <p className="text-sm text-muted">Tidak ada transaksi pada periode ini.</p>
        </div>
      )}
    </div>
  );
}
