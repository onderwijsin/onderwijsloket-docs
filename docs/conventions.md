# Coding Conventions

> **Practical conventions for contributors (human and AI)**

This document defines coding conventions for the repository.

## Scope

- Keep behavior changes intentional and explicit
- Preserve Node runtime compatibility for Coolify deployment and maintain compatibility with
  Cloudflare Workers
- Prefer focused changes over broad rewrites

## Critical Rules (MUST FOLLOW)

These apply to ALL contributors:

1. **No Breaking Changes**: Do not introduce breaking UX or API-shape changes without explicit
   request
2. **Node Runtime**: Preserve Node server runtime compatibility (Coolify deployment target) and
   maintain compatibility with Cloudflare Workers
3. **No Cloudflare Edge Assumptions**: Avoid Cloudflare edge-specific assumptions in implementation
   and docs
4. **No New Dependencies**: Do not add dependencies unless explicitly requested
5. **Naming Contracts**: Preserve existing route/file naming contracts unless explicitly asked to
   change
6. **API Responses**: Wrap JSON API responses with `useApiResponse(...)`
7. **Docs**: Keep `docs/` as the single source of truth

## Architecture Conventions

1. Keep UI concerns in components and layouts
2. Keep reusable behavior in composables
3. Keep API boundary handlers in `server/api/*`
4. Keep helper logic in `server/utils/*`
5. Validate boundary inputs with Zod where applicable
6. For encapsulated modules under `modules/*`:
   - Keep schemas/types/utils inside module runtime when they are part of the module package
     boundary
   - Declare module types in dedicated type files/folders and import them where used
   - Avoid inline structural interfaces/types in runtime handlers when a reusable module-local type
     can be declared once
   - Do not force module internals into top-level `schema/` when the module is intentionally
     encapsulated
7. JSON API handlers must return `useApiResponse(...)` as the response contract
8. Passthrough/proxy/streaming handlers may return raw upstream responses when wrapping would break
   protocol/shape compatibility

## Zod Conventions

1. **Validate at the boundary**: Use Zod to validate uncertain data types at API boundaries, module
   boundaries, and any place where external or untrusted data enters the system
2. **Type inference**: Leverage Zod's type inference to get nice TypeScript typing automatically
   from your schemas
3. **Reusability**: Keep reusable schemas in the `<root>/schema/` directory for sharing across the
   codebase
4. **Module-local schemas**: For encapsulated modules, keep schemas inside the module's runtime tree
   when they are part of the module package boundary

## Nuxt-Specific Conventions

1. Use Nuxt auto-imports in runtime files (app/, server/, modules/)
2. Keep route/page behavior colocated in `app/pages`
3. Reuse app/runtime config instead of scattering literals
4. Do NOT read `process.env` in runtime app/server/module code
5. For build-time env access:
   - Import `varlock/auto-load`
   - Use `ENV` from `varlock/env` instead of reading `process.env` directly
6. Keep third-party integrations isolated behind clear boundaries (e.g., in `server/utils/*`)
7. Treat `envs/.env.schema` as the repository env contract
8. Keep non-sensitive tracked defaults in `envs/.env.<environment>`
9. The `envs/env.d.ts` file is **auto-generated** by Varlock during install, `pnpm dev`, or
   typecheck. It is **excluded from git** and should never be manually edited or committed.
10. **useAsyncData cache keys**: When using client-side refresh with `useAsyncData`, cache keys MUST
    ALWAYS be a reactive value or a function. Static cache keys will prevent data updates on
    prerendered pages, even when manually calling refresh, because the cache key is not reactive.
    **Correct** - using a function with reactive value:

    ```vue
    const { data } = await useAsyncData( () => ASYNC_DATA_KEYS.blogWithLimit(limit.value), async ()
    => fetchData )
    ```

    **Incorrect** - using a static string:

    ```vue
    const { data } = await useAsyncData( 'news-data', async () => fetchData )
    ```

11. Reusable runtime type declarations belong in dedicated type modules: `app/types/*`,
    `shared/types/*`, `server/types/*`, or module-local runtime type folders. Keep composables and
    utils focused on behavior, and import shared types from those folders instead of declaring them
    inline when they are reused outside the file.
12. Composable exports must use the `useX` pattern, while composable filenames use domain-based
    kebab-case without the `use` prefix, for example `app/composables/motion.ts` exporting
    `useMotion()`. Non-composable helpers should live in `app/utils/*` or the matching module utils
    tree instead of being exported from composable files.

## Static Markdown Content Conventions

1. Every canonical static route backed by `content/*.md` must mirror the static content rendered by
   its corresponding page under `app/pages/**`
2. Keep markdown frontmatter accurate and synchronized with route metadata: `title`, `description`,
   `path`, `kind`, and `updated_at`
3. Keep the markdown body aligned with the visible page structure and section order
4. Include static copy that is sourced indirectly through shared components, composables, or
   `app/app.config.ts` when that copy is part of the rendered page
5. Exclude runtime-driven collections and records whose contents come from Directus or APIs, such as
   article carousels, search results, partner marquees, project lists, vacancy lists, member
   carousels, dynamic counts, and other request-time data
6. Include static UI copy when it is part of the user-facing page contract, such as CTA labels, form
   labels, helper text, and privacy notices
7. When static page copy changes in Vue files, shared components, composables, or app config, the
   matching `content/*.md` file must be updated in the same task
8. Keep internal links in markdown canonical and route-based, for example `/missie` and
   `/expertisecentrum`

## Tailwind Conventions

1. Do NOT generate Tailwind class names dynamically with template literals or string concatenation
2. Avoid patterns like `` `text-(--ui-${color})` `` because Tailwind cannot statically detect them
3. Use explicit static class maps or switch statements so all possible classes appear as string
   literals in source
4. Local Nuxt module runtime UI under `modules/*/runtime/**` is scanned via
   `app/assets/css/main.css` `@source` entries; keep Tailwind-authored module UI inside `runtime/`
   or update that source list when adding new runtime UI locations

## Carousel Motion Conventions

1. For partially visible slide layouts, drive reveal animations from the shared `Carousel` container
2. Use the `Carousel` `motion` prop and the slot-provided `motion` binding for staggered slide
   reveals
3. Do NOT call `staggerMotion(index)` directly on each carousel item

## Testing Conventions

1. Expected error-path tests must NOT pollute CI logs with intentional `console.error` noise
2. Reuse the shared suppression pattern from test setup:
   ```typescript
   vi.spyOn(console, 'error').mockImplementation(() => undefined)
   ```
3. Keep suppression scoped to expected test noise
4. Do NOT blanket-hide unexpected console output

## Quality Gates

Run for meaningful changes:

```bash
pnpm format:fix
pnpm lint:fix
pnpm typecheck
pnpm test:coverage
```

### Completion Checklist

For meaningful work:

1. Run `pnpm format:fix`
2. Run `pnpm lint:fix` and leave the repo in a lint-clean state
3. Run `pnpm typecheck`
4. Run `pnpm test:coverage` and keep threshold compliance intact
5. Check whether touched TypeScript source is covered by tests; if not, add or update tests
6. If server code changed, review whether the API surface changed and update
   `public/openapi/openapi.yaml`
7. Do a documentation pass and update relevant docs in `docs/`
8. Ensure touched code has proper JSDoc where applicable, including description, `@param`, and
   `@returns`

## Module Documentation Boundary

- Module-specific implementation details belong in `modules/<module>/README.md`
- Project docs should summarize and link, not duplicate full module internals
- Agent context should link to module docs instead of duplicating full module internals
- Do NOT edit `.vibe/skills/**` unless explicitly requested

## Commit & PR Conventions

- Use Conventional Commit messages
- Format: `<type>(<optional-scope>): <subject>`
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`,
  `revert`
- Keep commit headers compatible with `commitlint.config.js`
- Use semantic PR titles that pass `.github/workflows/lint_pr_title.yml`

## AI Agent Conventions

For AI coding agents working in this repository:

### Before Starting

1. Read `AGENTS.md` in project root
2. Read relevant docs in `docs/`
3. Confirm real runtime behavior from code

### During Work

4. Keep scope tight; avoid opportunistic refactors
5. Update `docs/` when active facts change
6. Run baseline checks (`lint`, `typecheck`)

### After Work

7. Verify tests pass with coverage
8. Verify type checks pass
9. Summarize changes, impact, and open risks

### Tools

- Use built-in tools: `read`, `write`, `edit`, `grep`, `bash`, `todo`
- Web search/fetch are disabled for security
- Always ask for approval on destructive operations

## Related Documentation

- [Development Workflow](./development.md) - Workflow and commands
- [Architecture](./architecture.md) - Codebase structure
- [AGENTS.md](../AGENTS.md) - AI agent operational contract

---

_This document defines coding conventions for the repository._
