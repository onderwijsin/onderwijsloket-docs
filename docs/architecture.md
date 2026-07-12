# Architecture

The application is a Docus layer extended by Nuxt configuration in `nuxt.config.ts`.

Important directories:

- `content/` — Markdown and MDC documentation content.
- `app/` — application-level Vue code and styling.
- `server/` — server routes, utilities, and types.
- `modules/` — local Nuxt modules.
- `config/` — application configuration helpers and constants.
- `schema/` — request and domain schemas.
- `envs/` — Varlock environment schemas and local profiles.
- `public/` — static assets.

## OpenAPI search index

The Scalar API reference and searchable API index share one configured source and generate virtual
Nuxt Content records during the build. See [OpenAPI API reference and search](./openapi.md) for the
source contract, build pipeline, Scalar routing, and FTS5 ranking behavior.

Keep reusable behavior in the existing directory that owns it. Check nearby code before adding a
new pattern.
