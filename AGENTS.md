# AGENTS.md — Vehicle Management System

This file is the authoritative working guide for humans and coding agents in this repository. Read it before changing code. Keep it synchronized with routes, roles, workflows, schema, scripts, and deployment behavior whenever those change.

## 1. Project purpose

VMS-GOV is a government Vehicle Management System for the Chief Ministry at Dakshinapaya, Labuduwa, Galle, Sri Lanka. It replaces paper-based official-journey requests with a traceable workflow and combines request approvals with vehicle, driver, fuel, service, repair, issue, and user administration.

The implemented system supports:

- authenticated employee accounts and role-based dashboards;
- official vehicle requests, attachments, history, details, and cancellation;
- department, deputy, senior deputy, and secretary review stages;
- vehicle and driver allocation/reallocation with conflict checks;
- driver schedules, trip start/completion, history, assigned vehicle, and issue reports;
- fleet and driver directories, vehicle registration, and driver CRUD;
- vehicle images, compliance data, fuel, service, repair, and utilization views;
- executive dashboard statistics and PDF report generation;
- user, department, profile, password, and account administration;
- English, Sinhala, and Tamil UI localization.

The repository README contains the product overview. When README and executable code disagree, treat routes, middleware, controllers, migrations, and tests as the current behavior and fix stale documentation as part of the change.

## 2. Architecture and technology

```text
Browser
  -> React 19 single-page application (frontend/, Vite 8)
  -> JSON/multipart REST API at /api (backend/, Laravel 12, PHP 8.2+)
  -> Laravel Sanctum bearer-token authentication and server-side RBAC
  -> SQL database (SQLite by default; MySQL configuration is available)
```

Frontend technologies: React Router 7, Axios, Tailwind CSS 4, Lucide/React Icons, Recharts, react-hot-toast, and browser-side PDF helpers.

Backend technologies: Laravel 12, Sanctum 4, Eloquent, database-backed cache/session/queue defaults, PHPUnit 11, Laravel Pint, and seeders/factories.

Important locations:

- `frontend/src/App.jsx`: client route registry.
- `frontend/src/pages/`: page-level screens, mostly grouped by role/domain.
- `frontend/src/components/`: reusable and role-specific UI.
- `frontend/src/api/authApi.jsx`: shared API client/functions. Its current local API base is `http://127.0.0.1:8000/api`.
- `frontend/src/context/`: authentication, role, and language state.
- `frontend/src/i18n/`: English/Sinhala/Tamil dictionaries and page-text translation.
- `frontend/src/utils/`: date/time, driver mapping, and PDF exports.
- `backend/routes/api.php`: API surface and role access rules.
- `backend/app/Http/Controllers/Api/`: API behavior and validation.
- `backend/app/Http/Middleware/RoleMiddleware.php`: server-side RBAC and active-account enforcement.
- `backend/app/Models/`: Eloquent entities, relations, casts, and fillable fields.
- `backend/database/migrations/`: canonical schema history.
- `backend/database/seeders/`: demo users, vehicles, and drivers.
- `backend/tests/Feature/`: workflow and authorization regression tests.
- `.github/workflows/ci.yml`: CI; currently lints/builds the frontend on pushes and PRs to `main`/`develop`. The backend job is currently commented out.

Do not confuse `backend/resources/js` and `backend/vite.config.js` (Laravel scaffold assets) with the production React SPA in `frontend/`.

## 3. User roles and responsibilities

Role values are persisted as exact snake_case strings. Never rename one in only the UI or only the database.

| Role | Responsibilities and implemented access |
| --- | --- |
| `employee` | Create official vehicle requests; view own request list/details/status; cancel an eligible own request; manage own profile/password. |
| `department_officer` | All authenticated requester capabilities; view requests from their own department; recommend or reject pending requests; assign department priority and notes; view department history/dashboard. Department isolation must be enforced server-side. |
| `subject_officer` | Fleet operator: view recommended/approved journeys and issue reports; register/update vehicles; create/update/delete drivers; maintain fuel, service, repair, analytics, and fleet screens. Fleet writes belong only to this role. |
| `deputy_secretary` | System administrator and operational approver: manage users and departments; review department recommendations; submit deputy recommendations; allocate/reallocate vehicles and drivers; view issue reports, approved journeys, executive stats, and fleet/driver records. This role is the only role allowed to register app users. |
| `senior_deputy_secretary` | Review and recommend requests at the senior stage; perform final approval/rejection where permitted; view executive stats and read-only fleet/driver data. |
| `secretary` | Final approval/rejection authority; executive dashboard and organization-wide read-only fleet/driver visibility. |
| `driver` | View personal driver dashboard, schedule, trip history, and assigned vehicle; start/complete assigned journeys; report vehicle issues; create personal vehicle requests. The login user's `employee_id` is associated with a driver record by the implemented mapping rules. |

Notes:

- Some visible labels use the legacy misspellings “Assistance Secreatry” and “Senior Assistance Secretary.” The canonical code roles remain `deputy_secretary` and `senior_deputy_secretary`. Correct labels consistently across translations/UI if product terminology changes; do not silently change persisted role values.
- `ProtectedRoute` improves navigation UX but is not a security boundary. Every sensitive backend route must use `auth:sanctum` and the appropriate `role:` middleware.
- `RoleMiddleware` also rejects inactive accounts. Maintain this behavior for all privileged routes.

## 4. Core business workflows

### 4.1 Authentication and administration

1. Public users may log in and request/reset a forgotten password.
2. Login accepts the supported identity fields defined by `LoginRequest` (including employee-ID login) and returns a Sanctum token.
3. Authenticated users may log out, revoke all tokens, read/update their profile (including multipart profile-picture upload), and change password.
4. Only a deputy secretary may register users, list/delete users, and create/delete departments.
5. A user must be active and have an allowed role to pass privileged API middleware.

### 4.2 Vehicle request and approval lifecycle

The recommendation authority depends on the requester's role; these are alternative branches, not consecutive approval stages:

```text
submitted request
  -> employee request: department officer recommends
     department-officer request: deputy secretary recommends
     deputy-secretary request: senior deputy secretary recommends
  -> deputy secretary allocates vehicle + driver
  -> secretary or senior deputy secretary gives final approval
  -> driver sees scheduled journey
  -> driver starts journey
  -> driver completes journey
```

Requests include requester, purpose, destination, departure/return times, passenger count/names, optional attachment, and workflow audit fields. Allocation records the selected vehicle/driver, allocator, time, parking location, and notification state. Reallocation preserves previous vehicle/driver plus reason, actor, and timestamp.

Key workflow rules enforced by the backend and covered by tests include:

- users see only their own personal request records;
- department officers see only their department's requests;
- only pending requests can receive the relevant recommendation;
- cancellation is limited to the owner and an eligible pre-trip state;
- allocation/reallocation must not double-book vehicles or drivers for overlapping active journeys;
- vehicle capacity must accommodate the passenger count;
- only available/eligible vehicles and drivers may be assigned;
- final approval and rejection are explicit audited transitions;
- trip departure and expected-return timestamps are immutable after creation;
- operational times are stored in UTC and displayed using the configured local timezone (`Asia/Colombo` by default);
- completed trips release/update vehicle and driver operational state;
- issue reporting moves an active journey into the issue state and creates an auditable report.

### 4.3 State vocabulary

Do not invent new status strings in one layer. Search migrations, controllers, UI filters, and tests before changing a lifecycle.

- Request/recommendation states include `submitted`, `pending`, `recommended`, `rejected`, `approved`, `cancelled`, and `completed` according to their respective fields/stages.
- Journey states are `scheduled`, `ongoing`, `issue`, and `completed`.
- Driver duty states are `available`, `on_trip`, and `unavailable`.
- Vehicle states currently include `available`, `scheduled_trip`, `unavailable`, and `maintenance`.
- User accounts use active/inactive status; privileged middleware requires `active`.
- Vehicle issue reports are created with `open` status.

There are multiple state fields on a vehicle request (general status, recommendation data, journey status, allocation/final-decision audit fields). Preserve their distinct meanings and transition them atomically where a workflow action affects more than one entity.

### 4.4 Fleet, maintenance, and reporting

- Executive roles and the subject officer can read vehicle and driver records.
- Only the subject officer can create/update vehicles and manage driver records.
- Vehicle records include identity/specification, capacity, fuel configuration and efficiency, compliance expiries, insurance, assignment, status, images, and JSON-backed service/repair/fuel history.
- Driver records include identity/contact, NIC, licence details/expiry, allocation, duty status, previous journeys, and current assignment.
- Drivers can report issues against their active journey/vehicle. Subject officers and deputy secretaries can read issue reports.
- PDF helpers in `frontend/src/utils/` export directories, detail sheets, approved journeys, fuel, service, repair, and driver issue records. Validate both content and filenames when changing report data.

## 5. Data model

Primary domain entities and relationships:

- `User`: requester; recommender/approver/allocator/admin actor; belongs logically to a department name; owns Sanctum tokens.
- `Department`: unique name and optional creating user.
- `VehicleRequest`: belongs to requesting user; may belong to recommending/allocating/approving/rejecting/cancelling users; may reference current and previous allocated vehicle and driver.
- `Vehicle`: may be assigned to many requests over time and stores embedded JSON arrays for service, repair, fuel, and images.
- `Driver`: may be assigned to many requests and has JSON current/previous assignment data.
- `VehicleIssueReport`: belongs to a driver and optionally a vehicle and vehicle request.

Schema changes must be new reversible migrations. Update model `$fillable`, casts, relationships, validation, serializers, seeders/factories, frontend mapping, and tests as applicable. Never edit an already-deployed migration to change production schema semantics.

## 6. API overview

All paths below are under `/api`. Except login/password recovery, routes require a Sanctum bearer token.

- Public auth: `POST /login`, `/forgot-password`, `/reset-password`.
- Session/profile: `POST /logout`, `/logout-all`; `GET|PUT|POST /profile`; `PUT /profile/password`.
- Deputy administration: `POST /register`; `GET /users`; `DELETE /users/{user}`; `GET|POST /departments`; `DELETE /departments/{department}`.
- Personal requests: `POST|GET /vehicle-requests`; `GET /vehicle-requests/{id}`; `PATCH /vehicle-requests/{id}/cancel`.
- Department review: `GET /department/vehicle-requests[/{id}]`; `PATCH .../{id}/recommendation`.
- Deputy workflow: `GET /approvals/recommendations`, `/approvals/department-recommendations`, `/approvals/vehicle-requests[/{id}]`; `PATCH .../{id}/recommendation`, `/allocate`, `/reallocate`.
- Senior review: `GET /senior-recommendations/vehicle-requests[/{id}]`; `PATCH /senior-recommendations/vehicle-requests/{id}`.
- Final decisions: `GET /final-approvals/vehicle-requests[/{id}]`; `PATCH .../{id}/approve|reject`.
- Operational lists: `GET /approved-journeys`, `/recommended-requests`, `/dashboard/executive-stats` with route-specific roles.
- Driver operations: `GET /driver/dashboard-stats`, `/scheduled-journeys`, `/trip-history`, `/assigned-vehicle`; `PATCH /driver/journeys/{id}/status`; `POST /driver/issue-reports`.
- Issue review: `GET /issue-reports`.
- Fleet: `GET /vehicles`, `/vehicles/id/{id}`, `/vehicles/{registration_number}`, `/drivers`, `/drivers/{driver_id}`; subject officer also has `POST /vehicles`, `POST /vehicles/{registration_number}`, and driver `POST|PUT|DELETE` operations.

Use route-model binding keys exactly as declared: vehicle registration number and driver ID are public lookup keys, while some vehicle endpoints accept the numeric ID. Vehicle updates use `POST` to support PHP multipart parsing.

## 7. Frontend behavior

- `AuthProvider` owns token/user session state; the token is currently stored in `localStorage` as `token`.
- `RoleProvider` and `ProtectedRoute` control role-aware navigation. Add explicit `allowedRoles` to every sensitive route; do not rely only on hiding sidebar links.
- Each role has a dashboard under `frontend/src/pages/dashboard/`.
- Role-specific page folders cover requests, recommendations, department officer, subject officer, deputy secretary, senior deputy secretary, driver, and fleet functions.
- `DashboardLayout`, `Sidebar`, and `Topbar` provide shared chrome.
- Language preference is stored client-side. English (`en`), Sinhala (`si`), and Tamil (`ta`) are supported. Add or change translation keys in all three dictionaries and test text that is dynamically inserted.
- Date/time display should use the shared utilities and `en-LK`/`si-LK`/`ta-LK` locale rather than ad hoc parsing.
- API errors should preserve server validation messages and use the established toast/UI patterns.
- Keep the SPA deploy fallback in `frontend/vercel.json` and do not commit generated `dist/` changes unless a release process explicitly requires them.

## 8. Local setup and commands

Prerequisites: PHP 8.2+, Composer, Node.js 20+, npm, and the selected database driver.

Backend setup (from `backend/`):

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

On Unix-like shells, use `cp` instead of `copy`. Default API URL is `http://127.0.0.1:8000`. Relevant environment settings include `APP_URL`, `APP_LOCAL_TIMEZONE`, `FRONTEND_URL`, `DB_*`, mail/password-reset settings, filesystem, cache, session, and queue configuration. Never commit `.env` or real secrets.

Frontend setup (from `frontend/`):

```bash
npm ci
npm run dev
```

The Vite development URL defaults to `http://localhost:5173`; ensure `FRONTEND_URL`/CORS and the frontend API base agree with the actual hosts.

Quality commands:

```bash
# frontend/
npm run lint
npm run build

# backend/
composer test
php artisan test
./vendor/bin/pint --test
```

For targeted backend verification, use `php artisan test --filter=TestOrMethodName`. Tests default to an in-memory SQLite database per `phpunit.xml`, so do not depend on MySQL-only behavior without explicit coverage.

Seeded development users exist for all seven roles. `UserSeeder` documents their employee IDs/emails and currently assigns the shared development password `Password123`. These credentials are demo-only and must never be used in production. `VehicleSeeder` creates representative fleet data; `DriverSeeder` creates representative drivers.

## 9. Testing expectations

Existing feature coverage includes employee-ID login, user management, driver registration, department-officer request isolation/recommendation, deputy recommendation/allocation workflows, and request recommendation/time behavior.

Every behavior change should test:

- happy path and validation failure;
- unauthenticated (`401`) and wrong-role/inactive-account (`403`) access;
- ownership or department isolation (`403`/`404` as designed);
- invalid state transitions and repeated actions;
- scheduling overlap/capacity/resource availability when allocation changes;
- database side effects and audit actors/timestamps;
- response shape consumed by the frontend;
- frontend lint/build, plus manual role-route and responsive checks for UI changes;
- all three languages and exported PDFs when labels/report fields change.

Use factories for focused tests. Avoid coupling tests to bulk seed data unless the seeder itself is under test. Use `RefreshDatabase` for database-changing feature tests.

## 10. Change task playbooks

### Add or change an API feature

1. Define the authorization and ownership rules first.
2. Add a migration/model relation or cast if persistence changes.
3. Add request validation and transactional controller/service behavior.
4. Register the route inside both Sanctum and the narrowest `role:` middleware.
5. Keep JSON response shapes consistent with existing `{success, message, data}` conventions.
6. Update the API client, page/components, loading/empty/error states, and translations.
7. Add feature tests for permissions, validation, state transitions, and side effects.
8. Run backend tests plus frontend lint/build.

### Add or change a role/function

1. Update the database enum/migration and registration validation.
2. Update `RoleMiddleware` route assignments and backend tests.
3. Update auth role mapping, dashboard redirect, `ProtectedRoute`, sidebar navigation, and page access.
4. Add labels to English, Sinhala, and Tamil translations.
5. Update seeders and this role matrix.
6. Verify the new role cannot access adjacent roles' APIs or screens.

### Change the request workflow

1. Write the allowed transition table before coding.
2. Update all affected request status fields atomically in a database transaction.
3. Preserve immutable trip times and audit fields.
4. Lock/check overlapping allocations before modifying vehicle or driver status.
5. Update every queue/history/dashboard/filter that interprets the state.
6. Cover forward, rejection, cancellation, retry, and concurrency/conflict paths.
7. Update Sections 4 and 6 of this file.

### Change fleet, fuel, service, or repair data

1. Preserve subject-officer-only write access and executive read-only access.
2. Keep database casts and frontend mappers aligned, especially JSON arrays.
3. Validate dates, quantities, costs, odometer/fuel values, images, and file types server-side.
4. Update analytics and relevant PDF exporters.
5. Test multipart requests and old records with null/legacy fields.

### Fix a bug

1. Reproduce it with the smallest failing test or deterministic steps.
2. Fix the owning layer, not only the visible symptom.
3. Add a regression test.
4. Check related roles, statuses, locales, and mobile layouts.

## 11. Engineering conventions and guardrails

- Prefer focused changes that follow existing Laravel/React organization.
- Controllers currently own most domain orchestration; do not introduce a new architecture for a small change. Extract a service only when it clarifies shared or complex transactional logic.
- Use Eloquent relationships and route-model binding; avoid duplicating lookup logic.
- Wrap multi-entity allocation, reallocation, completion, and issue transitions in transactions and use locking where races can double-book resources.
- Validate and authorize on the server. Client checks are convenience only.
- Return `401` for unauthenticated access, `403` for authenticated forbidden access, `404` where resource visibility is intentionally concealed, `422` for validation/state errors, and appropriate success codes.
- Preserve backward-compatible response fields unless all consumers are updated together.
- Store operational timestamps in UTC; convert only at boundaries. Do not mutate scheduled departure/return times during later actions.
- Never log tokens, passwords, reset tokens, NICs, or unnecessary personal data.
- Treat uploaded attachments/profile pictures/vehicle images as untrusted: validate MIME, size, path, and authorization; never trust the original filename as a storage path.
- Do not expose files merely because they exist under `public/`; confirm access requirements before adding uploads.
- Do not hard-code new secrets, production URLs, user IDs, departments, role names, or statuses.
- Keep sample credentials/data clearly non-production.
- Use new migrations for schema evolution and make `down()` reversible when practical.
- Do not modify generated/vendor directories: `frontend/node_modules`, `frontend/dist`, `backend/vendor`, Laravel caches, logs, or runtime storage.
- Do not overwrite unrelated working-tree changes. Inspect diffs before handoff.

## 12. Definition of done

A task is complete only when, as applicable:

- behavior and acceptance criteria are implemented end to end;
- backend authorization matches frontend visibility;
- migrations, models, controllers, routes, API calls, UI, translations, and reports agree;
- loading, empty, success, error, and forbidden states are handled;
- relevant automated tests pass;
- frontend lint and production build pass for frontend changes;
- sensitive data, uploads, concurrency, and timezone implications were checked;
- README and this file were updated if project behavior, commands, roles, architecture, or workflows changed;
- the final diff contains no secrets, generated output, debug statements, or unrelated edits.

## 13. Known implementation notes and current gaps

- CI currently validates only frontend lint/build; backend CI is present but commented out. Run backend tests locally until it is enabled.
- The frontend API base URL is hard-coded in `frontend/src/api/authApi.jsx`; deployment should move this to a Vite environment variable.
- The root README describes MySQL/Linux/Nginx as deployment targets, while Laravel defaults locally to SQLite and no production infrastructure is stored here.
- Some pages are role-specific by navigation but call `withAuth` without an explicit role list. Tighten client guards when touching those routes; the API middleware remains authoritative.
- Root `README.md` includes planned claims such as Excel/CSV reporting that may not have a complete implementation. Verify code before promising a feature.
- Naming uses both “deputy secretary” and the UI label “Assistance Secreatry.” Treat this as legacy terminology pending a coordinated product decision.

When discovering another durable constraint, workflow, or recurring task, add it here in the same change that introduces it.
