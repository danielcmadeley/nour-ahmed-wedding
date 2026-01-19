# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a wedding image gallery application built with TanStack Start (React-based full-stack framework) and UploadThing for file uploads. The app allows users to upload, view, and delete wedding photos with a modern UI featuring light/dark theme support.

## Development Commands

```bash
# Install dependencies (use Bun, not npm/pnpm/yarn)
bun install

# Run development server (port 3000)
bun run dev

# Build for production
bun run build

# Start production server
bun start

# Format and lint code
bunx @biomejs/biome check --write .
```

## Runtime & Build Tools

**IMPORTANT**: This project uses Bun as the JavaScript runtime. Always use `bun` commands instead of `node`, `npm`, `pnpm`, or `yarn`.

- **Runtime**: Bun (not Node.js)
- **Package manager**: Bun (not npm/pnpm/yarn)
- **Build tool**: Vite v7.3.1
- **Linter/Formatter**: Biome (configured for tabs, double quotes, organize imports)

## Technology Stack Constraints

**Only use libraries already listed in package.json**. Do not suggest or add new dependencies without explicit user approval. Key technologies:

- **Framework**: TanStack Start v1.149.4 with TanStack Router v1.149.3
- **React**: v19.2.3
- **UI Components**: Radix UI primitives with shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4.1.18
- **Forms**: react-hook-form v7.71.1 with Zod v4.3.5 validation
- **File Uploads**: UploadThing v7.7.4 with @uploadthing/react v7.3.3
- **State Management**: TanStack Query v5.90.17
- **Icons**: lucide-react v0.562.0
- **Notifications**: sonner v2.0.7
- **Server**: Nitro v3.0.1

Do NOT suggest alternatives like Next.js, React Router, Material-UI, Formik, etc.

## Project Structure

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx      # Root route with QueryClientProvider, Toaster, global layout
│   ├── index.tsx       # Home page (gallery UI)
│   └── api/            # Server-side API handlers
│       ├── uploadthing.ts  # UploadThing route handler (GET/POST)
│       └── images.ts       # Image management API (GET/DELETE)
├── server/             # Server-side code
│   └── uploadthing.ts  # UploadThing router configuration (imageUploader endpoint)
├── components/
│   ├── ui/            # shadcn/ui components (accordion, alert, button, etc.)
│   ├── gallery.tsx    # Gallery component for displaying images
│   └── upload-button.tsx  # Custom upload button wrapper
├── lib/
│   ├── api/           # Client API functions
│   ├── uploadthing.ts # UploadThing client helpers (UploadButton, UploadDropzone, useUploadThing)
│   ├── query-client.ts # TanStack Query client setup
│   └── utils.ts       # Utility functions (cn helper, etc.)
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── styles/
│   └── app.css        # Global Tailwind styles
├── router.tsx         # Router configuration
└── routeTree.gen.ts   # Auto-generated route tree (do not edit manually)
```

## Architecture Notes

### Routing System

- Uses **TanStack Router** with file-based routing in `src/routes/`
- Routes are defined using `createFileRoute()` exported as `Route`
- API routes use server handlers via `server.handlers` object with HTTP method keys (GET, POST, DELETE)
- Route tree is auto-generated in `routeTree.gen.ts` - never edit manually

### File Upload Architecture

UploadThing integration has three layers:

1. **Server Router** (`src/server/uploadthing.ts`): Defines `imageUploader` endpoint with middleware for auth (currently mocked) and `onUploadComplete` callback
2. **API Handler** (`src/routes/api/uploadthing.ts`): TanStack Router endpoint that wraps UploadThing handlers
3. **Client Helpers** (`src/lib/uploadthing.ts`): Type-safe React components (`UploadButton`, `UploadDropzone`) and hooks (`useUploadThing`)

### Image Management API

- **GET /api/images**: Lists all uploaded files using UploadThing's `UTApi.listFiles()`
- **DELETE /api/images**: Deletes files by key array using `UTApi.deleteFiles()`
- Environment variables required: `UPLOADTHING_TOKEN` or `UPLOADTHING_SECRET`, optionally `UPLOADTHING_APP_ID`

### State Management

- Uses **TanStack Query** for server state (images fetching/mutations)
- Query client configured in `src/lib/query-client.ts`
- Provided at root level in `__root.tsx` via `QueryClientProvider`

### Styling System

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- shadcn/ui components in `src/components/ui/` (New York style, neutral base color)
- Path aliases configured: `@/*` maps to project root
- Global styles in `src/styles/app.css`

### Code Style (Biome Configuration)

- Indentation: **Tabs** (not spaces)
- Quotes: **Double quotes**
- Organize imports automatically on save
- Use `bunx @biomejs/biome check --write .` to format code

## Path Aliases

```typescript
@/*           → ./*
@/components  → ./components
@/src/lib     → ./src/lib
@/src/hooks   → ./src/hooks
```

## Environment Variables

Required in `.env`:

```
UPLOADTHING_TOKEN=...         # or UPLOADTHING_SECRET
UPLOADTHING_APP_ID=...        # Optional, for custom domain URLs
```

## Deployment

- Configured for Vercel via `vercel.json`
- Build command: `bun run build`
- Output directory: `.output`
- Nitro handles SSR/API routes in production
