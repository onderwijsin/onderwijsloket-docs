# Scalar API reference

The interactive API reference is provided by `@scalar/nuxt`. Its configuration lives in
[`nuxt.config.ts`](../nuxt.config.ts); the API reference base path is defined by
[`SCALAR_BASE_PATH`](../config/constants.ts), and the stable document slug and source are defined
in [`config/openapi.ts`](../config/openapi.ts).

The API description is also parsed into Nuxt Content records for command-palette search. That
build-time pipeline is documented in [OpenAPI parsing and search](./openapi.md).

## Routing

[`lib/openapi.ts`](../lib/openapi.ts) creates path-routed Scalar deep links used by generated search
records. It encodes individual URL segments, including route parameters.

For example, an operation for `GET /items/faqs/{id}` with the `faqs` tag opens:

```text
/api-reference/tag/faqs/GET/items/faqs/%7Bid%7D
```

Changing Scalar routing or its base path must be reflected through these shared helpers; do not
construct API-reference URLs independently in components.

## Color mode

The parent application's Nuxt Color Mode state owns the API reference theme; Scalar's theme switch
is hidden. [`app/plugins/scalar-color-mode.ts`](../app/plugins/scalar-color-mode.ts) mirrors the
resolved parent `light` or `dark` value to Scalar's `colorMode` local-storage key.

The plugin also emits an inline head script on API-reference routes. It resolves Nuxt's saved
preference before Scalar's pre-hydration script runs, preventing Scalar from flashing its configured
default when the saved preference differs from the operating-system preference. Nuxt OG Image uses
an isolated SSR context without Color Mode state; the plugin deliberately skips its state-dependent
body-class synchronization there.
