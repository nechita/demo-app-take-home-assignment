import { useInfiniteQuery } from '@tanstack/react-query'
import { User } from '@/types'
import { fetchUsers } from '@/utils/api'
import { USERS_PER_PAGE, MAX_USERS } from '@/utils/constants'
import { useCallback, useRef, useMemo, useEffect } from 'react'

interface UseUsersProps {
    nationalities?: string[]
    searchTerm?: string
}

interface ErrorState {
    message: string
    code?: string
    status?: number
}

interface ApiError extends Error {
    code?: string
    status?: number
}

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 10 * 60 * 1000
const INITIAL_PAGE_PARAM = 1

export const useUsers = ({ nationalities, searchTerm }: UseUsersProps = {}) => {
    const abortControllerRef = useRef<AbortController | null>(null)

    // Normalize search term
    const normalizedSearchTerm = useMemo(() => {
        return searchTerm?.toLowerCase().trim() || ''
    }, [searchTerm])

    const hasActiveSearch = normalizedSearchTerm.length > 0

    // Cleanup abort controller on unmount
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort()
        }
    }, [])

    const queryFn = useCallback(
        async ({ pageParam = INITIAL_PAGE_PARAM }) => {
            // Abort previous request
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
                        code: (error as ApiError).code,
                        status: (error as ApiError).status,
                    }
                    throw apiError
                }
                throw error
            }
        },
        [nationalities]
    )

    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, error, refetch } = useInfiniteQuery({
        queryKey: ['users', { nationalities }], // Remove searchTerm from queryKey
        queryFn,
        getNextPageParam: (lastPage, allPages) => {
            const totalUsers = allPages.reduce((count, page) => count + page.results.length, 0)
            return totalUsers < MAX_USERS ? lastPage.info.page + 1 : undefined
        },
        initialPageParam: INITIAL_PAGE_PARAM,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
        enabled: !hasActiveSearch, // Disable query when searching
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

    // Pre-compute full names for efficient filtering
    const usersWithFullNames = useMemo(() => {
        return uniqueUsers.map((user) => ({
            ...user,
            fullName: `${user.name.first} ${user.name.last}`.toLowerCase(),
        }))
    }, [uniqueUsers])

    const filteredUsers = useMemo(() => {
        if (!normalizedSearchTerm) return uniqueUsers

        // Use pre-computed full names for faster filtering
        return usersWithFullNames
            .filter((user) => user.fullName.includes(normalizedSearchTerm))
            .map(({ fullName, ...user }) => user) // Remove fullName from result
    }, [usersWithFullNames, normalizedSearchTerm])

    // Determine if we can load more
    const canLoadMore = !!hasNextPage && !isFetchingNextPage

    // Load more function that only works when not searching
    const loadMore = useCallback(() => {
        if (canLoadMore) {
            fetchNextPage()
        }
    }, [canLoadMore, fetchNextPage])

    // Determine loading state
    const loading = hasActiveSearch ? false : isLoading

    return {
        users: filteredUsers,
        loading,
        error: error
            ? {
                  message: (error as ErrorState).message || 'An unknown error occurred',
                  code: (error as ErrorState).code,
                  status: (error as ErrorState).status,
              }
            : null,
        hasMore: canLoadMore,
        loadMore,
        retry: refetch,
        totalLoadedUsers,
        isSearching: hasActiveSearch,
        isFetchingNextPage: !hasActiveSearch && isFetchingNextPage,
    }
}
