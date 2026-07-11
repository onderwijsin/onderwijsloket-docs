# CI/CD

> **Continuous integration, deployment workflows, and automation**

This document defines CI/CD workflows, deployment automation, and build-related tooling for the
repository.

GitHub Actions workflows live in `/.github/workflows`.

## Active Workflows

- `pull_request.yml` - Main PR workflow
- `code_quality.yml` - Reusable quality workflow
- `release.yml` - Manual release/deploy orchestrator for `main`
- `deploy_coolify.yml` - Reusable Coolify deployment workflow
- `deploy_worker.yml` - Worker deployment workflow
- `deploy_worker_manual.yml` - Manual worker deployment
- `lint_pr_title.yml` - PR title validation
- `gitleaks.yml` - Secret scanning

## Pull Request Flow

`pull_request.yml` calls `code_quality.yml` and runs:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:coverage`

On PRs targeting `main`. The same PR workflow also triggers the Cloudflare Workers preview
deployment path for eligible pull requests.

**Preview Deployment Behavior:**

- `pull_request.yml` resolves the preview deployment gate before invoking the reusable worker deploy
  workflow
- The gate reads `CLOUDFLARE_PREVIEW_DEPLOYMENTS` from `pass://$PROTON_VAULT/ci`
- When previews are disabled, the workflow skips the worker deployment job without running the
  expensive shared setup action
- PR previews call the local reusable worker deploy workflow with `upload_version: true`
- The deployment action comments the Worker preview URL back onto the pull request
- Preview deploys still build through Varlock, with `MODE=preview` and
  `NITRO_PRESET=cloudflare_module`

## Policy Checks

- `lint_pr_title.yml`: Semantic PR title validation
- `gitleaks.yml`: Secret scanning

## Release And Deploy Flow

- `release.yml` runs only via manual `workflow_dispatch` from `main`
- The dispatch form exposes two booleans:
  - `create_release`
  - `create_deploy`
- At least one option must be selected
- When both options are selected, the workflow runs release first and only starts deploy after the
  release job succeeds
- The release job checks out the full git history, installs dependencies, and runs
  `corepack pnpm exec semantic-release`
- Semantic release determines the next version from conventional commits, creates the GitHub
  release, updates `CHANGELOG.md`, and bumps `package.json`
- The release commit is written back to `main` through `@semantic-release/git` with `[skip ci]` to
  avoid unnecessary follow-up workflow runs
- The deploy job calls the reusable `deploy_coolify.yml` workflow, resolves the target commit, pins
  Coolify to that commit through the API, triggers a deployment, waits for completion, and exposes
  the deployment URL for Slack notification

## Deployment Targets

This repository currently has two supported deployment targets with different ownership models.

### Coolify Deployment (Primary)

- Primary production target
- Nitro preset: `node-server`
- Build system: Railpack on the Coolify build server
- Deploy ownership: GitHub Actions triggers Coolify through its API
- Expected trigger: manual `release.yml` dispatch with `create_deploy=true`
- The active build currently requires 8 GB of heap available on the build runner
- Required external resource: one Redis-compatible database per environment
- Optional: Coolify preview deployments can be enabled separately
- Coolify access is loaded from Proton Pass using the shared `ci` item in `PROTON_VAULT`:
  - `COOLIFY_URL`
  - `COOLIFY_APP_UUID`
  - `COOLIFY_TOKEN`

**Operational Note:** There is a known Coolify build-server memory issue tracked in
[issue #39](https://github.com/onderwijsin/onderwijsin-nuxt-v2/issues/39).

**Recommended Environment Shape per Coolify Environment:**

- App environment variables for this repository
- Dedicated Redis/Valkey connection details for cache/storage
- Environment-specific third-party credentials where applicable

### Cloudflare Workers Deployment (Optional)

- Optional deployment target
- Nitro preset: `cloudflare_module`
- Deploy ownership: GitHub Actions
- Runner platform: Blacksmith runners
- The active build currently requires 8 GB of heap available on the build runner
- Required external resource: one KV namespace per environment

**Active Worker Workflows:**

- `pull_request.yml` - Runs code quality first, triggers preview deployments
- `deploy_worker.yml` - Reusable local deployment workflow
- `deploy_worker_manual.yml` - Manual workflow dispatch

**Worker Deployment Workflow Contract:**

1. Repository owns the reusable worker deployment workflow locally in
   `.github/workflows/deploy_worker.yml`
2. Manual dispatch lives in `.github/workflows/deploy_worker_manual.yml` and calls the reusable
   worker workflow
3. `pull_request.yml` resolves the preview deployment gate before invoking the reusable worker
   workflow for PR previews
4. Build-time application env is resolved through Varlock and Proton Pass during the workflow run
5. The reusable workflow avoids separate pre-build Varlock lookups
6. Deploy metadata is derived from build output after successful build:
   - Worker name from `.output/server/wrangler.json`
   - App URL from `.output/public/app.webmanifest`
7. The workflow does NOT export repository secrets and variables into a generated `.env` file
8. Only Cloudflare authentication stays in GitHub secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
9. Proton Pass CLI is installed through the shared setup composite action before build steps
10. The workflow still passes `CLOUDFLARE_ENV=<environment>` to the build
11. Sets `MODE=<environment>` and `NITRO_PRESET=cloudflare_module`
12. Worker metadata used by the deploy action is read from generated build artifacts
13. Build output verification checks for `.output/server/wrangler.json` before deploy

**Manual Deploy:**

```bash
# Preview, next, or production
pnpm build && pnpm start:coolify

# Or for Cloudflare Workers
NITRO_PRESET=cloudflare_module pnpm build
```

## Operational Notes

- Keep deployment docs aligned with the split ownership model:
  - GitHub Actions orchestrates Coolify Node deployments
  - GitHub Actions owns Cloudflare Workers deployments
- App configuration is mostly automated from `NITRO_PRESET` (which must be explicitly set to
  `node-server` or `cloudflare_module`)
- Each target still requires its own environment-specific resource variables
- Neither GitHub Actions nor the app repository provisions Redis/Valkey or Cloudflare KV resources

## Build Environment Requirements

### Non-Interactive Environments

CI and other non-interactive build environments must provide:

- `PROTON_PASS_PERSONAL_ACCESS_TOKEN` environment variable
- Vaults must be prefixed with `app-` (e.g., `app-onderwijsin-nuxt-v2`)

### Build Memory Debugging

**Build-time memory instrumentation** is opt-in for debugging memory issues:

- The current Nuxt build requires a runner with at least 8 GB of heap available
- Worker preview and manual deploy workflows currently set `build-max-old-space-size: 8192` to
  satisfy that requirement
- `pnpm build:debug:memory` - Wraps `pnpm nuxt cleanup` and `pnpm build`, logs container/system
  memory plus top RSS processes, writes to `.debug/memory.log`
- `modules/debug-build-memory` - Emits Node memory markers during build/prerender when `DEBUG=true`
  or `DEBUG_BUILD=true`
- Useful for diagnosing CI memory issues, especially with the known Coolify build-server memory
  problem (issue #39)

## Related Documentation

- [Runtime & Deployment](./runtime.md) - Runtime configuration and deployment targets
- [Environment Management](./environment.md) - Varlock and Proton Pass usage

---

_This document defines CI/CD workflows and deployment automation for the repository._
