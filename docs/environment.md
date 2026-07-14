# Environment management

Environment management is app-specific and uses Varlock with Proton Pass.

- `envs/.env.schema` defines the local environment contract.
- `envs/.env.development`, `envs/.env.preview`, and `envs/.env.production` provide tracked profiles.
- `envs/schemas/` contains the imported schema sections.
- `corepack pnpm env:check` validates the active profile.
- `corepack pnpm env:typegen` regenerates environment types.

Keep secrets out of the repository. For the runtime and Coolify deployment path, see
[Runtime and deployment](./runtime.md). Shared layer environment options are documented in the
[docus-plus repository](https://github.com/onderwijsin/docus-plus).
