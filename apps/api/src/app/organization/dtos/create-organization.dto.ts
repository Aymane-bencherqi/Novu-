import { IsDefined, IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { ICreateOrganizationDto, JobTitleEnum, ProductUseCases, ChannelTypeEnum } from '@novu/shared';

export class CreateOrganizationDto implements ICreateOrganizationDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsOptional()
  logo?: string;

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
}
