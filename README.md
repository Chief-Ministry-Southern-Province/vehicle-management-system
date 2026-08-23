# Vehicle Management System (VMS-GOV)

VMS-GOV is a web-based government fleet and official-journey management system for the Chief Ministry at Dakshinapaya, Labuduwa, Galle, Sri Lanka. It replaces paper-based vehicle requests with an auditable digital workflow and provides fleet, driver, maintenance, fuel, reporting, and administrative tools.

## Features

- Create and track official vehicle requests with passenger details and attachments.
- Route requests to the correct recommending authority based on the requester's role.
- Allocate or reallocate eligible vehicles and drivers with capacity and schedule-conflict checks.
- Record final approval or rejection with actor and timestamp auditing.
- Give drivers schedules, journey controls, trip history, assigned-vehicle details, and issue reporting.
- Maintain vehicle and driver directories, compliance data, images, service, repair, and fuel records.
- Provide role-specific and executive dashboards, analytics, and PDF exports.
- Manage users, departments, profiles, passwords, and account status.
- Deliver opt-in workflow alerts through Web Push even when the browser app is closed.
- Present the interface in English, Sinhala, and Tamil.

## Roles

| Role | Main capabilities |
| --- | --- |
| Employee | Submit vehicle requests, view personal history/details, and cancel eligible requests. |
| Department Officer | Review requests from their department, recommend or reject them, and set priority/notes. |
| Subject Officer | Manage vehicles, drivers, fuel, service, repairs, analytics, and approved journeys. |
| Deputy Secretary | Manage users/departments, review applicable recommendations, allocate/reallocate resources, and view executive data. |
| Senior Deputy Secretary | Recommend requests submitted by deputy secretaries and perform permitted final decisions. |
| Secretary | Give final approval or rejection and monitor organization-wide operations. |
| Driver | View assignments, start/complete journeys, review history, and report vehicle issues. |

Persisted role identifiers are `employee`, `department_officer`, `subject_officer`, `deputy_secretary`, `senior_deputy_secretary`, `secretary`, and `driver`.

## Request workflow

The recommending authority depends on the requester's role. These are alternative branches, not consecutive stages:

```text
Employee request            -> Department Officer recommendation
Department Officer request  -> Deputy Secretary recommendation
Deputy Secretary request    -> Senior Deputy Secretary recommendation

Recommended request
  -> Deputy Secretary allocates vehicle and driver
  -> Secretary or Senior Deputy Secretary gives the final decision
  -> Approved journey appears in the driver's schedule
  -> Driver starts journey
  -> Driver completes journey
```

Requests can be rejected or cancelled where their state permits it. Allocation and reallocation retain audit information and prevent incompatible overlapping assignments. Scheduled times are stored in UTC and displayed in the configured local timezone, which defaults to `Asia/Colombo`.

## Technology stack

Frontend:

- React 19, React Router 7, and Vite 8
- Tailwind CSS 4
- Axios, Recharts, Lucide/React Icons, react-hot-toast, and Web Push/PWA service-worker APIs

Backend:

- PHP 8.2+ and Laravel 12
- Laravel Sanctum bearer-token authentication
- Laravel Web Push notification channel with VAPID authentication
- Eloquent ORM and REST-style JSON APIs
- PHPUnit 11 and Laravel Pint

Data and deployment:

- SQLite is the default local/test database; Laravel also supports configured MySQL, PostgreSQL, and SQL Server connections.
- The frontend includes a Vercel SPA fallback configuration.
- Production infrastructure definitions are not currently stored in this repository.

## Architecture

```text
React/Vite SPA (frontend/)
          |
          | JSON or multipart HTTP
          v
Laravel API / Sanctum / RBAC (backend/)
          |
          v
SQL database and configured file storage
```

Frontend route protection controls navigation UX. Backend `auth:sanctum` and role middleware are the authoritative security boundary.

## Repository structure

```text
VMS-GOV/
├── AGENTS.md                 Detailed project/contributor guide
├── README.md                 Project overview and setup
├── .github/workflows/ci.yml  Frontend CI
├── frontend/
│   ├── public/               Static assets
│   ├── src/
│   │   ├── api/              API client functions
│   │   ├── components/       Shared and role-specific UI
│   │   ├── context/          Auth, role, and language state
│   │   ├── i18n/             English, Sinhala, and Tamil text
│   │   ├── layouts/          Dashboard layout/navigation
│   │   ├── pages/            Application screens
│   │   ├── routes/           Client route guards
│   │   └── utils/            Dates, mapping, and PDF exports
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── app/
    │   ├── Http/Controllers/Api/  API behavior
    │   ├── Http/Middleware/       Role enforcement
    │   ├── Http/Requests/         Auth validation
    │   └── Models/                Domain entities
    ├── config/                    Laravel configuration
    ├── database/
    │   ├── migrations/            Schema history
    │   ├── factories/             Test factories
    │   └── seeders/               Development data
    ├── routes/api.php             API routes and permissions
    ├── tests/                     Unit and feature tests
    ├── composer.json
    └── phpunit.xml
```

## Prerequisites

- PHP 8.2+ with required Laravel extensions
- Composer
- Node.js 20+
- npm
- SQLite, MySQL, or another supported database driver

## Local installation

### 1. Clone

```bash
git clone <repository-url>
cd VMS-GOV
```

### 2. Backend

From `backend/`:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan webpush:vapid
php artisan migrate --seed
php artisan serve
```

On Windows PowerShell, replace the copy command with:

```powershell
Copy-Item .env.example .env
```

The API normally starts at `http://127.0.0.1:8000`. The default environment uses SQLite. For MySQL, configure:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vms_gov
DB_USERNAME=root
DB_PASSWORD=
```

Useful settings include:

```dotenv
APP_URL=http://127.0.0.1:8000
APP_LOCAL_TIMEZONE=Asia/Colombo
FRONTEND_URL=http://localhost:5173
VAPID_SUBJECT=mailto:admin@example.gov.lk
VAPID_PUBLIC_KEY=<generated-public-key>
VAPID_PRIVATE_KEY=<generated-private-key>
```

Keep the generated VAPID pair stable for each environment; changing it invalidates existing browser subscriptions. Never expose the private key or commit `.env`. Production Web Push requires HTTPS. On iOS/iPadOS, users must install the site to the Home Screen before enabling notifications.

### 3. Frontend

In a second terminal, from `frontend/`:

```bash
npm ci
npm run dev
```

The client normally starts at `http://localhost:5173`. Its API base is currently `http://127.0.0.1:8000/api` in `frontend/src/api/authApi.jsx`. For deployment, update that configuration and ensure backend CORS `FRONTEND_URL` matches the frontend origin.

## Seeded development accounts

`php artisan migrate --seed` creates one demonstration account per role. All currently use the development-only password `Password123`.

| Role | Employee ID | Email |
| --- | --- | --- |
| Employee | `EMP-001` | `employee@vms.gov` |
| Department Officer | `DEP-001` | `department.officer@vms.gov` |
| Subject Officer | `SUB-001` | `subject.officer@vms.gov` |
| Deputy Secretary | `DEP-SEC-001` | `deputy.secretary@vms.gov` |
| Senior Deputy Secretary | `SR-DEP-SEC-001` | `senior.deputy.secretary@vms.gov` |
| Secretary | `SEC-001` | `secretary@vms.gov` |
| Driver | `DRV-001` | `driver@vms.gov` |

These accounts and seeded fleet records are for local development only. Never use them in production.

## Commands

Frontend, from `frontend/`:

```bash
npm run dev      # start Vite
npm run lint     # run ESLint
npm run build    # create production build
npm run preview  # preview production build
```

Backend, from `backend/`:

```bash
php artisan serve                  # start API
php artisan migrate --seed         # apply schema and seed demo data
php artisan test                   # run all tests
php artisan test --filter=Name     # run targeted tests
composer test                      # clear config and run tests
./vendor/bin/pint --test           # check PHP formatting
```

Laravel's `composer run dev` also starts its server, queue worker, log viewer, and backend scaffold Vite process. The actual React SPA is the separate `frontend/` project, so normal full-stack development still requires its Vite server.

## API summary

The API is mounted under `/api` and provides:

- login/logout and password recovery;
- profile and password management;
- deputy-only user and department administration;
- personal vehicle requests and cancellation;
- department, deputy, and senior-deputy recommendation queues;
- vehicle and driver allocation/reallocation;
- secretary/senior-deputy final approval and rejection;
- fleet and driver directory/detail operations;
- driver statistics, schedule, history, assigned vehicle, journey actions, and issue reports;
- approved journeys, issue review, and executive statistics.
- unread in-app notifications and authenticated Web Push subscription management.

See `backend/routes/api.php` for exact routes and role middleware. Responses generally use `{ success, message, data }`.

## Testing and quality

Backend feature coverage includes employee-ID login, user management, driver registration, department isolation/recommendation, deputy recommendation/allocation, and request/timezone behavior. Tests use in-memory SQLite.

Run the complete relevant checks before submitting cross-stack changes:

```bash
cd backend
composer test

cd ../frontend
npm run lint
npm run build
```

GitHub Actions currently runs frontend lint and build for pushes and pull requests targeting `main` or `develop`. The backend CI job exists but is commented out.

## Security and operational notes

- Backend role middleware, not frontend navigation, determines authorization.
- Privileged routes reject inactive accounts.
- Ownership and department boundaries are enforced in backend queries.
- Treat attachments/images as untrusted; validate type, size, storage path, and access.
- Store operational timestamps in UTC and convert only at display/input boundaries.
- Keep allocation changes transactional to prevent double booking.
- Never log or commit passwords, tokens, reset tokens, NICs, or production personal data.

## Current limitations

- The frontend API URL is hard-coded instead of using a Vite environment variable.
- Backend tests are not enabled in GitHub Actions.
- Production hosting/infrastructure definitions are not included.
- Some client routes authenticate without declaring narrow role lists, although backend APIs enforce authorization.
- PDF exports exist; older claims about Excel/CSV export are not considered implemented without code verification.
- Some UI text retains the legacy spelling “Assistance Secreatry.” Canonical role identifiers remain unchanged.

## Contributing

Read [AGENTS.md](AGENTS.md) before changing code. It is the authoritative guide to roles, workflows, API behavior, engineering rules, task playbooks, tests, and the definition of done.

For every change:

1. Keep backend authorization aligned with frontend visibility.
2. Update migrations, models, validation, API behavior, UI, translations, and reports together when applicable.
3. Add regression tests for behavior and permission changes.
4. Run backend tests and frontend lint/build.
5. Update `README.md` and `AGENTS.md` when roles, commands, architecture, or workflows change.

## Project status

VMS-GOV is under active development. It contains functional request, approval, fleet, driver, administration, localization, and reporting modules, with deployment hardening and broader automated coverage still in progress.

## License

This project is intended for government organizational and internal operational use. Confirm the applicable organizational licensing and distribution policy before external reuse.
