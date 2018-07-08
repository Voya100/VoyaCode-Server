import { BlogEntity } from '@api/blogs/blog.entity';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Response } from 'supertest';
import { Repository } from 'typeorm';
import { generateApp, getAuthHeader } from './helpers/test.utils';

describe('BlogController (e2e)', () => {
  let app: INestApplication;
  let blogRepository: Repository<BlogEntity>;
  let authHeader: string;

  beforeAll(async () => {
    app = await generateApp();
    blogRepository = app.get(getRepositoryToken(BlogEntity));
    authHeader = await getAuthHeader(app, 'Admin', 'admin');
    await app.init();
  });

  afterEach(async () => {
    await blogRepository.clear();
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
    },
    {
      name: 'Blog3',
      text: 'Blog 3: [url=/my-url]Link[/url]',
      date: new Date('2019-10-15T19:22:10.152Z')
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
    },
    {
      name: 'Blog3',
      text: 'Blog 3: <a href="/my-url">Link</a>',
      date: '15.10.2019',
      year: 2019
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

    it('should return number of blogs that matches the limit param', async () => {
      const inserts = await blogRepository.insert(rawBlogs);
      const expectedData = inserts.identifiers
        .map((id, i) => ({ ...id, ...formattedBlogs[i] }))
        .reverse();
      return request(app.getHttpServer())
        .get('/api/blogs?limit=2')
        .expect(200)
        .expect({ data: expectedData.slice(0, 2) });
    });

    it('should return max number of blogs if limit is higher than that', async () => {
      const inserts = await blogRepository.insert(rawBlogs);
      const expectedData = inserts.identifiers
        .map((id, i) => ({ ...id, ...formattedBlogs[i] }))
        .reverse();
      return request(app.getHttpServer())
        .get('/api/blogs?limit=999')
        .expect(200)
        .expect({ data: expectedData });
    });

    it('should return 400 if limit is negative', async () => {
      await blogRepository.insert(rawBlogs);
      return request(app.getHttpServer())
        .get('/api/blogs?limit=-999')
        .expect(400);
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
        .set('Authorization', authHeader)
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
        .set('Authorization', authHeader)
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
        .set('Authorization', authHeader)
        .send({ text: blog.text })
        .expect(400);
      expect(await blogRepository.count()).toBe(0);
    });

    it('should not post a blog from unauthenticated user', async () => {
      const blog = rawBlogs[0];
      await request(app.getHttpServer())
        .post('/api/blogs')
        .send({ name: blog.name, text: blog.text })
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'A valid authentication token is required.'
        });
    });
  });

  describe('POST /api/blogs/preview', () => {
    it('should return a formatted version of the blog', async () => {
      const blog = rawBlogs[0];
      const formattedBlog = formattedBlogs[0];
      await request(app.getHttpServer())
        .post('/api/blogs/preview')
        .send({ text: blog.text, name: blog.name })
        .expect(201)
        .expect((response: Response) => {
          const { data } = response.body;
          expect(data.name).toBe(formattedBlog.name);
          expect(data.text).toBe(formattedBlog.text);
          expect(data.id).toBeDefined();
          expect(data.date).toBeDefined();
        });
    });
  });

  describe('PUT /api/blogs/:id', async () => {
    it('should edit a blog', async () => {
      await blogRepository.insert(rawBlogs);
      const blog = await blogRepository.findOne();
      const updatedBlog = { id: blog.id, text: 'new-text', name: 'new-name' };
      await request(app.getHttpServer())
        .put('/api/blogs/' + blog.id)
        .set('Authorization', authHeader)
        .send({ text: updatedBlog.text, name: updatedBlog.name })
        .expect(200)
        .expect({
          data: { ...blog, ...updatedBlog, date: blog.date.toISOString() },
          message: 'Blog edited successfully.'
        });
      const blogFromDb = await blogRepository.findOneOrFail(updatedBlog);
      // Release date should stay the same
      expect(blogFromDb.date).toEqual(blog.date);
    });

    it('should not edit a blog with name that is too long', async () => {
      await blogRepository.insert(rawBlogs);
      const blog = await blogRepository.findOne();
      const longName = 'a'.repeat(256);
      const updatedBlog = { text: 'new-text', name: longName };
      await request(app.getHttpServer())
        .put('/api/blogs/' + blog.id)
        .set('Authorization', authHeader)
        .send(updatedBlog)
        .expect(400);
      await blogRepository.findOneOrFail(blog);
    });

    it('should not edit a blog if user is unauthenticated', async () => {
      await blogRepository.insert(rawBlogs);
      const blog = await blogRepository.findOne();
      const updatedBlog = { text: 'new-text', name: 'name' };
      await request(app.getHttpServer())
        .put('/api/blogs/' + blog.id)
        .send(updatedBlog)
        .expect(401);
      await blogRepository.findOneOrFail(blog);
    });

    it('should return 404 when id does not exist', () => {
      return request(app.getHttpServer())
        .put('/api/blogs/1')
        .set('Authorization', authHeader)
        .send({ text: 'text', name: 'name' })
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Blog does not exist.'
        });
    });
  });

  describe('DELETE /api/blogs/:id', async () => {
    it('should delete a blog', async () => {
      await blogRepository.insert(rawBlogs);
      const blog = await blogRepository.findOne();
      await request(app.getHttpServer())
        .delete('/api/blogs/' + blog.id)
        .set('Authorization', authHeader)
        .expect(200)
        .expect({
          message: 'Blog deleted successfully.'
        });
      expect(await blogRepository.findOne(blog.id)).toBeUndefined();
    });

    it('should not delete a blog if user is unauthenticated', async () => {
      await blogRepository.insert(rawBlogs);
      const blog = await blogRepository.findOne();
      await request(app.getHttpServer())
        .delete('/api/blogs/' + blog.id)
        .expect(401);
    });

    it('should return 404 when id does not exist', () => {
      return request(app.getHttpServer())
        .delete('/api/blogs/1')
        .set('Authorization', authHeader)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Blog does not exist.'
        });
    });
  });
});
