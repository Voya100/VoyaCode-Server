import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { GetBlogsDto } from './blogs.dtos';
import { BlogsService } from './blogs.service';

@Controller('api/blogs')
export class BlogsController {
  constructor(private blogs: BlogsService) {}

  @Get()
  async getBlogs(@Query() { limit }: GetBlogsDto) {
    return await this.blogs.getBlogs({ limit });
  }
}
