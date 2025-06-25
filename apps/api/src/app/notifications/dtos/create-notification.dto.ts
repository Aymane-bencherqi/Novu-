import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChannelTypeEnum, StepTypeEnum } from '@novu/shared';

// Channel-specific content DTOs
export class EmailContentDto {
  @ApiProperty({ description: 'Email subject line', example: 'Welcome to our platform!' })
  @IsString()
  @IsDefined()
  subject: string;

  @ApiProperty({ description: 'Email HTML content', example: '<h1>Welcome {{firstName}}!</h1><p>Thank you for joining us.</p>' })
  @IsString()
  @IsDefined()
  htmlContent: string;

  @ApiPropertyOptional({ description: 'Email text content (plain text version)', example: 'Welcome John! Thank you for joining us.' })
  @IsString()
  @IsOptional()
  textContent?: string;
}

export class SmsContentDto {
  @ApiProperty({ description: 'SMS text content', example: 'Welcome {{firstName}}! Your account is now active.' })
  @IsString()
  @IsDefined()
  content: string;
}

export class PushContentDto {
  @ApiProperty({ description: 'Push notification title', example: 'Welcome!' })
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty({ description: 'Push notification body', example: 'Welcome {{firstName}} to our platform!' })
  @IsString()
  @IsDefined()
  body: string;

  @ApiPropertyOptional({ description: 'Additional data for the push notification', example: { url: '/dashboard' } })
  @IsOptional()
  data?: Record<string, any>;
}

export class InAppContentDto {
  @ApiProperty({ description: 'In-app notification title', example: 'Welcome!' })
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty({ description: 'In-app notification content', example: 'Welcome {{firstName}} to our platform!' })
  @IsString()
  @IsDefined()
  content: string;

  @ApiPropertyOptional({ description: 'Call-to-action button configuration' })
  @IsOptional()
  cta?: {
    type: 'redirect' | 'action';
    data: {
      url?: string;
      action?: string;
    };
  };
}

// Channel-specific content mapping
export class ChannelContentDto {
  @ApiPropertyOptional({ description: 'Email content configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmailContentDto)
  email?: EmailContentDto;

  @ApiPropertyOptional({ description: 'SMS content configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SmsContentDto)
  sms?: SmsContentDto;

  @ApiPropertyOptional({ description: 'Push notification content configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => PushContentDto)
  push?: PushContentDto;

  @ApiPropertyOptional({ description: 'In-app notification content configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => InAppContentDto)
  in_app?: InAppContentDto;
}

// Recipient DTOs
export class SubscriberRecipientDto {
  @ApiProperty({ description: 'Subscriber ID', example: 'user123' })
  @IsString()
  @IsDefined()
  subscriberId: string;
}

export class TopicRecipientDto {
  @ApiProperty({ description: 'Topic key', example: 'newsletter' })
  @IsString()
  @IsDefined()
  topicKey: string;
}

export type RecipientDto = SubscriberRecipientDto | TopicRecipientDto | string;

// Main Create Notification DTO
export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title', example: 'Welcome Notification' })
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty({ 
    description: 'Channel-specific content configuration',
    type: ChannelContentDto,
    example: {
      email: {
        subject: 'Welcome to our platform!',
        htmlContent: '<h1>Welcome {{firstName}}!</h1><p>Thank you for joining us.</p>',
        textContent: 'Welcome John! Thank you for joining us.'
      },
      sms: {
        content: 'Welcome {{firstName}}! Your account is now active.'
      }
    }
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => ChannelContentDto)
  content: ChannelContentDto;

  @ApiProperty({ 
    description: 'Recipients of the notification',
    example: [
      { subscriberId: 'user123' },
      { topicKey: 'newsletter' },
      'user456'
    ]
  })
  @IsArray()
  @IsDefined()
  recipients: RecipientDto[];

  @ApiProperty({ 
    description: 'Channels to use for sending',
    enum: ChannelTypeEnum,
    isArray: true,
    example: [ChannelTypeEnum.EMAIL, ChannelTypeEnum.SMS]
  })
  @IsArray()
  @IsEnum(ChannelTypeEnum, { each: true })
  @IsDefined()
  channels: ChannelTypeEnum[];

  @ApiPropertyOptional({ description: 'Template ID to use (optional - for template-based notifications)' })
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({ description: 'Scheduled sending time (ISO string)', example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional({ description: 'Custom metadata for the notification' })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Whether to send immediately or queue for processing', default: true })
  @IsBoolean()
  @IsOptional()
  immediate?: boolean = true;
}

// Response DTO
export class CreateNotificationResponseDto {
  @ApiProperty({ description: 'Unique identifier of the created notification' })
  notificationId: string;

  @ApiProperty({ description: 'Transaction ID for tracking' })
  transactionId: string;

  @ApiProperty({ description: 'Status of the notification creation' })
  status: 'created' | 'scheduled' | 'error';

  @ApiPropertyOptional({ description: 'Error message if creation failed' })
  error?: string;

  @ApiProperty({ description: 'Number of recipients the notification will be sent to' })
  recipientCount: number;

  @ApiProperty({ description: 'Channels that will be used for sending' })
  channels: ChannelTypeEnum[];

  @ApiPropertyOptional({ description: 'Scheduled sending time if delayed' })
  scheduledAt?: string;
} 
