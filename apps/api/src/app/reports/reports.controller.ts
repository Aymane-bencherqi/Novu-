import { Controller, Get, Query, Res, HttpStatus, BadRequestException, Headers, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { WeeklyReportCronService } from './weekly-report-cron.service';
import { SubscriberSession } from '../shared/framework/user.decorator';
import { UserSessionData } from '@novu/shared';

@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private weeklyReportCronService: WeeklyReportCronService,
  ) {}

  @Get('notifications/export')
  async exportNotifications(
    @Query('format') format: string,
    @Headers('novu-environment-id') environmentId: string,
    @SubscriberSession() user: UserSessionData | null,
    @Res() res: Response
  ) {
    if (!format || !['pdf', 'excel'].includes(format.toLowerCase())) {
      throw new BadRequestException('Format must be either "pdf" or "excel"');
    }

    try {
      let buffer: Buffer;
      let filename: string;
      let contentType: string;

      if (!environmentId) {
        throw new BadRequestException('Environment ID missing in headers');
      }
      if (!user || !user.organizationId || !user._id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User session or organization ID missing. Please provide a valid Authorization header.'
        });
        return;
      }

      if (format.toLowerCase() === 'pdf') {
        buffer = await this.reportsService.generateNotificationsPDF(
          environmentId,
          user.organizationId,
          user._id
        );
        filename = `notifications-${new Date().toISOString().split('T')[0]}.pdf`;
        contentType = 'application/pdf';
      } else {
        buffer = await this.reportsService.generateNotificationsExcel(
          environmentId,
          user.organizationId,
          user._id
        );
        filename = `notifications-${new Date().toISOString().split('T')[0]}.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }

      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      console.error('Export error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate export',
        error: error.message,
      });
    }
  }

  @Get('kpis/export')
  async exportKpis(
    @Query('format') format: string,
    @Headers('novu-environment-id') environmentId: string,
    @SubscriberSession() user: UserSessionData | null,
    @Res() res: Response
  ) {
    if (!format || !['pdf', 'excel'].includes(format.toLowerCase())) {
      throw new BadRequestException('Format must be either "pdf" or "excel"');
    }

    try {
      let buffer: Buffer;
      let filename: string;
      let contentType: string;

      if (!environmentId) {
        throw new BadRequestException('Environment ID missing in headers');
      }
      if (!user || !user.organizationId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User session or organization ID missing. Please provide a valid Authorization header.'
        });
        return;
      }

      if (format.toLowerCase() === 'pdf') {
        buffer = await this.reportsService.generateKpisPDF(
          environmentId,
          user.organizationId
        );
        filename = `kpis-${new Date().toISOString().split('T')[0]}.pdf`;
        contentType = 'application/pdf';
      } else {
        buffer = await this.reportsService.generateKpisExcel(
          environmentId,
          user.organizationId
        );
        filename = `kpis-${new Date().toISOString().split('T')[0]}.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }

      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      console.error('Export error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate export',
        error: error.message,
      });
    }
  }

  @Get('weekly/export')
  async exportWeeklyReport(
    @Query('format') format: string,
    @Headers('novu-environment-id') environmentId: string,
    @SubscriberSession() user: UserSessionData | null,
    @Res() res: Response
  ) {
    if (!format || !['pdf', 'excel'].includes(format.toLowerCase())) {
      throw new BadRequestException('Format must be either "pdf" or "excel"');
    }

    try {
      let buffer: Buffer;
      let filename: string;
      let contentType: string;

      if (!environmentId) {
        throw new BadRequestException('Environment ID missing in headers');
      }
      if (!user || !user.organizationId || !user._id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User session or organization ID missing. Please provide a valid Authorization header.'
        });
        return;
      }

      if (format.toLowerCase() === 'pdf') {
        buffer = await this.reportsService.generateWeeklyReportPDF(
          environmentId,
          user.organizationId,
          user._id
        );
        filename = `weekly-report-${new Date().toISOString().split('T')[0]}.pdf`;
        contentType = 'application/pdf';
      } else {
        buffer = await this.reportsService.generateWeeklyReportExcel(
          environmentId,
          user.organizationId,
          user._id
        );
        filename = `weekly-report-${new Date().toISOString().split('T')[0]}.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }

      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      console.error('Weekly report export error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate weekly report export',
        error: error.message,
      });
    }
  }

  @Post('weekly/send-email')
  async sendWeeklyReportEmail(
    @Body() body: { recipientEmail: string },
    @Headers('novu-environment-id') environmentId: string,
    @SubscriberSession() user: UserSessionData | null,
    @Res() res: Response
  ) {
    try {
      if (!environmentId) {
        throw new BadRequestException('Environment ID missing in headers');
      }
      if (!user || !user.organizationId || !user._id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User session or organization ID missing. Please provide a valid Authorization header.'
        });
        return;
      }
      if (!body.recipientEmail) {
        throw new BadRequestException('Recipient email is required');
      }

      await this.reportsService.generateWeeklyReportEmail(
        environmentId,
        user.organizationId,
        user._id,
        body.recipientEmail
      );

      res.status(HttpStatus.OK).json({
        message: 'Weekly report sent successfully',
        recipientEmail: body.recipientEmail,
        sentAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Weekly report email error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to send weekly report email',
        error: error.message,
      });
    }
  }

  @Get('weekly/preview')
  async getWeeklyReportPreview(
    @Headers('novu-environment-id') environmentId: string,
    @SubscriberSession() user: UserSessionData | null,
    @Res() res: Response
  ) {
    try {
      if (!environmentId) {
        throw new BadRequestException('Environment ID missing in headers');
      }
      if (!user || !user.organizationId || !user._id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User session or organization ID missing. Please provide a valid Authorization header.'
        });
        return;
      }

      const reportData = await this.reportsService.generateWeeklyReport(
        environmentId,
        user.organizationId,
        user._id
      );

      // Calculate success rate
      const successRate = reportData.kpis.totalSent > 0 
        ? ((reportData.kpis.totalSent - (reportData.kpis.totalFailed || 0)) / reportData.kpis.totalSent * 100).toFixed(1)
        : '0';

      res.status(HttpStatus.OK).json({
        reportPeriod: {
          start: reportData.weekStart,
          end: reportData.weekEnd,
          generated: reportData.reportDate,
        },
        summary: {
          totalSent: reportData.kpis.totalSent || 0,
          totalFailed: reportData.kpis.totalFailed || 0,
          successRate: `${successRate}%`,
          weeklyNotifications: reportData.notifications.length,
        },
        channelBreakdown: reportData.kpis.perChannel || {},
        recentActivity: reportData.kpis.recentActivity || {},
      });
    } catch (error) {
      console.error('Weekly report preview error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate weekly report preview',
        error: error.message,
      });
    }
  }

  @Post('weekly/trigger')
  async triggerWeeklyReports(
    @Body() body: { organizationId?: string; environmentId?: string; userId?: string },
    @Headers('novu-environment-id') environmentId: string,
    @SubscriberSession() user: UserSessionData | null,
    @Res() res: Response
  ) {
    try {
      if (!user || !user.organizationId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User session or organization ID missing. Please provide a valid Authorization header.'
        });
        return;
      }

      // Only allow triggering for the user's own organization unless they're a super admin
      const targetOrganizationId = body.organizationId || user.organizationId;
      
      // For security, only allow users to trigger reports for their own organization
      if (targetOrganizationId !== user.organizationId) {
        res.status(HttpStatus.FORBIDDEN).json({
          message: 'You can only trigger weekly reports for your own organization.'
        });
        return;
      }

      await this.weeklyReportCronService.triggerWeeklyReports(
        targetOrganizationId,
        body.environmentId,
        body.userId
      );

      res.status(HttpStatus.OK).json({
        message: 'Weekly reports triggered successfully',
        organizationId: targetOrganizationId,
        environmentId: body.environmentId,
        userId: body.userId,
        triggeredAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Weekly report trigger error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to trigger weekly reports',
        error: error.message,
      });
    }
  }
} 
