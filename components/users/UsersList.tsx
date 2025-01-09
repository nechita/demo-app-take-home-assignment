import { User } from '@/types'
import { UserCard } from '@/components/users/UserCard'

interface UsersListProps {
    users: User[]
}

export const UsersList = ({ users }: UsersListProps) => {
    return (
        <>
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </>
    )
}
