import Redis from 'ioredis'

const client = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    lazyConnect:true,
    enableOfflineQueue:false,
})


client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

const get = (key) => client.get(key);

const set = (key, value, ttlSeconds) =>
  client.set(key, value, 'EX', ttlSeconds);

const incr = (key) => client.incr(key);

export  {
    client,
    get,
    set,
    incr
};