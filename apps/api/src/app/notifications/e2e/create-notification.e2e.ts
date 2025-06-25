import { expect } from 'chai';
import { ChannelTypeEnum } from '@novu/shared';
import { UserSession } from '../../../test/helpers/user-session';
import { NotificationTemplateService } from '../../../test/helpers/notification-template.service';
import { SubscriberService } from '../../../test/helpers/subscriber.service';

describe('Create Notification via Form - /v1/notifications (POST)', () => {
  let session: UserSession;
  let notificationTemplateService: NotificationTemplateService;
  let subscriberService: SubscriberService;

  before(async () => {
    session = new UserSession();
    await session.initialize();
    notificationTemplateService = new NotificationTemplateService(
      session.user._id,
      session.organization._id,
      session.environment._id
    );
    subscriberService = new SubscriberService(session.organization._id, session.environment._id);
  });

  describe('Create notification with email content', () => {
    it('should create and send email notification successfully', async () => {
      // Create a test subscriber
      const subscriber = await subscriberService.createSubscriber();

      const notificationData = {
        title: 'Test Email Notification',
        content: {
          email: {
            subject: 'Welcome to our platform!',
            htmlContent: '<h1>Welcome {{firstName}}!</h1><p>Thank you for joining us.</p>',
            textContent: 'Welcome John! Thank you for joining us.'
          }
        },
        recipients: [
          { subscriberId: subscriber.subscriberId }
        ],
        channels: [ChannelTypeEnum.EMAIL],
        metadata: {
          source: 'e2e-test',
          testId: 'email-notification'
        }
      };

      const { body } = await session.testAgent
        .post('/v1/notifications')
        .send(notificationData)
        .expect(201);

      expect(body).to.have.property('notificationId');
      expect(body).to.have.property('transactionId');
      expect(body).to.have.property('status', 'created');
      expect(body).to.have.property('recipientCount', 1);
      expect(body).to.have.property('channels').that.includes(ChannelTypeEnum.EMAIL);
      expect(body).to.not.have.property('error');
    });
  });

  describe('Create notification with SMS content', () => {
    it('should create and send SMS notification successfully', async () => {
      // Create a test subscriber
      const subscriber = await subscriberService.createSubscriber();

      const notificationData = {
        title: 'Test SMS Notification',
        content: {
          sms: {
            content: 'Welcome {{firstName}}! Your account is now active.'
          }
        },
        recipients: [
          { subscriberId: subscriber.subscriberId }
        ],
        channels: [ChannelTypeEnum.SMS],
        metadata: {
          source: 'e2e-test',
          testId: 'sms-notification'
        }
      };

      const { body } = await session.testAgent
        .post('/v1/notifications')
        .send(notificationData)
        .expect(201);

      expect(body).to.have.property('notificationId');
      expect(body).to.have.property('transactionId');
      expect(body).to.have.property('status', 'created');
      expect(body).to.have.property('recipientCount', 1);
      expect(body).to.have.property('channels').that.includes(ChannelTypeEnum.SMS);
      expect(body).to.not.have.property('error');
    });
  });

  describe('Create notification with multiple channels', () => {
    it('should create notification with email and SMS channels', async () => {
      // Create a test subscriber
      const subscriber = await subscriberService.createSubscriber();

      const notificationData = {
        title: 'Multi-channel Notification',
        content: {
          email: {
            subject: 'Multi-channel Test',
            htmlContent: '<h1>Test</h1><p>This is a multi-channel notification.</p>'
          },
          sms: {
            content: 'Multi-channel test notification.'
          }
        },
        recipients: [
          { subscriberId: subscriber.subscriberId }
        ],
        channels: [ChannelTypeEnum.EMAIL, ChannelTypeEnum.SMS],
        metadata: {
          source: 'e2e-test',
          testId: 'multi-channel-notification'
        }
      };

      const { body } = await session.testAgent
        .post('/v1/notifications')
        .send(notificationData)
        .expect(201);

      expect(body).to.have.property('notificationId');
      expect(body).to.have.property('transactionId');
      expect(body).to.have.property('status', 'created');
      expect(body).to.have.property('recipientCount', 1);
      expect(body).to.have.property('channels').that.includes(ChannelTypeEnum.EMAIL);
      expect(body).to.have.property('channels').that.includes(ChannelTypeEnum.SMS);
      expect(body.channels).to.have.length(2);
    });
  });

  describe('Validation errors', () => {
    it('should return 400 for missing title', async () => {
      const notificationData = {
        content: {
          email: {
            subject: 'Test',
            htmlContent: '<p>Test</p>'
          }
        },
        recipients: [{ subscriberId: 'test-subscriber' }],
        channels: [ChannelTypeEnum.EMAIL]
      };

      const { body } = await session.testAgent
        .post('/v1/notifications')
        .send(notificationData)
        .expect(400);

      expect(body.message).to.include('title');
    });

    it('should return 400 for missing content', async () => {
      const notificationData = {
        title: 'Test Notification',
        recipients: [{ subscriberId: 'test-subscriber' }],
        channels: [ChannelTypeEnum.EMAIL]
      };

      const { body } = await session.testAgent
        .post('/v1/notifications')
        .send(notificationData)
        .expect(400);

      expect(body.message).to.include('content');
    });

    it('should return 400 for missing recipients', async () => {
      const notificationData = {
        title: 'Test Notification',
        content: {
          email: {
            subject: 'Test',
            htmlContent: '<p>Test</p>'
          }
        },
        channels: [ChannelTypeEnum.EMAIL]
      };

      const { body } = await session.testAgent
        .post('/v1/notifications')
        .send(notificationData)
        .expect(400);

      expect(body.message).to.include('recipients');
    });

    it('should return 400 for missing channels', async () => {
      const notificationData = {
        title: 'Test Notification',
        content: {
          email: {
            subject: 'Test',
            htmlContent: '<p>Test</p>'
          }
        },
        recipients: [{ subscriberId: 'test-subscriber' }]
      };

      const { body } = await session.testAgent
        .post('/v1/notifications')
        .send(notificationData)
        .expect(400);

      expect(body.message).to.include('channels');
    });

    it('should return 400 for non-existent subscriber', async () => {
      const notificationData = {
        title: 'Test Notification',
        content: {
          email: {
            subject: 'Test',
            htmlContent: '<p>Test</p>'
          }
        },
        recipients: [{ subscriberId: 'non-existent-subscriber' }],
        channels: [ChannelTypeEnum.EMAIL]
      };

      const { body } = await session.testAgent
        .post('/v1/notifications')
        .send(notificationData)
        .expect(400);

      expect(body.message).to.include('not found');
    });
  });
}); 
