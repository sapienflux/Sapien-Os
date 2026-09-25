# Stage 1 implementation plan

## Goal

Stabilize the existing prototype into a trustworthy engineering baseline without making major product changes before the Stage 0 decisions are approved.

## Stage 1 workstream 1: repository and documentation stabilization

### Tasks

- confirm and document the approved spec baseline
- add stage-0 docs to repository
- create a product README for SAPIEN Academy
- create contributor and architecture docs
- add explicit statement that the current UI is demo-only
- create an approved brand asset package and usage notes

### Exit criteria

- architecture and specification baseline is visible and approved
- the repository clearly distinguishes demo artifacts from real platform work
- the implementation team has a single source of truth for requirements and brand

## Stage 1 workstream 2: engineering quality baseline

### Tasks

- add ESLint, Prettier, and TypeScript validation workflow
- add test tooling (Vitest) for critical domain logic
- add build verification and CI checks
- add basic accessibility checks
- add environment variable validation documentation
- add safe loading patterns for local or demo data

### Exit criteria

- repository can build consistently in CI
- tests exist for critical business logic before adding more features
- team has a repeatable validation process

## Stage 1 workstream 3: domain and data foundation

### Tasks

- define the canonical data model in a server-backed architecture package
- create the initial database schema proposal and migration plan
- define `users`, `roles`, `permissions`, `programs`, `batches`, `students`, `applicants`, and `audit_events`
- define regional configuration values for Islamabad / Pakistan
- define money and date handling standards
- define required validations for IDs, email, phone, amounts, dates, and role access

### Exit criteria

- no critical entity is undefined
- all core record lifecycles are mapped
- support for Pakistan/Islamabad settings is documented

## Stage 1 workstream 4: mock-data isolation

### Tasks

- isolate demo data from production runtime
- mark the current `mockData.ts` as demo-only
- create a clear local-seeding path for demos only
- remove any production usage path from the app runtime
- document a migration sequence from demo data to approved institutional data

### Exit criteria

- no app runtime depends on current mock data for institutional behavior
- demo data cannot leak into real product state or reports

## Stage 1 workstream 5: permission and authorization design

### Tasks

- define initial roles and capability sets
- create permission matrix for all major operations
- define where server-side authorization handles data access
- decide on public, staff, and student scopes
- map who can create, view, edit, approve, and delete records

### Exit criteria

- all major actions have an owner and an authorization rule
- no sensitive action is treated as client-trusted

## Stage 1 workstream 6: design system bootstrapping

### Tasks

- create approved SAPIEN design tokens from the logo
- build a minimal component style layer using the logo-based palette
- establish spacing, type, borders, and action patterns
- implement rule-driven UI design, not trend-driven design
- align the public website, admin ERP, and portal to one shared visual language

### Exit criteria

- one approved visual language is used across product surfaces
- no additional colors or decorative style drift is introduced

## Stage 1 gate

Stage 1 is complete only when:

- the demo prototype is explicitly marked as demo-only
- the data model is approved and isolated from mock runtime values
- the design language is derived from the official logo
- auth and permission boundaries are documented
- CI and quality checks are in place
- the team is ready to start the actual platform build

## Important note

Stage 1 is a foundation and governance stage. It is not a major feature release. The objective is to stop building on unstable assumptions before the actual academy platform is implemented.
