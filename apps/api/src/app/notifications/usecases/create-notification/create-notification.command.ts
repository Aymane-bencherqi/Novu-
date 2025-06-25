import { IsArray, IsBoolean, IsDateString, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChannelTypeEnum } from '@novu/shared';
import { EnvironmentWithUserCommand } from '@novu/application-generic';
import { 
  CreateNotificationDto, 
  ChannelContentDto, 
  RecipientDto 
} from '../../dtos/create-notification.dto';

export class CreateNotificationCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsDefined()
  title: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ChannelContentDto)
  content: ChannelContentDto;

  @IsArray()
  @IsDefined()
  recipients: RecipientDto[];

  @IsArray()
  @IsEnum(ChannelTypeEnum, { each: true })
  @IsDefined()
  channels: ChannelTypeEnum[];

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  immediate?: boolean = true;

  @IsString()
  @IsOptional()
  transactionId?: string;
} 
