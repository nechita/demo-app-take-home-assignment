import * as React from 'react'
import { User } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface UserCardProps {
    user: User
    onClick?: () => void
    ref?: (node: HTMLDivElement | null) => void
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick, ref }) => {
    const initials = `${user.name.first[0]}${user.name.last[0]}`

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
        }
    }

    return (
        <Card
            ref={ref}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            className="group cursor-pointer transition-all hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
            <CardContent className="p-4">
                <div className="flex items-center space-x-4" data-testid="user-card-content">
                    <Avatar>
                        <AvatarImage
                            data-testid="avatar-image"
                            src={user.picture.medium}
                            alt={`${user.name.first} ${user.name.last}`}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-semibold leading-none group-hover:text-primary uppercase md:text-xl">
                            {user.name.first} {user.name.last}
                        </h3>
                        <h4 className="text-xs max-w-[180px] md:text-sm text-muted-foreground truncate md:max-w-[250px]">
                            {user.login.username}
                        </h4>
                        <p className="text-xs max-w-[180px] md:text-sm text-muted-foreground truncate md:max-w-[250px]">
                            {user.email}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
