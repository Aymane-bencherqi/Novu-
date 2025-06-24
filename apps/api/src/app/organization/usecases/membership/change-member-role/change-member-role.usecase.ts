import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrganizationRepository, MemberRepository } from '@novu/dal';
import { MemberRoleEnum } from '@novu/shared';

import { ChangeMemberRoleCommand } from './change-member-role.command';

@Injectable()
export class ChangeMemberRole {
  constructor(
    private organizationRepository: OrganizationRepository,
    private memberRepository: MemberRepository
  ) {}

  async execute(command: ChangeMemberRoleCommand) {
    if (![MemberRoleEnum.OSS_MEMBER, MemberRoleEnum.OSS_ADMIN].includes(command.role)) {
      throw new BadRequestException('Not supported role type');
    }

    const organization = await this.organizationRepository.findById(command.organizationId);
    if (!organization) throw new NotFoundException('No organization was found');

    const member = await this.memberRepository.findMemberById(organization._id, command.memberId);
    if (!member) throw new NotFoundException('No member was found');

    // Prevent last admin from demoting themselves
    if (
      member.roles.includes(MemberRoleEnum.OSS_ADMIN) &&
      command.role === MemberRoleEnum.OSS_MEMBER
    ) {
      const admins = await this.memberRepository.getOrganizationAdmins(organization._id);
      if (admins.length === 1 && String(member._id) === String(admins[0]._id)) {
        throw new ForbiddenException('Cannot demote the last admin in the organization');
      }
    }

    const roles = [command.role];
    await this.memberRepository.updateMemberRoles(organization._id, command.memberId, roles);
    return this.memberRepository.findMemberByUserId(organization._id, member._userId);
  }
}
