import Script from 'next/script';
import { Poppins } from 'next/font/google';
import { getSessionUser } from '../lib/auth.js';
import { SHOP } from '../config/shop.js';
import './globals.css';

export const metadata = {
  title: SHOP.name + ' POS',
};

const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'], display: 'swap' });

export default async function RootLayout({ children }) {
  const currentUser = await getSessionUser();

  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Script id="app-utils" strategy="beforeInteractive">
          {`window.formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);`}
        </Script>
        <Script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" strategy="afterInteractive" />
      </head>
      <body className={`${poppins.className} min-h-screen font-display`}>
        <nav className="navbar">
          <div className="nav-inner max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand font-semibold shadow-soft">KW</span>
              <div>
                <p className="text-xs uppercase tracking-wider text-subtle">Warung Sembako</p>
                <p className="text-lg font-semibold text-strong">{SHOP.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {currentUser ? (
                <>
                  <a href="/pos" className="nav-link">Kasir</a>
                  <a href="/orders" className="nav-link">Orders</a>
                  <a href="/reports/daily" className="nav-link">Laporan</a>
                  <a href="/products" className="nav-link">Produk</a>
                  <span className="text-base text-muted">Hi, <span className="font-semibold text-strong">{currentUser.username}</span></span>
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
      </body>
    </html>
  );
}
