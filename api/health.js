export default function handler(req, res) {
  res.status(200).json({ ok: true, service: 'coffee-pos', route: 'api/health', time: new Date().toISOString() });
}

