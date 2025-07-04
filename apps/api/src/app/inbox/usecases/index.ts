import {
  GetSubscriberTemplatePreference,
  StorageHelperService,
  UpsertControlValuesUseCase,
  GetWorkflowByIdsUseCase,
} from '@novu/application-generic';
import { CommunityUserRepository } from '@novu/dal';
import { GetNotifications } from './get-notifications/get-notifications.usecase';
import { GetInboxPreferences } from './get-inbox-preferences/get-inbox-preferences.usecase';
import { MarkManyNotificationsAs } from './mark-many-notifications-as/mark-many-notifications-as.usecase';
import { MarkNotificationAs } from './mark-notification-as/mark-notification-as.usecase';
import { NotificationsCount } from './notifications-count/notifications-count.usecase';
import { Session } from './session/session.usecase';
import { UpdateAllNotifications } from './update-all-notifications/update-all-notifications.usecase';
import { UpdateNotificationAction } from './update-notification-action/update-notification-action.usecase';
import { UpdatePreferences } from './update-preferences/update-preferences.usecase';
import { GetSubscriberGlobalPreference } from '../../subscribers/usecases/get-subscriber-global-preference';
import { SnoozeNotification } from './snooze-notification/snooze-notification.usecase';
import { UnsnoozeNotification } from './unsnooze-notification/unsnooze-notification.usecase';
import { GenerateUniqueApiKey } from '../../environments-v1/usecases/generate-unique-api-key/generate-unique-api-key.usecase';
import { ParseEventRequest } from '../../events/usecases/parse-event-request';
import { VerifyPayload } from '../../events/usecases/verify-payload';
import { BulkUpdatePreferences } from './bulk-update-preferences/bulk-update-preferences.usecase';

export const USE_CASES = [
  Session,
  NotificationsCount,
  GetNotifications,
  MarkManyNotificationsAs,
  MarkNotificationAs,
  UpdateNotificationAction,
  UpdateAllNotifications,
  GetInboxPreferences,
  GetSubscriberGlobalPreference,
  GetSubscriberTemplatePreference,
  GetWorkflowByIdsUseCase,
  UpdatePreferences,
  BulkUpdatePreferences,
  SnoozeNotification,
  UnsnoozeNotification,
  GenerateUniqueApiKey,
  CommunityUserRepository,
  UpsertControlValuesUseCase,
  ParseEventRequest,
  VerifyPayload,
  StorageHelperService,
];
