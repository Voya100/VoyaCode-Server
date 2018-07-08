import { CommentEntity } from '@api/comments/comments.entity';
import { Repository } from 'typeorm';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;
  beforeAll(async () => {
    service = new CommentsService({} as Repository<CommentEntity>);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
