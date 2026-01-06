# Deployment Guide

Adapter-agnostic guide to ship this SvelteKit app with a Postgres DB and working API routes.

## Requirements

- Node 18+ (LTS recommended)
- Postgres 14+ reachable from the runtime
- A SvelteKit adapter that supports server/API endpoints (pick per host)
- Environment variables configured (see .env.sample)

## Environment

- Copy .env.sample to .env and fill values.
- Ensure the runtime loads env before starting (dotenv or host secrets).

## Build & Run

- Install deps and build:
  - `pnpm install`
  - `pnpm build`
- Deploy per your adapter/host convention. Examples:
  - Adapter/Platform build step: `pnpm build`
  - Runtime starts the built server per provider (no universal `start` script here).

## Database

- Set `DATABASE_URL` to a production Postgres connection string.
- Initial data (required): run the seed with the flag enabled locally or in a one-off task:
  - `DB_SEEDING=true pnpm run db:seed`
- This creates initial admin user and essential lookup data.

## Schema Changes: Expand & Contract (no migrations)

Use a two-phase, backward-compatible process. Avoid direct breaking changes during deploys.

1. Expand (safe additions)

- Add new tables/columns/indexes that don’t break existing reads/writes.
- Deploy app changes that write to both old and new as needed.
- Backfill data if required (one-off script or SQL).

2. Contract (safe removals/renames)

- After code exclusively uses the new shape and backfill is done, remove old columns/constraints.
- Deploy the cleanup.

Notes

- Prefer explicit SQL for DDL in production. If you use a schema tool locally, treat it as a helper—not an auto-migration runner in prod.
- Gate heavy/locking operations to maintenance windows when possible.

## Operational Checks

- Health: verify API endpoints respond (adapter-specific path under `/api`).
- DB: check connections and slow queries.
- Logs/Errors: confirm your host’s logs are clean post-deploy.

## Rollback

- Revert the app build first.
- If you already performed “contract,” ensure the prior app version doesn’t assume removed columns.
- Keep expand/contract steps small to simplify rollbacks.
