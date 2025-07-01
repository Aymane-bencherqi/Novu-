import { Controller, Get, Query, Param, ParseIntPipe, DefaultValuePipe, NotFoundException } from '@nestjs/common';
import { TechnicalAlertLogService } from './technical-alert-log.service';
import { TechnicalAlertListItemDto, TechnicalAlertDetailDto } from './dto';

@Controller('logs/errors')
export class LogsController {
  constructor(private readonly logService: TechnicalAlertLogService) {}

  @Get()
  async list(
    @Query('organizationId') organizationId?: string,
    @Query('environmentId') environmentId?: string,
    @Query('channel') channel?: string,
    @Query('providerId') providerId?: string,
    @Query('errorType') errorType?: string,
    @Query('status') status?: 'open' | 'acknowledged' | 'resolved',
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number
  ): Promise<{ data: TechnicalAlertListItemDto[]; total: number; page: number; limit: number }> {
    return this.logService.findAll({
      organizationId,
      environmentId,
      channel,
      providerId,
      errorType,
      status,
      search,
      from,
      to,
    }, page, limit);
  }

  @Get(':id')
  async detail(@Param('id') id: string): Promise<TechnicalAlertDetailDto> {
    const alert = await this.logService.findById(id);
    if (!alert) throw new NotFoundException('Log not found');
    return alert;
  }
} 
