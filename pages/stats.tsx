import { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
    Label,
} from 'recharts'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#bdbdbd']
const OTHERS_COLOR = '#bdbdbd'
const POPULAR_HOUR_COLOR = '#ff4d4f'

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
)

type TopQuery = { query: string; count: number; percent: number }
type Stats = {
    topQueries: TopQuery[]
    avgTiming: number
    hourlyCounts: number[]
    mostPopularHour: number
    updatedAt: string
}
type HourlyDatum = { hour: number; count: number }

export default function StatsPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [recomputing, setRecomputing] = useState(false)
    const [recomputeError, setRecomputeError] = useState('')

    useEffect(() => {
        fetch('/api/stats')
            .then((r) => {
                if (!r.ok) throw new Error('No stats available')
                return r.json()
            })
            .then((data: Stats) => setStats(data))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    const handleRecompute = async () => {
        setRecomputing(true)
        setRecomputeError('')
        try {
            const res = await fetch('/api/recompute', { method: 'POST' })
            if (!res.ok) throw new Error('Failed to recompute stats')
            const data = await res.json()
            if (data.stats) setStats((s) => ({ ...s, ...data.stats, updatedAt: new Date().toISOString() }))
        } catch (e: unknown) {
            setRecomputeError(e instanceof Error ? e.message : 'Unknown error occurred')
        } finally {
            setRecomputing(false)
        }
    }

    if (loading) return <LoadingSpinner />
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>
    if (!stats) return null

    const hourlyData: HourlyDatum[] = stats.hourlyCounts?.map((count, hour) => ({ hour, count })) || []

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm mb-8">
                <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-start">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">Search Statistics</h1>
                    <div className="text-sm text-gray-500 mb-0">
                        Last updated: {new Date(stats.updatedAt).toLocaleString()}
                    </div>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        onClick={handleRecompute}
                        disabled={recomputing}
                    >
                        {recomputing ? 'Recomputing...' : 'Recompute Stats'}
                    </button>
                    {recomputeError && <div className="text-red-500 mt-2">{recomputeError}</div>}
                </div>
            </header>
            <main className="max-w-4xl mx-auto px-4 pb-12">
                <div className="flex flex-col gap-8">
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Top 5 Queries</h2>
                        <div className="flex-1 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={stats.topQueries}
                                        dataKey="percent"
                                        nameKey="query"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label={false}
                                    >
                                        {stats.topQueries.map((q) => (
                                            <Cell
                                                key={q.query}
                                                fill={
                                                    q.query === 'Others'
                                                        ? OTHERS_COLOR
                                                        : COLORS[stats.topQueries.indexOf(q) % COLORS.length]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [`${value}%`, 'Percent']} />
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                        wrapperStyle={{ fontSize: 16 }}
                                        formatter={(value: string) => <span style={{ fontWeight: 500 }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Hourly Search Volume</h2>
                        <div
                            className="flex-1 flex items-center justify-center overflow-x-auto"
                            style={{ minWidth: 0 }}
                        >
                            <div className="w-full" style={{ minWidth: 700 }}>
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="hour"
                                            tickFormatter={(h: number) => `${h}:00`}
                                            interval={1}
                                            angle={-30}
                                            textAnchor="end"
                                            height={50}
                                        >
                                            <Label value="Hour of Day" offset={-10} position="insideBottom" />
                                        </XAxis>
                                        <YAxis allowDecimals={false}>
                                            <Label
                                                value="Searches"
                                                angle={-90}
                                                position="insideLeft"
                                                style={{ textAnchor: 'middle' }}
                                            />
                                        </YAxis>
                                        <Tooltip formatter={(value: number) => [value, 'Searches']} />
                                        <Bar dataKey="count">
                                            {hourlyData.map((entry, idx) => (
                                                <Cell
                                                    key={idx}
                                                    fill={
                                                        entry.hour === stats.mostPopularHour
                                                            ? POPULAR_HOUR_COLOR
                                                            : '#8884d8'
                                                    }
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="text-center mt-2">
                            Most popular hour:{' '}
                            <strong style={{ color: POPULAR_HOUR_COLOR }}>{stats.mostPopularHour}:00</strong>
                        </div>
                        <div className="block md:hidden text-xs text-gray-400 text-center mt-1">
                            Scroll horizontally to see all hours
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">Average Request Timing</h2>
                        <div className="text-4xl font-mono text-blue-700 mb-2">{stats.avgTiming} ms</div>
                    </div>
                </div>
            </main>
        </div>
    )
}
