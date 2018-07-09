import { EncryptService } from '@core/encrypt/encrypt.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { generateApp } from './helpers/test.utils';

describe('BlogSubscriptionController (e2e)', () => {
  let app: INestApplication;
  let encryptService: EncryptService;

  beforeAll(async () => {
    app = await generateApp();
    encryptService = app.get(EncryptService);
    await app.init();
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
});
