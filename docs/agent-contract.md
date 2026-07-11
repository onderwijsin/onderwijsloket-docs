# Agent Contract

> **Operational contract for AI coding agents working in this repository**

This document defines the operational contract for AI coding agents working in this repository.

## Document Hierarchy

```
AGENTS.md (root)                        # Root-level agent contract for the CLI
├── Points to docs/                     # Unified documentation
│
└── docs/agent-contract.md (this file)  # Detailed operational contract
    ├── Critical Rules (MUST)
    ├── Working Defaults (SHOULD)
    ├── Definition of Done
    ├── Rule Priority
    └── Best Practices
```

## Critical Rules (MUST FOLLOW)

These rules are **non-negotiable** and must be followed without exception:

### 1. Change Management

- **You MUST NOT** introduce breaking UX or API-shape changes without explicit request
- **You MUST** preserve Node server runtime compatibility (deployment targets: Coolify/Node.js and
  Cloudflare Workers)
- **You MUST** avoid Cloudflare edge-specific assumptions in implementation and docs
- **You MUST NOT** add dependencies unless explicitly requested
- **You MUST** preserve existing route/file naming contracts unless explicitly asked to change them

### 2. Code Quality

- **You MUST** wrap JSON API responses with `useApiResponse(...)` for consistency
  - **Exception**: Passthrough/proxy/streaming routes may return raw upstream responses when
    wrapping would break protocol/shape compatibility
- **You MUST** use Zod for boundary validation where applicable
- **You MUST** keep presentational concerns in components and reusable logic in composables
- **You MUST** keep route handlers in `server/api/*` and helper logic in `server/utils/*`

### 3. Documentation

- **You MUST** treat documentation as the **active source of operational truth**
- **You MUST** keep `docs/` as the **single source of truth**
- **You MUST** keep each `content/*.md` file synchronized with the static content rendered by its
  corresponding canonical page route
- **You MUST** update the matching `content/*.md` file in the same task whenever static page copy
  changes in `app/pages/**`, shared components, composables, or app config
- **You MUST NOT** copy runtime-driven collections or record data into static markdown unless the
  markdown file is itself the canonical source for that content
- **You MUST NOT** edit anything under `.vibe/skills/**` unless explicitly requested
- **You MUST** keep module-specific docs inside each module package as `modules/<module>/README.md`

### 4. Testing

- **You MUST NOT** lower, relax, or otherwise modify test coverage thresholds unless the user
  explicitly asks for that change in the current task
- **You MUST NOT** change Vitest coverage include paths unless the user explicitly requests it in
  the current task
- **You MUST NOT** add tests solely to meet coverage thresholds
- **You MUST** add tests only when there are known risks in the code or when preventing regressions
  for critical functionality

### 5. System Integrity

- **You MUST NOT** edit files under `.husky/**` unless the user explicitly requests it in the
  current task
- **You MUST NOT** edit files under `modules/*/runtime/types/**` (use `runtime/server/` for type
  augmentation)

## Product Scope (MUST respect)

- Nuxt 4 app shell with tooling and CI in place
- Deployment via manual `release.yml` orchestration to Coolify (primary Node.js target)
- Cloudflare Workers support via `NITRO_PRESET=cloudflare_module`
- Cloudflare Workers deployment via `NITRO_PRESET=cloudflare_module`
- **`NITRO_PRESET` must be explicitly set** to either `node-server` or `cloudflare_module`
- Logic-focused test setup using Vitest + `@nuxt/test-utils`
- Server runtime routes live under `server/api/*`
- Shared server helpers live under `server/utils/*`
- Local Nuxt modules encapsulate runtime features under `modules/*`

## Working Defaults (SHOULD FOLLOW)

These are strong recommendations that should be followed unless there's a good reason not to:

### Architecture

- Keep presentational concerns in components and layouts
- Keep reusable behavior in composables
- Keep API boundary handlers in `server/api/*`
- Keep helper logic in `server/utils/*`
- Treat code under `modules/*` as standalone module packages
  - Declare module types in dedicated type files/folders within the module
  - Keep schemas/types/utils inside module runtime when they are part of the module package boundary
  - Avoid inline structural interfaces/types in runtime handlers when a reusable module-local type
    can be declared once
  - Do not force module internals into top-level `schema/` when the module is intentionally
    encapsulated
- Prefer small, scoped changes following existing patterns

### Nuxt Conventions

- Use Nuxt auto-imports in runtime files (app/, server/, modules/)
- Do NOT explicitly import APIs that Nuxt auto-imports in runtime contexts
- In files outside Nuxt auto-import scope, explicit imports are acceptable
- Keep route/page behavior colocated in `app/pages`
- Reuse app/runtime config instead of scattering literals

### Environment Handling

- **NEVER** read `process.env` from app runtime code, server route handlers, composables, plugins,
  or module runtime files
- **ALWAYS** resolve environment variables during build/module setup and project them into
  `runtimeConfig` or typed module options before runtime
- At runtime, read from `useRuntimeConfig()` or already-materialized module options
- Use `import 'varlock/auto-load'` + `import { ENV } from 'varlock/env'` for build-time env access
- Varlock auto-load is configured via `varlockVitePlugin({ ssrInjectMode: 'auto-load' })` in
  `nuxt.config.ts`

### Tailwind

- Do NOT generate Tailwind class names dynamically with template literals or string concatenation
- Use explicit static class maps or switch statements so all possible classes appear as string
  literals in source

### Carousel Motion

- For partially visible slide layouts, drive reveal animations from the shared `Carousel` container
- Use the `Carousel` `motion` prop and the slot-provided `motion` binding for staggered slide
  reveals
- Do NOT call `staggerMotion(index)` directly on each carousel item

## Definition Of Done

**A task is ONLY complete when ALL applicable items below have been completed:**

1. ✅ Formatting has been applied with `pnpm format:fix`
2. ✅ Lint autofixes have been applied and lint passes with `pnpm lint:fix`
3. ✅ TypeScript checks pass with `pnpm typecheck`
4. ✅ Tests pass with `pnpm test:coverage`
5. ✅ If server code or module runtime server code changed, the API surface has been reviewed
6. ✅ If the API surface changed, `public/openapi/openapi.yaml` has been updated
7. ✅ Documentation has been updated in `docs/` (single source of truth)
8. ✅ All code written or touched in the task has proper JSDoc where applicable, including clear
   description and `@param`/`@returns` tags for non-trivial functions and exported APIs
9. ✅ For config/runtime/CI changes, the affected workflow or runtime path has been verified
10. ✅ Route and runtime contracts remain backward-compatible unless explicitly changed by the task
    request
11. ✅ Non-obvious architectural changes have been documented in `docs/`

**Important:** After completing the above, **you MUST NOT commit the changes**. Instead, you
**MUST** provide a summary of the work done, including:

- What changed
- Impact on contracts and behavior
- Open risks or follow-up work

It is the responsibility of the human collaborator to review, approve, and commit the changes.

## Rule Priority (When Rules Conflict)

Apply rules in this order, from highest to lowest priority:

1. **User-facing behavior and data contracts** - Protect the end user experience
2. **Runtime and deployment correctness** - Ensure the system works in production
3. **Production safety and correctness** - Prevent data loss, security issues, downtime
4. **Existing architecture boundaries and naming contracts** - Respect the established patterns
5. **Style preferences** - Lowest priority

## Best Practices

### Before Starting a Task

1. **Read AGENTS.md** in the project root for the operational contract
2. **Read docs/README.md** for documentation structure
3. **Read relevant docs** in `docs/` for project context:
   - `overview.md` - Project purpose and scope
   - `architecture.md` - Codebase structure and conventions
   - `runtime.md` - Runtime and deployment details
   - `development.md` - Development workflow
4. **Confirm real runtime behavior** from code before changing docs or implementation
5. **Keep scope tight** - avoid opportunistic refactors

### During Task Execution

6. **Update docs** when active facts change
7. **Keep static markdown in sync** with any page-copy changes for canonical routes in `content/`
8. **Trace shared content sources** such as section components, composables, and app config before
   editing canonical markdown bodies
9. **Run baseline checks:**
   - `pnpm lint`
   - `pnpm typecheck`
10. **Make minimal, focused changes** following existing patterns

### After Completing a Task

11. **Verify:**

- Tests pass with coverage
- Type checks pass
- Lint passes
- Formatting is applied

12. **Summarize:**
    - What changed
    - Impact on contracts and behavior
    - Open risks or follow-up work

    **Important:** Do **NOT** commit the changes. Provide the summary to the human collaborator for
    review and approval before committing.

### Review Checklist For PRs

When reviewing agent or human PRs:

1. Does the change match current runtime and route contracts?
2. Are docs updated (single source of truth)?
3. Are runtime and deployment assumptions correct for Node + Coolify and Cloudflare Workers?
4. Are commit/PR titles compliant with conventional commit format?

## Non-Obvious Facts and Context

### Deployment

- **Primary**: GitHub Actions orchestrated Coolify deployment with Node server runtime
  (`node-server` preset)
- **Optional**: Cloudflare Workers with `NITRO_PRESET=cloudflare_module`
- **Default**: Node on Coolify is the primary deployment path
- **Cloudflare**: Treated as opt-in, isolated behind `NITRO_PRESET`
- **Requirement**: `NITRO_PRESET` must be explicitly set to either `node-server` or
  `cloudflare_module`

### Environment System

- **Varlock**: Environment loading, validation, type generation
- **Proton Pass**: Remote secret store (vault must be prefixed with `app-`)
- **Schema**: `envs/.env.schema` is the source of truth
- **Overlays**: `envs/.env.<environment>` for non-sensitive defaults
- **Generated**: `envs/env.d.ts` - Auto-generated by Varlock during install, `pnpm dev`, or
  typecheck. **Excluded from git** and should never be manually edited or committed.
- **Proton Pass Items**: Each environment (`development`, `preview`, `next`, `production`) must have
  its own item
- **CI Access**: Non-interactive builds need `PROTON_PASS_PERSONAL_ACCESS_TOKEN`

**See:** [Varlock and Proton Pass](../environment.md) for complete usage patterns.

### Cache/KV Storage

- **Backend**: Automatic selection based on `NITRO_PRESET` (required)
  - `development` → filesystem
  - `node-server` → Valkey/Redis
  - `cloudflare_module` → Cloudflare KV
- **Module**: `modules/cache` owns cache-driver registration and metadata sidecars

### Sentry Integration

- **Node**: Preload via `./.output/server/sentry.server.config.mjs`
- **Cloudflare**: Via Nitro plugin from `resolve-runtime` module
- **Guard**: Nitro build guard strips upstream `sentry-rollup-plugin` by default
- **Override**: Set `SENTRY_UPLOAD_NITRO_SOURCE_MAPS=true` to restore upstream behavior

### Testing Stack

- **Framework**: Vitest + @nuxt/test-utils
- **E2E**: NO Playwright/browser E2E in this repository
- **Coverage Thresholds**: 90% lines, 90% functions, 80% branches, 90% statements (for visibility,
  not as a goal)
- **Coverage Scope**: `app/**`, `config/**`, `modules/**`, `server/**`, `shared/**`
- **Test Projects**: `unit` (Node env) and `nuxt` (Nuxt env)
- **Test Philosophy**: Tests are added for known risks or regression prevention, NOT to meet
  coverage thresholds

### Module System

- **Location**: `modules/*`
- **Structure**: Each module has `index.ts`, `runtime/`, `tests/`, `README.md`
- **Shared Utilities**: `config/utils/modules.ts` provides `moduleSetup()`, `usePrepareMode()`,
  `checkOption()`, `checkAndGetApiToken()`
- **Runtime Config**: Use `useRuntimeConfig()` at runtime, never `process.env`

### API Contract

- **Standard**: Wrap with `useApiResponse(...)` returning `{ data: ... }`
- **Exception**: Passthrough routes may return raw responses
- **OpenAPI**: `public/openapi/openapi.yaml` is the source of truth for route inventory

## AI Agent Collaboration Guidelines

For humans collaborating with AI coding agents:

### Ground Rules

- Ask agents to preserve runtime behavior unless a change is explicitly requested
- Require agents to keep `docs/` as the single source of truth
- Require conventional commit messages for summarizing changes
- **Do NOT let agents commit changes directly.** All changes must be reviewed and committed by a
  human collaborator.
- Do NOT let agents edit `.vibe/skills/**` unless explicitly requested
- Do NOT let agents edit `.husky/**` unless explicitly requested

### What Agents Should Read First

1. `AGENTS.md` (project root) - Root operational contract
2. This file (`docs/agent-contract.md`) - Detailed contract
3. `docs/README.md` - Documentation overview
4. `docs/overview.md` - Project purpose and scope
5. `docs/architecture.md` - Architecture and conventions
6. `docs/runtime.md` - Runtime and deployment
7. `docs/development.md` - Development workflow

### Product Scope For Agents

- Nuxt 4 app shell with active page routes
- Node deployment target on Coolify (primary)
- Optional Cloudflare Workers support
- Logic-focused test stack using Vitest
- Quality and release workflows via GitHub Actions

## Quick Reference

### Essential Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm dev:stack              # Start with Valkey/Redis
pnpm build                  # Build for production
pnpm preview                # Preview production build

# Quality Gates
pnpm format:fix             # Apply formatting
pnpm lint:fix               # Fix linting issues
pnpm typecheck              # Type check
pnpm test:coverage          # Run tests with coverage

# Environment
pnpm env:check              # Validate environment
pnpm env:typegen            # Generate type definitions

# Valkey/Redis
pnpm valkey:start           # Start Valkey service
pnpm valkey:stop            # Stop Valkey service
pnpm dev:redis              # Run Nuxt with Redis
pnpm dev:stack:stop         # Stop the entire stack
```

### Key Files and Directories

```
project-root/
├── app/                          # Nuxt app shell
├── server/                       # Server routes and utilities
├── modules/                      # Local Nuxt modules
├── config/                       # Centralized configuration
├── envs/                         # Environment schemas and overlays
├── docs/                        # Unified documentation (THIS DIRECTORY)
├── .vibe/                        # Vibe CLI configuration
└── public/openapi/openapi.yaml  # Route inventory
```

---

_This document defines the operational contract for AI coding agents working in this repository._
_For the root-level contract, see `AGENTS.md` in the project root._ _Last updated: July 8, 2026_
