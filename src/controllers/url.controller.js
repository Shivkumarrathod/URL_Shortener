import { createShortUrl, resolveCode, recordClick, getStats} from '../services/url.service.js';

async function shorten(req, res, next) {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });

    // Basic URL validation
    try { new URL(url); } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const result = await createShortUrl(url);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function redirect(req, res, next) {
  try {
    const { code } = req.params;
    const longUrl = await resolveCode(code);

    if (!longUrl) return res.status(404).json({ error: 'Short URL not found' });

    // Fire-and-forget — don't await so the redirect is instant
    recordClick(code, req.ip, req.get('user-agent'));

    res.redirect(301, longUrl);
  } catch (err) {
    next(err);
  }
}

async function stats(req, res, next) {
  try {
    const { code } = req.params;
    const data = await getStats(code);
    if (!data) return res.status(404).json({ error: 'Short URL not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export { shorten, redirect, stats };