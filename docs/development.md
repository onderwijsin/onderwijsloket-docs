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

The typecheck excludes source files owned by the external Docus layer. Nuxt
includes those files because Docus is configured as an extended layer; project
and server source files remain included in the check.

Run `corepack pnpm dev` to start the local Docus site. Environment values are loaded through
Varlock; see [Runtime and environment](./runtime.md).
