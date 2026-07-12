# Architecture

The application is a Docus layer extended by Nuxt configuration in `nuxt.config.ts`.

Important directories:

- `content/` — Markdown and MDC documentation content.
- `app/` — application-level Vue code and styling.
- `server/` — server routes, utilities, and types.
- `modules/` — local Nuxt modules.
- `config/` — application configuration helpers and constants.
- `schema/` — request and domain schemas.
- `envs/` — Varlock environment schemas and local profiles.
- `public/` — static assets.

## OpenAPI search index

The Scalar API reference and the searchable API index share the source configured in
`config/openapi.ts`. During a Nuxt build, `config/openapi-content.ts` validates the root OpenAPI
JSON or YAML document and creates virtual Markdown files in the `api` Nuxt Content collection.
Nuxt Content stores those generated records in its build database; they are never written to or
committed under `content/`.

The `api` collection contains API information, tags, operations, and named schemas. The app search
component queries its FTS5 index separately from the documentation index so documentation results
remain first while API operations can display HTTP-method badges and deep-link to Scalar.

Only in-document (`#/…`) references are supported. Bundle an API description before using it when
it contains external file or URL `$ref`s.

Keep reusable behavior in the existing directory that owns it. Check nearby code before adding a
new pattern.
