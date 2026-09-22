# Vehicle Management System (VMS-GOV)

**Project type:** Government fleet and official-journey management web application  
**Domain:** Public-sector transport operations  
**Location:** Chief Ministry, Dakshinapaya, Labuduwa, Galle, Sri Lanka

## CV-ready entry

**Vehicle Management System (VMS-GOV)** — Built a full-stack web application that digitizes official vehicle requests and replaces paper-based approvals with an auditable, role-based workflow. Developed a React 19/Vite single-page application and Laravel 12 REST API with Sanctum authentication, server-enforced RBAC, real-time Reverb notifications, and SQL persistence. Implemented multi-stage journey approvals, conflict-safe vehicle and driver allocation, trip/odometer tracking, issue reporting, fleet maintenance and fuel records, analytics, PDF reporting, and English/Sinhala/Tamil localization.

## Key highlights

- Designed an eight-role workflow for employees, department officers, fleet officers, deputy and senior deputy secretaries, secretaries, system administrators, and drivers.
- Implemented end-to-end journey handling: request submission, recommendations, allocation/reallocation, final approval, driver scheduling, trip start/completion, cancellation, and issue escalation.
- Enforced workflow integrity on the server with ownership checks, role middleware, validation, database transactions, row locking, overlap checks, vehicle-capacity checks, and immutable schedule/audit fields.
- Added real-time workflow updates through authenticated Laravel Reverb private channels, durable in-app notifications, browser Web Push support, and optional SMS notifications through TEXTIT.BIZ.
- Built fleet operations for vehicle and driver directories, vehicle images/compliance records, fuel, service and repair histories, executive dashboards, utilization views, and filtered PDF exports.
- Integrated Sri Lanka-restricted location search, reverse geocoding, and server-authoritative route/distance calculation via configurable OpenStreetMap/OSRM-compatible services.
- Delivered a responsive multilingual user interface in English, Sinhala, and Tamil, with role-aware dashboards and navigation.

## Technology stack

- **Frontend:** React 19, React Router 7, Vite 8, Tailwind CSS 4, Axios, Recharts, Laravel Echo/Pusher protocol, Web Push/PWA APIs
- **Backend:** PHP 8.2+, Laravel 12, Eloquent ORM, Laravel Sanctum, Laravel Reverb
- **Data and quality:** SQLite/MySQL-compatible SQL database, PHPUnit 11 feature tests, Laravel Pint, ESLint
- **Integrations:** OpenStreetMap Nominatim, OSRM-compatible Directions API, TEXTIT.BIZ SMS gateway, browser Web Push (VAPID)

## Short version (for a compact CV)

Built a role-based government Vehicle Management System using React, Laravel, and SQL to digitize official journey requests, approvals, vehicle/driver allocation, fleet maintenance, fuel tracking, reporting, and real-time notifications. Secured workflow transitions with server-side RBAC, validation, transactions, and conflict checks; delivered English, Sinhala, and Tamil interfaces.
