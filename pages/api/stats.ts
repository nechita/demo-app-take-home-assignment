import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../utils/redis'
import { logToRedis } from '../../utils/redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await logToRedis({
        action: 'api_stats_request',
        method: req.method,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    })
    const stats = await redis.get('search_stats')
    if (!stats) {
        res.status(404).json({ message: 'No stats available yet.' })
        return
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(stats)
}
