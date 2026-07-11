# @onderwijsin/nuxt-cache

Nuxt module that exposes admin-protected `/api/_cache/*` routes for managing Nitro storage cache
entries.

## Endpoints

- `GET /api/_cache/keys`
- `GET /api/_cache/[...key]`
- `DELETE /api/_cache/[...key]`
- `GET /api/_cache/base/[...base]`
- `DELETE /api/_cache/base/[...base]`
- `POST /api/_cache/clear`

All JSON responses follow the project API contract:

- `useApiResponse(...)` -> `{ data: ... }`

Key format notes:

- `GET /api/_cache/keys` returns mount-local cache keys (for example `pages:article-one`).
- Metadata responses can expose canonical fully-qualified keys (for example
  `cache:pages:article-one`).
- `GET /api/_cache/[...key]` and `DELETE /api/_cache/[...key]` accept both formats.

## Auth

Routes require either:

- `x-admin-token: <API_TOKEN>`
- `Authorization: Bearer <API_TOKEN>`

Token resolution order:

1. `cache.apiToken`
2. top-level runtime `apiToken`
3. `API_TOKEN` env
