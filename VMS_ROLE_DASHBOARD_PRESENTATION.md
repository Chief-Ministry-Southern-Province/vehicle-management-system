# VMS-GOV: Role Dashboards, Responsibilities, and Workflows

> Presentation source for explaining the Vehicle Management System (VMS-GOV) to end users, managers, and administrators. Each `---` section can be used as one presentation slide.

## Slide 1 — Vehicle Management System

**Vehicle Management System (VMS-GOV)**  
Chief Ministry, Dakshinapaya, Labuduwa, Galle

**Purpose:** replace paper-based official-journey requests with a secure, traceable workflow for requests, approvals, vehicle and driver allocation, journeys, fleet operations, and administration.

**Key outcomes**

- One system for employees, approvers, fleet staff, drivers, and administrators.
- Role-based dashboards show each user only the actions relevant to their work.
- Auditable decisions, allocations, re-allocations, trip actions, and issue reports.
- Notifications keep the next responsible role informed.

---

## Slide 2 — How the System Is Organised

```text
Employee / Driver request
        |
        v
Role-specific recommendation
        |
        v
Deputy Secretary allocation (vehicle + driver)
        |
        v
Final decision (Secretary or Senior Deputy Secretary)
        |
        v
Driver executes journey and records actual mileage
        |
        v
Completed trip, records, reports, and fleet analytics
```

The application combines the following work areas:

- Official vehicle requests and approval records
- Vehicle and driver scheduling
- Fleet directory, fuel, service, repair, and compliance records
- Driver journey operations and vehicle issue reporting
- Users, departments, reusable journeys, backups, and policy settings

---

## Slide 3 — Principles for Every User

- Sign in with the account issued by the organization; only active accounts can use protected functions.
- Use the dashboard and navigation options assigned to your role.
- Complete actions in the order shown by the workflow; users cannot bypass approval, allocation, or final-decision controls.
- Check notification alerts and request status frequently.
- Keep request, vehicle, driver, and odometer information accurate because it becomes part of the audit trail.
- Use profile and password functions to keep account information current.

---

## Slide 4 — Roles at a Glance

| Role | Main responsibility | Key dashboard focus |
| --- | --- | --- |
| Employee | Request official transport | Create, track, and cancel own requests |
| Department Officer | Review department requests | Recommend/reject and set priority |
| Subject Officer | Operate fleet records | Vehicles, drivers, fuel, maintenance, issue visibility |
| Deputy Secretary | Operational approval and allocation | Recommendations, allocation, reallocation, administration |
| System Administrator | System administration only | Users, departments, reusable journeys, backups, odometer policy |
| Senior Deputy Secretary | Senior review and final decisions where permitted | Senior recommendations, approvals, executive visibility |
| Secretary | Final authority | Approve/reject and executive oversight |
| Driver | Execute assigned journeys | Schedule, start/complete trips, history, issues |

---

## Slide 5 — Employee Dashboard

**Purpose:** enable staff to request official transport and follow their own requests.

**Tasks performed through the dashboard**

- Create an official vehicle request with purpose, schedule, passengers, and optional attachment.
- Choose either map locations or an approved reusable journey.
- Review the status and history of personal requests.
- Open request details to see recommendation, allocation, final decision, and journey information when available.
- Cancel an eligible request before the trip workflow prevents cancellation.
- Maintain personal profile details and password.

**Employee handoff:** a submitted request goes to the appropriate recommender, normally the Department Officer.

---

## Slide 6 — Creating a Vehicle Request

**Step 1: describe the official journey**

- Enter the official purpose, departure and expected return times, passenger count, and passenger names.
- Attach supporting material when required.

**Step 2: define the route**

- Map journey: select start and destination locations. The system calculates the feasible driving distance and saves route information.
- Reusable journey: select a System Administrator-defined journey. The official locations and one-way distance are copied by the system.

**Step 3: submit and monitor**

- Submit the request.
- Watch the request list, details view, and notifications for the next workflow event.

**Important:** departure and expected-return times are protected after the request is created; enter them carefully.

---

## Slide 7 — Department Officer Dashboard

**Purpose:** provide the first recommendation for employee requests within the officer’s own department.

**Tasks performed through the dashboard**

- View requests submitted by users in the officer’s department.
- Open request details, schedule, passengers, route, and attachments.
- Recommend or reject requests that are pending the department-stage decision.
- Set department priority and recommendation notes.
- Review department request history and dashboard information.
- Create personal vehicle requests when transport is needed for the officer’s own official work.

**Control:** the Department Officer is limited to their own department; they cannot see or decide requests from other departments.

---

## Slide 8 — Recommendation Routing

The recommender depends on the requester’s role. These are alternative routes—not three consecutive recommendations.

```text
Employee request
  -> Department Officer recommendation

Department Officer request
  -> Deputy Secretary recommendation

Deputy Secretary request
  -> Senior Deputy Secretary recommendation
```

After a valid recommendation, the request is available for Deputy Secretary operational allocation.

---

## Slide 9 — Deputy Secretary Dashboard

**Purpose:** manage operational review and allocate the resources required for recommended requests.

**Workflow tasks**

- View department recommendations and requests requiring deputy-stage review.
- Submit the recommendation for Department Officer-originated requests.
- Review recommended request details before allocation.
- Allocate an appropriate vehicle and driver.
- Record parking location and allocation information.
- Reallocate a vehicle or driver when necessary, recording the reason and audit history.
- Monitor approved journeys, issue reports, fleet/driver records, and executive statistics.

**Administrative tasks**

- Register, list, update, and remove users as permitted.
- Create and remove departments.
- Create and download database backups; view backup activity history.

---

## Slide 10 — Allocation and Reallocation Controls

Before allocating, the Deputy Secretary should verify:

- The request has reached the appropriate recommended state.
- The selected vehicle has sufficient passenger capacity.
- The vehicle is available and not in maintenance or another conflicting trip.
- The driver is eligible, available, and not double-booked.
- The schedule does not overlap another active journey for the selected vehicle or driver.

When reallocating:

- Select the replacement vehicle and/or driver.
- State the operational reason clearly.
- The system preserves the previous assignment, actor, time, and reason for audit purposes.

---

## Slide 11 — Senior Deputy Secretary Dashboard

**Purpose:** provide senior-level review and, where allowed, take final decisions.

**Tasks performed through the dashboard**

- Review Deputy Secretary-originated requests at the senior recommendation stage.
- Submit a senior recommendation for eligible requests.
- View requests awaiting final decision.
- Approve or reject requests where final-decision authority is available.
- View executive statistics and read-only vehicle/driver information.

**Key boundary:** this role is an approver and executive viewer; it does not perform fleet record maintenance or operational allocation.

---

## Slide 12 — Secretary Dashboard

**Purpose:** provide final approval or rejection authority and organization-wide oversight.

**Tasks performed through the dashboard**

- Review requests that have reached the final-decision stage.
- Approve or reject an eligible request.
- Review all relevant request details before deciding: purpose, route, schedule, passengers, recommendation, priority, and allocation.
- Access executive dashboard statistics.
- Access organization-wide read-only vehicle and driver information.

**Key boundary:** the Secretary does not allocate vehicles/drivers or edit fleet records.

---

## Slide 13 — Final Decision and Driver Handoff

```text
Deputy Secretary allocates vehicle + driver
        |
        v
Senior Deputy Secretary or Secretary makes final decision
        |
        +-- rejected -> decision and audit record are saved
        |
        +-- approved -> scheduled journey becomes visible to assigned driver
                              |
                              v
                       driver starts and completes the trip
```

Final decisions are explicit, audited transitions. An approved allocation does not itself mean the journey can be executed until it is finally approved.

---

## Slide 14 — Driver Dashboard

**Purpose:** give drivers a focused operational workspace for assigned journeys.

**Tasks performed through the dashboard**

- View personal driver dashboard statistics.
- See the assigned vehicle and scheduled journeys.
- Open journey details: passengers, locations, schedule, route/distance, and applicable requests.
- Start an assigned scheduled journey.
- Complete an ongoing journey.
- View personal trip history.
- Report a vehicle issue against an active journey.
- Create a personal official vehicle request when needed.

**Result:** the driver’s actions update the journey, vehicle, and driver operating states together.

---

## Slide 15 — Driver Trip Workflow and Odometer Readings

```text
Scheduled
  -> Driver starts trip
  -> Ongoing
  -> Driver completes trip
  -> Completed
```

At trip start:

- Enter `start_odometer_km` when the organization requires odometer readings.

At trip completion:

- Enter `end_odometer_km`; the system derives actual distance when both readings exist.

Rules:

- The global odometer policy is set by the System Administrator.
- When readings are required, start/end inputs are mandatory at the applicable action.
- When readings are optional, blank readings may be left blank; any supplied reading is still validated.
- An ending reading cannot be less than the saved starting reading.
- A saved starting reading cannot be changed.

---

## Slide 16 — Driver Issue Reporting

If a vehicle develops a problem during an active journey:

1. Open the active journey in the driver workspace.
2. Submit a vehicle issue report with accurate details.
3. The journey moves into the `issue` state and an auditable report is created.
4. Subject Officers and Deputy Secretaries can review the reported issue.
5. Complete the journey only when operationally appropriate and in line with organizational instructions.

This creates a direct link between the issue, driver, vehicle, and journey instead of relying on informal reporting.

---

## Slide 17 — Subject Officer Dashboard

**Purpose:** maintain operational fleet and driver information.

**Vehicle and driver tasks**

- Register and update vehicles, including specifications, capacity, fuel configuration, compliance dates, status, and images.
- Create, update, and delete driver directory records.
- View fleet and driver information, approved journeys, and issue reports.

**Fleet management tasks**

- Maintain fuel records and review annual/monthly fuel summaries.
- Maintain service and repair records.
- Use fleet analytics, utilization information, directories, and PDFs for reporting.
- Monitor licence, insurance, emission, and revenue-licence information.

**Key boundary:** fleet writes belong to the Subject Officer; executive roles have read-only fleet/driver visibility.

---

## Slide 18 — Subject Officer: Fuel, Maintenance, and Compliance

**Fuel Management**

- Review all vehicles together or select one registration number.
- Filter fuel records by year, month, search term, and fuel type.
- Review filled liters, costs, recorded consumption, remaining fuel, and monthly charts.
- Export the displayed fuel ledger to PDF.

**Service and Repair Management**

- Search and filter service/repair records by type, year, and optional month.
- Maintain vehicle service and repair history.
- Export matching service or repair ledger records to PDF.

**Compliance**

- Maintain revenue-licence, insurance, emission, and relevant vehicle expiry data.
- Use reminder notifications as advance prompts for renewals.

---

## Slide 19 — System Administrator Dashboard

**Purpose:** administer the system without changing individual vehicle-request workflows.

**Tasks performed through the dashboard**

- Create, list, edit, and remove user accounts as permitted.
- Create and remove departments.
- Manage reusable journeys: official start, destination, and manual one-way distance.
- View backup history; create and download a database backup.
- Import a compatible database backup using the required confirmation.
- Set the organization-wide odometer-reading requirement.
- Use the Administration Panel and user/department/database management pages.

**Strict boundary:** System Administrators cannot recommend, allocate, approve, reject, start, complete, or otherwise alter an individual vehicle-request workflow.

---

## Slide 20 — System Administration: Safe Operating Practices

**User administration**

- Registration delivers a generated temporary password by SMS; do not expect the system to reveal a plaintext password.
- Keep employee ID, name, email, phone, department, and account status accurate.
- Driver-user updates synchronize the linked driver directory identity/contact and active state.
- Use the dedicated registration process for role assignment; do not treat user editing as a way to change a driver’s role.

**Database backup and restore**

- Create a current backup before attempting a restore.
- Only an active System Administrator can restore.
- Upload only a same-database-driver, validated backup file and type `RESTORE` exactly.
- A successful import requires signing in again.

---

## Slide 21 — Dashboard Ownership Matrix

| Dashboard/work area | Primary role | Supporting/read-only roles |
| --- | --- | --- |
| My requests and profile | Employee | Department Officer, Driver for their own requests |
| Department review | Department Officer | — |
| Deputy recommendations and allocation | Deputy Secretary | — |
| Senior review and final decisions | Senior Deputy Secretary | Secretary for final decisions |
| Final approvals | Secretary | Senior Deputy Secretary where permitted |
| Driver schedule and trip execution | Driver | — |
| Vehicles, drivers, fuel, service, repairs | Subject Officer | Deputy Secretary, Senior Deputy Secretary, Secretary read-only where available |
| Users, departments, reusable journeys | System Administrator | Deputy Secretary has permitted user/department administration |
| Odometer policy and database restore | System Administrator | — |
| Executive statistics | Deputy Secretary | Senior Deputy Secretary, Secretary |

---

## Slide 22 — Statuses Users Will See

**Request and decision terms**

- `submitted` / `pending` — awaiting the appropriate review action.
- `recommended` — recommendation is complete and the request can continue to allocation/final processing.
- `rejected` — a recorded negative recommendation or final decision.
- `approved` — final decision completed successfully.
- `cancelled` — cancelled by the eligible requester before the trip progresses too far.
- `completed` — journey lifecycle has been completed.

**Operational terms**

- Journey: `scheduled`, `ongoing`, `issue`, `completed`.
- Driver: `available`, `on_trip`, `unavailable`.
- Vehicle: `available`, `scheduled_trip`, `unavailable`, `maintenance`.

Do not treat similarly named statuses as interchangeable: request status, recommendation fields, allocation records, final decisions, and journey status each record a different part of the audit trail.

---

## Slide 23 — Notifications and Accountability

The system uses per-user workflow notifications to prompt the next responsible person. Users should:

- Check notifications after submitting, recommending, allocating, approving, or updating a journey.
- Open the related request or journey rather than relying only on the alert text.
- Record clear notes and reallocation reasons because they remain visible in the workflow history.
- Use the correct role dashboard; client navigation helps users, while server-side role controls protect the actual action.

Notification channels can include in-app alerts, real-time updates, Web Push notifications, and configured SMS messages.

---

## Slide 24 — End-to-End Example

**Scenario: an employee needs transport for an official meeting**

1. The employee creates a request with route, date/time, passengers, and purpose.
2. The Department Officer reviews the department request, sets priority/notes, and recommends it.
3. The Deputy Secretary confirms operational suitability and allocates an available vehicle and driver.
4. The Secretary or eligible Senior Deputy Secretary makes the final decision.
5. The approved journey appears on the assigned driver’s schedule.
6. The driver starts the journey and records readings if required.
7. The driver completes the journey; the system calculates actual distance when both readings exist and returns resources to the appropriate operational state.
8. The completed journey contributes to history, reporting, and fleet analysis.

---

## Slide 25 — Key Takeaways

- Every role has a focused dashboard and a defined handoff to the next role.
- The workflow separates recommendation, operational allocation, final approval, and trip execution.
- Only the Subject Officer maintains fleet/driver records; only the System Administrator manages system-wide settings and restore operations.
- Accurate schedules, assignments, odometer readings, and maintenance records make the system reliable and auditable.
- Follow the dashboard workflow and monitor notifications to prevent delays in official journeys.

---

## Presenter Notes — Suggested Demonstration Order

1. Sign in as an Employee and create a sample request.
2. Sign in as the appropriate recommender and show the recommendation action.
3. Sign in as a Deputy Secretary; show the allocation checks and allocation/reallocation record.
4. Sign in as a final approver; show the approval decision.
5. Sign in as the assigned Driver; show schedule, start, completion, and issue-report actions.
6. Sign in as a Subject Officer; show vehicle, fuel, service, repair, and compliance work areas.
7. Sign in as a System Administrator; show users, reusable journeys, odometer setting, and backup controls.

For a short session, use Slides 1–4, 5–15, 17, 19, 21, and 25. For role-based training, present only the slide(s) for the audience’s role plus Slides 1–4, 22, and 23.
