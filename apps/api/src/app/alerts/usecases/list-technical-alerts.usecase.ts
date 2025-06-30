import { Injectable } from '@nestjs/common';
import { TechnicalAlertRepository, TechnicalAlertEntity } from '@novu/dal';

@Injectable()
export class ListTechnicalAlertsUsecase {
  constructor(private technicalAlertRepository: TechnicalAlertRepository) {}

  async execute(query: Partial<TechnicalAlertEntity> = {}, limit?: number): Promise<TechnicalAlertEntity[]> {
    return this.technicalAlertRepository.findAlerts(query, limit);
  }
} 
