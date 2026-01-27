import Redis from 'ioredis';

// Redis 클라이언트 생성
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
});

// Pub/Sub용 별도 클라이언트 (subscribe 전용)
const redisSub = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

redis.on('error', (err) => console.error('Redis Client Error:', err));
redis.on('connect', () => console.log('Redis connected'));

redisSub.on('error', (err) => console.error('Redis Sub Client Error:', err));

export { redis, redisSub };
