import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsRssController } from './blog-rss.controller';
import { BlogEntity } from './blog.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [BlogsService],
  controllers: [BlogsController, BlogsRssController]
})
export class BlogsModule {}
