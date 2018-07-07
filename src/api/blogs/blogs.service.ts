import { validateEntity } from '@common/helpers/database-helpers';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogEntity) private readonly blogs: Repository<BlogEntity>
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
    return await this.blogs.save(blog);
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
}
