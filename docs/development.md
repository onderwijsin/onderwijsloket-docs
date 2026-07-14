# Development

This repository is the consuming application for the docus-plus layer. Use the layer repository
for shared platform development; use this repository for Onderwijsloket content and configuration.

## Start locally

```bash
corepack pnpm install
pass-cli login
corepack pnpm dev
```

Environment values are loaded through Varlock. See [Runtime and deployment](./runtime.md).

## Verify changes

Run the checks relevant to the files changed:

```bash
corepack pnpm typecheck
corepack pnpm fmt:check
corepack pnpm lint
corepack pnpm build
```

When changing published articles, also inspect the rendered page locally. The content authoring
rules and required skills are in [Writing content articles](./writing-content-articles.md).

When changing the layer dependency or shared platform behavior, make the change in
[docus-plus](https://github.com/onderwijsin/docus-plus) and update this app's pinned version only
as part of the release workflow.
