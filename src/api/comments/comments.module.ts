import { CommentsController } from '@api/comments/comments.controller';
import { CommentEntity } from '@api/comments/comments.entity';
import { CommentsService } from '@api/comments/comments.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
