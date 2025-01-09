import Head from 'next/head'
import { NationalityFilter } from '@/components/settings/NationalityFilter'
import { useNationalities } from '@/hooks/useNationalities'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { routes } from '@/utils/routes'
export default function Settings() {
    const { selectedNationalities, toggleNationality } = useNationalities()

    return (
        <>
            <Head>
                <title>Settings - User Directory</title>
                <meta name="description" content="Configure user directory settings" />
            </Head>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href={routes.home}
                        className="text-muted-foreground hover:text-primary flex gap-2 items-center text-sm hover:underline"
                    >
                        <ArrowLeft className="size-4" />
                        Back to user directory
                    </Link>
                </div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Configure your user directory preferences. You can change your settings at any time.
                </p>
            </div>

            <div className="mb-4">
                <NationalityFilter selectedNationalities={selectedNationalities} onToggle={toggleNationality} />
            </div>
        </>
    )
}
