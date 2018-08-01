import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { PushModule } from './push/push.module';

@Module({
  imports: [BlogsModule, AuthModule, CommentsModule, PushModule]
})
export class ApiModule {}
