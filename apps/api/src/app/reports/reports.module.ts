import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { WeeklyReportCronService } from './weekly-report-cron.service';
import { NotificationModule } from '../notifications/notification.module';
import { MailService } from '../shared/services/mail/mail.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    NotificationModule,
    SharedModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, MailService, WeeklyReportCronService],
})
export class ReportsModule {} 
