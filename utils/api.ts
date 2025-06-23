import { UsersResponse } from '@/types'
import { API_URL, API_SEED, USERS_PER_PAGE } from './constants'

class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

class NetworkError extends ApiError {
    constructor(message: string) {
        super(message, undefined, 'NETWORK_ERROR')
        this.name = 'NetworkError'
    }
}

class HttpError extends ApiError {
    constructor(status: number, statusText: string) {
        super(`HTTP ${status}: ${statusText}`, status, 'HTTP_ERROR')
        this.name = 'HttpError'
    }
}

if (!API_URL) {
    throw new ApiError('API_URL environment variable is not defined', undefined, 'CONFIG_ERROR')
}

if (!API_SEED) {
    throw new ApiError('API_SEED environment variable is not defined', undefined, 'CONFIG_ERROR')
}

const CACHE_SIZE_LIMIT = 100
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const cache = new Map<string, { data: UsersResponse; timestamp: number }>()
const inFlightRequests = new Map<string, Promise<UsersResponse>>()

const cleanupCache = () => {
    const now = Date.now()
    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            cache.delete(key)
        }
    }
}

const addToCache = (url: string, data: UsersResponse) => {
    if (cache.size >= CACHE_SIZE_LIMIT) {
        cleanupCache()
        if (cache.size >= CACHE_SIZE_LIMIT) {
            const oldestKey = cache.keys().next().value
            cache.delete(oldestKey)
        }
    }
    cache.set(url, { data, timestamp: Date.now() })
}

export const fetchUsers = async (
    page: number = 1,
    results: number = USERS_PER_PAGE,
    nationalities?: string[],
    signal?: AbortSignal
): Promise<UsersResponse> => {
    // Input validation
    if (page < 1 || !Number.isInteger(page)) {
        throw new ApiError('Invalid page number', undefined, 'INVALID_INPUT')
    }
    if (results < 1 || results > 100 || !Number.isInteger(results)) {
        throw new ApiError('Invalid results count', undefined, 'INVALID_INPUT')
    }
    if (nationalities && (!Array.isArray(nationalities) || nationalities.some((nat) => typeof nat !== 'string'))) {
        throw new ApiError('Invalid nationalities parameter', undefined, 'INVALID_INPUT')
    }

    const nat = nationalities?.length ? `&nat=${nationalities.join(',')}` : ''
    const url = `${API_URL}/?page=${page}&results=${results}&seed=${API_SEED}${nat}`

    const cached = cache.get(url)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data
    }

    if (inFlightRequests.has(url)) {
        return inFlightRequests.get(url)!
    }

    const promise = (async () => {
        try {
            const response = await fetch(url, {
                signal,
                headers: { Accept: 'application/json' },
            }).catch((error) => {
                throw new NetworkError(error.message)
            })

            if (!response.ok) {
                throw new HttpError(response.status, response.statusText)
            }

            const data = await response.json().catch(() => {
                throw new ApiError('Invalid JSON response', response.status, 'INVALID_JSON')
            })

            if (!data.results || !Array.isArray(data.results)) {
                throw new ApiError('Invalid response format', undefined, 'INVALID_FORMAT')
            }

            return data
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw error
            }
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError('Unknown error occurred', undefined, 'UNKNOWN_ERROR')
        } finally {
            inFlightRequests.delete(url)
        }
    })()

    inFlightRequests.set(url, promise)

    promise
        .then((data) => {
            if (!signal?.aborted) {
                addToCache(url, data)
            }
        })
        .catch(() => {
            cache.delete(url)
        })

    return promise
}
