# Development

The project uses Node.js and the package manager pinned in `package.json`: pnpm `11.11.0`.

Common commands:

```bash
corepack pnpm dev
corepack pnpm build
corepack pnpm start
corepack pnpm typecheck
corepack pnpm env:check
```

The pre-commit hook uses `lint-staged` to format and lint only staged files.
Formatting and lint fixes are automatically re-staged, so they are included in
the commit without staging unrelated working-tree changes. Husky remains
responsible for installing the Git hooks and validating commit messages.

The pre-commit formatter passes `--no-error-on-unmatched-pattern` to `oxfmt`.
This lets lint-staged pass all matched staged paths while allowing files excluded
by `oxfmt.config.ts` ignore patterns to be skipped without failing the commit.

Run `corepack pnpm dev` to start the local Docus site. Environment values are loaded through
Varlock; see [Runtime and environment](./runtime.md).

## OpenAPI source

Configure the single API source in `config/openapi.ts` and run `corepack pnpm build` after changing
it. See [OpenAPI API reference and search](./openapi.md) for local and remote source formats,
build-failure policy, and troubleshooting steps.
