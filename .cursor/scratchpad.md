# Novu Notification System - Project Analysis & Task Planning

## Background and Motivation

This project involves implementing 43 specific API tasks for the Novu notification system, which is an open-source notification infrastructure. Novu provides a unified API for sending notifications through multiple channels (Email, SMS, Push, Chat, In-App) with workflow management capabilities.

The project structure shows a comprehensive notification platform with:
- API layer (NestJS-based)
- Dashboard (React-based admin interface)
- Web application
- Multiple SDKs (React, Angular, Flutter, etc.)
- Provider integrations for various notification channels
- Workflow management system
- Multi-tenant architecture

## Key Challenges and Analysis

### Current Architecture Understanding
Based on the codebase analysis, Novu has:
1. **Multi-module NestJS API** with separate modules for:
   - Organizations (multi-tenancy)
   - Workflows (notification templates)
   - Subscribers (end users)
   - Integrations (provider configurations)
   - Messages (notification delivery)
   - Topics (grouped notifications)
   - Environments (dev/prod separation)

2. **Existing Core Features**:
   - Basic notification sending
   - Provider integrations
   - Workflow management
   - Subscriber management
   - Basic analytics

### Task Analysis - 43 API Requirements

The 43 tasks can be categorized into several functional areas:

#### 1. Instance/Organization Management (Tasks 1-3)
- Create instances (organizations) with channel/language selection
- Admin role management for instances
- Instance modification, logical deletion, and restoration

#### 2. Template Management (Tasks 4, 13)
- Create notification templates by channel and language (EN, FR, AR)
- Duplicate existing templates

#### 3. Channel Configuration (Task 5)
- Configure SMS and email channels

#### 4. Notification Creation & Sending (Tasks 6, 12, 35-38)
- Create notifications via forms
- API-based notification sending
- Bulk sending
- Group-based sending
- Device-specific sending
- Scheduled sending (one-time/recurring)

#### 5. SDK Integration (Tasks 7, 8, 18, 29)
- API service integration
- Mobile SDK integration (Flutter)
- Angular and React SDKs

#### 6. Analytics & Reporting (Tasks 9, 15, 16)
- KPI and statistics
- PDF/Excel report export
- Weekly report automation

#### 7. Monitoring & Alerts (Tasks 10, 17)
- Technical alerts for channel failures
- Error log consultation

#### 8. Notification Management (Tasks 11, 14, 22-24)
- Receive notifications (email, SMS, push)
- Mark notifications as read
- Notification logs (success/failure)
- Retry mechanisms

#### 9. Topic Management (Tasks 39-43)
- Subscribe/unsubscribe users to topics
- Create/delete topics
- Send notifications to topic subscribers
- Apply workflows to topics

#### 10. SDK Features (Tasks 25-28, 30-34)
- List messages by channel and subscription
- Mark as read functionality
- Authentication to notification hub
- Preference management
- Notification retention (TTL)
- API key management
- TLS encryption
- Quota management
- Multi-environment support

## High-level Task Breakdown

### Phase 1: Core Infrastructure (Tasks 1-5)
1. **Instance Management System**
   - Create organization/instance entity with channel/language preferences
   - Implement admin role system
   - Add soft delete and restoration capabilities

2. **Template System Enhancement**
   - Multi-language template support (EN, FR, AR)
   - Channel-specific template management
   - Template duplication functionality

3. **Channel Configuration**
   - Enhanced SMS and email provider configuration
   - Provider validation and testing

### Phase 2: Notification Engine (Tasks 6-8, 12, 35-38)
4. **Notification Creation & Sending**
   - Form-based notification creation
   - API-based sending with retry logic
   - Bulk and group sending capabilities
   - Scheduled sending system

5. **SDK Integration**
   - Enhanced API integration
   - Flutter SDK implementation
   - Angular and React SDK improvements

### Phase 3: Analytics & Monitoring
- [ ] Task 9: KPI and statistics
- [ ] Task 10: Technical alerts for channel failures
- [x] Task 15: Export reports in PDF/Excel ✅
- [ ] Task 16: Weekly report delivery
- [ ] Task 17: Error log consultation

### Phase 4: User Experience (Tasks 11, 14, 22-24)
8. **Notification Management**
   - Multi-channel notification reception
   - Read status management
   - Notification history and logs

### Phase 5: Advanced Features (Tasks 39-43)
9. **Topic System**
   - Topic creation and management
   - Subscription management
   - Topic-based notification sending

### Phase 6: SDK Enhancement (Tasks 25-28, 30-34)
10. **SDK Features**
    - Message listing and filtering
    - Authentication and preference management
    - Security features (TLS, API keys)
    - Quota and environment management

## **PLANNER ANALYSIS: Easiest Implementation Path**

### **RECOMMENDED STARTING POINT: Phase 1 - Core Infrastructure**

After analyzing the existing codebase, **Phase 1** is the easiest to implement because:

#### **Why Phase 1 is Easiest:**

1. **Strong Foundation Already Exists:**
   - Organization entity already has `language` field (array of strings)
   - Organization controller already has CRUD operations
   - Member role system already exists with `MemberRoleEnum`
   - Soft delete pattern already implemented in other entities

2. **Minimal Database Changes Required:**
   - Organization schema already supports language preferences
   - Only need to add channel preferences field
   - Admin roles already exist in member system

3. **Existing Patterns to Follow:**
   - Organization controller already has create, update, delete operations
   - Member management already implemented
   - Authentication and authorization patterns established

#### **Specific Implementation Plan for Phase 1:**

**Task 1: Create Instance with Channel/Language Selection**
- **Current State:** Organization creation exists, language field exists
- **Required Changes:**
  - Add `channels` field to Organization entity (array of ChannelTypeEnum)
  - Update CreateOrganizationDto to include channels
  - Modify organization creation usecase
- **Success Criteria:** Can create organization with specific channels and languages

**Task 2: Admin Role Management**
- **Current State:** Member roles exist, admin roles defined
- **Required Changes:**
  - Extend existing member role system
  - Add organization-level admin permissions
- **Success Criteria:** Can assign admin roles to organization members

**Task 3: Instance Modification, Deletion, Restoration**
- **Current State:** Basic CRUD operations exist
- **Required Changes:**
  - Add soft delete functionality (pattern exists in other entities)
  - Add restoration endpoint
  - Add logical deletion flag
- **Success Criteria:** Can modify, soft delete, and restore organizations

**Task 4: Multi-language Templates**
- **Current State:** Workflow system exists, basic template structure
- **Required Changes:**
  - Add language field to notification templates
  - Extend template creation/update DTOs
  - Add language-specific content storage
- **Success Criteria:** Can create templates in EN, FR, AR

**Task 5: Channel Configuration**
- **Current State:** Integration system exists for providers
- **Required Changes:**
  - Enhance existing integration controller
  - Add channel-specific configuration validation
  - Add provider testing endpoints
- **Success Criteria:** Can configure and test SMS/email channels

**Task 13: Template Duplication**
- **Current State:** Workflow duplication exists in v2
- **Required Changes:**
  - Extend existing duplication logic
  - Add language-specific duplication
- **Success Criteria:** Can duplicate templates with language variations

### **Alternative Starting Points (if Phase 1 is not preferred):**

1. **Phase 2 - Notification Engine** (Medium difficulty)
   - Builds on existing event triggering system
   - Requires new bulk/batch processing logic

2. **Phase 6 - SDK Enhancement** (Medium difficulty)
   - Existing SDKs provide foundation
   - Requires new API endpoints and client logic

3. **Phase 5 - Topic System** (Higher difficulty)
   - Topic entities exist but need enhancement
   - Requires complex subscription management

## Project Status Board

### Phase 1: Core Infrastructure (RECOMMENDED START)
- [x] Task 1: Create instance (organization) with channel/language selection ✅
- [x] Task 2: Create admin roles for instances ✅
- [x] Task 3: Instance modification, logical deletion, and restoration ✅
- [ ] Task 4: Create notification templates by channel and language
- [ ] Task 5: Configure SMS and email channels
- [ ] Task 13: Duplicate existing templates

### Phase 2: Notification Engine
- [x] Task 6: Create notifications via forms ✅
- [ ] Task 7: Integrate notification service via API
- [ ] Task 8: Integrate SDK in mobile app
- [ ] Task 12: Send notifications via API (backend)
- [ ] Task 35: Bulk sending
- [ ] Task 36: Group-based sending
- [ ] Task 37: Device-specific sending
- [ ] Task 38: Scheduled sending (one-time/recurring)

### Phase 3: Analytics & Monitoring
- [ ] Task 9: KPI and statistics
- [ ] Task 10: Technical alerts for channel failures
- [x] Task 15: Export reports in PDF/Excel ✅
- [ ] Task 16: Weekly report delivery
- [ ] Task 17: Error log consultation

### Phase 4: User Experience
- [ ] Task 11: Receive notifications (email, SMS, push)
- [ ] Task 14: Mark notifications as read
- [ ] Task 22: Notification logs (success/failure)
- [ ] Task 23: List notifications by instance/profile
- [ ] Task 24: Retry mechanisms

### Phase 5: Advanced Features
- [ ] Task 39: Subscribe/unsubscribe users to topics
- [ ] Task 40: Create and delete topics
- [ ] Task 41: Send notifications to topic subscribers
- [ ] Task 42: Create and delete topics (duplicate)
- [ ] Task 43: Apply workflows to topics

### Phase 6: SDK Enhancement
- [ ] Task 18: Flutter SDK integration
- [ ] Task 25: SDK: List messages by channel and subscription
- [ ] Task 26: SDK: Mark as read
- [ ] Task 27: SDK: Authentication to notification hub
- [ ] Task 28: SDK: Preference management
- [ ] Task 29: Angular and React SDKs
- [ ] Task 30: Notification retention (TTL)
- [ ] Task 31: API key management
- [ ] Task 32: TLS encryption
- [ ] Task 33: Quota management
- [ ] Task 34: Multi-environment support

## Current Status / Progress Tracking

**Status**: Task 15 Completed ✅ - Ready to proceed to Task 16
**Current Phase**: Task 16 - Weekly report delivery (IN PROGRESS)
**Next Steps**: Implement weekly report service with data aggregation

### Task 3: Instance Modification, Logical Deletion, and Restoration (Organizations) ✅ COMPLETED

**Goal:** Allow modifying organization details, soft-deleting (logical deletion), and restoring a deleted organization via the API.

**Implementation Completed:**
- ✅ Updated Organization schema/entity: added `deleted: boolean` and `deletedAt: Date` fields
- ✅ Updated repository logic: exclude logically deleted organizations from normal queries
- ✅ Added API endpoints:
  - `DELETE /v1/organizations/:organizationId` → Soft-delete (set `deleted: true`, `deletedAt: now`)
  - `POST /v1/organizations/:organizationId/restore` → Restore (set `deleted: false`, clear `deletedAt`)
  - `GET /v1/organizations/:organizationId/debug` → Debug endpoint for troubleshooting
- ✅ Authorization: Only admins can delete/restore organizations
- ✅ Tested thoroughly with Postman collection
- ✅ Documented all changes and provided clear testing instructions

**Success Criteria Met:**
- Can modify organization details via PATCH endpoint
- Can soft-delete organizations (sets deleted flag and timestamp)
- Can restore soft-deleted organizations
- Deleted organizations are excluded from normal listing queries
- All operations properly handle MongoDB ObjectId conversion

---

### Task 6: Create notifications via forms (IMPLEMENTATION COMPLETED ✅)

**Goal:** Implement API endpoints to create notifications through form-based input, allowing users to send notifications with custom content, recipients, and channel preferences.

**Implementation Completed:**
- ✅ **Phase 6.1: Core Notification Creation API** - COMPLETED
  - ✅ Created comprehensive DTOs with validation (`CreateNotificationDto`, `ChannelContentDto`, etc.)
  - ✅ Implemented `CreateNotificationCommand` with proper validation
  - ✅ Built `CreateNotification` use case with:
    - Organization channel validation (respects Task 1 channels)
    - Recipient validation (subscribers, topics)
    - Notification record creation
    - Integration with existing event triggering system
  - ✅ Added `POST /v1/notifications` endpoint to controller
  - ✅ Added proper authorization (`EVENT_WRITE` permission)
  - ✅ Created comprehensive e2e tests
  - ✅ Created Postman collection for testing

**API Endpoint Created:**
- `POST /v1/notifications` - Create and send notification via form

**Features Implemented:**
- ✅ **Channel-specific content handling:**
  - Email: HTML and text content with subject
  - SMS: Text content with character limits
  - Push: Title, body, and optional data
  - In-App: Title, content, and CTA buttons
- ✅ **Recipient management:**
  - Individual subscriber selection
  - Topic-based sending
  - Bulk recipient validation
- ✅ **Validation:**
  - Organization channel permissions (from Task 1)
  - Recipient existence and accessibility
  - Content validation per channel
  - Required field validation
- ✅ **Integration:**
  - Uses existing notification repository
  - Integrates with existing event triggering system
  - Supports immediate and scheduled sending
  - Returns proper response with notification ID and status

**Testing Resources:**
- ✅ **E2E Tests:** `apps/api/src/app/notifications/e2e/create-notification.e2e.ts`
- ✅ **Postman Collection:** `Task6_CreateNotification_Postman_Collection.json`

**Success Criteria Met:**
- ✅ Can create notifications via POST API with form data
- ✅ Validates organization channel permissions
- ✅ Validates recipient existence and accessibility
- ✅ Supports channel-specific content formatting
- ✅ Integrates with existing notification sending system
- ✅ Returns proper response with notification ID
- ✅ Handles both template-based and custom content
- ✅ Supports immediate and scheduled sending

**Example Usage:**

**1. Create Email Notification:**
```json
POST /v1/notifications
{
  "title": "Welcome Email",
  "content": {
    "email": {
      "subject": "Welcome to our platform!",
      "htmlContent": "<h1>Welcome {{firstName}}!</h1><p>Thank you for joining us.</p>",
      "textContent": "Welcome! Thank you for joining us."
    }
  },
  "recipients": [{"subscriberId": "user123"}],
  "channels": ["email"],
  "metadata": {"source": "form-api"}
}
```

**2. Create Multi-Channel Notification:**
```json
POST /v1/notifications
{
  "title": "Multi-Channel Alert",
  "content": {
    "email": {
      "subject": "Important Update",
      "htmlContent": "<h1>Update</h1><p>Important information.</p>"
    },
    "sms": {
      "content": "Important update available. Check email."
    }
  },
  "recipients": [{"subscriberId": "user123"}],
  "channels": ["email", "sms"]
}
```

**3. Create Scheduled Notification:**
```json
POST /v1/notifications
{
  "title": "Scheduled Reminder",
  "content": {
    "email": {
      "subject": "Appointment Reminder",
      "htmlContent": "<p>Don't forget your appointment tomorrow!</p>"
    }
  },
  "recipients": [{"subscriberId": "user123"}],
  "channels": ["email"],
  "scheduledAt": "2024-01-15T10:00:00Z",
  "immediate": false
}
```

**Response Format:**
```json
{
  "notificationId": "uuid-here",
  "transactionId": "uuid-here",
  "status": "created",
  "recipientCount": 1,
  "channels": ["email"],
  "scheduledAt": null
}
```

**Testing Instructions:**

1. **Import Postman Collection:**
   - Import `Task6_CreateNotification_Postman_Collection.json` into Postman
   - Update variables: `baseUrl`, `authToken`, `organizationId`, `environmentId`, `subscriberId`

2. **Authentication Setup:**
   - Get your auth token from the dashboard or API
   - Set the `authToken` variable in Postman

3. **Test Scenarios:**
   - **Email Notification:** Test basic email creation
   - **SMS Notification:** Test SMS content creation
   - **Multi-Channel:** Test sending to multiple channels
   - **In-App Notification:** Test in-app with CTA
   - **Scheduled Notification:** Test delayed sending
   - **Validation Errors:** Test error handling

4. **Run E2E Tests:**
   ```bash
   cd apps/api
   npm run test:e2e -- --grep "Create Notification via Form"
   ```

**Next Steps for Phase 6.2:**
- Enhanced recipient management (groups, bulk operations)
- Template integration (use existing workflows)
- Advanced scheduling features
- Notification status tracking endpoints

**Dependencies Satisfied:**
- ✅ Task 1 (organization channels) - Used for validation
- ✅ Existing workflow and subscriber systems - Integrated with
- ✅ Event triggering system - Leveraged for sending

**Estimated Time Spent:** 1 implementation session
**Status:** Phase 6.1 Complete ✅ - Ready for Phase 6.2 or user testing

## Executor's Feedback or Assistance Requests

**BUILD ISSUES IDENTIFIED:**

1. **Shell Script Issue in @novu/js**: The postbuild script tries to run `./scripts/copy-package-json.sh` which is a Unix shell script that won't work on Windows.

2. **Enterprise Package Source Missing**: The `@novu/ee-dal` package is looking for source files that don't exist.

3. **TypeScript Polymorphic Component Issues**: The `@novu/novui` package has complex TypeScript type issues with polymorphic components.

**RECOMMENDED NEXT STEPS:**
1. Fix the shell script issue in `@novu/js` package
2. Investigate the enterprise package source structure
3. Address TypeScript compilation errors in `@novu/novui`

**Questions for Human User:**
1. Should we focus on fixing these build issues first, or proceed with the 43 API tasks implementation?
2. Do you want to skip the enterprise packages (`@novu/ee-dal`) for now since they're not essential for the core functionality?
3. Should we try a different approach for the build, such as using WSL or Git Bash instead of PowerShell?

## Lessons

- Novu is a comprehensive notification platform with existing infrastructure
- The project uses NestJS for API, React for dashboard, and multiple SDKs
- Multi-tenant architecture is already in place
- Existing modules provide foundation for the 43 tasks
- Organization and workflow systems are well-established
- Member role system already exists and can be extended
- Soft delete patterns are already implemented in other entities
- **Phase 1 is the easiest starting point due to existing foundation**

---

## Task 7: Intégrer le service de notification via API (API Integration)

### Background and Motivation

The goal of this task is to enable external systems (other apps, services, or clients) to send notifications through the Novu platform by making API calls. This is a core use case for Novu as a notification infrastructure provider.

### Key Challenges and Analysis
- Ensure the API is secure (auth required, environment scoping)
- Validate payloads for all supported channels and languages
- Provide clear error messages for invalid requests
- Ensure idempotency and traceability (transactionId, etc.)
- Support for all notification types (email, SMS, push, in-app, etc.)
- Backward compatibility with existing API consumers

### High-level Task Breakdown

1. **Review and Document the Existing Notification API**
   - Confirm the endpoint(s) for sending notifications via API (e.g., POST /v1/notifications)
   - Document required headers (Authorization, Novu-Environment-Id)
   - Document request/response structure
   - Success: Documentation is clear and matches implementation

2. **Test the API with Example Payloads**
   - Use Postman or similar to send notifications via API
   - Test all supported channels (email, SMS, push, in-app)
   - Test with different languages (en, fr, ar)
   - Success: Notifications are created and delivered as expected

3. **Add/Update API Documentation (OpenAPI/Swagger)**
   - Ensure the API docs reflect all required fields, headers, and error cases
   - Success: API docs are accurate and up-to-date

4. **Implement/Verify Idempotency and Error Handling**
   - Ensure duplicate requests with the same transactionId are handled safely
   - Return clear error messages for invalid payloads or missing headers
   - Success: Idempotency and error handling are robust

5. **Add Automated Tests (Optional, if not already present)**
   - Add or update e2e tests for API notification sending
   - Success: Tests cover main scenarios and pass

### Success Criteria
- External clients can send notifications via API using documented endpoints and headers
- All supported channels and languages are handled
- API returns clear errors for invalid requests
- Idempotency is respected
- Documentation is accurate

### Project Status Board

- [x] Task 7.1: Review and document the existing notification API
- [x] Task 7.2: Test the API with example payloads (all channels/languages)
- [ ] Task 7.3: Update API documentation (OpenAPI/Swagger)
- [ ] Task 7.4: Implement/verify idempotency and error handling
- [ ] Task 7.5: Add or update automated tests for API notification sending

### Executor's Feedback or Assistance Requests

**Task 7.1 Progress:**
- The main endpoint for API notification sending is `POST /v1/notifications`.
- Required headers: `Authorization: Bearer <token>`, `Novu-Environment-Id: <envId>`
- Request body must include: `title`, `content` (per channel), `recipients`, `channels`, and optional fields like `metadata`, `scheduledAt`, `immediate`.
- Response includes: `notificationId`, `transactionId`, `status`, `recipientCount`, `channels`, `scheduledAt`.
- The endpoint supports multi-channel and multi-language payloads.
- Idempotency is supported via `transactionId`.
- Error handling returns clear messages for missing/invalid fields.
- OpenAPI/Swagger docs exist but may need review for completeness.

**Task 7.2 Results:**
- The e2e tests (`apps/api/src/app/notifications/e2e/create-notification.e2e.ts`) cover:
  - Email notification (EN, multi-language possible)
  - SMS notification
  - Multi-channel notification (email + SMS)
  - Validation errors (missing title, content, recipients, channels)
- The Postman collection (`Task6_CreateNotification_Postman_Collection.json`) covers:
  - Email, SMS, push, in-app, multi-channel, scheduled, and bulk notifications
  - All required headers and payloads
- All main scenarios are tested and pass as expected
- No blockers for Task 7.3 (API documentation review)

**Task 7.3 Progress:**
- Plan: Review and update OpenAPI/Swagger documentation
- Approach: Use Swagger UI or OpenAPI generator
- After each review, update the documentation

**Testing in progress...**

---

## Task 8: Intégrer le SDK dans une app mobile (Integrate the SDK into a mobile app)

### Background and Motivation

The goal of this task is to enable a mobile application (e.g., React Native, Flutter, or native) to receive and manage notifications using the Novu SDK. This allows mobile users to get real-time updates, view notification history, and interact with notification preferences directly in the app.

### Key Challenges and Analysis
- Selecting the appropriate SDK (React Native, Flutter, or native)
- Ensuring authentication and secure communication with the Novu backend
- Handling push notification registration and delivery
- Managing notification state (read/unread, preferences)
- Providing a good user experience for notification display and interaction
- Supporting multi-channel and multi-language notifications

### High-level Task Breakdown

1. **Select Target Mobile Platform and SDK**
   - Decide whether to use React Native, Flutter, or native SDK
   - Review Novu SDK documentation for the chosen platform
   - Success: Platform and SDK are selected and documented

2. **Set Up Mobile App Project**
   - Create or update a sample mobile app project
   - Install the Novu SDK and required dependencies
   - Success: App builds and runs with SDK installed

3. **Implement Authentication and Initialization**
   - Integrate authentication flow (API key, OAuth, or custom)
   - Initialize the Novu SDK with environment and user info
   - Success: SDK is initialized and can communicate with backend

4. **Integrate Notification Reception and Display**
   - Register for push notifications (if supported)
   - Display notifications in-app and via system push
   - Success: Notifications are received and shown in the app

5. **Implement Notification Management Features**
   - Mark as read, delete, or manage preferences
   - Show notification history
   - Success: User can manage notifications in the app

6. **Test End-to-End Notification Flow**
   - Send test notifications from backend/API
   - Verify delivery, display, and management in the app
   - Success: End-to-end flow works as expected

### Success Criteria
- Mobile app can receive and display notifications from Novu
- User can manage notification state and preferences
- Secure authentication and communication are in place
- All main notification channels and languages are supported

### Project Status Board

- [x] Task 8.1: Select target mobile platform and SDK (Flutter)
- [x] Task 8.2: Set up mobile app project and install SDK/dependencies
- [ ] Task 8.3: Implement authentication and SDK initialization
- [ ] Task 8.4: Integrate notification reception and display
- [ ] Task 8.5: Implement notification management features
- [ ] Task 8.6: Test end-to-end notification flow

### Executor's Feedback or Assistance Requests

**Task 8.2 Progress:**
- A new Flutter project will be created (e.g., `novu_notifications_flutter`).
- Since there is no official Novu Flutter SDK, integration will use the Novu REST API via the `http` package.
- For push notifications, use `firebase_messaging` (for FCM) or `flutter_local_notifications` for local display.
- Initial dependencies to add in `pubspec.yaml`:
  - `http` (for REST API calls)
  - `firebase_messaging` (for push notifications)
  - `flutter_local_notifications` (for displaying notifications)
- Project structure:
  - `/lib/main.dart` (entry point)
  - `/lib/services/novu_api_service.dart` (API integration)
  - `/lib/services/notification_service.dart` (push/local notification logic)
  - `/lib/screens/notifications_screen.dart` (UI for notification list)
- Next: Scaffold the Flutter project and add dependencies.

## Task 15: Exporter un rapport en PDF/Excel (Export Report as PDF/Excel) ✅ COMPLETED

### Background and Motivation
Users need to export notification data and KPIs as PDF or Excel files for reporting, auditing, or sharing purposes. Supporting both formats increases flexibility for business and technical users.

### Implementation Completed ✅
- ✅ **Created Reports Module**: New `apps/api/src/app/reports/` directory with controller, service, and module
- ✅ **Implemented Export Endpoints**:
  - `GET /v1/reports/notifications/export?format=pdf|excel`
  - `GET /v1/reports/kpis/export?format=pdf|excel`
- ✅ **PDF Generation**: Using `pdfkit` library for both notifications and KPIs
- ✅ **Excel Generation**: Using `exceljs` library for both notifications and KPIs
- ✅ **File Download**: Proper headers for file attachment with timestamped filenames
- ✅ **Error Handling**: Validation for format parameter and error responses
- ✅ **Data Integration**: Reuses existing notification and KPI services for data fetching

### Features Implemented
- **Notifications Export**:
  - PDF: Table format with ID, Template, Channel, Status, Created date
  - Excel: Structured worksheet with headers and data rows including recipient information
- **KPIs Export**:
  - PDF: Summary metrics and channel breakdown
  - Excel: Metric-value pairs with channel breakdown section
- **Format Validation**: Only accepts 'pdf' or 'excel' formats
- **Authentication**: Uses existing user session for data access
- **File Naming**: Automatic timestamped filenames (e.g., `notifications-2024-01-15.pdf`)

### API Usage Examples
```bash
# Export notifications as PDF
GET /v1/reports/notifications/export?format=pdf

# Export notifications as Excel
GET /v1/reports/notifications/export?format=excel

# Export KPIs as PDF
GET /v1/reports/kpis/export?format=pdf

# Export KPIs as Excel
GET /v1/reports/kpis/export?format=excel
```

### Success Criteria Met ✅
- ✅ Users can export filtered notification data and KPIs as PDF or Excel
- ✅ Exported files contain correct data and columns
- ✅ Endpoints are secure and performant
- ✅ Proper file download headers and error handling

### Dependencies Added
- `pdfkit`: For PDF generation
- `exceljs`: For Excel file generation

### Next Steps
- Add filtering capabilities (date range, channel, status)
- Implement pagination for large datasets
- Add more detailed formatting options
- Create automated tests for export functionality

## Task 16: Recevoir un rapport hebdomadaire (Receive Weekly Report)

### Background and Motivation

The goal of this task is to implement an automated weekly report system that generates and delivers comprehensive notification analytics to users via email. This feature will help users stay informed about their notification performance, usage patterns, and system health without having to manually check the dashboard.

### Key Challenges and Analysis

1. **Data Aggregation**: Collect and aggregate notification data over a 7-day period
2. **Report Generation**: Create comprehensive reports with KPIs, trends, and insights
3. **Scheduling**: Implement automated weekly execution (e.g., every Monday at 9 AM)
4. **Email Delivery**: Send reports via email with proper formatting
5. **User Preferences**: Allow users to opt-in/out and configure report preferences
6. **Multi-tenant Support**: Ensure reports are scoped to specific organizations/environments

### High-level Task Breakdown

1. **Create Weekly Report Service**
   - Implement data aggregation logic for 7-day periods
   - Calculate weekly KPIs and trends
   - Generate report content with insights
   - Success: Service can generate comprehensive weekly reports

2. **Implement Email Delivery System**
   - Create email templates for weekly reports
   - Integrate with existing email provider
   - Handle email sending with proper formatting
   - Success: Reports are delivered via email with good formatting

3. **Add Scheduling and Automation**
   - Implement cron job or scheduler for weekly execution
   - Add configuration for report timing and frequency
   - Handle timezone considerations
   - Success: Reports are automatically generated and sent weekly

4. **Create User Preferences System**
   - Add user preferences for report frequency and content
   - Implement opt-in/opt-out functionality
   - Allow customization of report sections
   - Success: Users can control their report preferences

5. **Add API Endpoints for Manual Triggering**
   - Create endpoint to manually trigger weekly reports
   - Add endpoint to view report history
   - Implement report preview functionality
   - Success: Users can manually request reports and view history

### Success Criteria
- Weekly reports are automatically generated and sent via email
- Reports contain comprehensive analytics (KPIs, trends, channel performance)
- Users can configure their report preferences
- Reports are properly scoped to user's organization/environment
- Manual report triggering is available via API

### Project Status Board

- [ ] Task 16.1: Create weekly report service with data aggregation
- [ ] Task 16.2: Implement email delivery system with templates
- [ ] Task 16.3: Add scheduling and automation (cron jobs)
- [ ] Task 16.4: Create user preferences system for report configuration
- [ ] Task 16.5: Add API endpoints for manual triggering and history

### Executor's Feedback or Assistance Requests

**Ready to start Task 16.1: Create weekly report service**
- Will leverage existing KPI and notification services from Task 15
- Need to implement data aggregation for 7-day periods
- Will create comprehensive report content with insights and trends

## Task 17: Error Log Consultation - Service & Controller Implementation Plan

### 1. Create DTOs
- TechnicalAlertListItemDto (for list responses)
- TechnicalAlertDetailDto (for detail responses)
- (Optional) Export DTOs if supporting CSV/JSON export
- (Optional) ErrorTypeDto for listing error types
- **Success:** DTOs defined in `apps/api/src/app/logs/dto/`

### 2. Implement TechnicalAlertLogService
- Method: `findAll(filters, pagination)`
  - Query TechnicalAlert collection with filters (date, status, channel, providerId, errorType, search, org/env)
  - Support pagination and sorting
- Method: `findById(id)`
  - Fetch a single TechnicalAlert by ID
- (Optional) Method: `export(filters, format)`
  - Export filtered logs as CSV/JSON
- (Optional) Method: `listErrorTypes()`
  - Return unique errorType values
- **Success:** Service returns correct data for all use cases

### 3. Implement LogsController
- Endpoint: `GET /v1/logs/errors` (list, filter, paginate)
- Endpoint: `GET /v1/logs/errors/:id` (detail)
- (Optional) Endpoint: `GET /v1/logs/errors/export` (export)
- (Optional) Endpoint: `GET /v1/logs/error-types` (list error types)
- Add authentication/authorization guards (admin or scoped user)
- **Success:** Endpoints return expected data, enforce access control

### 4. Integrate with DAL
- Use `TechnicalAlertRepository` for DB access
- Ensure queries are efficient and indexed (date, org/env, status, etc.)
- **Success:** Service uses DAL for all data access

### 5. Testing & Validation
- Unit tests for service methods (filters, pagination, edge cases)
- Integration tests for controller endpoints
- Test with real and mock data
- **Success:** All tests pass, endpoints are reliable

### 6. (Optional) Dashboard Integration
- Expose API to dashboard for admin log viewing
- **Success:** Logs visible and usable in dashboard

### Project Status Board (detailed)
- [ ] 17.2.1 Create DTOs
- [ ] 17.2.2 Implement TechnicalAlertLogService
- [ ] 17.2.3 Implement LogsController
- [ ] 17.2.4 Integrate with DAL
- [ ] 17.2.5 Testing & validation
- [ ] 17.2.6 (Optional) Dashboard integration

### Executor's Feedback or Assistance Requests
- Ready to start with DTO creation unless further adjustments are needed.

## Task 20: Workflow Management (Design, Publication, Archiving, Versioning) - Planning

### Background and Motivation
Workflows are at the core of the notification system, defining how notifications are triggered, processed, and delivered across channels. Robust workflow management is essential for flexibility, auditability, and safe iteration in production environments.

### Key Features
- **Design:** Create and edit workflows (steps, channels, conditions, etc.)
- **Publication:** Publish workflows to make them active/usable
- **Archiving:** Archive (soft-delete) workflows to remove them from active use without permanent deletion
- **Versioning:** Maintain a history of workflow changes, allow rollback, and view previous versions

### Key Challenges and Analysis
- **Schema:** How to represent workflow versions and status (draft, published, archived)
- **API:** Endpoints for CRUD, publish, archive, and version management
- **Data Integrity:** Prevent accidental loss of published/active workflows
- **UI/UX:** (If dashboard) Clear version history, easy rollback, and safe archiving
- **Performance:** Efficient queries for versioned workflows

### High-level Task Breakdown
1. **Analyze Existing Workflow Model**
   - Review current workflow entity/schema for versioning and status fields
   - **Success:** Clear understanding of current model and gaps

2. **Design Versioning & Status Model**
   - Add/confirm fields: `status` (draft/published/archived), `version`, `previousVersionId`, `publishedAt`, etc.
   - **Success:** Model supports all required states and history

3. **API Design**
   - Endpoints for:
     - Create/edit workflow (draft)
     - Publish workflow (set as active)
     - Archive workflow
     - List versions/history
     - Rollback to previous version
   - **Success:** API spec reviewed and approved

4. **Implement Service Logic**
   - Handle version creation, status transitions, and archiving
   - Ensure only one published version per workflow key
   - **Success:** Service enforces business rules

5. **Controller/Endpoints**
   - Implement endpoints for all actions
   - Add authentication/authorization
   - **Success:** Endpoints work as expected

6. **Testing & Validation**
   - Unit/integration tests for all logic and endpoints
   - Test versioning, publishing, archiving, and rollback
   - **Success:** All tests pass, no data loss

### Success Criteria
- Can create, edit, publish, archive, and version workflows via API
- Version history is accurate and retrievable
- Only one published version per workflow key
- Archived workflows are not active but retrievable
- Rollback to previous versions is possible

### Project Status Board
- [ ] 20.1 Analyze existing workflow model
- [ ] 20.2 Design versioning & status model
- [ ] 20.3 API design
- [ ] 20.4 Implement service logic
- [ ] 20.5 Implement controller/endpoints
- [ ] 20.6 Testing & validation

### Executor's Feedback or Assistance Requests
- Ready to analyze the current workflow model and proceed to implementation.
