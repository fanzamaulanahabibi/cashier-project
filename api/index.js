import serverless from 'serverless-http';

export default async function handler(req, res) {
  try {
    if (req.url === '/__ping' || req.url?.startsWith('/__ping?')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('ok');
      return;
    }
    // Lazy-load Express app to avoid hanging during cold start if a heavy import blocks
    const { app } = await import('../app.js');
    const wrapped = serverless(app);
    return wrapped(req, res);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: String(e) }));
  }
}
