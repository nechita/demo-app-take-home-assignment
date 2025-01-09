import { useInfiniteQuery } from '@tanstack/react-query'
import { User } from '@/types'
import { fetchUsers } from '@/utils/api'
import { USERS_PER_PAGE, MAX_USERS } from '@/utils/constants'
import { useCallback, useRef, useMemo } from 'react'

interface UseUsersProps {
    nationalities?: string[]
    searchTerm?: string
}

interface ErrorState {
    message: string
    code?: string
    status?: number
}

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 10 * 60 * 1000
const INITIAL_PAGE_PARAM = 1

export const useUsers = ({ nationalities, searchTerm }: UseUsersProps = {}) => {
    const abortControllerRef = useRef<AbortController | null>(null)

    const queryFn = useCallback(
        async ({ pageParam = INITIAL_PAGE_PARAM }) => {
            abortControllerRef.current?.abort()
            abortControllerRef.current = new AbortController()

            try {
                return await fetchUsers(pageParam, USERS_PER_PAGE, nationalities, abortControllerRef.current.signal)
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return { results: [], info: { page: pageParam, results: 0, seed: '', version: '' } }
                }
                if (error instanceof Error) {
                    const apiError: ErrorState = {
                        message: error.message,
                        code: (error as any).code,
                        status: (error as any).status,
                    }
                    throw apiError
                }
                throw error
            }
        },
        [nationalities]
    )

    const { data, fetchNextPage, hasNextPage, isLoading, error, refetch } = useInfiniteQuery({
        queryKey: ['users', { nationalities, searchTerm }],
        queryFn,
        getNextPageParam: (lastPage, allPages) => {
            const totalUsers = allPages.reduce((count, page) => count + page.results.length, 0)
            return totalUsers < MAX_USERS ? lastPage.info.page + 1 : undefined
        },
        initialPageParam: INITIAL_PAGE_PARAM,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
    })

    const { uniqueUsers, totalLoadedUsers } = useMemo(() => {
        if (!data?.pages) return { uniqueUsers: [], totalLoadedUsers: 0 }

        const userMap = new Map<string, User>()

        data.pages.forEach((page) => {
            page.results.forEach((user) => {
                if (!userMap.has(user.id)) {
                    userMap.set(user.id, user)
                }
            })
        })

        const unique = Array.from(userMap.values())
        return {
            uniqueUsers: unique,
            totalLoadedUsers: unique.length,
        }
    }, [data?.pages])

    const filteredUsers = useMemo(() => {
        const normalizedSearchTerm = searchTerm?.toLowerCase().trim() || ''
        if (!normalizedSearchTerm) return uniqueUsers

        return uniqueUsers.filter((user) => {
            const fullName = `${user.name.first} ${user.name.last}`.toLowerCase()
            return fullName.includes(normalizedSearchTerm)
        })
    }, [uniqueUsers, searchTerm])

    return {
        users: filteredUsers,
        loading: isLoading,
        error: error
            ? {
                  message: (error as ErrorState).message || 'An unknown error occurred',
                  code: (error as ErrorState).code,
                  status: (error as ErrorState).status,
              }
            : null,
        hasMore: !!hasNextPage,
        loadMore: () => fetchNextPage(),
        retry: refetch,
        totalLoadedUsers,
    }
}
