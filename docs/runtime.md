# Runtime and environment

Nuxt configuration is defined in `nuxt.config.ts`. The application is built as a Nitro Node server
for the current Coolify deployment.

Environment configuration is managed with Varlock:

- `envs/.env.schema` defines the environment contract.
- `envs/.env.development`, `envs/.env.preview`, and `envs/.env.production` provide tracked profiles.
- `envs/schemas/` contains the imported schema sections.
- `corepack pnpm env:check` validates values.
- `corepack pnpm env:typegen` generates environment types.

Do not document or assume deployment details until they are verified from the current Coolify
configuration.
