import app from './src/app'
import { client as redisClient } from './src/services/redis.service'
import pool from './src/db/pool'

const PORT = process.env.PORT || 3000;

async function start() {
    await redisClient.connect();
    await pool.query('SELECT 1');      
    console.log('Connected to Redis and Postgres');  

    app.listen(PORT, () => {
        console.log(`Server running on  http://localhost:${PORT}`);
    });
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});