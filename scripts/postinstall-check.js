// Postinstall check to confirm critical dependencies exist in the Vercel build logs
// Safe to remove after verification
const checks = [
  { label: 'cookie-session', path: 'cookie-session/package.json' },
  { label: 'drizzle-orm', path: 'drizzle-orm/package.json' },
  { label: '@neondatabase/serverless', path: '@neondatabase/serverless/package.json' },
];

(async () => {
  for (const c of checks) {
    try {
      const mod = await import(c.path, { assert: { type: 'json' } });
      const version = (mod && (mod.version || mod.default?.version)) || 'unknown';
      console.log(`[postinstall] ${c.label} version: ${version}`);
    } catch (e) {
      console.error(`[postinstall] ${c.label} missing: ${e.message}`);
    }
  }
})();
