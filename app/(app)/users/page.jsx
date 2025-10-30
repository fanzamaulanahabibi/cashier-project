import { requireUserOrRedirect } from '../../../lib/auth.js';
import { db, schema } from '../../../lib/db.js';

export const dynamic = 'force-dynamic';

export default async function UsersPage({ searchParams }) {
  const { user, redirect } = await requireUserOrRedirect();
  if (redirect) return null;
  if (!user || user.role !== 'admin') {
    return (
      <div className="page-stack animate-fade-in">
        <div className="section-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h1 className="text-xl font-semibold text-strong">Akses Ditolak</h1>
          <p className="text-muted text-sm mt-2">Halaman manajemen pengguna hanya dapat diakses oleh admin.</p>
        </div>
      </div>
    );
  }

  const viewerId = Number(user.id);

  const allUsers = await db
    .select({
      id: schema.users.id,
      username: schema.users.username,
      role: schema.users.role,
    })
    .from(schema.users)
    .orderBy(schema.users.username);

  const successUser = searchParams?.success;
  const successRole = searchParams?.role;
  const removedUser = searchParams?.removed;
  const errorCode = searchParams?.error;

  const feedback = (() => {
    if (successUser) {
      const roleLabel = successRole === 'admin' ? 'Admin' : 'Kasir';
      return {
        tone: 'success',
        message: `Akun '${successUser}' berhasil dibuat dengan role ${roleLabel}.`,
      };
    }
    if (removedUser) {
      return {
        tone: 'success',
        message: `Akun '${removedUser}' berhasil dihapus.`,
      };
    }
    if (errorCode === 'exists') {
      return { tone: 'error', message: 'Username tersebut sudah digunakan. Pilih nama lain.' };
    }
    if (errorCode === 'invalid-username') {
      return { tone: 'error', message: 'Username minimal 3 karakter dan tidak boleh kosong.' };
    }
    if (errorCode === 'weak-password') {
      return { tone: 'error', message: 'Password minimal 8 karakter.' };
    }
    if (errorCode === 'forbidden') {
      return { tone: 'error', message: 'Anda tidak memiliki izin untuk membuat pengguna baru.' };
    }
    if (errorCode === 'self-delete') {
      return { tone: 'error', message: 'Tidak dapat menghapus akun Anda sendiri.' };
    }
    if (errorCode === 'not-found') {
      return { tone: 'error', message: 'Akun yang dipilih sudah tidak tersedia.' };
    }
    return null;
  })();

  return (
    <div className="page-stack animate-fade-in">
      <div className="section-heading">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider w-max">
          Manajemen Pengguna
        </span>
        <h1 className="heading-xl">Pengguna & Role</h1>
        <p className="text-lead">Kelola akun admin dan kasir yang dapat mengakses aplikasi POS.</p>
      </div>

      {feedback && (
        <div className={`form-feedback ${feedback.tone}`} role="alert">
          {feedback.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="table-card">
          <div className="table-toolbar">
            <div>
              <h2 className="text-xl font-semibold text-strong">Daftar Pengguna</h2>
              <p className="text-sm text-muted">Pantau siapa saja yang memiliki akses.</p>
            </div>
            <span className="badge-soft">{allUsers.length} akun</span>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="text-muted">#{u.id}</td>
                    <td className="font-semibold text-strong">{u.username}</td>
                    <td>
                      <span className="badge-soft" style={{ background: u.role === 'admin' ? 'rgba(15,118,110,0.12)' : 'rgba(59,130,246,0.15)' }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {u.id === viewerId ? (
                        <span className="text-xs text-muted">Akun Anda</span>
                      ) : (
                        <form method="POST" action={`/api/users/${u.id}/delete`} style={{ display: 'inline' }}>
                          <button
                            type="submit"
                            className="glass-button px-3 py-1.5 text-xs"
                            style={{ background: 'rgba(220,38,38,0.12)', borderColor: 'rgba(220,38,38,0.25)', color: '#b91c1c' }}
                          >
                            Hapus
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card" style={{ alignSelf: 'start' }}>
          <h2 className="text-lg font-semibold text-strong mb-4">Tambah Pengguna Baru</h2>
          <form method="POST" action="/api/users" className="form-grid form-grid--two">
            <div className="form-span-2">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                name="username"
                required
                minLength={3}
                className="glass-input w-full px-3 py-2"
                placeholder="contoh: kasir1"
              />
            </div>
            <div className="form-span-2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="glass-input w-full px-3 py-2"
                placeholder="Minimal 8 karakter"
              />
              <p className="text-xs text-muted mt-1">Bagikan password ini ke kasir dan minta mereka mengganti setelah login.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select name="role" defaultValue="cashier" className="glass-input w-full px-3 py-2">
                <option value="cashier">Kasir</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-span-2 section-actions" style={{ justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="glass-button px-4 py-2.5 font-semibold">Buat Akun</button>
              <p className="text-xs text-muted">Pastikan username unik dan password aman.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
