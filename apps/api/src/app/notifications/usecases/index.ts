import { GetActivityStats } from './get-activity-stats';
import { GetActivityFeed } from './get-activity-feed/get-activity-feed.usecase';
import { GetActivityGraphStats } from './get-activity-graph-states/get-activity-graph-states.usecase';
import { GetActivity } from './get-activity/get-activity.usecase';
import { CreateNotification } from './create-notification/create-notification.usecase';
import { GetNotificationKpi } from './get-notification-kpi/get-notification-kpi.usecase';

export const USE_CASES = [
  GetActivityStats,
  GetActivityGraphStats,
  GetActivityFeed,
  GetActivity,
  CreateNotification,
  GetNotificationKpi,
  //
];
