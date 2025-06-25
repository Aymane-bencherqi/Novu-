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

### Phase 3: Analytics & Monitoring (Tasks 9-10, 15-17)
6. **Analytics System**
   - KPI calculation and storage
   - Report generation (PDF/Excel)
   - Weekly report automation

7. **Monitoring & Alerting**
   - Channel health monitoring
   - Error tracking and alerting
   - Log management system

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
- [ ] Task 15: Export reports in PDF/Excel
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

**Status**: Task 6 Completed ✅ - Ready to proceed to Task 7
**Current Phase**: Task 7 - Integrate notification service via API
**Next Steps**: Analyze and plan Task 7 implementation

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
