import { BlogsService } from '@api/blogs/blogs.service';
import { Controller, Get, Response } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

@Controller('blogs/rss')
export class BlogsRssController {
  constructor(private blogsService: BlogsService) {}

  @Get()
  async getBlogRssFeed(@Response() res: ExpressResponse) {
    const rssFeed = await this.blogsService.getBlogRss();
    res.set('Content-Type', 'text/xml');
    res.send(rssFeed);
  }
}
