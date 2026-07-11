# Architecture & Conventions

> **Codebase structure, organization patterns, and coding conventions**

This document defines the architecture and conventions for the repository.

## Directory Structure

### Core Directories

```
├── app/                          # Nuxt app shell (auto-imported)
│   ├── app.config.ts             # App configuration
│   ├── app.vue                   # Root component
│   ├── assets/                   # Static assets
│   ├── components/               # Vue components
│   ├── composables/              # Reusable composables (auto-imported)
│   ├── error.vue                 # Error page
│   ├── layouts/                  # Layout components
│   ├── pages/                    # Page routes (file-based routing)
│   ├── plugins/                  # App plugins
│   ├── stores/                   # Pinia stores
│   ├── types/                    # App type definitions
│   └── utils/                    # App utilities (auto-imported)
│
├── server/                       # Repository-level server code
│   ├── api/                      # API route handlers
│   └── utils/                    # Shared server utilities
│
├── config/                       # Centralized build/runtime configuration
│   ├── constants.ts              # Static cross-runtime constants
│   ├── dynamicSitemap.ts         # Dynamic sitemap configuration
│   ├── head.ts                   # App head/meta defaults
│   ├── helpers.ts                # Runtime mode/turnstile resolvers
│   ├── identity.ts               # Site identity exports
│   ├── modules.ts                # Build-time module helpers
│   ├── routeRules.ts             # Typed route-rule builders and cache policies
│   ├── sentry.ts                 # Sentry configuration
│   ├── staticSitemap.ts          # Static sitemap configuration
│   └── types/                    # Config type definitions
│
├── modules/                      # Local Nuxt modules (standalone packages)
│   └── <module>/
│       ├── index.ts              # Module entry point
│       ├── runtime/              # Runtime code
│       │   ├── server/           # Server-side runtime
│       │   ├── composables/      # Composable runtime
│       │   ├── .../              # Additional app runtime code
│       │   └── types/            # Type definitions
│       ├── tests/                # Module-specific tests
│       └── README.md             # Module documentation
│
├── envs/                         # Environment configuration
│   ├── .env.schema               # Root environment contract
│   ├── .env.development          # Development defaults
│   ├── .env.preview              # Preview defaults
│   ├── .env.production           # Production defaults
│   ├── .env.next                 # Next environment defaults
│   ├── env.d.ts                  # Auto-generated type definitions (excluded from git)
│   └── schemas/                  # Sub-schemas by domain
│       ├── core.env
│       ├── dev.env
│       ├── cloudflare.env
│       ├── redis.env
│       ├── cloudinary.env
│       ├── sentry.env
│       └── directus.env
│
├── loaders/                      # Shared route-family loaders for app pages and markdown delivery
│   ├── utils/                    # Shared loader-only helpers, static route mapping, and transforms
│   └── *.ts                      # Domain and route-family loaders
│
├── shared/                       # Shared utilities and types
│   ├── types/                    # Shared type definitions and shims
│   └── utils/                    # Shared utilities
│
├── schema/                       # Schema definitions
│   ├── contact/                  # Contact form schemas
│   ├── mailchimp/                # Mailchimp schemas
│   └── security/                 # Security schemas
│
├── tests/                        # Repository-level tests
│   ├── setup/                    # Test setup files
│   │   ├── nuxt.ts               # Nuxt test setup
│   │   └── unit.ts               # Unit test setup
│   ├── unit/                     # Node unit tests (environment: node)
│   │   ├── app/                  # App-level unit tests
│   │   │   └── composables/      # Composable tests
│   │   ├── config/               # Config tests
│   │   └── server/               # Server utility tests
│   └── nuxt/                     # Nuxt runtime tests (environment: nuxt)
│       ├── app/                  # App-level nuxt tests
│       └── server/               # Server-level nuxt tests
│
├── public/                       # Static assets
│   └── openapi/                  # OpenAPI specification
│       └── openapi.yaml           # Static route inventory
│
├── .vibe/                        # Vibe CLI configuration
│   ├── README.md                 # Vibe documentation
│   ├── agents/                   # Agent profiles
│   ├── config.toml               # Main configuration
│   ├── prompts/                  # System prompts
│   ├── skills/                   # Agent skills
│   └── tools/                    # Agent tools
│
├── .agents/                      # Agent documentation and rules
│   ├── README.md                 # Agent overview
│   ├── context/                  # Context files
│   ├── patterns/                 # Code patterns
│   ├── rules/                    # Operational rules
│   └── skills/                   # Skill definitions
│
├── scripts/                      # Build and utility scripts
│   └── debug-build-memory.sh     # Build memory debugging
│
└── docs/                        # Documentation
```

## Architecture Conventions

### 1. Separation of Concerns

| Concern         | Location                          | Principle                               |
| --------------- | --------------------------------- | --------------------------------------- |
| UI Presentation | `app/components/`, `app/layouts/` | Keep presentational logic in components |
| Reusable Logic  | `app/composables/`                | Shared behavior as composables          |
| Route Loaders   | `loaders/*`                       | Shared route-family data normalization  |
| API Boundaries  | `server/api/*`                    | Route handlers for external calls       |
| Helper Logic    | `server/utils/*`                  | Shared utilities for server code        |
| Build Config    | `config/*`                        | Centralized configuration               |
| Runtime Config  | `nuxt.config.ts`                  | Nuxt-specific configuration             |
| Environment     | `envs/*`                          | Varlock-managed environment             |
| Module Code     | `modules/*`                       | Standalone, encapsulated features       |

### 2. Nuxt Auto-Import Conventions

**In Nuxt runtime files** (app/, server/, modules/):

- ✅ **DO** rely on Nuxt auto-imports for Vue primitives: `ref`, `computed`, `watch`, `Ref`,
  `ComputedRef`
- ✅ **DO** rely on Nuxt auto-imports for Nuxt utilities: `useAsyncData`, `useState`, `useHead`,
  etc.
- ✅ **DO** rely on auto-imports from `app/utils/*` (configured in `nuxt.config.ts`)
- ❌ **DON'T** explicitly import APIs that Nuxt auto-imports

**In isolated scripts** (standalone scripts outside Nuxt context):

- ✅ **DO** use explicit imports

### 3. Module Boundary Conventions

Modules under `modules/*` are treated as standalone packages:

- **Type Definitions**: Declare in dedicated type files/folders within the module
- **Runtime Types**: Place `.d.ts` files in `runtime/server/` for server-side type augmentation
- **Module-Local Schemas**: Keep schemas/types/utils inside the module runtime tree
- **Avoid Inline Types**: Don't define structural interfaces/types inline in handlers when reusable
- **Don't Force to Top-Level**: Don't push module internals into top-level `schema/` when
  encapsulated

### 4. Route & File Naming Contracts

- Preserve existing route paths and file names
- API routes in `server/api/*` follow RESTful conventions
- Module runtime routes in `modules/*/runtime/server/*`
- OpenAPI spec at `public/openapi/openapi.yaml` is the source of truth for route inventory

### Route Loader Conventions

- Shared canonical route-family loaders belong in `loaders/*`
- Loader-only helpers that are not route families belong in `loaders/utils/*`
- A loader should own path matching/building, Directus query commands, derived types, reusable
  transforms, frontmatter mapping, and markdown body extraction for its route family
- Loader source types should come from the generated Directus schema types; app-facing types should
  be derived from those source types instead of being re-declared independently
- Loader modules may expose both overview and page-level helpers, plus lightweight document listing
  helpers for markdown and MCP discovery surfaces
- Route-level Vue pages should prefer calling loader functions directly from `useAsyncData(...)`
  instead of rebuilding Directus requests inline
- Utilities needed by both loaders and Nitro code belong in `shared/utils/*`, not `app/utils/*`
- See [Loaders](./features/loaders.md) for the full loader contract and refactor rules

### 5. API Response Contract

**JSON API Routes:**

- ✅ **MUST** wrap responses with `useApiResponse(...)`
- ✅ Returns `{ data: ... }` shape by default
- ✅ Consistent error handling with `data.code` fields

**Passthrough/Proxy/Streaming Routes:**

- ⚠️ **MAY** return raw upstream responses when wrapping would break protocol/shape compatibility
- Use sparingly and document the exception

### 6. Environment Handling

**The Golden Rule:** Runtime code must NOT read `process.env` directly.

**Build Time:**

- ✅ Read from `ENV` via `import { ENV } from 'varlock/env'`
- ✅ Import `varlock/auto-load` for auto-loading
- ✅ Project values into `runtimeConfig` or typed module options

**Runtime:**

- ✅ Read from `useRuntimeConfig()` for public and private config
- ✅ Read from already-materialized module options
- ❌ Never read `process.env` from app/runtime code

**Why:** Keeps runtime behavior portable across Coolify and Cloudflare targets.

### 7. Varlock Integration

- Varlock is configured with `package.json -> varlock.loadPath=./envs/`
- Nuxt/Vite integration via `varlockVitePlugin({ ssrInjectMode: 'auto-load' })`
- Non-integrated scripts run through `pnpm exec varlock run -- ...`
- The `envs/env.d.ts` file is **auto-generated** by Varlock during install, `pnpm dev`, or
  typecheck. It is **excluded from git** and should never be manually edited or committed.

### Auto-Generated `env.d.ts`

The `envs/env.d.ts` file is auto-generated by Varlock during:

- `pnpm install`
- `pnpm dev`
- `pnpm typecheck`

This file contains TypeScript definitions for environment variables and is **excluded from git** to
avoid polluting commit history with random strings. It is ephemeral and will be regenerated in both
local development and CI environments.

### 8. Tailwind Conventions

- ❌ **DON'T** generate Tailwind class names dynamically with template literals
- ❌ **DON'T** use string concatenation: `` `text-(--ui-${color})` ``
- ✅ **DO** use explicit static class maps or switch statements
- ✅ **DO** ensure all possible classes appear as string literals in source

**Why:** Tailwind cannot statically detect dynamic class names.

### 9. Carousel Motion Conventions

For partially visible slide layouts:

- ✅ **DO** drive reveal animations from the shared `Carousel` container
  (`app/components/primitives/Carousel.vue`)
- ✅ **DO** use the `Carousel` `motion` prop and slot-provided `motion` binding
- ❌ **DON'T** call `staggerMotion(index)` directly on each carousel item

**Pattern:** When carousel slides are partially visible, animation ownership belongs to
`app/components/primitives/Carousel.vue`. Prefer the carousel `motion` prop plus the slot-provided
`motion` binding over per-slide `staggerMotion(index)` observers.

### 10. Testing Conventions

**Test Organization:**

- Tests mirror source paths where practical
- Unit tests in `tests/unit/**` (Node environment)
- Nuxt tests in `tests/nuxt/**` (Nuxt environment)
- Module tests in `modules/<module>/tests/**`

**Test Quality:**

- Prefer behavior-focused assertions over implementation details
- Keep tests isolated and deterministic
- Mock external/IO boundaries explicitly
- Use `@nuxt/test-utils/runtime` helpers when Nuxt runtime behavior must be tested

**Console Noise:**

- Suppress expected `console.error` in tests to keep CI output clean
- Pattern: `vi.spyOn(console, 'error').mockImplementation(() => undefined)`
- Apply suppression only for expected noise, not globally

## Module Patterns

### Standard Module Skeleton

Every module in `modules/*` should follow this baseline:

```typescript
// modules/<name>/index.ts

// 1. Define constants
const MODULE_NAME = '<name>'
const MODULE_KEY = '<name>'
const LOG_SCOPE = `app:${MODULE_KEY}`

// 2. Define defaults
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: MODULE_KEY,
    compatibility: { nuxt: '^4.0.0' }
  },
  defaults: {
    enabled: true
    // ... other defaults
  },
  setup(options, nuxt) {
    const logger = createLogger(LOG_SCOPE)

    // 3. Early exit if disabled
    if (!isModuleEnabled(options, nuxt)) {
      logger.info('Module disabled')
      return
    }

    // 4. Module setup
    moduleSetup(options, nuxt)

    // 5. Cleanup
    nuxt.hook('close', () => {
      // cleanup logic
    })
  }
})
```

### Runtime Directory Wiring

For module runtime code:

1. Resolve runtime dir with `createResolver(import.meta.url)`
2. Add to transpile: `nuxt.options.build.transpile.push(runtimeDir)`
3. Register runtime surfaces:
   - `addPlugin(...)` - For plugins
   - `addImportsDir(...)` - For auto-imports
   - `addServerScanDir(...)` or `addServerHandler(...)` - For server routes

### Runtime Config Contract

Inject module config into runtime config with `defu`:

```typescript
// Private config (server-only)
nuxt.options.runtimeConfig[moduleKey] = defu(nuxt.options.runtimeConfig[moduleKey], {
  apiToken: options.apiToken
  // other private config
})

// Public-safe config
nuxt.options.runtimeConfig.public[moduleKey] = defu(nuxt.options.runtimeConfig.public[moduleKey], {
  enabled: options.enabled
  // other public config
})
```

**Never** expose server-only secrets in `public`.

### Type Template Pattern

Every module with runtime config injections should register type templates:

```typescript
nuxt.addTypeTemplate({
  filename: 'types/<module>-config.d.ts',
  getContents: () => `
    declare module '#${MODULE_KEY}' {
      interface ModuleConfig {
        // type definitions
      }
    }
  `
})
```

For generated types (like Directus), use safe fallbacks.

### Environment Guard Pattern

Use explicit environment guards where behavior should differ:

```typescript
// For prepare-safe setup
if (usePrepareMode(nuxt)) {
  // prepare-only logic
}

// For build-only modules
if (nuxt.options.dev) {
  // dev-only logic
}
```

### Server Endpoint Pattern Inside Modules

For module-owned endpoints:

- Keep handlers inside `modules/<name>/runtime/server/**`
- Validate boundary inputs with Zod
- Move reusable logic to module utils
- Add route rules when needed (`cache: false`, `prerender: false` for admin routes)
- Add module-local `runtime-config.d.ts` for `useRuntimeConfig()` augmentation

**Why:** Server TS config includes `runtime/server/**` but not `runtime/types/**`.

### Security Pattern

For admin/control endpoints:

- Reuse shared auth utility (`server/utils/security/admin.ts`: `isAdmin(event)`)
- Keep auth checks at route boundary
- Keep externally reachable proxy routes origin-validated (Directus proxy pattern)

### Testing Pattern for Modules

- Put module tests in `modules/<name>/tests/**`
- Prioritize utility/runtime logic tests over brittle integration details
- Mock Nuxt globals in module runtime tests when needed
- Keep coverage focus on high-value module runtime utilities

## Code Quality Gates

### Verification Commands

Run these for meaningful changes:

```bash
pnpm format:fix    # Formatting
pnpm lint:fix      # Linting
pnpm typecheck     # Type checking
pnpm test:coverage # Testing with coverage
```

### Coverage Thresholds

Enforced via `vitest.config.ts`:

- **Lines**: 90%
- **Functions**: 90%
- **Branches**: 80%
- **Statements**: 90%

Coverage includes TypeScript files under:

- `app/**`
- `config/**`
- `modules/**`
- `server/**`
- `shared/**`

### Coverage Completion Rule

When a task changes TypeScript source:

1. Check whether the touched code is exercised by existing tests
2. If not, add or update tests so the changed behavior is covered
3. Do NOT treat unrelated existing coverage as a substitute
4. Do NOT lower thresholds or narrow coverage paths to make a task pass

## Related Documentation

- [Overview](./overview.md) - Project purpose and technology stack
- [Runtime & Deployment](./runtime.md) - Configuration and deployment
- [Module System](./modules.md) - Module development guide

---

_This document defines architecture and conventions for the repository._
