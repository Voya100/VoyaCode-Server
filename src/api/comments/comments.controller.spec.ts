import { CommentEntity } from '@api/comments/comments.entity';
import { CommentsService } from '@api/comments/comments.service';
import { Repository } from 'typeorm';
import { CommentsController } from './comments.controller';

describe('Comments Controller', () => {
  let commentService: CommentsService;
  let commentsController: CommentsController;
  beforeAll(async () => {
    commentService = new CommentsService({} as Repository<CommentEntity>);
    commentsController = new CommentsController(commentService);
  });
  it('should be defined', () => {
    expect(commentsController).toBeDefined();
  });
});
