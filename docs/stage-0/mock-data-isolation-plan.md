# Mock-data isolation plan

## Purpose

The current repository contains a large set of UI-demo data under `src/data/mockData.ts` and multiple demo assumptions inside state logic. That data must be treated as development-only scaffolding, not as SAPIEN Academy production content.

## Decision

Mock data must be isolated into a clearly labeled development-only seed layer with no production path and no runtime dependency in the final platform.

## Proposed structure

```text
docs/
  stage-0/
    approved-data-module-plan.md

apps/
  api/
    prisma/
      seed/
        demo/
          index.ts
          sapsien-demo-data.ts

packages/
  database/
    seed/
      demo/
        index.ts
```

## Rule set

1. The current `src/data/mockData.ts` is treated as a demo artifact, not a production source of truth.
2. Demo data is allowed only in local development and staging seed scripts.
3. No production environment should read UI mock data directly.
4. The final product must use only approved institutional data and database records.
5. Any future demo content must be clearly marked with `demo` or `seed` naming and documentation.
6. The frontend app must not depend on `mockData.ts` for any application flow outside explicitly labeled development mode.

## Isolation steps

### Step 1: classify existing data

Classify all current mock data into categories:

- approved demonstration only
- requires replacement with approved institution data
- requires later migration logic into real tables

### Step 2: create seed-only pathways

Provide:

- `seed:demo`
- `seed:reset`
- `seed:prod-safe` or equivalent environment-safe commands

These commands must not run in production or create institutional data automatically.

### Step 3: remove production dependency

The app must not import direct mock-data modules in production builds. UI code must read data either from:

- the API
- the database
- the approved server-side application layer
- feature flags for internal demo mode only

### Step 4: mark current prototype data as non-authoritative

Add a banner or documentation statement in the repo that explicitly states:

> The current `mockData.ts` collection is demonstration-only and must not be treated as actual SAPIEN Academy institutional data.

### Step 5: restrict real data creation

Sensitive operations such as student creation, fee generation, admissions conversion, and grade publication must be handled by server-side logic only. No browser-only state action should be allowed to generate official institutional records.

## Expansion rules

- Publishing feature work with mock data is okay only in documentation and local demonstration mode.
- Any real product data must be created from validated migration or admin workflows.
- Any future UI tests using static fixtures must be moved to test fixtures, not production code.

## Acceptance criteria

- No production environment imports `src/data/mockData.ts`
- Demo data is clearly isolated in a seed package
- Real business actions are server-backed
- Repository documentation describes mock data limitations and replacement plan
- Seed data is not used for official records or reporting

## Risk

If mock data remains embedded in the app runtime, the product will continue to misrepresent the institution and create hidden production risk. This is unacceptable for SAPIEN Academy.
