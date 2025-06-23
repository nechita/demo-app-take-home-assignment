module.exports = {
    apps: [
        {
            name: 'compute_search_stats',
            script: 'pnpm',
            args: 'exec tsx --tsconfig tsconfig.json scripts/compute_search_stats.ts',
            exec_mode: 'fork',
            cron_restart: '*/5 * * * *',
            autorestart: false,
            watch: false,
        },
    ],
}
