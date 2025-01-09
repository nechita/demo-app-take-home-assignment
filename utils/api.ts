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

const cache = new Map<string, Promise<UsersResponse>>()
const inFlightRequests = new Map<string, Promise<UsersResponse>>()

export const fetchUsers = async (
    page: number = 1,
    results: number = USERS_PER_PAGE,
    nationalities?: string[],
    signal?: AbortSignal
): Promise<UsersResponse> => {
    const nat = nationalities?.length ? `&nat=${nationalities.join(',')}` : ''
    const url = `${API_URL}/?page=${page}&results=${results}&seed=${API_SEED}${nat}`

    if (cache.has(url)) {
        return cache.get(url)!
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
                cache.set(url, Promise.resolve(data))
                setTimeout(() => cache.delete(url), 5 * 60 * 1000)
            }
        })
        .catch(() => {
            cache.delete(url)
        })

    return promise
}
