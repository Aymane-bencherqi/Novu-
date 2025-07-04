import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CustomDataType, INotificationTemplate, TriggerTypeEnum, WorkflowIntegrationStatus } from '@novu/shared';

import { NotificationStepDto } from '../../shared/dtos/notification-step-dto';
import { SubscriberPreferenceChannels } from '../../shared/dtos/preference-channels';

/**
 * @deprecated use dto's in /workflows directory
 */

export class NotificationGroup {
  @ApiPropertyOptional()
  _id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  _environmentId: string;

  @ApiProperty()
  _organizationId: string;

  @ApiPropertyOptional()
  _parentId?: string;
}

export class NotificationTriggerVariable {
  name: string;
}

export class NotificationTrigger {
  @ApiProperty({
    enum: TriggerTypeEnum,
  })
  type: TriggerTypeEnum;

  @ApiProperty()
  identifier: string;

  @ApiProperty({
    type: [NotificationTriggerVariable],
  })
  variables: NotificationTriggerVariable[];

  @ApiProperty({
    type: [NotificationTriggerVariable],
  })
  subscriberVariables?: NotificationTriggerVariable[];
}

@ApiExtraModels(NotificationGroup)
export class WorkflowResponse implements INotificationTemplate {
  @ApiPropertyOptional()
  _id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  draft: boolean;

  @ApiProperty({
    type: SubscriberPreferenceChannels,
  })
  preferenceSettings: SubscriberPreferenceChannels;

  @ApiProperty()
  critical: boolean;

  @ApiProperty()
  tags: string[];

  @ApiProperty({
    type: [NotificationStepDto],
  })
  steps: NotificationStepDto[];

  @ApiProperty()
  _organizationId: string;

  @ApiProperty()
  _creatorId: string;

  @ApiProperty()
  _environmentId: string;

  @ApiProperty({
    type: [NotificationTrigger],
  })
  triggers: NotificationTrigger[];

  @ApiProperty()
  _notificationGroupId: string;

  @ApiPropertyOptional()
  _parentId?: string;

  @ApiProperty()
  deleted: boolean;

  @ApiProperty()
  deletedAt: string;

  @ApiProperty()
  deletedBy: string;

  @ApiPropertyOptional({
    type: NotificationGroup,
  })
  readonly notificationGroup?: NotificationGroup;

  @ApiPropertyOptional()
  @IsOptional()
  data?: CustomDataType;

  @ApiPropertyOptional()
  language?: string;

  workflowIntegrationStatus?: WorkflowIntegrationStatus;
}
