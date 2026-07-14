# Nuxt modules

This application does not maintain the shared Docus runtime modules locally. Cache, healthcheck,
Turnstile, OpenAPI, assistant, routing, and related reusable modules are provided by
[`@onderwijsin/docus-plus`](https://github.com/onderwijsin/docus-plus).

Only add a local module when it is specific to Onderwijsloket and cannot reasonably be reused by
another consuming site. Document its public runtime surface next to the module and keep the
implementation change scoped to this app.
