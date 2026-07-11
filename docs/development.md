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

Run `corepack pnpm dev` to start the local Docus site. Environment values are loaded through
Varlock; see [Runtime and environment](./runtime.md).
