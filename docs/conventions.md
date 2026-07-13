# Conventions

- Prefer small changes that follow nearby code.
- Use Composition API and `<script setup>` for Vue code.
- Use TypeScript for application code.
- Validate external input at boundaries with Zod where applicable.
- Wrap JSON API responses with `useApiResponse(...)`, except passthrough or streaming responses.
- Keep presentational code in components and reusable logic in composables or server utilities.
- Preserve existing route and file naming contracts unless a change is explicitly requested.

## Public documentation

`content/docs/` contains public, user-facing developer documentation, not internal project notes. Apply the following rules whenever creating, editing, or formatting articles in that directory:

1. Use the `create-docs` and `edit-article` skills when creating or revising documentation, and keep the output focused on readers of the published docs.
2. Always consult the [Nuxt UI skill](../.agents/skills/nuxt-ui/SKILL.md), the [Nuxt Content MCP](https://content.nuxt.com/mcp), and the [Remark MDC syntax reference](https://remark-mdc.nuxt.space/#syntax) before writing or formatting an article.
3. Use the Nuxt UI and Nuxt Content references to select and validate MDC syntax, component props, slots, and nesting.
4. Use [Nuxt UI Prose components](https://ui.nuxt.com/docs/typography) and other Nuxt UI components through their documented MDC syntax whenever they improve the reader's understanding, presentation, or navigation. Prefer the component that best fits the content rather than limiting articles to plain Markdown.
5. Preserve required frontmatter and the established content structure unless the requested change requires otherwise.

The repository root [AGENTS.md](../AGENTS.md) contains the operational rules for coding agents.
