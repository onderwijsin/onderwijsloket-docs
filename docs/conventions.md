# Conventions

This repository follows the conventions of the [docus-plus layer](https://github.com/onderwijsin/docus-plus)
for shared Nuxt, Docus, and Nuxt Content behavior. Keep app-specific changes small and follow the
patterns already present in `app/`, `content/`, and `nuxt.config.ts`.

For published articles, see [Writing content articles](./writing-content-articles.md). In short:

- use Composition API and `<script setup>` for Vue code;
- use TypeScript for application code;
- validate external input with Zod where applicable;
- preserve public routes and existing content structure;
- keep secrets out of code and examples; and
- use the relevant authoring skills before changing Markdown/MDC content.

The repository root [AGENTS.md](../AGENTS.md) contains the operational rules for coding agents.
