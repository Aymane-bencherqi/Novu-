import { Injectable } from '@nestjs/common';
import { TechnicalAlertRepository } from '@novu/dal';
import { TechnicalAlertListItemDto, TechnicalAlertDetailDto } from './dto';

interface FindAllFilters {
  organizationId?: string;
  environmentId?: string;
  channel?: string;
  providerId?: string;
  errorType?: string;
  status?: 'open' | 'acknowledged' | 'resolved';
  search?: string;
  from?: string;
  to?: string;
}

@Injectable()
export class TechnicalAlertLogService {
  constructor(private readonly technicalAlertRepository: TechnicalAlertRepository) {}

  async findAll(
    filters: FindAllFilters,
    page = 1,
    limit = 20
  ): Promise<{ data: TechnicalAlertListItemDto[]; total: number; page: number; limit: number }> {
    const query: any = {};
    if (filters.organizationId) query.organizationId = filters.organizationId;
    if (filters.environmentId) query.environmentId = filters.environmentId;
    if (filters.channel) query.channel = filters.channel;
    if (filters.providerId) query.providerId = filters.providerId;
    if (filters.errorType) query.errorType = filters.errorType;
    if (filters.status) query.status = filters.status;
    if (filters.from || filters.to) {
      query.firstOccurred = {};
      if (filters.from) query.firstOccurred.$gte = new Date(filters.from);
      if (filters.to) query.firstOccurred.$lte = new Date(filters.to);
    }
    if (filters.search) {
      query.errorMessage = { $regex: filters.search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.technicalAlertRepository.find(query, '', { skip, limit, sort: { firstOccurred: -1 } }),
      this.technicalAlertRepository.count(query),
    ]);

    return {
      data: data.map(this.toListItemDto),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<TechnicalAlertDetailDto | null> {
    const alert = await this.technicalAlertRepository.findOne({ _id: id });
    return alert ? this.toDetailDto(alert) : null;
  }

  private toListItemDto(alert: any): TechnicalAlertListItemDto {
    function toIsoSafe(val: any) {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString();
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
      firstOccurred: toIsoSafe(alert.firstOccurred),
      lastOccurred: toIsoSafe(alert.lastOccurred),
      status: alert.status,
      createdAt: toIsoSafe(alert.createdAt),
      updatedAt: toIsoSafe(alert.updatedAt),
    };
  }

  private toDetailDto(alert: any): TechnicalAlertDetailDto {
    return this.toListItemDto(alert);
  }
} 
