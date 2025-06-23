import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '@/utils/redis'
import { computeStats } from '@/utils/stats'

interface SearchLog {
    query: string
    timestamp: string
    duration: number
}

const isValidSearchLog = (obj: unknown): obj is SearchLog => {
    const searchLog = obj as Record<string, unknown>
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof searchLog.query === 'string' &&
        typeof searchLog.timestamp === 'string' &&
        typeof searchLog.duration === 'number' &&
        !isNaN(searchLog.duration as number) &&
        isFinite(searchLog.duration as number)
    )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.status(405).json({ message: 'Method Not Allowed' })
        return
    }

    try {
        const rawLogs = await redis.lrange('search_logs', 0, -1)
        const logs: SearchLog[] = []

        for (const rawLog of rawLogs) {
            try {
                const parsed = JSON.parse(rawLog)
                if (isValidSearchLog(parsed)) {
                    logs.push(parsed)
                } else {
                    console.warn('Invalid log entry structure:', parsed)
                }
            } catch (parseError) {
                console.error('Failed to parse log entry:', rawLog, parseError)
            }
        }

        const stats = computeStats(logs)
        if (stats) {
            await redis.set('search_stats', JSON.stringify({ ...stats, updatedAt: new Date().toISOString() }))
            res.status(200).json({ message: 'Stats recomputed', stats })
        } else {
            res.status(200).json({ message: 'No logs to compute stats', stats: null })
        }
    } catch (error) {
        console.error('Error in recompute handler:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
