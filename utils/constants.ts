export const API_URL = process.env.NEXT_PUBLIC_API_URL

// API_SEED is used to generate the same set of users for each request
export const API_SEED = process.env.NEXT_PUBLIC_API_SEED

export const USERS_PER_PAGE = 50
export const MAX_USERS = 1000
export const SEARCH_DEBOUNCE_MS = 300

export const LOCAL_STORAGE_NATIONALITIES_KEY = 'selectedNationalities'

export const NATIONALITIES = [
    { code: 'CH', name: 'Swiss' },
    { code: 'ES', name: 'Spanish' },
    { code: 'FR', name: 'French' },
    { code: 'GB', name: 'British' },
]
