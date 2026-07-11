# Module System

> **Local Nuxt modules architecture and development patterns**

This document defines the module system architecture and patterns.

## Overview

This project uses **local Nuxt modules** to encapsulate runtime features. Each module is a
standalone package that can be enabled/disabled independently.

### Active Modules

| Module                  | Purpose                                 | Runtime | Documentation                                             |
| ----------------------- | --------------------------------------- | ------- | --------------------------------------------------------- |
| cache                   | Cache/KV storage with backend switching | ✅      | [README](../../modules/cache/README.md)                   |
| content-renderer        | Flexible Editor to Markdown conversion  | ✅      | [README](../../modules/content-renderer/README.md)        |
| debug-build-memory      | Build memory debugging                  | ❌      | [README](../../modules/debug-build-memory/README.md)      |
| device                  | Device detection                        | ✅      | [README](../../modules/device/README.md)                  |
| directus                | Directus CMS integration                | ✅      | [README](../../modules/directus/README.md)                |
| directus-sitemaps       | Sitemap generation from Directus        | ✅      | [README](../../modules/directus-sitemaps/README.md)       |
| healthcheck             | Dependency health monitoring            | ✅      | [README](../../modules/healthcheck/README.md)             |
| markdown                | Markdown delivery and llms surfaces     | ✅      | [README](../../modules/markdown/README.md)                |
| navigation-menus        | Navigation menu management              | ✅      | [README](../../modules/navigation-menus/README.md)        |
| prerenderer             | Prerendering configuration              | ✅      | [README](../../modules/prerenderer/README.md)             |
| redirects               | URL redirects                           | ✅      | [README](../../modules/redirects/README.md)               |
| resolve-runtime         | Runtime preset resolution               | ✅      | [README](../../modules/resolve-runtime/README.md)         |
| site-mcp                | Public MCP content discovery            | ✅      | [README](../../modules/site-mcp/README.md)                |
| static-content-manifest | Static Markdown manifest generation     | ❌      | [README](../../modules/static-content-manifest/README.md) |
| turnstile               | Cloudflare Turnstile integration        | ✅      | [README](../../modules/turnstile/README.md)               |
| webmanifest             | Web app manifest generation             | ✅      | [README](../../modules/webmanifest/README.md)             |

**Runtime Notes:**

- ✅ = Module has runtime code (server handlers, plugins, etc.)
- ❌ = Module is build-only (no runtime code)

## Module Structure

Each module follows a consistent structure:

```
modules/<name>/
├── index.ts              # Module entry point
├── runtime/              # Runtime code (if applicable)
│   ├── server/           # Server-side runtime
│   │   ├── api/          # Module API routes
│   │   └── utils/        # Runtime utilities
│   └── types/            # Type definitions
│       ├── options.ts    # Module options interface
│       └── ...
│
├── tests/                # Module-specific tests
│   └── ...
│
└── README.md             # Module documentation
```

## Module Boilerplate

### Complete Module Skeleton (`index.ts`)

```typescript
import type { ModuleOptions } from './runtime/types/options'

import {
  addServerScanDir,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  useLogger
} from '@nuxt/kit'
import { defu } from 'defu'

import { moduleSetup } from '../../config/utils/modules'

// 1. Define module constants
const MODULE_NAME = '@onderwijsin/nuxt-<name>'
const MODULE_KEY = '<name>'
const LOG_SCOPE = '<name>'

// 2. Define default options
const DEFAULTS: ModuleOptions = {
  enabled: true
  // Add other default options here
}

/**
 * <Module name> module.
 *
 * <Description of what the module does>
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: MODULE_KEY,
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0'
    }
  },
  defaults: DEFAULTS,
  setup(userOptions, nuxt) {
    // 3. Initialize logger and module setup helpers
    const log = useLogger(LOG_SCOPE)
    const { start, end, isEnabled, options, checkOption, checkAndGetApiToken } =
      moduleSetup<ModuleOptions>(MODULE_NAME, MODULE_KEY, userOptions, DEFAULTS, log)

    // 4. Start module setup logging
    start()

    // 5. Early exit if module is disabled
    if (!isEnabled()) {
      return
    }

    // 6. Resolve runtime directory
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')

    // 7. Add runtime directory to transpile
    nuxt.options.build.transpile.push(runtimeDir)

    // 8. Register server scan directory (for auto-discovery of server routes)
    addServerScanDir(resolver.resolve(runtimeDir, 'server'))

    // 9. Register imports directory (for auto-imports)
    addImportsDir(resolver.resolve(runtimeDir, 'composables'))

    // 10. Inject runtime config (private - server only)
    nuxt.options.runtimeConfig[MODULE_KEY] = defu(nuxt.options.runtimeConfig[MODULE_KEY], {
      apiToken: options.apiToken
      // Other private config from options
    })

    // 11. Inject runtime config (public - available to client)
    nuxt.options.runtimeConfig.public[MODULE_KEY] = defu(
      nuxt.options.runtimeConfig.public[MODULE_KEY],
      {
        enabled: options.enabled
        // Other public config from options
      }
    )

    // 12. Register type templates
    addTypeTemplate({
      filename: 'types/<module>-config.d.ts',
      src: resolver.resolve(runtimeDir, 'types/config.d.ts')
    })

    // For generated types, use getContents:
    addTypeTemplate({
      filename: 'types/<module>-runtime.d.ts',
      getContents: () => `
        declare module '#${MODULE_KEY}' {
          interface ModuleConfig {
            enabled: boolean
          }
          interface ModuleRuntimeConfig {
            // Runtime-specific types
          }
        }
      `
    })

    // 13. Validate required options
    checkOption({
      key: 'apiToken',
      required: true,
      message: 'API token is required for this module'
    })

    // Or use checkAndGetApiToken for API tokens:
    const apiToken = checkAndGetApiToken({ required: true }, nuxt.options.runtimeConfig)

    // 14. Register route rules if needed
    nuxt.options.routeRules = nuxt.options.routeRules ?? {}
    nuxt.options.routeRules['/api/<module>/**'] = {
      cache: false,
      prerender: false
    }

    // 15. Add module-specific hooks and logic here
    // ...

    // 16. End module setup logging
    end()
  }
})
```

### Module Options Type (`runtime/types/options.ts`)

```typescript
/**
 * Options for the <name> module
 */
export interface ModuleOptions {
  /**
   * Enable or disable the module
   * @default true
   */
  enabled: boolean

  /**
   * API token for external service
   */
  apiToken?: string

  /**
   * Base URL for the API
   */
  baseUrl?: string

  // Add other options as needed
}

export type ModuleRuntimeConfig = {
  // Runtime-specific config
}
```

### Module Runtime Config Augmentation (`runtime/server/runtime-config.d.ts`)

```typescript
// This file augments the Nuxt runtime config shape for server-side code
// It is required for proper type inference when using useRuntimeConfig()

declare module '#<module>' {
  interface ModuleConfig {
    enabled: boolean
    // Other config from options
  }
}

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    <module>: ModuleConfig
  }
}

export {}
```

## Module Patterns

### 1. Standard Module Skeleton

Use the baseline skeleton shown above with:

- Constants: `MODULE_NAME`, `MODULE_KEY`, `LOG_SCOPE`
- Defaults: `DEFAULTS` with `enabled: true`
- Setup: Use `defineNuxtModule` with `meta.compatibility` and `defaults`
- Helpers: Use `moduleSetup()` from `config/utils/modules`
- Lifecycle: Call `start()`, check `isEnabled()`, call `end()`

### 2. Option Validation Pattern

Validate config explicitly with `checkOption` for required/critical keys before wiring runtime
behavior:

```typescript
// In setup, after calling moduleSetup
checkOption({
  key: 'baseUrl',
  required: true,
  message: 'Base URL is required for Directus module'
})

// For API tokens, use the specialized helper
const apiToken = checkAndGetApiToken(
  {
    required: true
  },
  nuxt.options.runtimeConfig
)
```

Typical examples:

- Directus: base URL and tokens
- Directus sitemaps: directus URL (except prepare mode)
- Cache: API token resolved through `checkAndGetApiToken`

### 3. Runtime Directory Wiring

For module runtime code:

```typescript
const resolver = createResolver(import.meta.url)
const runtimeDir = resolver.resolve('./runtime')

// Required: Add to transpile
nuxt.options.build.transpile.push(runtimeDir)

// Register runtime surfaces as needed:
addServerScanDir(resolver.resolve(runtimeDir, 'server')) // For server routes
addImportsDir(resolver.resolve(runtimeDir, 'composables')) // For auto-imports
addPlugin(resolver.resolve(runtimeDir, 'plugins/my-plugin')) // For plugins
```

### 4. Runtime Config Contract

Inject module config into runtime config with `defu`:

```typescript
// Private config (server-only, NOT exposed to client)
nuxt.options.runtimeConfig[moduleKey] = defu(nuxt.options.runtimeConfig[moduleKey], {
  apiToken: options.apiToken,
  secretKey: options.secretKey
  // other private config
})

// Public-safe config (exposed to client)
nuxt.options.runtimeConfig.public[moduleKey] = defu(nuxt.options.runtimeConfig.public[moduleKey], {
  enabled: options.enabled,
  publicKey: options.publicKey
  // other public config
})
```

**NEVER expose server-only secrets in `public`.**

### 5. Type Template Pattern

Every module with runtime config injections should register type templates:

```typescript
// For existing type files
addTypeTemplate({
  filename: 'types/<module>-config.d.ts',
  src: resolver.resolve(runtimeDir, 'types/config.d.ts')
})

// For generated types
addTypeTemplate({
  filename: 'types/<module>-runtime.d.ts',
  getContents: () => `
    declare module '#${MODULE_KEY}' {
      interface ModuleConfig {
        enabled: boolean
      }
      interface ModuleRuntimeConfig {
        // runtime types
      }
    }
  `
})
```

For generated types (like Directus), use safe fallbacks.

### 6. Environment Guard Pattern

Use explicit environment guards where behavior should differ:

```typescript
// For prepare-safe setup
if (usePrepareMode(nuxt).isPrepareMode) {
  // prepare-only logic - skip setup that requires full env
  return
}

// For build-only modules (like webmanifest)
if (nuxt.options.dev) {
  // dev-only logic
}
```

### 7. Environment Projection Pattern

**DO NOT** read `process.env` from app/module runtime code.

**DO** this:

1. Resolve environment variables during build/module setup in `nuxt.config.ts` or module options
2. Project those values into `nuxt.options.runtimeConfig` or typed module options before runtime
3. At runtime, read from `useRuntimeConfig()` or already-materialized module options

**Why:** Keeps runtime behavior portable across Coolify and Cloudflare targets. The app runtime must
stay portable and must not depend on deployment-target-specific runtime env injection behavior.

### 8. Server Endpoint Pattern Inside Modules

For module-owned endpoints:

- Keep handlers inside `modules/<name>/runtime/server/**`
- Validate boundary inputs with Zod
- Keep orchestration in routes, move reusable logic to module utils
- Add route rules when needed (`cache: false`, `prerender: false` for admin cache routes)
- If server handlers use `useRuntimeConfig()`, add a module-local declaration file under
  `modules/<name>/runtime/server/` (e.g., `runtime/server/runtime-config.d.ts`) that augments
  `nuxt/schema`

**Why:** Server TS config includes `runtime/server/**` but NOT `runtime/types/**`. Relying only on
`runtime/types/config.d.ts` can cause degraded server-side config inference (`{}` / `any`).

### 9. Security Pattern

For admin/control endpoints:

- Reuse shared auth utility (`server/utils/security/admin.ts`: `isAdmin(event)`) when possible
- Keep auth checks at route boundary
- Keep externally reachable proxy routes origin-validated (Directus proxy pattern)

### 10. Testing Pattern for Modules

- Put module tests in `modules/<name>/tests/**`
- Prioritize utility/runtime logic tests over brittle integration details
- Mock Nuxt globals in module runtime tests when needed
- Keep coverage focus on high-value module runtime utilities

### 11. Documentation Pattern

- Module-specific docs live in `modules/<name>/README.md`
- Project docs (`docs/*`) reference module READMEs rather than duplicating internals
- Agent docs mirror active rules and patterns

## Module Documentation

Each module README should include:

1. **Purpose** - What the module does
2. **Runtime Behavior** - When/where it runs
3. **Configuration** - Available options with defaults
4. **Environment Variables** - Required env vars
5. **API Routes** - If it exposes routes
6. **Usage Examples** - How to use it
7. **Testing** - How to test it
8. **Troubleshooting** - Common issues
9. **Related Modules** - Dependencies or related modules

## Module Development

When creating a new module:

1. Create directory: `modules/<name>/`
2. Add `runtime/types/options.ts` with module options interface
3. Add `index.ts` with module definition (use the skeleton above)
4. Add runtime code in `runtime/` if needed
5. Add `runtime/server/runtime-config.d.ts` for type augmentation
6. Add `README.md` with documentation
7. Add tests in `tests/`
8. Register in `nuxt.config.ts` (if needed)
9. Update `docs/modules.md` (this file)
10. Add to the active modules table above

## Module Boundaries

- Modules are **standalone** - they should not depend on other local modules unless explicitly
  designed
- **Type definitions** stay within the module
- **Runtime config** is isolated to the module
- **Documentation** is self-contained
- **Tests** are module-specific

## Shared Module Utilities

The `config/utils/modules.ts` file provides shared utilities for module development:

### `moduleSetup(<T>)`

Returns an object with helper methods:

```typescript
const {
  start, // Function: log module setup start
  end, // Function: log module setup success
  isEnabled, // Function: check if module is enabled
  options, // Merged options (user + defaults)
  checkOption, // Function: validate an option
  checkAndGetApiToken // Function: get and validate API token
} = moduleSetup<ModuleOptions>(MODULE_NAME, MODULE_KEY, userOptions, DEFAULTS, log)
```

### `usePrepareMode(nuxt)`

Returns whether we are in a prepare environment:

```typescript
const { isPrepareMode } = usePrepareMode(nuxt)

if (isPrepareMode) {
  // Skip setup that requires full environment
  return
}
```

## Related Documentation

- [Overview](../overview.md) - Project purpose
- [Architecture](../architecture.md) - Codebase structure
- [Runtime & Deployment](../runtime.md) - Environment and deployment

---

_This document defines the module system architecture and patterns._
