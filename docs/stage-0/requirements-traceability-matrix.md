# Requirements Traceability Matrix

## Purpose

This matrix traces the SAPIEN Academy product requirements to implementation priorities and validation criteria. It is the source for release gating and Stage 1 planning.

## Legend

- Status: Approved / Planned / Deferred / Blocked
- Priority: P0 = critical, P1 = high, P2 = medium

## Matrix

| ID | Requirement | Source | Priority | Status | Implementation target | Acceptance criteria |
|---|---|---|---|---|---|---|
| R-01 | Platform must support a public website, applications, admin ERP, admissions, students, academics, attendance, assessments, finance, student portal, and operations | Product brief | P0 | Approved | Stage 1+ | All major surfaces are implemented as integrated parts of one system |
| R-02 | Treat existing code as prototype and audit, not as final architecture | Working method | P0 | Approved | Stage 0 | Architecture decisions documented before build |
| R-03 | Use official uploaded SAPIEN logo as authoritative design source | Design brief | P0 | Approved | Stage 0 | Logo asset approved; no redraw or reinterpretation |
| R-04 | Use only information in approved specs; do not invent programs, fees, claims, policies, testimonials, or dates | Product brief | P0 | Approved | Stage 0+ | Seed data and copy are reviewed and approved |
| R-05 | Default institutional context is Islamabad, Pakistan | Localization brief | P0 | Approved | Stage 1 | Asia/Karachi timezone, PKR currency, local date conventions |
| R-06 | Use Pakistan-compatible financial and operational defaults | Localization brief | P0 | Approved | Stage 1 | PKR formatting and institutional settings are configurable |
| R-07 | Strong authentication and authorization architecture | Engineering principles | P0 | Approved | Stage 2 | Real auth, permissions, server-side validation |
| R-08 | Use capability-based permissions for protected operations | Authentication brief | P0 | Approved | Stage 2 | No sensitive action is client-trusted |
| R-09 | Build one authoritative data model with no duplication | Integration principle | P0 | Approved | Stage 2 | Shared entities and references, not duplicate records |
| R-10 | Clear separation of UI, business logic, data, and integrations | Engineering principles | P0 | Approved | Stage 1+ | Domain and transport layers are distinct |
| R-11 | Server-side authorization for protected operations | Engineering principles | P0 | Approved | Stage 2 | API enforces permissions |
| R-12 | Strong input validation and safe database operations | Engineering principles | P0 | Approved | Stage 2 | Validation at API boundaries and DB constraints |
| R-13 | Consequential actions must be auditable | Engineering principles | P0 | Approved | Stage 2 | All material events produce immutable system audit events |
| R-14 | No hard-coded secrets | Security rules | P0 | Approved | Stage 1+ | Secrets are externalized and managed securely |
| R-15 | No duplicate business logic | Engineering principles | P0 | Approved | Stage 1+ | Shared domain services and policies |
| R-16 | Responsive and accessible by default | Quality standard | P0 | Approved | Stage 1+ | A11y and mobile standards are part of definition of done |
| R-17 | Maintainable and scalable architecture | Engineering principles | P0 | Approved | Stage 1+ | Structure supports future campuses and modules |
| R-18 | Production-grade error handling | Engineering principles | P0 | Approved | Stage 1+ | Errors are handled with user-safe and operational-safe patterns |
| R-19 | Proper logging, monitoring, backups, and recovery | Engineering principles | P0 | Approved | Stage 2+ | Observability and operating procedures are defined |
| R-20 | Test critical workflows | Quality standard | P0 | Approved | Stage 1+ | Unit/integration/E2E tests for key flows |
| R-21 | Documentation must stay synchronized | Engineering principles | P0 | Approved | Stage 0+ | ADRs and docs track architecture changes |
| R-22 | Website and ERP should not become disconnected products | Integration principle | P0 | Approved | Stage 1+ | Shared data flow and lifecycle across the platform |
| R-23 | Public applications should convert to enrolled student records seamlessly | Integration principle | P0 | Approved | Stage 3 | Application lifecycle is tracked and linked to student record |
| R-24 | Student portal must show only authorized content | Auth + student portal brief | P0 | Approved | Stage 4 | Student-specific access rules are enforced |
| R-25 | Dashboard should answer “What needs attention now?” | Admin experience brief | P0 | Approved | Stage 4 | Executive and admin dashboard shows active priorities |
| R-26 | Search, filters, sorting, and clear states for admin workflows | Admin experience brief | P1 | Approved | Stage 1+ | Data-heavy modules support operational use |
| R-27 | Faculty and student modules must be role-appropriate | Auth + portal brief | P0 | Approved | Stage 4 | Portal roles cannot access unrelated data |
| R-28 | Platform must be secure enough for academic and financial data | Security principle | P0 | Approved | Stage 2+ | Security review and controls in place |
| R-29 | Use official SAPIEN theme only and avoid generic AI-dashboard aesthetics | Design brief | P0 | Approved | Stage 0+ | Visual language derived from official logo and institutional tone |
| R-30 | Products should feel premium, minimal, calm, intelligent, precise, and distinctly SAPIEN | Design brief | P0 | Approved | Stage 1+ | Style is disciplined and not trend-driven |
| R-31 | Role-based work queues and approvals are required for operational processes | Admin brief | P1 | Approved | Stage 3+ | Approvals and handoff workflows are implemented |
| R-32 | Core systems should support future location expansion beyond Islamabad | Localization brief | P1 | Approved | Stage 1+ | Regional settings are configuration-driven |
| R-33 | Public website must not invent program claims or statistics | Product brief | P0 | Approved | Stage 3 | Approved content only |
| R-34 | Student and finance records must be tied to valid institutional rules | Product brief | P0 | Approved | Stage 2+ | Business rules validate before persistence |
| R-35 | Current prototype is not final and must not dictate final architecture | Working method | P0 | Approved | Stage 0 | Prototype is clearly demarcated as demo-only |
| R-36 | Documentation is part of implementation quality | Engineering principles | P0 | Approved | Stage 0+ | ADRs and docs updated with meaningful changes |
| R-37 | Pilot and migration process is required before production | Working method | P1 | Approved | Stage 9+ | Go-live uses a controlled rollout plan |
| R-38 | Privacy requirements for student, guardian, and financial data are mandatory | Security + privacy | P0 | Approved | Stage 2+ | Sensitive fields are access-controlled |
| R-39 | Public and internal domains must remain separate by concern and permissions | Architecture brief | P1 | Approved | Stage 1+ | Public site and internal ERP are separated at product and auth boundaries |
| R-40 | Use only universal product design principles: clarity, reduction, hierarchy, whitespace, precision, consistency, simplicity, usability | Design brief | P0 | Approved | Stage 0+ | UI process avoids noise and trend-driven excess |

## Traceability summary

- Critical requirements covered: 40/40
- Immediate execution gate: Stage 0 approval required before Stage 1 implementation begins
- Rationale: The current prototype does not satisfy authorization, persistence, localization, or data integrity requirements

## Validation approach

Required validation gates by stage:

- Stage 0: Architecture alignment, data plan, brand plan, mock-data isolation, implementation readiness
- Stage 1: Foundation hardening and quality gates
- Stage 2: Auth + domain + persistence baseline
- Stage 3+: Operational feature implementation and final pilot readiness

## Notes

This matrix is intentionally stricter than the prototype's current UX. The product must satisfy institutional operations and security requirements, not just display a complete-looking dashboard.
