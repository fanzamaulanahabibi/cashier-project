import Script from 'next/script';
import { getSessionUser } from '../../lib/auth.js';
import { SHOP } from '../../config/shop.js';

export default async function AppShell({ children }) {
  const currentUser = await getSessionUser();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <>
      <Script id="app-utils" strategy="beforeInteractive">
        {`window.formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);`}
      </Script>
      <Script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" strategy="afterInteractive" />
      <nav className="navbar">
        <div className="nav-inner max-w-6xl mx-auto">
          <div className="nav-brand flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand font-semibold shadow-soft">KW</span>
            <div>
              <p className="text-xs uppercase tracking-wider text-subtle">Warung Sembako</p>
              <p className="text-lg font-semibold text-strong">{SHOP.name}</p>
            </div>
          </div>
          <input type="checkbox" id="nav-toggle" className="nav-toggle" aria-controls="main-menu" aria-label="Toggle menu" />
          <label htmlFor="nav-toggle" className="nav-toggle-btn" aria-hidden="true">
            <span />
            <span />
            <span />
          </label>
          <div className="nav-links flex items-center gap-3 text-sm" id="main-menu">
            {currentUser ? (
              <>
                <a href="/pos" className="nav-link">Kasir</a>
                <a href="/orders" className="nav-link">Orders</a>
                {isAdmin && <a href="/reports/daily" className="nav-link">Laporan</a>}
                {isAdmin && <a href="/products" className="nav-link">Produk</a>}
                {isAdmin && <a href="/users" className="nav-link">Pengguna</a>}
                <span className="text-base text-muted">
                  Hi, <span className="font-semibold text-strong">{currentUser.username}</span>
                </span>
                <a href="/logout" className="glass-button px-4 py-2 text-sm">Logout</a>
              </>
            ) : (
              <a href="/login" className="glass-button px-4 py-2 text-sm">Login</a>
            )}
          </div>
        </div>
      </nav>
      <main className="app-container">
        <div className="page-stack animate-fade-in">{children}</div>
      </main>
      <script src="/js/pos.js" defer></script>
    </>
  );
}
