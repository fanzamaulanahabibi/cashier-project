import { requireUserOrRedirect } from '../../../../lib/auth.js';

export const dynamic = 'force-dynamic';

export default async function ChangePasswordPage({ searchParams }) {
  const { redirect } = await requireUserOrRedirect();
  if (redirect) return null;

  const status = String(searchParams?.status || '');
  const error = String(searchParams?.error || '');
  const feedback = (() => {
    if (status === 'success') {
      return { tone: 'success', message: 'Password berhasil diperbarui.' };
    }
    if (error === 'invalid-current') {
      return { tone: 'error', message: 'Password saat ini tidak sesuai.' };
    }
    if (error === 'weak-password') {
      return { tone: 'error', message: 'Password baru minimal 8 karakter.' };
    }
    if (error === 'mismatch') {
      return { tone: 'error', message: 'Konfirmasi password tidak cocok.' };
    }
    return null;
  })();

  return (
    <div className="page-stack animate-fade-in">
      <div className="section-card" style={{ maxWidth: '520px', margin: '0 auto' }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider w-max">
          Keamanan Akun
        </span>
        <h1 className="heading-xl">Ganti Password</h1>
        <p className="text-sm text-muted mb-6">Masukkan password saat ini dan pilih password baru yang lebih aman.</p>

        {feedback && (
          <div className={`form-feedback ${feedback.tone}`} role="alert">
            {feedback.message}
          </div>
        )}

        <form method="POST" action="/api/account/password" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-strong" htmlFor="currentPassword">
              Password Saat Ini
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="glass-input w-full px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-strong" htmlFor="newPassword">
              Password Baru
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              minLength={8}
              required
              className="glass-input w-full px-3 py-2"
              placeholder="Minimal 8 karakter"
            />
            <p className="text-xs text-muted">Gunakan kombinasi huruf besar, kecil, dan angka.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-strong" htmlFor="confirmPassword">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="glass-input w-full px-3 py-2"
              placeholder="Ulangi password baru"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="glass-button px-4 py-2.5 font-semibold">Simpan Perubahan</button>
            <p className="text-xs text-muted">Anda akan tetap login setelah password diganti.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

