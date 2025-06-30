import { Injectable } from '@nestjs/common';
import { TechnicalAlertRepository, TechnicalAlertEntity } from '@novu/dal';

@Injectable()
export class LogTechnicalAlertUsecase {
  constructor(private technicalAlertRepository: TechnicalAlertRepository) {}

  async execute(name: string, errorMessage: string): Promise<TechnicalAlertEntity> {
    const query = {
      errorType: name,
    };

    return this.technicalAlertRepository.incrementErrorCount(query, errorMessage);
  }
} 
