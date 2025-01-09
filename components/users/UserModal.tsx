import { User } from '@/types'
import { MapPin, Mail, Flag, PhoneCallIcon, Phone, Smartphone } from 'lucide-react'
import { NATIONALITIES } from '@/utils/constants'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'
import { LucideIcon } from 'lucide-react'
import { X } from 'lucide-react'
interface ContactItemProps {
    icon: LucideIcon
    href?: string
    children: React.ReactNode
}

const ContactItem = ({ icon: Icon, href, children }: ContactItemProps) => (
    <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        {href ? (
            <Button variant="link" asChild className="h-auto p-0">
                <a href={href}>{children}</a>
            </Button>
        ) : (
            <p className="text-sm">{children}</p>
        )}
    </div>
)

interface UserModalProps {
    user: User
    isOpen: boolean
    onClose: () => void
}

export const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose }) => {
    const lastFocusedElement = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (isOpen) {
            lastFocusedElement.current = document.activeElement as HTMLElement
        } else if (lastFocusedElement.current) {
            lastFocusedElement.current.focus()
        }
    }, [isOpen])

    const nationality = NATIONALITIES.find((n) => n.code === user.nat)?.name
    const initials = `${user.name.first[0]}${user.name.last[0]}`

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
                <div>
                    <div className="flex flex-col items-center">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={user.picture.large} alt={`${user.name.first} ${user.name.last}`} />
                            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                        </Avatar>
                        <DialogTitle className="mt-4 flex flex-col items-center space-y-2 text-lg font-semibold leading-none tracking-tight">
                            <span className="text-2xl font-bold uppercase">
                                {user.name.first} {user.name.last}
                            </span>
                            <span className="text-muted-foreground text-sm"> ({user.login.username})</span>
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            User details for {user.name.first} {user.name.last}
                        </DialogDescription>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    {user.email && (
                        <ContactItem icon={Mail} href={`mailto:${user.email}`}>
                            {user.email}
                        </ContactItem>
                    )}

                    {user.cell && (
                        <ContactItem icon={Smartphone} href={`tel:${user.cell}`}>
                            {user.cell} (personal)
                        </ContactItem>
                    )}

                    {user.phone && (
                        <ContactItem icon={Phone} href={`tel:${user.phone}`}>
                            {user.phone} (work)
                        </ContactItem>
                    )}

                    {user.location.street && (
                        <ContactItem icon={MapPin}>
                            {user.location.street.number} {user.location.street.name}, {user.location.city},{' '}
                            {user.location.country} (Postcode: {user.location.postcode})
                        </ContactItem>
                    )}

                    {nationality && <ContactItem icon={Flag}>{nationality}</ContactItem>}
                </div>
            </DialogContent>
        </Dialog>
    )
}
