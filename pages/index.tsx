import { useState } from 'react'
import Head from 'next/head'
import { UserGrid } from '@/components/users/UserGrid'
import { UserSearch } from '@/components/users/UserSearch'
import { useUsers } from '@/hooks/useUsers'
import { useNationalities } from '@/hooks/useNationalities'

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('')
    const { selectedNationalities } = useNationalities()
    const { users, loading, error, hasMore, loadMore, retry, totalLoadedUsers } = useUsers({
        nationalities: selectedNationalities,
        searchTerm,
    })

    return (
        <>
            <Head>
                <title>User Directory</title>
                <meta name="description" content="Browse and search users" />
            </Head>

            <div className="space-y-6">
                <UserSearch
                    onSearch={setSearchTerm}
                    nationalities={selectedNationalities}
                    totalUsers={totalLoadedUsers}
                    filteredCount={users.length}
                />

                <div className="mx-auto w-full max-w-screen-xl px-4">
                    <UserGrid
                        users={users}
                        totalUsersLoaded={totalLoadedUsers}
                        loading={loading}
                        hasMore={hasMore}
                        onLoadMore={loadMore}
                        error={error}
                        onRetry={retry}
                    />
                </div>
            </div>
        </>
    )
}
