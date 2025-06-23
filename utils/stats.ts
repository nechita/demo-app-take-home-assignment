export type TopQuery = { query: string; count: number; percent: number }
export type Stats = {
    topQueries: TopQuery[]
    avgTiming: number
    hourlyCounts: number[]
    mostPopularHour: number
}

export function computeStats(logs: { query: string; timestamp: string; duration: number }[]): Stats | null {
    if (!logs.length) return null

    const freq: Record<string, number> = {}
    logs.forEach((l) => {
        freq[l.query] = (freq[l.query] || 0) + 1
    })

    const total = logs.length
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
    const top5 = sorted.slice(0, 5)
    const othersCount = sorted.slice(5).reduce((sum, [, count]) => sum + count, 0)

    const topQueries = top5.map(([query, count]) => ({
        query,
        count,
        percent: +((count / total) * 100).toFixed(2),
    }))

    if (othersCount > 0) {
        topQueries.push({
            query: 'Others',
            count: othersCount,
            percent: +((othersCount / total) * 100).toFixed(2),
        })
    }

    const validLogs = logs.filter((l) => typeof l.duration === 'number' && l.duration > 0 && isFinite(l.duration))

    const avgTiming = validLogs.length
        ? +(validLogs.reduce((sum, l) => sum + l.duration, 0) / validLogs.length).toFixed(2)
        : 0

    const hourlyCounts: number[] = Array(24).fill(0)
    logs.forEach((l) => {
        const hour = new Date(l.timestamp).getHours()
        hourlyCounts[hour]++
    })

    let mostPopularHour = 0
    let maxCount = 0
    hourlyCounts.forEach((count, hour) => {
        if (count > maxCount) {
            maxCount = count
            mostPopularHour = hour
        }
    })

    return { topQueries, avgTiming, hourlyCounts, mostPopularHour }
}
