# FE / Fullstack Engineer Take Home Assignment

A Next.js application that displays a grid of users, search functionality, nationality filtering, and a stats dashboard.

## Tech Stack

### Core

- Next.js v14.1.4 (Pages Router)
- TypeScript v5.3.3
- React v18.3.1
- Tanstack Query v5.63.0

### UI & Styling

- TailwindCSS v3.4.17
- Lucide Icons v0.469.0
- Shadcn UI Component Library
- Framer Motion v11.17.0

### Testing

- Jest v29.7.0
- React Testing Library v16.1.0

## Getting Started

### Prerequisites

1. Install Node.js (v20.0.0 or later) from [nodejs.org](https://nodejs.org/)

    - I recommend using [nvm](https://github.com/nvm-sh/nvm) or if you want something more sophisticated you can use
      [asdf](https://asdf-vm.com/)

2. Install pnpm (v9.0.0 or later):

    ```bash
    # Using npm
    npm install -g pnpm
    ```

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/nechita/demo-app-take-home-assignment.git
    cd demo-app-take-home-assignment
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

    Note: While you can use npm or Yarn, I recommend pnpm for consistent dependency management. If you decide, just make
    sure you delete the `pnpm-lock.yaml` and use your preferred package manager.

3. Set up environment variables:

    ```bash
    cp .env.example.local .env.local
    ```

    Update `NEXT_PUBLIC_API_SEED` in `.env.local` with your desired seed value or just leave it as is.

4. Start the development server:

    ```bash
    pnpm dev
    ```

    The app will be available at [http://localhost:3000](http://localhost:3000)

    If you want to boot the app on another port, you can do so by running:

    ```bash
    pnpm dev --port 3001
    ```

## Docker

### Development Mode (Watch Mode)

Run the full stack with hot reloading:

```bash
pnpm docker:dev
```

This starts:

- Next.js dev server with hot reloading
- Redis for caching and stats
- Stats worker for background processing

### Production Mode (Build Mode)

Run the full stack in production mode:

```bash
pnpm docker:prod
```

This builds and runs the optimized production version.

### Management

Stop all containers:

```bash
pnpm docker:down
```

### Notes

- The `stats-worker` service runs a background job that recomputes search statistics every 5 minutes and stores them in
  Redis
- Redis data is persisted in the `redis-data` Docker volume
- Development mode includes volume mounts for live code changes
- Production mode runs the built application without volume mounts

## Development Workflow

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Run ESLint
- `pnpm check-types` - Run TypeScript checks
- `pnpm prettier` - Format code with Prettier
- `pnpm docker:dev` - Start Docker development mode
- `pnpm docker:prod` - Start Docker production mode
- `pnpm docker:down` - Stop Docker containers

### Pre-commit Hooks

The project uses Husky and lint-staged to run the following checks before each commit:

- Prettier formatting
- ESLint
- TypeScript type checking
- Jest tests (only for changed files)

## Project Structure

```
├── components/         # React components
│   ├── layout/         # Layout components
│   ├── users/          # User-related components
│   └── settings/       # Settings components
├── hooks/              # Custom React hooks
├── pages/              # Next.js pages
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Features + Tech Stack Details

- Infinite scrolling grid of users
- Real-time search functionality
- Nationality filtering with persistence
- Responsive design
- Comprehensive test coverage
- Pre-commit hooks for linting and testing
- Tanstack Query for data fetching
- Framer Motion for animations
- Shadcn UI for UI components
- Lucide Icons for icons
- TailwindCSS for styling

## API

The application uses the [Random User Generator API](https://randomuser.me/) to fetch user data. The seed value ensures
consistent data between sessions.

## Testing & Stats

To simulate search activity and test the statistics system:

1. **Generate test search logs:**

    ```bash
    pnpm exec tsx scripts/generate_search_logs.ts
    ```

    This will add 1000 random search logs to Redis.

2. **Compute stats immediately (one-off):**

    ```bash
    pnpm exec tsx scripts/compute_search_stats_once.ts
    ```

    This will process all logs and store the latest stats in Redis at the `search_stats` key.

3. **View stats:**

    - Visit [http://localhost:3000/api/stats](http://localhost:3000/api/stats) in your browser or use curl/Postman to
      see the current statistics.

4. **Background stats computation:**
    - The `stats-worker` service in Docker Compose runs the stats computation every 5 minutes automatically. Use the
      one-off script for immediate updates during development/testing.

If `/api/stats` returns "No stats available yet.", make sure you have generated logs and computed stats as above.

## Stats Dashboard

- View a live dashboard of search statistics at [/stats](http://localhost:3000/stats).
- The dashboard includes interactive charts for top queries, hourly search volume, and request timing.
- Accessible from the main navigation header.
- Click to recompute stats option is available in the stats screen.

## One-Command Docker Startup

To run the entire stack (app, Redis, stats-worker) with hot reload and local env support:

```bash
pnpm docker:dev
```

This is equivalent to `docker compose up --build` but with proper environment variables set:

- `NODE_ENV=development`
- `COMMAND="pnpm dev"`

- The app will be available at [http://localhost:3000](http://localhost:3000)
- All services (app, Redis, stats-worker) start together
- Uses your local `.env.local` if present
- Hot-reloads code changes via Docker volumes

## Background Worker Troubleshooting

To verify the stats-worker is running and updating stats:

1. **Check logs:**

    ```bash
    docker compose logs -f stats-worker
    ```

    You should see lines like: `Stats updated at 2025-06-23T13:02:30.635Z` every 5 minutes.

2. **Check the /api/stats endpoint:**

    - Visit [http://localhost:3000/api/stats](http://localhost:3000/api/stats)
    - The `updatedAt` field should change every 5 minutes if the worker is running.

3. **Modify data and see if stats update:**

    - Generate new logs: `pnpm exec tsx scripts/generate_search_logs.ts`
    - Wait 5 minutes, then check `/api/stats` again. Stats should reflect the new data.

4. **Check container status:**
    ```bash
    docker compose ps
    ```
    The `stats-worker` service should be listed as "Up".

If you want to test faster, temporarily change the interval in `scripts/compute_search_stats.ts` to a shorter value
(e.g., 30 seconds).
