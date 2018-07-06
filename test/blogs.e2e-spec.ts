import { Blog } from '@api/blogs/blog.entity';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Response } from 'supertest';
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

  const rawBlogs = [
    {
      name: 'Blog1',
      text: 'Blog 1 [b]description[/b]',
      date: new Date('2018-07-01T19:22:10.152Z')
    },
    {
      name: 'Blog2',
      text: 'Blog 2 description',
      date: new Date('2018-07-11T19:22:10.152Z')
    }
  ];
  const formattedBlogs = [
    {
      name: 'Blog1',
      text: 'Blog 1 <b>description</b>',
      date: '01.07.2018',
      year: 2018
    },
    {
      name: 'Blog2',
      text: 'Blog 2 description',
      date: '11.07.2018',
      year: 2018
    }
  ];

  describe('GET /api/blogs', () => {
    it('should return empty array of blogs', () => {
      return request(app.getHttpServer())
        .get('/api/blogs')
        .expect(200)
        .expect({ data: [] });
    });

    it('should return formatted blog results in descending ID order', async () => {
      const inserts = await blogRepository.insert(rawBlogs);
      const expectedData = inserts.identifiers
        .map((id, i) => ({ ...id, ...formattedBlogs[i] }))
        .reverse();
      return request(app.getHttpServer())
        .get('/api/blogs')
        .expect(200)
        .expect({ data: expectedData });
    });
  });

  describe('GET /api/blogs/:id', () => {
    it('should return 404 when id does not exist', () => {
      return request(app.getHttpServer())
        .get('/api/blogs/1')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Blog does not exist.'
        });
    });

    it('should return formatted blog result', async () => {
      await blogRepository.insert(rawBlogs);
      const blog = await blogRepository.findOne(rawBlogs[0]);
      return request(app.getHttpServer())
        .get('/api/blogs/' + blog.id)
        .expect(200)
        .expect({
          data: { id: blog.id, ...formattedBlogs[0] }
        });
    });
  });
  describe('GET /api/blogs/raw/:id', () => {
    it('should return 404 when id does not exist', () => {
      return request(app.getHttpServer())
        .get('/api/blogs/raw/1')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Blog does not exist.'
        });
    });

    it('should return unformatted blog result', async () => {
      await blogRepository.insert(rawBlogs);
      const blog = await blogRepository.findOne();
      return request(app.getHttpServer())
        .get('/api/blogs/raw/' + blog.id)
        .expect(200)
        .expect({
          data: { ...blog, date: blog.date.toISOString() }
        });
    });
  });

  describe('POST /api/blogs', () => {
    it('should post a blog', async () => {
      const blog = rawBlogs[0];
      let id: number;
      await request(app.getHttpServer())
        .post('/api/blogs')
        .send({ text: blog.text, name: blog.name })
        .expect(201)
        .expect((response: Response) => {
          const { data } = response.body;
          id = data.id;
          expect(data.name).toBe(blog.name);
          expect(data.text).toBe(blog.text);
          expect(data.id).toBeDefined();
          expect(data.date).toBeDefined();
          expect(response.body.message).toBe('Blog added successfully.');
        });
      await blogRepository.findOneOrFail(id);
    });

    it('should not post a blog with name that is too long', async () => {
      const blog = rawBlogs[0];
      const longName = 'a'.repeat(256);
      await request(app.getHttpServer())
        .post('/api/blogs')
        .send({ text: blog.text, name: longName })
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: ["Name can't be longer than  255 characters."]
        });
      expect(await blogRepository.count()).toBe(0);
    });

    it("should not post a blog that doesn't have a name", async () => {
      const blog = rawBlogs[0];
      await request(app.getHttpServer())
        .post('/api/blogs')
        .send({ text: blog.text })
        .expect(400);
      expect(await blogRepository.count()).toBe(0);
    });
    // TODO:
    it('should not post a blog from unauthenticated user');
  });
});
