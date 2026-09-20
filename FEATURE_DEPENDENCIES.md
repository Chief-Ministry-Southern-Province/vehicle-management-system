# Feature Dependencies and Package Reference

This document maps implemented VMS-GOV features to the direct packages, platform APIs, and external services they use. It is intended as a maintenance reference, not as a substitute for the lock files: `frontend/package-lock.json` and `backend/composer.lock` pin the complete resolved dependency trees.

Versions below are the version constraints declared in `frontend/package.json` and `backend/composer.json`.

## Feature map

| Feature | Packages / technologies | Implementation entry points | Configuration or operational note |
| --- | --- | --- | --- |
| SPA and component UI | `react` `^19.2.6`, `react-dom` `^19.2.6` | `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/src/components/`, `frontend/src/pages/` | The production user interface is the React app in `frontend/`, not Laravel's scaffold assets. |
| Client-side navigation and role-aware route guarding | `react-router-dom` `^7.17.0` | `frontend/src/App.jsx`, `frontend/src/routes/ProtectedRoute.jsx` | Frontend guards improve navigation UX; Laravel role middleware remains the security boundary. |
| REST API calls and file/download requests | `axios` `^1.18.1` | `frontend/src/api/authApi.jsx` | Uses `VITE_API_URL` and bearer tokens stored by the current authentication implementation. |
| Token authentication and server-side role access | `laravel/sanctum` `^4.3`, Laravel framework | `backend/app/Models/User.php`, `backend/app/Http/Middleware/RoleMiddleware.php`, `backend/routes/api.php` | Sanctum personal-access tokens secure the API. `auth:sanctum` and `role:` middleware must protect sensitive routes. |
| Real-time workflow updates and in-app notifications | `laravel/reverb` `^1.11`, `laravel-echo` `^2.5`, `pusher-js`, Laravel broadcasting/database notifications | `backend/app/Events/WorkflowUpdated.php`, `backend/app/Services/WorkflowNotificationService.php`, `backend/routes/channels.php`, `frontend/src/context/RealtimeProvider.jsx` | Every signed-in browser subscribes only to `private-workflow.user.{id}` using a Sanctum bearer token at `/api/broadcasting/auth`. Events carry only an action, request ID, and timestamp; the route reloads its normal authorized API data. Configure Reverb server/public browser variables and do not expose `REVERB_APP_SECRET`. |
| Browser Web Push notifications | `laravel-notification-channels/webpush` `^12.1`; browser Service Worker, Push API, Notifications API, VAPID | `backend/config/webpush.php`, `backend/app/Http/Controllers/Api/PushSubscriptionController.php`, `frontend/src/utils/pushNotifications.js`, `frontend/public/push-sw.js` | Generate stable keys with `php artisan webpush:vapid`; configure `VAPID_SUBJECT`, `VAPID_PUBLIC_KEY`, and `VAPID_PRIVATE_KEY`. Production delivery requires HTTPS; the Web Push package owns persisted subscriptions and delivery. |
| SMS delivery and SMS password recovery | Laravel HTTP client (included with `laravel/framework`); TEXTIT.BIZ REST or legacy HTTP gateway | `backend/app/Services/SmsService.php`, `backend/app/Services/WorkflowNotificationService.php`, `backend/app/Http/Controllers/Api/AuthController.php` | There is no separate Composer SMS SDK. Enable only with server-side `TEXTIT_*` settings; never expose the API key to the browser. Gateway failure does not undo a completed workflow notification. |
| PDF exports and printable reports | Native browser `window.open` / `window.print`, HTML/CSS; React data sources | `frontend/src/utils/*Pdf.js`, including `approvedJourneyPdf.js`, `fuelRecordsPdf.js`, `repairRecordsPdf.js`, and directory/detail exporters | No `jsPDF`, `pdfmake`, or server-side PDF package is installed. The browser print dialog creates or saves the PDF, so pop-ups must be allowed. |
| Charts and fleet analytics | `recharts` `^3.8.1` | `frontend/src/pages/fleet/FuelManagement.jsx`, `frontend/src/pages/deputySecretary/FuelAnalysis.jsx`, dashboard and analytics components | Charts are rendered in the client from API records; Recharts is not a reporting/export dependency. |
| Maps, location search, reverse geocoding, and route calculation | Browser `fetch`, custom Web Mercator map component; OpenStreetMap tiles; Nominatim; OSRM-compatible Directions API; Laravel HTTP client | `frontend/src/components/employee/LocationMapPicker.jsx`, `frontend/src/components/employee/VehicleRequest.jsx`, `backend/app/Http/Controllers/Api/VehicleRequestController.php` | No Leaflet, Google Maps, or map SDK package is installed. Configure public `VITE_GEOCODING_API_URL` / `VITE_DIRECTIONS_API_URL` for previews and server-side `GEOCODING_REVERSE_API_URL` / `DIRECTIONS_API_URL` for authoritative results. Preserve OpenStreetMap attribution and provider usage policies. |
| Uploads: request attachments, profile pictures, vehicle images | Browser `FormData`; Laravel request validation and filesystem/storage facilities | `frontend/src/api/authApi.jsx`, `backend/app/Http/Controllers/Api/VehicleRequestController.php`, `backend/app/Http/Controllers/Api/AuthController.php`, fleet controllers | No image-processing or upload-specific package is installed. Laravel validates and stores uploads; allowed request attachments are PDF, JPG, and PNG. |
| Relational data, transactions, migrations, and queues | `laravel/framework` `^12.0`, Eloquent; SQLite or MySQL PHP driver | `backend/app/Models/`, `backend/database/migrations/`, controllers using `DB::transaction()` | SQLite is the local default. Queue, cache, and session drivers are database-backed by default, configured through Laravel environment variables. |
| Database backup download | Laravel filesystem and process facilities; SQLite copy/VACUUM or external `mysqldump`; Axios `Blob` download | `backend/app/Http/Controllers/Api/DatabaseBackupController.php`, `frontend/src/api/authApi.jsx` | No backup Composer package is installed. MySQL/MariaDB backups require a usable `mysqldump` binary; SQLite uses a consistent database copy. |
| Interface notifications and icons | `react-hot-toast` `^2.6.0`, `lucide-react` `^1.23.0`, `react-icons` `^5.6.0` | `frontend/src/App.jsx`, page and component imports | Toasts communicate API/action outcomes; icon libraries supply UI icons only. |
| Localization | Project-owned translation utilities plus browser `Intl` APIs | `frontend/src/i18n/`, `frontend/src/context/LanguageContext.jsx` | No external i18n package is installed. English, Sinhala, and Tamil dictionaries are maintained in the repository. |
| Google OAuth preparation | `@react-oauth/google` `^0.13.5` | `frontend/src/App.jsx` | `GoogleOAuthProvider` is mounted with `VITE_GOOGLE_CLIENT_ID`, but no Google login button/callback or backend token-verification flow is currently implemented. Do not describe Google sign-in as an active authentication method until those pieces are added. |

## Direct package inventory

### Frontend runtime dependencies

| Package | Declared version | Primary purpose |
| --- | --- | --- |
| `@react-oauth/google` | `^0.13.5` | Google OAuth provider setup; see the current implementation limitation above. |
| `@tailwindcss/vite` | `^4.3.1` | Tailwind's Vite integration. |
| `axios` | `^1.18.1` | HTTP client for the Laravel API and file downloads. |
| `laravel-echo` | `^2.5.0` | Authenticated browser subscription to Laravel Reverb workflow channels. |
| `lucide-react` | `^1.23.0` | React icon components. |
| `react`, `react-dom` | `^19.2.6` | SPA rendering. |
| `react-hot-toast` | `^2.6.0` | Toast feedback. |
| `react-icons` | `^5.6.0` | Additional React icon sets. |
| `react-router-dom` | `^7.17.0` | Client-side routes and navigation. |
| `recharts` | `^3.8.1` | Dashboard and fleet charts. |
| `tailwindcss` | `^4.3.1` | Utility-first styling; imported by `frontend/src/index.css`. |

### Backend runtime dependencies

| Package | Declared version | Primary purpose |
| --- | --- | --- |
| `php` | `^8.2` | Required PHP runtime. |
| `laravel/framework` | `^12.0` | REST application, Eloquent, validation, filesystem, HTTP client, notifications, queues, and process helpers. |
| `laravel/reverb` | `^1.11` | Self-hosted Pusher-protocol WebSocket server for private workflow invalidations. |
| `laravel/sanctum` | `^4.3` | API bearer-token authentication. |
| `laravel-notification-channels/webpush` | `^12.1` | VAPID Web Push subscriptions and delivery channel. |
| `laravel/tinker` | `^2.10.1` | Local interactive Laravel shell; not a production feature dependency. |

### Build, quality, and test packages

These packages support development and CI rather than an end-user feature.

| Area | Packages |
| --- | --- |
| Frontend build and linting | `vite` `^8.0.12`, `@vitejs/plugin-react` `^6.0.1`, `eslint` `^10.7.0`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `@types/react`, `@types/react-dom` |
| Backend quality and tests | `phpunit/phpunit` `^11.5.50`, `laravel/pint` `^1.24`, `fakerphp/faker`, `mockery/mockery`, `nunomaduro/collision` |
| Local Laravel tooling | `laravel/pail`, `laravel/sail` |

## Install and configuration checklist

1. Install the locked dependency trees with `npm ci` in `frontend/` and `composer install` in `backend/`.
2. Configure only public browser values in `frontend/.env`: `VITE_API_URL`, `VITE_REVERB_APP_KEY`, `VITE_REVERB_HOST`, `VITE_REVERB_PORT`, `VITE_REVERB_SCHEME`, optional map endpoints, and `VITE_GOOGLE_CLIENT_ID`. Never put SMS, VAPID private, database, Reverb secret, or other secrets in a `VITE_*` variable.
3. Configure server-only integrations in `backend/.env`: database settings, `FRONTEND_URL`, `BROADCAST_CONNECTION=reverb`, the `REVERB_*` server/app values and allowed SPA origins, map service settings, VAPID values, and optional `TEXTIT_*` credentials. Run `php artisan reverb:start` alongside the Laravel API in each environment.
4. For Web Push, run `php artisan webpush:vapid` once per environment and retain the generated key pair.
5. For MySQL/MariaDB database backups, install or configure `mysqldump` (or set `DATABASE_DUMP_BINARY`); no PHP package supplies it.

## Deliberately absent packages

The following capabilities are implemented without a dedicated dependency: PDFs use the browser print workflow; SMS uses Laravel's built-in HTTP client; maps use a custom map component and HTTP calls to OpenStreetMap/Nominatim and OSRM-compatible services; localization uses project code and browser APIs. This means replacing any of those integrations requires an explicit design and package/service decision rather than assuming a hidden SDK is already available.
