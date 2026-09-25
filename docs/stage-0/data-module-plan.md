# Approved Data / Module Plan

## Objective

Define the authoritative module and data model for the SAPIEN Academy platform. This is the baseline for requirements, implementation, and operational controls.

## Institutional defaults

- Country: Pakistan
- City: Islamabad
- Time zone: Asia/Karachi
- Currency: PKR
- Locale defaults: Pakistan-compatible date, time, and currency formatting

## Domain modules

### 1. Public website

Purpose: present the academy to the public and drive application entry.

Modules:
- Home
- About / academy positioning
- Programs and pathways
- Admissions overview
- Contact and location information
- Inquiry form
- Application entry flow

Data model:
- `pages` / content blocks
- `inquiries`
- `applications`
- `application_status_history`

### 2. Admissions and applicant management

Purpose: capture, track, counsel, assess, and convert applicants.

Entities:
- `applicants`
- `applications`
- `application_documents`
- `application_events`
- `admission_decisions`
- `offers`
- `scholarships`
- `enrollment_records`

Key lifecycle:
- Inquiry
- Application
- Review
- Assessment
- Interview
- Offer
- Deposit / enrollment
- Student record creation

### 3. Student information system

Purpose: maintain the authoritative student record.

Entities:
- `students`
- `student_profiles`
- `student_contacts`
- `student_guardians`
- `student_documents`
- `student_enrollment_history`
- `student_status_history`

Key responsibilities:
- tracking student identity and enrollment
- profile and document management
- governance and restrictions on sensitive information access
- history without destructive overwrites

### 4. Academics and curriculum

Purpose: define and deliver academic structure.

Entities:
- `programs`
- `program_modules`
- `batches`
- `cohorts`
- `faculty_assignments`
- `facilities`
- `timetables`
- `sessions`
- `class_events`

### 5. Attendance and class operations

Purpose: manage cohort compliance and academic operations.

Entities:
- `attendance_sessions`
- `attendance_records`
- `attendance_policies`
- `attendance_exceptions`

Rules:
- A session is unique per batch and date unless explicitly modeled otherwise
- Status policy must be explicit and shared centrally
- Non-present statuses must be tracked with reason fields

### 6. Assessments and grading

Purpose: measure learning outcomes and produce academic records.

Entities:
- `assessments`
- `assessment_rubrics`
- `grade_entries`
- `grade_approvals`
- `grade_publications`
- `transcripts`
- `gpa_calculations`

Key rules:
- grades require approval workflow if published
- transcripts are derived from approved data
- no fabricated defaults for missing grades

### 7. Finance and accounting

Purpose: manage fee schedules, payments, scholarships, and receivables.

Entities:
- `fee_plans`
- `invoices`
- `invoice_items`
- `payments`
- `payment_references`
- `payment_gateways`
- `scholarships`
- `refunds`
- `reversals`
- `financial_transactions`
- `reconciliation_records`

Rules:
- Money stored in minor units (e.g., PKR cents or equivalent integer base)
- Payment and refund records are append-only
- No amount is trusted from the client alone
- Invoice statuses derive from validated server-side totals

### 8. Student portal

Purpose: allow authorized student access to relevant data.

Entities:
- `student_portal_access`
- `portal_preferences`
- `notifications`
- `support_requests`

Accessible content:
- profile
- program and cohort
- timetable
- attendance
- academic materials
- assignments and submissions
- results and transcripts
- fees and payments
- documents
- announcements
- support

### 9. Admin operations and reporting

Purpose: operational visibility and institutional governance.

Entities:
- `dashboards`
- `work_queues`
- `reports`
- `report_runs`
- `notifications`
- `task_assignments`

Key use cases:
- what needs attention now
- pending admissions
- attendance risk
- academic risk
- outstanding fees
- document follow-ups
- upcoming classes

### 10. Audit and governance

Purpose: trace consequential actions.

Entities:
- `audit_events`
- `audit_event_types`
- `permission_logs`
- `security_events`

Rules:
- All critical actions must be created server-side
- Immutable event history
- Role and acting user must be recorded
- Not editable by ordinary users

## Shared cross-cutting data

- `users`
- `roles`
- `permissions`
- `capabilities`
- `sessions`
- `notifications`
- `documents`
- `external_integrations`
- `environment_config`
- `regional_settings`
- `system_settings`

## Data integrity rules

- One authoritative source for each entity
- Stable identifiers over display-name duplication
- Foreign-key relationships instead of denormalized source-of-truth fields
- No destructive deletion of academic or financial records without archival policy
- Full history retained for enrollment, grades, fee changes, and status changes

## Data ownership by module

| Module | Ownership | Notes |
|---|---|---|
| Public site | Marketing / admin | public content only |
| Admissions | Admissions team | applicant workflow |
| Student records | Registrar / admin | authoritative records |
| Academics | Academic office | programs, curriculum, grading |
| Attendance | Faculty / academic office | cohort compliance |
| Finance | Finance office | invoicing, payments |
| Portal | Student / guardian | own-view access only |
| Audit | Security / admin | immutable record |

## Implementation priority

Stage 1 will establish the foundational tables and services for:

1. users + auth + permissions
2. regional settings
3. programs + batches
4. students + enrollments
5. admissions + applications
6. finance base + invoice items
7. audit events

## Stage 0 decision

The current mock `mockData.ts` is explicitly not the approved production model. It is retained only as a temporary development seed source and must be isolated before production use.
