import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const SEARCH_LOGS_KEY = 'search_logs'

export default redis

export async function logToRedis(details: Record<string, any> = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        ...details,
    }
    await redis.lpush(SEARCH_LOGS_KEY, JSON.stringify(entry))
}

export { SEARCH_LOGS_KEY }
