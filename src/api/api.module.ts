import { AuthModule } from '@api/auth/auth.module';
import { BlogsModule } from '@api/blogs/blogs.module';
import { CommentsModule } from '@api/comments/comments.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [BlogsModule, AuthModule, CommentsModule]
})
export class ApiModule {}
