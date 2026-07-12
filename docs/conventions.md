# Conventions

- Prefer small changes that follow nearby code.
- Use Composition API and `<script setup>` for Vue code.
- Use TypeScript for application code.
- Validate external input at boundaries with Zod where applicable.
- Wrap JSON API responses with `useApiResponse(...)`, except passthrough or streaming responses.
- Keep presentational code in components and reusable logic in composables or server utilities.
- Preserve existing route and file naming contracts unless a change is explicitly requested.

## User-facing documentation articles

`content/docs/` contains user-facing documentation, not internal project documentation. Apply the
following rules whenever creating, editing, or formatting an article in that directory:

1. Always consult the [Nuxt UI skill](../.agents/skills/nuxt-ui/SKILL.md), the [Nuxt Content MCP](https://content.nuxt.com/mcp), and the [Remark MDC syntax reference](https://remark-mdc.nuxt.space/#syntax) before writing or formatting the article.
2. Use the Nuxt UI and Nuxt Content references to select and validate the MDC syntax, component
   props, slots, and nesting used in the article.
3. Any Nuxt UI component may be used in an article through MDC syntax when it improves the reader's
   understanding or navigation; prefer the component that best fits the content rather than limiting
   articles to plain Markdown.
4. Preserve the article's required frontmatter and the established content structure unless the
   requested change requires otherwise.

The repository root [AGENTS.md](../AGENTS.md) contains the operational rules for coding agents.
