import { BadRequestException, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { BlogsService } from '../src/api/blogs/blogs.service';

import { generateApp } from './helpers/test.utils';

describe('Exception filters (e2e)', () => {
  let app: INestApplication;
  // A service that will get overridden to throw errors
  let blogService: BlogsService;

  beforeAll(async () => {
    app = await generateApp();
    blogService = app.get(BlogsService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AnyExceptionFilter', () => {
    it('should capture generic errors not captured by other filters', async () => {
      blogService.getBlogs = () => {
        throw new Error('random-error');
      };
      return request(app.getHttpServer())
        .get('/api/blogs')
        .expect(500)
        .expect({
          statusCode: 500,
          error: 'Server error',
          message: 'random-error'
        });
    });
  });
  describe('BadRequestExceptionFilter', () => {
    it('should capture bad request errors', async () => {
      blogService.getBlogs = () => {
        throw new BadRequestException('bad-request-error');
      };
      return request(app.getHttpServer())
        .get('/api/blogs')
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'bad-request-error'
        });
    });
  });

  describe('NotFoundExceptionFilter', () => {
    it('should capture 404 errors and return JSON response on /api paths', async () => {
      return request(app.getHttpServer())
        .get('/api/non-existent-path')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: "Resource doesn't exist."
        });
    });

    // Note: this assumes that frontend code is present in upper directory, which is not included in this repository
    it('should capture 404 errors and return index.html on non-api paths', async () => {
      return request(app.getHttpServer())
        .get('/non-existent-path')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8');
    });
  });
});
