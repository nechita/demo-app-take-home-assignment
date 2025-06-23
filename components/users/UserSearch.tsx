import { ChangeEvent, useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'

import { SEARCH_DEBOUNCE_MS } from '@/utils/constants'
import { cn } from '@/utils/tw-merge'
import { routes } from '@/utils/routes'

import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
)

interface SearchResultsProps {
    searchTerm: string
    filteredCount: number
    totalUsers: number
    nationalities: string[]
}

const SearchResults = ({ searchTerm, filteredCount, totalUsers, nationalities }: SearchResultsProps) => {
    return (
        <>
            {nationalities.length > 0 && (
                <div className="text-sm text-muted-foreground text-center">
                    Showing people from{' '}
                    {nationalities.length === 1 ? 'one nationality' : `${nationalities.length} nationalities`} (
                    {nationalities.join(', ')}).{' '}
                    <Link className={cn(buttonVariants({ variant: 'link' }), 'px-0')} href={routes.settings}>
                        Change your settings
                    </Link>
                </div>
            )}
            {searchTerm && (
                <>
                    <div className="text-xs text-muted-foreground text-center">
                        Showing filtered results. Clear your selection and load more users if you want to refine your
                        search while in <span className="font-medium text-primary">search mode</span>.
                    </div>
                    <div className="space-y-1 text-center">
                        <span className="text-sm font-medium">
                            Found {filteredCount} {filteredCount === 1 ? 'user' : 'users'} out of {totalUsers} loaded
                        </span>
                    </div>
                </>
            )}
        </>
    )
}

interface UserSearchProps {
    onSearch: (term: string) => void
    nationalities: string[]
    totalUsers: number
    filteredCount: number
}

export const UserSearch = ({ onSearch, nationalities, totalUsers, filteredCount }: UserSearchProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [mounted, setMounted] = useState(false)
    const [searchStart, setSearchStart] = useState<number | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (searchTerm) {
            setSearchStart(Date.now())
        } else {
            setSearchStart(null)
        }
    }, [searchTerm])

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm)
            if (searchTerm && searchStart) {
                const duration = Date.now() - searchStart
                fetch('/api/log_search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: searchTerm, duration }),
                }).catch((error) => {
                    console.error('Failed to log search:', error)
                })
            }
        }, SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [searchTerm, onSearch, searchStart])

    return (
        <div className="sticky top-[3.5rem] z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-8"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {mounted ? (
                    <SearchResults
                        searchTerm={searchTerm}
                        filteredCount={filteredCount}
                        totalUsers={totalUsers}
                        nationalities={nationalities}
                    />
                ) : (
                    <LoadingSpinner />
                )}
            </div>
        </div>
    )
}
