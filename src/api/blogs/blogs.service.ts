import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogs: Repository<Blog>
  ) {}

  async getBlogs({ limit }: { limit?: number }) {
    return await this.blogs.find({
      take: limit,
      order: {
        id: 'DESC'
      }
    });
  }
}
