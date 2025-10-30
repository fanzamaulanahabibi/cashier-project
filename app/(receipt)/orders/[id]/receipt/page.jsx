import { db } from '../../../../../lib/db.js';
import { sql } from 'drizzle-orm';
import { SHOP } from '../../../../../config/shop.js';
import { Poppins } from 'next/font/google';

export const dynamic = 'force-dynamic';

const poppins = Poppins({ subsets: ['latin'], weight: ['500','600'], display: 'swap' });

export async function generateMetadata({ params }) {
  return {
    title: `Struk #${params.id} - ${SHOP.name}`,
  };
}

export default async function ReceiptPage({ params, searchParams }) {
  const id = parseInt(params.id, 10);
  const orderRes = await db.execute(sql`SELECT * FROM orders WHERE id = ${id}`);
  const order = orderRes.rows[0];
  if (!order) return <div>Order tidak ditemukan</div>;
  const itemsRes = await db.execute(sql`
    SELECT oi.*, COALESCE(oi.product_name, p.name, 'Produk Terhapus') AS name, COALESCE(oi.product_sku, p.sku) AS sku
    FROM order_items oi
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ${id}
  `);
  const items = itemsRes.rows;
  const shouldPrint = searchParams?.print === '1';
  const controlScript = `
    (function() {
      const bind = () => {
        const btn = document.getElementById('print-trigger');
        if (btn && !btn.__printBound) {
          btn.__printBound = true;
          btn.addEventListener('click', () => window.print());
        }
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind, { once: true });
      } else {
        bind();
      }
      ${shouldPrint ? 'setTimeout(()=>window.print(),200);' : ''}
    })();
  `;

  return (
    <>
      <div className={`${poppins.className} receipt-shell`}>
        <div className="receipt">
          <div className="brand-header">
            <h3>{SHOP.name}</h3>
            <p className="muted">{SHOP.address}</p>
          </div>
          <p className="center muted" style={{marginTop:'6px'}}>
            {`Struk #${order.id}`}<br />
            {new Date(order.created_at).toLocaleString('id-ID')}<br />
            {`Kasir: ${order.cashier}`}
          </p>
          <hr />
          <table>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.name} x {it.qty}</td>
                  <td style={{textAlign:'right'}}>{Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(it.line_total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="totals"><td>Total</td><td style={{textAlign:'right'}}>{Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(order.total)}</td></tr>
              <tr><td>Metode</td><td style={{textAlign:'right'}}>{(order.payment_method || '-').toUpperCase()}</td></tr>
              {order.cash_received != null && (
                <>
                  <tr><td>Dibayar</td><td style={{textAlign:'right'}}>{Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(order.cash_received)}</td></tr>
                  <tr><td>Kembali</td><td style={{textAlign:'right'}}>{Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(order.change_amount)}</td></tr>
                </>
              )}
            </tfoot>
          </table>
          <hr />
          <p className="center muted">{SHOP.receipt_footer}</p>
          <div className="no-print center" style={{marginTop:'8px'}}>
            <button
              id="print-trigger"
              type="button"
              style={{padding:'6px 12px', background:'var(--brand)', color:'#fff', border:'none', borderRadius:'12px', cursor:'pointer'}}
            >
              Print
            </button>
            <a href="/orders" style={{marginLeft:'8px', color: 'var(--brand)', textDecoration:'none'}}>Kembali</a>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{__html: controlScript}} />
    </>
  );
}
