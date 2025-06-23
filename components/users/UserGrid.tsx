import { Button } from '@/components/ui/button'
import { User } from '@/types'
import { MAX_USERS, USERS_PER_PAGE } from '@/utils/constants'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Suspense, useState } from 'react'
import { UserCard } from './UserCard'
import { UserModal } from './UserModal'

interface UserGridProps {
    users: User[]
    loading: boolean
    hasMore: boolean
    onLoadMore: () => void
    error: { message: string; code?: string; status?: number } | null
    onRetry: () => void
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
export const UserGrid = ({ users, loading, hasMore, onLoadMore, error, onRetry, totalUsersLoaded }: UserGridProps) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    return (
        <>
            <Suspense fallback={<LoadingSpinner />}>
                <UserList users={users} onUserSelect={setSelectedUser} />
            </Suspense>

            {error && <ErrorDisplay error={error} onRetry={onRetry} />}

            {loading && !users.length && <LoadingSpinner />}

            {hasMore && totalUsersLoaded < MAX_USERS && !error && (
                <div className="mt-8 flex justify-center py-4">
                    <Button onClick={onLoadMore} disabled={loading}>
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Loading...
                            </div>
                        ) : (
                            'Load more users'
                        )}
                    </Button>
                </div>
            )}

            {!loading && !hasMore && !users.length && !error && (
                <div className="mt-8 text-center text-muted-foreground">No users found</div>
            )}

            {!loading && totalUsersLoaded >= MAX_USERS && (
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
