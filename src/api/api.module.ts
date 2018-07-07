import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [BlogsModule, AuthModule, CommentsModule]
})
export class ApiModule {}
