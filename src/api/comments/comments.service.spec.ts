import { CommentEntity } from '@api/comments/comments.entity';
import { CommentsService } from '@api/comments/comments.service';
import { Repository } from 'typeorm';

describe('CommentsService', () => {
  let service: CommentsService;
  beforeAll(async () => {
    service = new CommentsService({} as Repository<CommentEntity>);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
