import { ApiProperty } from '@nestjs/swagger';

export class NotificationKpiResponseDto {
  @ApiProperty()
  totalSent: number;

  @ApiProperty()
  totalFailed: number;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  perChannel: Record<string, number>;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  perLanguage: Record<string, number>;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
} 
