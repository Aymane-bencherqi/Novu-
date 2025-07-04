import { MemberRoleEnum } from '@novu/shared';
import { IsDefined, IsEnum, IsMongoId } from 'class-validator';
import { OrganizationCommand } from '../../../../shared/commands/organization.command';

export class ChangeMemberRoleCommand extends OrganizationCommand {
  @IsDefined()
  @IsEnum(MemberRoleEnum)
  role: MemberRoleEnum;

  @IsDefined()
  @IsMongoId()
  memberId: string;
}
