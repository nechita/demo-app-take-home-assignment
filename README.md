# FE / Fullstack Engineer Take Home Assignment

A Next.js application that displays a grid of users with infinite scrolling, search functionality, and nationality
filtering.

## Tech Stack

### Core

- Next.js v14 (Pages Router)
- TypeScript v5.5
- React v18
- Tanstack Query

### UI & Styling

- TailwindCSS
- Lucide Icons
- Poppins font
- Shadcn UI Component Library

### Testing

- Jest
- React Testing Library

## Getting Started

### Prerequisites

1. Install Node.js (v20.11.1 LTS or later) from [nodejs.org](https://nodejs.org/)

    - I recommend using [nvm](https://github.com/nvm-sh/nvm) or if you want something more sophisticated you can use
      [asdf](https://asdf-vm.com/)

2. Install pnpm:

    ```bash
    # Using npm
    npm install -g pnpm

    # Using homebrew (macOS)
    brew install pnpm

    # Using winget (Windows)
    winget install pnpm
    ```

### Setup

1. Clone the repository:

    ```bash
    git clone [repository-url]
    cd demo-app-take-home-assignment
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

    Note: While you can use npm or Yarn, we recommend pnpm for consistent dependency management. If you decide, just
    make sure you delete the `pnpm-lock.yaml` and use your preffered package manager.

3. Set up environment variables:

    ```bash
    cp .env.example.local .env.local
    ```

    Update `NEXT_PUBLIC_API_SEED` in `.env.local` with your desired seed value.

4. Start the development server:
    ```bash
    pnpm dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks

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
