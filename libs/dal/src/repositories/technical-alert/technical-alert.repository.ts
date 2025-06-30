import { BaseRepository } from '../base-repository';
import { TechnicalAlertEntity, TechnicalAlertDBModel } from './technical-alert.entity';
import { TechnicalAlert } from './technical-alert.schema';

export class TechnicalAlertRepository extends BaseRepository<TechnicalAlertDBModel, TechnicalAlertEntity, {}> {
  constructor() {
    super(TechnicalAlert, TechnicalAlertEntity);
  }

  async findAlerts(query: any = {}, limit = 20): Promise<TechnicalAlertEntity[]> {
    return this.find(query, '', { limit });
  }

  async findOneAlert(query: any): Promise<TechnicalAlertEntity | null> {
    return this.findOne(query);
  }

  async updateAlert(id: string, update: Partial<TechnicalAlertEntity>): Promise<TechnicalAlertEntity | null> {
    const result = await this.update({ _id: id } as any, update as any);
    if (result.modified > 0) {
      return this.findOne({ _id: id } as any);
    }
    return null;
  }

  async incrementErrorCount(query: any, errorMessage: string): Promise<TechnicalAlertEntity> {
    const alert = await this.findOneAlert(query);
    
    if (alert) {
      const result = await this.updateAlert(alert._id, {
        count: alert.count + 1,
        lastOccurred: new Date(),
        errorMessage,
      });
      
      if (result) {
        return result;
      }
    }

    return this.create({
      ...query,
      errorMessage,
      firstOccurred: new Date(),
      lastOccurred: new Date(),
      count: 1,
      status: 'open',
    } as any);
  }
} 
