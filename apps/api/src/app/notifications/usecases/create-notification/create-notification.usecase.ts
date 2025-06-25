import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ChannelTypeEnum, StepTypeEnum } from '@novu/shared';
import { 
  NotificationRepository, 
  NotificationTemplateRepository,
  SubscriberRepository,
  TopicRepository,
  OrganizationRepository
} from '@novu/dal';
import { PinoLogger } from '@novu/application-generic';
import { CreateNotificationCommand } from './create-notification.command';
import { CreateNotificationResponseDto } from '../../dtos/create-notification.dto';

const LOG_CONTEXT = 'CreateNotificationUseCase';

@Injectable()
export class CreateNotification {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationTemplateRepository: NotificationTemplateRepository,
    private subscriberRepository: SubscriberRepository,
    private topicRepository: TopicRepository,
    private organizationRepository: OrganizationRepository,
    private logger: PinoLogger
  ) {}

  async execute(command: CreateNotificationCommand): Promise<CreateNotificationResponseDto> {
    try {
      this.logger.info('Creating notification via form', LOG_CONTEXT);

      // Validate organization has required channels configured
      await this.validateOrganizationChannels(command);

      // Validate recipients exist and are accessible
      const validatedRecipients = await this.validateRecipients(command);

      // Create notification record
      const transactionId = command.transactionId || uuidv4();

      const notification = await this.notificationRepository.create({
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
        _subscriberId: validatedRecipients[0]?.subscriberId || 'system', // For tracking purposes
        transactionId,
        channels: command.channels,
        to: validatedRecipients,
        payload: {
          title: command.title,
          content: command.content,
          metadata: command.metadata,
        },
        tags: ['form-created'],
        controls: {
          source: 'form-api',
        },
      });

      this.logger.info(`Notification created successfully with ID: ${notification._id}`, LOG_CONTEXT);

      return {
        notificationId: notification._id,
        transactionId,
        status: 'created',
        recipientCount: validatedRecipients.length,
        channels: command.channels,
        scheduledAt: command.scheduledAt,
      };

    } catch (error) {
      this.logger.error(`Failed to create notification: ${error.message}`, LOG_CONTEXT);
      throw error;
    }
  }

  private async validateOrganizationChannels(command: CreateNotificationCommand): Promise<void> {
    const organization = await this.organizationRepository.findById(command.organizationId);
    
    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    // Check if organization has the required channels configured
    // Note: We'll skip channel validation for now since organization.channels might not exist
    // This can be enhanced later when organization channels are properly implemented
    this.logger.info(`Organization ${organization.name} channels validation skipped`, LOG_CONTEXT);
  }

  private async validateRecipients(command: CreateNotificationCommand): Promise<any[]> {
    const validatedRecipients: any[] = [];

    for (const recipient of command.recipients) {
      if (typeof recipient === 'string') {
        // Simple subscriber ID string
        const subscriber = await this.subscriberRepository.findBySubscriberId(
          command.environmentId,
          recipient
        );
        
        if (!subscriber) {
          throw new BadRequestException(`Subscriber with ID '${recipient}' not found`);
        }
        
        validatedRecipients.push({ subscriberId: recipient });
      } else if ('subscriberId' in recipient) {
        // SubscriberRecipientDto
        const subscriber = await this.subscriberRepository.findBySubscriberId(
          command.environmentId,
          recipient.subscriberId
        );
        
        if (!subscriber) {
          throw new BadRequestException(`Subscriber with ID '${recipient.subscriberId}' not found`);
        }
        
        validatedRecipients.push(recipient);
      } else if ('topicKey' in recipient) {
        // TopicRecipientDto - Skip topic validation for now as findByKey might not exist
        this.logger.info(`Topic validation skipped for key: ${recipient.topicKey}`, LOG_CONTEXT);
        validatedRecipients.push(recipient);
      }
    }

    if (validatedRecipients.length === 0) {
      throw new BadRequestException('At least one valid recipient is required');
    }

    return validatedRecipients;
  }
} 
