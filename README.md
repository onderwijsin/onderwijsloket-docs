![Stichting Onderwijs in](./public/onderwijsin_banner.png)

# Onderwijsloket Docs

The Onderwijsloket documentation site. This repository is a small Nuxt application that consumes
the reusable [`@onderwijsin/docus-plus`](https://github.com/onderwijsin/docus-plus) layer and adds
Onderwijsloket content, branding, configuration, and deployment settings.

The shared Docus platform is maintained in the layer repository. This repository is the place for
the content and site-specific changes that make the platform Onderwijsloket's.

Useful upstream projects:

- [docus-plus](https://github.com/onderwijsin/docus-plus) — shared Nuxt layer and platform behavior.
- [Docus](https://docus.dev) — the documentation theme and authoring platform.

## What belongs here

- `content/` — the published landing page and documentation articles.
- `app/` — Onderwijsloket-specific app configuration, branding, styles, and pages.
- `nuxt.config.ts` and `constants.ts` — site identity, layer overrides, and route configuration.
- `envs/` — this app's Varlock profiles and Proton Pass integration.
- `public/` — site-specific static assets.

The layer owns the shared Docus/Nuxt Content setup, UI, navigation, search, assistant, MCP, API
reference plumbing, and reusable modules. Change those in [docus-plus](https://github.com/onderwijsin/docus-plus),
then update this app's pinned layer version when the change is released.

## Development

Requirements: Node.js compatible with the current Nuxt toolchain, Corepack, and access to the
project's Proton Pass vault.

```bash
corepack pnpm install
pass-cli login
corepack pnpm dev
```

The local site is available at the URL printed by Nuxt. Add or edit articles under `content/docs/`.
See [`docs/writing-content-articles.md`](./docs/writing-content-articles.md) for the authoring
workflow and writing rules.

Common checks:

```bash
corepack pnpm typecheck
corepack pnpm fmt:check
corepack pnpm lint
corepack pnpm build
```

Use `corepack pnpm` for all package-manager commands; the repository is pinned to pnpm `11.11.0`.

## Deployment

The current Onderwijsloket site is deployed to Coolify as a Nitro Node server.

Build the production server with the Coolify command:

```bash
corepack pnpm build:coolify
```

Start the built server with:

```bash
corepack pnpm start
```

Configure deployment secrets and environment values in Coolify according to the Varlock profiles
and Proton Pass setup documented in [`docs/runtime.md`](./docs/runtime.md). Keep the selected
`APP_ENV` profile aligned between build and runtime. Cloudflare deployment support belongs to the
shared layer and is not a deployment path for this application.

## Further documentation

- [`docs/README.md`](./docs/README.md) — internal documentation index.
- [`docs/architecture.md`](./docs/architecture.md) — ownership split between this app and the layer.
- [`docs/development.md`](./docs/development.md) — local development and verification.
- [`docs/runtime.md`](./docs/runtime.md) — environment and deployment configuration.
- [`docs/writing-content-articles.md`](./docs/writing-content-articles.md) — how to write articles.
- [`AGENTS.md`](./AGENTS.md) — repository contract for coding agents.

Agents must not commit changes in this repository. Review and commit changes manually.
