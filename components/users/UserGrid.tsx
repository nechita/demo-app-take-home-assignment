import { useState, useRef, useEffect, Suspense } from 'react'
import { User } from '@/types'
import { UserCard } from './UserCard'
import { UserModal } from './UserModal'
import { MAX_USERS, USERS_PER_PAGE } from '@/utils/constants'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UserGridProps {
    users: User[]
    loading: boolean
    hasMore: boolean
    onLoadMore: () => void
    error: { message: string; code?: string; status?: number } | null
    onRetry: () => void
    searchTerm?: string
    totalUsersLoaded: number
}

const LoadingSpinner = () => (
    <div className="mt-8 flex justify-center py-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
)

const ErrorDisplay = ({
    error,
    onRetry,
}: {
    error: { message: string; code?: string; status?: number }
    onRetry: () => void
}) => (
    <div className="mt-8 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error.message}</span>
        </div>
        <Button onClick={onRetry} variant="outline">
            Try Again
        </Button>
    </div>
)

const UserCounter = ({ count }: { count: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        }}
        className="fixed bottom-4 right-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg"
    >
        {count} users loaded
    </motion.div>
)

const UserList = ({ users, onUserSelect }: { users: User[]; onUserSelect: (user: User) => void }) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
            <UserCard key={`${user.name.first}-${user.name.last}`} user={user} onClick={() => onUserSelect(user)} />
        ))}
    </div>
)

export const UserGrid = ({
    users,
    loading,
    hasMore,
    onLoadMore,
    error,
    onRetry,
    searchTerm,
    totalUsersLoaded,
}: UserGridProps) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const observerRef = useRef<IntersectionObserver | undefined>(undefined)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    console.log('totalUsersLoaded', totalUsersLoaded)
    useEffect(() => {
        const currentElement = loadMoreRef.current

        if (currentElement) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    const firstEntry = entries[0]
                    if (firstEntry.isIntersecting && hasMore && !loading && users.length < MAX_USERS) {
                        onLoadMore()
                    }
                },
                {
                    root: null,
                    rootMargin: '100px',
                    threshold: 0.1,
                }
            )

            observerRef.current.observe(currentElement)
        }

        return () => {
            if (observerRef.current && currentElement) {
                observerRef.current.unobserve(currentElement)
            }
        }
    }, [hasMore, loading, onLoadMore, users.length])

    return (
        <>
            <Suspense fallback={<LoadingSpinner />}>
                <UserList users={users} onUserSelect={setSelectedUser} />
            </Suspense>

            {error && <ErrorDisplay error={error} onRetry={onRetry} />}

            {(loading || (hasMore && users.length < MAX_USERS)) && !error && (
                <div ref={loadMoreRef} className="mt-8 flex justify-center py-4">
                    <LoadingSpinner />
                </div>
            )}

            {!loading && !hasMore && !users.length && !error && (
                <div className="mt-8 text-center text-muted-foreground">No users found</div>
            )}

            {!loading && users.length >= MAX_USERS && (
                <div className="mt-8 text-center text-muted-foreground">End of users catalog.</div>
            )}

            <AnimatePresence mode="wait">
                {totalUsersLoaded > USERS_PER_PAGE && totalUsersLoaded < MAX_USERS && (
                    <UserCounter key="user-counter" count={totalUsersLoaded} />
                )}
            </AnimatePresence>

            {selectedUser && (
                <UserModal user={selectedUser} isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </>
    )
}
