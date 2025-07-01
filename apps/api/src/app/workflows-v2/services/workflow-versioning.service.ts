import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { NotificationTemplateRepository } from '@novu/dal';
import { NotificationTemplateEntity } from '@novu/dal';
import { UserSessionData } from '@novu/shared';
import { WorkflowResponseDto } from '../dtos';

@Injectable()
export class WorkflowVersioningService {
  constructor(private readonly workflowRepo: NotificationTemplateRepository) {}

  async publishWorkflow(workflowId: string, user: UserSessionData): Promise<WorkflowResponseDto> {
    const current = await this.workflowRepo.findById(workflowId, user.environmentId);
    if (!current) throw new NotFoundException('Workflow not found');
    if ((current.status as string) === 'published') throw new BadRequestException('Workflow is already published');

    // Set all other versions to not published
    await this.workflowRepo._model.updateMany(
      { _id: { $ne: current._id }, _environmentId: user.environmentId, status: 'published' },
      { $set: { status: 'draft' } }
    );

    // Convert to plain object and remove _id/id before creating new version
    const clone = typeof (current as any).toObject === 'function' ? (current as any).toObject() : { ...current };
    delete clone._id;
    delete clone.id;
    if (Array.isArray(clone.steps)) {
      clone.steps = clone.steps.map((step: any) => {
        const s = { ...step };
        delete s._id;
        return s;
      });
    }
    const newVersion = await this.workflowRepo._model.create({
      ...clone,
      version: (Number(current['version']) || 1) + 1,
      previousVersionId: String(current._id),
      status: 'published',
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.toDto(newVersion);
  }

  async archiveWorkflow(workflowId: string, user: UserSessionData): Promise<WorkflowResponseDto> {
    const current = await this.workflowRepo.findById(workflowId, user.environmentId);
    if (!current) throw new NotFoundException('Workflow not found');
    if ((current.status as string) === 'archived') throw new BadRequestException('Workflow is already archived');
    (current as any).status = 'archived';
    (current as any).updatedAt = new Date().toISOString();
    await this.workflowRepo._model.updateOne({ _id: workflowId }, { $set: { status: 'archived', updatedAt: new Date() } });
    return this.toDto(current);
  }

  async listWorkflowVersions(workflowId: string, user: UserSessionData): Promise<WorkflowResponseDto[]> {
    const current = await this.workflowRepo.findById(workflowId, user.environmentId);
    if (!current) throw new NotFoundException('Workflow not found');
    const versions = await this.workflowRepo._model.find({
      _environmentId: user.environmentId,
      $or: [
        { _id: current._id },
        { previousVersionId: String(current._id) },
      ],
    }).sort({ version: -1 });
    return versions.map(this.toDto);
  }

  async rollbackWorkflow(workflowId: string, user: UserSessionData): Promise<WorkflowResponseDto> {
    const current = await this.workflowRepo.findById(workflowId, user.environmentId);
    if (!current) throw new NotFoundException('Workflow not found');
    if (!current['previousVersionId'] || !String(current['previousVersionId'])) throw new BadRequestException('No previous version to rollback to');
    const previous = await this.workflowRepo.findById(String(current['previousVersionId']), user.environmentId);
    if (!previous) throw new NotFoundException('Previous version not found');
    // Set all other versions to not published
    await this.workflowRepo._model.updateMany(
      { _id: { $ne: previous._id }, _environmentId: user.environmentId, status: 'published' },
      { $set: { status: 'draft' } }
    );
    // Set previous version as published
    await this.workflowRepo._model.updateOne(
      { _id: previous._id },
      { $set: { status: 'published', publishedAt: new Date(), updatedAt: new Date() } }
    );
    return this.toDto(previous);
  }

  private toDto(entity: any): WorkflowResponseDto {
    // Use .toObject() only if available, otherwise use the object directly
    const obj = typeof entity.toObject === 'function' ? entity.toObject() : entity;
    return {
      ...obj,
      id: obj._id,
      status: obj.status,
      version: obj.version,
      previousVersionId: obj.previousVersionId,
      publishedAt: obj.publishedAt,
    };
  }
} 
