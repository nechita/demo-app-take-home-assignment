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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // (5 minutes)
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
