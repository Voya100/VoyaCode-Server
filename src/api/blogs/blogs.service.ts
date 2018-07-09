import { BlogEntity } from '@api/blogs/blog.entity';
import { DataFormatter } from '@common/helpers/data-formatter';
import { validateEntity } from '@common/helpers/database-helpers';
import { CacheService } from '@core/cache.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Rss from 'rss';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogs: Repository<BlogEntity>,
    private readonly cache: CacheService
  ) {}

  async getBlogs({ limit }: { limit?: number }) {
    return await this.blogs.find({
      take: limit,
      order: {
        id: 'DESC'
      }
    });
  }

  async getBlog(id: number) {
    return await this.blogs.findOneOrFail(id);
  }

  async addBlog(name: string, text: string) {
    const blog = new BlogEntity();
    blog.name = name;
    blog.text = text;
    await validateEntity(blog);
    const blogResult = await this.blogs.save(blog);
    // Reset cache so that it will get refreshed on next request
    this.cache.delete('blog-rss');
    return blogResult;
  }

  async editBlog(id: number, name: string, text: string) {
    const blog = await this.blogs.findOneOrFail(id);
    blog.name = name;
    blog.text = text;
    await validateEntity(blog);
    return await this.blogs.save(blog);
  }

  async deleteBlog(id: number) {
    const blog = await this.blogs.findOneOrFail(id);
    return await this.blogs.remove(blog);
  }

  // Returns blogs' rss xml document
  // Result is cached until new blog is added or 24 hours have passed
  async getBlogRss(): Promise<string> {
    const cachedResult = (await this.cache.get('blog-rss')) as string;
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    const rss = await this.generateBlogRss();
    // Cache is reset when new blogs are added, so ttl
    // can be long (24 hours)
    const ttl = 24 * 60 * 60;
    this.cache.set('blog-rss', rss, ttl);
    return rss;
  }

  private async generateBlogRss() {
    const blogs = await this.getBlogs({ limit: 15 });
    const blogFeed = new Rss({
      title: "Voya's blog RSS",
      description: 'RSS feed for all blogs posted on Voya Code.',
      feed_url: 'https://voyacode.com/blogs/rss',
      site_url: 'https://voyacode.com',
      language: 'en',
      ttl: 60
    });
    blogs.forEach(blog => {
      blogFeed.item({
        title: blog.name,
        description: DataFormatter.tagsToHtml(blog.text),
        url: 'https://voyacode.com/blogs/' + blog.id,
        date: blog.date
      });
    });
    return blogFeed.xml({ indent: true });
  }
}
