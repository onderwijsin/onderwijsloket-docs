# Overview

This repository contains the Onderwijsloket content site. It consumes the reusable
[`@onderwijsin/docus-plus`](https://github.com/onderwijsin/docus-plus) Nuxt layer and supplies the
site-specific pieces:

- published content in `content/`;
- Onderwijsloket identity, branding, and UI overrides in `app/` and `constants.ts`;
- small route/configuration overrides in `nuxt.config.ts`;
- environment profiles in `envs/`; and
- static assets in `public/`.

Nuxt, Docus, Nuxt Content, the shared documentation UI, search, assistant, MCP, API reference
integration, and reusable runtime modules are layer responsibilities. Consult the
[docus-plus README](https://github.com/onderwijsin/docus-plus) when changing those areas.
