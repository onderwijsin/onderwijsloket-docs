![Stichting Onderwijs in](./public/onderwijsin_banner.png)

# 📚 Onderwijsloket Docs

The documentation platform for Onderwijsloket. This is a Nuxt 4 application built with Docus and
Nuxt Content. Documentation is written in Markdown/MDC and lives in the repository, while the
application also provides searchable API reference pages, Scalar, and a public MCP server for
AI-assisted documentation discovery.

The application is deployed as a Nitro Node server through Coolify.

## 👀 At a glance

| Aspect                 | Details                 |
| ---------------------- | ----------------------- |
| Framework              | Nuxt 4                  |
| Documentation          | Docus + Nuxt Content    |
| Language               | TypeScript              |
| Runtime                | Nitro Node server       |
| Package manager        | Corepack + pnpm 11.11.0 |
| Environment management | Varlock + Proton Pass   |
| Formatting             | Oxfmt                   |
| Linting                | Oxlint                  |
| Deployment             | Coolify only            |

## 🚀 Quick start

Requirements:

- Node.js compatible with the current Nuxt toolchain
- Corepack
- Access to the project’s Proton Pass vault

Install dependencies and authenticate with Proton Pass:

```bash
corepack pnpm install
pass-cli login
```

Start the local documentation site:

```bash
corepack pnpm dev
```

The site is then available at the local URL printed by Nuxt.

## 📁 Project structure

```text
.
├── app/       # Pages, layouts, components, composables, and client plugins
├── config/    # Site identity, runtime helpers, route and API configuration
├── content/   # Documentation pages and Docus content configuration
├── docs/      # Repository and development documentation
├── envs/      # Varlock schemas and environment profiles
├── lib/       # Shared build-time and application helpers
├── modules/   # Local Nuxt modules, including cache, healthcheck, CSS, and Turnstile
├── public/    # Static files and OpenAPI source files
├── schema/    # Zod schemas and validation contracts
├── server/    # Nitro API routes, middleware, MCP tools, and server utilities
└── shared/    # Utilities shared by the app and server
```

Most documentation work happens in `content/`. Application behavior belongs in `app/`, server
behavior in `server/`, and reusable runtime features in `modules/`.

## 🛠️ Common commands

Run all package-manager commands through Corepack so the pinned pnpm version is used:

```bash
corepack pnpm dev             # Start local development
corepack pnpm build           # Build the Nitro production server
corepack pnpm build:coolify   # Build with the Coolify memory settings
corepack pnpm start           # Run the built server
corepack pnpm typecheck       # Generate env types and run Nuxt type checking
corepack pnpm env:check       # Validate the active environment
corepack pnpm fmt             # Format supported files with Oxfmt
corepack pnpm fmt:check       # Check formatting
corepack pnpm lint            # Run Oxlint
corepack pnpm lint:fix        # Apply Oxlint fixes
```

There is currently no Vitest test suite or test command in this project. Type checking, formatting,
linting, and a production build are the primary verification steps.

## ⚙️ Environment configuration

Environment values are loaded and validated by Varlock. The schema is defined in
[`envs/.env.schema`](./envs/.env.schema), with environment profiles in `envs/` and imported schema
sections in `envs/schemas/`.

For local development:

1. Log in with `pass-cli login`.
2. Use the `app-onderwijsloket-docs` Proton Pass vault, or configure the local environment as
   described in [`docs/environment.md`](./docs/environment.md).
3. Run `corepack pnpm env:check` to validate the loaded values.
4. Run `corepack pnpm env:typegen` when environment types need to be regenerated.

Do not commit secrets. Runtime code should use Nuxt runtime configuration, and build-time code
should use the typed `ENV` object provided by Varlock.

## 📝 Content and API reference

Add or edit documentation in `content/`. Docus renders the content collections and provides the
documentation layout, navigation, search, and assistant integration.

The API reference is configured in [`config/openapi.ts`](./config/openapi.ts). During the Nuxt build,
the configured OpenAPI source is parsed and used by both Scalar and the generated searchable API
content. After changing the source configuration, run:

```bash
corepack pnpm build
```

Relevant routes and integrations include:

- `/api-reference` for the Scalar API reference
- `/mcp` for the public, read-only MCP server
- `/api/system/ping` and `/api/system/health` for runtime health checks
- raw Markdown responses for clients that request Markdown content

See [`docs/openapi.md`](./docs/openapi.md), [`docs/scalar.md`](./docs/scalar.md), and
[`docs/modules.md`](./docs/modules.md) for implementation details.

## 🚢 Coolify deployment

Coolify is the only supported deployment target. The application runs as a Nitro Node server; no
Cloudflare Workers deployment is supported.

The Coolify build should use the project’s build command:

```bash
corepack pnpm build:coolify
```

This cleans the Nuxt output and builds with the configured 8 GB Node heap. Start the resulting
server with:

```bash
corepack pnpm start
```

Configure the required environment variables in Coolify through the project’s Varlock/Proton Pass
setup. Keep the Coolify build and runtime environments aligned with the intended `APP_ENV` profile
(`preview` or `production`).

Before deploying, verify locally or in CI with:

```bash
corepack pnpm env:check
corepack pnpm typecheck
corepack pnpm fmt:check
corepack pnpm lint
corepack pnpm build:coolify
```

## 📖 Further documentation

- [`docs/README.md`](./docs/README.md) — documentation index
- [`docs/development.md`](./docs/development.md) — development workflow
- [`docs/runtime.md`](./docs/runtime.md) — runtime and environment behavior
- [`docs/architecture.md`](./docs/architecture.md) — application architecture
- [`docs/conventions.md`](./docs/conventions.md) — coding and content conventions
- [`AGENTS.md`](./AGENTS.md) — repository contract for coding agents

Agents must not commit changes in this repository. Review and commit changes manually after the
verification steps pass.
