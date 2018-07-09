import { BlogsRssController } from '@api/blogs/blog-rss/blog-rss.controller';
import { BlogEntity } from '@api/blogs/blog.entity';
import { BlogsController } from '@api/blogs/blogs.controller';
import { BlogsService } from '@api/blogs/blogs.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [BlogsService],
  controllers: [BlogsController, BlogsRssController]
})
export class BlogsModule {}
