import pool  from '../db/pool'
import redis from './redis.service';
import { generateCode } from '../utils/generateCode';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600', 10);

/**
 * Create a short URL.
 * Returns the full short URL.
 */
async function createShortUrl(longUrl) {
  let code;
  let attempts = 0;

  // Retry on collision (extremely rare but handle it)
  while (attempts < 5) {
    code = generateCode();
    try {
      const { rows } = await pool.query(
        'INSERT INTO urls (code, long_url) VALUES ($1, $2) RETURNING id, code',
        [code, longUrl]
      );
      // Warm the cache immediately after write
      await redis.set(`url:${code}`, longUrl, CACHE_TTL);
      return { code: rows[0].code, shortUrl: `${process.env.BASE_URL}/${code}` };
    } catch (err) {
      if (err.code === '23505') { // unique_violation
        attempts++;
        continue;
      }
      throw err;
    }
  }
  throw new Error('Failed to generate unique code after 5 attempts');
}

/**
 * Resolve short code → long URL.
 * Cache-first: Redis → Postgres fallback.
 */
async function resolveCode(code) {
  // 1. Check cache
  const cached = await redis.get(`url:${code}`);
  if (cached) return cached;

  // 2. Cache miss — hit Postgres
  const { rows } = await pool.query(
    'SELECT long_url FROM urls WHERE code = $1',
    [code]
  );
  if (rows.length === 0) return null;

  // 3. Repopulate cache
  await redis.set(`url:${code}`, rows[0].long_url, CACHE_TTL);
  return rows[0].long_url;
}

/**
 * Record a click event (fire-and-forget — don't block the redirect).
 */
async function recordClick(code, ip, userAgent) {
  try {
    await pool.query(
      `INSERT INTO clicks (url_id, ip, user_agent)
       SELECT id, $2, $3 FROM urls WHERE code = $1`,
      [code, ip, userAgent]
    );
    // Also increment the Redis counter for fast stats reads
    await redis.incr(`clicks:${code}`);
  } catch (err) {
    console.error('Failed to record click:', err.message);
  }
}

/**
 * Get stats for a short code.
 */
async function getStats(code) {
  const { rows } = await pool.query(
    `SELECT u.code, u.long_url, u.created_at, COUNT(c.id) AS click_count
     FROM urls u
     LEFT JOIN clicks c ON c.url_id = u.id
     WHERE u.code = $1
     GROUP BY u.id`,
    [code]
  );
  return rows[0] || null;
}

export { createShortUrl, resolveCode, recordClick, getStats };