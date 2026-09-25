# Final Architecture Decision Record (ADR)

## ADR-001: SAPIEN Academy platform architecture

### Status

Approved for Stage 0 baseline.

### Context

The repository currently contains a polished single-page React prototype that demonstrates key academy workflows but is built around browser-only state and mock data. This conflicts with the specifications for a secure, integrated system with real authentication, server-side authorization, authoritative data, and institutional operational integrity.

The target product requires:

- Public website
- Application flow
- Admin ERP
- Student portal
- Academic workflows
- Finance workflows
- Observability and operations
- Institutional data privacy and audit
- Pakistan/Islamabad defaults
- Official SAPIEN brand usage

The prototype must be treated as a demo artifact, not as the final architecture.

### Decision

Adopt a multi-surface, service-oriented architecture with a shared domain and authoritative data layer.

#### Core architecture

- Frontend web apps: React + Vite + TypeScript
- Backend: Node.js application layer with authenticated API endpoints
- Persistence: PostgreSQL with migrations and seed tooling
- ORM / data access: Prisma or Drizzle
- Validation: Zod
- Auth: managed identity / session-based auth with capability checks
- Payments: provider-integrated with secure server-only processing
- Storage: object storage for approved documents and attachments
- Background jobs: queue-based automation for notifications and syncing
- Monitoring: logs, traces, and alerts

#### Product surfaces

- `apps/web` — public website and applicant entry experience
- `apps/admin` — internal ERP and operations dashboard
- `apps/portal` — student / guardian experience
- `apps/api` — secure application interface and business logic

#### Shared packages

- `packages/domain` — entities, policies, rules, calculations
- `packages/database` — schema, migrations, seed, reporting access
- `packages/auth` — roles, permissions, session rules
- `packages/ui` — approved design system component layer
- `packages/config` — regional/institutional config
- `packages/integrations` — payments, email, storage, messaging, reports

### Rationale

This architecture aligns with the product brief because it separates the platform into a public front door, internal operational system, and secure student portal while keeping one authoritative institutional data model.

It solves the core prototype issues:

- no browser-side security boundary
- no real identity or permission model
- no production data handling
- no reliable audit or reconciliation structure
- no maintainable multi-surface platform model

### Constraints and trade-offs

- More setup complexity than a single React app
- Requires clear global domain boundaries
- Needs careful data modeling before feature growth
- Requires a deliberate migration plan from prototype data

### Consequences

#### Positive

- Secure, auditable, and scalable system
- Shared entity model across website, ERP, and portal
- Easier future campus expansion and regional configuration
- Better support for domain logic and governance

#### Negative

- More implementation and operational complexity than the current prototype
- Requires teams and processes for migration and validation
- Requires explicit governance for data and release quality

### Non-goals

- Keep the current `localStorage` model as a production record source
- Continue to treat the prototype as the final product definition
- Introduce new brand colors beyond the approved logo-based palette
- Ship features without audit, authorization, and validation layers

### Accepted alternatives considered

1. Keep the monolithic Vite React app and add a backend later
   - Rejected: creates inconsistent security boundaries and duplicated logic

2. Keep the prototype and merely style it more nicely
   - Rejected: conflicts with the SAPIEN requirements and the requirement to treat current work as a prototype

3. Build a full backend and UI simultaneously without data governance
   - Rejected: too high risk; Stage 0 requires architecture and data baselines before major implementation

### Implementation implications

The current repository and current UI are valid only as a proof-of-concept and as a source for feature prioritization. They must not be treated as the final product architecture.

The next stage after approval will focus on foundation hardening while preserving the domain intent of the prototype, not its current implementation details.
