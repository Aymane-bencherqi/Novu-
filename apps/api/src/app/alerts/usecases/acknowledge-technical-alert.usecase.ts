import { Injectable } from '@nestjs/common';
import { TechnicalAlertRepository, TechnicalAlertEntity } from '@novu/dal';

@Injectable()
export class AcknowledgeTechnicalAlertUsecase {
  constructor(private technicalAlertRepository: TechnicalAlertRepository) {}

  async execute(id: string, userId?: string): Promise<TechnicalAlertEntity | null> {
    return this.technicalAlertRepository.updateAlert(id, { 
      status: 'acknowledged'
    });
  }
} 
