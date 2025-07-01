import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';
import { GetActivityFeed } from '../notifications/usecases/get-activity-feed/get-activity-feed.usecase';
import { GetActivityFeedCommand } from '../notifications/usecases/get-activity-feed/get-activity-feed.command';
import { GetNotificationKpi } from '../notifications/usecases/get-notification-kpi/get-notification-kpi.usecase';
import { MailService } from '../shared/services/mail/mail.service';

@Injectable()
export class ReportsService {
  constructor(
    private getActivityFeedUsecase: GetActivityFeed,
    private getNotificationKpi: GetNotificationKpi,
    private mailService: MailService,
  ) {}

  async generateNotificationsPDF(environmentId: string, organizationId: string, userId: string): Promise<Buffer> {
    try {
      const notifications = await this.getActivityFeedUsecase.execute(
        GetActivityFeedCommand.create({
          page: 0,
          limit: 1000, // Get more data for export
          organizationId,
          environmentId,
          userId,
        })
      );

      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {});

      // Add title
      doc.fontSize(20).text('Notifications Report', { align: 'center' });
      doc.moveDown();

      // Add table headers
      doc.fontSize(12);
      doc.text('ID', 50, doc.y);
      doc.text('Template', 150, doc.y);
      doc.text('Channel', 250, doc.y);
      doc.text('Status', 350, doc.y);
      doc.text('Created', 450, doc.y);
      doc.moveDown();

      // Add data rows
      notifications.data.forEach((notification: any) => {
        doc.fontSize(10);
        doc.text(notification._id?.substring(0, 8) || '', 50, doc.y);
        doc.text(notification._template?.name || '', 150, doc.y);
        doc.text(notification.channel || '', 250, doc.y);
        doc.text(notification.status || '', 350, doc.y);
        doc.text(new Date(notification.createdAt).toLocaleDateString(), 450, doc.y);
        doc.moveDown();
      });

      doc.end();

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  async generateNotificationsExcel(environmentId: string, organizationId: string, userId: string): Promise<Buffer> {
    try {
      const notifications = await this.getActivityFeedUsecase.execute(
        GetActivityFeedCommand.create({
          page: 0,
          limit: 1000,
          organizationId,
          environmentId,
          userId,
        })
      );

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Notifications');

      // Add headers
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Template', key: 'template', width: 30 },
        { header: 'Channel', key: 'channel', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Created', key: 'created', width: 20 },
        { header: 'Recipient', key: 'recipient', width: 30 },
      ];

      // Add data
      notifications.data.forEach((notification: any) => {
        worksheet.addRow({
          id: notification._id?.substring(0, 8) || '',
          template: notification._template?.name || '',
          channel: notification.channel || '',
          status: notification.status || '',
          created: new Date(notification.createdAt).toLocaleDateString(),
          recipient: notification._subscriber?.email || notification._subscriber?.phone || '',
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw error;
    }
  }

  async generateKpisPDF(environmentId: string, organizationId: string): Promise<Buffer> {
    try {
      const kpis = await this.getNotificationKpi.execute(environmentId, organizationId);

      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {});

      // Add title
      doc.fontSize(20).text('KPIs Report', { align: 'center' });
      doc.moveDown();

      // Add KPI data
      doc.fontSize(14).text('Key Performance Indicators', { underline: true });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Total Sent: ${kpis.totalSent || 0}`, 50, doc.y);
      doc.moveDown();
      doc.text(`Total Failed: ${kpis.totalFailed || 0}`, 50, doc.y);
      doc.moveDown();

      // Add channel breakdown if available
      if (kpis.perChannel) {
        doc.moveDown();
        doc.fontSize(14).text('Channel Breakdown', { underline: true });
        doc.moveDown();

        Object.entries(kpis.perChannel).forEach(([channel, count]: [string, number]) => {
          doc.fontSize(12);
          doc.text(`${channel}: ${count}`, 50, doc.y);
          doc.moveDown();
        });
      }

      // Add recent activity if available
      if (kpis.recentActivity) {
        doc.moveDown();
        doc.fontSize(14).text('Recent Activity', { underline: true });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Last 24h: ${kpis.recentActivity.last24h || 0}`, 50, doc.y);
        doc.moveDown();
        doc.text(`Last 7 days: ${kpis.recentActivity.last7d || 0}`, 50, doc.y);
        doc.moveDown();
        doc.text(`Last 30 days: ${kpis.recentActivity.last30d || 0}`, 50, doc.y);
        doc.moveDown();
      }

      doc.end();

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error generating KPI PDF:', error);
      throw error;
    }
  }

  async generateKpisExcel(environmentId: string, organizationId: string): Promise<Buffer> {
    try {
      const kpis = await this.getNotificationKpi.execute(environmentId, organizationId);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('KPIs');

      // Add summary data
      worksheet.columns = [
        { header: 'Metric', key: 'metric', width: 20 },
        { header: 'Value', key: 'value', width: 15 },
      ];

      worksheet.addRow({ metric: 'Total Sent', value: kpis.totalSent || 0 });
      worksheet.addRow({ metric: 'Total Failed', value: kpis.totalFailed || 0 });

      // Add channel breakdown if available
      if (kpis.perChannel) {
        worksheet.addRow({ metric: '', value: '' }); // Empty row
        worksheet.addRow({ metric: 'Channel Breakdown', value: '' });

        Object.entries(kpis.perChannel).forEach(([channel, count]: [string, number]) => {
          worksheet.addRow({ metric: `${channel}`, value: count });
        });
      }

      // Add recent activity if available
      if (kpis.recentActivity) {
        worksheet.addRow({ metric: '', value: '' }); // Empty row
        worksheet.addRow({ metric: 'Recent Activity', value: '' });
        worksheet.addRow({ metric: 'Last 24h', value: kpis.recentActivity.last24h || 0 });
        worksheet.addRow({ metric: 'Last 7 days', value: kpis.recentActivity.last7d || 0 });
        worksheet.addRow({ metric: 'Last 30 days', value: kpis.recentActivity.last30d || 0 });
      }

      const arrayBuffer = await workbook.xlsx.writeBuffer();
      // Correction : s'assurer que c'est bien un Buffer Node.js
      const buffer = Buffer.isBuffer(arrayBuffer) ? arrayBuffer : Buffer.from(arrayBuffer);
      console.log('Excel buffer type:', typeof buffer, 'length:', buffer.length);
      return buffer;
    } catch (error) {
      console.error('Error generating KPI Excel:', error);
      throw error;
    }
  }

  async generateWeeklyReport(environmentId: string, organizationId: string, userId: string): Promise<{
    kpis: any;
    notifications: any;
    reportDate: string;
    weekStart: string;
    weekEnd: string;
  }> {
    try {
      // Calculate date range for the past week
      const now = new Date();
      const weekEnd = new Date(now);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);

      // Get KPIs for the week
      const kpis = await this.getNotificationKpi.execute(environmentId, organizationId);

      // Get notifications for the week (last 1000 to avoid memory issues)
      const notifications = await this.getActivityFeedUsecase.execute(
        GetActivityFeedCommand.create({
          page: 0,
          limit: 1000,
          organizationId,
          environmentId,
          userId,
        })
      );

      // Filter notifications for the past week
      const weeklyNotifications = notifications.data.filter((notification: any) => {
        const notificationDate = new Date(notification.createdAt);
        return notificationDate >= weekStart && notificationDate <= weekEnd;
      });

      return {
        kpis,
        notifications: weeklyNotifications,
        reportDate: now.toISOString().split('T')[0],
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
      };
    } catch (error) {
      console.error('Error generating weekly report:', error);
      throw error;
    }
  }

  async generateWeeklyReportPDF(environmentId: string, organizationId: string, userId: string): Promise<Buffer> {
    try {
      const reportData = await this.generateWeeklyReport(environmentId, organizationId, userId);

      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {});

      // Add title
      doc.fontSize(24).text('Weekly Notification Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Report Period: ${reportData.weekStart} to ${reportData.weekEnd}`, { align: 'center' });
      doc.moveDown(2);

      // Add summary section
      doc.fontSize(16).text('Executive Summary', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Total Notifications Sent: ${reportData.kpis.totalSent || 0}`, 50, doc.y);
      doc.moveDown();
      doc.text(`Failed Notifications: ${reportData.kpis.totalFailed || 0}`, 50, doc.y);
      doc.moveDown();
      doc.text(`Success Rate: ${reportData.kpis.totalSent > 0 ? ((reportData.kpis.totalSent - (reportData.kpis.totalFailed || 0)) / reportData.kpis.totalSent * 100).toFixed(1) : 0}%`, 50, doc.y);
      doc.moveDown(2);

      // Add channel breakdown
      if (reportData.kpis.perChannel) {
        doc.fontSize(16).text('Channel Performance', { underline: true });
        doc.moveDown();
        doc.fontSize(12);

        Object.entries(reportData.kpis.perChannel).forEach(([channel, count]: [string, number]) => {
          doc.text(`${channel}: ${count} notifications`, 50, doc.y);
          doc.moveDown();
        });
        doc.moveDown();
      }

      // Add recent activity
      if (reportData.kpis.recentActivity) {
        doc.fontSize(16).text('Recent Activity', { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Last 24h: ${reportData.kpis.recentActivity.last24h || 0} notifications`, 50, doc.y);
        doc.moveDown();
        doc.text(`Last 7 days: ${reportData.kpis.recentActivity.last7d || 0} notifications`, 50, doc.y);
        doc.moveDown();
        doc.text(`Last 30 days: ${reportData.kpis.recentActivity.last30d || 0} notifications`, 50, doc.y);
        doc.moveDown(2);
      }

      // Add weekly notifications table
      doc.fontSize(16).text('Weekly Notifications', { underline: true });
      doc.moveDown();

      if (reportData.notifications.length > 0) {
        // Add table headers
        doc.fontSize(10);
        doc.text('Date', 50, doc.y);
        doc.text('Template', 120, doc.y);
        doc.text('Channel', 250, doc.y);
        doc.text('Status', 320, doc.y);
        doc.moveDown();

        // Add data rows (limit to first 50 for PDF readability)
        reportData.notifications.slice(0, 50).forEach((notification: any) => {
          doc.fontSize(9);
          doc.text(new Date(notification.createdAt).toLocaleDateString(), 50, doc.y);
          doc.text(notification._template?.name || 'N/A', 120, doc.y);
          doc.text(notification.channel || 'N/A', 250, doc.y);
          doc.text(notification.status || 'N/A', 320, doc.y);
          doc.moveDown();
        });

        if (reportData.notifications.length > 50) {
          doc.moveDown();
          doc.fontSize(10).text(`... and ${reportData.notifications.length - 50} more notifications`, 50, doc.y);
        }
      } else {
        doc.fontSize(12).text('No notifications found for this week.', 50, doc.y);
      }

      doc.end();

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error generating weekly report PDF:', error);
      throw error;
    }
  }

  async generateWeeklyReportEmail(environmentId: string, organizationId: string, userId: string, recipientEmail: string): Promise<void> {
    try {
      const reportData = await this.generateWeeklyReport(environmentId, organizationId, userId);
      
      // Generate PDF attachment
      const pdfBuffer = await this.generateWeeklyReportPDF(environmentId, organizationId, userId);

      // Calculate success rate
      const successRate = reportData.kpis.totalSent > 0 
        ? ((reportData.kpis.totalSent - (reportData.kpis.totalFailed || 0)) / reportData.kpis.totalSent * 100).toFixed(1)
        : '0';

      // Create email HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Weekly Notification Report</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .metric { background-color: #e9ecef; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric h3 { margin: 0 0 10px 0; color: #495057; }
            .metric p { margin: 5px 0; }
            .channel-breakdown { margin: 20px 0; }
            .channel-item { padding: 8px; background-color: #f8f9fa; margin: 5px 0; border-left: 4px solid #007bff; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Weekly Notification Report</h1>
            <p><strong>Report Period:</strong> ${reportData.weekStart} to ${reportData.weekEnd}</p>
            <p><strong>Generated:</strong> ${reportData.reportDate}</p>
          </div>
          
          <div class="content">
            <div class="metric">
              <h3>📈 Executive Summary</h3>
              <p><strong>Total Notifications Sent:</strong> ${reportData.kpis.totalSent || 0}</p>
              <p><strong>Failed Notifications:</strong> ${reportData.kpis.totalFailed || 0}</p>
              <p><strong>Success Rate:</strong> ${successRate}%</p>
            </div>

            ${reportData.kpis.perChannel ? `
            <div class="channel-breakdown">
              <h3>📱 Channel Performance</h3>
              ${Object.entries(reportData.kpis.perChannel).map(([channel, count]: [string, number]) => `
                <div class="channel-item">
                  <strong>${channel}:</strong> ${count} notifications
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${reportData.kpis.recentActivity ? `
            <div class="metric">
              <h3>⏰ Recent Activity</h3>
              <p><strong>Last 24h:</strong> ${reportData.kpis.recentActivity.last24h || 0} notifications</p>
              <p><strong>Last 7 days:</strong> ${reportData.kpis.recentActivity.last7d || 0} notifications</p>
              <p><strong>Last 30 days:</strong> ${reportData.kpis.recentActivity.last30d || 0} notifications</p>
            </div>
            ` : ''}

            <div class="metric">
              <h3>📋 Weekly Notifications</h3>
              <p><strong>Total Notifications This Week:</strong> ${reportData.notifications.length}</p>
              <p>A detailed list of all notifications is attached as a PDF file.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This report was automatically generated by Novu Notification System</p>
            <p>For questions or support, please contact your system administrator</p>
          </div>
        </body>
        </html>
      `;

      // Send email with PDF attachment
      await this.mailService.sendMail({
        to: recipientEmail,
        from: {
          name: 'Novu Notification System',
          email: 'reports@novu.co'
        },
        subject: `Weekly Notification Report - ${reportData.weekStart} to ${reportData.weekEnd}`,
        html: htmlContent,
        attachments: [{
          filename: `weekly-report-${reportData.weekStart}-${reportData.weekEnd}.pdf`,
          content: pdfBuffer.toString('base64'),
          type: 'application/pdf'
        }]
      });

      console.log(`Weekly report sent successfully to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending weekly report email:', error);
      throw error;
    }
  }

  async generateWeeklyReportExcel(environmentId: string, organizationId: string, userId: string): Promise<Buffer> {
    try {
      const reportData = await this.generateWeeklyReport(environmentId, organizationId, userId);

      const workbook = new ExcelJS.Workbook();
      
      // Summary worksheet
      const summarySheet = workbook.addWorksheet('Summary');
      summarySheet.columns = [
        { header: 'Metric', key: 'metric', width: 25 },
        { header: 'Value', key: 'value', width: 15 },
      ];

      summarySheet.addRow({ metric: 'Report Period', value: `${reportData.weekStart} to ${reportData.weekEnd}` });
      summarySheet.addRow({ metric: 'Total Sent', value: reportData.kpis.totalSent || 0 });
      summarySheet.addRow({ metric: 'Total Failed', value: reportData.kpis.totalFailed || 0 });
      summarySheet.addRow({ 
        metric: 'Success Rate', 
        value: reportData.kpis.totalSent > 0 
          ? `${((reportData.kpis.totalSent - (reportData.kpis.totalFailed || 0)) / reportData.kpis.totalSent * 100).toFixed(1)}%`
          : '0%'
      });

      // Channel breakdown
      if (reportData.kpis.perChannel) {
        summarySheet.addRow({ metric: '', value: '' });
        summarySheet.addRow({ metric: 'Channel Breakdown', value: '' });
        
        Object.entries(reportData.kpis.perChannel).forEach(([channel, count]: [string, number]) => {
          summarySheet.addRow({ metric: channel, value: count });
        });
      }

      // Recent activity
      if (reportData.kpis.recentActivity) {
        summarySheet.addRow({ metric: '', value: '' });
        summarySheet.addRow({ metric: 'Recent Activity', value: '' });
        summarySheet.addRow({ metric: 'Last 24h', value: reportData.kpis.recentActivity.last24h || 0 });
        summarySheet.addRow({ metric: 'Last 7 days', value: reportData.kpis.recentActivity.last7d || 0 });
        summarySheet.addRow({ metric: 'Last 30 days', value: reportData.kpis.recentActivity.last30d || 0 });
      }

      // Notifications worksheet
      const notificationsSheet = workbook.addWorksheet('Weekly Notifications');
      notificationsSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Template', key: 'template', width: 30 },
        { header: 'Channel', key: 'channel', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Recipient', key: 'recipient', width: 30 },
      ];

      reportData.notifications.forEach((notification: any) => {
        notificationsSheet.addRow({
          date: new Date(notification.createdAt).toLocaleDateString(),
          template: notification._template?.name || 'N/A',
          channel: notification.channel || 'N/A',
          status: notification.status || 'N/A',
          recipient: notification._subscriber?.email || notification._subscriber?.phone || 'N/A',
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      console.error('Error generating weekly report Excel:', error);
      throw error;
    }
  }
} 
