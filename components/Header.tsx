import Link from 'next/link'
import { useRouter } from 'next/router'
import { Settings } from 'lucide-react'
import { routes } from '@/utils/routes'

export const Header = () => {
    const router = useRouter()
    const isSettingsPage = router.pathname === routes.settings

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-screen-xl px-8 mx-auto flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href={routes.home} className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">User Directory</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2">
                    <nav className="flex space-x-6 w-full items-end">
                        <div className="ml-auto flex items-center space-x-4">
                            <Link
                                href={routes.settings}
                                className={`hover:text-primary flex items-center space-x-2 ${
                                    isSettingsPage ? 'text-primary' : 'text-muted-foreground'
                                }`}
                                aria-label="Settings"
                            >
                                Settings
                                <Settings className="ml-2 size-5" />
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
