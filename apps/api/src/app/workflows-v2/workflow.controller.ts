import { ClassSerializerInterceptor, HttpStatus, Patch } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  DeleteWorkflowCommand,
  DeleteWorkflowUseCase,
  UserSession,
  RequirePermissions,
} from '@novu/application-generic';
import { DirectionEnum, PermissionsEnum, UserSessionData, WorkflowOriginEnum } from '@novu/shared';
import { ApiCommonResponses, ApiResponse } from '../shared/framework/response.decorator';
import { RequireAuthentication } from '../auth/framework/auth.decorator';
import { ParseSlugEnvironmentIdPipe } from './pipes/parse-slug-env-id.pipe';
import { ParseSlugIdPipe } from './pipes/parse-slug-id.pipe';
import {
  BuildStepDataCommand,
  BuildStepDataUsecase,
  BuildWorkflowTestDataUseCase,
  DuplicateWorkflowCommand,
  DuplicateWorkflowUseCase,
  GetWorkflowCommand,
  GetWorkflowUseCase,
  ListWorkflowsCommand,
  ListWorkflowsUseCase,
  PreviewCommand,
  PreviewUsecase,
  SyncToEnvironmentCommand,
  SyncToEnvironmentUseCase,
  UpsertWorkflowCommand,
  UpsertWorkflowUseCase,
  WorkflowTestDataCommand,
} from './usecases';
import { PatchWorkflowCommand, PatchWorkflowUsecase } from './usecases/patch-workflow';
import { SdkGroupName, SdkMethodName } from '../shared/framework/swagger/sdk.decorators';
import {
  CreateWorkflowDto,
  DuplicateWorkflowDto,
  GeneratePreviewRequestDto,
  GeneratePreviewResponseDto,
  GetListQueryParamsDto,
  ListWorkflowResponse,
  PatchWorkflowDto,
  StepResponseDto,
  SyncWorkflowDto,
  UpdateWorkflowDto,
  WorkflowResponseDto,
  WorkflowTestDataResponseDto,
} from './dtos';
import { WorkflowVersioningService } from './services';

@ApiCommonResponses()
@Controller({ path: `/workflows`, version: '2' })
@UseInterceptors(ClassSerializerInterceptor)
@RequireAuthentication()
@ApiTags('Workflows')
export class WorkflowController {
  constructor(
    private upsertWorkflowUseCase: UpsertWorkflowUseCase,
    private getWorkflowUseCase: GetWorkflowUseCase,
    private listWorkflowsUseCase: ListWorkflowsUseCase,
    private deleteWorkflowUsecase: DeleteWorkflowUseCase,
    private syncToEnvironmentUseCase: SyncToEnvironmentUseCase,
    private previewUsecase: PreviewUsecase,
    private buildWorkflowTestDataUseCase: BuildWorkflowTestDataUseCase,
    private buildStepDataUsecase: BuildStepDataUsecase,
    private patchWorkflowUsecase: PatchWorkflowUsecase,
    private duplicateWorkflowUseCase: DuplicateWorkflowUseCase,
    private workflowVersioningService: WorkflowVersioningService
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Create a new workflow',
    description: 'Creates a new workflow in the Novu Cloud environment',
  })
  @ApiBody({ type: CreateWorkflowDto, description: 'Workflow creation details' })
  @ApiResponse(WorkflowResponseDto, 201)
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async create(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Body() createWorkflowDto: CreateWorkflowDto
  ): Promise<WorkflowResponseDto> {
    return this.upsertWorkflowUseCase.execute(
      UpsertWorkflowCommand.create({
        workflowDto: { ...createWorkflowDto, origin: WorkflowOriginEnum.NOVU_CLOUD },
        user,
      })
    );
  }

  @Put(':workflowId/sync')
  @ApiOperation({
    summary: 'Sync workflow to another environment',
    description: 'Synchronizes a workflow to a target environment',
  })
  @ApiBody({ type: SyncWorkflowDto, description: 'Sync workflow details' })
  @ApiResponse(WorkflowResponseDto)
  @SdkMethodName('sync')
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async sync(
    @UserSession() user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string,
    @Body() syncWorkflowDto: SyncWorkflowDto
  ): Promise<WorkflowResponseDto> {
    return this.syncToEnvironmentUseCase.execute(
      SyncToEnvironmentCommand.create({
        user,
        workflowIdOrInternalId,
        targetEnvironmentId: syncWorkflowDto.targetEnvironmentId,
      })
    );
  }

  @Put(':workflowId')
  @ApiOperation({
    summary: 'Update an existing workflow',
    description: 'Updates the details of an existing workflow',
  })
  @ApiBody({ type: UpdateWorkflowDto, description: 'Workflow update details' })
  @ApiResponse(WorkflowResponseDto)
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async update(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto
  ): Promise<WorkflowResponseDto> {
    return await this.upsertWorkflowUseCase.execute(
      UpsertWorkflowCommand.create({
        workflowDto: updateWorkflowDto,
        user,
        workflowIdOrInternalId,
      })
    );
  }

  @Get(':workflowId')
  @ApiOperation({
    summary: 'Retrieve a workflow',
    description: 'Fetches details of a specific workflow',
  })
  @ApiResponse(WorkflowResponseDto)
  @ApiQuery({
    name: 'environmentId',
    type: String,
    required: false,
  })
  @SdkMethodName('retrieve')
  @RequirePermissions(PermissionsEnum.WORKFLOW_READ)
  async getWorkflow(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string,
    @Query('environmentId') environmentId?: string
  ): Promise<WorkflowResponseDto> {
    return this.getWorkflowUseCase.execute(
      GetWorkflowCommand.create({
        workflowIdOrInternalId,
        user: {
          ...user,
          environmentId: environmentId || user.environmentId,
        },
      })
    );
  }

  @Delete(':workflowId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a workflow',
    description: 'Removes a specific workflow',
  })
  @SdkMethodName('delete')
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async removeWorkflow(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string
  ) {
    await this.deleteWorkflowUsecase.execute(
      DeleteWorkflowCommand.create({
        workflowIdOrInternalId,
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        userId: user._id,
      })
    );
  }

  @Get('')
  @ApiOperation({
    summary: 'Search workflows',
    description: 'Retrieves a list of workflows with optional filtering and pagination',
  })
  @ApiResponse(ListWorkflowResponse)
  @SdkMethodName('search')
  @RequirePermissions(PermissionsEnum.WORKFLOW_READ)
  async searchWorkflows(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Query() query: GetListQueryParamsDto
  ): Promise<ListWorkflowResponse> {
    return this.listWorkflowsUseCase.execute(
      ListWorkflowsCommand.create({
        offset: Number(query.offset || '0'),
        limit: Number(query.limit || '50'),
        orderDirection: query.orderDirection ?? DirectionEnum.DESC,
        orderBy: query.orderBy ?? 'createdAt',
        searchQuery: query.query,
        user,
      })
    );
  }

  @Post(':workflowId/duplicate')
  @ApiOperation({ summary: 'Duplicate a workflow' }) // Summary for the endpoint
  @ApiBody({ type: DuplicateWorkflowDto }) // Documenting the request body
  @ApiResponse(WorkflowResponseDto, 201)
  @SdkMethodName('duplicate')
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async duplicateWorkflow(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string,
    @Body() duplicateWorkflowDto: DuplicateWorkflowDto
  ): Promise<WorkflowResponseDto> {
    return this.duplicateWorkflowUseCase.execute(
      DuplicateWorkflowCommand.create({
        user,
        workflowIdOrInternalId,
        overrides: duplicateWorkflowDto,
      })
    );
  }

  @Post('/:workflowId/step/:stepId/preview')
  @ApiOperation({
    summary: 'Generate preview',
    description: 'Generates a preview for a specific workflow step',
  })
  @ApiBody({ type: GeneratePreviewRequestDto, description: 'Preview generation details' })
  @ApiResponse(GeneratePreviewResponseDto, 201)
  @SdkGroupName('Workflows.Steps')
  @SdkMethodName('generatePreview')
  @RequirePermissions(PermissionsEnum.WORKFLOW_READ)
  async generatePreview(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string,
    @Param('stepId', ParseSlugIdPipe) stepIdOrInternalId: string,
    @Body() generatePreviewRequestDto: GeneratePreviewRequestDto
  ): Promise<GeneratePreviewResponseDto> {
    return await this.previewUsecase.execute(
      PreviewCommand.create({
        user,
        workflowIdOrInternalId,
        stepIdOrInternalId,
        generatePreviewRequestDto,
      })
    );
  }

  @Get('/:workflowId/steps/:stepId')
  @ApiOperation({
    summary: 'Get workflow step data',
    description: 'Retrieves data for a specific step in a workflow',
  })
  @ApiResponse(StepResponseDto)
  @SdkGroupName('Workflows.Steps')
  @SdkMethodName('retrieve')
  @RequirePermissions(PermissionsEnum.WORKFLOW_READ)
  async getWorkflowStepData(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string,
    @Param('stepId', ParseSlugIdPipe) stepIdOrInternalId: string
  ): Promise<StepResponseDto> {
    return await this.buildStepDataUsecase.execute(
      BuildStepDataCommand.create({ user, workflowIdOrInternalId, stepIdOrInternalId })
    );
  }

  @Patch('/:workflowId')
  @ApiOperation({
    summary: 'Patch workflow',
    description: 'Partially updates a workflow',
  })
  @ApiBody({ type: PatchWorkflowDto, description: 'Workflow patch details' })
  @ApiResponse(WorkflowResponseDto)
  @SdkMethodName('patch')
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async patchWorkflow(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string,
    @Body() patchWorkflowDto: PatchWorkflowDto
  ): Promise<WorkflowResponseDto> {
    return await this.patchWorkflowUsecase.execute(
      PatchWorkflowCommand.create({ user, workflowIdOrInternalId, ...patchWorkflowDto })
    );
  }

  @Get('/:workflowId/test-data')
  @ApiOperation({
    summary: 'Get workflow test data',
    description: 'Retrieves test data for a specific workflow',
  })
  @ApiResponse(WorkflowTestDataResponseDto)
  @SdkMethodName('getTestData')
  @RequirePermissions(PermissionsEnum.WORKFLOW_READ)
  async getWorkflowTestData(
    @UserSession() user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowIdOrInternalId: string
  ): Promise<WorkflowTestDataResponseDto> {
    return this.buildWorkflowTestDataUseCase.execute(
      WorkflowTestDataCommand.create({
        workflowIdOrInternalId,
        user,
      })
    );
  }

  @Post(':workflowId/publish')
  @ApiOperation({ summary: 'Publish workflow', description: 'Publishes a new version of the workflow' })
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async publishWorkflow(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowId: string
  ) {
    return this.workflowVersioningService.publishWorkflow(workflowId, user);
  }

  @Post(':workflowId/archive')
  @ApiOperation({ summary: 'Archive workflow', description: 'Archives the workflow' })
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async archiveWorkflow(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowId: string
  ) {
    return this.workflowVersioningService.archiveWorkflow(workflowId, user);
  }

  @Get(':workflowId/versions')
  @ApiOperation({ summary: 'List workflow versions', description: 'Lists all versions of the workflow' })
  @RequirePermissions(PermissionsEnum.WORKFLOW_READ)
  async listWorkflowVersions(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowId: string
  ) {
    return this.workflowVersioningService.listWorkflowVersions(workflowId, user);
  }

  @Post(':workflowId/rollback')
  @ApiOperation({ summary: 'Rollback workflow', description: 'Rolls back to the previous version of the workflow' })
  @RequirePermissions(PermissionsEnum.WORKFLOW_WRITE)
  async rollbackWorkflow(
    @UserSession(ParseSlugEnvironmentIdPipe) user: UserSessionData,
    @Param('workflowId', ParseSlugIdPipe) workflowId: string
  ) {
    return this.workflowVersioningService.rollbackWorkflow(workflowId, user);
  }
}
