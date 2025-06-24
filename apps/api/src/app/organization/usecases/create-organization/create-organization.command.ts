import { IsDefined, IsEnum, IsOptional, IsString, IsArray } from 'class-validator';

import { ApiServiceLevelEnum, JobTitleEnum, ChannelTypeEnum } from '@novu/shared';

import { AuthenticatedCommand } from '../../../shared/commands/authenticated.command';

export class CreateOrganizationCommand extends AuthenticatedCommand {
  @IsString()
  @IsDefined()
  public readonly name: string;

  @IsString()
  @IsOptional()
  public readonly logo?: string;

  @IsOptional()
  @IsEnum(JobTitleEnum)
  jobTitle?: JobTitleEnum;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsOptional()
  @IsArray()
  language?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(ChannelTypeEnum, { each: true })
  channels?: ChannelTypeEnum[];

  @IsOptional()
  @IsEnum(ApiServiceLevelEnum)
  apiServiceLevel?: ApiServiceLevelEnum;
}
