export function notFound(req, res, _next) {
  if (req.path && req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint tidak ditemukan' });
  }
  res.status(404);
  return res.render('error', { status: 404, message: 'Halaman tidak ditemukan', stack: null });
}

export function errorHandler(err, req, res, _next) {
  const isApi = req.path && req.path.startsWith('/api/');
  const status = err.status || 500;
  const message = err.message || 'Terjadi kesalahan pada server';
  if (isApi) {
    return res.status(status).json({ error: message });
  }
  const showStack = process.env.NODE_ENV !== 'production' ? (err.stack || null) : null;
  res.status(status);
  return res.render('error', { status, message, stack: showStack });
}
