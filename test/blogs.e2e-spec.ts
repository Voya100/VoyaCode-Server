import { Blog } from '@api/blogs/blog.entity';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { generateApp } from './helpers/test.utils';

describe('BlogController (e2e)', () => {
  let app: INestApplication;
  let blogRepository: Repository<Blog>;

  beforeAll(async () => {
    app = await generateApp();
    blogRepository = app.get(getRepositoryToken(Blog));
    await app.init();
  });

  afterEach(async () => {
    blogRepository.clear();
  });

  describe('/GET /api/blogs', () => {
    it('should return empty array of blogs', () => {
      return request(app.getHttpServer())
        .get('/api/blogs')
        .expect(200)
        .expect({ data: [] });
    });
  });
});
