import { BlogEntity } from '@api/blogs/blog.entity';
import { BlogsService } from '@api/blogs/blogs.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Response } from 'supertest';
import { Repository } from 'typeorm';

import { generateApp } from './helpers/test.utils';

describe('BlogRssController (e2e)', () => {
  let app: INestApplication;
  let blogRepository: Repository<BlogEntity>;
  let blogService: BlogsService;

  beforeAll(async () => {
    app = await generateApp();
    blogRepository = app.get(getRepositoryToken(BlogEntity));
    blogService = app.get(BlogsService);
    await app.init();
  });

  afterEach(async () => {
    await blogRepository.clear();
  });

  const rawBlogs = [
    {
      name: 'Blog1',
      text: 'Blog 1 [b]description[/b]'
    },
    {
      name: 'Blog2',
      text: 'Blog 2 description'
    }
  ];
  const formattedBlogs = [
    {
      name: 'Blog1',
      text: 'Blog 1 <b>description</b>'
    },
    {
      name: 'Blog2',
      text: 'Blog 2 description'
    }
  ];

  it('should return rss xml document', async () => {
    await blogRepository.insert(rawBlogs);
    return request(app.getHttpServer())
      .get('/blogs/rss')
      .expect(200)
      .expect('Content-Type', 'text/xml; charset=utf-8')
      .expect((res: Response) => {
        const xml: string = res.text;
        formattedBlogs.forEach(blog => {
          expect(xml.includes(blog.name)).toBe(true);
          expect(xml.includes(blog.text)).toBe(true);
        });
      });
  });

  it('should fetch xml from cache on repeated request', async () => {
    await blogRepository.insert(rawBlogs);
    let xml: string;
    await request(app.getHttpServer())
      .get('/blogs/rss')
      .expect(200)
      .expect('Content-Type', 'text/xml; charset=utf-8')
      .expect((res: Response) => {
        xml = res.text;
        formattedBlogs.forEach(blog => {
          expect(xml.includes(blog.name)).toBe(true);
          expect(xml.includes(blog.text)).toBe(true);
        });
      });
    const generateBlogRssSpy = jest.spyOn(
      blogService as any,
      'generateBlogRss'
    );
    await request(app.getHttpServer())
      .get('/blogs/rss')
      .expect(200)
      .expect('Content-Type', 'text/xml; charset=utf-8')
      .expect((res: Response) => {
        expect(res.text).toBe(xml);
      });
    expect(generateBlogRssSpy).not.toBeCalled();
  });

  it('should reset cache when new blog has been added', async () => {
    await blogRepository.insert(rawBlogs);
    let xml: string;
    await request(app.getHttpServer())
      .get('/blogs/rss')
      .expect(200)
      .expect('Content-Type', 'text/xml; charset=utf-8')
      .expect((res: Response) => {
        xml = res.text;
        formattedBlogs.forEach(blog => {
          expect(xml.includes(blog.name)).toBe(true);
          expect(xml.includes(blog.text)).toBe(true);
        });
      });
    const generateBlogRssSpy = jest.spyOn(
      blogService as any,
      'generateBlogRss'
    );
    const newBlog = { name: 'new blog', text: 'new text' };
    await blogService.addBlog(newBlog.name, newBlog.text);
    await request(app.getHttpServer())
      .get('/blogs/rss')
      .expect(200)
      .expect('Content-Type', 'text/xml; charset=utf-8')
      .expect((res: Response) => {
        xml = res.text;
        [...formattedBlogs, newBlog].forEach(blog => {
          expect(xml.includes(blog.name)).toBe(true);
          expect(xml.includes(blog.text)).toBe(true);
        });
      });
    expect(generateBlogRssSpy).toBeCalled();
  });
});
