import { BlogsRssController } from '@api/blogs/blog-rss/blog-rss.controller';
import { BlogSubscriptionController } from '@api/blogs/blog-subscription/blog-subscription.controller';
import { BlogSubscriptionService } from '@api/blogs/blog-subscription/blog-subscription.service';
import { BlogEntity } from '@api/blogs/blog.entity';
import { BlogsController } from '@api/blogs/blogs.controller';
import { BlogsService } from '@api/blogs/blogs.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [BlogsService, BlogSubscriptionService],
  controllers: [BlogsController, BlogsRssController, BlogSubscriptionController]
})
export class BlogsModule {}
