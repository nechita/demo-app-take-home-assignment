import type { NextApiRequest, NextApiResponse } from 'next'
import { logToRedis } from '../../utils/redis'

interface LogSearchRequest {
    query: string
    duration: number
}

const isValidLogSearchRequest = (body: unknown): body is LogSearchRequest => {
    const obj = body as Record<string, unknown>
    return (
        typeof body === 'object' &&
        body !== null &&
        typeof obj.query === 'string' &&
        obj.query.trim().length > 0 &&
        obj.query.length <= 1000 && // Prevent extremely long queries
        typeof obj.duration === 'number' &&
        !isNaN(obj.duration as number) &&
        isFinite(obj.duration as number) &&
        obj.duration >= 0 &&
        obj.duration <= 30000 // Max 30 seconds
    )
}

const sanitizeQuery = (query: string): string => {
    return query.trim().slice(0, 1000) // Limit length
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method Not Allowed' })
        return
    }

    try {
        if (!isValidLogSearchRequest(req.body)) {
            res.status(400).json({
                message: 'Invalid request body. Expected: { query: string, duration: number }',
            })
            return
        }

        const { query, duration } = req.body
        const sanitizedQuery = sanitizeQuery(query)

        await logToRedis({
            query: sanitizedQuery,
            duration: Math.round(duration), // Ensure integer
        })

        res.status(200).json({ message: 'Logged' })
    } catch (error) {
        console.error('Error in log_search handler:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
