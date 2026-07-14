# Runtime and deployment

The app runs as a Nitro Node server on Coolify. The shared layer supports more runtime features,
but this application currently uses the Node deployment path.

## Environment

Varlock loads the active profile from `envs/` and validates it against `envs/.env.schema`. The
profiles are selected through `MODE` and `APP_ENV`; Proton Pass supplies secrets in development,
CI, and deployment environments.

Useful commands:

```bash
corepack pnpm env:check
corepack pnpm env:typegen
```

Do not commit populated secret values. Keep app-specific environment changes in this repository;
shared layer environment contracts belong in [docus-plus](https://github.com/onderwijsin/docus-plus).

## Coolify

Build and run the application with:

```bash
corepack pnpm build:coolify
corepack pnpm start
```

The Coolify build and runtime must use the same intended `APP_ENV` profile (`preview` or
`production`). Confirm required values in the current Coolify project and Proton Pass vault before
changing this document.
