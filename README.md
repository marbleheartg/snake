# Mini App Template

A production-ready template for building Farcaster Mini Apps with Next.js 16, React 19, and Tailwind CSS v4.

## Features

- Next.js 16 with App Router and SPA shell
- React 19 with React Router
- Tailwind CSS v4
- Farcaster Mini App SDK integration
- TypeScript
- Bun support

## Quick Start

```bash
# Install dependencies
bun install

# Set environment variables
echo "NEXT_PUBLIC_HOST=TUNNEL_LINK" > .env.local

# Run development server
bun run dev
```

## Environment Variables

- `NEXT_PUBLIC_HOST` (required): Your app's origin (e.g., `http://localhost:3000`)

## Scripts

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Project Structure

```
app/
  api/          # API routes
  frontend/     # Client-side SPA
  lib/          # Utilities and config
  shell/        # SPA shell page
```

## License

MIT
