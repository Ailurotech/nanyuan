import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

interface RateLimitOptions {
  key: string;
  windowInSeconds: number;
  maxRequests: number;
}

export async function rateLimitRedis({
  key,
  windowInSeconds,
  maxRequests,
}: RateLimitOptions) {
  const redisKey = `ratelimit:${key}`;
  const current = await redis.incr(redisKey);

  if (current === 1) {
    await redis.expire(redisKey, windowInSeconds);
  }

  if (current > maxRequests) {
    return { limited: true, remaining: 0 };
  }

  return { limited: false, remaining: maxRequests - current };
}
