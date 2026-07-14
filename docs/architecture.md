# Architecture and ownership

The application extends `@onderwijsin/docus-plus` from `nuxt.config.ts` and adds a thin
Onderwijsloket-specific configuration layer.

## Ownership split

| Area                                                                               | Owner                                                   |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Nuxt, Docus, and Nuxt Content integration                                          | [docus-plus](https://github.com/onderwijsin/docus-plus) |
| Shared layouts, UI, navigation, search, assistant, MCP, and API reference plumbing | docus-plus                                              |
| Site identity, colors, logo, assistant questions, and table-of-contents links      | This app                                                |
| Landing page and published articles                                                | This app, under `content/`                              |
| Environment profiles and deployment configuration                                  | This app                                                |

Keep changes in the owning repository. If a feature should be reusable by multiple documentation
sites, implement it in docus-plus and consume a released version here. If it describes
Onderwijsloket data, services, or editorial policy, keep it in this repository's content.

## Application-specific files

- `nuxt.config.ts` extends the layer and sets site-specific metadata and redirects.
- `app/app.config.ts` configures branding, assistant starters, and extra links.
- `app/app.css` imports the layer stylesheet and provides this site's styling.
- `app/components/` contains app-level component overrides.
- `content/` contains the published landing-page data and documentation articles.
