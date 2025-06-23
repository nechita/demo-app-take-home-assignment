import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '@/components/Layout'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    display: 'swap',
    weight: ['400', '500', '600', '700'],
    style: ['normal', 'italic'],
    preload: true,
})

const STALE_TIME = 300000
const RETRY_DELAY = 300000

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIME,
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, RETRY_DELAY),
        },
    },
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <Layout className={poppins.className}>
                <Component {...pageProps} />
            </Layout>
        </QueryClientProvider>
    )
}
