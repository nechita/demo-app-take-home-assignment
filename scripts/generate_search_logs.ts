import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const queries = [
    'alice',
    'bob',
    'charlie',
    'david',
    'eve',
    'frank',
    'grace',
    'heidi',
    'ivan',
    'judy',
    'mallory',
    'oscar',
    'peggy',
    'trent',
    'victor',
    'walter',
    'zara',
    'nina',
    'oliver',
    'paul',
]

const SEARCHES_PER_DAY = 1000
const MS_PER_DAY = 24 * 60 * 60 * 1000
const now = Date.now()
const startOfDay = now - (now % MS_PER_DAY)

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
    for (let i = 0; i < SEARCHES_PER_DAY; i++) {
        const query = queries[randomInt(0, queries.length - 1)]
        const duration = randomInt(50, 2000) // ms
        const offset = randomInt(0, MS_PER_DAY - 1)
        const timestamp = new Date(startOfDay + offset).toISOString()
        const entry = JSON.stringify({ query, timestamp, duration })
        await redis.lpush('search_logs', entry)
    }
    await redis.quit()
    console.log('Generated', SEARCHES_PER_DAY, 'search logs')
}

main()
