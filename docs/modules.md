# Local modules

Local Nuxt modules live in `modules/`. The current modules are:

- `cache` — protected endpoints for managing Nitro storage cache entries.
- `healthcheck` — public ping and health endpoints.
- `turnstile` — the project’s Turnstile configuration and runtime helpers.

The Docus assistant is configured to use `/api/assistent`. The application
handler in `server/api/assistent/index.ts` owns that endpoint; the Nitro config
hook removes Docus’s duplicate module handler so the local implementation is
selected consistently.

Each module should document its own runtime surface in `modules/<module>/README.md`. Keep module-
specific implementation details there rather than duplicating them in this file.
