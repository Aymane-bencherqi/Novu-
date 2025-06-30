import { ApiProperty } from '@nestjs/swagger';

export class TechnicalAlertDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  environmentId: string;

  @ApiProperty()
  channel: string;

  @ApiProperty()
  providerId: string;

  @ApiProperty()
  errorType: string;

  @ApiProperty()
  errorMessage: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  firstOccurred: Date;

  @ApiProperty()
  lastOccurred: Date;

  @ApiProperty({ enum: ['open', 'acknowledged', 'resolved'] })
  status: 'open' | 'acknowledged' | 'resolved';

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
} 
