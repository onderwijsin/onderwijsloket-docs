# Conventions

- Prefer small changes that follow nearby code.
- Use Composition API and `<script setup>` for Vue code.
- Use TypeScript for application code.
- Validate external input at boundaries with Zod where applicable.
- Wrap JSON API responses with `useApiResponse(...)`, except passthrough or streaming responses.
- Keep presentational code in components and reusable logic in composables or server utilities.
- Preserve existing route and file naming contracts unless a change is explicitly requested.

## Public documentation

- Write pages in `content/` for a public developer audience; do not treat them as internal project
  notes.
- Use [Nuxt UI Prose components](https://ui.nuxt.com/docs/typography) with their documented MDC
  syntax whenever they improve the presentation of public-facing documentation.
- Use the `create-docs` and `edit-article` skills when creating or revising public-facing
  documentation. Keep their output focused on readers of the published docs.

The repository root [AGENTS.md](../AGENTS.md) contains the operational rules for coding agents.
