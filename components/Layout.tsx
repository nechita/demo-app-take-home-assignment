import { ReactNode } from 'react'
import { Header } from './Header'
import { cn } from '@/utils/tw-merge'

interface LayoutProps {
    children: ReactNode
    className?: string
}

function Footer() {
    return (
        <footer className="w-full py-4 mt-12 bg-white border-t text-center text-sm text-gray-500">
            {/* Footer content, no stats link */}
        </footer>
    )
}

export const Layout = ({ children, className }: LayoutProps) => {
    return (
        <div className={cn('relative min-h-screen bg-background', className)}>
            <Header />
            <main className="container max-w-screen-xl px-8 mx-auto py-4">{children}</main>
            <Footer />
        </div>
    )
}
