import { db } from '../../../../lib/db.js';
import { sql } from 'drizzle-orm';
import { SHOP } from '../../../../config/shop.js';
import { Poppins } from 'next/font/google';

export const dynamic = 'force-dynamic';

const poppins = Poppins({ subsets: ['latin'], weight: ['500','600'], display: 'swap' });

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

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{`Struk #${order.id}`}</title>
        <style>{styles}</style>
      </head>
      <body className={poppins.className}>
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
            <button onClick={() => window.print()} style={{padding:'6px 12px', background:'var(--brand)', color:'#fff', border:'none', borderRadius:'12px', cursor:'pointer'}}>Print</button>
            <a href="/orders" style={{marginLeft:'8px', color: 'var(--brand)', textDecoration:'none'}}>Kembali</a>
          </div>
        </div>
        {shouldPrint && (<script dangerouslySetInnerHTML={{__html: 'setTimeout(()=>window.print(),200)'}} />)}
      </body>
    </html>
  );
}

const styles = `
  :root{--brand:#0EA5E9; --ink:#000}
  @page{ size:58mm auto; margin:0 }
  body{ font-family:'Poppins',ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; font-size:11px; color:var(--ink); background:#fff; margin:0; padding:0 }
  .receipt{ width:58mm; margin:0 auto; padding:8px 10px }
  .center{text-align:center}
  table{ width:100%; font-size:11px; border-collapse:collapse }
  td{ padding:2px 0 }
  hr{ border:0; border-top:1px dashed rgba(31,41,55,0.4); margin:6px 0 }
  .brand-header{ text-align:center; padding:6px 0; border-radius:8px; border:1px solid rgba(14,165,233,0.35); background:linear-gradient(135deg,rgba(14,165,233,0.12),rgba(249,115,22,0.08)) }
  .brand-header h3{ margin:0; font-size:13px; font-weight:600; letter-spacing:.3px }
  .muted{ color: rgba(31,41,55,0.7); font-size:10px; margin:2px 0 }
  .totals td{ font-weight:600 }
  @media print { .no-print { display: none !important } }
`;
