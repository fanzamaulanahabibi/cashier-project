import bcrypt from 'bcryptjs';
import { db, schema } from '../drizzle/client.js';
import { eq } from 'drizzle-orm';

export function getLogin(req, res) {
  if (req.session.user) return res.redirect('/pos');
  res.render('login', { error: null });
}

export async function postLogin(req, res) {
  const usernameRaw = req.body?.username ?? '';
  const password = req.body?.password ?? '';
  const username = String(usernameRaw).trim();
  try {
    const rows = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    const user = rows[0];
    if (!user) return res.render('login', { error: 'User tidak ditemukan' });
    if (!bcrypt.compareSync(password, user.passwordHash)) {
      return res.render('login', { error: 'Password salah' });
    }
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect('/pos');
  } catch (e) {
    console.error(e);
    res.render('login', { error: 'Terjadi kesalahan' });
  }
}

export function logout(req, res) {
  req.session.destroy(() => res.redirect('/login'));
}
