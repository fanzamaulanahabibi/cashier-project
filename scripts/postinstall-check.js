// Postinstall check to confirm critical dependencies can be resolved
// (Avoid importing package.json due to package "exports" and JSON assertion issues on some runtimes)
const checks = [
  // cookie-session removed in Next.js migration
  { label: 'drizzle-orm', path: 'drizzle-orm' },
  { label: '@neondatabase/serverless', path: '@neondatabase/serverless' },
];

(async () => {
  for (const c of checks) {
    try {
      await import(c.path);
      console.log(`[postinstall] ${c.label}: ok`);
    } catch (e) {
      console.error(`[postinstall] ${c.label}: missing -> ${e.message}`);
    }
  }
})();
