# Vehicle Management System (VMS-GOV)

## Project Management Report

| Report item | Detail |
| --- | --- |
| Organization | Chief Ministry, Dakshinapaya, Labuduwa, Galle, Sri Lanka |
| Project | Vehicle Management System (VMS-GOV) |
| Report date | 1 September 2026 |
| Prepared from | Repository implementation, tests, configuration, CI workflow, README, and `AGENTS.md` |
| Overall delivery status | **Amber — functional core implemented; production readiness activities remain** |
| Report perspective | Project management, governance, delivery readiness, risk, and benefits realization |

> This report is a repository-based assessment. It does not replace sponsor approval, user-acceptance testing, a security assessment, production performance testing, or confirmation of budget and schedule.

## 1. Executive summary

VMS-GOV is intended to replace paper-based official vehicle requests with a controlled and auditable digital service. The system combines request approvals, vehicle and driver allocation, driver operations, fleet administration, fuel and maintenance records, issue reporting, notifications, dashboards, and PDF reporting in one role-based application.

The current repository demonstrates that the main functional workflow has been implemented across a React frontend and Laravel API. Seven organizational roles are supported, and server-side authorization is used as the security boundary. The solution also includes multilingual presentation in English, Sinhala, and Tamil, map-based journey selection limited to Sri Lankan territory, audit fields, conflict checks, Web Push notifications, and automated backend feature tests.

From a project-management perspective, the application should be treated as **functionally advanced but not yet evidenced as production-ready**. The most important remaining work is not the addition of more features. It is the completion of delivery controls: enable backend tests in continuous integration, establish production infrastructure and configuration, complete security and privacy reviews, perform structured user-acceptance testing, validate backup and recovery, prepare operational support, and execute a controlled pilot.

The recommended strategy is to freeze nonessential scope, complete a six-stage readiness plan, pilot the system with a limited group, and authorize organization-wide rollout only after measurable exit criteria are met.

## 2. Business case

### 2.1 Problem statement

Paper-based vehicle-request processes create avoidable delays, incomplete records, limited visibility, duplicate allocation risk, and difficulty producing reliable operational reports. Fleet information may be distributed across separate documents, making it harder to monitor vehicle availability, driver assignments, compliance dates, fuel use, maintenance, repairs, and reported issues.

### 2.2 Intended business outcomes

The project is expected to:

- shorten the time required to submit, recommend, allocate, and approve official journeys;
- prevent conflicting vehicle and driver assignments;
- establish a traceable record of decisions, actors, timestamps, and status changes;
- improve visibility of fleet availability, utilization, maintenance, fuel, and repair activity;
- give drivers a clear daily schedule and controlled journey actions;
- improve management reporting and accountability;
- reduce manual duplication and paper handling;
- provide accessible service in English, Sinhala, and Tamil;
- strengthen operational control through role-based access and active-account enforcement.

### 2.3 Success definition

The project will be successful when authorized users can complete the full request-to-trip lifecycle reliably, managers can obtain trusted operational information, allocation conflicts are prevented, records can be audited, and the service can be operated securely with documented support, recovery, and ownership arrangements.

## 3. Scope baseline

### 3.1 In scope and implemented

- Authentication, password recovery, profile management, and account administration.
- Role-based dashboards and protected backend APIs.
- Official vehicle-request creation, attachments, map-selected locations, route calculation, history, details, and eligible cancellation.
- Alternative recommendation paths based on the requester's organizational role.
- Vehicle and driver allocation or reallocation with capacity, availability, and schedule-conflict checks.
- Final approval or rejection with decision auditing.
- Driver schedules, assigned-vehicle information, trip start/completion, journey history, and issue reporting.
- Vehicle and driver registers, including vehicle images and compliance information.
- Fuel, service, repair, fleet analytics, utilization views, and PDF exports.
- User and department administration.
- Database-backed notifications and optional browser Web Push notifications.
- English, Sinhala, and Tamil user-interface localization.
- Sri Lanka-only journey-point selection with frontend and backend territorial validation.

### 3.2 Not evidenced as complete

- Production infrastructure definitions and a repeatable production deployment pipeline.
- Backend test execution in GitHub Actions.
- Formal UAT approval from every role group.
- Independent security, privacy, accessibility, and penetration-test sign-off.
- Load, endurance, and recovery-test evidence.
- Production monitoring dashboards, alert thresholds, incident procedures, and service-level targets.
- A documented data migration and reconciliation process for existing paper or spreadsheet records.
- Organization-wide training, adoption, and post-launch support evidence.
- Excel or CSV reporting beyond the PDF exports verified in the repository.

### 3.3 Recommended scope control

Until the pilot is complete, changes should be limited to defects, security requirements, data-integrity controls, accessibility, deployment readiness, and UAT findings. New feature requests should be recorded in a post-launch backlog and assessed through change control.

## 4. Stakeholders and governance

### 4.1 Stakeholder groups

| Stakeholder | Primary interest |
| --- | --- |
| Executive sponsor / Chief Ministry leadership | Business value, accountability, funding, policy alignment, and go-live authority |
| Project manager | Scope, plan, dependencies, risks, reporting, acceptance, and coordination |
| Product owner / process owner | Workflow correctness, prioritization, business rules, and benefit ownership |
| Department officers and secretariat approvers | Correct queues, decisions, departmental isolation, and auditability |
| Subject officers / fleet operators | Fleet data quality, availability, maintenance, fuel, repair, and allocation operations |
| Drivers | Usable schedules, accurate trip information, journey actions, and issue reporting |
| Employees / requesters | Simple submission, status visibility, cancellation, and timely decisions |
| Technical lead and developers | Architecture, security, code quality, environments, and defect resolution |
| QA and UAT leads | Test coverage, traceability, acceptance evidence, and release recommendation |
| Infrastructure and security teams | Hosting, identity, secrets, backups, monitoring, incident response, and compliance |

### 4.2 Recommended decision structure

- The **sponsor** approves scope, policy, funding, pilot start, and production go-live.
- The **product owner** owns business rules, acceptance criteria, priority, and benefits.
- The **project manager** owns the integrated plan, RAID log, reporting, dependencies, and stage gates.
- The **technical lead** owns technical quality, release contents, environments, and remediation estimates.
- The **QA/UAT lead** owns test evidence and recommends acceptance or rejection.
- The **security/infrastructure owner** approves production controls and operational readiness.

### 4.3 Governance cadence

| Forum | Cadence | Purpose |
| --- | --- | --- |
| Delivery stand-up | Two or three times weekly during hardening | Progress, blockers, defects, and immediate dependencies |
| Project status review | Weekly | Milestones, risks, decisions, scope, and readiness metrics |
| Sponsor steering review | Fortnightly or at each gate | Escalations, policy decisions, budget, scope changes, and gate approval |
| Defect triage | At least twice weekly during UAT | Severity, ownership, target release, and retest status |
| Go-live readiness review | Before pilot and production | Evidence review and formal go/no-go decision |

## 5. Solution overview

```text
Employees and role-based operational users
                    |
                    v
          React 19 / Vite 8 SPA
                    |
           JSON or multipart API
                    v
       Laravel 12 / Sanctum / RBAC
                    |
          SQL database and storage
                    |
     Notifications, Web Push, maps,
      routing, email, and PDF outputs
```

Key management observations:

- The solution separates the frontend user experience from authoritative backend authorization.
- Operational timestamps are stored in UTC and displayed using the configured Sri Lankan timezone.
- Allocation and lifecycle operations include controls for availability, capacity, overlap, and audit history.
- The project depends on configured external geocoding and directions services for map-related functions.
- Web Push depends on stable environment-specific VAPID keys and HTTPS in production.
- The repository contains frontend CI, but the backend CI job is currently disabled.

## 6. Current status assessment

| Area | RAG status | Assessment |
| --- | --- | --- |
| Core request workflow | Green | Submission, recommendation, allocation, final decision, driver execution, completion, rejection, and cancellation paths are represented. |
| Fleet and driver operations | Green/Amber | Core registers and operational views exist; production data quality and reconciliation remain to be proven. |
| Authorization and audit controls | Green/Amber | Server-side RBAC, ownership, department isolation, active-account checks, and audit fields exist; independent security verification is outstanding. |
| Localization | Green/Amber | Three languages are supported; complete role-by-role linguistic UAT remains necessary. |
| Notifications | Green/Amber | Database and Web Push behavior exists; production delivery, permission, browser, and expiry scenarios require operational testing. |
| Reporting and analytics | Amber | PDF and dashboard capabilities exist; report reconciliation, executive acceptance, and KPI definitions need sign-off. |
| Automated quality | Amber | Backend feature coverage is substantial and frontend lint/build CI exists; backend CI is disabled and broader nonfunctional testing is not evidenced. |
| Deployment readiness | Red/Amber | Production infrastructure, repeatable deployment, monitoring, backup/recovery evidence, and rollback procedures are not stored in the repository. |
| User readiness | Amber | Seven user roles are defined, but training, pilot participation, support ownership, and formal UAT approval are not evidenced. |
| Overall | **Amber** | Proceed to controlled hardening and pilot preparation; do not treat repository completion alone as production acceptance. |

Repository indicators at the report date include 12 backend feature-test files with approximately 50 test methods, a role-protected API, and an actively maintained frontend. These figures indicate meaningful engineering maturity but are not substitutes for requirements traceability or acceptance evidence.

## 7. Delivery plan and stage gates

The following is an indicative six-to-eight-week readiness plan. It must be re-estimated after confirming team capacity, infrastructure lead times, procurement constraints, and stakeholder availability.

### Stage 1 — Baseline and scope confirmation

Target: Week 1

- Confirm the product owner, sponsor, operational owner, technical owner, and UAT lead.
- Approve the end-to-end workflow and role-permission matrix.
- Establish a requirements-to-test traceability matrix.
- Freeze nonessential feature scope.
- Open and assign the RAID log.

Exit criteria:

- Signed scope baseline and acceptance approach.
- Named decision owners and pilot participants.
- Approved list of production-critical reports and data fields.

### Stage 2 — Engineering and security hardening

Target: Weeks 1–3

- Enable backend tests and formatting checks in CI.
- Resolve route-role visibility gaps and documentation drift.
- Review token storage, CORS, uploads, file exposure, password recovery, logs, and inactive-account behavior.
- Confirm secrets are never committed and rotate shared or exposed development credentials before production.
- Test workflow concurrency, allocation overlap, retry, notification failure, and invalid state transitions.
- Complete accessibility and responsive checks for every role.

Exit criteria:

- Frontend lint/build and backend tests run automatically on pull requests.
- No open critical or high-severity security or data-integrity defects.
- Security review findings have owners and approved treatment plans.

### Stage 3 — Environment and data readiness

Target: Weeks 2–4

- Establish development, test/UAT, staging, and production configuration boundaries.
- Implement a repeatable deployment and rollback process.
- Configure HTTPS, domain, CORS, database, storage, mail, queue, cache, map services, and Web Push keys.
- Define backup schedules, retention, encryption, restore procedures, and recovery objectives.
- Prepare master-data templates and migration/reconciliation controls for users, departments, vehicles, and drivers.
- Establish monitoring for availability, errors, queues, storage, database health, and external-service failures.

Exit criteria:

- Staging deployment is repeatable from a controlled release artifact.
- Backup restoration is successfully demonstrated.
- Production configuration and secrets are approved by the infrastructure/security owner.
- Migrated sample data reconciles to its approved source.

### Stage 4 — Structured UAT and training

Target: Weeks 4–6

- Execute role-based UAT across the full lifecycle.
- Test English, Sinhala, and Tamil content.
- Validate mobile and desktop behavior, maps, attachments, images, PDFs, notifications, and timezone display.
- Reconcile dashboard and report values against database records.
- Train administrators, subject officers, approvers, drivers, and support personnel.
- Produce quick-reference guides and escalation instructions.

Exit criteria:

- All critical workflows pass UAT.
- No open Severity 1 or Severity 2 defects; lower-severity defects have approved workarounds or release plans.
- Product owner and UAT lead provide written acceptance for the pilot.

### Stage 5 — Controlled pilot

Target: Weeks 6–7

- Pilot with a limited department, vehicle group, and driver group.
- Operate enhanced support and daily defect triage.
- Measure request turnaround, completion, errors, allocation conflicts, and user adoption.
- Compare system records with manual control records during the pilot.

Exit criteria:

- Stable operation for the agreed pilot period.
- No unresolved critical incidents or material reconciliation differences.
- Sponsor accepts the pilot results and authorizes wider rollout.

### Stage 6 — Production rollout and stabilization

Target: Weeks 7–8 and post-launch

- Execute the approved cutover, communication, data load, and verification plan.
- Maintain a defined hypercare period with named technical and business responders.
- Review metrics daily during hypercare and weekly thereafter.
- Transfer ownership to the operational support team.
- Close or transition remaining risks and backlog items.

Exit criteria:

- Operational acceptance is signed.
- Support, monitoring, backup, recovery, and escalation processes are active.
- Benefits tracking has an owner, baseline, and reporting cadence.

## 8. Risk and issue register

| ID | Risk | Probability | Impact | Rating | Recommended response | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Backend automated tests are not enforced in CI, allowing regressions into shared branches. | High | High | Red | Enable backend test and Pint jobs; make required checks part of merge protection. | Technical lead |
| R2 | Production infrastructure and deployment procedures are not defined in the repository. | High | High | Red | Create environment architecture, automated/repeatable deployment, rollback, monitoring, and recovery runbooks. | Infrastructure owner |
| R3 | Personal and operational data may be exposed through weak configuration, uploads, logs, or unmanaged credentials. | Medium | High | Red/Amber | Perform security/privacy review, restrict file access, validate logging, centralize secrets, rotate credentials, and test authorization. | Security owner |
| R4 | External maps, directions, reverse-geocoding, mail, or Web Push services may be unavailable or rate-limited. | Medium | Medium/High | Amber | Confirm service terms and quotas, configure timeouts, preserve graceful fallbacks, monitor failures, and define contingency behavior. | Technical lead |
| R5 | Existing vehicle, driver, user, and historical journey data may be incomplete or inconsistent. | High | High | Red | Define data owners, cleansing rules, import templates, reconciliation totals, exception handling, and approval. | Product/data owner |
| R6 | Users may continue parallel paper processes, weakening data completeness and benefits. | Medium | High | Amber | Approve operating policy, train users, define cutover rules, monitor adoption, and provide hypercare. | Sponsor/product owner |
| R7 | Role or workflow rules may be interpreted differently by departments. | Medium | High | Amber | Obtain signed workflow and authority matrix; convert decisions into acceptance tests and user guidance. | Product owner |
| R8 | Multilingual text or exported reports may contain terminology inconsistencies. | Medium | Medium | Amber | Conduct linguistic UAT and approve an official terminology glossary for all three languages. | UAT lead |
| R9 | Backup, restore, queue recovery, and notification behavior may fail under production conditions. | Medium | High | Amber | Run recovery exercises and failure-mode tests in staging before pilot approval. | Infrastructure owner |
| R10 | Scope expansion during hardening may delay readiness work. | High | Medium | Amber | Apply scope freeze and formal change control; defer noncritical enhancements to the post-launch backlog. | Project manager |

The owner column identifies the recommended accountable role. Named individuals and target dates should be assigned at the first governance review.

## 9. Quality and acceptance strategy

### 9.1 Functional acceptance

Every role should complete realistic end-to-end scenarios, including:

- valid submission and validation failure;
- correct recommendation branch for the requester's role;
- department and ownership isolation;
- rejection, cancellation, repeated action, and invalid transition;
- allocation and reallocation with overlap, availability, and capacity conflicts;
- final approval and driver schedule visibility;
- journey start, completion, and issue reporting;
- release of vehicle and driver status after completion;
- notification creation, read state, Push subscription, and expired subscription handling;
- fleet, fuel, service, repair, image, and driver administration;
- report content and filename verification;
- map selection within Sri Lanka and rejection outside its territory.

### 9.2 Nonfunctional acceptance

- Authorization and inactive-account enforcement for every sensitive endpoint.
- Mobile, tablet, and desktop usability.
- English, Sinhala, and Tamil review by approved users.
- Accessibility checks for keyboard use, focus, labels, contrast, and error messaging.
- Performance under an agreed concurrent-user and data-volume profile.
- Backup restoration and rollback rehearsal.
- Monitoring and alert verification.
- Secure handling of tokens, personal data, attachments, images, and reset flows.
- Cross-browser validation, including Web Push limitations and iOS installation behavior.

### 9.3 Release defect thresholds

- **Severity 1:** No open defects. Examples: data loss, authorization bypass, system-wide outage.
- **Severity 2:** No open defects unless the sponsor, product owner, security owner, and technical lead accept a documented temporary control.
- **Severity 3:** May proceed only with an agreed workaround, owner, and target release.
- **Severity 4:** Prioritized in the normal post-launch backlog.

## 10. Deployment and operational readiness checklist

- [ ] Production architecture and environment ownership approved.
- [ ] Frontend and backend deployment procedures automated or fully documented.
- [ ] HTTPS, domain, API URL, and exact CORS origin verified.
- [ ] Production database access restricted and credentials stored in an approved secrets service.
- [ ] Stable production VAPID keys generated and private keys protected.
- [ ] Database migration and rollback procedure rehearsed.
- [ ] File storage, attachment/image access, retention, and capacity confirmed.
- [ ] Queue, cache, session, mail, routing, geocoding, and Web Push services verified.
- [ ] Backup, retention, restore, recovery-time objective, and recovery-point objective approved.
- [ ] Application, infrastructure, database, and external-dependency monitoring enabled.
- [ ] Incident severity, contact tree, escalation, and communication templates approved.
- [ ] Support hours, first-line support, second-line support, and vendor responsibilities agreed.
- [ ] UAT sign-off and go-live decision recorded.
- [ ] Cutover, rollback, data reconciliation, and hypercare plans approved.

## 11. Change and communication plan

### 11.1 Change-management approach

- Communicate why the system is being introduced and which manual problems it addresses.
- Explain role responsibilities and approval authority before training users on screens.
- Use scenario-based training with realistic vehicle requests and driver schedules.
- Provide separate quick guides for requesters, approvers, fleet operators, administrators, and drivers.
- Identify departmental champions who can support adoption and escalate policy questions.
- Publish cutover rules that explain when paper records stop being authoritative.
- Capture user feedback through a controlled backlog rather than informal direct changes.

### 11.2 Core communications

| Audience | Message | Timing | Owner |
| --- | --- | --- | --- |
| Leadership | Readiness, risks, decisions required, and expected benefits | At each stage gate | Project manager |
| Approvers and officers | Workflow, authority, queue handling, and audit responsibility | Before UAT and rollout | Product owner |
| Drivers | Schedule access, journey actions, issue reporting, and support | Before pilot | Fleet/process owner |
| Employees | Submission process, status tracking, cancellation, and support | Before rollout | Department champions |
| Support and infrastructure | Monitoring, incidents, recovery, and escalation | Before pilot | Technical lead |

## 12. Benefits and KPI framework

Baselines should be collected from the current paper process before the pilot. Targets should then be approved by the sponsor and process owner.

| KPI | Definition | Suggested cadence | Benefit owner |
| --- | --- | --- | --- |
| Request decision turnaround | Median time from submission to final decision | Weekly/monthly | Product owner |
| Allocation turnaround | Time from positive recommendation to complete allocation | Weekly | Fleet/process owner |
| Allocation conflict rate | Attempts rejected because of overlapping vehicle or driver assignments | Weekly | Fleet/process owner |
| Vehicle utilization | Approved/completed journey time or distance by vehicle | Monthly | Subject officer |
| Journey completion rate | Completed journeys as a share of approved journeys due in the period | Weekly/monthly | Fleet/process owner |
| On-time journey start | Journeys started within the approved tolerance window | Monthly | Fleet/process owner |
| Maintenance compliance | Vehicles serviced before the approved due date/odometer threshold | Monthly | Subject officer |
| Fuel efficiency variance | Actual fuel efficiency compared with vehicle baseline | Monthly | Subject officer |
| Issue closure time | Median time from driver issue report to operational resolution | Monthly | Subject officer |
| Digital adoption | Eligible requests completed entirely in VMS-GOV | Weekly during rollout | Product owner |
| Data-quality exception rate | Records failing completeness or reconciliation checks | Weekly during migration/pilot | Data owner |
| Service availability | Percentage of agreed service hours available | Monthly | Infrastructure owner |

## 13. Immediate management actions

The following actions should be initiated first:

1. Appoint named owners for sponsorship, product, project delivery, UAT, security, infrastructure, data, and operations.
2. Approve the workflow, role matrix, production-critical reports, and pilot scope.
3. Enable backend CI and define required merge checks.
4. Complete a security/privacy review and a production secrets-rotation plan.
5. Produce the staging/production architecture, deployment, rollback, backup, restore, and monitoring runbooks.
6. Build a requirements-to-test traceability matrix and role-based UAT pack.
7. Define master-data migration, cleansing, ownership, and reconciliation procedures.
8. Establish the pilot plan, training schedule, support model, and go/no-go criteria.

## 14. Decisions required from the steering group

- Who is the accountable business product owner after project closure?
- Which departments, vehicles, drivers, and users will participate in the pilot?
- What are the approved service hours and support expectations?
- What hosting platform, database, storage, domain, and monitoring services will be used?
- What data must be migrated, and how much historical information is required?
- What privacy classification, retention period, and access-review policy apply to personal and operational records?
- Which reports and KPIs are mandatory for go-live?
- What defect thresholds and pilot duration will authorize organization-wide rollout?
- When does the digital record become authoritative over the paper process?

## 15. Conclusion and recommendation

VMS-GOV has a credible and broad functional foundation aligned with the operational needs of a government vehicle-management process. The repository shows substantial implementation of the core workflow, role controls, fleet operations, driver functions, auditability, localization, notifications, and reporting.

The project should now transition from feature-led development to controlled readiness and adoption. The recommended decision is to **authorize hardening and pilot preparation, but defer unrestricted production rollout until the defined security, CI, infrastructure, UAT, recovery, data, and operational gates are satisfied**.

With disciplined scope control, named ownership, formal acceptance evidence, and a measured pilot, the system is positioned to deliver meaningful improvements in request turnaround, resource utilization, auditability, and management visibility.
