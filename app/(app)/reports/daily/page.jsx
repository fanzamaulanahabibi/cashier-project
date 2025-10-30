import { requireUserOrRedirect } from '../../../../lib/auth.js';
import { db } from '../../../../lib/db.js';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function DailyReport({ searchParams }) {
  const { user } = await requireUserOrRedirect();
  if (!user || user.role !== 'admin') {
    return (
      <div className="page-stack animate-fade-in">
        <div className="section-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h1 className="text-xl font-semibold text-strong">Akses Laporan Dibatasi</h1>
          <p className="text-sm text-muted mt-2">Hanya admin yang dapat melihat laporan penjualan.</p>
        </div>
      </div>
    );
  }
  const todayStr = new Date().toISOString().slice(0,10);
  const fromInput = (searchParams?.from || searchParams?.date || todayStr).trim();
  const toInput = (searchParams?.to || searchParams?.date || todayStr).trim();
  const rawPayment = searchParams?.payment ?? 'all';
  const paymentCandidate = typeof rawPayment === 'string' ? rawPayment.toLowerCase().trim() : 'all';
  const allowedPayments = ['all', 'cash', 'qris', 'card'];
  const paymentFilter = allowedPayments.includes(paymentCandidate) ? paymentCandidate : 'all';
  const start = `${fromInput} 00:00:00`;
  const end = `${toInput} 23:59:59`;
  const rows = (await db.execute(sql`
    SELECT o.*, COALESCE(string_agg(COALESCE(oi.product_name, 'Produk Terhapus') || ' x' || oi.qty, ', '), '') AS product_summary
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.created_at >= ${start} AND o.created_at <= ${end}
      AND ${paymentFilter === 'all' ? sql`TRUE` : sql`o.payment_method = ${paymentFilter}`}
    GROUP BY o.id
    ORDER BY o.created_at ASC
  `)).rows;
  const total = rows.reduce((a,b)=>a+b.total,0);
  const sameDay = fromInput === toInput;
  const rangeLabel = sameDay ? new Date(fromInput).toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' }) : `${new Date(fromInput).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })} - ${new Date(toInput).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })}`;
  const formatter = new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});
  const exportParams = new URLSearchParams({ from: fromInput, to: toInput });
  if (paymentFilter !== 'all') exportParams.set('payment', paymentFilter);

  return (
    <div className="page-stack animate-fade-in">
      <div className="section-heading">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider w-max">Laporan Penjualan</span>
        <h1 className="heading-xl">Laporan Harian</h1>
        <p className="text-lead">Pilih rentang tanggal untuk melihat performa penjualan warung Anda pada periode tertentu.</p>
      </div>

      <form method="GET" className="section-card form-grid form-grid--two">
        <div>
          <label className="block">Mulai</label>
          <input type="date" name="from" defaultValue={fromInput} className="glass-input w-full px-3 py-2" />
        </div>
        <div>
          <label className="block">Selesai</label>
          <input type="date" name="to" defaultValue={toInput} className="glass-input w-full px-3 py-2" />
        </div>
        <div>
          <label className="block">Metode Pembayaran</label>
          <select name="payment" defaultValue={paymentFilter} className="glass-input w-full px-3 py-2">
            <option value="all">Semua Metode</option>
            <option value="cash">Tunai</option>
            <option value="qris">QRIS</option>
            <option value="card">Kartu</option>
          </select>
        </div>
        <div className="section-actions">
          <button className="glass-button px-4 py-2.5 font-semibold">Lihat Laporan</button>
          <a className="glass-button alt px-4 py-2.5 font-semibold" href={`/reports/export.csv?${exportParams.toString()}`} target="_blank">Export CSV</a>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="metric-card">
          <span>Periode</span>
          <strong>{rangeLabel}</strong>
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
              <h2 className="text-xl font-semibold text-strong">Detail Transaksi</h2>
              <p className="text-sm text-muted">Daftar transaksi dalam periode yang dipilih.</p>
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
