import { ServerConfigService } from '@core/server-config/server-config.service';
import { INestApplication } from '@nestjs/common';
import { generateApp } from '@test/helpers/test.utils';
import ExpressBrute from 'express-brute';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import { Response } from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let config: ServerConfigService;
  let adminUser: { username: string; role: string; password: string };
  let adminCredentials: { username: string; password: string };
  let rateLimiterStore: ExpressBrute.MemoryStore;
  let rateLimiterSetSpy: jest.SpyInstance;

  beforeAll(async () => {
    app = await generateApp();
    config = app.get(ServerConfigService);
    rateLimiterStore = app.get('ExpressBrute.MemoryStore');
    rateLimiterSetSpy = jest.spyOn(rateLimiterStore, 'set');

    adminUser = config.users['Admin'];
    adminCredentials = {
      username: adminUser.username,
      password: (adminUser as any).unhashedPassword
    };
    await app.init();
  });

  afterEach(async () => {
    // Reset limiter store before each test
    rateLimiterSetSpy.mock.calls.map(async ([key]: string[]) => {
      await new Promise(resolve => {
        rateLimiterStore.reset(key, resolve);
      });
    });
    rateLimiterSetSpy.mock.calls = [];
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST api/auth/login', () => {
    it('should return token on successful login', async () => {
      let token: string;
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(adminCredentials)
        .expect(200)
        .expect((res: Response) => {
          token = res.body.token;
          expect(typeof token).toBe('string');
        });
      // Test the token
      await request(app.getHttpServer())
        .get('/api/auth/check-login')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect({
          message: 'Logged in.'
        });
    });

    it('should return 401 on wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: adminCredentials.username,
          password: 'fake-password'
        })
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Login failed: wrong username or password.'
        });
    });

    it('should return 401 on wrong username', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'fake-user', password: 'fake-password' })
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Login failed: wrong username or password.'
        });
    });

    it("should return 400 when credentials aren't provided", async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .expect(400);
    });

    describe('rate limiting', () => {
      async function loginFailureLoop(username: string, iterations: number) {
        for (let i = 0; i < iterations; i++) {
          await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({ username, password: 'fake-password' })
            .expect(401);
        }
      }

      it('should return 429 when login fails too many times', async () => {
        await loginFailureLoop('fake-user-1', 6);
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ username: 'fake-user-1', password: 'fake-password' })
          .expect(429)
          .expect((res: Response) => {
            const expireDate = new Date(res.body.nextValidRequestDate);
            // Should have roughly 5 minute delay
            expect(Date.now() + 4.75 * 60 < expireDate.getTime());
            expect(Date.now() + 5.25 * 60 > expireDate.getTime());
          });
      });

      it('should have separate rate limits for different usernames', async () => {
        await loginFailureLoop('fake-user-2', 5);
        await loginFailureLoop('fake-user-3', 5);
      });

      it('should reset rate limit counter on successfull login', async () => {
        await loginFailureLoop(adminCredentials.username, 5);
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(adminCredentials)
          .expect(200);
        await loginFailureLoop(adminCredentials.username, 5);
      });
    });
  });

  describe('GET api/auth/check-login', () => {
    it('should return 401 when authorization token is missing', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/check-login')
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'A valid authentication token is required.'
        });
    });

    it('should return 401 with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/check-login')
        .set('Authorization', 'Bearer fake-token')
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'A valid authentication token is required.'
        });
    });

    it('should return 401 with expired token', async () => {
      const expiredToken = await jwt.sign(
        {
          ...adminUser,
          iat: Math.floor(Date.now() / 1000) - 120,
          exp: Math.floor(Date.now() / 1000) - 60
        },
        config.jwt.tokenSecret
      );
      await request(app.getHttpServer())
        .get('/api/auth/check-login')
        .set('Authorization', 'Bearer ' + expiredToken)
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Session has expired.'
        });
    });
  });
});
