import app from './src/app.js'
import { client as redisClient } from './src/services/redis.service.js';
import pool from './src/db/pool.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  await redisClient.connect();
  await pool.query('SELECT 1');
  console.log('DB and Redis connected');

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // ── Graceful shutdown ──────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`${signal} received — shutting down`);
    server.close(async () => {
      await pool.end();
      await redisClient.quit();
      console.log('Connections closed. Bye.');
      process.exit(0);
    });
    // Force exit if cleanup takes too long
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});