import { ServerConfigService } from '@core/server-config/server-config.service';
import { INestApplication } from '@nestjs/common';
import { generateApp } from '@test/helpers/test.utils';
import { Request } from 'express-serve-static-core';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let config: ServerConfigService;
  let adminUser: { username: string; role: string; password: string };
  let adminCredentials: { username: string; password: string };

  beforeAll(async () => {
    app = await generateApp();
    config = app.get(ServerConfigService);
    adminUser = config.users['Admin'];
    adminCredentials = {
      username: adminUser.username,
      password: (adminUser as any).unhashedPassword
    };
    await app.init();
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
        .expect((req: Request) => {
          token = req.body.token;
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
