import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { TechnicalAlertLogService } from './technical-alert-log.service';
import { TechnicalAlertRepository } from '@novu/dal';

@Module({
  controllers: [LogsController],
  providers: [TechnicalAlertLogService, TechnicalAlertRepository],
  exports: [TechnicalAlertLogService],
})
export class LogsModule {} 
