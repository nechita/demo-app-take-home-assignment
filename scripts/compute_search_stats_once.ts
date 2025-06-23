import Redis from 'ioredis'
import { computeStats } from '../utils/stats'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

async function main() {
    const rawLogs = await redis.lrange('search_logs', 0, -1)
    const logs = rawLogs
        .map((e) => {
            try {
                return JSON.parse(e)
            } catch {
                return null
            }
        })
        .filter(Boolean) as { query: string; timestamp: string; duration: number }[]
    const stats = computeStats(logs)
    if (stats) {
        await redis.set('search_stats', JSON.stringify({ ...stats, updatedAt: new Date().toISOString() }))
        console.log('Stats updated at', new Date().toISOString())
    } else {
        console.log('No logs to compute stats')
    }
    await redis.quit()
}

main()
