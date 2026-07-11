# Project Overview

> **Internal repository for the `onderwijsin.nl` Nuxt 4 application**

## Purpose

This repository powers the **Onderwijs in Nederland** (Education in the Netherlands) website. It is
a Nuxt 4 application that:

- Serves the public website at `onderwijsin.nl`
- Owns its server runtime
- Packages several local Nuxt modules for various purposes
- Provides a comprehensive foundation for education-related content and services

## Technology Stack

### Framework & Core

- **Nuxt 4** - Full-stack Vue framework
- **Vue 3** - Composition API with `<script setup>`
- **TypeScript** - Full type safety throughout
- **Pinia** - State management (`@pinia/nuxt`)
- **Zod** - Schema validation for boundaries

### UI & Styling

- **@nuxt/ui** - Component library and Tailwind-based design system
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library for advanced scroll interactions
- **Motion-V** - Vue animation utilities

### Data & Backend

- **@directus/sdk** - Directus CMS integration
- **@vueuse/core** - Collection of Vue composables
- **ofetch** - HTTP client

### Testing

- **Vitest** - Test framework
- **@nuxt/test-utils** - Nuxt-specific testing utilities
- **@vue/test-utils** - Vue component testing

### Tooling

- **pnpm 10** - Package manager
- **ESLint** - Linting with Prettier
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Varlock** - Environment variable management
- **Proton Pass** - Secure secret storage

### Deployment

- **Coolify API via GitHub Actions** - Primary deployment (Node server on Coolify)
- **Cloudflare Workers** - Optional deployment target
- **Railpack** - Build system on Coolify
- **GitHub Actions** - CI/CD automation

## Architecture Overview

The codebase is organized by responsibility with clear separation of concerns:

```
project-root/
├── app/                          # Nuxt app shell
├── server/                       # Repository-level server code
├── config/                       # Centralized configuration
├── modules/                      # Local Nuxt modules
├── envs/                         # Environment configuration
├── shared/                       # Shared utilities and types
├── schema/                       # Schema definitions
├── tests/                        # Repository-level tests
├── public/                       # Static assets
├── .vibe/                        # Vibe CLI configuration
├── .agents/                      # Agent documentation and rules
├── scripts/                      # Build and utility scripts
└── docs/                        # Documentation
```

For the complete directory structure with all files, see
[Architecture](./architecture.md#directory-structure).

## Deployment Targets

### Primary: Coolify Node Server (`node-server`)

- **Runtime**: Nitro Node server
- **Preset**: `NITRO_PRESET=node-server`
- **Build System**: Railpack on Coolify build server
- **Deployment**: Manual `release.yml` workflow dispatch
- **Storage**: Valkey/Redis for cache/KV
- **Orchestration**: GitHub Actions updates Coolify and triggers deploy through the API

### Optional: Cloudflare Workers (`cloudflare_module`)

- **Runtime**: Cloudflare Workers module runtime
- **Preset**: `NITRO_PRESET=cloudflare_module`
- **Deployment**: GitHub Actions with Blacksmith runners
- **Storage**: Cloudflare KV namespace
- **Preview**: Automated for eligible PRs
- **Production**: Manual trigger via workflow dispatch

## Runtime Behavior

Runtime behavior is **mostly automatic** from `NITRO_PRESET` (which must be explicitly set to
`node-server` or `cloudflare_module`):

| Aspect        | Node Server  | Cloudflare Workers |
| ------------- | ------------ | ------------------ |
| Cache/Storage | Valkey/Redis | Cloudflare KV      |
| Environment   | Coolify      | Cloudflare         |
| Build         | Railpack     | Wrangler           |
| Runtime       | Node.js      | Workers            |
| Sentry        | Node preload | Nitro plugin       |

Shared app code stays the same across targets. Only storage backends, deployment wiring, and
integration details differ.

## Getting Started

See [Development Workflow](./development.md) for detailed setup instructions.

### Quick Start

```bash
# Install dependencies
pnpm install

# Start local development
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Environment Model

This project uses **Varlock + Proton Pass** for environment management:

- **Varlock** handles environment loading, validation, and type generation
- **Proton Pass** is the remote secret store
- **`envs/.env.schema`** is the source of truth for environment keys

**See:** [Varlock and Proton Pass](./environment.md) for complete usage patterns.

### Environment Workflow

```
Build Time                    Runtime
     │                            │
     ▼                            ▼
┌─────────────┐           ┌─────────────┐
│  Varlock    │           │   useRuntime │
│  ENV load   │──────────▶│    Config()  │
└─────────────┘           └─────────────┘
     │                            │
     ▼                            ▼
┌─────────────┐           ┌─────────────┐
│  Proton     │           │   Module    │
│  Pass CLI   │           │   Options   │
└─────────────┘           └─────────────┘
```

**Key Principle**: Runtime code must read from `useRuntimeConfig()` or module options, NOT from
`process.env` directly.

## Feature Modules

The project includes several local Nuxt modules that encapsulate specific functionality:

| Module                  | Purpose                                 | Runtime | Config                                      |
| ----------------------- | --------------------------------------- | ------- | ------------------------------------------- |
| cache                   | Cache/KV storage with backend switching | ✅      | `modules/cache/README.md`                   |
| content-renderer        | Flexible Editor to Markdown conversion  | ✅      | `modules/content-renderer/README.md`        |
| debug-build-memory      | Build memory debugging                  | ❌      | `modules/debug-build-memory/README.md`      |
| device                  | Device detection                        | ✅      | `modules/device/README.md`                  |
| directus                | Directus CMS integration                | ✅      | `modules/directus/README.md`                |
| directus-sitemaps       | Sitemap generation from Directus        | ✅      | `modules/directus-sitemaps/README.md`       |
| healthcheck             | Dependency health monitoring            | ✅      | `modules/healthcheck/README.md`             |
| markdown                | Markdown delivery and llms surfaces     | ✅      | `modules/markdown/README.md`                |
| navigation-menus        | Navigation menu management              | ✅      | `modules/navigation-menus/README.md`        |
| prerenderer             | Prerendering configuration              | ✅      | `modules/prerenderer/README.md`             |
| redirects               | URL redirects                           | ✅      | `modules/redirects/README.md`               |
| resolve-runtime         | Runtime preset resolution               | ✅      | `modules/resolve-runtime/README.md`         |
| site-mcp                | Public MCP content discovery            | ✅      | `modules/site-mcp/README.md`                |
| static-content-manifest | Static Markdown manifest generation     | ❌      | `modules/static-content-manifest/README.md` |
| turnstile               | Cloudflare Turnstile                    | ✅      | `modules/turnstile/README.md`               |
| webmanifest             | Web app manifest                        | ✅      | `modules/webmanifest/README.md`             |

## Related Documentation

- [Architecture](./architecture.md) - Detailed codebase structure
- [Runtime & Deployment](./runtime.md) - Configuration and deployment details
- [Module System](./modules.md) - Module development patterns
- [AGENTS.md](../AGENTS.md) - AI coding agent operational contract

---

_This document defines the project overview for the repository._
