import { Controller, Get, Post, Param, Body, Query, Patch } from '@nestjs/common';
import { TechnicalAlertDto } from './dtos/technical-alert.dto';
import { ListTechnicalAlertsUsecase } from './usecases/list-technical-alerts.usecase';
import { AcknowledgeTechnicalAlertUsecase } from './usecases/acknowledge-technical-alert.usecase';
import { TechnicalAlertEntity } from '@novu/dal';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserSession } from '../shared/framework/user.decorator';
import { UserSessionData } from '@novu/shared';
import { TechnicalAlertRepository } from '@novu/dal';
import { LogTechnicalAlertUsecase } from './usecases/log-technical-alert.usecase';

@ApiTags('Technical Alerts')
@Controller('technical-alerts')
export class TechnicalAlertController {
  constructor(
    private technicalAlertRepository: TechnicalAlertRepository,
    private listTechnicalAlertsUsecase: ListTechnicalAlertsUsecase,
    private acknowledgeTechnicalAlertUsecase: AcknowledgeTechnicalAlertUsecase,
    private logTechnicalAlertUsecase: LogTechnicalAlertUsecase
  ) {}

  @Get()
  @ApiOperation({ summary: 'List technical alerts' })
  @ApiResponse({ status: 200, description: 'List of technical alerts', type: [TechnicalAlertDto] })
  async listTechnicalAlerts(
    @Query('status') status?: string,
    @Query('limit') limit?: number
  ): Promise<TechnicalAlertDto[]> {
    const query: any = {};
    if (status) {
      query.status = status;
    }

    const alerts = await this.listTechnicalAlertsUsecase.execute(query, limit);
    
    return alerts.map((alert: TechnicalAlertEntity) => ({
      id: alert._id,
      organizationId: alert.organizationId,
      environmentId: alert.environmentId,
      channel: alert.channel,
      providerId: alert.providerId,
      errorType: alert.errorType,
      errorMessage: alert.errorMessage,
      count: alert.count,
      firstOccurred: alert.firstOccurred,
      lastOccurred: alert.lastOccurred,
      status: alert.status,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get technical alert by ID' })
  @ApiResponse({ status: 200, description: 'Technical alert details', type: TechnicalAlertDto })
  @ApiResponse({ status: 404, description: 'Technical alert not found' })
  async getTechnicalAlert(
    @Param('id') id: string
  ): Promise<TechnicalAlertDto> {
    const alert = await this.technicalAlertRepository.findOneAlert({
      _id: id,
    });

    if (!alert) {
      throw new Error('Technical alert not found');
    }

    return {
      id: alert._id,
      organizationId: alert.organizationId,
      environmentId: alert.environmentId,
      channel: alert.channel,
      providerId: alert.providerId,
      errorType: alert.errorType,
      errorMessage: alert.errorMessage,
      count: alert.count,
      firstOccurred: alert.firstOccurred,
      lastOccurred: alert.lastOccurred,
      status: alert.status,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    };
  }

  @Post(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge a technical alert' })
  @ApiResponse({ status: 200, description: 'Technical alert acknowledged', type: TechnicalAlertDto })
  @ApiResponse({ status: 404, description: 'Technical alert not found' })
  async acknowledgeTechnicalAlert(
    @Param('id') id: string
  ): Promise<TechnicalAlertDto> {
    const alert = await this.acknowledgeTechnicalAlertUsecase.execute(id, undefined);
    
    if (!alert) {
      throw new Error('Technical alert not found');
    }

    return {
      id: alert._id,
      organizationId: alert.organizationId,
      environmentId: alert.environmentId,
      channel: alert.channel,
      providerId: alert.providerId,
      errorType: alert.errorType,
      errorMessage: alert.errorMessage,
      count: alert.count,
      firstOccurred: alert.firstOccurred,
      lastOccurred: alert.lastOccurred,
      status: alert.status,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    };
  }

  @Post('log')
  @ApiOperation({ summary: 'Log a technical alert' })
  @ApiResponse({ status: 201, description: 'Technical alert logged', type: TechnicalAlertDto })
  async logTechnicalAlert(
    @Body() body: { name: string; errorMessage: string }
  ): Promise<TechnicalAlertDto> {
    const alert = await this.logTechnicalAlertUsecase.execute(body.name, body.errorMessage);
    
    return {
      id: alert._id,
      organizationId: alert.organizationId,
      environmentId: alert.environmentId,
      channel: alert.channel,
      providerId: alert.providerId,
      errorType: alert.errorType,
      errorMessage: alert.errorMessage,
      count: alert.count,
      firstOccurred: alert.firstOccurred,
      lastOccurred: alert.lastOccurred,
      status: alert.status,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    };
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve a technical alert' })
  @ApiResponse({ status: 200, description: 'Technical alert resolved', type: TechnicalAlertDto })
  @ApiResponse({ status: 404, description: 'Technical alert not found' })
  async resolveTechnicalAlert(
    @Param('id') id: string
  ): Promise<TechnicalAlertDto> {
    const alert = await this.technicalAlertRepository.updateAlert(id, { status: 'resolved' });
    if (!alert) {
      throw new Error('Technical alert not found');
    }
    return {
      id: alert._id,
      organizationId: alert.organizationId,
      environmentId: alert.environmentId,
      channel: alert.channel,
      providerId: alert.providerId,
      errorType: alert.errorType,
      errorMessage: alert.errorMessage,
      count: alert.count,
      firstOccurred: alert.firstOccurred,
      lastOccurred: alert.lastOccurred,
      status: alert.status,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    };
  }
} 
