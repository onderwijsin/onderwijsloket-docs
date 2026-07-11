# Development Workflow

> **How to work with this codebase**

This document defines the development workflow and setup for the repository.

## Prerequisites

- Node.js version compatible with current Nuxt toolchain
- **pnpm 10** (required)
- Docker (optional, for local Valkey/Redis stack)
- Wrangler (optional, for Cloudflare deployment target)
- Proton Pass CLI: `pass-cli` (https://protonpass.github.io/pass-cli/)

## Initial Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Login to Proton Pass

```bash
pass-cli login
```

For CI or non-interactive environments, create a Proton Pass PAT:

```bash
pass-cli pat create --name "My PAT" --expiration 1y
```

Place it in `envs/.env.local` as `PROTON_PASS_PERSONAL_ACCESS_TOKEN`.

### 3. Validate Environment

```bash
pnpm env:check
```

This runs `varlock load` against the configured `envs/` directory. The `envs/env.d.ts` file is
auto-generated during this process, as well as during `pnpm install`, `pnpm dev`, and
`pnpm typecheck`. This file is **excluded from git** and should not be manually edited or committed.

**See:** [Varlock and Proton Pass](./environment.md) for complete environment management details.

## Development Commands

### Standard Local Development

```bash
pnpm dev
```

Starts Nuxt with:

- Varlock Vite auto-load enabled
- Default local filesystem-backed cache/storage behavior

### Local Development with Redis-Compatible Storage

If you need to reproduce the Coolify cache/storage path locally:

```bash
# Start the bundled Valkey stack
pnpm dev:stack

# Or manually:
pnpm valkey:start
pnpm dev:redis
```

**Helper Commands:**

```bash
pnpm valkey:start       # Start Valkey service
pnpm valkey:stop        # Stop Valkey service
pnpm dev:redis          # Run Nuxt with Redis
pnpm dev:stack          # Start Valkey + Nuxt together
pnpm dev:stack:stop     # Stop the entire stack
```

### Build and Preview

**Node Server Build:**

```bash
pnpm build
pnpm preview
```

**Cloudflare Workers Build:**

```bash
# NITRO_PRESET must be explicitly set to cloudflare_module
NITRO_PRESET=cloudflare_module pnpm build
```

**Coolify-Style Runtime:**

```bash
pnpm build
pnpm start:coolify
```

This preloads `./.output/server/sentry.server.config.mjs` via Node `--import`.

## Quality Commands

```bash
# Formatting
pnpm format:fix

# Linting
pnpm lint
pnpm lint:fix

# Type checking
pnpm typecheck
pnpm typecheck:nuxt     # Nuxt-generated types
pnpm typecheck:tests   # Test types

# Testing
pnpm test
pnpm test:unit
pnpm test:unit:watch
pnpm test:coverage

# Full quality suite
pnpm format:fix && pnpm lint:fix && pnpm typecheck && pnpm test:coverage
```

## Analysis Commands

```bash
pnpm analyze      # Analyze bundle
```

## Change Workflow (For AI Agents & Humans)

### Before Making Changes

1. **Read AGENTS.md** in the project root for the operational contract
2. **Confirm real runtime behavior** from code before changing docs or implementation
3. **Keep scope tight** - avoid opportunistic refactors
4. **Check docs/** for relevant context

### During Changes

5. **Update docs** when active facts change
6. **Run baseline checks:**
   - `pnpm lint`
   - `pnpm typecheck`
7. **Make minimal, focused changes** following existing patterns

### After Changes

8. **Verify:**
   - Tests pass with coverage
   - Type checks pass
   - Lint passes
   - Formatting is applied
9. **Summarize:**
   - What changed
   - Impact on contracts and behavior
   - Open risks or follow-up work

### Completion Contract

A coding task should not be treated as done until:

1. ✅ `pnpm format:fix` applied
2. ✅ `pnpm lint:fix` applied and repo is lint-clean
3. ✅ `pnpm typecheck` passes
4. ✅ `pnpm test:coverage` passes with threshold compliance
5. ✅ Touched TypeScript source is covered by tests (add/update if needed)
6. ✅ Server-side changes reviewed for API surface changes
7. ✅ `public/openapi/openapi.yaml` updated if API surface changed
8. ✅ Related documentation updated in `docs/`
9. ✅ Touched code has proper JSDoc (`@param`, `@returns` for non-trivial functions)

## Review Checklist For PRs

When reviewing agent or human PRs:

1. Does the change match current runtime and route contracts?
2. Are docs updated (single source of truth)?
3. Are runtime and deployment assumptions correct for Node + Coolify and Cloudflare Workers?
4. Are commit/PR titles compliant with conventional commit format?

## Module Boundaries

- Module-specific behavior docs live in `modules/<module>/README.md`
- Project docs should **summarize and link**, not duplicate full module internals
- When adding routes or runtime contracts, update:
  - Relevant `docs/` files
  - `public/openapi/openapi.yaml`

## AI Agent Collaboration

For humans collaborating with AI coding agents:

### Ground Rules

- Ask agents to preserve runtime behavior unless a change is explicitly requested
- Require agents to keep `docs/` as the single source of truth
- Require conventional commits and semantic PR titles
- Do NOT let agents edit `.vibe/skills/**` unless explicitly requested
- Do NOT let agents edit `.husky/**` unless explicitly requested

### What Agents Should Read First

1. `AGENTS.md` (project root) - Operational contract
2. `docs/README.md` - Documentation overview
3. `docs/overview.md` - Project purpose and scope
4. `docs/architecture.md` - Architecture and conventions
5. `docs/runtime.md` - Runtime and deployment
6. `docs/development.md` - This development workflow

### Product Scope For Agents

- Nuxt app shell with active page routes
- Node deployment target on Coolify (primary)
- Optional Cloudflare Workers support
- Logic-focused test stack using Vitest
- Quality and release workflows via GitHub Actions

## Related Documentation

- [Overview](./overview.md) - Project purpose
- [Architecture](./architecture.md) - Codebase structure
- [Runtime & Deployment](./runtime.md) - Configuration details
- [AGENTS.md](../AGENTS.md) - AI agent operational contract

---

_This document defines the development workflow and setup for the repository._
