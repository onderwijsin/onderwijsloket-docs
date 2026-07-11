# Environment management

Environment values use Varlock. The schema in `envs/.env.schema` imports the smaller schemas in
`envs/schemas/` and selects a profile through `MODE`/`APP_ENV`.

For local work, use the tracked environment profiles and run:

```bash
corepack pnpm env:check
corepack pnpm env:typegen
```

Secrets and deployment-specific values are not described here until the project’s current
Coolify and Proton Pass setup has been verified.
