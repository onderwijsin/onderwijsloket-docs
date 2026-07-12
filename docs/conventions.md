# Conventions

- Prefer small changes that follow nearby code.
- Use Composition API and `<script setup>` for Vue code.
- Use TypeScript for application code.
- Validate external input at boundaries with Zod where applicable.
- Wrap JSON API responses with `useApiResponse(...)`, except passthrough or streaming responses.
- Keep presentational code in components and reusable logic in composables or server utilities.
- Preserve existing route and file naming contracts unless a change is explicitly requested.

The repository root [AGENTS.md](../AGENTS.md) contains the operational rules for coding agents.
