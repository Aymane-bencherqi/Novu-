import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AnalyticsService,
  buildFeedKey,
  buildMessageCountKey,
  InvalidateCacheService,
  WebSocketsQueueService,
} from '@novu/application-generic';
import { MessageRepository } from '@novu/dal';
import { WebSocketEventEnum } from '@novu/shared';

import { GetSubscriber } from '../../../subscribers/usecases/get-subscriber';
import { AnalyticsEventsEnum } from '../../utils';
import { UpdateAllNotificationsCommand } from './update-all-notifications.command';
import { validateDataStructure } from '../../utils/validate-data';

@Injectable()
export class UpdateAllNotifications {
  constructor(
    private invalidateCache: InvalidateCacheService,
    private getSubscriber: GetSubscriber,
    private analyticsService: AnalyticsService,
    private messageRepository: MessageRepository,
    private webSocketsQueueService: WebSocketsQueueService
  ) {}

  async execute(command: UpdateAllNotificationsCommand): Promise<void> {
    const subscriber = await this.getSubscriber.execute({
      environmentId: command.environmentId,
      organizationId: command.organizationId,
      subscriberId: command.subscriberId,
    });

    if (!subscriber) {
      throw new BadRequestException(`Subscriber with id: ${command.subscriberId} is not found.`);
    }

    let parsedData;
    if (command.from.data) {
      try {
        parsedData = JSON.parse(command.from.data);
        validateDataStructure(parsedData);
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }

        throw new BadRequestException('Invalid JSON format for data parameter');
      }
    }

    const fromField: Record<string, unknown> = {
      ...command.from,
    };

    if (parsedData) {
      fromField.data = parsedData;
    }

    await this.messageRepository.updateMessagesFromToStatus({
      environmentId: command.environmentId,
      subscriberId: subscriber._id,
      from: fromField,
      to: command.to,
    });

    await this.invalidateCache.invalidateQuery({
      key: buildFeedKey().invalidate({
        subscriberId: command.subscriberId,
        _environmentId: command.environmentId,
      }),
    });

    await this.invalidateCache.invalidateQuery({
      key: buildMessageCountKey().invalidate({
        subscriberId: command.subscriberId,
        _environmentId: command.environmentId,
      }),
    });

    this.analyticsService.track(AnalyticsEventsEnum.UPDATE_ALL_NOTIFICATIONS, '', {
      _organization: command.organizationId,
      _subscriberId: subscriber._id,
      from: command.from,
      to: command.to,
    });

    this.webSocketsQueueService.add({
      name: 'sendMessage',
      data: {
        event: WebSocketEventEnum.UNREAD,
        userId: subscriber._id,
        _environmentId: command.environmentId,
      },
      groupId: subscriber._organizationId,
    });
  }
}
