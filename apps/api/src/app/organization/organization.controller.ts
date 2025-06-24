import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { OrganizationEntity, OrganizationRepository } from '@novu/dal';
import { MemberRoleEnum, UserSessionData } from '@novu/shared';
import { ApiExcludeEndpoint, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiExcludeController } from '@nestjs/swagger/dist/decorators/api-exclude-controller.decorator';
import { UserSession } from '../shared/framework/user.decorator';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { CreateOrganizationCommand } from './usecases/create-organization/create-organization.command';
import { CreateOrganization } from './usecases/create-organization/create-organization.usecase';
import { RemoveMember } from './usecases/membership/remove-member/remove-member.usecase';
import { RemoveMemberCommand } from './usecases/membership/remove-member/remove-member.command';
import { GetMembersCommand } from './usecases/membership/get-members/get-members.command';
import { GetMembers } from './usecases/membership/get-members/get-members.usecase';
import { ChangeMemberRoleCommand } from './usecases/membership/change-member-role/change-member-role.command';
import { ChangeMemberRole } from './usecases/membership/change-member-role/change-member-role.usecase';
import { UpdateBrandingDetailsCommand } from './usecases/update-branding-details/update-branding-details.command';
import { UpdateBrandingDetails } from './usecases/update-branding-details/update-branding-details.usecase';
import { GetOrganizationsCommand } from './usecases/get-organizations/get-organizations.command';
import { GetOrganizations } from './usecases/get-organizations/get-organizations.usecase';
import { IGetOrganizationsDto } from './dtos/get-organizations.dto';
import { GetMyOrganization } from './usecases/get-my-organization/get-my-organization.usecase';
import { GetMyOrganizationCommand } from './usecases/get-my-organization/get-my-organization.command';
import { IGetMyOrganizationDto } from './dtos/get-my-organization.dto';
import { RenameOrganizationCommand } from './usecases/rename-organization/rename-organization-command';
import { RenameOrganization } from './usecases/rename-organization/rename-organization.usecase';
import { RenameOrganizationDto } from './dtos/rename-organization.dto';
import { UpdateBrandingDetailsDto } from './dtos/update-branding-details.dto';
import { UpdateMemberRolesDto } from './dtos/update-member-roles.dto';
import { ExternalApiAccessible } from '../auth/framework/external-api.decorator';
import { ApiCommonResponses, ApiResponse } from '../shared/framework/response.decorator';
import { OrganizationBrandingResponseDto, OrganizationResponseDto } from './dtos/organization-response.dto';
import { MemberResponseDto } from './dtos/member-response.dto';
import { RequireAuthentication } from '../auth/framework/auth.decorator';
import { SdkGroupName, SdkMethodName } from '../shared/framework/swagger/sdk.decorators';
import { Types, isValidObjectId } from 'mongoose';

@Controller('/organizations')
@UseInterceptors(ClassSerializerInterceptor)
@RequireAuthentication()
@ApiTags('Organizations')
@ApiCommonResponses()
@ApiExcludeController()
export class OrganizationController {
  constructor(
    private createOrganizationUsecase: CreateOrganization,
    private getMembers: GetMembers,
    private removeMemberUsecase: RemoveMember,
    private changeMemberRoleUsecase: ChangeMemberRole,
    private updateBrandingDetailsUsecase: UpdateBrandingDetails,
    private getOrganizationsUsecase: GetOrganizations,
    private getMyOrganizationUsecase: GetMyOrganization,
    private renameOrganizationUsecase: RenameOrganization,
    private organizationRepository: OrganizationRepository
  ) {}

  @Post('/')
  @ExternalApiAccessible()
  @ApiResponse(OrganizationResponseDto, 201)
  @ApiOperation({
    summary: 'Create an organization',
  })
  async createOrganization(
    @UserSession() user: UserSessionData,
    @Body() body: CreateOrganizationDto
  ): Promise<OrganizationEntity> {
    return await this.createOrganizationUsecase.execute(
      CreateOrganizationCommand.create({
        userId: user._id,
        logo: body.logo,
        name: body.name,
        jobTitle: body.jobTitle,
        domain: body.domain,
        language: body.language,
        channels: body.channels,
      })
    );
  }

  @Get('/')
  @ExternalApiAccessible()
  @ApiResponse(OrganizationResponseDto, 200, true)
  @ApiOperation({
    summary: 'Fetch all organizations',
  })
  async listOrganizations(@UserSession() user: UserSessionData): Promise<IGetOrganizationsDto> {
    const command = GetOrganizationsCommand.create({
      userId: user._id,
    });

    return await this.getOrganizationsUsecase.execute(command);
  }

  @Get('/me')
  @ExternalApiAccessible()
  @ApiResponse(OrganizationResponseDto)
  @ApiOperation({
    summary: 'Fetch current organization details',
  })
  async getSelfOrganizationData(@UserSession() user: UserSessionData): Promise<IGetMyOrganizationDto> {
    const command = GetMyOrganizationCommand.create({
      userId: user._id,
      id: user.organizationId,
    });

    return await this.getMyOrganizationUsecase.execute(command);
  }
  @SdkGroupName('Organizations.Members')
  @Delete('/members/:memberId')
  @ExternalApiAccessible()
  @ApiResponse(MemberResponseDto)
  @ApiOperation({
    summary: 'Remove a member from organization using memberId',
  })
  @ApiParam({ name: 'memberId', type: String, required: true })
  async remove(@UserSession() user: UserSessionData, @Param('memberId') memberId: string) {
    return await this.removeMemberUsecase.execute(
      RemoveMemberCommand.create({
        userId: user._id,
        organizationId: user.organizationId,
        memberId,
      })
    );
  }
  @SdkGroupName('Organizations.Members.Roles')
  @Put('/members/:memberId/roles')
  @ExternalApiAccessible()
  @ApiExcludeEndpoint()
  @ApiResponse(MemberResponseDto)
  @ApiOperation({
    summary: 'Update a member role (admin/member)',
  })
  @ApiParam({ name: 'memberId', type: String, required: true })
  async updateMemberRoles(
    @UserSession() user: UserSessionData,
    @Param('memberId') memberId: string,
    @Body() body: UpdateMemberRolesDto
  ) {
    return await this.changeMemberRoleUsecase.execute(
      ChangeMemberRoleCommand.create({
        memberId,
        role: body.role,
        userId: user._id,
        organizationId: user.organizationId,
      })
    );
  }
  @SdkGroupName('Organizations.Members')
  @Get('/members')
  @ExternalApiAccessible()
  @ApiResponse(MemberResponseDto, 200, true)
  @ApiOperation({
    summary: 'Fetch all members of current organizations',
  })
  async listOrganizationMembers(@UserSession() user: UserSessionData) {
    return await this.getMembers.execute(
      GetMembersCommand.create({
        user,
        userId: user._id,
        organizationId: user.organizationId,
      })
    );
  }
  @SdkGroupName('Organizations.Branding')
  @Put('/branding')
  @ExternalApiAccessible()
  @ApiResponse(OrganizationBrandingResponseDto)
  @ApiOperation({
    summary: 'Update organization branding details',
  })
  async updateBrandingDetails(@UserSession() user: UserSessionData, @Body() body: UpdateBrandingDetailsDto) {
    return await this.updateBrandingDetailsUsecase.execute(
      UpdateBrandingDetailsCommand.create({
        logo: body.logo,
        color: body.color,
        userId: user._id,
        id: user.organizationId,
        fontColor: body.fontColor,
        fontFamily: body.fontFamily,
        contentBackground: body.contentBackground,
      })
    );
  }

  @Patch('/')
  @ExternalApiAccessible()
  @ApiResponse(RenameOrganizationDto)
  @ApiOperation({
    summary: 'Rename organization name',
  })
  @SdkMethodName('rename')
  async rename(@UserSession() user: UserSessionData, @Body() body: RenameOrganizationDto) {
    return await this.renameOrganizationUsecase.execute(
      RenameOrganizationCommand.create({
        name: body.name,
        userId: user._id,
        id: user.organizationId,
      })
    );
  }

  @Delete('/:organizationId')
  @ExternalApiAccessible()
  @ApiOperation({ summary: 'Soft-delete an organization (logical deletion)' })
  async softDeleteOrganization(
    @UserSession() user: UserSessionData,
    @Param('organizationId') organizationId: string
  ) {
    if (!user.roles?.includes(MemberRoleEnum.OSS_ADMIN)) {
      throw new ForbiddenException('Only admins can delete organizations');
    }
    const id = isValidObjectId(organizationId) ? new Types.ObjectId(organizationId) : organizationId;
    console.log('Soft-delete query:', { _id: id });
    const result = await this.organizationRepository.update(
      { _id: id },
      { $set: { deleted: true, deletedAt: new Date() } }
    );
    console.log('Soft-delete update result:', result);
    return { success: result.modified > 0 };
  }

  @Post('/:organizationId/restore')
  @ExternalApiAccessible()
  @ApiOperation({ summary: 'Restore a logically deleted organization' })
  async restoreOrganization(
    @UserSession() user: UserSessionData,
    @Param('organizationId') organizationId: string
  ) {
    if (!user.roles?.includes(MemberRoleEnum.OSS_ADMIN)) {
      throw new ForbiddenException('Only admins can restore organizations');
    }
    const id = isValidObjectId(organizationId) ? new Types.ObjectId(organizationId) : organizationId;
    console.log('Restore query:', { _id: id });
    const result = await this.organizationRepository.update(
      { _id: id },
      { $set: { deleted: false, deletedAt: null } }
    );
    console.log('Restore update result:', result);
    return { success: result.modified > 0 };
  }

  @Get('/:organizationId/raw')
  @ExternalApiAccessible()
  @ApiOperation({ summary: 'Get raw organization document (debug)' })
  async getRawOrganization(
    @UserSession() user: UserSessionData,
    @Param('organizationId') organizationId: string
  ) {
    // Access the underlying repository's MongooseModel
    // @ts-ignore
    return await this.organizationRepository.organizationRepository.MongooseModel.findOne({ _id: organizationId });
  }
}
