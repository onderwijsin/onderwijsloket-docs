# OpenAPI API reference and search

The OpenAPI integration renders the interactive Scalar API reference and makes the same API
description searchable from the Docus command palette. It has one source of truth and performs all
parsing at build time; parsed records are never committed to `content/`.

## Source configuration

Configure the single API description in [`config/openapi.ts`](../config/openapi.ts). The source is
a discriminated `OpenApiSource` value:

- `remote` uses an absolute HTTPS URL. Scalar loads this URL in the browser and Nuxt fetches it
  while building the Content database.
- `local` uses a path below `public/`. Scalar receives the matching public URL while Nuxt reads the
  file from disk.

The same file also contains Scalar's stable document slug. Scalar's base path is configured in
[`config/constants.ts`](../config/constants.ts) and applied in [`nuxt.config.ts`](../nuxt.config.ts).

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

## Scalar integration

[`lib/openapi.ts`](../lib/openapi.ts) creates the browser URL for the configured source and the
path-routed Scalar deep links used by generated records. It keeps link construction separate from
configuration and encodes individual URL segments, including route parameters.

For example, an operation for `GET /items/faqs/{id}` with the `faqs` tag opens:

```text
/api-reference/tag/faqs/GET/items/faqs/%7Bid%7D
```

Changing Scalar routing or its base path must be reflected through these shared helpers; do not
construct API-reference URLs independently in components.

## Command-palette search

[`app/composables/useGlobalContentSearch.ts`](../app/composables/useGlobalContentSearch.ts) lazily
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

## Build and troubleshooting

Run `corepack pnpm build` after changing the source, parser, generated-record contract, or Scalar
routing. A build fails deliberately when the remote source is unavailable, the document is invalid,
or it contains an external reference. This prevents search results from drifting from the rendered
API reference.

When a result is missing or ranks unexpectedly, verify in this order:

1. The source document contains the operation or named schema.
2. The title or description contains the expected search terms; these take precedence over metadata.
3. The record's tag and route produce the intended Scalar target.
4. The build can fetch and validate the source without external `$ref`s.
