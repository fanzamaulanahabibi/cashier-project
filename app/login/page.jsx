import { SHOP } from '../../config/shop.js';

export const metadata = { title: 'Login - ' + SHOP.name };

export default function LoginPage({ searchParams = {} }) {
  const errorCode = searchParams?.error;
  const feedback = errorCode
    ? {
        tone: 'error',
        message:
          errorCode === '1'
            ? 'Username atau password tidak valid. Silakan periksa kembali data Anda.'
            : 'Tidak dapat memproses login saat ini. Silakan coba lagi.',
      }
    : null;

  return (
    <div className="animate-fade-in" style={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 8rem)' }}>
      <div className="login-card space-y-6" style={{ maxWidth: '380px', width: '100%' }}>
        <div className="section-heading">
          <span className="badge-soft" style={{ alignSelf: 'flex-start' }}>Selamat datang</span>
          <h1 className="heading-xl">Kasir Warung Agen Sembako</h1>
          <p className="text-lead">Masuk untuk mengelola transaksi, produk, dan laporan penjualan.</p>
        </div>
        {feedback && (
          <div className={`form-feedback ${feedback.tone}`} role="alert" aria-live="polite">
            {feedback.message}
          </div>
        )}
        <form method="POST" action="/api/login" className="form-grid">
          <div>
            <label className="block">Username</label>
            <input name="username" className="glass-input w-full px-3 py-2" required />
          </div>
          <div>
            <label className="block">Password</label>
            <input name="password" type="password" className="glass-input w-full px-3 py-2" required />
          </div>
          <button className="glass-button alt px-4 py-2.5 font-semibold w-full">Masuk</button>
        </form>
      </div>
    </div>
  );
}
