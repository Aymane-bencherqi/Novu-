import { Module } from '@nestjs/common';
import { TechnicalAlertController } from './technical-alert.controller';
import { ListTechnicalAlertsUsecase } from './usecases/list-technical-alerts.usecase';
import { AcknowledgeTechnicalAlertUsecase } from './usecases/acknowledge-technical-alert.usecase';
import { LogTechnicalAlertUsecase } from './usecases/log-technical-alert.usecase';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [ListTechnicalAlertsUsecase, AcknowledgeTechnicalAlertUsecase, LogTechnicalAlertUsecase],
  controllers: [TechnicalAlertController],
  exports: [],
})
export class AlertsModule {} 
