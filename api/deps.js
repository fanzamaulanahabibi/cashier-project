export default async function handler(req, res) {
  const result = { ok: true, deps: {}, env: process.env.NODE_ENV || 'development' };

  async function check(label, pkgPath) {
    try {
      const m = await import(pkgPath);
      const version = (m && (m.version || m.default?.version)) || null;
      result.deps[label] = { ok: true, version };
    } catch (e) {
      result.ok = false;
      result.deps[label] = { ok: false, error: String(e) };
    }
  }

  await check('iron-session', 'iron-session/package.json');
  await check('drizzle-orm', 'drizzle-orm/package.json');
  await check('@neondatabase/serverless', '@neondatabase/serverless/package.json');

  res.status(result.ok ? 200 : 500).json(result);
}

