import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@novu/dal';
import { NotificationKpiResponseDto } from '../../dtos/notification-kpi-response.dto';

@Injectable()
export class GetNotificationKpi {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(environmentId: string, organizationId: string): Promise<NotificationKpiResponseDto> {
    const baseQuery = { _environmentId: environmentId, _organizationId: organizationId };

    const totalSent = await this.notificationRepository.count(baseQuery);
    const totalFailed = await this.notificationRepository.count({ ...baseQuery, status: 'failed' });

    // Per channel
    const perChannelAgg = await this.notificationRepository.aggregate([
      { $match: baseQuery },
      { $group: { _id: '$channel', count: { $sum: 1 } } },
    ]);
    const perChannel: Record<string, number> = {};
    perChannelAgg.forEach((item) => { perChannel[item._id] = item.count; });

    // Per language
    const perLanguageAgg = await this.notificationRepository.aggregate([
      { $match: baseQuery },
      { $group: { _id: '$language', count: { $sum: 1 } } },
    ]);
    const perLanguage: Record<string, number> = {};
    perLanguageAgg.forEach((item) => { perLanguage[item._id] = item.count; });

    // Recent activity
    const now = new Date();
    const last24h = await this.notificationRepository.count({ ...baseQuery, createdAt: { $gte: new Date(now.getTime() - 24*60*60*1000) } });
    const last7d = await this.notificationRepository.count({ ...baseQuery, createdAt: { $gte: new Date(now.getTime() - 7*24*60*60*1000) } });
    const last30d = await this.notificationRepository.count({ ...baseQuery, createdAt: { $gte: new Date(now.getTime() - 30*24*60*60*1000) } });

    return {
      totalSent,
      totalFailed,
      perChannel,
      perLanguage,
      recentActivity: { last24h, last7d, last30d },
    };
  }
} 
