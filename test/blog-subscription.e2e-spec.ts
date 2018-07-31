import { EncryptService } from '@core/encrypt/encrypt.service';
import {
  PushSubscriptionEntity,
  PushSubscriptionTopicEntity
} from '@core/push/entities';
import { PushSubscriptionDto } from '@core/push/push-subscription.dto';
import { PushService } from '@core/push/push.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { generateApp } from './helpers/test.utils';

describe('BlogSubscriptionController (e2e)', () => {
  let app: INestApplication;
  let encryptService: EncryptService;
  let pushSubscriptionRepository: Repository<PushSubscriptionEntity>;
  let pushSubscriptionTopicRepository: Repository<PushSubscriptionTopicEntity>;
  let pushService: PushService;
  const testSubscription: PushSubscriptionDto = {
    endpoint: 'https://fake-endpoint-for-push-service/12345?id=12345',
    keys: {
      p256dh: 'abcdefg',
      auth: '123456'
    }
  };

  beforeAll(async () => {
    app = await generateApp();
    encryptService = app.get(EncryptService);
    pushService = app.get(PushService);
    pushSubscriptionRepository = app.get(
      getRepositoryToken(PushSubscriptionEntity)
    );
    pushSubscriptionTopicRepository = app.get(
      getRepositoryToken(PushSubscriptionTopicEntity)
    );
    await app.init();
  });

  afterEach(async () => {
    // Must use delete instead of clear because of foreign key constraints
    await pushSubscriptionTopicRepository.delete({});
    await pushSubscriptionRepository.delete({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/blogs/subscribe', () => {
    it('should return success message on valid email', () => {
      return request(app.getHttpServer())
        .post('/api/blogs/subscribe')
        .send({ email: 'tester@voyacode.com' })
        .expect(200)
        .expect({
          message:
            'Confirmation link has been sent to your email address. Use the link to confirm your subscription.'
        });
    });

    it('should return 400 on invalid email', async () => {
      return request(app.getHttpServer())
        .post('/api/blogs/subscribe')
        .send({ email: 'not-valid-email' })
        .expect(400);
    });
  });

  describe('POST /api/blogs/subscribe/:email', () => {
    it('should return success message on valid email token', () => {
      const emailToken = encryptService.urlEncrypt('tester@voyacode.com');
      return request(app.getHttpServer())
        .post('/api/blogs/subscribe/' + emailToken)
        .expect(200);
    });

    it('should return 400 on invalid email token', async () => {
      return request(app.getHttpServer())
        .post('/api/blogs/subscribe/invalid-token')
        .expect(400);
    });
  });

  describe('POST /api/blogs/unsubscribe/:email', () => {
    it('should return success message on valid email token', () => {
      const emailToken = encryptService.urlEncrypt('tester@voyacode.com');
      return request(app.getHttpServer())
        .post('/api/blogs/unsubscribe/' + emailToken)
        .expect(200);
    });

    it('should return 400 on invalid email token', async () => {
      return request(app.getHttpServer())
        .post('/api/blogs/unsubscribe/invalid-token')
        .expect(400);
    });
  });

  describe('POST /api/blogs/push/subscribe', () => {
    it('should add subscription to database', async () => {
      await request(app.getHttpServer())
        .post('/api/blogs/push/subscribe')
        .send(testSubscription)
        .expect(200)
        .expect({
          message: 'Push notification subscription successful.'
        });
      const subscription = await pushSubscriptionRepository.findOneOrFail({
        relations: ['topics'],
        where: { endpoint: testSubscription.endpoint }
      });
      expect(subscription).not.toBeUndefined();
      expect(subscription.topics.length).toBe(1);
      expect(subscription.topics[0].name).toBe('blogs');
    });

    // Note: One subscription can be subscribed to 1 or more topics
    it('should add topic subscription to database even if subscription entity already exists', async () => {
      const subscription = await pushService.subscribe(testSubscription);
      await request(app.getHttpServer())
        .post('/api/blogs/push/subscribe')
        .send(testSubscription)
        .expect(200)
        .expect({
          message: 'Push notification subscription successful.'
        });
      const topics = await pushSubscriptionTopicRepository.find({
        subscription
      });
      expect(topics.length).toBe(1);
      expect(topics[0].name).toBe('blogs');
    });
  });

  describe('POST /api/blogs/push/unsubscribe', () => {
    it('should remove subscription and topic subscription from database', async () => {
      // Subscribe first
      await request(app.getHttpServer())
        .post('/api/blogs/push/subscribe')
        .send(testSubscription)
        .expect(200)
        .expect({
          message: 'Push notification subscription successful.'
        });
      // Unsubscribe
      await request(app.getHttpServer())
        .post('/api/blogs/push/unsubscribe')
        .send(testSubscription)
        .expect(200)
        .expect({
          message: 'Successfully unsubscribed from blog push notifications.'
        });
      const subscriptionsCount = await pushSubscriptionRepository.count();
      const topicsCount = await pushSubscriptionTopicRepository.count();
      expect(subscriptionsCount).toBe(0);
      expect(topicsCount).toBe(0);
    });

    it('should not remove subscription if subscription has other topics', async () => {
      const subscriptionData = {
        ...testSubscription,
        topics: [{ name: 'blogs' }, { name: 'other-topic' }]
      };
      const subscription = await pushSubscriptionRepository.create(
        subscriptionData
      );
      await pushSubscriptionRepository.save(subscription);
      await request(app.getHttpServer())
        .post('/api/blogs/push/unsubscribe')
        .send(testSubscription)
        .expect(200)
        .expect({
          message: 'Successfully unsubscribed from blog push notifications.'
        });
      const updatedSubscription = await pushSubscriptionRepository.findOne({
        relations: ['topics'],
        where: { endpoint: subscription.endpoint }
      });
      expect(updatedSubscription).not.toBeUndefined();
      expect(updatedSubscription.topics.length).toBe(1);
    });

    it('should return error if subscription does not exist', async () => {
      await request(app.getHttpServer())
        .post('/api/blogs/push/unsubscribe')
        .send(testSubscription)
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Subscription does not exist or is already removed.'
        });
    });
  });
});
