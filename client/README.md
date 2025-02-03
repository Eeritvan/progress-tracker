[![client pipeline](https://github.com/Eeritvan/tracker/actions/workflows/client.yml/badge.svg)](https://github.com/Eeritvan/tracker/actions/workflows/client.yml)

## Prerequisites
- Node.js 18+
- [Environment variables](#env-variables) set in .env file

## Installation
> \* check for env variables below \
> \** You can use any package manager such as NPM instead of Bun
### Development
```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```
The app will be available at http://localhost:5173


### Building / Production
```bash
# Install dependencies
bun install 

# Run linting
bun run lint

# Run unit-tests
bun run test

# Build for production
bun run build

# Running production build
bun run start
```

The app will be available at http://localhost:4173 \
Production build will be in dist/ directory.

## Env variables
Create a .env file with:
- VITE_USERS_SVC=http://localhost:8080/query
- VITE_DATA_SVC=http://localhost:8081/query

## Tech Stack
- React 18
- Vite 6
- TailwindCSS
- React Query
- GraphQL
- React Hook Form
- Zustand
