# Vehicle Management System — User Manual

**Chief Ministry — Southern Province**  
Dakshinapaya, Labuduwa, Galle, Sri Lanka  
Document version: 1.0  
Prepared: 12 September 2026  
Scope: the screens, permissions, and workflows implemented in this repository at the time of preparation.

## Contents

1. [Purpose and getting started](#1-purpose-and-getting-started)
2. [Roles and responsibilities](#2-roles-and-responsibilities)
3. [Login, password recovery, and settings](#3-login-password-recovery-and-settings)
4. [Navigation and dashboards](#4-navigation-and-dashboards)
5. [Creating a vehicle request](#5-creating-a-vehicle-request)
6. [Request history and cancellation](#6-request-history-and-cancellation)
7. [Recommendation workflow](#7-recommendation-workflow)
8. [Vehicle and driver allocation](#8-vehicle-and-driver-allocation)
9. [Final approval and rejection](#9-final-approval-and-rejection)
10. [Driver operations](#10-driver-operations)
11. [Fleet and driver records](#11-fleet-and-driver-records)
12. [Fuel, service, and repair records](#12-fuel-service-and-repair-records)
13. [Journey analysis and reports](#13-journey-analysis-and-reports)
14. [System administration](#14-system-administration)
15. [Notifications and SMS](#15-notifications-and-sms)
16. [Status and measurement reference](#16-status-and-measurement-reference)
17. [Troubleshooting](#17-troubleshooting)
18. [Daily operating checklists](#18-daily-operating-checklists)
19. [Current limitations and support](#19-current-limitations-and-support)
20. [Screen directory and document references](#20-screen-directory-and-document-references)

## 1. Purpose and getting started

VMS manages official transport requests from submission through recommendation, allocation, final approval, travel, and completion. It also maintains vehicles, drivers, maintenance expenditure, departments, user accounts, and reusable journeys.

To begin, obtain the VMS website address and your User ID from your administrator. You need an active account, a registered mobile number, an internet connection, and a browser. Allow downloads when generating reports. SMS reception depends on the registered phone and the configured gateway; device notifications require separate browser permission.

Use the organization-provided website address. Development addresses such as localhost are not the production website. No passwords or gateway credentials are included in this manual.

Times are normally displayed in Sri Lankan local time (Asia/Colombo). Distances and odometer readings are in kilometers; operational cost reports generally use LKR. Read the units beside each value.

## 2. Roles and responsibilities

Your account role determines the menus, records, and actions available to you. Opening a URL does not grant additional permission.

| Role | Main responsibilities |
| --- | --- |
| Employee | Submit personal requests, follow their progress, view own history, and cancel eligible requests. |
| Department Officer | Review eligible employee and Subject Officer requests within the assigned department; recommend or reject them; assign priority and notes. May also submit personal requests. |
| Subject Officer | Maintain vehicles and driver directory records; review operational journeys and issues; use fuel, service, repair, and journey-analysis screens. May submit personal requests. |
| Assistant/Deputy Secretary | Recommend Department Officer requests; allocate and reallocate vehicles and drivers; review operational records and issues. Also has user, department, and backup administration permission. |
| Senior Assistant/Deputy Secretary | Recommend Deputy Secretary requests and perform final approval or rejection of eligible allocated requests; inspect executive and fleet records. |
| Secretary | Perform final approval or rejection and inspect executive and fleet records. |
| System Administrator | Create and maintain accounts, manage departments and pre-defined journeys, and download database backups. Does not allocate vehicles or approve transport requests. |
| Driver | View assigned journeys and vehicle information, start and complete journeys with meter readings, report issues, and view trip history. May also submit personal transport requests. |

Some menus use the legacy labels “Assistance Secreatry” and “Senior Assistance Secretary.” In this manual, Assistant/Deputy Secretary and Senior Assistant/Deputy Secretary refer to those respective roles.

Department membership affects request routing. Administrators should correct missing or incorrect department assignments before the user submits department-based requests.

## 3. Login, password recovery, and settings

### 3.1 First login and normal login

1. Open VMS.
2. Enter your User ID and password, then select the sign-in button. The current login uses the User ID, not an email address.
3. On successful login, your role dashboard opens.
4. If you received a temporary password by SMS, open User Settings and change it immediately.

For newly registered users, the NIC supplied during account creation becomes the User ID. Administrators may later update this identifier. Use the identifier currently assigned to your account.

### 3.2 Forgotten password

1. Select **Forgot Password** on the login screen.
2. Enter your User ID and registered mobile number.
3. Select **Send temporary password**.
4. If both values match an active account and the gateway accepts the SMS, use the replacement password to sign in.
5. Change the temporary password in User Settings.

A mismatched or invalid phone number produces a warning and no password SMS is sent. The system replaces the password and revokes existing sessions only after the gateway accepts the recovery message. Gateway acceptance is not confirmation that the handset received it. If delivery fails afterward, contact your administrator before repeatedly requesting replacement passwords.

### 3.3 Profile and appearance

Select the settings icon beside your profile in the top bar. User Settings opens over the current page; close it with its close button or backdrop. The separate Settings page is also available.

- Review identity, role, department, and linked driver details where available.
- Edit the mobile number and select **Save** to persist profile changes.
- Upload a JPG, JPEG, PNG, or WebP profile image, up to 5 MB, and save.
- Ask an administrator to correct identity or email fields that appear read-only.
- Choose light or dark appearance. The choice is remembered by the browser.

To change your password, enter the current password, new password, and matching confirmation, then submit. The new password must contain at least eight characters. An incorrect current password or mismatched confirmation prevents the change.

### 3.4 Logout

Select **Logout** in the sidebar when finished, particularly on a shared computer. The current browser's push subscription is removed during logout. A session that has expired or been revoked requires a new login.

## 4. Navigation and dashboards

The sidebar contains your role's work areas. On a phone, open it using the menu button. Wide tables may require horizontal scrolling. Detail dialogs can be closed with their Close button; native dialogs also support Escape.

The top bar provides language selection, notification bell, profile information, and settings. English, Sinhala, and Tamil are supported. Examples and menu names in this manual use English.

The selected language is remembered on this browser and applies to interface labels, dropdown choices, supported validation and workflow messages, confirmation message text, dates, and generated report labels. Names, identifiers, filenames, brands, and entered record data are preserved. Browser-owned controls (such as file pickers and native dialog buttons) follow the browser or operating-system language; SMS and background device-notification text are supplied separately by the server.

| Dashboard | What to use it for |
| --- | --- |
| Employee | Review Pending, Approved, and Rejected request counts and create a new request. Approved counts include completed approved journeys. |
| Department Officer | Monitor department request totals and pending review work; open the recommendation/history screens. |
| Subject Officer | Review fleet status and recorded costs; open vehicle, driver, journey, and maintenance work areas. |
| Assistant/Deputy Secretary | Monitor operational queues and executive statistics, then open recommendation or allocation workspaces. |
| Senior Assistant/Deputy Secretary and Secretary | Review executive statistics and the recommendation/final-decision queues available to the role. |
| Driver | Review personal trip statistics, scheduled assignments, trip actions, and assigned-vehicle information. |
| System Administrator | Review administration information and open account, department, journey, and database management. |

Dashboard request counts represent records. Sidebar badges represent unread notifications and can differ from the number of unfinished requests. When the real-time service is available, affected open role pages update automatically after another user saves a workflow action. A dash or loading indicator is not a confirmed zero; reopen or refresh if a connection was interrupted.

## 5. Creating a vehicle request

Open **Create Vehicle Request**, or use the request form on the Employee Dashboard. The form supports two journey methods.

### 5.1 Common information

| Field | How to complete it |
| --- | --- |
| Purpose of Trip | Enter a clear official purpose; maximum 255 characters. |
| Journey method | Choose map locations or a pre-defined journey. |
| Departure Date & Time | Enter the planned departure in local time. |
| Expected Return | Enter a return date and time later than departure. |
| Total Count | Enter the total number of passengers, from 1 to 100. Capacity is checked again during allocation. |
| Passenger Names | List the travelers; optional, up to 2,000 characters. |
| Attachment | Optionally select one PDF, JPG/JPEG, or PNG file, up to 5 MB. |

Verify the schedule carefully: departure and expected-return times cannot be edited after creation through the normal workflow. If the schedule is wrong, discuss cancellation and replacement with the responsible officer.

### 5.2 Method A: map locations

1. Select **Choose locations on map**.
2. Type the starting location and use **Find on map**, or select the starting point on the map.
3. Repeat for the ending location.
4. Check that both selected points and their labels are correct. Selections must lie inside the supported Sri Lankan territory.
5. Wait for address lookup and driving-route calculation to finish.
6. Review **Calculated Distance** and the route preview.

Typing a place name alone may not be enough: both points must be resolved to coordinates. The server recalculates the driving route on submission, so a failed directions service may prevent submission even if a preview appeared earlier. If a readable address cannot be found, coordinates may be shown as the location label.

### 5.3 Method B: pre-defined journey

1. Select **Choose a pre-defined journey**.
2. Choose a journey from the list configured by the System Administrator.
3. Review its starting location, destination, and approved one-way distance.
4. Complete the purpose, schedule, passengers, and any attachment.

The system copies the saved journey's official locations and manually entered distance into the new request. You cannot override those values in this form. A saved journey does not require a calculated map route; it may have no map geometry. Report an incorrect saved journey to the System Administrator.

### 5.4 Submit and confirm

1. Recheck all required fields and the selected attachment filename.
2. Select **Submit Request** once.
3. Wait for the success message.
4. Open Request History and confirm the new record and its reference, such as **REQ-0065**.

The map option requires a valid calculated route before the button is enabled. The saved-journey option requires a selected journey after the list finishes loading. **Save Draft** is currently disabled; leaving or refreshing an unfinished form can lose its contents.

If the result is uncertain, check Request History before submitting again to avoid duplicates.

## 6. Request history and cancellation

Open **Request History** or **Requests History**. Use the available search and status filters, then select **View** for the required record.

The detail screen presents the saved purpose, route, schedule, passenger information, attachment, recommendation, priority, allocation, final decision, and cancellation/rejection information as applicable. Once travel has been recorded, meter readings and actual distance may also be available. Empty fields indicate information not yet recorded.

To cancel, open an eligible request and use its cancellation action, then confirm. The requester and Assistant/Deputy Secretary have cancellation authority. The current server accepts cancellation of submitted, recommended, allocated, or approved requests unless the journey is completed; rejected requests cannot be cancelled. Coordinate any cancellation after travel has begun with the transport officer. Cancellation updates resource availability according to any remaining assignments and notifies the relevant users.

Cancellation does not erase the request's audit history. An already-cancelled request is not a new cancellation, and a completed journey cannot be cancelled.

## 7. Recommendation workflow

### 7.1 Who recommends a request?

The standard supported review paths are alternatives, not three consecutive recommendations:

| Requester | Recommending officer | Next stage |
| --- | --- | --- |
| Employee or Subject Officer | Department Officer of the same department | Assistant/Deputy Secretary allocation |
| Department Officer | Assistant/Deputy Secretary | Assistant/Deputy Secretary allocation |
| Assistant/Deputy Secretary | Senior Assistant/Deputy Secretary | Assistant/Deputy Secretary allocation |

Other operational roles can access personal request creation, but their recommendation routing is not fully represented by these standard queues. If a Driver, Secretary, or Senior Assistant/Deputy Secretary personal request does not reach a reviewer, contact system support rather than treating it as automatically approved.

### 7.2 Department Officer review

1. Open the department dashboard or **Recommendation History** and its pending-review action.
2. Search or filter for the request and open its review screen.
3. Check the purpose, passengers, route, schedule, and attachment.
4. Select the department priority where appropriate: Critical, High, Medium, or Low.
5. Add recommendation notes where appropriate.
6. Select **Recommend** to forward it for allocation, or **Reject** if it should not proceed.
7. Confirm the result in the department history.

Each Pending Recommendations card shows the requester's saved profile image beside their name and User ID. When the requester has no image, their initials are shown instead.

Only eligible pending requests can be reviewed. Department Officers cannot use this queue to review another department's records.

### 7.3 Deputy and senior recommendations

Open **Pending Recommendations** or **Pending Recommendation**, choose the request, review its details, and submit the recommendation decision. The Deputy Secretary queue covers Department Officer requests; the Senior Deputy Secretary queue covers Deputy Secretary requests.

Recommendation is not permission to begin travel. Allocation and final approval must still follow.

## 8. Vehicle and driver allocation

### 8.1 Allocate a recommended request

Assistant/Deputy Secretary:

1. Open **Pending Approvals** and select the request to open its allocation workspace.
2. Review the recommendation, priority, schedule, passenger count, and route.
3. Inspect available vehicles and driver information for that time interval.
4. Select a suitable vehicle and driver.
5. Enter the required parking/pickup location.
6. Submit the allocation and wait for confirmation.

The Pending Approvals table shows the requester's saved profile image beside their name and User ID, plus the saved start-to-destination route and local departure-to-expected-return time range. If no image is available, it displays their initials instead.

The server checks resource eligibility, overlapping assignments, and passenger capacity. An assignment may be rejected if availability changed while the screen was open. Refresh and choose again. Allocation sends the request to final approval and notifies the requester, linked driver user, and final approvers.

### 8.2 Shared journeys

The system supports compatible overlapping allocations to the same vehicle and driver as a consolidated journey before travel starts. Combined passenger numbers must fit the vehicle. Review existing assignments carefully before assigning shared resources; an overlap is not blanket permission to double-book.

The driver sees the member requests and their individual route/passenger details. Starting and completing the consolidated trip applies common actual meter readings to the grouped requests. Their planned routes remain separate.

### 8.3 Reallocation

Open the existing allocation and use the available reallocation controls. Select the replacement vehicle and/or driver and provide the reason. Reallocation is allowed before the journey starts and repeats the eligibility/conflict checks.

The system records the previous vehicle and driver, reason, actor, and time. The changed assignment requires final approval again. Notify affected travelers operationally if their pickup arrangement changes.

### 8.4 Operational lists

- **Total Approvals:** inspect the official records table and open View for the full read-only audit detail.
- **Approved Journeys:** inspect approved/completed journeys and their travel/allocation information; use the screen's filters and export controls.
- **Daily Schedule Trips:** choose a day to see approved journeys against the driver directory. Drivers with no journey on that day still appear.
- **Pending Journeys:** Subject Officer view of recommended requests awaiting subsequent workflow steps.

## 9. Final approval and rejection

Secretary or Senior Assistant/Deputy Secretary:

1. Open **Pending Approvals** for final decisions.
2. Open the allocated request.
3. Review the purpose, recommendation, schedule, vehicle, driver, and supporting information.
4. Select the available approval or rejection action and complete any displayed confirmation.
5. Confirm that the request moved out of the pending queue.

Approval makes the journey available to the assigned driver as a scheduled journey. The approval SMS includes the request reference, driver name, driver contact number, and vehicle name/registration when present. Rejection records the final decision and notifies the relevant users. The requester should read the decision in VMS and contact the responsible officer if clarification is required.

Use **Total Approvals** to review past final decisions. Viewing a record does not change its decision.

## 10. Driver operations

### 10.1 View scheduled journeys

Open the Driver Dashboard. Check the scheduled assignment and select **View Details** to inspect the requester, purpose, departure and return, passengers, start/destination, vehicle, parking location, and route information.

On smaller screens, some summaries appear only inside View Details. Expand vehicle, compliance, or reallocation information where provided. Maps allow pan and zoom but cannot change the request. A manual pre-defined journey may show text locations and distance without a road map.

### 10.2 Start a journey

1. Identify the correct approved scheduled assignment.
2. Record the vehicle's actual starting odometer reading in kilometers.
3. Enter it in the starting-meter field.
4. Select **Start Trip** and wait for confirmation.

The journey becomes Ongoing. The saved starting reading cannot be changed afterward. Readings must be nonnegative, with no more than two decimal places, and no greater than 99,999,999.99 km.

### 10.3 Complete a journey

1. Open the ongoing or issue journey when travel is finished.
2. Enter its ending odometer reading.
3. Ensure it is at least the starting reading.
4. For an older journey without a starting reading, supply the missing start as requested.
5. Select **Complete Trip**.
6. Verify the recorded actual distance and the Trip History entry.

Actual distance equals ending reading minus starting reading. Completion records the result and updates vehicle/driver availability based on other assignments. For shared journeys, do not submit separate meter totals for each passenger request.

### 10.4 Report an issue

1. Open **Report an Issue**, optionally from the journey card.
2. Select your assigned approved, incomplete journey.
3. Choose Vehicle breakdown, Mechanical issue, Tyre issue, Fuel issue, Accident, Journey delay, Cannot complete journey on time, or Other issue.
4. Optionally provide details, up to 1,000 characters.
5. Select **Submit Report**.

The system creates an Open issue report and changes the journey state to Issue. Relevant officers receive notifications. For an urgent road incident, follow the organization's incident procedure in addition to submitting the record.

### 10.5 Trip history and assigned vehicle

Use **Trip History** to review completed trips, schedule information, allocated round-trip distance, starting/ending readings, and actual distance. “Not recorded” means the measurement is absent, not zero.

Use assigned-vehicle information to check the vehicle identity and available compliance details. If no assignment appears, ask the transport officer to verify the allocation and the driver-account linkage.

## 11. Fleet and driver records

### 11.1 Vehicle directory and registration

Subject Officers maintain vehicle records. Executive roles can inspect fleet records but cannot save fleet changes.

1. Open **Vehicle Directory** and use its search/status controls. Each vehicle row shows its saved vehicle image, or a truck icon when no image is available.
2. Open a vehicle for full details, or use the registration action to add one.
3. Enter registration number, vehicle type, make, model, operational status, and fuel level as required. Select **Add a new vehicle type...** when the type is not listed, then enter the type to save with that vehicle.
4. Add applicable manufacturing year, color, VIN/chassis and engine identifiers, fuel capacity, efficiency and its unit, seat capacity, and technical notes.
5. Complete the revenue-licence, insurance, and emission expiry dates, insurance details, assignment, service information, and images as applicable.
6. Save and check the persisted details.

Registration numbers must be unique. VIN and engine identifiers, if supplied, must also be unique. Seat capacity must be between 1 and 100, fuel level between 0 and 100 percent, and an efficiency value must have a corresponding supported unit.

### 11.2 Edit vehicle data and images

Open the vehicle details editor, change the required fields, and save. Add or remove service, repair, and fuel rows in their corresponding sections before saving the vehicle.

Vehicle images support JPG/JPEG, PNG, and WebP, up to 10 MB each and up to ten uploaded images per images batch. Image removal in the editor takes effect when saved; it removes the stored image as well as its reference. Check the selected images before saving.

There is no general vehicle-delete endpoint in the current application. Use the applicable operational status and contact support for records requiring correction beyond the available editor.

### 11.3 Driver directory

Open **Driver Directory** for fleet maintenance or **Driver Details** for the read-only executive directory. Search and filter by status, then open the driver profile.

Driver information includes ID, full name, NIC, birth date, address, contact number, blood group, licence number/type/expiry, duty/account state, vehicle allocation, and available journey history. Licence expiry badges show red for a past date and green for today or a future date; missing/invalid dates have a neutral appearance.

Subject Officers can create, edit, and delete directory records through the available controls. Save changes and re-open the profile to confirm them. Creating a directory record is separate from creating a login account. For a driver who must sign in, the administrator should use **Create Employee**, select Driver, and complete the additional driver fields; that workflow creates the linked account and directory information together.

Driver login linkage relies on matching identity information. Ask the administrator to correct mismatches if a valid driver account cannot see its assignments. User Management updates synchronize linked driver identity/contact information.

## 12. Fuel, service, and repair records

### 12.1 Record expenditure

Subject Officer:

1. Open the relevant vehicle's details editor.
2. Add a row in Fuel Details, Service Details, or Repair Details.
3. Complete the applicable fields below.
4. Save the vehicle and confirm the entry in the corresponding ledger.

| Record | Required row information |
| --- | --- |
| Fuel | Date, fuel type (diesel or petrol), capacity/quantity, and cost. |
| Service | Service date, service type, and cost. |
| Repair | Repair date, repair type, and cost. |

Costs cannot be negative. Fuel quantities are limited to 0–1,000 per record. The server accepts up to 100 rows in each vehicle's fuel, service, and repair collection. Confirm source dates and amounts before saving; these values drive reports.

### 12.2 Fuel Records

1. Open **Fuel Records**.
2. Keep **All Vehicles** for the combined fleet or select a vehicle registration.
3. Select the year and apply search/fuel-type filters as needed.
4. Review annual Fuel Cost, Filled, Consumed, and Remaining figures.
5. Review Monthly Fuel Overview and Monthly Fuel Cost Overview.
6. Select a chart month or the ledger's month control to narrow the displayed records.
7. Use the PDF export to download the displayed matching records.

The annual cards follow year, vehicle, search, and fuel-type scope independently of the ledger month. “Partial” indicates missing measurements in some months. Months without completed journeys can show zero consumption; a journey with missing measurements is not automatically zero.

### 12.3 Service and Repair Records

Open the relevant ledger, select year/type/search filters, and inspect the monthly chart and record list. Selecting a chart month narrows the ledger; **Show all months** removes that month selection where shown. Use **Export All Listed PDF** or the equivalent export control to include all displayed matching records. Export is disabled if nothing matches.

These ledgers read the saved vehicle record entries. Do not assume an unsaved row in a vehicle editor is already included in a report.

## 13. Journey analysis and reports

### 13.1 Journey Analysis

Subject Officers and Assistant/Deputy Secretaries open **Journey Analysis** to inspect completed requests. Filter by vehicle registration, driver name, and optional completion-date range. Both date boundaries are inclusive in Sri Lankan local time; an end date earlier than the start produces a validation message and no results. Use **Clear filters** to reset.

The table compares allocated round-trip distance with actual travel and shows Extra Fuel. **View more** opens the detailed request, route, schedule, passengers, allocation, approval, attachment, and meter readings. Short route labels in the table omit address detail; full information remains in the dialog.

Monthly charts compare allocated and actual kilometers and show Extra Fuel by completion month. Chart and table totals follow the filters. Shared actual mileage is counted once when matching vehicle, driver, timestamps, and meter readings identify the same consolidated trip; planned member-request distances remain separate.

### 13.2 Understand the calculations

| Measurement | Current calculation |
| --- | --- |
| Planned one-way distance | Server-calculated driving distance or System Administrator's saved manual journey distance. |
| Allocated round-trip distance | Planned one-way distance × 2. |
| Actual distance | Ending odometer − starting odometer. |
| Calculated consumed fuel | Actual kilometers × stored numeric fuel efficiency. |
| Remaining fuel | Recorded filled fuel − calculated consumed fuel for the selected annual scope. |
| Extra Fuel | (Actual distance − allocated round-trip distance) × stored numeric fuel efficiency. |

The current fuel calculations multiply the stored efficiency value without converting efficiency units. Because vehicle records can contain km/l, l/100km, or km/kwh, the figures labeled liters are not a unit-normalized physical consumption measurement. Use recorded refill quantities and costs for the transaction record; have the responsible officer verify the configured efficiency and calculation basis before relying on calculated fuel totals. Negative remaining/extra values are retained. Missing measurements are displayed as not recorded and excluded according to the relevant chart's rules.

### 13.3 Export behavior

| Screen/report | How to export |
| --- | --- |
| Vehicle and driver directories/details | Use the available Generate PDF/Export PDF control; verify the displayed filter or selection scope. |
| Executive Driver Details table | Export includes every driver matching current filters, or the whole directory when unfiltered. |
| Fuel, Service, Repair ledgers | Export all listed matching records; no selection checkboxes are required. |
| Approved Journeys | Use its report/export controls and verify the included journey scope before sharing. |
| Driver Issue Reports | Select individual reports or Select all, then choose Export Selected PDF. |
| Database Management | Download a database backup; this is a technical recovery file, not a normal PDF report. |

Open the downloaded file and verify dates, units, record scope, and totals. Store reports according to the organization's handling requirements; they can include personal and operational details.

## 14. System administration

### 14.1 Create an account

System Administrator or authorized Assistant/Deputy Secretary:

1. Open **Create Employee**.
2. Enter NIC, full name, unique email, and mobile number.
3. Select the correct role.
4. Select a department for Employee, Department Officer, or Subject Officer.
5. If Driver is selected, complete birth date, address, licence number/type/expiry, and blood group. An optional allocated vehicle registration must identify an existing vehicle.
6. Select **Create Account** and wait for confirmation.
7. Tell the user to sign in with the SMS temporary password and change it.

No administrator-entered password is needed. The system generates the password and submits it to TEXTIT.BIZ. If the gateway does not accept that SMS, account creation is rolled back. A success message confirming gateway submission does not guarantee handset delivery. An existing User ID, email, driver NIC, or licence number can cause duplicate validation errors.

### 14.2 User Management

Open **User Management**, locate the user with the available filters/search, and choose the edit action. Review and update User ID, name, email, mobile, department, or account status, then save. Roles are read-only here. A driver user's linked identity/contact data is synchronized.

Active accounts can perform their permitted work. Inactive or suspended accounts cannot pass active-account checks. Use status changes when the intended action is to prevent access. Review the consequences before using Delete: System Administrator accounts cannot be deleted, while other permitted deletions may affect related records. The interface is not a recycle bin.

The old **System Changes** bookmark redirects to User Management; user, department, journey, and database functions have separate screens.

### 14.3 Department Management

1. Open **Department Management**.
2. Enter a unique department name and add it.
3. Confirm that it appears when assigning users.

To remove a department, locate it and confirm its deletion. Deleting a department clears that department assignment from affected users. Reassign those users through User Management so department-based review can continue. There is no department rename operation in the current API.

### 14.4 Journey Management

Only the System Administrator can maintain the pre-defined journey catalogue.

1. Open **Journey Management**.
2. Enter Journey name, Starting location, Destination, and One-way distance (km).
3. Select **Create journey**.
4. To amend an entry, select Edit, change the fields, and select **Update journey**.
5. To remove an entry from future selection, use Delete and confirm.

The journey name supports up to 120 characters and each location up to 255. The distance must be positive and no greater than 99,999.99 km. Enter the one-way distance, not the return total. Existing requests keep their copied locations and distance when the catalogue changes; deleting the catalogue entry does not erase that copied request information.

### 14.5 Database Management

1. Open **Database Management** using an authorized administrative account.
2. Select the backup/download action and wait for it to finish.
3. Check that the file downloaded and store it in an approved secure location.
4. Report any failure to technical support with the time and displayed error.

The operation creates a database backup and removes the temporary server copy after download. It does not provide browser-based restoration. Database backup files alone do not include separately stored attachments, profile photos, or vehicle images; technical staff must back up those files separately. Restore operations belong to the technical administrator's recovery procedure.

## 15. Notifications and SMS

### 15.1 In-app notifications

Open the notification bell to view unread updates. While signed in, new workflow changes arrive immediately through the application's live connection and can also appear as temporary pop-ups. Opening the menu reloads the durable unread list, which remains available if the live connection is interrupted.

Clicking a menu notification attempts to mark it read and then opens the role-appropriate page. A successful read removes it from the unread menu and decreases matching sidebar counts. **Mark all read** clears the unread list. Reading retains the database record and does not approve, allocate, or otherwise complete the related task.

Simply viewing a work page through the sidebar or dismissing a temporary pop-up is not the same as marking its notification read. If the read update fails, the notification can remain unread. Device notifications may open a dashboard rather than a particular request; open the related record from that screen.

### 15.2 Main notification events

| Event | Typical recipients/action |
| --- | --- |
| New request | The appropriate reviewer receives a review notification. |
| Recommendation or rejection | The requester receives an update; a recommendation also notifies the allocation officer. |
| Allocation/reallocation | Requester and linked driver receive updates; final approvers receive an action notice. |
| Final decision | Requester and linked driver receive approval/rejection updates. |
| Cancellation | Relevant requester/driver users receive a cancellation update. |
| Trip start/completion | Requester receives progress updates. |
| Driver issue | Requester, Subject Officer, and Deputy Secretary receive issue notifications. |
| Registration/password recovery | The account mobile receives a temporary-password SMS when the gateway accepts the request. |

### 15.3 SMS messages

SMS is supplied through TEXTIT.BIZ when enabled by technical administration. Valid Sri Lankan mobile numbers in local form, such as 0771234567, are normalized for the gateway. Keep the registered number accurate.

An approved-journey SMS identifies the request and includes **Driver Name**, **Driver Contact Number**, and **Vehicle Name** with registration. Older incomplete records may show Not assigned or Not available. Confirm current details in VMS if an assignment has changed.

For workflow messages, an SMS gateway failure does not reverse the saved workflow transition or its in-app notification. Registration and password recovery have different acceptance rules described above. Never share an SMS temporary password with another user.

### 15.4 Device notifications

Open the bell menu and select the device-alert enable option, then allow browser notification permission. This is separate from SMS. Production Web Push needs a secure HTTPS website and server configuration; supported Apple mobile devices require the site to be installed to the Home Screen.

If permission is blocked, change it in the browser/site settings and retry. Logging out removes the current browser's subscription. Delivery also depends on the device/browser and network state.

## 16. Status and measurement reference

| Term | Meaning |
| --- | --- |
| Submitted / pending review | Request exists and awaits its applicable recommendation. |
| Recommended | Passed recommendation and is ready for allocation. |
| Vehicle allocated | Vehicle/driver selected; final approval is still required. |
| Approved | Final approval recorded. |
| Rejected | A recommendation or final review declined the request; inspect details for the stage. |
| Cancelled | Request withdrawn; retained for history. |
| Scheduled | Approved journey assigned but not started. |
| Ongoing | Driver has started travel. |
| Issue | A driver issue was reported for the journey. |
| Completed | Travel completion recorded. |
| Available / scheduled trip / unavailable / maintenance | Vehicle operational states; eligibility may also depend on the requested time interval. |
| Active/inactive driver | Driver's directory duty state; operational availability also considers assignments. |
| Open issue | Issue report recorded; it is separate from the journey's state. |
| Unread | Notification has not been marked read. It is not a journey approval state. |

Recommendation, overall request, and driver journey statuses describe different stages and may appear together. Read the labels rather than treating every Pending or Approved badge as the same decision.

## 17. Troubleshooting

| Problem | What to check/do |
| --- | --- |
| Cannot sign in | Use User ID rather than email; check password and ask the administrator to confirm active status and identity. |
| Recovery phone mismatch | Enter the number registered against that User ID; ask the administrator to correct an outdated number. |
| SMS not received | Check the registered number, network, and blocked messages. Ask the administrator to compare gateway delivery history with the action time. Acceptance alone is not delivery. |
| Submit Request is disabled | For map mode, resolve both locations and wait for a valid route/address lookup. For saved mode, wait for journeys to load and select one. |
| Form is complete but rejected | Read the validation message; check return after departure, passenger limits, attachment type/size, and selected journey availability. |
| Route cannot be calculated | Recheck points inside Sri Lanka and retry after the routing service is available; use an appropriate pre-defined journey if configured. |
| No pre-defined journeys | Ask the System Administrator to create the needed route. If loading fails, report the error rather than assuming the catalogue is empty. |
| Request missing from reviewer queue | Check requester role/department, review stage, filters, and whether another officer already acted. |
| Allocation rejected | Refresh resource availability; check overlap, shared passenger capacity, active driver, and vehicle eligibility. |
| Driver cannot see trip | Confirm final approval, correct driver allocation, linked login identity, and schedule filters. Allocation alone is insufficient. |
| Cannot start or complete | Check assigned account, journey state, and required odometer readings. End must be at least start. |
| Wrong saved meter reading | Contact the responsible officer/support; the saved starting reading cannot be edited in the normal workflow. |
| Notification badge persists | Open the bell notification or use Mark all read; allow refresh. Viewing a sidebar page alone does not clear it. |
| Empty table/export disabled | Clear overly restrictive filters and verify records exist in the selected scope. |
| PDF did not download | Check browser downloads/permissions, selection requirements, and whether any records match. |
| Backup fails | Technical staff should check database access, backup-tool availability, and private storage permissions. |
| Access denied or record not found | Confirm your role and ownership/department access. Do not use another person's account to work around the restriction. |
| New data does not appear | Check the network connection, then reopen or refresh the page after a confirmed save. Check for a failed request before repeating an action. |

When contacting support, provide your role, page, request reference or vehicle registration, action time, exact error, and reproduction steps. Include a screenshot if useful, with passwords, SMS credentials, and unrelated personal details concealed.

## 18. Daily operating checklists

### Requester

- Check pending updates and current assignment details.
- Verify purpose, route, schedule, passenger count, and attachment before submission.
- Confirm final approval before travel.
- Use the assigned driver's contact details and report changed plans to the transport officer.

### Reviewing and allocating officers

- Review the correct queue and verify priority/supporting information.
- Check time overlap, capacity, and resource eligibility.
- Record the decision and verify its resulting state.
- Review driver issues and coordinate operational follow-up.

### Driver

- Review today's approved assignments and pickup information.
- Record the true starting meter before starting.
- Report issues against the correct journey.
- Record the ending meter, complete the trip, and verify history.

### Administration and fleet staff

- Maintain accurate user mobiles, departments, driver identities, and active states.
- Keep vehicle compliance, status, capacity, and expenditure entries current.
- Review saved journey distances before making them available to requesters.
- Download and secure backups according to the organization's schedule; include separate uploaded-file backups through technical support.

## 19. Current limitations and support

This manual documents functioning controls and distinguishes visible placeholders:

- Save Draft on the vehicle-request form is disabled; no draft recovery is promised.
- Fleet Analytics currently contains fixed illustrative KPI/chart data and unwired time-range/PDF/Excel/export buttons. Do not use that screen as an authoritative financial report. Use saved-record ledgers and operational Journey Analysis instead.
- Separate maintenance-scheduling and fuel-log mock components do not establish a working vendor-notification or scheduling service. Record transactions through the saved vehicle editor workflow described in this manual.
- There is no general Excel/CSV reporting guarantee, browser database-restore facility, vehicle-delete operation, or issue-close endpoint in the current routes.
- Changing a journey from Issue to Completed does not itself establish that its Open issue report has been administratively closed.
- Pre-defined journeys store labels and manual distance, not automatically generated map geometry.
- Some personal requester roles are not covered by the standard recommendation queues; see Section 7.1.
- SMS and Web Push require deployment configuration and external service availability. This manual does not certify that any particular deployment has them enabled.

Contact your Department Officer for request review, the Assistant/Deputy Secretary for allocation, the Subject Officer for fleet records, and the System Administrator for account/department/journey setup. The organization should supply its own helpdesk contact and escalation hours; no contact number is assumed here.

## 20. Screen directory and document references

Use the sidebar or dashboard shortcuts where available. The following paths are relative to your VMS website and still require the correct role.

| Screen | Path |
| --- | --- |
| Login / Forgot Password | / and /forgot-password |
| Employee Dashboard | /userdashboard |
| Department Officer Dashboard | /departmentofficerdashboard |
| Subject Officer Dashboard | /subjectofficerdashboard |
| Deputy Secretary Dashboard | /deputysecretarydashboard |
| Senior Deputy Secretary Dashboard | /seniordeputysecretarydashboard |
| Secretary Dashboard | /secretarydashboard |
| System Administrator Dashboard | /systemadmindashboard |
| Driver Dashboard | /driverdashboard |
| Create Vehicle Request / personal history | /createvehiclerequest and /requesthistory |
| Subject Officer personal history | /subjectofficer/requesthistory |
| Department recommendation/history | /pendingrecommendations and /departmentrequesthistory |
| Deputy recommendation / allocation / records | /deputy/pending-recommendations, /pendingapprovals, /totalapprovals |
| Senior recommendation / final decisions | /senior-deputy/pending-recommendations, /pendingfinalapprovals, /finalapprovals |
| Pending / Approved Journeys | /pendingjourny and /approvedjourny |
| Daily Schedule / Journey Analysis | /dailyscheduletrips and /fuelanalysis |
| Driver Trip History / issue reporting | /tripshistory and /reportvehicle |
| Driver Issue Reports | /ontimeavailability |
| Fleet vehicles / registration / executive vehicles | /vehicledirectory, /registervehicle, /totalvehicles |
| Driver directory / executive driver details | /driverdirectory and /driverdetails |
| Fuel / Service / Repair Records | /fuelmanagement, /servicerecords, /repairrecords |
| Settings | /setting |
| Create Employee / User Management | /register and /usermanagement |
| Department / Journey / Database Management | /departmentmanagement, /journeymanagement, /databasemanagement |
| Illustrative Fleet Analytics | /fleetanalytics |

This manual was checked against the client route registry, sidebar and page components, server routes/controllers, validation rules, workflow notification service, and relevant feature tests. Technical maintainers can consult [AGENTS.md](AGENTS.md), [System Architecture](SYSTEM_ARCHITECTURE.md), and [Role-dependent Vehicle Request Workflow](ROLE_DEPENDENT_VEHICLE_REQUEST_WORKFLOW.md). When the software changes, review affected procedures and revise this manual before distribution.
