import { IsArray, IsMongoId, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { CustomDataType, IPreferenceChannels, IUpdateWorkflowDto } from '@novu/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriberPreferenceChannels } from '../../shared/dtos/preference-channels';
import { NotificationStepDto } from '../../shared/dtos/notification-step-dto';

/**
 * @deprecated use dto's in /workflows directory
 */

export class UpdateWorkflowRequestDto implements IUpdateWorkflowDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(300)
  description: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  @ValidateNested()
  steps: NotificationStepDto[];

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  notificationGroupId: string;

  @ApiPropertyOptional()
  critical?: boolean;

  @ApiPropertyOptional({
    type: SubscriberPreferenceChannels,
  })
  preferenceSettings?: IPreferenceChannels;

  @ApiPropertyOptional()
  @IsOptional()
  data?: CustomDataType;

  @ApiPropertyOptional({
    description: 'Channel for the notification template',
    enum: ['email', 'sms', 'push', 'in_app', 'chat'],
  })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({
    description: 'Language for the notification template',
    enum: ['en', 'fr', 'ar'],
  })
  @IsString()
  @IsOptional()
  language?: string;
}
