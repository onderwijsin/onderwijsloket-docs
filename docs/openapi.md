# OpenAPI parsing and search

The configured API description is searchable from the Docus command palette. Parsing happens at
build time; parsed records are never committed to `content/`.

## Source configuration

Configure the single API description in [`config/openapi.ts`](../config/openapi.ts). The source is
a discriminated `OpenApiSource` value:

- `remote` uses an absolute HTTPS URL. Nuxt fetches it while building the Content database.
- `local` uses a path below `public/`. Nuxt reads the file from disk.

Scalar's use of this source is documented separately in [Scalar API reference](./scalar.md).

```ts
export const openApiSource: OpenApiSource = {
  type: "local",
  publicPath: "openapi.json"
};
```

Use a root JSON or YAML document. Remote sources must return a successful HTTP response within the
build timeout. Local files must remain below `public/`; this lets the build and browser consume the
same specification.

## Build-time Content pipeline

[`lib/openapi-content.ts`](../lib/openapi-content.ts) is a Nuxt Content custom source. During
Content preparation it:

1. Reads or fetches the configured specification once.
2. Validates it with `@scalar/openapi-parser`, then upgrades supported Swagger/OpenAPI versions to
   the normalized form used for extraction.
3. Rejects external `$ref`s. Bundle multi-file specifications before using them; only in-document
   `#/…` references are supported.
4. Generates virtual Markdown records for API information, tags, operations, and named schemas.

The `api` page collection in [`content.config.ts`](../content.config.ts) indexes those virtual
records with Nuxt Content FTS5. They live in Nuxt Content's generated database only, are not written
under `content/`, and must not be committed.

Every generated record has a non-navigable Content entry and keeps the metadata needed by search:
`kind`, `title`, `description`, optional operation metadata, and `scalarTarget`.

## Command-palette search

[`app/composables/global-content-search.ts`](../app/composables/global-content-search.ts) lazily
initializes separate FTS5 indexes for the current documentation collection and `api`. Documentation
is always rendered first, followed by API operations and API models/metadata. API operations include
a method badge and navigate to their Scalar deep link.

API retrieval uses the controls in [`config/constants.ts`](../config/constants.ts):

- `CONTENT_SEARCH_RESULT_LIMITS` limits visible documentation, operation, and metadata results.
- `API_SEARCH_FTS_WEIGHTS` favors FTS title matches over generated content.

The composable applies a final deterministic ranking so complete title matches appear before complete
description matches, which appear before matches found only in generated OpenAPI metadata. It also
adds title and description matches to the candidate set directly, preventing verbose schemas from
hiding matching routes or models.

## MCP discovery and retrieval

The public MCP server exposes the generated API records as read-only tools. Each resource type has a
discovery tool that returns compact metadata and an exact-match retrieval tool that returns its
generated reference content and Scalar URL:

- Operations: `list-api-operations` then `get-api-operation` with an HTTP method and OpenAPI path.
- Models: `list-api-models` then `get-api-model` with the schema name.
- Tags: `list-api-tags` then `get-api-tag` with the tag name.

These tools query the build-time `api` Content collection. They do not fetch or parse the OpenAPI
source on MCP requests, so they always reflect the same generated records used by the command
palette and Scalar links.

## Build and troubleshooting

Run `corepack pnpm build` after changing the source, parser, or generated-record contract. A build
fails deliberately when the remote source is unavailable, the document is invalid, or it contains
an external reference. This prevents search results from drifting from the configured API.

When a result is missing or ranks unexpectedly, verify in this order:

1. The source document contains the operation or named schema.
2. The title or description contains the expected search terms; these take precedence over metadata.
3. The build can fetch and validate the source without external `$ref`s.
