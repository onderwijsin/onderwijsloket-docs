# Onderwijs in Nederland v2 - Documentation

> **Unified documentation for humans and AI coding agents**

This is the unified documentation for the **onderwijsin-v2-nuxt** project, serving as a single
source of truth for both human contributors and AI coding agents (Mistral Vibe).

## Quick Navigation

### Get Started

- [Overview](./overview.md) - Project purpose, scope, and technology stack
- [Architecture](./architecture.md) - Codebase structure and organization
- [Development Workflow](./development.md) - How to work with this codebase

### Core Documentation

- [Runtime & Deployment](./runtime.md) - Configuration, environment, and deployment targets
- [CI/CD](./ci-cd.md) - Continuous integration and deployment workflows
- [Varlock and Proton Pass](./environment.md) - Environment management with Varlock + Proton Pass
- [API Contracts](./api.md) - Server routes, endpoints, and response shapes
- [Module System](./modules.md) - Local Nuxt modules architecture

### Features

- [Expertise Search](./features/expertise-search.md) - Client-side search state persisted in archive
  URLs
- [Jigsaw Animation](./features/jigsaw.md) - Procedural animation system
- [Loaders](./features/loaders.md) - Shared Directus-backed route loading layer
- [Public MCP Server](./features/mcp-server.md) - Public content discovery for external agents
- [Markdown Access](./features/markdown-access.md) - Canonical markdown delivery for agents and LLMs
- [Partners Page](./features/partners.md) - Partner marquee rendering and performance contract
- [Text Motion](./features/text-reveal.md) - Motion-based text reveal wrapper

### Operational Guidelines

- [Testing Strategy](./testing.md) - Test organization and coverage policy
- [Sentry Observability](./sentry.md) - Error tracking setup and verification
- [Conventions](./conventions.md) - Coding standards and best practices
- [Agent Contract](./agent-contract.md) - Operational contract for AI coding agents

---

## Documentation Philosophy

### Single Source of Truth

All active information lives in `docs/` as the unified documentation for both humans and AI coding
agents.

### Documentation Hierarchy

```
Project Root
├── docs/                       # Unified documentation
│   ├── README.md               # This file - navigation hub
│   ├── overview.md             # Project overview and scope
│   ├── architecture.md          # Codebase architecture
│   ├── development.md          # Development workflow
│   ├── runtime.md              # Runtime, config, deployment targets
│   ├── ci-cd.md                # CI/CD workflows and automation
│   ├── environment.md          # Environment management
│   ├── api.md                 # API routes and contracts
│   ├── modules.md             # Module system overview
│   ├── features/               # Feature-specific docs
│   │   ├── expertise-search.md # Expertise archive URL persistence
│   │   ├── jigsaw.md           # Jigsaw animation
│   │   ├── loaders.md          # Shared Directus-backed route loaders
│   │   ├── mcp-server.md       # Public MCP server
│   │   ├── markdown-access.md  # Canonical markdown delivery
│   │   ├── partners.md         # Partners page marquee behavior
│   │   └── text-reveal.md      # Text reveal component
│   ├── testing.md              # Testing strategy
│   ├── sentry.md               # Sentry configuration
│   └── conventions.md          # Coding conventions
│
└── modules/                   # Standalone module packages
    └── <module>/               # Each module has its own README
        └── README.md           # Module-specific documentation
```

### Audience

This documentation serves two audiences equally:

1. **Human Contributors**: Developers working on the project
2. **AI Coding Agents**: Mistral Vibe agents that need operational context

Both audiences should find:

- Clear explanations of the system
- Actionable instructions
- Consistent terminology
- Up-to-date information

---

## Project Essentials

### What This Project Is

- **Purpose**: Power the "Onderwijs in Nederland" (Education in the Netherlands) platform
- **Framework**: Nuxt 4 with comprehensive module system
- **Runtime**: Node.js (Coolify) with optional Cloudflare Workers support
- **UI**: @nuxt/ui, Tailwind CSS, Motion-V and GSAP for animations
- **State**: Pinia for client-side state management
- **Validation**: Zod for boundary validation
- **Testing**: Vitest + @nuxt/test-utils
- **Deployment**: GitHub Actions orchestrated Coolify deploys (primary), Cloudflare Workers
  (optional)

### Critical Rules (MUST FOLLOW)

These rules apply to all contributors, human and AI:

1. **No Breaking Changes**: Do not introduce breaking UX or API-shape changes without explicit
   request
2. **Node Runtime Compatibility**: Preserve Node server runtime compatibility (Coolify deployment
   target) and maintain compatibility with Cloudflare Workers
3. **No Cloudflare Edge Assumptions**: Avoid Cloudflare edge-specific assumptions in implementation
   and docs
4. **No New Dependencies**: Do not add dependencies unless explicitly requested
5. **Naming Contracts**: Preserve existing route/file naming contracts unless explicitly asked to
   change
6. **API Response Wrapping**: Wrap JSON API responses with `useApiResponse(...)`
7. **Exception**: Passthrough/proxy/streaming routes may return raw upstream responses
8. **Documentation Sync**: Keep this unified documentation as the single source of truth
9. **Module Docs**: Keep module-specific docs in `modules/<module>/README.md`

### Working Defaults (SHOULD FOLLOW)

- Keep presentational concerns in components and reusable logic in composables
- Keep route handlers in `server/api/*` and helper logic in `server/utils/*`
- Use Zod for boundary validation where applicable
- Prefer small, scoped changes following existing patterns
- Treat code under `modules/*` as standalone module packages

---

## Quality Gates

For any meaningful change, ensure:

```bash
# Formatting
pnpm format:fix

# Linting
pnpm lint:fix

# Type checking
pnpm typecheck

# Testing with coverage
pnpm test:coverage
```

### Definition of Done

A task is complete when:

1. Formatting applied with `pnpm format:fix`
2. Lint autofixes applied and lint passes with `pnpm lint:fix`
3. TypeScript checks pass with `pnpm typecheck`
4. Tests pass and coverage thresholds met (90% lines, 90% functions, 80% branches, 90% statements)
5. Any TypeScript source added/touched is covered by tests
6. If server code changed, API surface reviewed and `public/openapi/openapi.yaml` updated
7. Documentation updated in this unified location
8. All non-trivial code has proper JSDoc with `@param`/`@returns` tags

---

## Commit & PR Rules

- Use [Conventional Commit](https://www.conventionalcommits.org/) messages
- Format: `<type>(<optional-scope>): <subject>`
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`,
  `revert`
- PR titles must be semantic and pass `lint_pr_title.yml`

---

## Resource Map

### Configuration Files

- `nuxt.config.ts` - Nuxt modules and runtime behavior
- `package.json` - Scripts and dependencies
- `vitest.config.ts` - Test configuration and coverage thresholds
- `envs/.env.schema` - Environment variable contract
- `envs/.env.development` / `.env.preview` / `.env.production` / `.env.next` - Tracked overlays

### Key Directories

- `app/` - Routes, components, composables
- `config/` - Centralized build/runtime configuration
- `server/` - Repository-level API handlers and shared server helpers
- `loaders/` - Shared Directus-backed route loaders and markdown/frontmatter mapping
- `modules/` - Local Nuxt runtime modules and their tests
- `shared/types/` - Shared types
- `tests/` - Repository-level Vitest coverage

### Module Documentation

Each module has its own documentation:

- [Cache Module](../modules/cache/README.md)
- [Device Module](../modules/device/README.md)
- [Directus Module](../modules/directus/README.md)
- [Directus Sitemaps Module](../modules/directus-sitemaps/README.md)
- [Healthcheck Module](../modules/healthcheck/README.md)
- [Markdown Module](../modules/markdown/README.md)
- [Navigation Menus Module](../modules/navigation-menus/README.md)
- [Prerenderer Module](../modules/prerenderer/README.md)
- [Resolve Runtime Module](../modules/resolve-runtime/README.md)
- [Redirects Module](../modules/redirects/README.md)
- [Turnstile Module](../modules/turnstile/README.md)
- [Webmanifest Module](../modules/webmanifest/README.md)
- [Debug Build Memory Module](../modules/debug-build-memory/README.md)

---

## Quick Commands Reference

```bash
# Development
pnpm dev                    # Start development server
pnpm dev:stack              # Start with Valkey/Redis
pnpm build                  # Build for production
pnpm preview                # Preview production build

# Quality
pnpm format:fix             # Apply formatting
pnpm lint                   # Run linting
pnpm lint:fix               # Fix linting issues
pnpm typecheck             # Type check

# Testing
pnpm test                   # Run tests
pnpm test:unit              # Run unit tests
pnpm test:coverage          # Run tests with coverage

# Environment
pnpm env:check              # Validate environment
pnpm env:typegen            # Generate type definitions

# Valkey/Redis
pnpm valkey:start           # Start Valkey service
pnpm valkey:stop            # Stop Valkey service
```

---

## Documentation Maintenance

### When to Update

Update this documentation when:

- Project scope or purpose changes
- Architecture or directory structure changes
- New modules are added
- API contracts change
- Deployment targets change
- Testing strategy evolves
- Conventions are established or modified

### Documentation Quality

- Keep information accurate and up-to-date
- Use consistent terminology
- Include practical examples
- Cross-reference related sections
- Document the "why" not just the "what"

### AI Agent Context

For AI coding agents (Mistral Vibe):

- Read `AGENTS.md` in the project root for the root-level operational contract
- Read `docs/agent-contract.md` for the detailed operational contract
- All information in this unified documentation is actionable
- Module-specific docs in `modules/*/README.md` contain implementation details
- When in doubt, verify against the actual code

---

_Last updated: July 7, 2026_
